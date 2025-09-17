"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useState, useTransition, type FormEvent } from "react"
import { useTRPC } from "@/trpc/client"

export function ClientGreeting() {
  const trpc = useTRPC()

  const [name, setName] = useState("world")
  const [submittedName, setSubmittedName] = useState("world")

  const [isPending, startTransition] = useTransition()

  const { data } = useSuspenseQuery(
    trpc.hello.queryOptions({ text: submittedName })
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(() => {
      setSubmittedName(name)
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-2xl" style={{ opacity: isPending ? 0.7 : 1 }}>
        {data.greeting}
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="rounded border border-gray-300 p-2 text-black"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  )
}
