<template>
	<div class="center">
		<div class="panel" :class="{'panel-primary':notificationDetect, 'panel-danger':!notificationDetect}">
			<div class="panel-heading">PUSH-уведомления</div>
			<div class="panel-body">
				<div class="btn-group-vertical" role="group">
					<!-- <button type="button" class="btn btn-default" @click="subscribe" :disabled="isTokenSent">Подписаться на уведомления</button> -->
					<button type="button" class="btn btn-default" @click="sendNotification(notification)" :disabled="!isTokenSent">Получить уведомление</button>
					<div class="notifications" v-if="notifications.length>0">
						<p class="notifications__title">Уведомления:</p>
						<p class="notifications__item" v-for="(item, index) in notifications">PUSH #{{index++}}: {{item.title}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	var firebase = require('firebase');;
	var axios = require('axios');
	var qs = require('qs');

	export default {
		data: function() {
			return {
				messaging: null,
				notification: {
					"title": "yandex",
					"body": "Перейти на Яндекс",
					"icon": "https://avatars.mds.yandex.net/get-bunker/60661/5ec62cb755193c37a6ec19a826b3891780eead2a/orig",
					"click_action": "https://yandex.ru/"
				},
				notifications: [],
				isTokenSent: window.localStorage.getItem('sentFirebaseMessagingToken') ? true : false
			}
		},
		created: function() {
			firebase.initializeApp({
				messagingSenderId: '49373960116'
			});
			// Если браузер поддерживает уведомления
			if (this.notificationDetect) {
				this.messaging = firebase.messaging();
				// пользователь уже разрешил получение уведомлений
				// подписываем на уведомления если ещё не подписали
				if (Notification.permission === 'granted') {
					this.subscribe();
				}

				// Автоматически подписываемся на уведомления если ещё не подписаны
				if (!this.isTokenSent) this.subscribe();

				// Уведомление без ссылки
				// this.messaging.onMessage(function(payload) {
	 			//      console.log('Message received. ', payload);
	 			//      new Notification(payload.notification.title, payload.notification);
	 			//  	});
		
				// Если пришло уведомление, выводим его
				this.messaging.onMessage(function(payload) {
						console.log('Message received. ', payload);

						this.notifications.push(payload.notification);

						navigator.serviceWorker.register('/messaging-sw.js');
						Notification.requestPermission(function(permission) {
								if (permission === 'granted') {
										navigator.serviceWorker.ready.then(function(registration) {
												payload.notification.data = payload.notification;
												registration.showNotification(payload.notification.title, payload.notification);
										}).catch(function(error) {
												showError('ServiceWorker registration failed.', error);
										});
								}
						});
				}.bind(this));

			} else {
				console.warn('Notification not found!');
			}
		},
		methods: {
			subscribe: function() {
				// запрашиваем разрешение на получение уведомлений
				this.messaging.requestPermission()
				.then(function () {
					// получаем ID устройства
					this.messaging.getToken()
					.then(function (currentToken) {
						console.log(currentToken);

						if (currentToken) {
							this.sendTokenToServer(currentToken);
						} else {
							console.warn('Не удалось получить токен.');
							this.setTokenSentToServer(false);
						}
					}.bind(this))
					.catch(function (err) {
						console.warn('При получении токена произошла ошибка.', err);
						this.setTokenSentToServer(false);
					}.bind(this));
				}.bind(this))
				.catch(function (err) {
					console.warn('Не удалось получить разрешение на показ уведомлений.', err);
				});
			},
			// Отправка ID на сервер
			sendTokenToServer: function(currentToken) {
				if (!this.isTokenSentToServer(currentToken)) {
					console.log('Отправка токена на сервер...');

					var url = 'https://fcm.googleapis.com/fcm/connect/subscribe'; // адрес скрипта на сервере который сохраняет ID устройства
					axios.post(url, qs.stringify({
						token: currentToken
					}))

				this.setTokenSentToServer(currentToken);
				} else {
					console.log('Токен уже отправлен на сервер.');
				}
			},
			// Используем localStorage для отметки того, что пользователь уже подписался на уведомления
			isTokenSentToServer: function(currentToken) {
				return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
			},
			setTokenSentToServer: function(currentToken) {
				window.localStorage.setItem(
					'sentFirebaseMessagingToken',
					currentToken ? currentToken : ''
					);
				this.isTokenSent = true;
			},
			sendNotification: function(notification) {
				var key = 'AAAAC37q17Q:APA91bGHFCil8S9jNjLbU5wMvQc_GQRb9ssdIu6ERH_d3ROdO1_w4ei5cFuyoq8u0Zf8WLjQhyH4DUEOW-ZVKx8_PFxrDLuSY5yesMgnGOY6HG6QNVTlxr60s-hf7CB91a-VE9OKtpdZ';

				console.log('Send notification', notification);

				this.messaging.getToken()
				.then(function(currentToken) {
					fetch('https://fcm.googleapis.com/fcm/send', {
						'method': 'POST',
						'headers': {
							'Authorization': 'key=' + key,
							'Content-Type': 'application/json'
						},
						'body': JSON.stringify({
							'notification': notification,
							'to': currentToken
						})
					}).then(function(response) {
						return response.json();
					}).then(function(json) {
						console.log('Response', json);
					}).catch(function(error) {
						console.warn(error);
					});
				})
				.catch(function(error) {
					showError('Error retrieving Instance ID token.', error);
				});
			}
		},
		computed: {
			notificationDetect: function(val) {
				return 'Notification' in window ? true : false;
			}
		}
	}
</script>

<style scope lang="sass">
	.notifications
		margin-top: 20px
		text-align: left
		max-height: 200px
		overflow-y: scroll
		&__title
			font-weight: bold
		&__item
			margin: 0 0 5px 5px
</style>
