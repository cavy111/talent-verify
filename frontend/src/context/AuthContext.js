import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';  

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
            {children}
        </AuthContext.Provider>
    );

}
