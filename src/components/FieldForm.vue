<template>
  <div style="margin: 10px">
    <b>{{isEditFieldMode ? 'Edit ' : 'Add a '}}Field</b>

    <CopySelect :allFieldValues="allFieldValues"
      @change="handleCopy" />

    <el-input placeholder="Field Name"
      style="width: 100%; margin: 4px 0px;"
      size="small"
      ref="nameInput"
      @keyup.enter.native="handleSave"
      v-model="fieldValues.name" />

    <el-select v-model="fieldValues.dataType"
      filterable
      clearable
      size="mini"
      style="width: 100%; margin: 4px 0px;"
      placeholder="Data Type">
      <el-option v-for="dataType in dataTypes"
        :key="dataType"
        :value="dataType">
      </el-option>
    </el-select>

    <el-select v-model="fieldValues.foreignKey"
      clearable
      size="mini"
      style="width: 100%; margin: 4px 0px;"
      v-if="allFieldValues.length"
      placeholder="Foreign Key">
      <el-option v-for='value in allFieldValues'
        :key='value.id + value.collection'
        :label="value.collection + '/' + value.name"
        :value="value.id">
      </el-option>
    </el-select>

    <el-select v-model="fieldValues.foreignCopy"
      clearable
      size="mini"
      style="width: 100%; margin: 4px 0px;"
      v-if="allFieldValues.length"
      placeholder="Foreign Copy">
      <el-option v-for='value in allFieldValues'
        :key='value.id + value.collection'
        :label="value.collection + '/' + value.name"
        :value="value.id">
      </el-option>
    </el-select>

    <div style="margin:4px 0px;">
      <el-input placeholder="Example"
        ref="example"
        size="mini"
        v-model="fieldValues.example" />
    </div>

    <el-row justify="center"
      style="margin-top: 10px;">
      <el-col :span="12">

        <el-switch v-model="fieldValues.primaryKey">
        </el-switch>
        <small :style="{color: fieldValues.primaryKey
              ? 'var(--primary)'
              : 'var(--gray-5)'}">&nbsp;Primary Key</small>

      </el-col>
      <el-col :span="12">

        <el-switch v-model="fieldValues.required">
        </el-switch>
        <small :style="{color: fieldValues.required
              ? 'var(--primary)'
              : 'var(--gray-5)'}">&nbsp;Required</small>

      </el-col>
    </el-row>

    <zoom-center-transition mode="out-in">

      <div style="margin: 5px;"
        v-if="['string', 'array', 'number', 'integer', 'float'].includes(fieldValues.dataType)">
        <el-tag :key="tag"
          v-for="tag in fieldValues.enums"
          closable
          :disable-transitions="false"
          @close="handleClose(tag, fieldValues.enums)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag"
          v-if="enumInputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="mini"
          @keyup.enter.native="handleInputConfirm(fieldValues.enums)"
          @blur="handleInputConfirm(fieldValues.enums)">
        </el-input>
        <el-button v-else
          class="button-new-tag"
          size="small"
          @click="showEnumInput">+ Enum</el-button>
      </div>
    </zoom-center-transition>

    <zoom-center-transition mode="out-in">
      <div v-if="['integer', 'float', 'number'].includes(fieldValues.dataType)"
        style="margin-top: 10px;">
        <b>Number Rules</b>
        <el-row :gutter="12">
          <el-col :span="12">
            <small>min</small>
            <el-input-number v-model="fieldValues.min"
              size="mini"
              style="width: 100%; margin: 4px 0px;"
              :min="0"></el-input-number>
          </el-col>
          <el-col :span="12">
            <small>max</small>
            <el-input-number v-model="fieldValues.max"
              :min="0"
              size="mini"
              style="width: 100%; margin: 4px 0px;"></el-input-number>
          </el-col>
        </el-row>
      </div>
    </zoom-center-transition>

    <zoom-center-transition mode="out-in">
      <div v-if="fieldValues.dataType === 'string'"
        style="margin-top: 10px;">
        <b>String Rules</b>
        <el-row :gutter="12">
          <el-input placeholder="Match (regex)"
            size="mini"
            style="width: 100%; margin: 4px 0px;"
            v-model="fieldValues.match" />
          <el-input placeholder="Starts With"
            size="mini"
            style="width: 100%; margin: 4px 0px;"
            v-model="fieldValues.startsWith" />
          <el-input placeholder="Ends With"
            size="mini"
            style="width: 100%; margin: 4px 0px;"
            v-model="fieldValues.endsWith" />
          <el-col :span="12">
            <small>min length</small>
            <el-input-number v-model="fieldValues.minLength"
              size="mini"
              style="width: 100%; margin: 4px 0px;"
              :min="0"></el-input-number>
          </el-col>
          <el-col :span="12">
            <small>max length</small>
            <el-input-number v-model="fieldValues.maxLength"
              :min="0"
              size="mini"
              style="width: 100%; margin: 4px 0px;"></el-input-number>
          </el-col>
        </el-row>
      </div>
    </zoom-center-transition>

    <zoom-center-transition mode="out-in">
      <div v-if="fieldValues.dataType === 'array'"
        style="margin-top: 10px;">
        <b>Array Rules</b>
        <el-select v-model="fieldValues.arrayDataType"
          clearable
          filterable
          size="mini"
          style="width: 100%; margin: 4px 0px;"
          placeholder="Array Item Data Type">
          <el-option v-for="dataType in arrayDataTypes"
            :key="dataType"
            :value="dataType">
          </el-option>
        </el-select>
        <el-row :gutter="12">
          <el-col :span="12">
            <small>array min length</small>
            <el-input-number v-model="fieldValues.arrayMinLength"
              size="mini"
              style="width: 100%; margin: 4px 0px;"
              :min="0"></el-input-number>
          </el-col>
          <el-col :span="12">
            <small>array max length</small>

            <el-input-number v-model="fieldValues.arrayMaxLength"
              :min="0"
              size="mini"
              style="width: 100%; margin: 4px 0px;"></el-input-number>
          </el-col>
        </el-row>
      </div>
    </zoom-center-transition>

    <div style="margin-top: 10px">
      <el-input v-model="fieldValues.notes"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 20}"
        size="mini"
        placeholder="Notes.." />
    </div>

    <div style="display: flex;align-items:center; justify-content:center;margin-top: 10px;">

      <el-button type="success"
        size="mini"
        round
        native-type="submit"
        @click.prevent="handleSave">Save</el-button>
      <el-button type="text"
        style="color:var(--danger)"
        @click="$emit('cancel')">Cancel</el-button>
    </div>
  </div>

