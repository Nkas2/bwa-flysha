import { z } from "zod";

export const formSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Email not valid" }),
    password: z.string({ required_error: "Password is required" }).min(6),
});
