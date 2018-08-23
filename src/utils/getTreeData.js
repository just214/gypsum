import isEmpty from 'lodash/isEmpty';

const keysToIgnore = [
  'name',
  'collectionId',
  'collection',
  'collectionName',
  'collectionFullpath',
  'id',
  'databaseId',
  'ownerId',
  'createdAt',
  'lastModifiedAt',
  'notes',
];

const handleFields = fields => {
  // type- tree or cluster
  const arr = [];
  if (!fields.length) {
    return arr;
  }
  fields.forEach((field, i) => {
    arr.push({
      name: field.name,
      children: [],
    });

    Object.keys(field).forEach(key => {
      if (keysToIgnore.includes(key)) {
        return;
      }
      if (key === 'enums' && !field[key].length) {
        return;
      }
      if (field[key]) {
        arr[i].children.push({
          name: `${key}: ${field[key]}`,
        });
      }
    });
  });
  return arr;
};

// * ci- collection index
// * fi- field index
// * si- subcollection index
// * sfi- subcollection field index

const getTreeData = (collections, subcollections) => {
  const final = [];
  collections.forEach((col, ci) => {
    final.push({
      name: col.name,
      children: [
        { name: 'fields', children: [] },
        {
          name: 'subcollections',
          children: [],
        },
      ],
    });

    if (!isEmpty(col.fields)) {
      final[ci].children[0].children = handleFields(col.fields);
    }

    if (!isEmpty(subcollections)) {
      subcollections.forEach(subcol => {
        if (subcol.parentId === col.id) {
          final[ci].children[1].children.push({
            name: subcol.name,
            children: [{ name: 'fields', children: [] }],
          });
          if (subcol.parentId === col.id && !isEmpty(subcol.fields)) {
            final[
              ci
            ].children[1].children[0].children[0].children = handleFields(
              subcol.fields,
            );
          }
        }
      });
    }
  });
  return final;
};

export { getTreeData };
