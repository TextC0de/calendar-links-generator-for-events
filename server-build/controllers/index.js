"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var upload = /*#__PURE__*/function () {var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref, res) {var file;return _regenerator["default"].wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:file = _ref.file;
            res.status(200).send(file.filename);case 2:case "end":return _context.stop();}}}, _callee);}));return function upload(_x, _x2) {return _ref2.apply(this, arguments);};}();var _default =


{
  upload: upload };exports["default"] = _default;