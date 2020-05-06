export const fineRule = (rule, value, callback) => {
  if (value === "" || value === " ") {
    value = 0;
    callback(new Error("请填写得分率"));
  } else if (Number(value) <= 0) {
    callback(new Error(`得分率必须大于0`));
  } else if (Number(value) > 100) {
    callback(new Error(`得分率<=100`));
  } else {
    callback();
  }
};
export const fineRules = (rule, value, callback) => {
  if (value === "" || value === " ") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) <= 0) {
    callback(new Error(`得分率必须大于0`));
  } else if (Number(value) > 100) {
    callback(new Error(`得分率<=100}`));
  } else {
    callback();
  }
};
export const wellRule = (rule, value, callback) => {
  if (value === "" || value === " ") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) <= 0) {
    callback(new Error(`得分率必须大于0`));
  } else {
    callback();
  }
};
export const wellRules = (rule, value, callback) => {
  if (value === "" || value === " ") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) <= 0) {
    callback(new Error(`得分率必须大于0`));
  } else {
    callback();
  }
};
export const comRule = (rule, value, callback) => {
  if (value === "" || value === " ") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) <= 0) {
    callback(new Error(`得分率必须大于0`));
  } else {
    callback();
  }
};
