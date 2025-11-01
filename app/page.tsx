import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient, trpc } from "@/trpc/server"
import { ClientGreeting } from "./client-greeting"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: "world" }))
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col gap-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<div>Error occurred</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientGreeting />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
      <Link href="/post">
        <Button className="cursor-pointer">Go to Post Page</Button>
      </Link>
    </div>
  )
}
