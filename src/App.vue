<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本框" name="first">
      <DefaultModel />
      </el-tab-pane>
    <el-tab-pane label="68点" name="second"><lanmark68/></el-tab-pane>
    <el-tab-pane label="人脸识别" name="third"><recognation /></el-tab-pane>
    <el-tab-pane label="表情" name="fourth"><expression /></el-tab-pane>
    <el-tab-pane label="年龄" name="five"><Age /></el-tab-pane>
    <el-tab-pane label="口罩" name="six"><FaceMask /></el-tab-pane>
  </el-tabs>
</template>

<script>
import DefaultModel from './components/defaultModel';
import lanmark68 from './components/68lanmark';
import recognation from './components/recognation';
import expression from './components/expression';
import Age from './components/age';
import FaceMask from './components/mask';

export default {
  name: 'App',
  components: {
    DefaultModel,
    lanmark68,
    recognation,
    expression,
    Age,
    FaceMask,
  },
   data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
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
