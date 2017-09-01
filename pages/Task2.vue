<template>
	<div class="center">
		<div class="panel" :class="{'panel-primary':connnection, 'panel-danger':!connnection}">
			<div class="panel-heading">Чат {{connnection?'online':'offline'}}</div>
			<div class="panel-body">
				<div class="chat">
					<div class="chat__window" id="chat-window">

						<div class="message message--gone clearfix" v-for="message in messages" :class="classByType(message.type)">
								<div class="message__time">

									<span class="glyphicon glyphicon-time" style="color:#e5e5e5" aria-hidden="true" title="Сообщение отправляется" v-if="message.status === 0"></span>

									<span class="glyphicon glyphicon-time" style="color:red" aria-hidden="true" title="Сообщение будет отправленно при возобновлении интернет-соединения" v-if="message.status === 1"></span>

								{{message.time}}
								</div>
								<div class="message__text" v-html="message.text"></div>
						</div>

					</div>
					<div class="chat__input">
						<div class="input-group">
							<textarea type="text" class="form-control" id="chat-input" placeholder="Написать сообщение" autofocus v-model="message"
							 @keydown="inputHandler">
							</textarea>
							<span class="input-group-btn">
								<button class="btn btn-default" type="button" @click="addMessage(message)"> > </button>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<p></p>
		<p><input type="radio" id="enter" value="enter" v-model="key"> <label for="enter">Отправить: Enter, Перенос: Ctrl + Enter</label></p>
		<p><input type="radio" id="ctrlenter" value="ctrlenter" v-model="key"> <label for="ctrlenter">Отправить: Ctrl + Enter, Перенос: Enter</label></p>
	</div>
</template>

<script>
	var Vue = require('vue/dist/vue.js');
	var axios = require('axios');
	var qs = require('qs');
	require('OnlineJS/dist/online.min.js');
	
	export default {
		data: function() {
			return {
				messages: [],
				message: '',
				connnection: true,
				url: 'http://echo.brisl.ru/',
				key: window.localStorage.getItem('keyData') ? window.localStorage.getItem('keyData') : 'enter'
			}
		},
		methods: {
			// Назначение клавиш для отправки и переноса строки
			inputHandler: function(e) {
				if (this.key === 'enter') {
					if (e.keyCode === 13 && !e.ctrlKey) {
						e.preventDefault();
						this.addMessage(this.message);
					} else if (e.keyCode === 13 && e.ctrlKey) {
						this.message += '\n';
					}
				} else if (this.key === 'ctrlenter') {
					if (e.keyCode === 13 && e.ctrlKey) {
						this.addMessage(this.message);
					} else if (e.keyCode === 13 && !e.ctrlKey) {
						e.preventDefault();
						this.message += '\n';
					}
				}
			},
			// Выбирает клас по типу сообщения. Возвращает строку класса.
			classByType: function(type) {
				if(type === "gone") {
					return "message--gone";
				}
				else if(type === "come") {
					return "message--come";
				}
			},
			// Cоздаёт сообщение и помещает в объект. Принимает тестт, тип и статус отправки. Возвращает id.
			createMessage: function(text,type,status) {
				// Создаём id
				var id = 0;
				for (var i = 0; i < this.messages.length; i++) {
					if (this.messages[i].id > i) {
						id = this.messages[i].id;
					}
				}
				id++;
				// Преобразуем переносы
				text = text.replace(/\n/g, '<br>');
				var date = new Date(),
					time = date.getHours()+':'+date.getMinutes(),
					message = {
						id: id,
						text: text,
						time: time,
						type: type,
						status: status
					};
				this.messages.push(message);
				return id;
			},
			// Метод получения сообщения по id
			getMessage: function(id) {
				for (var i = 0; i < this.messages.length; i++) {
					if (this.messages[i].id === id) {
						return this.messages[i];
					}
				}
			},
			// Установить статус сообщения
			setMessageStatus: function(id,status) {
				for (var i = 0; i < this.messages.length; i++) {
					if (this.messages[i].id === id) {
						this.messages[i].status = status;
						break;
					}
				}
			},
			// Добавляет сообщение в объект
			addMessage: function(text) {
				if (text.replace(/\s/g, "") === "") return;

				var messageId = this.createMessage(text,"gone",0);
				console.log('messageId: ', messageId);
				this.message = '';

				// Возвращаем фокус на поле ввода
				var chatInput = document.getElementById("chat-input");
				chatInput.focus();

				// Пытаемся отправить сообщение
				if (this.connnection) { // Если есть подключение к интернету
					this.sendMessage(messageId, this.url);
				} else {
					this.setMessageStatus(messageId,1);
				}
			},
			// Посылает сообщение/сообщения. Принимает id сообщения или массив id. Принимает url.
			sendMessage: function(messageId,url) {
				console.log('sendMessage: ', typeof messageId);
				// Получаем сообщение/сообщения по id
				if (typeof messageId === 'object') {
					var message = [];
					for(var i = 0; i < messageId.length; i++) {
						console.log('forEach: ', messageId[i]);
						message.push(this.getMessage(messageId[i]));
					}
				} else {
					var message = this.getMessage(messageId);
				}
				console.log('forSend: ', message);
				// Отправляем запрос
				var self = this;
				axios.post(url, qs.stringify({
					message: message
				}))
				.then(function (response) {
					var data = response.data;
					// Добавляем в объект ответ
					self.createMessage(data,"come",2);
					// Меняем статус исходящего сообщения/сообщений
					if (typeof messageId === 'object') {
						var message = [];
						for(var i = 0; i < messageId.length; i++) {
							self.setMessageStatus(messageId[i],2);
						}
					} else {
						self.setMessageStatus(messageId,2);
					}
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			// Ищем не отправленные сообщения и отправляем
			resendMessages: function() {
				console.log('resendMessages');
				var messagesId = [];
				for (var i = 0; i < this.messages.length; i++) {
					if (this.messages[i].status !== 2) {
						messagesId.push(this.messages[i].id);
						console.log('resendMessageId: ', this.messages[i].id);
					}
				}
				if (messagesId.length > 0) this.sendMessage(messagesId, this.url);
			}
		},
		watch: {
			messages: function(val) {
				window.setTimeout(function() {
					var elem = document.getElementById('chat-window');
					elem.scrollTop = elem.scrollHeight;
				}, 500);
			},
			key: function(val) {
				window.localStorage.setItem('keyData', val)
			}
		},
		created: function() {
			// Проверяем подключение к интернету
			var self = this;
			window.onLineHandler = function() {
				console.log("online");
				self.connnection = true;
				// Отправляем неотправленные сообщения
				self.resendMessages();
			};
			window.offLineHandler = function() {
				console.log("offline");
				self.connnection = false;
			};
		}
		}
</script>

<style scope lang="sass">
	.chat
		width: 250px
		position: relative
		padding-bottom: 40px
		&__input
			position: absolute
			bottom: 0
			width: 100%
		&__window
			height: 300px
			overflow-y: scroll
			margin-bottom: 5px
	.message
		width: 80%
		margin-bottom: 10px
		&--gone
			float: right
			.message__time, .message__text
				float: right
		&--come
			float: left
			.message__time, .message__text
				float: left
		&__text
			padding: 5px
			border: 1px solid #e5e5e5
			border-radius: 2px
			width: 70%
			word-wrap: break-word
			text-align: left
		&__time
			font-size: 12px
			padding: 5px
			width: 30%
	#chat-input
		height: 34px
</style>
