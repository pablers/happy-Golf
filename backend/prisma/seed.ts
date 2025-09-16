import { PrismaClient, RoundType, Weather, Wind, TurfCondition, GreenSpeed, PhysicalState, MentalState, PracticeTime } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// --- Mappers from CSV string to Prisma Enum ---

function toRoundType(s: string): RoundType {
    if (s === 'full') return RoundType.FULL;
    // Add other mappings if necessary
    return RoundType.PRACTICE;
}

function toWeather(s: string): Weather {
    const map: { [key: string]: Weather } = {
        'cloudy': Weather.CLOUDY,
        'sunny': Weather.SUNNY,
        'variable': Weather.VARIABLE,
        'rainy': Weather.RAINY,
    };
    return map[s] || Weather.VARIABLE;
}

function toWind(s: string): Wind {
    const map: { [key: string]: Wind } = {
        'light': Wind.LIGHT,
        'none': Wind.NONE,
        'moderate': Wind.MODERATE,
        'strong': Wind.STRONG,
        'higher': Wind.HIGHER,
    };
    return map[s] || Wind.NONE;
}

function toTurfCondition(s: string): TurfCondition {
    const map: { [key: string]: TurfCondition } = {
        'correct': TurfCondition.CORRECT,
        'longish': TurfCondition.LONGISH,
        'long': TurfCondition.LONG,
    };
    return map[s] || TurfCondition.CORRECT;
}

function toGreenSpeed(s: string): GreenSpeed {
    const map: { [key: string]: GreenSpeed } = {
        'medium': GreenSpeed.MEDIUM,
        'fast': GreenSpeed.FAST,
        'slow': GreenSpeed.SLOW,
    };
    return map[s] || GreenSpeed.MEDIUM;
}

function toPhysicalState(s: string): PhysicalState {
    const map: { [key: string]: PhysicalState } = {
        'good': PhysicalState.GOOD,
        'bit_tired': PhysicalState.BIT_TIRED,
        'tired': PhysicalState.TIRED,
        'discomfort': PhysicalState.DISCOMFORT,
    };
    return map[s] || PhysicalState.GOOD;
}

function toMentalState(s: string): MentalState {
    const map: { [key: string]: MentalState } = {
        'neutral': MentalState.NEUTRAL,
        'focused': MentalState.FOCUSED,
        'distracted': MentalState.DISTRACTED,
        'frustrated': MentalState.FRUSTRATED,
    };
    return map[s] || MentalState.NEUTRAL;
}

function toPracticeTime(s: string): PracticeTime {
    const map: { [key: string]: PracticeTime } = {
        '5min': PracticeTime.MIN_5,
        '15+min': PracticeTime.MIN_15_PLUS,
        'none': PracticeTime.NONE,
        '5-15min': PracticeTime.MIN_5_15
    };
    return map[s] || PracticeTime.NONE;
}


async function main() {
    console.log('Start seeding...');

    // 1. Create a default user
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds);
    const user = await prisma.user.upsert({
        where: { email: 'pablo@test.com' },
        update: {},
        create: {
            email: 'pablo@test.com',
            passwordHash,
            name: 'Pablo Reina',
            favoriteCourseIds: [],
            trainingObjective: 'recommended',
            hcpHistory: {
                create: [{ date: new Date(), hcp: 18.0 }],
            },
        },
    });
    console.log(`Created user '${user.name}' with id ${user.id}`);

    // 2. Read and parse the CSV file
    const csvPath = path.join(__dirname, '../../data/registro-partidas.csv');
    const csvFile = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(csvFile, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
    });

    // 3. Iterate and create rounds
    for (const row of parsed.data as any[]) {
        const roundData = {
            id: row.id,
            date: new Date(row.date),
            userHcp: parseFloat(row.userHcp),
            courseId: row.courseId,
            roundType: toRoundType(row.roundType),
            practiceTime: toPracticeTime(row.practice_time),
            initialWeather: toWeather(row.initial_weather),
            initialWind: toWind(row.initial_wind),
            turfCondition: toTurfCondition(row.turf_condition),
            greenSpeed: toGreenSpeed(row.green_speed),
            physicalState: toPhysicalState(row.physical_state),
            mentalState: toMentalState(row.mental_state),
        };

        const holesData = [];
        for (let i = 1; i <= 18; i++) {
            const strokes = parseInt(row[`h${i}_strokes`], 10);
            const putts = parseInt(row[`h${i}_putts`], 10);
            if (!isNaN(strokes) && !isNaN(putts)) {
                holesData.push({
                    holeNumber: i,
                    strokes: strokes,
                    putts: putts,
                    comment: row[`h${i}_comment`] || null,
                    fairwayHit: row[`h${i}_fairwayHit`] === 'true',
                });
            }
        }

        await prisma.round.create({
            data: {
                ...roundData,
                userId: user.id,
                holes: {
                    create: holesData,
                },
            },
        });
        console.log(`Created round ${row.id}`);
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
