'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Track = function Track(_ref) {
  var fromMid = _ref.fromMid;
  var className = _ref.className;
  var included = _ref.included;
  var offset = _ref.offset;
  var length = _ref.length;
  var trackColor = _ref.trackColor;

  var style = {
    left: offset + '%',
    width: length + '%',
    visibility: included ? 'visible' : 'hidden',
    backgroundColor: trackColor
  };

  if (fromMid) {
    style.left = (length > 50 ? 50 : length) + "%", style.width = (length > 50 ? length - 50 : 50 - length) + "%";
    if (length < 50) {
      style.borderTopRightRadius = style.borderBottomRightRadius = 0;
    } else {
      style.borderTopLeftRadius = style.borderBottomLeftRadius = 0;
    }
  }
  return _react2['default'].createElement('div', { className: className, style: style });
};

exports['default'] = Track;
module.exports = exports['default'];