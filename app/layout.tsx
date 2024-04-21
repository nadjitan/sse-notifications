import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { lucia, validateRequest } from "~/lib/lucia"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SSE Notifications",
  description: "Sample project for notifications using SSE",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = await validateRequest()

  async function logout() {
    "use server"
    const { session } = await validateRequest()

    if (!session) return { error: "Unauthorized" }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
    await lucia.deleteExpiredSessions()

    redirect("/login")
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center p-24">
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              Sample SSE Notifications
            </p>

            {user && (
              <div className="flex items-center gap-2">
                <h2 className="px-2 py-1.5 text-lg">{user.name}</h2>
                <form action={logout}>
                  <button
                    type="submit"
                    className="border border-gray-400 px-2 py-1.5 w-fit rounded-md bg-black">
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="relative my-auto flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
