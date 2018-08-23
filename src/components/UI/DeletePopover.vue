<template>
  <el-popover placement="top"
    width="250"
    v-model="visible[refKey]">
    <slot>
      <p>Are you sure to delete this collection?</p>
    </slot>

    <div style="text-align: right; margin: 0">
      <el-button type="text"
        size="mini"
        @click="visible[refKey] = false">Cancel</el-button>
      <el-button size="mini"
        type="primary"
        @click="$emit('delete');visible[refKey] = false">Confirm</el-button>

    </div>

    <i class="fa fa-trash"
      @click="visible[refKey] = true"
      slot="reference"
      type="text"
      style="color: var(--danger);margin-left: 8px;cursor: pointer;" />

  </el-popover>
</template>

<script>
import VueTypes from 'vue-types';
// ! Not sure what this is about.
import shortid from 'shortid';

const autoRefKey = shortid.generate();

export default {
  props: {
    refKey: VueTypes.string.def(autoRefKey),
  },
  data: () => ({
    visible: {},
  }),
};
</script>

<style>
</style>
