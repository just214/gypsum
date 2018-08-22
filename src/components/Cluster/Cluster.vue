<template>
  <span>
    <div style="text-align: center;">

      <el-button round
        @click="dialogVisible = true"
        style="margin: 8px 0px;width: 100%;"
        size="mini">
        <i class="fa fa-project-diagram" />&nbsp;Cluster
      </el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible"
      :modal="false"
      :fullscreen="true">
      <div style="display: flex; justify-content: center;">
        <el-slider v-model="sliderValue"
          :show-tooltip="false"
          style="width: 200px"></el-slider>
      </div>

      <div class="tree-container"
        :style="{height: `${nodeCount*sliderValue}vh`,minHeight: '90vh'}">
        <tree :data="tree"
          v-if="dialogVisible"
          type="cluster"
          class="tree"
          :duration="500"
          node-text="name">
        </tree>
      </div>
    </el-dialog>
  </span>
</template>


<script>
import { tree } from 'vued3tree';

export default {
  // * The count is to dynamically set the height based on the number of fields.
  props: ['tree', 'count'],
  components: {
    tree,
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      sliderValue: 11,
    };
  },
  computed: {
    nodeCount() {
      return this.count;
    },
  },
};
</script>

<style scoped>
.tree {
  width: 100%;
  height: 100%;
}
.tree-container {
  width: 100%;
}
</style>
