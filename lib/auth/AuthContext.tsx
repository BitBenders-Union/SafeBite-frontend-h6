// /lib/auth/AuthContext.tsx

import { clearKeepSignedIn, getKeepSignedIn, saveKeepSignedIn } from "@/lib/auth/rememberMe";
import {
    clearTokens,
    getAccessToken,
    saveTokens,
} from "@/lib/auth/tokenStorage";
import { UserInfo } from "@/lib/types/user";
import { getUserInfo, login, signUp as signUpApi } from "@/services/api/authApi";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SignupRequest } from "../types/auth";

type LoginData = {
    email: string;
    password: string;
    keepSignedIn: boolean;
};


type AuthContextType = {
    user: UserInfo | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    signIn: (loginData: LoginData) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (signupData: SignupRequest) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthState({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        restoreSession(signal);
        return () => {
            controller.abort();
        };
    }, []);

    async function restoreSession(signal: AbortSignal) {
        const keepSignedIn = await getKeepSignedIn();

        if (!keepSignedIn) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {

                setUser(null);
                return;
            }

            const userInfo = await getUserInfo(signal);
            setUser(userInfo);


        } catch (error) {
            if ( axios.isCancel(error) ) return;

            await clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function signIn(loginData: LoginData) {
        try {
            setIsLoading(true);

            await saveKeepSignedIn(loginData.keepSignedIn);

            const loginResponse = await login({
                email: loginData.email,
                password: loginData.password,
            });

            await saveTokens(
                loginResponse.accessToken,
                loginResponse.refreshToken
            );

            const userInfo = await getUserInfo();
            
            setUser(userInfo);

        } catch (error) {
            console.error("Login error:", error instanceof Error ? error.message : error);
        } finally {
            setIsLoading(false);
        }
    }

    async function signOut() {
        await clearTokens();
        await clearKeepSignedIn();
        setUser(null);
    }

    async function signUp(signupData: SignupRequest) {
        try {
            setIsLoading(true);
            await signUpApi(signupData);
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                isLoading,
                signIn,
                signOut,
                signUp,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthState");
    }

    return context;
}