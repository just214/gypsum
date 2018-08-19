<template>
  <router-view />
</template>

<script>
import SchemaPage from './components/SchemaPage';

export default {
  name: 'app',
  components: {
    SchemaPage,
  },
};
</script>

<style>
html {
  --primary: #409eff;
  --success: #67c23a;
  --warning: #e6a23c;
  --danger: #f56c6c;
  --info: #909399;
  --gray-1: #f2f6fc;
  --gray-2: #ebeef5;
  --gray-3: #e4e7ed;
  --gray-4: #dcdfe6;
  --gray-5: #c0c4cc;
  --gray-6: #909399;
  --gray-7: #606266;
  --gray-8: #303133;
  --gray-9: #111;
}
body {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  -webkit-overflow-scrolling: touch;
}

.truncate {
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
