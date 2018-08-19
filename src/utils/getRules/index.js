import { generateMatchStatementTop, getFunctionName } from './utils';

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
        Object.keys(thisField).forEach(key => {
          if (thisField[key]) {
            expression += `data.${thisField.fieldName}${key}${
              thisField[key]
            }&&\n\t`;
          }
        });
      });
    }

    const thisFunction = {
      name: `is${getFunctionName(col)}`,
      expression,
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
