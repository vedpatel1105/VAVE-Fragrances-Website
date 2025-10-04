import { useEffect, useRef } from 'react';
import { useAuthStore } from '../lib/auth';
import type { AuthState } from '../lib/auth';

export function useAuthCheck() {
    const checkAuth = useAuthStore((state: AuthState) => state.checkAuth);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const isCheckingRef = useRef<boolean>(false);

    useEffect(() => {
        const performCheck = async () => {
            if (isCheckingRef.current) return;
            
            try {
                isCheckingRef.current = true;
                await checkAuth();
            } finally {
                isCheckingRef.current = false;
                // Schedule next check after 5 minutes
                timeoutRef.current = setTimeout(performCheck, 5 * 60 * 1000);
            }
        };

        // Initial check
        performCheck();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [checkAuth]);
}