import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function PostsTableSkeleton() {
  return (
    <div className="container mx-auto py-10">
      {/* Skeleton for the search input */}
      <div className="flex items-center py-4">
        <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-muted" />
      </div>

      {/* Skeleton for the table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
              </TableHead>
              <TableHead>
                <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
              </TableHead>
              <TableHead>
                <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Create 10 skeleton rows to represent loading data */}
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-5 w-10 animate-pulse rounded-md bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
