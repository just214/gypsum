<template>
  <el-button-group>

    <el-button v-for="value in ['Yes', 'No']"
      :key="value"
      @click="$emit(value.toLowerCase())"
      round
      style="width: 100px"
      :type="value === 'Yes' ? 'success' : 'danger'">{{value}}</el-button>

  </el-button-group>
</template>

<script>
export default {};
</script>

<style>
</style>
