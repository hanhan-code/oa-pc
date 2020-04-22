
export const fineRule = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) > 100) {
    callback(new Error("得分率<=100"));
  } else if (Number(value) < 90) {
    callback(new Error("得分率>=90"));
  } else {
    callback();
  }
};
export const fineRules = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) > 100) {
    callback(new Error("得分率<=100"));
  } else if (Number(value) < 85) {
    callback(new Error("得分率>=85"));
  } else {
    callback();
  }
};
export const wellRule = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) > 90) {
    callback(new Error("得分率<90"));
  } else if (Number(value) < 80) {
    callback(new Error("得分率>=80"));
  } else {
    callback();
  }
};
export const wellRules = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) > 85) {
    callback(new Error("得分率<85"));
  } else if (Number(value) < 75) {
    callback(new Error("得分率>=75"));
  } else {
    callback();
  }
};
export const comRule = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请填写得分率"));
  } else if (Number(value) > 80) {
    callback(new Error("得分率<80"));
  } else if (Number(value) < 60) {
    callback(new Error("得分率>60"));
  } else {
    callback();
  }
};
