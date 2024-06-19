/**
 * 收集必填的规则
 * @param model
 * @returns {{}}
 */
const getRequiredRules = (model) => {
  let validator = {};
  for (const key in model._column) {
    validator[key] = [];
    const columnItem = model._column[key];
    if (
      columnItem.primaryKey ||
      (columnItem.allowNull !== void 0 && !columnItem.allowNull)
    ) {
      if (!columnItem.defaultExpr) {
        const requiredFn = (val) => {
          if (val) return true;
          else return false;
        };
        validator[key].push({
          message: `字段${key}需要必填，请检查输入`,
          fn: requiredFn
        });
      }
    }
  }
  return validator;
};

/**
 * 根据必填项验证参数
 * @param params
 * @param rules
 * @returns {[boolean,string]}
 */
const validateRules = (params = {}, rules = {}) => {
  let err = false;
  let errMsg = '';
  for (const key in rules) {
    const validList = rules[key];
    if (validList && validList.length > 0) {
      for (const validItem of validList) {
        if (!validItem.fn(params[key])) {
          err = true;
          errMsg = validItem.message;
        }
      }
    }
  }
  return [err, errMsg];
};

export { getRequiredRules, validateRules };
