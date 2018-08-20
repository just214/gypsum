<template>
  <el-button-group>
    <el-button @click="$emit('yes')"
      type="success">Yes</el-button>
    <el-button @click="$emit('no')"
      type="danger">No</el-button>
  </el-button-group>
</template>

<script>
export default {};
</script>

<style>
</style>
