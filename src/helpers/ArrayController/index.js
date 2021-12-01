const copyy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

function Element(id, ArrayController){
  this.value = ArrayController.findElById(id)
  this.ArrayController = ArrayController
}

Element.prototype.update = function(body){
  this.ArrayController.addOrUpdateMany([{...this.value, ...body}])
}

Element.prototype.remove = function(){
  this.ArrayController.removeMany([this.value])
}

export default function ArrayController([value, setValue],[initValue, setInitValue]) {
  this.value = value;
  this.setValue = setValue;

  // this.initValue = copyy(value);
  this.initValue = initValue;
  this.setInitValue = setInitValue;
}

// ArrayController.prototype.set = function (JSONArray, options) {
//   // const JSONArrayCopy = copyy(JSONArray);
//   if (options && options.init === true) this.initValue = copyy(JSONArray);
//   this.setValue(copyy(JSONArray));
// };

ArrayController.prototype.set = function (JSONArray, options) {
  // const JSONArrayCopy = copyy(JSONArray);
  if (options && options.init === true) this.setInitValue(copyy(JSONArray))
  this.setValue(copyy(JSONArray));
};

ArrayController.prototype.get = function (id) {
  return new Element(id, this)
};

ArrayController.prototype.clear = function () {
  this.set([]);
};

ArrayController.prototype.reset = function () {
  this.set(copyy(this.initValue));
};

ArrayController.prototype.findIndexById = function (id) {
  return this.value.findIndex((JSONelement) => id == JSONelement.id);
};

ArrayController.prototype.findElById = function (id) {
  return this.value.find((JSONelement) => id == JSONelement.id);
};

ArrayController.prototype.hasElById = function (id) {
  return this.value.findIndex((JSONelement) => id == JSONelement.id) > -1;
};

ArrayController.prototype.addOrUpdateMany = function (JSONArray, options) {
  let copy = copyy(this.value);
  JSONArray.forEach((el) => {
    const index = copy.findIndex((JSONelement) => el.id == JSONelement.id);
    if (index > -1) copy[index] = el;
    else copy = [...copy, el];
  });
  this.set(copy, options);
};

ArrayController.prototype.removeMany = function (JSONArray, options) {
  let copy = copyy(this.value);
  JSONArray.forEach((el) => {
    const index = copy.findIndex((JSONelement) => el.id == JSONelement.id);
    if (index > -1) copy.splice(index, 1);
  });
  this.set(copy, options);
};

ArrayController.prototype.json = function () {
  return this.value;
};
