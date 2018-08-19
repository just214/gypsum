<template>
  <div>
    <div class="collection-name-wrapper">
      <transition name="el-zoom-in-center"
        mode="out-in"
        duration="120">
        <span v-if="!editMode"
          style="display: flex; align-items: center;">

          <span style="font-size: 20px"
            class="truncate">{{database.name}}</span>
          <span :style="{fontSize:  '.8em'}">
            <i class="fa fa-pencil-alt edit-button"
              @click="editMode = !editMode" />
            <DeletePopover :refKey="database.key"
              @delete="$emit('delete')">
              <p>Are you sure you want to delete this database and all of it's collections?</p>
            </DeletePopover>
          </span>
        </span>

        <div v-if="editMode"
          style="display: flex; align-items: center">

          <el-input size="mini"
            v-model="databaseName"
            ref="databaseNameInput"
            style="width: 200px"
            @keyup.enter.native="handleEdit" />
          <el-button round
            style="margin: 5px"
            size="mini"
            @click="handleEdit">save</el-button>
          <i class="fa fa-times"
            style="cursor: pointer; color: var(--gray-5); margin-left: 5px;"
            @click="editMode=false" />

        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import DeletePopover from './DeletePopover';

export default {
  props: {
    database: VueTypes.object.isRequired,
  },
  components: {
    DeletePopover,
  },
  data: () => ({
    editMode: false,
    databaseName: '',
  }),

  watch: {
    editMode(value) {
      if (value) {
        this.databaseName = this.database.name;
        setTimeout(() => {
          this.$refs.databaseNameInput.$refs.input.select();
        }, 500);
      }
    },
  },
  methods: {
    handleEdit() {
      this.$emit('edit', this.databaseName);
      this.editMode = false;
    },
  },
};
</script>

<style scoped>
.edit-button {
  margin-left: 15px;
  color: var(--warning);
  cursor: pointer;
}
.collection-name-wrapper {
  margin: 5px 0px;
  font-weight: bold;
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--gray-5);
  position: fixed;
  top: 10px;
  left: 50%;
  display: flex;
  align-items: center;
  transform: translateX(-50%);
}
</style>
