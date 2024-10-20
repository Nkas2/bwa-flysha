/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Metadata } from "next";
import React, { FC } from "react";
import FormSignIn from "./form";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface SignInPageProps {}

export const metadata: Metadata = {
    title: "Dashboard | Sign In",
};

const SignInPage: FC<SignInPageProps> = async ({}) => {
    const { session, user } = await getUser();
    if (session && user.role === "ADMIN") {
        redirect("/dashboard");
    }
    return <FormSignIn />;
};

export default SignInPage;
