import shortid from 'shortid';
import { db, subscribe, create, setMerge } from '@/firebase';
import { Message } from 'element-ui';
import { sortCollection } from '@/utils';

const checkIfCollectionNameExists = (collections, newCollection) => {
  const existingCollectionWithSameName = collections.filter(
    col => col.name === newCollection.name && col.id !== newCollection.id,
  );

  if (existingCollectionWithSameName.length) {
    Message({
      message: `Oops..you already have a collection named ${
        newCollection.name
      }.`,
      type: 'error',
      duration: 1250,
      center: true,
    });

    return false;
  }
  return true;
};

export default {
  subscribeToCollections(context) {
    return new Promise(resolve => {
      // * Only get the collections that belong to the user.
      const collectionsRef = db
        .collection('collections')
        .where('ownerId', '==', context.rootState.auth.userData.id);

      const collectionsCallback = values => {
        this.pending = false;
        let collections = [];
        let subcollections = [];
        if (values.length > 0) {
          collections = values
            .filter(value => !value.parentId)
            .sort(sortCollection);
          subcollections = values
            .filter(value => value.parentId)
            .sort(sortCollection);
        }

        context.commit('UPDATE_COLLECTIONS', { collections, subcollections });
        resolve();
      };

      const databasesCallback = values => {
        context.commit('UPDATE_DATABASES', values);
      };
      const fieldsCallback = values => {
        context.commit('UPDATE_FIELDS', values);
      };
      const fieldsRef = db
        .collection('fields')
        .where('ownerId', '==', context.rootState.auth.userData.id);

      const databasesRef = db
        .collection('databases')
        .where('ownerId', '==', context.rootState.auth.userData.id);
      subscribe(databasesRef, databasesCallback);
      subscribe(collectionsRef, collectionsCallback);
      subscribe(fieldsRef, fieldsCallback);
    });
  },

  handleTreeChange(context, e) {
    const collectionNames = [];
    context.state.collections.forEach(col => {
      collectionNames.push(col.name);
    });
    if (collectionNames.includes(e.name)) {
      context.commit('UPDATE_TREE_SELECTION', e.name);
    }
  },
  handleSelectedDatabase(context, databaseId) {
    context.commit('UPDATE_SELECTED_DATABASE', databaseId);
  },

  async addCollection(context, newCollection) {
    const check = checkIfCollectionNameExists(
      context.getters.collections,
      newCollection,
    );
    if (!check) {
      return;
    }
    const id = `${newCollection.name}-${shortid.generate()}`;
    const updatedCollection = {
      ...newCollection,
      id,
      fullpath: newCollection.name,
      ownerId: context.rootState.auth.userData.id,
      databaseId: context.state.selectedDatabaseId,
    };

    const dbRef = db.collection('collections').doc(id);
    await create(dbRef, updatedCollection);
  },
  async addSubcollection(context, { subcollection, collection }) {
    const collectionsSubcollections = context.state.subcollections.filter(
      col => col.parentId === collection.id,
    );

    const existingSubcollectionsWithSameName = collectionsSubcollections
      ? collectionsSubcollections.filter(col => col.name === subcollection.name)
      : [];

    if (existingSubcollectionsWithSameName.length) {
      Message({
        message: `Oops..you already have a subcollection named ${
          subcollection.name
        }.`,
        type: 'error',
        duration: 1250,
        center: true,
      });

      return;
    }

    const id = `${collection.name}-${subcollection.name}-${shortid.generate()}`;

    const updatedSubcollection = {
      ...subcollection,
      id,
      parentId: collection.id,
      parentName: collection.name,
      fullpath: `${collection.name}/${subcollection.name}`,
      ownerId: context.rootState.auth.userData.id,
      databaseId: context.state.selectedDatabaseId,
    };

    const dbRef = db.collection('collections').doc(id);
    await create(dbRef, updatedSubcollection);
  },
  handleMoveField(context, { fields, collection }) {
    const order = [];
    fields.forEach(field => {
      order.push(field.id);
    });
    const ref = db.collection('collections').doc(collection.id);
    return setMerge(ref, { fieldOrder: order });
  },
  editCollectionName(context, { collection, newName, type = 'collections' }) {
    // * If collection name -  check against collections
    // * If subcollection name- check against subcollections that belong to
    // * the same collection (check parentId)
    const collectionsToCheck =
      type === 'subcollections'
        ? context.state.subcollections.filter(
            subcol => subcol.parentId === collection.parentId,
          )
        : context.state.collections;
    const check = checkIfCollectionNameExists(collectionsToCheck, {
      ...collection,
      name: newName,
    });
    if (!check) {
      return;
    }
    const dbRef = db.collection('collections').doc(collection.id);
    setMerge(dbRef, { name: newName });
  },
  deleteCollection(context, collection) {
    // need to also delete all fields in all collections that have a foreign reference
    // to any properties that were on the deleted subcollection.
    // Oh, also need to deal with all of the subcollections. Or maybe this was a subcollection?
    db.collection('collections')
      .doc(collection.id)
      .delete();
  },
};
