import { z } from "zod"


const UserformSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }).max(50, {
    message: "Name must be at most 50 Characters"
  }),
})