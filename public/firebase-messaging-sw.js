importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCDnqqM5K8A9z9vPPpGAfSh6bxlqs5tMl8",
    authDomain: "notify-comanda-avante.firebaseapp.com",
    projectId: "notify-comanda-avante",
    storageBucket: "notify-comanda-avante.firebasestorage.app",
    messagingSenderId: "239014361232",
    appId: "1:239014361232:web:edcbfc36c6489357abc015",
    measurementId: "G-N4Q2X04SF4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/logo192.png',
    });
});
