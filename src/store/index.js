import Vue from 'vue';
import Vuex from 'vuex';
import baseModule from '@/store/modules/baseModule';
import { getTreeData } from '@/utils';
import authModule from '@/store/modules/auth/authModule';
import fieldActions from './fieldActions';
import collectionActions from './collectionActions';
import databaseActions from './databaseActions';

Vue.use(Vuex);

const storeData = {
  state: {
    databases: [],
    collections: [],
    fields: [],
    subcollections: [],
    treeSelection: null,
    selectedDatabaseId: '',
  },
  getters: {
    collections(state) {
      // * Only pull the root-level collections for the currently selected database

      // TODO - This function is kinda messy. It needs to be cleaned up and commented.
      const databaseCollections = state.collections.filter(
        col => col.databaseId === state.selectedDatabaseId,
      );

      // TODO -  REPEAT THIS LOGIC FOR THE SUBCOLLECTIONS.
      const newCollections = databaseCollections.map(col => {
        let fields = [];
        if (col.fieldOrder && col.fieldOrder.length) {
          col.fieldOrder.forEach(fieldId => {
            const foundField = state.fields.find(f => f.id === fieldId);
            if (foundField) {
              fields.push(foundField);
            }
          });
        } else {
          fields = state.fields.filter(field => field.collectionId === col.id);
        }

        return { ...col, fields };
      });
      return newCollections;
    },
    subcollections(state) {
      // * Only pull the subollections for the currently selected database
      const subcollections = state.subcollections.filter(
        col => col.databaseId === state.selectedDatabaseId,
      );
      const newCollections = subcollections.map(col => {
        let fields = [];
        if (col.fieldOrder && col.fieldOrder.length) {
          col.fieldOrder.forEach(fieldId => {
            const foundField = state.fields.find(f => f.id === fieldId);
            if (foundField) {
              fields.push(foundField);
            }
          });
        } else {
          fields = state.fields.filter(field => field.collectionId === col.id);
        }

        return { ...col, fields };
      });
      return newCollections;
    },
    selectedDatabaseName(state) {
      // * Get the database name for the currently selected database.
      const match = state.databases.find(
        db => db.id === state.selectedDatabaseId,
      );
      if (state.selectedDatabaseId && match) {
        return match.name;
      }
      return '';
    },

    treeData(state, getters) {
      // * Get the tree data for the collapsable tree in the side nav.
      return getTreeData(getters.collections, getters.subcollections);
    },
    clusterData(state, getters) {
      // * Get the tree data for the cluster data visualizer.
      return { name: 'collections', children: getters.treeData };
    },
    sortedCollectionsByTreeSelection(state, getters) {
      // * Provides the sorted list of collections for a database
      // * with the collection selected in the tree as the first item.
      // * This moves the currently selected item to the first position for
      // * a nice visualization.
      if (state.treeSelection) {
        const a = getters.collections.filter(
          col => col.name === state.treeSelection,
        );
        const b = getters.collections.filter(
          col => col.name !== state.treeSelection,
        );
        return [...a, ...b];
      }
      return getters.collections;
    },

    // * Get all collections, including subcollections for the
    // * currently selected database. This is for the "copy" functionality.
    allCollections(state, getters) {
      if (!getters.collections.length && !getters.subcollections.length) {
        return [];
      }
      return [...getters.collections, ...getters.subcollections];
    },

    // * Get all field values for the currently selected database.
    // * This is for the "copy" functionality.

    allFieldValues(state, getters) {
      const arr = [];
      [...getters.collections, ...getters.subcollections].forEach(col => {
        if (col.fields && col.fields.length) {
          col.fields.forEach(field => {
            arr.push(field);
          });
        }
      });
      return arr;
    },
  },
  mutations: {
    UPDATE_COLLECTIONS(state, payload) {
      state.collections = payload.collections;
      state.subcollections = payload.subcollections;
    },
    UPDATE_TREE_SELECTION(state, payload) {
      state.treeSelection = payload;
    },
    UPDATE_DATABASES(state, payload) {
      state.databases = payload;
    },
    UPDATE_SELECTED_DATABASE(state, payload) {
      state.selectedDatabaseId = payload;
    },
    UPDATE_FIELDS(state, payload) {
      state.fields = payload;
    },
  },
  actions: {
    ...fieldActions,
    ...collectionActions,
    ...databaseActions,
  },
};

const auth = baseModule(authModule);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  ...storeData,
  modules: {
    auth,
  },
});
