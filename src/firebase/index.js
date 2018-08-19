// firebase.firestore.FieldValue.arrayUnion()
// firebase.firestore.FieldValue.arrayRemove()
// atomically add and remove elements from an array field in a document.
// Added 'array-contains' query operator for use with .where() to
// find documents where an array field contains a specific element.

import * as firebase from 'firebase/app';
import { Notification } from 'element-ui';

import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyD6vsGWMoOQb_iTfrq5dMB5teX3v4oCIeY',
  authDomain: 'gypsum-app.firebaseapp.com',
  databaseURL: 'https://gypsum-app.firebaseio.com',
  projectId: 'gypsum-app',
  storageBucket: 'gypsum-app.appspot.com',
  messagingSenderId: '857572560974',
};

firebase.initializeApp(config);

// firebase.firestore.setLogLevel('debug');

// * Instances
const db = firebase.firestore();

const { auth } = firebase;

// * Required by Firebase
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const getCreatedStamp = () => ({
  createdAt: new Date().toString(),
});

const getModifiedStamp = () => ({
  lastModifiedAt: new Date().toString(),
});

/*
* This function is called by all of the db base functions.
*/
const handleAsync = async callback => {
  try {
    await callback;
    // Message({
    //   message: 'Saved!',
    //   type: 'success',
    //   duration: 300,
    //   center: true,
    // });
  } catch (error) {
    Notification.error({
      title: 'Oops...something went wrong.',
      message: error.message,
    });
  }
};

const get = ref =>
  ref
    .get()
    .then(doc => {
      if (doc.empty) {
        return null;
      }
      return doc.data();
    })
    .catch(error => {
      Notification.error({
        title: 'Oops...something went wrong.',
        message: error.message,
      });
    });

const list = ref =>
  ref
    .get()
    .then(querySnapshot => {
      const results = [];
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        results.push(doc.data());
      });
      return results;
    })
    .catch(error => {
      Notification.error({
        title: 'Oops...something went wrong.',
        message: error.message,
      });
    });

const set = (ref, values) => {
  const callback = ref.set({ ...values, ...getModifiedStamp() });
  return handleAsync(callback);
};

const setMerge = (ref, values) => {
  const callback = ref.set(
    { ...values, ...getModifiedStamp() },
    { merge: true },
  );
  return handleAsync(callback);
};

const update = (ref, values) => {
  const callback = ref.set({ ...values, ...getModifiedStamp() });
  return handleAsync(callback);
};

const dbDelete = ref => handleAsync(ref.delete());

const create = (ref, values) => {
  const callback = ref.set(
    { ...values, ...getCreatedStamp() },
    { merge: true },
  );
  return handleAsync(callback);
};

const commitBatch = batch => handleAsync(batch.commit());

const subscribe = (ref, callback) =>
  ref.onSnapshot(snap => {
    if (snap.docs) {
      if (snap.empty) {
        callback([]);
      }
      let values = [];
      snap.forEach(doc => {
        if (doc.exists) {
          values = [...values, doc.data()];
          callback(values);
        }
      });
    } else if (snap.exists) {
      callback(snap.data());
    }
  });

export {
  auth,
  db,
  set,
  setMerge,
  get,
  list,
  getCreatedStamp,
  getModifiedStamp,
  handleAsync,
  create,
  update,
  subscribe,
  commitBatch,
  dbDelete,
};
