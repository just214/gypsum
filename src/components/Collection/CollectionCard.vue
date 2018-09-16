<template>
  <div>
    <div style="text-align: center;">
      <el-button @click="addFieldMode = !addFieldMode"
        style="margin: 0px 8px;width: 60px;"
        round
        size="mini">Field+</el-button>
      <el-button @click="addSubcollectionMode = !addSubcollectionMode"
        v-if="type !== 'subcollection'"
        style="margin: 8px;width: 110px;"
        round
        size="mini">Subcollection+</el-button>

      <slot name="rules" />

      <el-collapse-transition mode="out-in">

        <SubcollectionForm :collections="collections"
          v-if="addSubcollectionMode"
          @cancel="addSubcollectionMode = false"
          :collection="collection"
          @submit="handleAddSubcollection">
        </SubcollectionForm>

      </el-collapse-transition>

      <el-collapse-transition>
        <FieldForm :collections="collections"
          @cancel="addFieldMode = false"
          v-if="addFieldMode"
          :allFieldValues="allFieldValues"
          :collection="collection"
          @submit="handleAddField">
        </FieldForm>
      </el-collapse-transition>

      <el-collapse-transition>
        <FieldForm :collections="collections"
          :model="selectedField"
          @cancel="editFieldMode = false"
          v-if="editFieldMode"
          :allFieldValues="allFieldValues"
          :collection="collection"
          @submit="handleEditField">
        </FieldForm>
      </el-collapse-transition>

    </div>

    <FieldItems :collection="collection"
      @moveFields="fieldItems => $emit('moveFields', fieldItems)"
      :inEditMode="inEditMode"
      @editField="openEditForm"
      @deleteField="field => $emit('deleteField', field)"
      @enterField="handleHover"
      @exitField="handleExit" />

  </div>
</template>

<script>
import VueTypes from 'vue-types';

import DeletePopover from '@/components/UI/DeletePopover';
import CollectionName from '@/components/Collection/CollectionName';
import SubcollectionForm from '@/components/Collection/SubcollectionForm';
import FieldForm from '@/components/Field/FieldForm';
import FieldItems from '@/components/Field/FieldItems';

export default {
  props: {
    type: VueTypes.string.def('collection'),
    collections: VueTypes.array.isRequired,
    collection: VueTypes.object.isRequired,
    allFieldValues: VueTypes.array,
  },
  components: {
    DeletePopover,
    SubcollectionForm,
    FieldForm,
    FieldItems,
    CollectionName,
  },
  data: () => ({
    addFieldMode: false,
    addSubcollectionMode: false,
    editFieldMode: false,
    selectedField: {},
  }),
  computed: {
    inEditMode() {
      return (
        this.addFieldMode || this.addSubcollectionMode || this.editFieldMode
      );
    },
  },
  watch: {
    addFieldMode(value) {
      if (value) {
        this.addSubcollectionMode = false;
      }
    },
    addSubcollectionMode(value) {
      if (value) {
        this.addFieldMode = false;
      }
    },
    inEditMode(value) {
      this.$emit('editMode', value);
    },
  },
  methods: {
    openEditForm(field) {
      this.selectedField = field;
      setTimeout(() => {
        this.editFieldMode = !this.editFieldMode;
      }, 100);
    },
    handleAddField(values, fieldFormCallback) {
      const callback = () => {
        this.addFieldMode = false;
        fieldFormCallback();
      };
      this.$emit('addField', values, callback);
    },
    handleEditField(values, fieldFormCallback) {
      const callback = () => {
        this.editFieldMode = false;
        fieldFormCallback();
      };
      this.$emit('editField', values, callback);
    },
    handleAddSubcollection(subcollection) {
      this.$emit('addSubcollection', {
        subcollection,
        collection: this.collection,
      });
      this.addSubcollectionMode = false;
    },
    handleHover(field) {
      // if (document.getElementById(field.id)) {
      //   document.getElementById(field.id).style =
      //     'background-color: var(--gray-1)';
      // }

      if (field.foreignKey && document.getElementById(field.foreignKey)) {
        document.getElementById(field.foreignKey).style =
          'background-color: #FFFFE0';
      }
      if (field.foreignCopy && document.getElementById(field.foreignCopy)) {
        document.getElementById(field.foreignCopy).style =
          'background-color: #FFFFE1';
      }
    },
    handleExit(field) {
      document.getElementById(field.id).style = 'border: 1px dashed lightgray';
      if (field.foreignKey) {
        document.getElementById(field.foreignKey).style =
          'border: 1px dashed lightgray';
      }

      if (field.foreignCopy && document.getElementById(field.foreignCopy)) {
        document.getElementById(field.foreignCopy).style =
          'border: 1px dashed lightgray';
        document.getElementById(field.foreignCopy).style =
          'background-color: white';
      }
    },
  },
};
</script>

