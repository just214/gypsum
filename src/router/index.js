import Vue from 'vue';
import Router from 'vue-router';
import { auth } from '@/firebase';
import store from '@/store';

// * Components
import AuthPage from '@/components/Auth/AuthPage';
import MainPage from '@/components/MainPage';
import WizardPage from '@/components/Wizard/WizardPage';
import RulesPage from '@/components/Rules/RulesPage';
import ClusterPage from '@/components/Cluster/ClusterPage';
import TerminologyPage from '@/components/Terminology/TerminologyPage';
import CheatsheetsPage from '@/components/CheatSheets/CheatsheetsPage';

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
      component: MainPage,
      meta: { requiresRegistration: true },
    },
    {
      path: '/wizard',
      name: 'WizardPage',
      component: WizardPage,
      meta: { requiresRegistration: true },
    },
    {
      path: '/terminology',
      name: 'TerminologyPage',
      component: TerminologyPage,
      meta: { requiresRegistration: true },
    },

    {
      path: '/rules',
      name: 'RulesPage',
      component: RulesPage,
      meta: { requiresRegistration: true },
    },

    {
      path: '/cheatsheets',
      name: 'CheatsheetsPage',
      component: CheatsheetsPage,
      meta: { requiresRegistration: true },
    },
    {
      path: '/cluster',
      name: 'ClusterPage',
      component: ClusterPage,
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
    store.dispatch('unsubscribeFromAll');
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
