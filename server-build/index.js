"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cors = _interopRequireDefault(require("cors"));
var _path = _interopRequireDefault(require("path"));
var _routes = _interopRequireDefault(require("./routes"));

var PORT = process.env.PORT || 5000;
var app = (0, _express["default"])();
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use((0, _cors["default"])());
app.use(_express["default"].urlencoded({ extended: true }));
app.use('/ics', _routes["default"]);
app.use('/ics', _express["default"]["static"](_path["default"].join(__dirname, '../public')));

app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public')));

if (process.env.NODE_ENV === 'production') {
  app.get('/*', function (req, res) {
    res.sendFile(_path["default"].join(__dirname, '../public', 'index.html'));
  });
}

app.listen(PORT, function (err) {
  if (err) throw err;
  console.log("> Ready on http://localhost:".concat(PORT));
});