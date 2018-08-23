import pluralize from 'pluralize';
import upperFirst from 'lodash/upperFirst';

const generateMatchStatementTop = col => {
  if (col.parentId) {
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
  if (col.parentId) {
    return `${upperFirst(pluralize.singular(col.parentName))}${upperFirst(
      pluralize.singular(col.name),
    )}`;
  }
  return upperFirst(pluralize.singular(col.name));
};

const handleDataType = field => {
  if (field.dataType === 'string') {
    return 'return isString(incomingData())';
  }
  return '';
};

export { generateMatchStatementTop, getFunctionName, handleDataType };
