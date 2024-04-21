import { getTableName } from "drizzle-orm"
import { db } from "../drizzle"
import { userTable } from "../schema"

async function seed() {
  await db.insert(userTable).values([
    {
      name: "Tester 1",
      password: "123",
    },
    {
      name: "Tester 2",
      password: "321",
    },
  ])

  console.log(`Seeding '${getTableName(userTable)}' table completed.`)
  process.exit()
}

seed()
