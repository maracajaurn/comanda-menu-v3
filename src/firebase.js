import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBT0ooaU7INq-pvNnoKDyDg2ngfOjwwuXo",
  authDomain: "notification-comanda-b3b95.firebaseapp.com",
  projectId: "notification-comanda-b3b95",
  storageBucket: "notification-comanda-b3b95.firebasestorage.app",
  messagingSenderId: "296913414338",
  appId: "1:296913414338:web:953adf7fb8dae5e43f335b",
  measurementId: "G-SZF4GN1LYC"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY_PUBLICA,
      });
      return token;
    };
    return null;
  } catch (error) {
    console.error("Ocorreu um erro ao obter o token:", error);
    return null;
  };
};

export { app, messaging };