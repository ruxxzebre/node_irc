const schemas = require('./schemas.json');

function compareTypes(prop, type) {
  switch (prop) {
    case (undefined): return type === 'undefined';
    case (null): return type === 'null';
    default: return prop.constructor.name === type;
  }
}

/**
 * Compares two objects (currently comparison is not deep)
 * @param {Object} object
 * @param {Object} schema
 * @returns {Boolean}
 */
function validate(object, schema) {
  let flag = false;
  Object.keys(schema).forEach((schemaKey) => {
    const isKey = object?.schemaKey;
    let equalType = false;
    if (isKey) {
      equalType = compareTypes(
        object[schemaKey],
        schema[schemaKey],
      );
    }
    flag = equalType && isKey;
  });
  return flag;
}

function RequestObject(actionName, body, stringify = false) {
  // Fetch schemas from server, maybe create init script
  console.log(body);
  const schema = schemas[actionName];
  if (!schema) throw new Error('Invalid action.');
  if (!validate(body, schema)) throw new Error('Invalid body, check schemas and tweak body accordingly.');
  return stringify
    ? JSON.stringify({ actionName, body })
    : { actionName, body };
}

module.exports.RequestObject = RequestObject;
