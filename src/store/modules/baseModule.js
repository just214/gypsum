/*
* This base module is a wrapper over namespaced modules and works with the basePlugin.
* It is responsible for:
* - Holding the initial state and resetting the data upon signout.
*/
import merge from 'lodash/merge';

export default module => {
  // * Hold the initial state in a closure.
  const INITIAL_STATE = module.state;

  // * ADD-ON TYPES
  const RESET = 'RESET';

  const baseModuleAddOn = {
    namespaced: true,
    mutations: {
      [RESET](state) {
        Object.keys(INITIAL_STATE).forEach(key => {
          state[key] = INITIAL_STATE[key];
        });
      },
    },
    actions: {
      resetState(context) {
        context.commit(RESET);
      },
    },
  };
  const baseModule = merge(baseModuleAddOn, module);
  return baseModule;
};
