import Vue from 'vue';
import Vuex from 'vuex';
import baseModule from '@/store/modules/baseModule';
import { getTreeData } from '@/utils';
import authModule from '@/store/modules/auth/authModule';
import fieldActions from './fieldActions';
import collectionActions from './collectionActions';

Vue.use(Vuex);

const storeData = {
  state: {
    databases: [],
    collections: [],
    subcollections: [],
    treeSelection: null,
    selectedDatabaseId: '',
  },
  getters: {
    collections(state) {
      return state.collections.filter(
        col => col.databaseId === state.selectedDatabaseId,
      );
    },
    selectedDatabaseName(state) {
      if (state.selectedDatabaseId) {
        return state.databases.find(db => db.id === state.selectedDatabaseId)
          .name;
      }
      return '';
    },
    subcollections(state) {
      return state.subcollections.filter(
        col => col.databaseId === state.selectedDatabaseId,
      );
    },
    treeData(state, getters) {
      return getTreeData(getters.collections, getters.subcollections);
    },
    clusterData(state, getters) {
      return { name: 'collections', children: getters.treeData };
    },
    sortedCollectionsByTreeSelection(state, getters) {
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

    allCollections(state, getters) {
      if (!getters.collections.length && !getters.subcollections.length) {
        return [];
      }
      return [...getters.collections, ...getters.subcollections];
    },
    allFieldValues(state, getters) {
      const arr = [];
      [...getters.collections, ...getters.subcollections].forEach(col => {
        // if (col.key === this.collection.key) return;
        if (col.fields && col.fields.length) {
          col.fields.forEach(field => {
            const collectionName = col.parentName
              ? `${col.parentName}/${col.name}`
              : col.name;

            arr.push({ ...field, collection: collectionName });
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
  },
  actions: {
    ...fieldActions,
    ...collectionActions,
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
