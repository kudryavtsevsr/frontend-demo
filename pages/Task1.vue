<template>
	<app-menu :items="menu"></app-menu>
</template>

<script>
	var Menu = require('../components/menu.vue').default

	export default {
		components: {
			'app-menu': Menu
		},
		props: ['menu']
	}
</script>
