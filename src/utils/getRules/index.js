import {
  generateMatchStatementTop,
  getFunctionName,
  handleDataType,
} from './utils';

const getRules = collections => {
  if (!collections.length) {
    return 'No collections yet.';
  }

  const rulesTop =
    '\nservice cloud.firestore {\n\n\tmatch /databases/{database}/documents {\n';

  const rulesBottom = '\n\t}\n}';

  const generateHelperFunction = ({ name, arg, expression }) =>
    `\nfunction ${name} (${arg || ''}) {\n\t${expression}\n}\n`;

  const helperFunctions = [
    { name: 'getAuthId', expression: 'return request.auth.uid;' },
    { name: 'existingData', expression: 'return resource.data;' },
    { name: 'incomingData', expression: 'return request.resource.data;' },
    { name: 'isNull', expression: 'return value == null;', arg: 'value' },
    {
      name: 'isString',
      expression: 'return isNull(value) || value is string;',
      arg: 'value',
    },
    {
      name: 'isNumber',
      expression: 'return isNull(value) || value is number;',
      arg: 'value',
    },
    {
      name: 'isInt',
      expression: 'return isNull(value) || value is int;',
      arg: 'value',
    },
    {
      name: 'isFloat',
      expression: 'return isNull(value) || value is float;',
      arg: 'value',
    },

    {
      name: 'isTimestamp',
      expression: 'return isNull(value) || value is timestamp',
      arg: 'value',
    },
  ];

  const middleStuff = [];

  collections.forEach(col => {
    // * Loop over each collection and do like a million things

    const top = generateMatchStatementTop(col);

    const middle = `\n\t\t\tallow create, read, update, delete: if is${getFunctionName(
      col,
    )}(request.resource.data);`;

    const bottom = '\n\t\t}\n';

    let expression = '';

    if (col.fields && col.fields.length) {
      col.fields.forEach(thisField => {
        if (thisField.dataType) {
          expression += handleDataType(thisField);
        }
        // Object.keys(thisField).forEach(key => {
        //   if (thisField[key]) {
        //     expression += `data.${thisField.name}${key}${thisField[key]}&&\n\t`;
        //   }
        // });
      });
    }

    const thisFunction = {
      name: `is${getFunctionName(col)}`,
      expression,
      arg: 'data',
    };

    helperFunctions.push(thisFunction);

    middleStuff.push(''.concat(top, middle, bottom));
  });

  const body = ''.concat(...middleStuff);

  // * Generate the helperFunctions string
  let helperFunctionsString = '';

  helperFunctions.forEach(func => {
    helperFunctionsString += generateHelperFunction(func);
  });

  return helperFunctionsString + rulesTop + body + rulesBottom;
};

export { getRules };
