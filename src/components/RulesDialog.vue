<template>
  <span>
    <div style="text-align: center">
      <el-button round
        size="mini"
        style="width: 100%;"
        @click="dialogVisible = true">
        <i class="fa fa-pencil-ruler" />&nbsp;View Rules
      </el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible"
      :modal="false"
      :fullscreen="true">
      <div style="text-align: center">
        <el-button v-clipboard:copy="rules"
          size="mini"
          round
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">
          <i class="fa fa-clipboard" />&nbsp;Copy</el-button>
        <h3 style="margin: 10px">
          &nbsp;Copy these rules into your
          <span style="color: var(--warning)">firestore.rules</span> file.
        </h3>
      </div>
      <div class="rules-wrapper">

        {{rules}}

      </div>
    </el-dialog>
  </span>
</template>


<script>
export default {
  props: ['rules'],
  data() {
    return {
      dialogVisible: false,
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
.rules-wrapper {
  white-space: pre-wrap;
  background: var(--gray-1);
  padding: 10px;
  max-height: 450px;
  overflow: scroll;
}
</style>
