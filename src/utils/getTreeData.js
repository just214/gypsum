import isEmpty from 'lodash/isEmpty';

const keysToIgnore = ['fieldName', 'key', 'parentFullPath', 'parentKey'];

const handleFields = fields => {
  // type- tree or cluster
  const arr = [];
  fields.forEach((field, i) => {
    arr.push({
      name: field.fieldName,
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
        final[ci].children[1].children.push({
          name: subcol.name,
          children: [{ name: 'fields', children: [] }],
        });
        if (subcol.parentKey === col.key && !isEmpty(subcol.fields)) {
          final[ci].children[1].children = handleFields(subcol.fields);
        }
      });
    }
  });
  return final;
};

export { getTreeData };
