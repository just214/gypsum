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
      v-if="!ui.isForeignCopy"
      filterable
      clearable
      size="mini"
      style="width: 100%; margin: 4px 0px;"
      placeholder="Data Type">
      <el-option v-for="dataType in dataTypes2"
        :key="dataType.name"
        :value="dataType.name"
        style="width: 250px;height: auto;">
        <b>{{dataType.name}}</b>&nbsp;&nbsp;
        <div>
          <el-tag v-for="example in dataType.examples"
            :key="example"
            size="mini">{{example}}</el-tag>
        </div>

      </el-option>
    </el-select>

    <el-row style="margin-top: 10px;">

      <el-col :span="12">
        <el-switch v-model="fieldValues.primaryKey">
        </el-switch>

        <small :style="{color: fieldValues.primaryKey
              ? 'var(--primary)'
              : 'var(--gray-5)'}">&nbsp;&nbsp;Primary Key</small>

      </el-col>

      <el-col :span="12">
        <el-switch v-model="fieldValues.required">
        </el-switch>
        <small :style="{color: fieldValues.required
              ? 'var(--primary)'
              : 'var(--gray-5)'}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Required</small>

      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">

      <el-col :span="12">
        <el-switch v-model="ui.isForeignCopy" />
        <small :style="{color: ui.isForeignCopy
              ? 'var(--primary)'
              : 'var(--gray-5)',width: '70px'}">&nbsp;Foreign Copy</small>

      </el-col>

      <el-col :span="12">
        <el-switch v-model="ui.isForeignKey" />
        <small :style="{color: ui.isForeignKey
              ? 'var(--primary)'
              : 'var(--gray-5)'}">&nbsp;Foreign Key</small>

      </el-col>
    </el-row>

    <zoom-center-transition mode="out-in">
      <el-select v-model="fieldValues.foreignCopy"
        v-if="ui.isForeignCopy && allFieldValues.length"
        clearable
        size="mini"
        style="width: 100%; margin: 4px 0px;"
        placeholder="Foreign Copy">
        <el-option v-for='value in allFieldValues'
          :key='value.id + value.collectionFullpath'
          :label="value.collectionFullpath + '/' + value.name"
          :value="value.id">
        </el-option>
      </el-select>

      <el-select v-model="fieldValues.foreignKey"
        v-if="ui.isForeignKey && allFieldValues.length"
        clearable
        size="mini"
        style="width: 100%; margin: 4px 0px;"
        placeholder="Foreign Key">
        <el-option v-for='value in allFieldValues'
          :key='value.id + value.collectionFullpath'
          :label="value.collectionFullpath + '/' + value.name"
          :value="value.id">
        </el-option>
      </el-select>
    </zoom-center-transition>
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
        <div v-if="enumInputVisible"
          style="display: flex; align-items: center;justify-content: center">
          <el-input class="input-new-tag"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm(fieldValues.enums)">
          </el-input>&nbsp;
          <i @click="handleInputConfirm(fieldValues.enums)"
            class="fa fa-check"
            style="color: var(--success);cursor: pointer;margin: 0px 5px;" />
          <i @click="enumInputVisible = false; inputValue = '' "
            class="fa fa-times"
            style="color: var(--danger);cursor: pointer;margin: 0px 5px;" />
        </div>

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
              :min="0"
              style="width: 100%; margin: 4px 0px;"></el-input-number>
          </el-col>
          <el-col :span="12">
            <small>max</small>
            <el-input-number v-model="fieldValues.max"
              size="mini"
              :min="0"
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
            :label="dataType"
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

    <div style="margin:10px 0px;">
      <el-input placeholder="Example"
        ref="example"
        size="mini"
        v-model="fieldValues.example" />
    </div>

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
import upperFirst from 'lodash/upperFirst';
import isEmpty from 'lodash/isEmpty';
import pluralize from 'pluralize';
import CopySelect from '@/components/UI/CopySelect';

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
  primaryKey: null,
  foreignKey: null,
  foreignKeyRef: null,
  foreignCopy: null,
  foreignCopyRef: null,
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
    ui: {
      isForeignKey: false,
      isForeignCopy: false,
    },
    enumInputVisible: false,
    inputValue: '',
    fieldValues: INITIAL_FIELD_VALUES,
    dataTypes2: [
      { name: 'string', examples: ['"This is a string."'] },
      { name: 'number', examples: [11, -48, 0, 3.43] },
      { name: 'float', examples: [2.3, -3.0] },
      { name: 'integer', examples: [11, -7, 0] },
      { name: 'boolean', examples: [true, false] },
      { name: 'map', examples: ['{ admin: false, editor: true }'] },
      { name: 'object', examples: ['{ firstName: "Bob", age: 48 }'] },
      {
        name: 'array',
        examples: ['[ "hi", 22, {a: "b"}, true ]'],
      },
      {
        name: 'null',
        examples: ['null'],
      },
      {
        name: 'timestamp',
        examples: ['Thu Aug 23 2018 00:59:59 GMT-0400...'],
      },
      {
        name: 'geopoint',
        examples: [],
      },
      { name: 'reference', examples: ['/databases/$(database)/documents/...'] },
    ],
  }),
  computed: {
    arrayDataTypes() {
      return [
        'string',
        'number',
        'float',
        'integer',
        'boolean',
        'map',
        'object',
        'mixed',
        '',
      ];
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
        if (this.fieldValues.enums.includes(inputValue)) {
          this.$message.error(
            `There is already an enum with the name "${inputValue}".`,
          );
          return;
        }
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
    'fieldValues.emums'() {
      // TODO- Make sure each enum matches the dataType selected, if any.
      // if (!values.length) return;
      // if (!this.fieldValues.dataType) return;
      // values.forEach(value => {
      //   if ()
      // })
    },
    'fieldValues.primaryKey'(value) {
      if (value) {
        this.ui.isForeignKey = false;
        this.ui.isForeignCopy = false;
        const currentFieldWithPrimaryKey = this.collection.fields.find(
          field => field.primaryKey,
        );
        if (
          currentFieldWithPrimaryKey &&
          currentFieldWithPrimaryKey.id !== this.fieldValues.id
        ) {
          this.fieldValues.primaryKey = null;
          this.$message({
            type: 'error',
            duration: 3000,
            message: `${
              currentFieldWithPrimaryKey.name
            } is already a primary key. Please adjust that field first.`,
          });
        }
      }
    },
    'fieldValues.foreignKey'(value) {
      if (value) {
        this.ui.isForeignCopy = false;
        this.ui.isForeignKey = true;

        const thisRef = this.allFieldValues.filter(
          field => field.id === value,
        )[0];

        this.fieldValues.foreignKeyRef = `${thisRef.collectionFullpath}/${
          thisRef.name
        }`;
        this.fieldValues.name = `${pluralize.singular(
          thisRef.collectionFullpath,
        )}${upperFirst(thisRef.name)}`;
        this.fieldValues.foreignCopy = null;
      }
    },
    'ui.isForeignKey'(value) {
      if (value) {
        this.ui.isForeignCopy = false;
        this.fieldValues.primaryKey = null;
        this.fieldValues.foreignCopy = null;
        this.fieldValues.foreignCopyRef = null;
      } else {
        this.fieldValues.foreignKey = null;
        this.fieldValues.foreignKeyRef = null;
      }
    },
    'ui.isForeignCopy'(value) {
      if (value) {
        this.ui.isForeignCopy = true;
        this.ui.isForeignKey = false;
        this.fieldValues.primaryKey = null;
        this.fieldValues.foreignKey = null;
        this.fieldValues.foreignKeyRef = null;
      } else {
        this.fieldValues.foreignCopy = null;
        this.fieldValues.foreignCopyRef = null;
      }
    },
    'fieldValues.foreignCopy'(value) {
      if (value) {
        this.ui.isForeignKey = false;
        this.ui.isForeignCopy = true;

        const thisRef = this.allFieldValues.filter(
          field => field.id === value,
        )[0];

        this.fieldValues = {
          name: `${pluralize.singular(thisRef.collectionFullpath)}${upperFirst(
            thisRef.name,
          )}`,
          id: this.fieldValues.id,
          foreignCopy: value,
        };

        this.fieldValues.foreignCopyRef = `${thisRef.collectionFullpath}/${
          thisRef.name
        }`;
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
