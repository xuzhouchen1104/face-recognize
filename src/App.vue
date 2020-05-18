<template>
  <div id="app">
    <HelloWorld />
    <!-- <canvas1 /> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
// import canvas1 from './components/canvasExample/canvas1';

export default {
  name: 'App',
  components: {
    HelloWorld,
    // canvas1,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
