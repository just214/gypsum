<template>
  <el-popover placement="bottom"
    width="200"
    trigger="click">
    <i slot="reference"
      class="fa fa-comment"
      style="color: var(--primary);cursor: pointer;outline: none" />

    <small style="white-space: pre-wrap">{{notes}}</small>

  </el-popover>

</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    notes: VueTypes.string,
  },
};
</script>

<style>
</style>
