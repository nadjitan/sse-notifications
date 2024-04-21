import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "~/db/drizzle"
import { lucia } from "~/lib/lucia"

export default async function Login() {
  async function login(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const pass = formData.get("password") as string

    const existingUser = await db.query.userTable.findFirst({
      where: (u, { eq, and }) => and(eq(u.name, name), eq(u.password, pass)),
    })

    if (!existingUser) return { formErrors: ["User not found"] }

    const session = await lucia.createSession(existingUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    redirect("/")
  }

  return (
    <form className="z-10 flex flex-col gap-2" action={login}>
      <input
        className="px-2 py-1.5 rounded border border-gray-400 bg-black"
        type="text"
        name="name"
        id="name"
        placeholder="name"
      />
      <input
        className="px-2 py-1.5 rounded border border-gray-400 bg-black"
        type="password"
        name="password"
        id="password"
        placeholder="password"
      />
      <button
        type="submit"
        className="mt-2 border border-gray-400 px-2 py-1.5 w-fit rounded-md bg-black self-center">
        Login
      </button>
    </form>
  )
}
