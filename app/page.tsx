import { validateRequest } from "~/lib/lucia"
import { redirect } from "next/navigation"
import { db } from "~/db/drizzle"
import { appNotificationTable, appNotificationToUserTable } from "~/db/schema"
import { NotifList } from "./components"

async function createNotif() {
  "use server"
  const { user } = await validateRequest()

  const notif = await db
    .insert(appNotificationTable)
    .values({
      fromUser: user!.id,
      type: "success",
      resource_id: "some-obj-id",
    })
    .returning({ idGenerated: appNotificationTable.id })

  await db.insert(appNotificationToUserTable).values([
    {
      appNotificationId: notif[0].idGenerated,
      userId: user!.id,
    },
    {
      appNotificationId: notif[0].idGenerated,
      // Tester 2's id
      userId: "pck0duhziugep0inrqkid63n",
    },
  ])
}

export default async function Home() {
  const { user } = await validateRequest()
  if (!user) redirect("/login")

  return (
    <div className="z-10 flex flex-col gap-4">
      <form action={createNotif} className="self-center">
        <button
          type="submit"
          className="border border-gray-400 px-2 py-1.5 w-fit rounded-md bg-black">
          create
        </button>
      </form>

      <NotifList />
    </div>
  )
}
