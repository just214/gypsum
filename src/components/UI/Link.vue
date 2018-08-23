<template>
  <router-link :to="to">
    <el-button round
      style="margin: 3px 0px;width: 100%;"
      size="mini">
      <i :class="`fa ${icon}`" />&nbsp;{{title}}
    </el-button>
  </router-link>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    to: VueTypes.string.isRequired,
    title: VueTypes.string.isRequired,
    icon: VueTypes.string.isRequired,
  },
};
</script>

