import { NextResponse, type NextRequest } from "next/server"
import { db } from "~/db/drizzle"
import { validateRequest } from "~/lib/lucia"

export async function GET(request: NextRequest) {
  const { user } = await validateRequest()
  if (!user)
    return NextResponse.json({ messsage: "No user logged in" }, { status: 401 })

  const existingUser = await db.query.userTable.findFirst({
    where: (u, { eq }) => eq(u.id, user.id),
    with: { appNotificationToUser: { with: { appNotification: true } } },
  })

  return NextResponse.json(existingUser?.appNotificationToUser)
}
