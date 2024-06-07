/* eslint-disable react/display-name */
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const { user } = useAuth();

        useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        }
        }, [user]);

        if (!user) {
        return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
