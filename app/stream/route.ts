import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getSSEWriter } from "ts-sse"
import { SyncEvents } from "./types"

export const dynamic = "force-dynamic"

export const syncSchema = z.object({
  sync_status: z.enum([
    "begin_stream",
    "error",
    "sync_update",
    "sync_complete",
  ]),
  sync_message: z.string(),
  sync_date: z.string(),
})

export async function GET(request: NextRequest) {
  // ... (authentication and other logic)

  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  const syncStatusStream = async (notifier: SyncEvents) => {
    // Begin the stream
    notifier.update({
      data: {
        sync_status: "begin_stream",
        sync_date: new Date().toISOString(),
        sync_message: "Syncing...",
      },
      event: "update",
    })

    // ... (your logic for fetching data and sending updates)

    // Example: Sending a sync update
    notifier.update({
      data: {
        sync_status: "sync_update",
        sync_date: new Date().toISOString(),
        sync_message: "Syncing...",
      },
      event: "update",
    })

    // ... (more logic, handling errors, completion, etc.)
  }

  // Use the getSSEWriter to initialize the utility with the writer
  syncStatusStream(getSSEWriter(writer, encoder)) // 👈 inject encoder and writer into `getSSEWriter` factory

  // Return the response stream
  return new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  })
}
