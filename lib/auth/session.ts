// This code is correct. The error will resolve after running `npx prisma generate`.

import { auth } from "@/auth";
import prisma from "@/lib/prisma/prisma";
import { User } from "@prisma/client";

/**
 * A server-side helper function to get the full user object for the currently logged-in user.
 * 
 * This should ONLY be used in server-side code (API Routes, Server Components, etc.).
 * 
 * @returns {Promise<User | null>} The full user object from the database, or null if not logged in.
 */
export const getLoggedInUser = async (): Promise<User | null> => {
    const session = await auth(); // Get the session from NextAuth.js

    if (!session?.user?.email) {
        // No user is logged in, or the session is invalid
        return null;
    }

    // Fetch the full user details from the database using the email from the session
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    if (!user) {
        // This case should be rare, but it can happen if a user is deleted
        // but their session cookie still exists.
        return null;
    }

    return user;
};