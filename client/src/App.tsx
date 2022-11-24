import "./App.css";

import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthContextProvider } from "./auth/";
import { GlobalStoreContextProvider } from "./store/";

import { SplashScreen } from "./components/SplashScreen";
import { HomeWrapper } from "./components/HomeWrapper";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";

import { AppBanner } from "./components/AppBanner";

export const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppBanner />
                    <Routes>
                        <Route path="/" element={<SplashScreen />} />
                        <Route path="/home/" element={<HomeWrapper />} />
                        <Route path="/login/" element={<LoginScreen />} />
                        <Route path="/register/" element={<RegisterScreen />} />
                    </Routes>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}