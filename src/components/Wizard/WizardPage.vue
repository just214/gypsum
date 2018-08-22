<template>
  <div class="wrapper">
    <el-card style="border-radius: 20px">
      <el-button type="text"
        @click="$router.go(-1)">Go Back</el-button>

      <zoom-center-transition group
        mode="out-in">

        <div v-if="!finalResult"
          style="display: inline-block;width: 100%"
          key="intro">
          <div>

            <h3>
              <i class="fa fa-magic caption" />&nbsp;Let's try to narrow down which of the following data structures
              is best suited for the data you have in mind.</h3>
          </div>
        </div>

        <div v-else
          style="display: inline-block;width: 100%"
          key="finalResult">
          <p class="caption">The final result is:</p>
        </div>

        <div key="options"
          style="display: inline-block;width: 100%">
          <span v-for="option in availableOptions"
            :key="option">
            <el-tag style="margin: 5px;">{{option}}

            </el-tag>
          </span>
        </div>

        <div v-if="!inProgress"
          key="beginButton"
          style="margin: 10px;display: inline-block;width: 100%">

          <el-button @click="inProgress = true"
            type="success"
            round
            size="lg">Let's Go!</el-button>

        </div>
      </zoom-center-transition>

      <collapse-transition group
        mode="out-in">

        <div v-if="dataRelated === null && inProgress"
          key="dataRelated"
          style="display: inline-block;width: 100%">

          <div>
            <h3>Is this data related to a parent collection?</h3>
            <WizardTip title='If a user has many phone numbers, the answer would be "No" for
        users and "Yes" for phone numbers.' />
            <YesNoButtons @yes="dataRelated = true"
              @no="dataRelated = false" />
          </div>

        </div>

        <div v-if="sizeQueryIndiviual === null && dataRelated"
          key="sizeQueryIndiviual"
          style="display: inline-block;width: 100%">

          <p class="caption">So, the data is not related to any parent collections. Any data structure
            could still be a good option.</p>
          <h3>Could this data grow large over time?</h3>

          <WizardTip title='If the number of expected entries is fixed or not expected to grow rapidly over time, the answer is probably "No"'
          />

          <h3>Do you want to be able to query this data seperate from the related collection?
          </h3>
          <WizardTip title="If a user has many phone numbers, do you want to be able to query the user's phone numbers without having to also get the user document?"
          />

          <p class="caption">Choose "Yes" if either are true and "No" if neither are true.</p>
          <YesNoButtons @yes="sizeQueryIndiviual = true"
            @no="sizeQueryIndiviual = false" />

        </div>
        <div v-if="queryAcross === null && sizeQueryIndiviual"
          key="queryAcross"
          style="display: inline-block;width: 100%">

          <p class="caption">Cool, we've ruled out nested data. Now, it's down to either a Root-Level
            Collection or Subcollection.</p>
          <h3>Do you need to query or mutate multiple records of this data at once?</h3>
          <WizardTip title="If a user has many phone numbers, do you want to be able to query the phone numbers of several users at once?"
          />
          <YesNoButtons @yes="queryAcross = true"
            @no="queryAcross = false" />

        </div>

        <div v-if="listOfValues === null && sizeQueryIndiviual === false"
          key="list"
          style="display: inline-block;width: 100%">
          <h3>Is this data represented by a list of single values?</h3>
          <WizardTip title='A user has many roles. A company has many employeeIds. Can usually be represented as a boolean value.'
          />
          <YesNoButtons @yes="listOfValues = true"
            @no="listOfValues = false" />

        </div>

        <div v-if="queryDataByValues === null && listOfValues"
          key="qbv"
          style="display: inline-block;width: 100%">
          <p class="caption">It looks like we've narrowed it down to either a Map or a Array of Values.</p>
          <h3>Do you want to be able to query a collection by multiple items in the list
            of values at once?</h3>
          <WizardTip title='If a user has many roles, do you 
          want to be able to query users based on several roles in one query?' />
          <YesNoButtons @yes="queryDataByValues = true"
            @no="queryDataByValues = false" />
        </div>

        <div v-if="queryDataByNestedValues === null && listOfValues === false"
          key="qdbnv"
          style="display: inline-block;width: 100%">
          <h3>
            Do you want to be able to query a collection by this data?
          </h3>
          <YesNoButtons @yes="queryDataByNestedValues = true"
            @no="queryDataByNestedValues = false" />
        </div>

        <div v-if="finalResult"
          style="display: inline-block;width: 100%"
          key="startover">
          <el-button type="text"
            @click="startOver">
            <small>Start Over</small>
          </el-button>
        </div>

      </collapse-transition>

    </el-card>
  </div>
</template>


<script>
import WizardTip from './WizardTip';
import YesNoButtons from './YesNoButtons';

/*
TODO- Fix the animations
*/

const options = [
  'Root-Level Collection',
  'Subcollection',
  'Nested Array of Objects',
  'Nested Array of Values',
  'Nested Object',
  'Map',
];

export default {
  components: {
    WizardTip,
    YesNoButtons,
  },
  data: () => ({
    inProgress: false,
    dataRelated: null,
    sizeQueryIndiviual: null,
    queryAcross: null,
    listOfValues: null,
    queryDataByValues: null,
    queryDataByNestedValues: null,
    finalResult: '',
    options,
    availableOptions: options,
  }),
  watch: {
    dataRelated(value) {
      if (value) {
        this.availableOptions = this.options;
      } else if (value === false) {
        this.availableOptions = ['Root-Level Collection'];
      }
    },
    sizeQueryIndiviual(value) {
      if (value) {
        this.availableOptions = ['Root-Level Collection', 'Subcollection'];
      } else if (value === false) {
        this.availableOptions = [
          'Nested Array of Objects',
          'Nested Array of Values',
          'Nested Object',
          'Map',
        ];
      }
    },
    queryAcross(value) {
      if (value) {
        this.availableOptions = ['Root-Level Collection'];
      } else if (value === false) {
        this.availableOptions = ['Subcollection'];
      }
    },
    listOfValues(value) {
      if (value) {
        this.availableOptions = ['Nested Array of Values', 'Map'];
      } else if (value === false) {
        this.availableOptions = ['Nested Array of Objects', 'Nested Object'];
      }
    },
    queryDataByValues(value) {
      if (value) {
        this.availableOptions = ['Map'];
      } else if (value === false) {
        this.availableOptions = ['Nested Array of Values'];
      }
    },
    queryDataByNestedValues(value) {
      if (value) {
        this.availableOptions = ['Nested Object'];
      } else if (value === false) {
        this.availableOptions = ['Nested Array of Objects'];
      }
    },

    availableOptions(value) {
      const [firstItem] = value;
      if (value.length === 1) {
        this.finalResult = firstItem;
      }
    },
  },
  methods: {
    startOver() {
      this.inProgress = false;
      this.dataRelated = null;
      this.sizeQueryIndiviual = null;
      this.queryAcross = null;
      this.listOfValues = null;
      this.queryDataByValues = null;
      this.queryDataByNestedValues = null;
      this.finalResult = null;
      this.availableOptions = options;
    },
  },
};
</script>

<style scoped>
.caption {
  color: var(--warning);
}

.wrapper {
  padding: 10px;
  padding-top: 50px;
  text-align: center;
  background: var(--gray-1);
  min-height: 100vh;
}
</style>
