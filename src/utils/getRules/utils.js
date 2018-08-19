import pluralize from 'pluralize';
import startCase from 'lodash/startCase';

const generateMatchStatementTop = col => {
  if (col.parentKey) {
    // * This is a subcollection
    return `\n\t\tmatch\u00A0/${col.parentName}/{${pluralize.singular(
      col.parentName,
    )}Id}/${col.name}/{${pluralize.singular(col.name)}Id}\u00A0{`;
  }
  return `\n\t\tmatch\u00A0/${col.name}/{${pluralize.singular(
    col.name,
  )}Id}\u00A0{`;
};

const getFunctionName = col => {
  if (col.parentKey) {
    return `${startCase(pluralize.singular(col.parentName))}${startCase(
      pluralize.singular(col.name),
    )}`;
  }
  return startCase(pluralize.singular(col.name));
};

export { generateMatchStatementTop, getFunctionName };
