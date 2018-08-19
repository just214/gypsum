<template>
  <draggable v-model="fieldItems"
    :options="{animation:150}"
    v-if="!inEditMode"
    @start="drag = true"
    @end="handleDragEnd">

    <div v-for="field in collection.fields"
      :key="field.key"
      class="field-item"
      @mouseover="$emit('enterField', field);"
      @mouseleave="$emit('exitField', field)"
      :id="field.key">

      <el-row style="width: 100%;margin-bottom: 8px;overflow: hidden;">
        <div style="display: flex; align-items: center;">
          <el-col :span="20"
            style="display: flex; align-items: center;">
            <span style="margin: 0px 5px;overflow: hidden;display: flex; align-items: center;">
              <i class="fa fa-key small-icon"
                v-if="field.primaryKey" />
              <i class="fa fa-clone small-icon"
                v-if="field.foreignCopy" />
              <i class="fa fa-link small-icon"
                v-if="field.foreignKey" />
              <span class="truncate">{{field.fieldName}}</span>
            </span>
          </el-col>

          <el-col :span="4"
            align="center">

            <div class="action-buttons">
              <NotesPopover v-if="field.notes"
                :notes="field.notes" />
              <i class="fa fa-pencil-alt"
                @click="$emit('editField', field)"
                style="cursor: pointer; margin: 5px;color: var(--warning)" />
              <i @click="$emit('deleteField', field)"
                class="fa fa-trash"
                style="color: var(--danger);cursor: pointer;" />
            </div>
          </el-col>
        </div>
      </el-row>
      <el-row style="color: var(--gray-6)">

        <el-tag size="mini"
          type="info"
          v-if="field.required"
          style="width: 90px; text-align: center;z-index: 1000;">
          <span style="color: var(--gray-7); margin: 0px 5px;">
            <i class="fa fa-exclamation-circle"
              style="color: var(--danger);" />&nbsp;{{field.dataType}}&nbsp;</span>
        </el-tag>

        <el-tag size="mini"
          v-if="field.dataType && !field.required"
          type="info"
          style="width: 90px; text-align: center;z-index: 1000;">
          <span style="color: var(--gray-7); margin: 0px 5px;">
            {{field.dataType}}</span>
        </el-tag>

        <el-tag :key="fieldName"
          style="margin: 3px;"
          size="mini"
          v-if="field[fieldName]"
          v-for="fieldName in tagOptions">
          {{fieldName}}: {{ field[fieldName] }}</el-tag>

        <el-tag style="margin: 3px;"
          size="mini"
          v-if="field.startsWith">
          startsWith: "{{ field.startsWith }}"
        </el-tag>

        <el-tag style="margin: 3px;"
          size="mini"
          v-if="field.endsWith">
          endsWith: "{{ field.endsWith }}"
        </el-tag>

        <el-tag style="margin: 3px;"
          size="mini"
          v-if="field.match">
          match: {{ field.match }}
        </el-tag>

        <el-tag style="margin: 3px;"
          size="mini"
          v-if="field.foreignKey">
          ref: {{ field.foreignRef }}
        </el-tag>

        <el-tag size="mini"
          v-if="field.enums && field.enums.length">
          <span>enums:&nbsp;[&nbsp;</span>
          <span v-for="value in field.enums"
            :key="value">{{value}},&nbsp;</span>
          <span>&nbsp;]</span>
        </el-tag>

        <el-tag style="margin: 3px;"
          size="mini"
          v-if="field.example">example: {{ field.example }}</el-tag>
      </el-row>
    </div>
  </draggable>
</template>

<script>
import VueTypes from 'vue-types';
import draggable from 'vuedraggable';
import isEqual from 'lodash/isEqual';
import NotesPopover from './NotesPopover';

export default {
  props: {
    collection: VueTypes.object.isRequired,
    inEditMode: VueTypes.bool.isRequired,
  },
  components: {
    draggable,
    NotesPopover,
  },
  data: () => ({
    drag: false,
    fieldItems: [],
    tagOptions: [
      'min',
      'max',
      'minLength',
      'maxLength',
      'arrayDataType',
      'arrayMinLength',
      'arrayMaxLength',
    ],
  }),
  methods: {
    handleDragEnd() {
      // * Only save to db if the fields actuall moved. No false positives.

      if (!isEqual(this.fieldItems, this.collection.fields)) {
        this.$emit('moveFields', this.fieldItems);
      }
      this.drag = false;
    },
  },
  created() {
    this.fieldItems = this.collection.fields;
  },
  watch: {
    collection(value) {
      this.fieldItems = value.fields;
    },
  },
};
</script>

<style scoped>
.field-item {
  cursor: move;
  margin: 3px;
  padding: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border: 1px dashed lightgray;
  border-radius: 5px;
  background-color: white;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}
.small-icon {
  font-size: 12px;
  color: var(--primary);
  margin-right: 5px;
}
</style>
