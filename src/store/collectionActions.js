import shortid from 'shortid';
import { db, subscribe, create, setMerge } from '@/firebase';
import { Message } from 'element-ui';
import { sortCollection } from '@/utils';

const checkIfCollectionNameExists = (collections, newCollection) => {
  const existingCollectionWithSameName = collections.filter(
    col => col.name === newCollection.name,
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

const checkIfDatabaseNameExists = (databases, databaseName) => {
  const databasesWithSameName = databases.find(
    thisDb => thisDb.name === databaseName,
  );
  if (databasesWithSameName) {
    Message({
      message: `Oops..you already have a database named ${databaseName}.`,
      type: 'error',
      duration: 1250,
      center: true,
    });
    return true;
  }
  return false;
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
            .filter(value => !value.parentKey)
            .sort(sortCollection);
          subcollections = values
            .filter(value => value.parentKey)
            .sort(sortCollection);
        }

        context.commit('UPDATE_COLLECTIONS', { collections, subcollections });
        resolve();
      };

      const databasesCallback = values => {
        context.commit('UPDATE_DATABASES', values);
      };
      const databasesRef = db
        .collection('databases')
        .where('ownerId', '==', context.rootState.auth.userData.id);
      subscribe(databasesRef, databasesCallback);
      subscribe(collectionsRef, collectionsCallback);
    });
  },
  addDatabase(context, databaseName) {
    if (checkIfDatabaseNameExists(context.state.databases, databaseName)) {
      return;
    }

    const id = `${databaseName}_${shortid.generate()}`;
    const dbRef = db.collection('databases').doc(id);
    create(dbRef, {
      id,
      name: databaseName,
      ownerId: context.rootState.auth.userData.id,
    });
  },
  editDatabaseName(context, newName) {
    if (checkIfDatabaseNameExists(context.state.databases, newName)) {
      return;
    }
    const dbRef = db
      .collection('databases')
      .doc(context.state.selectedDatabaseId);
    setMerge(dbRef, { name: newName });
  },
  deleteDatabase(context) {
    const batch = db.batch();

    const dbRef = db
      .collection('databases')
      .doc(context.state.selectedDatabaseId);
    batch.delete(dbRef);

    context.state.collections.forEach(col => {
      if (col.databaseId === context.state.selectedDatabaseId) {
        const ref = db.collection('collections').doc(col.key);
        batch.delete(ref);
      }
    });
    context.commit('UPDATE_SELECTED_DATABASE', null);
    batch.commit().then(() => {});
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
      context.state.collections,
      newCollection,
    );
    if (!check) {
      return;
    }
    const generatedKey = `${newCollection.name}-${shortid.generate()}`;
    // const generatedKey = `${newCollection.name}`;
    const updatedCollection = {
      ...newCollection,
      key: generatedKey,
      fullpath: newCollection.name,
      ownerId: context.rootState.auth.userData.id,
      databaseId: context.state.selectedDatabaseId,
    };

    const dbRef = db.collection('collections').doc(generatedKey);
    await create(dbRef, updatedCollection);
  },
  async addSubcollection(context, { subcollection, collection }) {
    const collectionsSubcollections = context.state.subcollections.filter(
      col => col.parentKey === collection.key,
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

    const generatedKey = `${collection.name}-${
      subcollection.name
    }-${shortid.generate()}`;
    // const generatedKey = `${collection.name}-${subcollection.name}`;
    const updatedSubcollection = {
      ...subcollection,
      key: generatedKey,
      parentKey: collection.key,
      parentName: collection.name,
      fullpath: `${collection.name}/${subcollection.name}`,
      ownerId: context.rootState.auth.userData.id,
    };

    const dbRef = db.collection('collections').doc(generatedKey);
    await create(dbRef, updatedSubcollection);
  },
  handleMoveField(context, { fields, collection }) {
    const ref = db.collection('collections').doc(collection.key);
    return setMerge(ref, { fields });
  },
  editCollectionName(context, { collection, newName, type = 'collections' }) {
    // * If collection name -  check against collections
    // * If subcollection name- check against subcollections that belong to
    // * the same collection (check parentKey)
    const collectionsToCheck =
      type === 'subcollections'
        ? context.state.subcollections.filter(
            subcol => subcol.parentKey === collection.parentKey,
          )
        : context.state.collections;
    const check = checkIfCollectionNameExists(collectionsToCheck, {
      ...collection,
      name: newName,
    });
    if (!check) {
      return;
    }
    const dbRef = db.collection('collections').doc(collection.key);
    setMerge(dbRef, { name: newName });
  },
  deleteCollection(context, collection) {
    // need to also delete all fields in all collections that have a foreign reference
    // to any properties that were on the deleted subcollection.
    // Oh, also need to deal with all of the subcollections. Or maybe this was a subcollection?
    db.collection('collections')
      .doc(collection.key)
      .delete();
  },
};
