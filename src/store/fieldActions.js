import { db, setMerge } from '@/firebase';
import shortid from 'shortid';
import { Message, Notification } from 'element-ui';
import cloneDeep from 'lodash/cloneDeep';

const fieldAlreadyExists = (newField, collection) => {
  if (!collection.fields) return false;

  const existingFieldWithSameName = collection.fields.find(
    field => field.name === newField.name,
  );

  if (
    existingFieldWithSameName &&
    existingFieldWithSameName.id !== newField.id
  ) {
    Message({
      message: `Oops..this collection already has a field named ${
        newField.name
      }.`,
      type: 'error',
      duration: 1250,
      center: true,
    });
    return true;
  }
  return false;
};

const removeEmptyProperties = (field, collection) => {
  const newField = {};
  Object.keys(field).forEach(key => {
    if (key === 'enums') {
      if (!field[key].length) {
        return;
      }
    } else if (!field[key]) {
      if (field.id) {
        const collectionField = collection.fields.find(f => f.id === field.id);
        if (collectionField[key]) {
          newField[key] = null;
        }
      }

      return;
    }
    newField[key] = field[key];
  });
  return newField;
};

export default {
  addField(context, { field, collection, callback }) {
    // TODO -  The callback is for UI only. Switch to promise if possible since $emitters.
    const modifiedField = removeEmptyProperties(field, collection);
    /*
    * This addField method is responsible for:
    * - Adding the new field to the field collection with the collection's data...
    * - Updating the collection's 'fieldOrder' array with the id of the new field. 
    */
    if (fieldAlreadyExists(field, collection)) {
      return;
    }

    // * Generate a unique id for this new field.

    const id = `${field.name}_${shortid.generate()}`;

    const updatedField = {
      ...modifiedField,

      id,
      collectionId: collection.id,
      collectionFullpath: collection.fullpath,
      databaseId: context.state.selectedDatabaseId,
      ownerId: context.rootState.auth.userData.id,
    };

    const batch = db.batch();

    const fieldRef = db.collection('fields').doc(id);

    batch.set(fieldRef, updatedField);

    const colRef = db.collection('collections').doc(collection.id);
    const oldFieldOrder =
      collection.fieldOrder && collection.fieldOrder.length
        ? collection.fieldOrder
        : [];

    const newFieldOrder = [...oldFieldOrder, updatedField.id];

    batch.set(colRef, { fieldOrder: newFieldOrder }, { merge: true });

    batch.commit().then(() => {
      callback();
    });
  },

  editField(context, { field, collection, callback }) {
    const modifiedField = removeEmptyProperties(field, collection);

    if (fieldAlreadyExists(field, collection)) {
      return;
    }

    const fieldRef = db.collection('fields').doc(field.id);
    setMerge(fieldRef, modifiedField).then(() => {
      callback();
    });
  },
  async deleteField(context, { field, collection }) {
    // * This method is responsible for:
    // * Finding any fields that reference the deleted field as either a foreignKey
    // * or foreignCopy. Set these values to null to break the reference to the
    // * deleted field.
    // * It also deletes the field, of course. All of this happens as a batch
    // * so it all fails or all succeeds.

    const batch = db.batch();

    if (collection.fieldOrder && collection.fieldOrder.length) {
      const thisFields = cloneDeep(collection.fieldOrder);
      const index = thisFields.indexOf(field.id);
      if (index > -1) {
        thisFields.splice(index, 1);
      }
      const collectionRef = db.collection('collections').doc(collection.id);
      batch.set(collectionRef, { fieldOrder: thisFields }, { merge: true });
    }

    // * Find all fields that reference this field as a foreignKey
    const foreignKeyReferences = context.state.fields.filter(
      f => f.foreignKey === field.id,
    );

    // * Find all fields that reference this field as a foreignCopy
    const foreignCopyReferences = context.state.fields.filter(
      f => f.foreignCopy === field.id,
    );

    const handleBatchReferenceDelete = (arr, type) => {
      arr.forEach(refField => {
        const ref = db.collection('fields').doc(refField.id);
        batch.set(
          ref,
          {
            [`${type}`]: null,
            [`${type}Ref`]: null,
          },
          { merge: true },
        );
      });
    };

    if (foreignKeyReferences.length) {
      handleBatchReferenceDelete(foreignKeyReferences, 'foreignKey');
    }

    if (foreignCopyReferences.length) {
      handleBatchReferenceDelete(foreignCopyReferences, 'foreignCopy');
    }

    const fieldRef = db.collection('fields').doc(field.id);

    batch.delete(fieldRef);

    batch
      .commit()
      .then(() => {
        const handleForeignKey = () => {
          let foreignKeyRefNames =
            'These foreignKey references were removed:\n\n';

          if (foreignKeyReferences.length) {
            foreignKeyReferences.forEach(ref => {
              foreignKeyRefNames = foreignKeyRefNames.concat(
                `${ref.collectionFullpath}/${ref.name}  `,
              );
            });
          }
          return foreignKeyReferences.length ? foreignKeyRefNames : '';
        };
        const handleForeignCopy = () => {
          let foreignCopyRefNames =
            'These foreignCopy references were removed:\n\n';

          if (foreignCopyReferences.length) {
            foreignCopyReferences.forEach(ref => {
              foreignCopyRefNames = foreignCopyRefNames.concat(
                `${ref.collectionFullpath}/${ref.name}  `,
              );
            });
          }
          return foreignCopyReferences.length ? foreignCopyRefNames : '';
        };
        if (handleForeignKey() || handleForeignCopy()) {
          Notification({
            message: handleForeignKey() + handleForeignCopy(),
          });
        }
      })
      .catch(error => {
        Message({
          message: error.message,
          type: 'error',
          duration: 3000,
          center: true,
        });
      });
  },
};
