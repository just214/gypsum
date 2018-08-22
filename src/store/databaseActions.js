import shortid from 'shortid';
import { db, create, setMerge } from '@/firebase';
import { Message } from 'element-ui';

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
    if (
      checkIfDatabaseNameExists(
        context.state.databases,
        newName,
        context.state.selectedDatabaseId,
      )
    ) {
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
        const ref = db.collection('collections').doc(col.id);
        batch.delete(ref);
      }
    });

    context.state.fields.forEach(field => {
      if (field.databaseId === context.state.selectedDatabaseId) {
        const ref = db.collection('fields').doc(field.id);
        batch.delete(ref);
      }
    });
    context.commit('UPDATE_SELECTED_DATABASE', null);
    batch.commit().then(() => {});
  },
};