</template>

<script>
import VueTypes from 'vue-types';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import CopySelect from './CopySelect';

const INITIAL_FIELD_VALUES = {
  dataType: '',
  name: '',
  required: false,
  min: null,
  max: null,
  minLength: null,
  maxLength: null,
  arrayDataType: null,
  arrayMinLength: null,
  arrayMaxLength: null,
  enums: [],
  foreignKey: null,
  foreignRef: null,
  foreignCopy: null,
  example: '',
  match: '',
  // string
  startsWith: '',
  endsWith: '',
  notes: '',
};

export default {
  props: {
    model: VueTypes.object,
    collection: VueTypes.object.isRequired,
    collections: VueTypes.arrays,
    allFieldValues: VueTypes.array,
  },
  components: {
    CopySelect,
  },
  mounted() {
    if (this.model) {
      // * Need to break the reference so that the field values do not change
      // * until saved.
      this.fieldValues = { ...this.fieldValues, ...cloneDeep(this.model) };
    }
  },
  data: () => ({
    enumInputVisible: false,
    inputValue: '',
    fieldValues: INITIAL_FIELD_VALUES,
    dataTypes: [
      'string',
      'number',
      'float',
      'integer',
      'boolean',
      'map',
      'object',
      'array',
      'null',
      'timestamp',
      'geopoint',
      'reference',
    ],
  }),
  computed: {
    arrayDataTypes() {
      return [...this.dataTypes, 'mixed'].filter(type => type !== 'array');
    },
    isEditFieldMode() {
      return !isEmpty(this.model);
    },
  },

  methods: {
    handleClose(tag, ref) {
      ref.splice(this.fieldValues.enums.indexOf(tag), 1);
    },
    clearForm() {
      this.fieldValues = INITIAL_FIELD_VALUES;
    },
    showEnumInput() {
      this.enumInputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleCopy(values) {
      this.fieldValues = values;
    },

    handleInputConfirm() {
      const { inputValue } = this;
      if (inputValue) {
        this.fieldValues.enums.push(inputValue);
      }
      this.enumInputVisible = false;
      this.inputValue = '';
    },

    handleSave() {
      const callback = () => {
        if (isEmpty(this.model)) {
          this.clearForm();
        }
      };
      this.$emit('submit', this.fieldValues, callback);
      this.inputValue = '';
      this.showInput = false;
    },
  },
  created() {
    setTimeout(() => {
      this.$refs.nameInput.$refs.input.focus();
    }, 10);
  },
  watch: {
    'fieldValues.primaryKey'(value) {
      if (value) {
        const currentFieldWithPrimaryKey = this.collection.fields.find(
          field => field.primaryKey,
        );
        if (
          currentFieldWithPrimaryKey &&
          currentFieldWithPrimaryKey.id !== this.fieldValues.id
        ) {
          this.fieldValues.primaryKey = false;
          this.$message({
            type: 'error',
            duration: 3000,
            message: `${
              currentFieldWithPrimaryKey.name
            } is already a primary key. Please adjust that field first.`,
          });
        }
        this.fieldValues.foreignKey = null;
        this.fieldValues.foreignCopy = null;
        this.fieldValues.foreignRef = null;
      }
    },
    'fieldValues.foreignKey'(value) {
      if (value) {
        const thisRef = this.allFieldValues.filter(
          field => field.id === value,
        )[0];

        this.fieldValues.foreignRef = `${thisRef.collection}/${thisRef.name}`;
        this.fieldValues.foreignCopy = null;
      }
    },
    'fieldValues.foreignCopy'(value) {
      if (value) {
        if (this.fieldValues.foreignCopy === value) {
          return;
        }
        const thisRef = this.allFieldValues.filter(
          field => field.id === value,
        )[0];
        const { key, ...rest } = thisRef;
        this.fieldValues = {
          ...rest,
          key: this.fieldValues.id,
          foreignCopy: value,
        };
      }
    },
    'fieldValues.dataType'(value, oldValue) {
      if (value !== oldValue) {
        if (value !== 'string') {
          this.fieldValues.minLength = null;
          this.fieldValues.maxLength = null;
          this.fieldValues.startsWith = null;
          this.fieldValues.endsWith = null;
          this.fieldValues.match = null;
        }

        if (value !== 'array') {
          this.fieldValues.arrayMinLength = null;
          this.fieldValues.arrayMaxLength = null;
          this.fieldValues.arrayDataType = null;
        }

        if (value !== 'number') {
          this.fieldValues.min = null;
          this.fieldValues.max = null;
        }
      }
    },
  },
};
</script>


<style scoped>
.el-tag + .el-tag {
  margin: 3px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
