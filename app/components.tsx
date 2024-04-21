"use client"

import { useEffect, useState } from "react"
import { AppNotification } from "~/db/schema"
import { SyncEvents } from "./stream/types"

export function NotifList() {
  const [syncStatus, setSyncStatus] =
    useState<SyncEvents["update"]["data"]>("begin_stream")

  const [notifications, setNotifications] = useState<AppNotification[]>([])

  useEffect(() => {
    const eventSource = new EventSource("/stream")
    eventSource.onmessage = event => {
      const data = JSON.parse(event.data) as SyncEvents["update"]["data"]
      setSyncStatus(data.sync_status)
    }
    return () => {
      eventSource.close()
    }
  }, [])

  if (notifications.length === 0) {
    return <p>No notifications...</p>
  }

  return (
    <ul className="flex flex-col">
      {notifications.map((notif, i) => (
        <li key={i}>{notif.type}</li>
      ))}
    </ul>
  )
}
