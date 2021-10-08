(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "lodash", "../utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("lodash"), require("../utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.lodash, global.utils);
    global.index = mod.exports;
  }
})(this, function (module, exports, _lodash, _utils) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var addedDiff = function addedDiff(lhs, rhs) {

    if (lhs === rhs || !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return {};

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    return Object.keys(r).reduce(function (acc, key) {
      if (l.hasOwnProperty(key)) {
        if (Array.isArray(l[key]) && Array.isArray(r[key])) {
          //const allKeys = _.merge(l[key], r[key]) ?? []
          var newFields = _lodash2.default.uniq(_lodash2.default.difference(r[key], l[key]));
          if (newFields.length === 0) {
            return acc;
          }
          var newFieldsIndex = _lodash2.default.map(newFields, function (o) {
            return {
              content: o,
              index: []
            };
          });

          var _loop = function _loop(i) {
            var index = _lodash2.default.findIndex(newFields, function (o) {
              return _lodash2.default.isEqual(o, r[key][i]);
            });
            if (index !== -1) {
              newFieldsIndex[index].index.push(i);
            }
          };

          for (var i = 0; i < r[key].length; i++) {
            _loop(i);
          }
          return _extends({}, acc, _defineProperty({}, key, { after: newFieldsIndex }));
        }
        var difference = addedDiff(l[key], r[key]);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, difference));
      }
      if (_typeof(r[key]) === "object" && l[key] === undefined) {
        if (Array.isArray(r[key])) {
          return _extends({}, acc, _defineProperty({}, key, { after: r[key] }));
        }
        var _difference = addedDiff({}, r[key]);
        if ((0, _utils.isObject)(_difference) && (0, _utils.isEmpty)(_difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, _difference));
      }

      return _extends({}, acc, _defineProperty({}, key, { after: r[key] }));
    }, {});
  };

  exports.default = addedDiff;
  module.exports = exports["default"];
});