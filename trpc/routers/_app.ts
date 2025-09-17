import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"

// Define a type for our Post object for clarity
type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export const appRouter = createTRPCRouter({
  // Keep the existing 'hello' procedure
  hello: baseProcedure.input(z.object({ text: z.string() })).query(opts => ({
    greeting: `hello ${opts.input.text}`,
  })),

  // Add the new 'posts' procedure
  posts: baseProcedure
    .input(
      z.object({
        // Input for our search functionality
        search: z.string().optional(),
        // Input for sorting
        sortBy: z.enum(["title", "id"]).default("id"),
        sortOrder: z.enum(["asc", "desc"]).default("asc"),
      })
    )
    .query(async ({ input }) => {
      // Fetch data from a public API
      const res = await fetch("https://jsonplaceholder.typicode.com/posts")
      let posts: Post[] = await res.json()

      // 1. Filter posts based on the search term (if provided)
      if (input.search) {
        posts = posts.filter(
          post =>
            post.title.toLowerCase().includes(input.search!.toLowerCase()) ||
            post.body.toLowerCase().includes(input.search!.toLowerCase())
        )
      }

      // 2. Sort the posts
      posts.sort((a, b) => {
        const fieldA = a[input.sortBy]
        const fieldB = b[input.sortBy]
        let comparison = 0

        if (fieldA > fieldB) {
          comparison = 1
        } else if (fieldA < fieldB) {
          comparison = -1
        }

        return input.sortOrder === "desc" ? comparison * -1 : comparison
      })

      return posts
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
