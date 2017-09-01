<template>
	<div class="center">
		<div class="panel panel-primary">
			<div class="panel-heading">Гибкая вёрстка</div>
			<div class="panel-body">
				<div class="inputs">
					<form class="form-horizontal">
						<div class="form-group">
							<label for="input1" class="col-sm-3 control-label">Поле А:</label>
							<div class="col-sm-9">
								<div :class="flexbox">
									<input type="text" id="input1" class="form-control flex-item" placeholder="" v-model="inputA">
									<div class="inputs__error flex-item" v-show="inputA && !isInputAValid">
										 Введите email
									</div>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label for="input2" class="col-sm-3 control-label">Поле В:</label>
							<div class="col-sm-9">
							<div :class="flexbox">
									<input type="text" id="input2" class="form-control flex-item" placeholder="">
									<div class="flex-item"> @example.com</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	require('ergonomic.detect_flex/detect_flex-2012_min.js')
	try {
		var FlexDetect = _DD;
	} catch (err) {
		var FlexDetect = 2;
	}

	export default {
		data: function() {
			return {
				inputA: '',
				inputB: ''
			}
		},
		computed: {
			isInputAValid: function() {
				return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.inputA);
			},
			flexbox: function() {
				if (FlexDetect < 2) {
					return "flex";
				} else {
					return "no-flex";
				}
			}
		}
	}
</script>

<style scope lang="sass">
	.inputs
		width: 350px
		overflow: hidden
		&__error
			color: #d9534f
	.flex
		display: flex
		align-items: center
	.no-flex
		display: table
		.flex-item
			display: table-cell
			vertical-align: middle
</style>
