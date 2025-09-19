import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient, trpc } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { PostsTable } from "./post-table"
import { Navbar } from "./navbar"
import { PostsTableSkeleton } from "./post-table-skeleton"

export default async function Home() {
  const queryClient = getQueryClient()

  // Prefetch the initial, unsorted, and unfiltered list of posts
  void queryClient.prefetchQuery(
    trpc.posts.queryOptions({
      search: "",
      sortBy: "id",
      sortOrder: "asc",
    })
  )

  return (
    <main>
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<div>Error occurred</div>}>
          <Suspense fallback={<PostsTableSkeleton />}>
            <PostsTable />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </main>
  )
}
