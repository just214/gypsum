<template>
  <div style="text-align: center;">
    <div class="collection-name-wrapper">
      <transition name="el-zoom-in-center"
        mode="out-in"
        duration="120">
        <span v-if="!editMode"
          style="display: flex; align-items: center;"
          :class="{subcollection: isSubcollection, collection: !isSubcollection}">

          <span class="truncate">{{collection.name}}</span>
          <span :style="{fontSize: isSubcollection ? '.8em':'.5em'}">
            <i class="fa fa-pencil-alt edit-button"
              @click="editMode = !editMode" />
            <DeletePopover :refKey="collection.id"
              @delete="$emit('delete',collection)" />
          </span>

        </span>

        <div v-if="editMode"
          style="display: flex; align-items: center">

          <el-input size="mini"
            v-model="collectionName"
            ref="collectionNameInput"
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
    collection: VueTypes.object.isRequired,
    type: VueTypes.string.def('collection'),
  },
  components: {
    DeletePopover,
  },
  data: () => ({
    editMode: false,
    collectionName: '',
  }),
  computed: {
    isSubcollection() {
      return this.type === 'subcollection';
    },
  },
  watch: {
    editMode(value) {
      if (value) {
        this.collectionName = this.collection.name;
        setTimeout(() => {
          this.$refs.collectionNameInput.$refs.input.select();
        }, 500);
      }
    },
  },
  methods: {
    handleEdit() {
      this.$emit('edit', this.collectionName);
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
}

.subcollection {
  font-size: 15px;
  color: var(--gray-8);
}

.collection {
  font-size: 25px;
  color: var(--gray-5);
}
</style>
