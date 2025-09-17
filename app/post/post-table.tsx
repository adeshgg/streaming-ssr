"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useEffect, useState, useTransition } from "react"
import { useTRPC } from "@/trpc/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

// Define sort state shape
type SortState = {
  sortBy: "title" | "id"
  sortOrder: "asc" | "desc"
}

export function PostsTable() {
  const trpc = useTRPC()

  // State for search and sort
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sort, setSort] = useState<SortState>({
    sortBy: "id",
    sortOrder: "asc",
  })

  // The star of the show: useTransition
  const [isPending, startTransition] = useTransition()

  // Debounce the search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      // Wrap the state update that triggers the query in startTransition
      startTransition(() => {
        setDebouncedSearch(search)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  // Fetch data using our tRPC procedure and useSuspenseQuery
  const { data: posts } = useSuspenseQuery(
    trpc.posts.queryOptions({
      search: debouncedSearch,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    })
  )

  // Handler for changing the sort order
  const handleSort = (column: SortState["sortBy"]) => {
    startTransition(() => {
      setSort(currentSort => ({
        sortBy: column,
        sortOrder:
          currentSort.sortBy === column && currentSort.sortOrder === "asc"
            ? "desc"
            : "asc",
      }))
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter posts by title or body..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        {/* Use the `isPending` flag to apply a visual effect during transitions */}
        <Table className={isPending ? "opacity-70 animate-pulse" : ""}>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("id")}>
                  ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("title")}>
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Body</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.length ? (
              posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell className="line-clamp-2">{post.body}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
