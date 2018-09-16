<template>
  <div style="padding: 20px">
    <div style="text-align: center">
      <GoBackButton />
    </div>

    <!-- <el-card>
      <h4>Data Types</h4>
      <el-tag style="margin: 3px;"
        v-for="type in dataTypes"
        :key="type">{{type}}</el-tag>
    </el-card> -->

    <img style="max-width: 100%;"
      src="../../assets/cheatsheet.png"
      alt="Cheatsheet">
  </div>
</template>

<script>
import GoBackButton from '@/components/UI/GoBackButton';

export default {
  components: {
    GoBackButton,
  },
  data: () => ({
    dataTypes: [
      'Null',
      'String',
      'Boolean',
      'Number',
      'Date/Time',
      'Bytes',
      'Reference',
      'Geo Point',
      'Nested Array',
      'Nested Map (object)',
    ],
  }),
};
</script>
