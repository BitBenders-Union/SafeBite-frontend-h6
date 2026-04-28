// /lib/types/user.ts

export type UserInfo = {
    email: string;
    isEmailConfirmed: boolean;
    userID: string;
    roles: string[];
};

export type UserRole = {
    userID: string;
    roleName: string;
}

export type Roles = {
    roleId: string;
    roleName: string;
}

export type UserList = {
    email: string;
    id: string;
    isActive: boolean;
    roles: Roles[];
}

