<template>
  <div style="padding: 10px;">
    <div style="text-align: center">
      <GoBackButton />
    </div>

    <div style="text-align: center">
      <h3 style="margin: 10px">
        &nbsp;Copy these rules into your
        <span style="color: var(--warning)">firestore.rules</span> file.
      </h3>
      <el-button v-clipboard:copy="rules"
        size="mini"
        round
        v-clipboard:success="onCopy"
        v-clipboard:error="onError">
        <i class="fa fa-clipboard" />&nbsp;Copy</el-button>

    </div>

    <div class="rules-wrapper">

      {{rules}}

    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import { getRules } from '@/utils';
import GoBackButton from '@/components/UI/GoBackButton';

export default {
  components: { GoBackButton },
  computed: {
    ...mapGetters(['allCollections', 'allFieldValues']),
    rules() {
      return getRules(this.allCollections, this.allFieldValues);
    },
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
  margin-top: 25px;
  font-family: monospace;
}
</style>
