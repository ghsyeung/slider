'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcUtil = require('rc-util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Track = require('./Track');

var _Track2 = _interopRequireDefault(_Track);

var _Handle = require('./Handle');

var _Handle2 = _interopRequireDefault(_Handle);

var _Dots = require('./Dots');

var _Dots2 = _interopRequireDefault(_Dots);

var _Marks = require('./Marks');

var _Marks2 = _interopRequireDefault(_Marks);

function noop() {}

function isNotTouchEvent(e) {
  return e.touches.length > 1 || e.type.toLowerCase() === 'touchend' && e.touches.length > 0;
}

function getTouchPosition(e) {
  return e.touches[0].pageX;
}

function getMousePosition(e) {
  return e.pageX;
}

function pauseEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

var Slider = (function (_React$Component) {
  _inherits(Slider, _React$Component);

  function Slider(props) {
    _classCallCheck(this, Slider);

    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).call(this, props);

    var range = props.range;
    var min = props.min;
    var max = props.max;

    var initialValue = range ? [min, min] : min;
    var defaultValue = 'defaultValue' in props ? props.defaultValue : initialValue;
    var value = 'value' in props ? props.value : defaultValue;

    var upperBound = undefined;
    var lowerBound = undefined;
    if (props.range) {
      lowerBound = this.trimAlignValue(value[0]);
      upperBound = this.trimAlignValue(value[1]);
    } else {
      upperBound = this.trimAlignValue(value);
    }

    var recent = undefined;
    if (props.range && upperBound === lowerBound) {
      if (lowerBound === max) {
        recent = 'lowerBound';
      }
      if (upperBound === min) {
        recent = 'upperBound';
      }
    } else {
      recent = 'upperBound';
    }

    this.state = {
      handle: null,
      recent: recent,
      upperBound: upperBound,
      // If Slider is not range, set `lowerBound` equal to `min`.
      lowerBound: lowerBound || min
    };
  }

  _createClass(Slider, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.range) {
        var value = nextProps.value;
        if (value) {
          this.setState({
            upperBound: value[1],
            lowerBound: value[0]
          });
        }
      } else if ('value' in nextProps) {
        this.setState({
          upperBound: nextProps.value
        });
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(handle, value) {
      var props = this.props;
      var isNotControlled = !('value' in props);
      if (isNotControlled) {
        this.setState(_defineProperty({}, handle, value));
      }

      var state = this.state;
      var data = {
        upperBound: state.upperBound,
        lowerBound: state.lowerBound
      };
      data[handle] = value;
      var changedValue = props.range ? [data.lowerBound, data.upperBound] : data.upperBound;
      props.onChange(changedValue);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var position = getMousePosition(e);
      this.onMove(e, position);
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      if (isNotTouchEvent(e)) {
        this.end('touch');
        return;
      }

      var position = getTouchPosition(e);
      this.onMove(e, position);
    }
  }, {
    key: 'onMove',
    value: function onMove(e, position) {
      pauseEvent(e);
      var props = this.props;
      var state = this.state;

      var diffPosition = position - this.startPosition;
      var diffValue = diffPosition / this.getSliderLength() * (props.max - props.min);

      var value = this.trimAlignValue(this.startValue + diffValue);
      var oldValue = state[state.handle];
      if (value === oldValue) return;

      this.onChange(state.handle, value);
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e) {
      if (isNotTouchEvent(e)) return;

      var position = getTouchPosition(e);
      this.onStart(position);
      this.addDocumentEvents('touch');
      pauseEvent(e);
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var position = getMousePosition(e);
      this.onStart(position);
      this.addDocumentEvents('mouse');
      pauseEvent(e);
    }
  }, {
    key: 'onStart',
    value: function onStart(position) {
      var props = this.props;
      props.onBeforeChange(this.getValue());

      var value = this.calcValueByPos(position);
      this.startValue = value;
      this.startPosition = position;

      var state = this.state;
      var upperBound = state.upperBound;
      var lowerBound = state.lowerBound;

      var valueNeedChanging = 'upperBound';
      if (this.props.range) {
        var isLowerBoundCloser = Math.abs(upperBound - value) > Math.abs(lowerBound - value);
        if (isLowerBoundCloser) {
          valueNeedChanging = 'lowerBound';
        }

        var isAtTheSamePoint = upperBound === lowerBound;
        if (isAtTheSamePoint) {
          valueNeedChanging = state.recent;
        }

        if (isAtTheSamePoint && value !== upperBound) {
          valueNeedChanging = value < upperBound ? 'lowerBound' : 'upperBound';
        }
      }

      this.setState({
        handle: valueNeedChanging,
        recent: valueNeedChanging
      });

      var oldValue = state[valueNeedChanging];
      if (value === oldValue) return;

      this.onChange(valueNeedChanging, value);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var _state = this.state;
      var lowerBound = _state.lowerBound;
      var upperBound = _state.upperBound;

      return this.props.range ? [lowerBound, upperBound] : upperBound;
    }
  }, {
    key: 'getSliderLength',
    value: function getSliderLength() {
      var slider = this.refs.slider;
      if (!slider) {
        return 0;
      }

      return slider.clientWidth;
    }
  }, {
    key: 'getSliderStart',
    value: function getSliderStart() {
      var slider = this.refs.slider;
      var rect = slider.getBoundingClientRect();

      return rect.left;
    }
  }, {
    key: 'getPrecision',
    value: function getPrecision() {
      var props = this.props;
      var stepString = props.step.toString();
      var precision = 0;
      if (stepString.indexOf('.') >= 0) {
        precision = stepString.length - stepString.indexOf('.') - 1;
      }
      return precision;
    }
  }, {
    key: 'trimAlignValue',
    value: function trimAlignValue(v) {
      var state = this.state || {};
      var handle = state.handle;
      var lowerBound = state.lowerBound;
      var upperBound = state.upperBound;
      var _props = this.props;
      var marks = _props.marks;
      var step = _props.step;
      var min = _props.min;
      var max = _props.max;

      var val = v;
      if (val <= min) {
        val = min;
      }
      if (val >= max) {
        val = max;
      }
      if (handle === 'upperBound' && val <= lowerBound) {
        val = lowerBound;
      }
      if (handle === 'lowerBound' && val >= upperBound) {
        val = upperBound;
      }

      var points = Object.keys(marks).map(parseFloat);
      if (step !== null) {
        var closestStep = Math.round(val / step) * step;
        points.push(closestStep);
      }

      var diffs = points.map(function (point) {
        return Math.abs(val - point);
      });
      var closestPoint = points[diffs.indexOf(Math.min.apply(Math, diffs))];

      return step !== null ? parseFloat(closestPoint.toFixed(this.getPrecision())) : closestPoint;
    }
  }, {
    key: 'calcOffset',
    value: function calcOffset(value) {
      var _props2 = this.props;
      var min = _props2.min;
      var max = _props2.max;

      var ratio = (value - min) / (max - min);
      return ratio * 100;
    }
  }, {
    key: 'calcValue',
    value: function calcValue(offset) {
      var _props3 = this.props;
      var min = _props3.min;
      var max = _props3.max;

      var ratio = offset / this.getSliderLength();
      return ratio * (max - min) + min;
    }
  }, {
    key: 'calcValueByPos',
    value: function calcValueByPos(position) {
      var pixelOffset = position - this.getSliderStart();
      var nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
      return nextValue;
    }
  }, {
    key: 'addDocumentEvents',
    value: function addDocumentEvents(type) {
      if (type === 'touch') {
        // just work for chrome iOS Safari and Android Browser
        this.onTouchMoveListener = _rcUtil.Dom.addEventListener(document, 'touchmove', this.onTouchMove.bind(this));
        this.onTouchUpListener = _rcUtil.Dom.addEventListener(document, 'touchend', this.end.bind(this, 'touch'));
      } else if (type === 'mouse') {
        this.onMouseMoveListener = _rcUtil.Dom.addEventListener(document, 'mousemove', this.onMouseMove.bind(this));
        this.onMouseUpListener = _rcUtil.Dom.addEventListener(document, 'mouseup', this.end.bind(this, 'mouse'));
      }
    }
  }, {
    key: 'removeEvents',
    value: function removeEvents(type) {
      if (type === 'touch') {
        this.onTouchMoveListener.remove();
        this.onTouchUpListener.remove();
      } else if (type === 'mouse') {
        this.onMouseMoveListener.remove();
        this.onMouseUpListener.remove();
      }
    }
  }, {
    key: 'end',
    value: function end(type) {
      this.removeEvents(type);
      this.props.onAfterChange(this.getValue());
      this.setState({ handle: null });
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames;

      var _state2 = this.state;
      var handle = _state2.handle;
      var upperBound = _state2.upperBound;
      var lowerBound = _state2.lowerBound;
      var _props4 = this.props;
      var fromMid = _props4.fromMid;
      var className = _props4.className;
      var prefixCls = _props4.prefixCls;
      var disabled = _props4.disabled;
      var dots = _props4.dots;
      var included = _props4.included;
      var range = _props4.range;
      var step = _props4.step;
      var marks = _props4.marks;
      var max = _props4.max;
      var min = _props4.min;
      var tipTransitionName = _props4.tipTransitionName;
      var tipFormatter = _props4.tipFormatter;
      var children = _props4.children;
      var trackColor = _props4.trackColor;

      var upperOffset = this.calcOffset(upperBound);
      var lowerOffset = this.calcOffset(lowerBound);

      var handleClassName = prefixCls + '-handle';
      var isNoTip = step === null && !tipFormatter;

      var upper = _react2['default'].createElement(_Handle2['default'], { className: handleClassName,
        noTip: isNoTip, tipTransitionName: tipTransitionName, tipFormatter: tipFormatter,
        offset: upperOffset, value: upperBound, dragging: handle === 'upperBound' });

      var lower = null;
      if (range) {
        lower = _react2['default'].createElement(_Handle2['default'], { className: handleClassName,
          noTip: isNoTip, tipTransitionName: tipTransitionName, tipFormatter: tipFormatter,
          offset: lowerOffset, value: lowerBound, dragging: handle === 'lowerBound' });
      }

      var sliderClassName = (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, className, !!className), _classNames));
      var isIncluded = included || range;
      return _react2['default'].createElement(
        'div',
        { ref: 'slider', className: sliderClassName,
          onTouchStart: disabled ? noop : this.onTouchStart.bind(this),
          onMouseDown: disabled ? noop : this.onMouseDown.bind(this) },
        upper,
        lower,
        _react2['default'].createElement(_Track2['default'], { fromMid: fromMid, className: prefixCls + '-track', included: isIncluded,
          offset: lowerOffset, length: upperOffset - lowerOffset, trackColor: trackColor }),
        _react2['default'].createElement(_Dots2['default'], { prefixCls: prefixCls, marks: marks, dots: dots, step: step,
          included: isIncluded, lowerBound: lowerBound,
          upperBound: upperBound, max: max, min: min }),
        _react2['default'].createElement(_Marks2['default'], { className: prefixCls + '-mark', marks: marks,
          included: isIncluded, lowerBound: lowerBound,
          upperBound: upperBound, max: max, min: min }),
        children
      );
    }
  }]);

  return Slider;
})(_react2['default'].Component);

