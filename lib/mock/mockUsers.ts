// /lib/mock/mockUsers.ts

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
};

export const mockUsers: User[] = [
    {
        id: 1,
        name: "Alice Johnson",
        email: "AJohnson@gmail.com",
        password: "password",
        role: "user",
    },
    {
        id: 2,
        name: "John Smith",
        email: "JSmith@gmail.com",
        password: "password",
        role: "admin",
    },
];