import { useEffect, useRef, useState } from "react";
import { onMessage, } from "firebase/messaging";
import { fetchToken, messaging } from "../firebase";
import toast from "react-hot-toast";

async function getNotificationPermissionAndToken() {
    if (!("Notification" in window)) {
        toast.info("Esse navegador não suporta notificações!");
        return null;
    };

    if (Notification.permission === "granted") {
        return await fetchToken();
    };

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            return await fetchToken();
        };
    };

    toast.error("Notificações não permitidas!");
    return null;
};

export const useFCM = () => {
    const [token, setToken] = useState(null);
    const retryLoadToken = useRef(0);

    const loadToken = async () => {
        const newToken = await getNotificationPermissionAndToken();

        if (Notification.permission === "denied") {
            toast.error("Altere a permissão de notificação manualmente nas configurações do navegador.");
            return;
        };

        if (!newToken) {
            if (retryLoadToken.current >= 3) {
                toast.error("Não foi possível carregar o token de notificação. Tente novamente mais tarde.");
                return;
            };

            retryLoadToken.current += 1;
            toast.error("Erro ao carregar token. Tentando novamente...");

            setTimeout(() => loadToken(), 1500);
            return;
        };

        setToken(newToken);
    };

    useEffect(() => {
        if ("Notification" in window) {
            loadToken();
        };
    }, []);

    useEffect(() => {
        let unsubscribe;

        const setupListener = async () => {
            if (!token) return;

            console.log(token);

            const msg = await messaging();

            if (!msg) return;

            unsubscribe = onMessage(msg, (payload) => {
                console.log("Notificação recebida:", payload);
                if (Notification.permission !== "granted") return;

                const link = payload.fcmOptions?.link || payload.data?.link;

                toast(
                    `${payload.notification?.title}: ${payload.notification?.body}`,
                    link ? {
                        action: {
                            label: "Abrir",
                            onClick: () => window.location.href = link,
                        },
                    } : undefined,
                );

                const notify = new Notification(
                    payload.notification?.title || "Nova mensagem",
                    {
                        body: payload.notification?.body || "Uma nova mensagem chegou!",
                        data: { url: link },
                    }
                );

                notify.onclick = (event) => {
                    event.preventDefault();
                    const url = event.notification?.data?.url;
                    if (url) window.location.href = url;
                };
            });
        };

        setupListener();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [token]);
};