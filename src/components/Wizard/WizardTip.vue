<template>
  <div style="margin: 10px auto;width: 80%;">
    <el-alert :title="title"
      type="info"
      show-icon
      center>
    </el-alert>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    title: VueTypes.string.isRequired,
  },
};
</script>

