import Vue from 'vue';
import Router from 'vue-router';
import { auth } from '@/firebase';
import store from '@/store';

// * Components
import AuthPage from '@/components/Auth/AuthPage';
import SchemaPage from '@/components/SchemaPage';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior() {
    // * to, from, savedPosition
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/login',
      name: 'Auth',
      component: AuthPage,
    },

    {
      path: '/',
      name: 'Home',
      component: SchemaPage,
      meta: { requiresRegistration: true },
    },
    {
      path: '/databases/:databaseId',
      name: 'Database',
      component: SchemaPage,
      meta: { requiresRegistration: true },
    },
  ],
});

auth().onAuthStateChanged(authUser => {
  if (authUser) {
    store.dispatch('auth/updateUserWithAuthData', authUser);
    store.commit('auth/AUTH_SUCCESS');
    router.replace('/');
  } else {
    router.replace('/login');
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresRegistration)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.auth.isAuthed) {
      next({
        path: '/login',
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
