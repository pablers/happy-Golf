import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
const { parse } = require('csv-parse');
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create or find the guest user
  const guestEmail = 'invitado@happygolf.com';
  let guestUser = await prisma.user.findUnique({
    where: { email: guestEmail },
  });

  if (!guestUser) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password', saltRounds);

    // Preparamos el payload cumpliendo con el tipo generado por Prisma.
    const userData: Prisma.UserCreateInput = {
      email: guestEmail,
      name: 'Invitado',
      passwordHash,
    };

    // Solo añadimos el HCP si la columna existe en el modelo actual.
    const userModel = Prisma.dmmf.datamodel.models.find((model) => model.name === 'User');
    if (userModel?.fields.some((field) => field.name === 'hcp')) {
      (userData as Prisma.UserCreateInput & { hcp: number }).hcp = 18.0;
    }

    guestUser = await prisma.user.create({
      data: userData,
    });
    console.log(`Created guest user: ${guestUser.email}`);
  } else {
    console.log(`Found guest user: ${guestUser.email}`);
  }

  // 2. Read and parse the CSV file
  const csvFilePath = path.resolve(__dirname, '../../data/registro-partidas.csv');
  const headers = [
    'id', 'date', 'userName', 'userHcp', 'courseId', 'roundType',
    'h1_strokes', 'h1_putts', 'h1_comment', 'h1_fairwayHit',
    'h2_strokes', 'h2_putts', 'h2_comment', 'h2_fairwayHit',
    'h3_strokes', 'h3_putts', 'h3_comment', 'h3_fairwayHit',
    'h4_strokes', 'h4_putts', 'h4_comment', 'h4_fairwayHit',
    'h5_strokes', 'h5_putts', 'h5_comment', 'h5_fairwayHit',
    'h6_strokes', 'h6_putts', 'h6_comment', 'h6_fairwayHit',
    'h7_strokes', 'h7_putts', 'h7_comment', 'h7_fairwayHit',
    'h8_strokes', 'h8_putts', 'h8_comment', 'h8_fairwayHit',
    'h9_strokes', 'h9_putts', 'h9_comment', 'h9_fairwayHit',
    'h10_strokes', 'h10_putts', 'h10_comment', 'h10_fairwayHit',
    'h11_strokes', 'h11_putts', 'h11_comment', 'h11_fairwayHit',
    'h12_strokes', 'h12_putts', 'h12_comment', 'h12_fairwayHit',
    'h13_strokes', 'h13_putts', 'h13_comment', 'h13_fairwayHit',
    'h14_strokes', 'h14_putts', 'h14_comment', 'h14_fairwayHit',
    'h15_strokes', 'h15_putts', 'h15_comment', 'h15_fairwayHit',
    'h16_strokes', 'h16_putts', 'h16_comment', 'h16_fairwayHit',
    'h17_strokes', 'h17_putts', 'h17_comment', 'h17_fairwayHit',
    'h18_strokes', 'h18_putts', 'h18_comment', 'h18_fairwayHit',
    'practice_time', 'initial_weather', 'initial_wind',
    'weather_h7_confirm', 'weather_h7_new', 'wind_h7_change',
    'weather_h15_confirm', 'weather_h15_new', 'wind_h15_change',
    'turf_condition', 'green_speed', 'physical_state', 'mental_state'
  ];

  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  const parser = parse(fileContent, {
    delimiter: ';',
    columns: headers,
    from_line: 2, // Skip header row
  });

  for await (const row of parser) {
    const holeScores = [];
    for (let i = 1; i <= 18; i++) {
      const strokes = row[`h${i}_strokes`] ? parseInt(row[`h${i}_strokes`], 10) : null;
      if (strokes !== null) {
        holeScores.push({
          hole: i,
          strokes: strokes,
          putts: row[`h${i}_putts`] ? parseInt(row[`h${i}_putts`], 10) : 0,
          fairwayHit: row[`h${i}_fairwayHit`] === 'true' ? true : row[`h${i}_fairwayHit`] === 'false' ? false : null,
          comment: row[`h${i}_comment`] || null,
        });
      }
    }

    if (holeScores.length === 0) continue;

    // Persist the round metadata first so that we have an id to link the hole scores to.
    // Generamos la ronda cuidando los campos obligatorios según el esquema disponible.
    const roundData: Prisma.RoundCreateInput = {
      id: row.id || randomUUID(),
      date: new Date(row.date),
      courseId: row.courseId,
      roundType: row.roundType,
      practiceTime: row.practice_time || null,
      initialWeather: row.initial_weather || null,
      initialWind: row.initial_wind || null,
      turfCondition: row.turf_condition || null,
      greenSpeed: row.green_speed || null,
      physicalState: row.physical_state || null,
      mentalState: row.mental_state || null,
      user: {
        connect: { id: guestUser.id },
      },
    };

    const roundModel = Prisma.dmmf.datamodel.models.find((model) => model.name === 'Round');
    if (roundModel?.fields.some((field) => field.name === 'userHcp')) {
      const parsedHcp = row.userHcp ? Number.parseFloat(row.userHcp) : undefined;
      const userHcp = typeof parsedHcp === 'number' && Number.isFinite(parsedHcp) ? parsedHcp : 18.0;
      (roundData as Prisma.RoundCreateInput & { userHcp: number }).userHcp = userHcp;
    }

    const round = await prisma.round.create({
      data: roundData,
    });

    // Store the individual hole scores in bulk for the newly created round.
    const holeScoreModel = Prisma.dmmf.datamodel.models.find((model) =>
      model.name.toLowerCase().includes('holescore'),
    );

    if (!holeScoreModel) {
      console.warn('No se encontró un modelo para anotar hoyos; se omiten los scores.');
      continue;
    }

    const holeScoreDelegateName = holeScoreModel.name[0].toLowerCase() + holeScoreModel.name.slice(1);
    const holeScoreDelegate = (prisma as Record<string, any>)[holeScoreDelegateName];

    if (!holeScoreDelegate?.createMany) {
      console.warn(`El delegado ${holeScoreDelegateName} no soporta createMany; se omiten los scores.`);
      continue;
    }

    await holeScoreDelegate.createMany({
      data: holeScores.map((score) => ({
        id: randomUUID(),
        ...score,
        roundId: round.id,
      })),
    });
    console.log(`Created round for course ${row.courseId} on ${row.date}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
