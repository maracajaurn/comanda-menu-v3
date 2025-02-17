import { useState, useEffect } from 'react';

export const useConnectionMonitor = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            changeNavbarColor('#EB8F00');
            setIsOnline(true);
        };

        const handleOffline = () => {
            changeNavbarColor('#dc2626');
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if (navigator.onLine) {
            changeNavbarColor('#EB8F00');
        } else {
            changeNavbarColor('#dc2626');
        };

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const changeNavbarColor = (color) => {
        const metaThemeColor = document.querySelector('meta[name=theme-color]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = color;
            document.head.appendChild(meta);
        }
    };

    return isOnline;
};
