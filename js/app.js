var Vue = require('vue/dist/vue.js')
var VueRouter = require('vue-router/dist/vue-router.common.js')
require('bootstrap-css-only')
require('../css/main.sass')

var Menu = {
	'Задание 1': '/',
	'Задание 2': '/task2',
	'Задание 3': '/task3',
	'Задание 4': '/task4'
}

// Страницы
var Task1 = require('../pages/Task1.vue').default // Задание 1: "Cтраница с меню"
var Task2 = require('../pages/Task2.vue').default // Задание 2: "Чат"
var Task3 = require('../pages/Task3.vue').default // Задание 3: "Гибкая вёрстка"
var Task4 = require('../pages/Task4.vue').default // Задание 4: "PUSH-уведомления"
var NotFound = require('../pages/404.vue').default

Vue.use(VueRouter)

var router = new VueRouter({
	mode: 'history',
	routes: [
	{path: '/', component: Task1},
	{path: '/task2', component: Task2},
	{path: '/task3', component: Task3},
	{path: '/task4', component: Task4},
	{path: '*', component: NotFound}
	]
})

var app = new Vue({
	el: '#app',
	router: router,
	data: {
		menu: Menu
	}
});
