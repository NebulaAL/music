<template>
    <div class="container">
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
        >
            <el-menu-item index="1" @click="analysisClicked">
                <span slot="title">音频分析</span>
            </el-menu-item>
            <el-menu-item index="2" @click="transcribeClicked">
                <span slot="title">音频录制</span>
            </el-menu-item>
        </el-menu>
       <router-view/>
    </div>
</template>

<script>
export default {
  name: 'index',
  methods: {
    analysisClicked () {
      this.$router.push('/analysis')
    },
    transcribeClicked () {
      this.$router.push('/transcribe')
    }
  }
}
</script>

<style>
.el-menu-vertical-demo {
    width: 280px;
    height: 100vh;
}

.container {
    display: flex;
}
</style>
