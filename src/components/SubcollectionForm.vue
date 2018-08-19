<template>

  <el-form :model="subcollection"
    ref="subcollectionForm">
    <b>Add a Subcollection</b>

    <el-select v-model="copyValues"
      v-if="allCollections.length"
      size="mini"
      style="width: 100%; margin: 8px 0px;"
      placeholder="Copy from..."
      @change="handleCopy">
      <el-option v-for='value in allCollections'
        :key='value.key + value.collection'
        :value="value"
        :label="value.parentName ? value.parentName + '/' + value.name : value.name">
      </el-option>
    </el-select>

    <el-form-item prop="subcollectionName">
      <el-input placeholder="Subcollection Name"
        size="small"
        ref="nameInput"
        v-model="subcollection.name" />
    </el-form-item>

    <div class="save-button-wrapper">

      <el-button type="success"
        size="mini"
        round
        native-type="submit"
        @click.prevent="handleSave">Save</el-button>
      <el-button type="text"
        style="color:var(--danger)"
        @click="$emit('cancel')">Cancel</el-button>
    </div>
  </el-form>

</template>

<script>
import VueTypes from 'vue-types';
import cloneDeep from 'lodash/cloneDeep';

export default {
  props: {
    model: VueTypes.object,
    collection: VueTypes.object.isRequired,
    collections: VueTypes.arrays,
    allCollections: VueTypes.array,
  },
  data: () => ({
    copyValues: null,
    subcollection: {
      name: '',
    },
  }),

  methods: {
    handleCopy() {
      this.subcollection = cloneDeep(this.copyValues);
    },

    handleSave() {
      this.$refs.subcollectionForm.validate(valid => {
        if (valid) {
          this.$emit('submit', this.subcollection);
        }
      });
    },
  },
  created() {
    setTimeout(() => {
      this.$refs.nameInput.$refs.input.focus();
    }, 10);
  },
};
</script>


<style scoped>
.save-button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