Slider.propTypes = {
  min: _react2['default'].PropTypes.number,
  max: _react2['default'].PropTypes.number,
  step: _react2['default'].PropTypes.number,
  defaultValue: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.number)]),
  value: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.number)]),
  marks: _react2['default'].PropTypes.object,
  included: _react2['default'].PropTypes.bool,
  className: _react2['default'].PropTypes.string,
  prefixCls: _react2['default'].PropTypes.string,
  disabled: _react2['default'].PropTypes.bool,
  children: _react2['default'].PropTypes.any,
  onBeforeChange: _react2['default'].PropTypes.func,
  onChange: _react2['default'].PropTypes.func,
  onAfterChange: _react2['default'].PropTypes.func,
  tipTransitionName: _react2['default'].PropTypes.string,
  tipFormatter: _react2['default'].PropTypes.func,
  dots: _react2['default'].PropTypes.bool,
  range: _react2['default'].PropTypes.bool,
  trackColor: _react2['default'].PropTypes.string,
  fromMid: _react2['default'].PropTypes.bool
};

Slider.defaultProps = {
  prefixCls: 'rc-slider',
  className: '',
  tipTransitionName: '',
  min: 0,
  max: 100,
  step: 1,
  marks: {},
  onBeforeChange: noop,
  onChange: noop,
  onAfterChange: noop,
  included: true,
  disabled: false,
  dots: false,
  range: false
};

exports['default'] = Slider;
module.exports = exports['default'];