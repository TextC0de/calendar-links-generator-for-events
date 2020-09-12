"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _express = _interopRequireDefault(require("express"));
var _multer = _interopRequireDefault(require("multer"));
var _uuid = require("uuid");
var _path = _interopRequireDefault(require("path"));
var _controllers = _interopRequireDefault(require("../controllers"));

var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function filename(req, file, cb) {
    var newFilename = "".concat((0, _uuid.v4)()).concat(_path["default"].extname(file.originalname));
    cb(null, newFilename);
  } });


var upload = (0, _multer["default"])({ storage: storage });

var Router = _express["default"].Router();
Router.post('/file', upload.single('ics'), _controllers["default"].upload);var _default =

Router;exports["default"] = _default;