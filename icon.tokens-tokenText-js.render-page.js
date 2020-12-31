exports.ids = ["icon.tokens-tokenText-js"];
exports.modules = {

/***/ "./node_modules/@elastic/eui/es/components/icon/assets/tokens/tokenText.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@elastic/eui/es/components/icon/assets/tokens/tokenText.js ***!
  \*********************************************************************************/
/*! exports provided: icon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "icon", function() { return icon; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



var EuiIconTokenText = function EuiIconTokenText(_ref) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, ["title", "titleId"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("svg", _extends({
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-labelledby": titleId
  }, props), title ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("title", {
    id: titleId
  }, title) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
    d: "M9.14664 4.29739L8.89243 5.75232H9.82812L9.60637 7.01795H8.67067L8.21635 9.70605C8.19111 9.88994 8.20282 10.0288 8.2515 10.1225C8.30018 10.2163 8.42187 10.2667 8.61659 10.274C8.69231 10.2776 8.84735 10.2685 9.08173 10.2469L8.95192 11.5666C8.65264 11.664 8.33354 11.7091 7.99459 11.7018C7.44291 11.6946 7.03005 11.5324 6.75601 11.2151C6.48197 10.8978 6.37019 10.4669 6.42067 9.92239L6.89663 7.01795H6.17188L6.38822 5.75232H7.11298L7.36719 4.29739H9.14664Z"
  }));
};

var icon = EuiIconTokenText;
EuiIconTokenText.__docgenInfo = {
  "description": "",
  "methods": [],
  "displayName": "EuiIconTokenText"
};

/***/ })

};;
//# sourceMappingURL=icon.tokens-tokenText-js.render-page.js.map