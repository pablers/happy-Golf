import { PrismaClient, RoundType, PracticeTime, WeatherCondition, WindCondition } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// This data is based on `constants.ts` from the frontend
const defaultPars = [4, 5, 4, 3, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 5, 4, 3, 4];
const strokeIndexes = [9, 1, 13, 17, 5, 3, 11, 15, 7, 8, 2, 12, 16, 4, 6, 10, 14, 18];

const INITIAL_HOLE_SCORES = defaultPars.map((par, index) => ({
  hole: index + 1,
  par: par,
  strokeIndex: strokeIndexes[index],
}));

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. Clear existing data ---
  // Order is important due to foreign key constraints
  await prisma.holeScore.deleteMany();
  await prisma.round.deleteMany();
  await prisma.hcpRecord.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.golfCourse.deleteMany();
  console.log('Cleared existing data.');

  // --- 2. Create Default User ---
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password123', saltRounds);
  const user = await prisma.user.create({
    data: {
      email: 'pablo@test.com',
      password: passwordHash,
      profile: {
        create: {
          name: 'Pablo Reina',
          trainingObjective: 'recommended',
        },
      },
    },
    include: { profile: true },
  });
  console.log(`Created user with id: ${user.id}`);

  // --- 3. Seed Golf Courses ---
  const coursesPath = path.resolve(__dirname, '../../data/courses.ts');
  const coursesFileContent = fs.readFileSync(coursesPath, 'utf-8');
  const coursesCSV = coursesFileContent.split('`')[1];

  const courseLines = coursesCSV.trim().split('\n').slice(1);
  const courseIdMap = new Map<string, string>();

  for (const line of courseLines) {
    const [name] = line.split(';');
    if (name) {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      courseIdMap.set(name, id);
    }
  }

  const coursePromises = courseLines.map(async (line) => {
    const [name, address, municipality, province, region, phone, email, url, latitude, longitude] = line.split(';');
    if (!name) return;
    const id = courseIdMap.get(name)!;

    return prisma.golfCourse.create({
      data: {
        id,
        name,
        address: address || null,
        municipality: municipality || null,
        province: province || null,
        region: region || null,
        phone: phone || null,
        email: email || null,
        url: url || null,
        latitude: latitude ? latitude.replace(',', '.') : null,
        longitude: longitude ? longitude.replace(',', '.') : null,
      },
    });
  });
  await Promise.all(coursePromises);
  console.log(`Seeded ${courseLines.length} golf courses.`);

  // --- 4. Seed Rounds ---
  const roundsPath = path.resolve(__dirname, '../../data/registro-partidas.csv');
  const roundsFileContent = fs.readFileSync(roundsPath, 'utf-8');
  const roundLines = roundsFileContent.trim().split('\n').slice(1);

  for (const line of roundLines) {
    const values = line.split(';');
    const header = "id;date;userName;userHcp;courseId;roundType;h1_strokes;h1_putts;h1_comment;h1_fairwayHit;h2_strokes;h2_putts;h2_comment;h2_fairwayHit;h3_strokes;h3_putts;h3_comment;h3_fairwayHit;h4_strokes;h4_putts;h4_comment;h4_fairwayHit;h5_strokes;h5_putts;h5_comment;h5_fairwayHit;h6_strokes;h6_putts;h6_comment;h6_fairwayHit;h7_strokes;h7_putts;h7_comment;h7_fairwayHit;h8_strokes;h8_putts;h8_comment;h8_fairwayHit;h9_strokes;h9_putts;h9_comment;h9_fairwayHit;h10_strokes;h10_putts;h10_comment;h10_fairwayHit;h11_strokes;h11_putts;h11_comment;h11_fairwayHit;h12_strokes;h12_putts;h12_comment;h12_fairwayHit;h13_strokes;h13_putts;h13_comment;h13_fairwayHit;h14_strokes;h14_putts;h14_comment;h14_fairwayHit;h15_strokes;h15_putts;h15_comment;h15_fairwayHit;h16_strokes;h16_putts;h16_comment;h16_fairwayHit;h17_strokes;h17_putts;h17_comment;h17_fairwayHit;h18_strokes;h18_putts;h18_comment;h18_fairwayHit;practice_time;initial_weather;initial_wind;weather_h7_confirm;weather_h7_new;wind_h7_change;weather_h15_confirm;weather_h15_new;wind_h15_change;turf_condition;green_speed;physical_state;mental_state".split(';');
    const rowData: { [key: string]: string } = {};
    header.forEach((key, index) => {
        rowData[key] = values[index]?.trim() || '';
    });

    const practiceTimeMap: { [key: string]: PracticeTime } = {
        '5min': PracticeTime.MIN_5,
        '5-15min': PracticeTime.MIN_5_15,
        '15+min': PracticeTime.MIN_15_PLUS,
        'none': PracticeTime.NONE,
    };

    const roundTypeMap: { [key: string]: RoundType } = {
        'front': RoundType.FRONT,
        'back': RoundType.BACK,
        'full': RoundType.FULL,
    };

    const weatherMap: { [key: string]: WeatherCondition } = {
        'sunny': WeatherCondition.SUNNY,
        'cloudy': WeatherCondition.CLOUDY,
        'rainy': WeatherCondition.RAINY,
        'variable': WeatherCondition.VARIABLE,
    };

    const windMap: { [key: string]: WindCondition } = {
        'none': WindCondition.NONE,
        'light': WindCondition.LIGHT,
        'moderate': WindCondition.MODERATE,
        'strong': WindCondition.STRONG,
    };

    await prisma.round.create({
      data: {
        date: new Date(rowData.date),
        roundType: roundTypeMap[rowData.roundType] || RoundType.FULL,
        practiceTime: practiceTimeMap[rowData.practice_time] || PracticeTime.NONE,
        weather: weatherMap[rowData.initial_weather] || WeatherCondition.SUNNY,
        wind: windMap[rowData.initial_wind] || WindCondition.NONE,
        userId: user.id,
        courseId: rowData.courseId,
        answers: {
            practice_time: rowData.practice_time,
            initial_weather: rowData.initial_weather,
            initial_wind: rowData.initial_wind,
            weather_h7_confirm: rowData.weather_h7_confirm,
            weather_h7_new: rowData.weather_h7_new,
            wind_h7_change: rowData.wind_h7_change,
            weather_h15_confirm: rowData.weather_h15_confirm,
            weather_h15_new: rowData.weather_h15_new,
            wind_h15_change: rowData.wind_h15_change,
            turf_condition: rowData.turf_condition,
            green_speed: rowData.green_speed,
            physical_state: rowData.physical_state,
            mental_state: rowData.mental_state,
        },
        scores: {
          create: INITIAL_HOLE_SCORES.map((hole, index) => {
            const h = index + 1;
            return {
                hole: hole.hole,
                par: hole.par,
                strokeIndex: hole.strokeIndex,
                strokes: rowData[`h${h}_strokes`] ? parseInt(rowData[`h${h}_strokes`], 10) : null,
                putts: rowData[`h${h}_putts`] ? parseInt(rowData[`h${h}_putts`], 10) : null,
                comment: rowData[`h${h}_comment`] || null,
                fairwayHit: rowData[`h${h}_fairwayHit`] === 'true' ? true : rowData[`h${h}_fairwayHit`] === 'false' ? false : null,
            };
          }),
        },
      },
    });

    if (user.profile) {
        await prisma.hcpRecord.create({
            data: {
                date: new Date(rowData.date),
                hcp: parseFloat(rowData.userHcp),
                profileId: user.profile.id,
            }
        });
    }
  }
  console.log(`Seeded ${roundLines.length} rounds and HcpRecords.`);

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