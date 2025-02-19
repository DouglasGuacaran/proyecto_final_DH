'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const supabase = createClient();

    useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <AuthContext.Provider value={{ user, supabase }}>
        {children}
        </AuthContext.Provider>
    );
    }

    export function useAuth() {
    return useContext(AuthContext);
}

// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import supabase from '@/utils/supabase/client';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const getSession = async () => {
//         const { data: { session }, error } = await supabase.auth.getSession();
//         if (error) {
//             console.error('Error getting session:', error);
//         } else {
//             setUser(session?.user ?? null);
//         }
//         };

//         getSession();

//         const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//         setUser(session?.user ?? null);
//         });

//         return () => {
//         authListener.subscription.unsubscribe();
//         };
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, supabase }}>
//         {children}
//         </AuthContext.Provider>
// );
// }

// export function useAuth() {
// return useContext(AuthContext);
// }