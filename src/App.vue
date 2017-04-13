<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>

	export default {
		name: 'app',
		components: {
		}
	}
</script>

<style>
	@import "./assets/iconfont/iconfont.css";

	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s
	}
	.fade-enter, .fade-leave-active {
		opacity: 0
	}


	body {
		/*background-color: #324057;*/
		margin: 0px;
		padding: 0px;
		/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
		background: #1F2D3D;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		/*font-weight: 400;*/
		font-size:14px;
		-webkit-font-smoothing: antialiased;
	}

	#app {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}

	.el-submenu [class^=fa] {
		vertical-align: baseline;
		margin-right: 10px;
	}

	.el-menu-item [class^=fa] {
		vertical-align: baseline;
		margin-right: 10px;
	}

	.toolbar .el-form-item {
		margin-bottom: 10px;
	}

	.toolbar {
		background: #fff;
		padding: 10px 10px 0px 10px;
	}

  .credit-table-expand {
    font-size: 0;
  }
  .credit-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .credit-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .el-table tr.bad-credit {
    background: #ffd8d8;
  }

  .user-table-expand {
    font-size: 0;
  }

  .user-table-expand label {
    width: 80px;
    color: #99a9bf;
  }

  .user-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 32%;
  }
</style>
