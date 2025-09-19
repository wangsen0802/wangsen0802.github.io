<template>

  <div class="app">

    <div class="text">this is a test</div>

    <div>test3</div>

    <div>这是一个测试文件</div>

    <div>asjldkfjlkasdj</div>

  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const some = () => {
  console.log('some')
}

onMounted(() => {
  console.log('onMounted')
})
</script>

<style scoped lang="scss">
.app{
  color:#0e100f;
  width: 100vw;
  height: 100vh;
  // background-color: #d52626;
  background-image: linear-gradient( 114.41deg, #0ae448 20.74%, #abff84 65.5% ), url('./assets/images/texture.png');
  background-blend-mode: color-dodge;
}
</style>

