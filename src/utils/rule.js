export var requireContent = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("必填字段不能为空"));
  } else {
    callback();
  }
};
