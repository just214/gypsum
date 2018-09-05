import { Notification } from 'element-ui';
import { auth } from '@/firebase';

// * types
const AUTH_PENDING = 'AUTH_PENDING';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_ERROR = 'AUTH_ERROR';
const SIGN_OUT = 'SIGN_OUT';
const UPDATE_AUTH_USER = 'UPDATE_AUTH_USER';

const INITIAL_STATE = {
  pending: false, // * Auth is in progress
  error: null, // * An error occurred during authentication
  checked: false, // * The auth listener has not yet fired
  isAuthed: false, // * The user is authenticated
  userData: null, // * The data retreived by a social provider (to pre-fill the registration form)
};

export default {
  state: INITIAL_STATE,
  mutations: {
    [AUTH_PENDING](state) {
      state.pending = true;
      state.error = null;
    },
    [UPDATE_AUTH_USER](state, payload) {
      state.userData = payload;
    },
    [AUTH_SUCCESS](state) {
      state.pending = false;
      state.error = null;
      state.checked = true;
      state.isAuthed = true;
    },
    [AUTH_ERROR](state, payload) {
      state.pending = false;
      state.error = payload;
    },
    [SIGN_OUT]() {},
  },

  actions: {
    async handleAuth(context, promise) {
      context.commit(AUTH_PENDING);
      try {
        await promise;
      } catch (error) {
        console.error(error);
        context.commit(AUTH_ERROR);
        Notification.error({
          title: 'Authentication Error',
          message: error.message,
        });
      }
      return promise;
    },

    updateUserWithAuthData(context, user) {
      const authUser = {
        id: user.uid,
        emailAddress: user.email,
        firstName: user.displayName ? user.displayName.split(' ')[0] : '',
        lastName: user.displayName ? user.displayName.split(' ')[1] : '',
        profilePictureUrl: user.photoURL ? user.photoURL : '',
      };
      context.commit(UPDATE_AUTH_USER, authUser);
    },

    loginWithEmail(context, authObj) {
      return context.dispatch(
        'handleAuth',
        auth().signInWithEmailAndPassword(authObj.email, authObj.password),
      );
    },
    signUpWithEmail(context, authObj) {
      return context.dispatch(
        'handleAuth',
        auth().createUserWithEmailAndPassword(authObj.email, authObj.password),
      );
    },
    loginWithGoogle(context) {
      const googleProvider = new auth.GoogleAuthProvider();
      return context.dispatch(
        'handleAuth',
        auth().signInWithRedirect(googleProvider),
      );
    },
    sendPasswordResetLink(context, email) {
      return context.dispatch(
        'handleAuth',
        auth().sendPasswordResetEmail(email),
      );
    },
    async signOut(context) {
      return auth()
        .signOut()
        .then(() => {
          context.commit(SIGN_OUT);
          context.dispatch('auth/resetState', null, { root: true });
        });
    },
  },
};
