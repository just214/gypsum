<template>
  <el-card :style="{
        borderRadius: '20px',
        width: $mq === 'xs' ? '100%': '80%',
        margin: '10px auto',
      }">
    <h2 style="color: var(--primary)">{{value.term}}</h2>
    <p>{{value.definition}}</p>
  </el-card>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    value: VueTypes.object.isRequired,
  },
};
</script>


<style>
</style>
