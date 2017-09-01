// Service Worker для получения push-уведомлений.
// Всегда в корне
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js');

firebase.initializeApp({
	messagingSenderId: '49373960116'
});

const messaging = firebase.messaging();
