import { faker } from "@faker-js/faker";
import { PrismaClient } from "generated/prisma";
import { randomCar } from "src/utils/randomCar";

const db = new PrismaClient()

async function main() {
    const users = Array.from({ length: 20000 }).map(() => ({
        gamertag: faker.person.firstName(),
        car: randomCar(),
        level: faker.number.int({ min: 1, max: 500 }),
        score: faker.number.int({ min: 0, max: 1000000 })
    }))
    try {
        await db.users.createMany({ data: users });
        console.log('20000 usuários criados com sucesso.')
    } catch (error) {
        console.error(error)
    }
    await db.$disconnect()
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })