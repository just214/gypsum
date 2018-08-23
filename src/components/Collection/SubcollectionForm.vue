<template>

  <el-form :model="subcollection"
    ref="subcollectionForm">
    <b>Add a Subcollection</b>

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

export default {
  props: {
    model: VueTypes.object,
    collection: VueTypes.object.isRequired,
    collections: VueTypes.arrays,
  },
  data: () => ({
    subcollection: {
      name: '',
    },
  }),

  methods: {
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
