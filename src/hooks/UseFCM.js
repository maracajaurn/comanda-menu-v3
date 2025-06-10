import { useEffect, useCallback, useRef, useState } from "react";
import { onMessage, } from "firebase/messaging";
import { fetchToken, messaging } from "../firebase";
import toast from "react-hot-toast";

import { CheckService } from "../service/check/CheckService";
import { UsuarioService } from "../service/usuario/UsuarioService";

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

export const useFCM = (id = null, isClient = true) => {
    const [token, setToken] = useState(null);
    const retryLoadToken = useRef(0);

    const insert_notify_id_cleint = useCallback((check_id, newToken) => {
        CheckService.insetNotifyId(check_id, newToken)
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    const insert_notify_id_user = useCallback((user_id, newToken) => {
        UsuarioService.insert_notify_id(user_id, newToken)
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    const loadToken = async () => {
        const newToken = await getNotificationPermissionAndToken();

        if (Notification.permission === "denied") {
            toast.error("Ative as de notificações manualmente nas configurações do navegador");
            return;
        };

        if (!newToken) {
            if (retryLoadToken.current >= 3) {
                toast.error("Não foi possível carregar o token de notificação");
                return;
            };

            retryLoadToken.current += 1;
            toast.error("Erro ao carregar token. Tentando novamente...");

            setTimeout(() => loadToken(), 2000);
            return;
        };

        if (id && id !== "admin") {
            const isToken = newToken ?? token;

            if (isToken) {
                if (isClient) {
                    insert_notify_id_cleint(id, isToken);
                } else {
                    insert_notify_id_user(id, isToken);
                };
            };
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

            const msg = await messaging();

            if (!msg) return;

            unsubscribe = onMessage(msg, (payload) => {
                console.log("Notificação recebida:", payload);
                if (Notification.permission !== "granted") return;

                const link = payload.fcmOptions?.link

                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'}
                        max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src="/favicon.ico"
                                        alt="Logo do site"
                                    />
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {payload.notification?.title}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {payload.notification?.body}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    window.location.href = link;
                                }}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                Abrir
                            </button>
                        </div>
                    </div>
                ), { duration: 5000 });

                const notify = new Notification(payload.notification?.title,
                    { body: payload.notification?.body, data: { url: link } }
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