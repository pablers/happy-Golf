import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'csv-parse';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Reads the Prisma schema on disk and returns the list of field names for the
 * requested model so we only send columns that currently exist in Supabase.
 */
const schemaFieldCache = new Map<string, Set<string>>();

function getModelFieldSet(modelName: string): Set<string> {
  if (schemaFieldCache.has(modelName)) {
    return schemaFieldCache.get(modelName)!;
  }

  const schemaPath = resolve(__dirname, 'schema.prisma');
  const schemaContent = readFileSync(schemaPath, 'utf-8');
  const lines = schemaContent.split(/\r?\n/);

  const fieldNames = new Set<string>();
  let insideModel = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!insideModel) {
      if (trimmed.startsWith(`model ${modelName} `) || trimmed === `model ${modelName}` || trimmed === `model ${modelName} {`) {
        insideModel = true;
      }
      continue;
    }

    if (trimmed.startsWith('}')) {
      break;
    }

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) {
      continue;
    }

    const fieldName = trimmed.split(/\s+/)[0];
    if (fieldName) {
      fieldNames.add(fieldName);
    }
  }

  schemaFieldCache.set(modelName, fieldNames);
  return fieldNames;
}

/**
 * Creates the guest account if it does not exist, making sure optional fields
 * such as `hcp` or `trainingObjective` are only sent when the columns are
 * present in the database.
 */
async function ensureGuestUser(): Promise<{ id: string }> {
  const guestEmail = 'invitado@happygolf.com';
  const existing = await prisma.user.findUnique({ where: { email: guestEmail } });

  if (existing) {
    console.log(`Found guest user: ${existing.email}`);
    return { id: existing.id };
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password', saltRounds);

  const userFields = getModelFieldSet('User');
  const userData: Record<string, unknown> = {
    email: guestEmail,
    name: 'Invitado',
    passwordHash,
  };

  if (userFields.has('hcp')) {
    userData.hcp = 18.0;
  }

  if (userFields.has('trainingObjective')) {
    userData.trainingObjective = 'Sin definir';
  }

  const created = await prisma.user.create({ data: userData as any });
  console.log(`Created guest user: ${created.email}`);
  return { id: created.id };
}

/**
 * Loads every round from the CSV export, creates the round entry and later its
 * hole scores while gracefully skipping tables that might not exist yet.
 */
async function seedRounds(guestUserId: string): Promise<void> {
  const csvFilePath = resolve(__dirname, '../../data/registro-partidas.csv');
  const fileContent = readFileSync(csvFilePath, { encoding: 'utf-8' });

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
    'turf_condition', 'green_speed', 'physical_state', 'mental_state',
  ];

  const parser = parse(fileContent, {
    delimiter: ';',
    columns: headers,
    from_line: 2, // Omitimos la cabecera original del CSV.
  });

  const roundFields = getModelFieldSet('Round');
  // Prisma genera el delegado de la relación siguiendo lowerCamelCase; si el modelo no existe lo omitimos más adelante.
  const holeScoreDelegate = (prisma as Record<string, any>).holeScore;

  if (!holeScoreDelegate?.createMany) {
    console.warn('No se encontró un delegado válido para los scores por hoyo; se omitirá su carga.');
  }

  for await (const row of parser as AsyncIterable<Record<string, string>>) {
    const holeScores = [] as Array<{ hole: number; strokes: number; putts: number; fairwayHit: boolean | null; comment: string | null }>;
    for (let i = 1; i <= 18; i++) {
      const strokes = row[`h${i}_strokes`] ? Number.parseInt(row[`h${i}_strokes`], 10) : null;
      if (strokes === null || Number.isNaN(strokes)) {
        continue;
      }

      holeScores.push({
        hole: i,
        strokes,
        putts: row[`h${i}_putts`] ? Number.parseInt(row[`h${i}_putts`], 10) : 0,
        fairwayHit:
          row[`h${i}_fairwayHit`] === 'true'
            ? true
            : row[`h${i}_fairwayHit`] === 'false'
              ? false
              : null,
        comment: row[`h${i}_comment`] || null,
      });
    }

    if (holeScores.length === 0) {
      continue;
    }

    const parsedHcp = row.userHcp ? Number.parseFloat(row.userHcp) : undefined;
    const fallbackHcp = Number.isFinite(parsedHcp) ? (parsedHcp as number) : 18.0;

    const roundData: Record<string, unknown> = {
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
        connect: { id: guestUserId },
      },
    };

    if (row.id) {
      roundData.id = String(row.id);
    }

    if (roundFields.has('userHcp')) {
      roundData.userHcp = fallbackHcp;
    }

    const round = await prisma.round.create({ data: roundData as any });

    if (holeScoreDelegate?.createMany) {
      await holeScoreDelegate.createMany({
        data: holeScores.map((score) => ({
          id: randomUUID(),
          ...score,
          roundId: round.id,
        })),
      });
    }

    console.log(`Created round for course ${row.courseId} on ${row.date}`);
  }
}

async function main() {
  console.log('Start seeding...');
  const guestUser = await ensureGuestUser();
  await seedRounds(guestUser.id);
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
