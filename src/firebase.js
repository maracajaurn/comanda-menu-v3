import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCDnqqM5K8A9z9vPPpGAfSh6bxlqs5tMl8",
  authDomain: "notify-comanda-avante.firebaseapp.com",
  projectId: "notify-comanda-avante",
  storageBucket: "notify-comanda-avante.firebasestorage.app",
  messagingSenderId: "239014361232",
  appId: "1:239014361232:web:edcbfc36c6489357abc015",
  measurementId: "G-N4Q2X04SF4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
