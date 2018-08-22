<template>
  <div style="margin: 15px 0px">
    <el-input clearable
      size="mini"
      v-model="databaseName"
      @keyup.native="handleInputChange"
      :minlength="1"
      :maxlength="40"
      style="width: 60%;margin: 5px;"
      @keyup.enter.native="handleAdd"
      placeholder="New database" />
    <el-button size="mini"
      round
      @click="handleAdd"
      style="width: 60px">Save</el-button>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    databases: VueTypes.array,
  },
  data: () => ({
    databaseName: '',
    selectedDatabaseId: '',
  }),

  watch: {
    selectedDatabaseId(value) {
      this.$emit('selected', value);
    },
  },
  methods: {
    handleAdd() {
      this.$emit('add', this.databaseName);
      this.databaseName = '';
    },
    handleInputChange(e) {
      this.databaseName = e.target.value.replace(/\-|\ /g, '');
    },
  },
};
</script>
