import { PrismaClient, RoundType, PracticeTime, WeatherCondition, WindCondition } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding...`);

  // 1. Crear usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: 'password123', // En producción usar bcrypt
      profile: {
        create: {
          name: 'Test User',
          trainingObjective: 'Improve putting and iron consistency',
        },
      },
    },
    include: { profile: true },
  });

  console.log(`Created user: ${user.email}`);

  // 2. Cargar campos de golf desde CSV
  const coursesPath = path.join(__dirname, 'golf_courses_spain.csv');
  const coursesContent = fs.readFileSync(coursesPath, 'utf-8');
  const lines = coursesContent.split('\n').slice(1); // Omitir cabecera

  for (const line of lines) {
    if (!line.trim()) continue;
    const [name, address, municipality, province, region, phone, email, url, latitude, longitude] = line.split(',');
    
    await prisma.golfCourse.create({
      data: {
        name: name.trim(),
        address: address?.trim() || null,
        municipality: municipality?.trim() || null,
        province: province?.trim() || null,
        region: region?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        url: url?.trim() || null,
        latitude: latitude?.trim() || null,
        longitude: longitude?.trim() || null,
      },
    });
  }
  console.log(`Seeded ${lines.length} golf courses.`);

  // 3. Cargar rondas históricas (opcional, si hay archivo)
  const roundsPath = path.join(__dirname, 'historical_rounds.csv');
  if (fs.existsSync(roundsPath)) {
    const roundsContent = fs.readFileSync(roundsPath, 'utf-8');
    const roundLines = roundsContent.split('\n').slice(1);

    const INITIAL_HOLE_SCORES = Array.from({ length: 18 }, (_, i) => ({
        hole: i + 1,
        par: 4,
        strokeIndex: i + 1,
    }));

    for (const line of roundLines) {
      if (!line.trim()) continue;
      // Mapeo simple para el ejemplo, ajustar según estructura real del CSV
      const parts = line.split(',');
      const rowData: any = {};
      const headers = ['date', 'courseName', 'userHcp', 'roundType', 'practiceTime', 'weather', 'wind', 'turf_condition', 'green_speed', 'physical_state', 'mental_state'];
      // ... headers for holes ...
      
      const course = await prisma.golfCourse.findFirst({ where: { name: parts[1].trim() } });
      if (!course) continue;

      await prisma.round.create({
        data: {
          date: new Date(parts[0]),
          userId: user.id,
          courseId: course.id,
          roundType: RoundType.FULL,
          practiceTime: PracticeTime.MIN_15_PLUS,
          weather: WeatherCondition.SUNNY,
          wind: WindCondition.LIGHT,
          answers: {
              turf_condition: parts[7],
              green_speed: parts[8],
              physical_state: parts[9],
              mental_state: parts[10],
          },
          scores: {
            create: INITIAL_HOLE_SCORES.map((hole, index) => ({
                hole: hole.hole,
                par: hole.par,
                strokeIndex: hole.strokeIndex,
                strokes: null,
                putts: null,
                comment: null,
                fairwayHit: null,
            })),
          },
        },
      });
    }
    console.log(`Seeded ${roundLines.length} historical rounds.`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
