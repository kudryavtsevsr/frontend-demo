<template>
	<div class="center">
		<div class="panel panel-primary">
			<div class="panel-heading">Меню</div>
			<div class="panel-body">
				<div class="btn-group-vertical" role="group">
					<router-link  v-for="(path, item) in items" :to="path" class="btn btn-default">{{item}}</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['items']
	}
</script>
