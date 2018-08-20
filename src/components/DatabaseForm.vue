<template>
  <div style="margin: 15px 0px">
    <el-input v-model.trim="databaseName"
      clearable
      size="mini"
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
  },
};
</script>
