<template>
  <div>
    <el-button style="display: none"
      v-shortkey="['ctrl', 'n']"
      @shortkey.native="showPopover = !showPopover">

    </el-button>
    <el-popover placement="left"
      width="250"
      v-model="showPopover">
      <template slot="reference">
        <el-tooltip effect="dark"
          placement="left-end">
          <template slot="content">
            You can also use
            <samp style="color: yellow">ctrl + n</samp>.
          </template>

          <i class="fa fa-plus collection-button"
            @click="showPopover = !showPopover" />

        </el-tooltip>

      </template>
      <el-form :model="collection"
        ref="collectionForm">

        <el-form-item prop="collectionName">
          <el-input placeholder="Collection Name"
            ref="nameInput"
            size="small"
            v-model="collection.name" />
        </el-form-item>

        <div style="display: flex;align-items:center; justify-content:center;margin-top: 10px;">

          <el-button type="success"
            size="mini"
            round
            native-type="submit"
            @click.prevent="handleSave">Save</el-button>
          <el-button type="text"
            style="color:var(--danger)"
            @click="showPopover = false">Cancel</el-button>
        </div>
      </el-form>
    </el-popover>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    model: VueTypes.object,
    collections: VueTypes.arrays,
  },
  data: () => ({
    showPopover: false,
    collection: {
      name: '',
    },
  }),

  methods: {
    handleSave() {
      this.$refs.collectionForm.validate(valid => {
        if (valid) {
          this.$emit('submit', this.collection);
          this.showPopover = false;
          this.collection.name = '';
        }
      });
    },
  },
  watch: {
    showPopover(value) {
      if (value) {
        setTimeout(() => {
          this.$refs.nameInput.$refs.input.focus();
        }, 10);
      }
    },
  },
};
</script>

<style scoped>
.collection-button {
  position: fixed;
  top: 21px;
  right: 50px;
  color: var(--gray-5);
  cursor: pointer;
  font-size: 25px;
}
</style>

