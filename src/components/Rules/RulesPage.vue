<template>
  <div style="padding: 10px;">
    <div style="text-align: center">
      <GoBackButton />
    </div>

    <div style="color: var(--gray-8); padding: 0px 40px;">
      <h3>A work in progress...</h3>
      <h3>The goal of this feature is to dynamically generate highly secure and optimized
        Firestore rules based on the data model information you provide, including:</h3>

      <RuleItem title="Collection CRUD permissions"
        info="Who can create, read, update and delete collections and subcollections."
      />
      <RuleItem title="Field Type Validation"
        info="Make sure a string is a string, a number is a number, etc.." />
      <RuleItem title="Field Rule Validation"
        info="required, min length, max length, enums, etc.." />

      <RuleItem title="Authentication"
        info="Make sure that a user is logged in or that their authentication UID matches another collection's field. "
      />
      <RuleItem title="Relational Data Validation" />
      <RuleItem title="Role-based Permissions" />

      <h3>Below is a very incomplete example that dynamically creates match statements
        and utility functions based on the model of your currently selected database.</h3>
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
import RuleItem from './RuleItem';

export default {
  components: { GoBackButton, RuleItem },
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
