import { type EventNotifier } from "ts-sse"
import { syncSchema } from "./route"
import { z } from "zod"

export type SyncEvents = EventNotifier<{
  update: {
    data: z.infer<typeof syncSchema>
    event: "update"
  }
  complete: {
    data: z.infer<typeof syncSchema>
    event: "update"
  }
  close: {
    data: never
  }
  error: {
    data: never
  }
}>
