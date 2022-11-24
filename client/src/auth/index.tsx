import * as React from "react";
import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";
import {getLoggedIn, login, logout, register} from "./requests-api"
import type {User} from "./requests-api";

enum AuthActionType {
    SET_LOGGED_IN,
    ERROR,
};

const defaultAuthState: {
    loggedIn: boolean;
    user: User | null;
    accountError: {
        error: boolean;
        message: string;
    };
} = {
    user: null,
    loggedIn: false,
    accountError: {
        error: false,
        message: "",
    }
};

export const AuthContext = createContext(defaultAuthState);
console.log("create AuthContext: " + AuthContext);

export const AuthContextProvider = (props: {
    children: React.ReactNode
}) => {
    const [auth, setAuth] = useState(defaultAuthState);

    const authReducer = (action: { type: AuthActionType, payload: any }) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.SET_LOGGED_IN: {
                return setAuth(prev => ({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    accountError: {
                        error: false,
                        message: "",
                    }
                }));
            }
            case AuthActionType.ERROR: {
                return setAuth(prev => ({
                    user: null,
                    loggedIn: false,
                    accountError: {
                        ...payload
                    }
                }));
            }
            default:
                return auth;
        }
    }

    const authWithFunctions: {
        setLoggedIn: () => void,
        setAccountError: (errMsg: string) => void,
        register: (username: string, firstName: string, lastName: string, email: string, password: string) => void,
        login: (email: string, password: string) => void,
        logout: () => void,
        getUserInitials: () => void,
    } & (typeof auth) = {
        ...auth,

        setAccountError: async (errMsg: string) => {
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    error: true,
                    message: errMsg
                }
            });
        },

        setLoggedIn: async () => {
            const response = await getLoggedIn();
            if (!response) return authWithFunctions.setAccountError("Couldn't establish connection to server?");
            if (response.error === false) {
                const v = response;
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.loggedIn,
                        user: response.user
                    }
                });
            } else {
                const errMsg = response.errorMsg;
                authWithFunctions.setAccountError(errMsg);
            }
        },

        register: async (username: string, firstName: string, lastName: string, email: string, password: string) => {
            const response = await register(username, firstName, lastName, email, password);
            if (!response) return authWithFunctions.setAccountError("Couldn't establish connection to server?");
            if (response.error === false) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: true,
                        user: response.user
                    }
                });
                redirect("/home/");
            } else {
                const errMsg = response.errorMsg!;
                authWithFunctions.setAccountError(errMsg);
            }
        },

        login: async (email: string, password: string) => {
            const response = await login(email, password);
            if (!response) return authWithFunctions.setAccountError("Couldn't establish connection to server?");
            if (response.error === false) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: true,
                        user: response.user
                    }
                });
                redirect("/home/");
            } else {
                const errMsg = response.errorMsg!;
                authWithFunctions.setAccountError(errMsg);
            }
        },

        logout: async () => {
            const response = await logout();
            if (!response) return authWithFunctions.setAccountError("Couldn't establish connection to server?");
            if (response.error === false) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: false,
                        user: null
                    }
                });
                redirect("/home/");
            } else {
                const errMsg = response.errorMsg!;
                authWithFunctions.setAccountError(errMsg);
            }
        },

        getUserInitials: () => {
            return auth.user ? (auth.user.firstName.charAt(0) + auth.user.firstName.charAt(0)) : "";
        }
    };

    useEffect(() => {
        authWithFunctions.setLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={auth}>
            {props.children}
        </AuthContext.Provider>
    );
}