<template>
  <div style="margin-bottom: 10px">
    <b>{{title}}</b>
    <div v-if="info"
      style="color: var(--gray-6)">{{info}}</div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    title: VueTypes.string.isRequired,
    info: VueTypes.string,
  },
};
</script>
