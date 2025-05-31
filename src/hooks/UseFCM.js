import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../firebase';
import toast from "react-hot-toast";

export const useFCM = () => {
    useEffect(() => {
        const vapidKey = process.env.REACT_APP_VAPID_KEY_PUBLICA;

        const requestPermissionAndGetToken = async () => {
            let permission = Notification.permission;

            if (permission !== 'granted') {
                permission = await Notification.requestPermission();
            };

            if (permission !== 'granted') {
                toast((t) => (
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center text-center">
                            <h6>Aceite as notificações para ser atualizado sobre seus pedidos</h6>
                        </div>
                        <button className="bg-[#EB8F00] text-white rounded-md p-2"
                            onClick={() => {
                                toast.dismiss(t.id);
                                Notification.requestPermission();
                            }}
                        >OK</button>
                    </div>
                ), { duration: 1000000 });
                return;
            };

            try {
                const token = await getToken(messaging, { vapidKey });
                if (token) {
                    //console.log('FCM Token:', token);
                    // Salvar o token no backend aqui
                };
            } catch (err) {
                console.error('Erro ao obter o token FCM:', err);
            };
        };

        requestPermissionAndGetToken();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Mensagem recebida:', payload);
            toast(`${payload.notification?.title}\n${payload.notification?.body}`);
        });

        return () => unsubscribe();
    }, []);
};

