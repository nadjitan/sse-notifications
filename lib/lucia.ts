import { Lucia, type User as LuciaUser, type Session } from "lucia"
import { cookies } from "next/headers"
import { cache } from "react"
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"

import { db } from "~/db/drizzle"
import { sessionTable, userTable, User } from "~/db/schema"

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "user_session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  // sessionExpiresIn: new TimeSpan(4, "w"),
  getUserAttributes: attributes => ({
    name: attributes.name,
  }),
})

export const uncachedValidateRequest = async (): Promise<
  { user: LuciaUser; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) return { user: null, session: null }

  const result = await lucia.validateSession(sessionId)
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
  } catch {}
  return result
}

export const validateRequest = cache(uncachedValidateRequest)

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: User
  }
}
