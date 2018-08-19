<template>
  <el-select v-model="fieldValue"
    v-if="allFieldValues.length"
    clearable
    size="mini"
    style="width: 100%; margin: 4px 0px;"
    placeholder="Copy from..."
    @change="e => $emit('change', fieldValue)">
    <el-option v-for='value in allFieldValues'
      :key='value.key + value.collection + value.fieldName'
      :label="value.collection + '/' + value.fieldName"
      :value="value">
    </el-option>
  </el-select>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    allFieldValues: VueTypes.array,
  },

  data: () => ({
    fieldValue: '',
  }),
};
</script>

