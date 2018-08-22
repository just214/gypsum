<template>
  <span>
    <el-button round
      @click="dialogVisible = true"
      style="margin: 8px 0px;width: 70px;"
      size="mini">
      Rules
    </el-button>

    <el-dialog :visible.sync="dialogVisible"
      :fullscreen="true"
      :modal="false"
      :width="this.$mq === 'xs' ? '95%' : '80%'">
      <div slot="title">
        Collection Rules
      </div>
      <section>

        <el-tabs v-model="activeName">
          <el-tab-pane label="get"
            name="get">get</el-tab-pane>
          <el-tab-pane label="list"
            name="list">list</el-tab-pane>
          <el-tab-pane label="create"
            name="create">create</el-tab-pane>
          <el-tab-pane label="update"
            name="update">update</el-tab-pane>
          <el-tab-pane label="delete"
            name="delete">delete</el-tab-pane>
        </el-tabs>
      </section>
    </el-dialog>
  </span>
</template>


<script>
export default {
  props: ['rules'],

  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
    };
  },
  methods: {
    onCopy() {
      this.$message({
        message: 'Copied!',
        type: 'success',
        duration: 500,
        center: true,
      });
    },
    onError() {
      this.$message({
        message: 'Failed to copy :(',
        type: 'error',
        duration: 500,
        center: true,
      });
    },
  },
};
</script>

<style scoped>
.tree {
  width: 100%;
  height: 100%;
}
.container {
  width: 500px;
  height: 500px;
}
</style>
