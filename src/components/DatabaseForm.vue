<template>
  <div>
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
      type="success"
      style="width: 60px">Save</el-button>
    <zoom-center-transition mode="out-in">
      <div v-if="databases.length"
        style="margin: 10px 0px;">
        <small style="color: var(--gray-8)">Select a Database</small>
        <el-select v-model="selectedDatabaseId"
          size="mini"
          style="width: 100%">
          <el-option v-for="db in databases"
            :key="db.id"
            :label="db.name"
            :value="db.id">
          </el-option>
        </el-select>
      </div>

    </zoom-center-transition>
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
  mounted() {
    if (this.databases.length) {
      this.selectedDatabaseId = this.databases[0].id;
    }
  },
  watch: {
    selectedDatabaseId(value) {
      this.$emit('selected', value);
    },
    databases(value) {
      if (value.length) {
        this.selectedDatabaseId = value[0].id;
      }
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
