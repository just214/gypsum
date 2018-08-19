import { db, setMerge } from '@/firebase';
import shortid from 'shortid';
import { Message, Notification } from 'element-ui';

const fieldAlreadyExists = (newField, collection) => {
  if (!collection.fields) return false;
  const existingFieldWithSameName = collection.fields.filter(
    field =>
      field.fieldName === newField.fieldName && field.key !== newField.key,
  );

  if (existingFieldWithSameName.length) {
    Message({
      message: `Oops..this collection already has a field named ${
        newField.fieldName
      }.`,
      type: 'error',
      duration: 1250,
      center: true,
    });
    return true;
  }
  return false;
};

export default {
  addField(context, { field, collection, callback }) {
    if (fieldAlreadyExists(field, collection)) {
      return;
    }
    const updatedField = {
      ...field,
      //* create a new key last in case it was a copy and contains a key already.
      key: shortid.generate(),
      parentKey: collection.key,
      parentFullPath: collection.fullpath,
    };

    let newFields = [];

    if (collection.fields) {
      newFields = [...collection.fields, updatedField];
    } else {
      newFields = [updatedField];
    }
    const dbRef = db.collection('collections').doc(collection.key);
    setMerge(dbRef, { fields: newFields }).then(() => {
      callback();
    });
  },
  editField(context, { field, collection, callback }) {
    if (fieldAlreadyExists(field, collection)) {
      return;
    }
    const newFields = collection.fields.map(f => {
      if (f.key === field.key) {
        return field;
      }
      return f;
    });
    const dbRef = db.collection('collections').doc(collection.key);
    setMerge(dbRef, { fields: newFields }).then(() => {
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

    // * Find all fields that reference this field as a foreignKey
    const foreignKeyReferences = context.getters.allFieldValues.filter(
      f => f.foreignKey === field.key,
    );

    // * Find all fields that reference this field as a foreignCopy
    const foreignCopyReferences = context.getters.allFieldValues.filter(
      f => f.foreignCopy === field.key,
    );

    const handleBatchReferenceDelete = (arr, type) => {
      arr.forEach(refField => {
        const newField = { ...refField, [`${type}`]: null, foreignRef: null };

        const fieldsCollection = context.getters.allCollections.find(
          col => col.key === newField.parentKey,
        );
        const collectionsFields = fieldsCollection.fields;
        const newFields = collectionsFields.map(thisField => {
          if (thisField.key === newField.key) {
            return newField;
          }
          return thisField;
        });
        const ref = db.collection('collections').doc(refField.parentKey);
        batch.set(ref, { fields: { ...newFields } }, { merge: true });
      });
    };

    if (foreignKeyReferences.length) {
      handleBatchReferenceDelete(foreignKeyReferences, 'foreignKey');
    }

    if (foreignCopyReferences.length) {
      handleBatchReferenceDelete(foreignCopyReferences, 'foreignCopy');
    }

    const dbRef = db.collection('collections').doc(collection.key);
    const newFields = collection.fields.filter(f => f.key !== field.key);

    batch.set(dbRef, { fields: newFields }, { merge: true });

    batch.commit().then(() => {
      const handleForeignKey = () => {
        let foreignKeyRefNames = 'foreignKey references removed:\n\n';

        if (foreignKeyReferences.length) {
          foreignKeyReferences.forEach(ref => {
            foreignKeyRefNames = foreignKeyRefNames.concat(
              `${ref.parentFullPath}/${ref.fieldName}`,
            );
          });
        }
        return foreignKeyReferences.length ? foreignKeyRefNames : '';
      };
      const handleForeignCopy = () => {
        let foreignCopyRefNames = 'foreignCopy references removed:\n\n';

        if (foreignCopyReferences.length) {
          foreignCopyReferences.forEach(ref => {
            foreignCopyRefNames = foreignCopyRefNames.concat(
              `${ref.parentFullPath}/${ref.fieldName}`,
            );
          });
        }
        return foreignCopyReferences.length ? foreignCopyRefNames : '';
      };

      Notification({
        title: 'Title',
        message: handleForeignKey() + handleForeignCopy(),
      });
    });
    // TODO need to handle the error.
  },
};
