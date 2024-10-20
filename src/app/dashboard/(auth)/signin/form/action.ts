"use server";

import { redirect } from "next/navigation";
import { formSchema } from "./validation";
import prisma from "@/../lib/prisma";
import bcrypt from "bcrypt";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export interface ActionResult {
    errorTitle: string | null;
    errorDesc: string[] | null;
}

export async function handleSigin(
    prevState: unknown,
    formData: FormData
): Promise<ActionResult> {
    console.log(formData);

    const values = formSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!values.success) {
        const errorDesc = values.error.issues.map((issue) => issue.message);

        return {
            errorTitle: "Validation error",
            errorDesc,
        };
    }

    const existing = await prisma.user.findFirst({
        where: {
            email: values.data.email,
        },
    });

    if (!existing) {
        return {
            errorTitle: "Error",
            errorDesc: ["User not found"],
        };
    }

    const validPassword = await bcrypt.compare(
        values.data.password,
        existing.password
    );

    if (!validPassword) {
        return {
            errorTitle: "Error",
            errorDesc: ["Wrong email or password"],
        };
    }

    const session = await lucia.createSession(existing.id, {});

    const sessionCookie = await lucia.createSessionCookie(session.id);

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );

    return redirect("/dashboard");
}
