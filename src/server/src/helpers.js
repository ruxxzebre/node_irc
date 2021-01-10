function extendObject(object, mixin, proto = false) {
  if (proto) Object.setPrototypeOf(object, { ...Object.getPrototypeOf(object), ...mixin });
  else Object.assign(object, mixin);
}

module.exports.extendObject = extendObject;
