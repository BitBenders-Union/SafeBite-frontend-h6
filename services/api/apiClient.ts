// /services/apiServices/apiClient.ts

import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    saveTokens,
} from "@/lib/auth/tokenStorage";
import axios from "axios";

export const apiBaseUrl = "https://dev.chimpchonkserver.duckdns.org";
// export const apiBaseUrl = "https://localhost:7074";


export const apiClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    async (request) => {
        const accessToken = await getAccessToken();

        if (accessToken) {
            request.headers = request.headers ?? {};
            request.headers.Authorization = `Bearer ${accessToken}`;
        }

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        //!! converts the result to true or false
        const failedRequest = error.config; 


        if (!failedRequest) {
            return Promise.reject(error);
        }

        // Adding a custom property to track if the request has already been retried
        failedRequest._retry = failedRequest._retry || false;

        const isUnauthorized = error.response?.status === 401;
        const isRefreshCall = !!failedRequest.url?.includes("auth/refresh"); // !! converts the result to true or false

        if (isUnauthorized && !failedRequest._retry && !isRefreshCall) {
            failedRequest._retry = true;

            try {
                const refreshToken = await getRefreshToken();

                if (!refreshToken) {
                    await clearTokens();
                    return Promise.reject(error);
                }

                const refreshResponse = await axios.post(
                    `${apiBaseUrl}/auth/refresh`,
                    { refreshToken },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const newAccessToken = refreshResponse.data.accessToken;
                const newRefreshToken = refreshResponse.data.refreshToken;

                await saveTokens(newAccessToken, newRefreshToken);

                failedRequest.headers = failedRequest.headers ?? {};
                failedRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return apiClient(failedRequest);
            } catch (refreshError) {
                await clearTokens();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


// If TypeScript throws: "Property '_retry' does not exist on type 'InternalAxiosRequestConfig'"
// 1. Add this at the top of the file:
// import { InternalAxiosRequestConfig } from 'axios';
// interface CustomAxiosConfig extends InternalAxiosRequestConfig {
//     _retry?: boolean;
// }

// 2. Use this line inside the error handler:
// const failedRequest = error.config as CustomAxiosConfig;