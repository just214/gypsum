export { getRules } from './getRules';
export { getTreeData } from './getTreeData';

export const sortCollection = (a, b) => {
  const nameA = a.name;
  const nameB = b.name;
  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  }
  return 0;
};
