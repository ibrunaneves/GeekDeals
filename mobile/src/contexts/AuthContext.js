import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storagedToken = await AsyncStorage.getItem('@GeekDeals:Token');
            if (storagedToken) {
                api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
                setUser({ token: storagedToken });
            }
            setLoading(false);
        }
        loadStorageData();
    }, []);

    async function signIn(token) {
        setUser({ token });
        api.defaults.headers.Authorization = `Bearer ${token}`;
        await AsyncStorage.setItem('@GeekDeals:token', token);
    }

    async function signOut() {
        await AsyncStorage.clear();
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};