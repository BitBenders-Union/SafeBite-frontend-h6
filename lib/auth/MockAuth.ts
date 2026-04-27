import { mockUsers, type User } from "@/lib/mock/mockUsers";

let currentUser: User | null = null;

export async function signIn(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = mockUsers.find(
        (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
        throw new Error("Invalid credentials");
    }

    currentUser = foundUser;

    return foundUser;
}

export function getCurrentUser() {
    return currentUser;
}

export function signOut() {
    currentUser = null;
}

export async function signUp(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const emailExists = mockUsers.some((user) => user.email === userData.email);

    if (emailExists) {
        throw new Error("Email already exists");
    }

    return;
}