<template>
  <div>

    <div style="text-align: center">
      <GoBackButton />

      <el-slider v-model="sliderValue"
        :show-tooltip="false"
        style="width: 200px;margin: 0 auto;"></el-slider>
    </div>

    <div class="tree-container"
      :style="{height: `${nodeCount*sliderValue}vh`,minHeight: '90vh'}">
      <tree :data="clusterData"
        type="cluster"
        class="tree"
        :duration="500"
        node-text="name">
      </tree>
    </div>

  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import { tree } from 'vued3tree';
import GoBackButton from '@/components/UI/GoBackButton';

export default {
  // * The count is to dynamically set the height based on the number of fields.
  components: {
    tree,
    GoBackButton,
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      sliderValue: 11,
    };
  },
  computed: {
    ...mapGetters(['allFieldValues', 'clusterData']),
    nodeCount() {
      return this.allFieldValues.length;
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
