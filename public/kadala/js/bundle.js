(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var Navbar = require('./components/nav/navbar.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var KadalaStore = require('./components/kadala-store/kadala-store.jsx');
var Inventory = require('./components/inventory/inventory.jsx');
var IndividualItem = require('./components/individual-item/individual-item.jsx');

var AppStore = require('./stores/AppStore.js');

var Application = React.createClass({displayName: "Application",
	getInitialState:function() {
		return AppStore.getSettings();
	},
	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState(AppStore.getSettings());
	},

	render:function() {

		//conditionally render either the inventory or individual item based on screen size
		var inventory;
		var individualItem;

		if (this.state.mobile) {
			individualItem = React.createElement(IndividualItem, null)
		}
		else {
			inventory = React.createElement(Inventory, null)
		}

		return (
			React.createElement("div", null, 
			React.createElement(Navbar, {mobile: this.state.mobile}), 
			React.createElement("div", {className: "container-fluid"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-sm-3"}, 
						React.createElement(OptionsPanel, null)
					), 
					React.createElement("div", {className: "col-sm-9"}, 
						React.createElement(KadalaStore, null), 
						inventory
					)
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-sm-12"}, 
						individualItem
					)
				)
			)
			)
		);
	}
});

React.render(
	React.createElement(Application, null),
	document.getElementById('app')
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./components/individual-item/individual-item.jsx":16,"./components/inventory/inventory.jsx":21,"./components/kadala-options/options-panel.jsx":29,"./components/kadala-store/kadala-store.jsx":32,"./components/nav/navbar.jsx":33,"./stores/AppStore.js":36}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":4}],4:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":5}],5:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],6:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],7:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],8:[function(require,module,exports){
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

	addItem: function(item) {
		AppDispatcher.dispatch({
			actionType:AppConstants.ADD_ITEM,
			item:item
		});
	},

	previousInventory: function() {
		AppDispatcher.dispatch({
			actionType:AppConstants.PREV_INV
		});
	},

	nextInventory: function() {
		AppDispatcher.dispatch({
			actionType:AppConstants.NEXT_INV
		});
	},

	previousItem:function() {
		AppDispatcher.dispatch({
			actionType:AppConstants.PREV_ITEM
		});
	},

	nextItem:function() {
		AppDispatcher.dispatch({
			actionType:AppConstants.NEXT_ITEM
		});
	},

	changeSetting:function(key,val) {
		AppDispatcher.dispatch({
			actionType:AppConstants.CHANGE_SETTING,
			key:key,
			val:val
		});
	},

	toggleStore:function() {
		AppDispatcher.dispatch({
			actionType:AppConstants.TOGGLE_STORE
		});
	},

	toggleOptions:function() {
		AppDispatcher.dispatch({
			actionType:AppConstants.TOGGLE_OPTIONS
		});
	},

	incrementShards:function(key,val) {
		AppDispatcher.dispatch({
			actionType:AppConstants.INCREMENT_SHARDS,
			key:key,
			val:val
		});
	}

};

module.exports = AppActions;

},{"../constants/AppConstants":34,"../dispatcher/AppDispatcher":35}],9:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
	D3ItemTooltipArmor = React.createClass({displayName: "D3ItemTooltipArmor",

	render: function() {

		return (
			
			React.createElement("ul", {className: "item-armor-weapon item-armor-armor"}, 
				React.createElement("li", {className: "big"}, React.createElement("p", null, React.createElement("span", {className: "value"}, this.props.armor))), 
				React.createElement("li", null, "Armor")
			)

		);

	}

});

module.exports = D3ItemTooltipArmor;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
	D3ItemTooltipArmor = require('./d3-tooltip-armor.jsx'),
	D3ItemTooltipWeapon = require('./d3-tooltip-weapon.jsx'),
	D3ItemTooltipStat = require('./d3-tooltip-stat.jsx');

var D3ItemTooltipBody = React.createClass({displayName: "D3ItemTooltipBody",

	render: function() {

		var iconClasses = 'd3-icon d3-icon-item d3-icon-item-large';
		var itemTypeClass ='d3-color-'; 

		//declare arrays for primary and secondary item effects. 
		//An item must have at least one of each.
		//Create the list item for each stat and push in the arrays
		var primaries = forEach(this.props.item.primaries);
		var secondaries = forEach(this.props.item.secondaries);

		//image used as inline-style for item tooltips
		var image = {backgroundImage:'url('+this.props.item.image+')'};

		//if specified, set color for tooltip components
		if (this.props.item.color) {
			iconClasses += ' d3-icon-item-'+this.props.item.color;
			itemTypeClass +=this.props.item.color;
		}

		//if it is an armor or weapon add additional info to icon section
		var subHead;
		if (this.props.item.hasOwnProperty('armor')) {
			subHead = React.createElement(D3ItemTooltipArmor, {armor: this.props.item.armor});
		}
		if (this.props.item.hasOwnProperty('weapon')) {
			subHead = React.createElement(D3ItemTooltipWeapon, {weapon: this.props.item.weapon});
		}

		//if sockets are needed
		var sockets = [];
		var socketKey = 0;
		if (this.props.item.primaries.hasOwnProperty('Socket')) {
			for (var i =0; i < this.props.item.primaries.Socket.value; i++) {
				sockets.push(React.createElement("li", {className: "empty-socket d3-color-blue", key: socketKey}, "Empty Socket"));
				socketKey++;
			}
		}

		//determine the word to put next to item type
		var itemTypePrefix;
		//check if ancient set item and manually put
		if (this.props.item.rarity === 'ancient' && this.props.item.hasOwnProperty('set')) {
			itemTypePrefix = 'Ancient Set';
		}
		//otherwise it is set/a rarity only
		else {
			itemTypePrefix = (this.props.item.hasOwnProperty('set')) ? 'set' : this.props.item.rarity;
			//capitalize first letter
			itemTypePrefix = itemTypePrefix.charAt(0).toUpperCase() + itemTypePrefix.slice(1);
		}

		return (
			React.createElement("div", {className: "tooltip-body effect-bg effect-bg-armor effect-bg-armor-default"}, 

				/*The item icon and container, color needed for background*/
				React.createElement("span", {className: iconClasses}, 
					React.createElement("span", {className: "icon-item-gradient"}, 
						React.createElement("span", {className: "icon-item-inner icon-item-default", style: image}
						)
					)
				), 

				React.createElement("div", {className: "d3-item-properties"}, 

					/*Slot and if class specific*/
					React.createElement("ul", {className: "item-type-right"}, 
							React.createElement("li", {className: "item-slot"}, this.props.item.slot.charAt(0).toUpperCase() + this.props.item.slot.slice(1)), 
							React.createElement("li", {className: "item-class-specific d3-color-white"}, this.props.item.classSpecific)
					), 

					/*Rarity of the item and/if it is ancient*/
					React.createElement("ul", {className: "item-type"}, 
						React.createElement("li", null, 
							React.createElement("span", {className: itemTypeClass}, itemTypePrefix, " ", this.props.item.type)
						)
					), 

					/*If the item is armor or weapon, the key is defined and we need more information on the tooltip*/
					subHead, 

					React.createElement("div", {className: "item-before-effects"}), 

					/*Actual item stats*/
					React.createElement("ul", {className: "item-effects"}, 
						React.createElement("p", {className: "item-property-category"}, "Primary"), 
						primaries, 
						React.createElement("p", {className: "item-property-category"}, "Secondary"), 
						secondaries, 
						sockets
					)

				)

			)
		);

	function forEach(statObject) {
		var results = [];

		var keys = Object.keys(statObject);
		var length = keys.length;

		for (var i = 0; i < length; i ++) {
			var stat = keys[i];
			var val = statObject[stat];
			results.push(React.createElement(D3ItemTooltipStat, {stat: val, key: i}));
		}
		return results;
	}

	}
});

module.exports = D3ItemTooltipBody;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./d3-tooltip-armor.jsx":9,"./d3-tooltip-stat.jsx":13,"./d3-tooltip-weapon.jsx":14}],11:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipFlavor = React.createClass({displayName: "D3ItemTooltipFlavor",
	render:function() {
		return (
			React.createElement("div", {className: "tooltip-extension"}, 
				React.createElement("div", {className: "flavor"}, this.props.flavor)
			)
		);
	}
});

module.exports = D3ItemTooltipFlavor;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipHead = React.createClass({displayName: "D3ItemTooltipHead",
	render: function() {

		//initial class set for the tooltip head
		var divClass='tooltip-head';
		var h3Class='';

		//modify the classes if a color was passed
		//fallback color is handled by d3-tooltip css
		if (this.props.item.color) {
			divClass += ' tooltip-head-' + this.props.item.color;
			h3Class += 'd3-color-' + this.props.item.color;
		}
		//make the font smaller if the name is long
		if (this.props.item.name.length > 40) {
			h3Class+= ' smallest';
		}
		else if(this.props.item.name.length >22) {
			h3Class+= ' smaller';
		}

		return (
			React.createElement("div", {className: divClass}, 
				React.createElement("h3", {className: h3Class}, 
					this.props.item.name
				)
			)
		);

	}
});

module.exports = D3ItemTooltipHead;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],13:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipStat= React.createClass({displayName: "D3ItemTooltipStat",

	render: function() {

		var text = [];
		var textKey = 0;
		//check to make sure template needs to be worked with 
		if (typeof this.props.stat.text !== 'undefined') {
			var template = this.props.stat.text;
			if (template.indexOf('{') !== -1) {

				//determine the number of highlighted items the tooltip will have
				var position = template.indexOf('{');
				var count = 0;
				while (position !== -1) {
					count++
					position = template.indexOf('{', position+1);
				}

				var startPos = 0;
				var endPos = 0;
				//loop through this count of templating
				for (var i =0; i < count; i++) {
					var startIndex = template.indexOf('{',startPos)+1;
					startPos = startIndex;
					var endIndex = template.indexOf('}',endPos);
					endPos = endIndex+1;
					var sliced = template.slice(startIndex,endIndex);

					//check for any replacement needed
					if (sliced.indexOf('$') !== -1) {
						if (Array.isArray(this.props.stat.value)) {
							sliced = sliced.replace('$', this.props.stat.value[i]);
						}
						else {
							sliced = sliced.replace('$',this.props.stat.value);
						}
					}

					//if we are at the first loop, add anything first as text
					if (i === 0) {
						text.push(template.split('{')[0]);
					}

					//create and push the value highlighted element
					var element = React.createElement("span", {className: "value", key: textKey}, sliced);
					textKey++;
					text.push(element);

					//if not the last loop, push anything until next bracket
					if (count !== 1 && i < count - 1) {
						var nextIndex = template.indexOf('{', startPos);
						var sliced = template.slice(endIndex+1, nextIndex);
						text.push(sliced);
					}
					else if(count === 1) {
						var sliced = template.slice(endIndex+1, template.length);
						text.push(sliced);
					}
					//last loop push to the end
					else if(i === count-1 && count > 1) {
						var sliced = template.slice(endIndex+1, template.length);
						text.push(sliced);
					}
				}
			}
			//no template and we just throw affix up
			else {
				text.push(this.props.stat.text);
			}
		}

		//determine color of affix text
		var textColor = 'd3-item-property-default';
		if (this.props.stat.hasOwnProperty('type') && this.props.stat.type === 'legendary') {
			textColor += ' d3-color-orange';
		}
		else {
			textColor += ' d3-color-blue';
		}

		return (

			React.createElement("li", {className: textColor}, 
				React.createElement("p", null, text)
			)

		);

	}

});

module.exports = D3ItemTooltipStat;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],14:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipWeapon= React.createClass({displayName: "D3ItemTooltipWeapon",

	render: function() {

		return (
			React.createElement("div", null, 
			React.createElement("ul", {className: "item-armor-weapon item-weapon-dps"}, 
				React.createElement("li", {className: "big"}, React.createElement("span", {className: "value"}, this.props.weapon.dps)), 
				React.createElement("li", null, "Damage Per Second")
			), 
			React.createElement("ul", {className: "item-armor-weapon item-weapon damage"}, 
				React.createElement("li", null, 
					React.createElement("p", null, 
						React.createElement("span", {className: "value"}, this.props.weapon.min), " -", 
						React.createElement("span", {className: "value"}, " ", this.props.weapon.max), 
						React.createElement("span", {className: "d3-color-FF888888"}, " Damage")
					)
				), 
				React.createElement("li", null, 
					React.createElement("p", null, 
						React.createElement("span", {className: "value"}, this.props.weapon.speed), 
						React.createElement("span", {className: "d3-color-FF888888"}, " Attacks per Second")
					)
				)
			)
			)
		);

	}

});

module.exports = D3ItemTooltipWeapon;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],15:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipHead = require('./d3-tooltip-head.jsx');
var D3ItemTooltipBody = require('./d3-tooltip-body.jsx');
var D3ItemTooltipFlavor = require('./d3-tooltip-flavor.jsx');

var D3ItemTooltip = React.createClass({displayName: "D3ItemTooltip",
	render: function() {
		var tooltipClass ='d3-tooltip d3-tooltip-item';
		if (this.props.item.rarity === 'ancient') {
			tooltipClass+=' ancient'
		}

		//determine whether or not to add flavor
		var flavor;
		if (this.props.item.hasOwnProperty('flavor')) {
			flavor = React.createElement(D3ItemTooltipFlavor, {flavor: this.props.item.flavor})
		}
		return (
			React.createElement("div", {className: "tooltip-content"}, 
				React.createElement("div", {className: tooltipClass}, 
					React.createElement(D3ItemTooltipHead, {item: this.props.item}), 
					React.createElement(D3ItemTooltipBody, {item: this.props.item}), 
					flavor
				)
			)
		);

	}
});

module.exports = D3ItemTooltip;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./d3-tooltip-body.jsx":10,"./d3-tooltip-flavor.jsx":11,"./d3-tooltip-head.jsx":12}],16:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var InventoryStore = require('../../stores/InventoryStore');

var ItemLeft = require('./item-left.jsx');
var ItemRight = require('./item-right.jsx');
var D3ItemTooltip = require('../d3-tooltip/d3-tooltip.jsx');

var IndividualItem = React.createClass({displayName: "IndividualItem",

	getInitialState:function() {
		return InventoryStore.getItem();
	},

	componentDidMount: function() {
		InventoryStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		InventoryStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState(InventoryStore.getItem());
	},

	render:function() {

		//only show tooltips/buttons if they are needed
		var tooltip;
		var hiddenButtons = 'hidden';
		if (typeof this.state.item !== 'undefined') {
			tooltip = React.createElement("div", {className: "tooltip-container"}, React.createElement(D3ItemTooltip, {item: this.state.item}));
			hiddenButtons = '';
		}

		return (
			React.createElement("div", null, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-xs-12 tooltip-overflow"}, 
						React.createElement(ItemLeft, {hideClass: hiddenButtons, hasPrevious: this.state.hasPrevious}), 
						tooltip, 
						React.createElement(ItemRight, {hideClass: hiddenButtons, hasNext: this.state.hasNext})
					)
				)
			)
		);
	}
});

module.exports = IndividualItem;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../stores/InventoryStore":37,"../d3-tooltip/d3-tooltip.jsx":15,"./item-left.jsx":17,"./item-right.jsx":18}],17:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var AppActions = require('../../actions/AppActions');

var ItemLeft = React.createClass({displayName: "ItemLeft",

	_handleClick:function() {
		AppActions.previousItem();
	},

	render:function() {

		var buttonClass = 'inventory-button shift left';
		if (!this.props.hasPrevious) {
			buttonClass+= ' disabled';
		}

		return (
			React.createElement("div", {className: this.props.hideClass}, 
				React.createElement("button", {className: buttonClass, onClick: this._handleClick}, 
					/*From Material Design icons by Google (CC by 4.0)*/
					React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "36", height: "36", viewBox: "0 0 36 36"}, 
						React.createElement("path", {d: "M23.12 11.12L21 9l-9 9 9 9 2.12-2.12L16.24 18z"})
					)
				)
			)
		);
	}
});

module.exports = ItemLeft;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../actions/AppActions":8}],18:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var AppActions = require('../../actions/AppActions');

var ItemRight = React.createClass({displayName: "ItemRight",

	_handleClick:function() {
		AppActions.nextItem();
	},

	render:function() {

		var buttonClass = 'inventory-button shift right';
		if (!this.props.hasNext) {
			buttonClass+= ' disabled';
		}

		return (
			React.createElement("div", {className: this.props.hideClass}, 
				React.createElement("button", {className: buttonClass, onClick: this._handleClick}, 
					/*From Material Design icons by Google (CC by 4.0)*/
					React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "36", height: "36", viewBox: "0 0 36 36"}, 
						React.createElement("path", {d: "M15 9l-2.12 2.12L19.76 18l-6.88 6.88L15 27l9-9z"})
					)
				)
			)
		);
	}
});

module.exports = ItemRight;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../actions/AppActions":8}],19:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var InventorySlot = require('./inventory-slot.jsx');
var PreviousInventory = require('./previous-inventory.jsx');
var NextInventory = require('./next-inventory.jsx');


var InventoryContainer = React.createClass({displayName: "InventoryContainer",
	render:function() {

		var inventorySlots = [];
		var key=0;

		//loop through the 10 columns of inventory
		for (var i = 0; i < 10; i++) {
			var columnLength = this.props.inventory[i].length;

			//a check for the total height of this column
			var heightCount = 0;

			//add all existing items to the columns
			for (var j=0; j < columnLength;j++) {
				if (typeof this.props.inventory[i][j] !== 'undefined') {
					heightCount += this.props.inventory[i][j].size;
					inventorySlots.push(React.createElement(InventorySlot, {data: this.props.inventory[i][j], key: key, column: i}))
					key++;
				}
			}

			//now fill in the rest of the column with blank spaces
			while(heightCount < 6) {
				heightCount++;
				inventorySlots.push(React.createElement(InventorySlot, {data: undefined, key: key, column: i}));
				key++;
			}

		}

		return (
			React.createElement("div", {className: "inventory-container"}, 
				React.createElement(PreviousInventory, {hasPrevious: this.props.hasPrevious}), 
				inventorySlots, 
				React.createElement(NextInventory, {hasNext: this.props.hasNext})
			)
		);
	}
});

module.exports = InventoryContainer

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./inventory-slot.jsx":20,"./next-inventory.jsx":22,"./previous-inventory.jsx":23}],20:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltip = require('../d3-tooltip/d3-tooltip.jsx');

var InventorySlot = React.createClass({displayName: "InventorySlot",
	componentDidMount:function() {
		this.setTooltipOffset();
	},
	componentDidUpdate:function() {
		this.setTooltipOffset();
	},

	setTooltipOffset:function() {
		var elem = React.findDOMNode(this);

		//if the inventory slot has children (content)
		if (elem.children && elem.children.length > 0) {
			var elemLocation = elem.getBoundingClientRect().top;
			var tooltipHeight = elem.children[4].getBoundingClientRect().height;
			var windowHeight = window.innerHeight;

			//check if the tooltip fits where it currently is
			if (!(tooltipHeight + elemLocation < windowHeight)) {
				var offset = (tooltipHeight + elemLocation - windowHeight);

				//if the tooltip is bigger than window, just show at top of window
				if (offset > windowHeight) {
					elem.children[4].style.top = '-'+(elemLocation-20)+'px';
				}
				else {
					//just move it up a little with a bit at bottom
					elem.children[4].style.top = '-'+(offset+10)+'px';
				}

			}
		}
	},

	render:function() {

		var slotContent= [];
		var slotContentKey = 0;

		var slotClass='inventory-slot';
		//check to make sure an actual item is in the inventory slot
		if (typeof this.props.data !== 'undefined') {
			//change the size to large if it is a large item
			if(this.props.data.hasOwnProperty('size') && this.props.data.size === 2) {
				slotClass += ' large';
			}

			if(this.props.data.hasOwnProperty('rarity')) {
				var bgurl;
				var borderColor='#302a21';

				switch(this.props.data.rarity) {
					case 'magic':
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/blue.png';
						borderColor='#7979d4';
						break;
					case 'rare':
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/yellow.png';
						borderColor='#f8cc35';
						break;
					case 'legendary':
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/orange.png';
						borderColor='#bf642f';
						break;
					case 'ancient':
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/green.png';
						borderColor='#bf642f';
						break;
					default:
						//noop
				}

				//switch bg to green if item is part of a set
				if (this.props.data.hasOwnProperty('set')) {
					bgurl='img/green.png';
					borderColor='#8bd442';
				}

				if (typeof bgurl !== 'undefined') {
					var inline = {
						backgroundImage:'url('+bgurl+')'
					};
					slotContent.push(React.createElement("div", {style: inline, className: "inventory-bg", key: slotContentKey}))
					slotContentKey++;
				}
			}

			//set the item image
			if (this.props.data.hasOwnProperty('image')) {
				var inline = {backgroundImage:'url('+this.props.data.image+')'};
				slotContent.push(React.createElement("div", {style: inline, className: "inventory-image", key: slotContentKey}));
				slotContentKey++;
			}

			//add a link to activate tooltip
			slotContent.push(React.createElement("a", {className: "tooltip-link", key: slotContentKey}));
			slotContentKey++;

			//add a gradient mask
			slotContent.push(React.createElement("div", {className: "inventory-item-gradient", key: slotContentKey}));
			slotContentKey++;

			//add a hidden tooltip
			var inline;
			if (this.props.column < 5) {
				inline = {left:'50px'};
			}
			else {
				inline = {right:'50px'};
			}

			slotContent.push(
				React.createElement("div", {className: "tooltip-container", style: inline, key: slotContentKey}, 
					React.createElement(D3ItemTooltip, {item: this.props.data})
				)
			);
			slotContentKey++;

			//add sockets on hover
			if (this.props.data.hasOwnProperty('primaries') && this.props.data.primaries.hasOwnProperty('Socket')) {
				var sockets;
				var socketCount = this.props.data.primaries.Socket.value;
				var socketContents = [];
				for (var i =0; i < socketCount; i++) {
					socketContents.push(React.createElement("div", {className: "socket", key: i}));
				}
				sockets = React.createElement("div", {className: "sockets-wrapper", key: slotContentKey}, React.createElement("div", {className: "sockets-align"}, socketContents));
				slotContent.push(sockets);
				slotContentKey++;
			}

		}

		return (
			React.createElement("div", {className: slotClass, style: {borderColor:borderColor}}, 
				slotContent
			)
		);
	}
});

module.exports = InventorySlot;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../d3-tooltip/d3-tooltip.jsx":15}],21:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var InventoryContainer = require('./inventory-container.jsx');
var InventoryStore = require('../../stores/InventoryStore');

var Inventory = React.createClass({displayName: "Inventory",
	getInitialState: function() {
		return InventoryStore.getInventory();
	},
	componentDidMount: function() {
		InventoryStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		InventoryStore.removeChangeListener(this._onChange);
	},

	_onChange:function() {
		this.setState(InventoryStore.getInventory());
	},

	render:function() {
		return (
			React.createElement("div", {className: "inventory-section"}, 
				React.createElement(InventoryContainer, {
					inventory: this.state.currentInventory, 
					hasPrevious: typeof this.state.previousInventory !== 'undefined', 
					hasNext: typeof this.state.nextInventory !== 'undefined'}
				)
			)
		);
	}
});

module.exports = Inventory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../stores/InventoryStore":37,"./inventory-container.jsx":19}],22:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var AppActions = require('../../actions/AppActions');

var NextInventory = React.createClass({displayName: "NextInventory",
	_handleClick:function() {
		AppActions.nextInventory();
	},

	render:function() {

		var buttonClass = 'inventory-button';
		if (!this.props.hasNext) {
			buttonClass+= ' disabled';
		}

		return (
			React.createElement("div", {className: "inventory-button-container"}, 
				React.createElement("button", {className: buttonClass, onClick: this._handleClick}, 
					/*From Material Design icons by Google (CC by 4.0)*/
					React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "36", height: "36", viewBox: "0 0 36 36"}, 
						React.createElement("path", {d: "M15 9l-2.12 2.12L19.76 18l-6.88 6.88L15 27l9-9z"})
					)
				)
			)
		);
	}
});

module.exports = NextInventory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../actions/AppActions":8}],23:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var AppActions = require('../../actions/AppActions');

var PreviousInventory = React.createClass({displayName: "PreviousInventory",
	_handleClick:function() {
		AppActions.previousInventory();
	},

	render:function() {

		var buttonClass = 'inventory-button';
		if (!this.props.hasPrevious) {
			buttonClass+= ' disabled';
		}

		return (
			React.createElement("div", {className: "inventory-button-container"}, 
				React.createElement("button", {className: buttonClass, onClick: this._handleClick}, 
					/*From Material Design icons by Google (CC by 4.0)*/
					React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "36", height: "36", viewBox: "0 0 36 36"}, 
						React.createElement("path", {d: "M23.12 11.12L21 9l-9 9 9 9 2.12-2.12L16.24 18z"})
					)
				)
			)
		);
	}
});

module.exports = PreviousInventory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../actions/AppActions":8}],24:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var ClassSelectorButton = React.createClass({displayName: "ClassSelectorButton",

	//state is handled in the parent component
	//this function is up there
	handleClick:function() {
		this.props.changeClass(this.props.name);
	},

	render:function() {

		var shortenedNames = {
			Barbarian:'barb',
			Crusader:'crus',
			'Demon Hunter':'dh',
			Monk:'monk',
			'Witch Doctor':'wd',
			Wizard:'wiz'
		}

		var buttonClass = 'class-selector';
		if (this.props.selected) {
			buttonClass+= ' selected'
		}

		var imageClass= this.props.name.toLowerCase().replace(' ','');
		imageClass+= this.props.gender.toLowerCase();

		return (
			React.createElement("li", null, 
				React.createElement("button", {className: buttonClass, onClick: this.handleClick}, 
					React.createElement("div", {className: imageClass}), 
					React.createElement("span", null, this.props.name.toLowerCase()), 
					React.createElement("span", {className: "shortened"}, shortenedNames[this.props.name])
				)
			)
		);
	}

});

module.exports = ClassSelectorButton;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],25:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var ClassSelectorButton = require('./class-selector-button.jsx');

var ClassSelector = React.createClass({displayName: "ClassSelector",

	render:function() {
		var dClasses = ['Barbarian','Crusader','Demon Hunter','Monk','Witch Doctor','Wizard'];
		var dClassesLength = dClasses.length;

		var classSelectors = [];
		for (var i =0; i < dClassesLength;i++) {

			//check for selected class stored in state of this component
			var selected = false;
			if (this.props.selected === dClasses[i]) {
				selected = true;
			}

			//put selectors in array to be rendered
			classSelectors.push(
				React.createElement(ClassSelectorButton, {
					name: dClasses[i], 
					changeClass: this.props.changeClass, 
					key: i, 
					selected: selected, 
					gender: this.props.gender}
					)
			);
		}


		return (
			React.createElement("div", null, 
				React.createElement("ul", {className: "class-selector"}, 
					classSelectors
				)
			)
		);

	}
});

module.exports = ClassSelector;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./class-selector-button.jsx":24}],26:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var GenderSelectorButton = React.createClass({displayName: "GenderSelectorButton",

	updateGender:function() {
		this.props.changeGender(this.props.gender);
	},

	render:function() {

		var buttonClass='gender-selector '+this.props.gender.toLowerCase();
		if (this.props.selected) {
			buttonClass+= ' selected';
		}

		return (
			React.createElement("div", {className: "button-wrapper"}, 
				React.createElement("button", {className: buttonClass, onClick: this.updateGender}, 
					React.createElement("div", null), 
					React.createElement("span", null, this.props.gender.toLowerCase())
				)
			)
		);
	}
});

module.exports = GenderSelectorButton;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],27:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var GenderSelectorButton = require('./gender-selector-button.jsx');

var GenderSelector = React.createClass({displayName: "GenderSelector",

	render:function() {
		var maleSelected = (this.props.selected === 'Male');
		var femaleSelected = (this.props.selected === 'Female');

		return (
			React.createElement("div", {className: "gender-selector"}, 
				React.createElement(GenderSelectorButton, {gender: "Male", changeGender: this.props.changeGender, selected: maleSelected}), 
				React.createElement(GenderSelectorButton, {gender: "Female", changeGender: this.props.changeGender, selected: femaleSelected})
			)
		);
	}
});

module.exports = GenderSelector;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./gender-selector-button.jsx":26}],28:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var HardcoreCheckbox = React.createClass({displayName: "HardcoreCheckbox",
	updateHardcore:function(){
		this.props.changeHardcore(!this.props.hardcore);
	},

	render:function() {
		return (
			React.createElement("div", {className: "checkbox-wrapper"}, 
				React.createElement("label", null, 
					React.createElement("input", {type: "checkbox", className: "options-checkbox", checked: this.props.hardcore, onChange: this.updateHardcore}), 
					React.createElement("span", {className: "checkbox-label"}, "Hardcore ", React.createElement("span", {className: "hidden-sm"}, "Hero"))
				)
			)
		);
	}
});

module.exports = HardcoreCheckbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],29:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);

var AppActions = require('../../actions/AppActions.js');
var AppStore = require('../../stores/AppStore.js');

var ClassSelector = require('./class-selector.jsx');
var GenderSelector = require('./gender-selector.jsx');
var SeasonalCheckbox = require('./seasonal-checkbox.jsx');
var HardcoreCheckbox = require('./hardcore-checkbox.jsx');

var OptionsPanel = React.createClass({displayName: "OptionsPanel",

	getInitialState:function() {
		var initial = AppStore.getSettings();
		d3sim.setKadala(initial.dClass,initial.seasonal,initial.hardcore);
		return initial;
	},
	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState(AppStore.getSettings());
	},

	changeGender:function(gender) {
		AppActions.changeSetting('gender',gender);
	},
	changeClass:function(dClass) {
		AppActions.changeSetting('dClass',dClass);
	},
	changeHardcore:function(bool) {
		AppActions.changeSetting('hardcore',bool);
	},
	changeSeasonal:function(bool) {
		AppActions.changeSetting('seasonal',bool);
	},

	render:function() {

		var optsClass = 'options-panel';
		if (this.state.options) {
			optsClass += ' unhide';
		}
		return (
			React.createElement("section", {className: optsClass}, 
				React.createElement(ClassSelector, {changeClass: this.changeClass, selected: this.state.dClass, gender: this.state.gender}), 
				React.createElement(GenderSelector, {changeGender: this.changeGender, selected: this.state.gender}), 
				React.createElement(SeasonalCheckbox, {seasonal: this.state.seasonal, changeSeasonal: this.changeSeasonal}), 
				React.createElement(HardcoreCheckbox, {hardcore: this.state.hardcore, changeHardcore: this.changeHardcore})
			)
		);
	}
});

module.exports = OptionsPanel;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../actions/AppActions.js":8,"../../stores/AppStore.js":36,"./class-selector.jsx":25,"./gender-selector.jsx":27,"./hardcore-checkbox.jsx":28,"./seasonal-checkbox.jsx":30}],30:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var SeasonalCheckbox = React.createClass({displayName: "SeasonalCheckbox",
	updateSeasonal:function() {
		this.props.changeSeasonal(!this.props.seasonal);
	},

	render:function() {
		return (
			React.createElement("div", {className: "checkbox-wrapper"}, 
				React.createElement("label", null, 
					React.createElement("input", {type: "checkbox", className: "options-checkbox", checked: this.props.seasonal, onChange: this.updateSeasonal}), 
					React.createElement("span", {className: "checkbox-label"}, "Seasonal ", React.createElement("span", {className: "hidden-sm"}, "Hero"))
				)
			)
		);
	}
});

module.exports = SeasonalCheckbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],31:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);

var AppActions = require('../../actions/AppActions');
var AppStore = require('../../stores/AppStore');

var KadalaItem = React.createClass({displayName: "KadalaItem",

	getInitialState:function() {
		return {
			mobile:AppStore.getSettings().mobile,
			shardCount:AppStore.getShards(this.props.item.type)
		};
	},
	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState({
			shardCount:AppStore.getShards(this.props.item.type)
		});
	},
	buyItem:function() {
		//increment the blood shard count
		var currentCount = this.state.shardCount;
		currentCount += this.props.item.cost;
		this.setState({shardCount:currentCount});

		var item = d3sim.kadalaRoll(this.props.item.type);
		item.size = this.props.item.size;
		AppActions.addItem(item);
		AppActions.changeSetting('item',this.props.item);
		AppActions.incrementShards(this.props.item.type,this.props.item.cost);

		if (this.state.mobile) {
			AppActions.toggleStore();
		}
	},
	resetCount:function() {
		this.setState({shardCount:0});
	},

	render:function() {

		var iconClass = 'kadala-icon';
		iconClass+=' '+this.props.item.type;

		return (
			React.createElement("div", {className: "kadala-item"}, 
				React.createElement("button", {className: "kadala", onClick: this.buyItem}, 
					React.createElement("div", {className: iconClass}), 
					React.createElement("span", null, this.props.item.cost)
				), 
				React.createElement("div", {className: "kadala-content"}, 
					React.createElement("span", {className: "kadala-item-title"}, this.props.item.text), 
					React.createElement("span", {className: "shard-count"}, 
						this.state.shardCount, 
						React.createElement("a", {className: "shard-delete", onClick: this.resetCount}, 
							/*From Material Design icons by Google (CC by 4.0)*/
							React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24"}, 
								React.createElement("path", {d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"})
							)
						)
					)
				)
			)
		);
	}
});

module.exports = KadalaItem;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../actions/AppActions":8,"../../stores/AppStore":36}],32:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var KadalaItem = require('./kadala-item.jsx');
var AppStore = require('../../stores/AppStore');

var KadalaStore = React.createClass({displayName: "KadalaStore",
	getInitialState:function() {
		return AppStore.getSettings();
	},
	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState(AppStore.getSettings());
	},

	render:function() {

		var kadalaClass = 'kadala-store';
		//this is a check for internet explorer
		//flex-direction:column breaks everything so we detect for it here
		if ((window.navigator.userAgent.indexOf('MSIE ') !== -1)||!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			kadalaClass+=' noie';
		}

		if (this.state.store) {
			kadalaClass+=' unhide';
		}

		var items = [
			{type:'helm',text:'Mystery Helmet',cost:25,size:2},
			{type:'boots',text:'Mystery Boots',cost:25,size:2},
			{type:'belt',text:'Mystery Belt',cost:25,size:1},
			{type:'pants',text:'Mystery Pants',cost:25,size:2},
			{type:'gloves',text:'Mystery Gloves',cost:25,size:2},
			{type:'chest',text:'Mystery Chest',cost:25,size:2},
			{type:'shoulders',text:'Mystery Shoulders',cost:25,size:2},
			{type:'bracers',text:'Mystery Bracers',cost:25,size:2},
			{type:'quiver',text:'Mystery Quiver',cost:25,size:2},
			{type:'mojo',text:'Mystery Mojo',cost:25,size:2},
			{type:'source',text:'Mystery Source',cost:25,size:2},
			{type:'shield',text:'Mystery Shield',cost:25,size:2},
			{type:'onehand',text:'1-H Mystery Weapon',cost:75,size:2},
			{type:'twohand',text:'2-H Mystery Weapon',cost:75,size:2},
			{type:'ring',text:'Mystery Ring',cost:50,size:1},
			{type:'amulet',text:'Mystery Amulet',cost:100,size:1}
		]

		var kadalaSlots = [];
		var itemsLength = items.length;
		for (var i =0; i < itemsLength; i++) {
			kadalaSlots.push(React.createElement(KadalaItem, {key: i, item: items[i]}));
		}

		return (
			React.createElement("div", {className: kadalaClass, id: "kadala-store"}, 
				kadalaSlots
			)
		);
	}
});

module.exports = KadalaStore;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../stores/AppStore":36,"./kadala-item.jsx":31}],33:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);

var AppActions = require('../../actions/AppActions.js');
var AppStore = require('../../stores/AppStore.js');

var Navbar = React.createClass({displayName: "Navbar",
	getInitialState:function() {
		return AppStore.getSettings();
	},
	buyItem:function() {
		var item = d3sim.kadalaRoll(this.state.item.type);
		item.size = this.state.item.size;
		AppActions.addItem(item);
		AppActions.incrementShards(this.state.item.type,this.state.item.cost);
	},

	toggleOptions:function() {
		AppActions.toggleOptions();
	},
	toggleStore:function() {
		AppActions.toggleStore();
	},

	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState(AppStore.getSettings());
	},

	render:function() {
		return(
			React.createElement("nav", null, 
				React.createElement("button", {className: "ham", onClick: this.toggleOptions}, 
					/*From Material Design icons by Google (CC by 4.0)*/
					React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"}, 
						React.createElement("path", {d: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"})
					)
				), 
				React.createElement("h1", null, "Kadala Simulator"), 
				React.createElement("button", {className: "buy", onClick: this.buyItem}, this.state.item.text), 
				React.createElement("button", {className: "shop", onClick: this.toggleStore}, 
					/*From Material Design icons by Google (CC by 4.0)*/
					React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"}, 
						React.createElement("path", {d: "M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"})
					)
				)
			)
		);
	}
});

module.exports = Navbar;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../actions/AppActions.js":8,"../../stores/AppStore.js":36}],34:[function(require,module,exports){
var keyMirror = require('keymirror');

module.exports = keyMirror({
	ADD_ITEM:null,

	PREV_INV:null,
	NEXT_INV:null,

	PREV_ITEM:null,
	NEXT_ITEM:null,

	CHANGE_SETTING:null,
	INCREMENT_SHARDS:null,

	TOGGLE_OPTIONS:null,
	TOGGLE_STORE:null
});

},{"keymirror":6}],35:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":3}],36:[function(require,module,exports){
(function (global){
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var appSettings = {};
var defaults = {
	dClass:'Barbarian',
	gender:'Female',
	hardcore:false,
	seasonal:true,
	item:{"type":"helm","text":"Mystery Helmet","cost":25,"size":2}
};
var shardsSpent = {};
var lifetime = {};

var storageSupported;

//Determine whether or not local storage is supported
//from github.com/agrublev/angularLocalStorage
//MIT Licence
function localStorageCheck() {
	var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;
	supported = (typeof storage !== 'undefined');
	if (supported) {
		var testKey = '__' + Math.round(Math.random() * 1e7);
		try {
			localStorage.setItem(testKey, testKey);
			localStorage.removeItem(testKey);
		}
		catch (err) {
			supported = false;
		}
	}
	storageSupported = supported;
}

function toggleStore() {
	appSettings.store = !appSettings.store;
}
function toggleOptions() {
	appSettings.options = !appSettings.options;
}

function getSettings() {
	return appSettings;
}

function getShards(key) {
	return shardsSpent[key] || 0;
}

function changeSetting(key,val) {
	appSettings[key] = val;
	d3sim.setKadala(appSettings.dClass,appSettings.seasonal,appSettings.hardcore);
	saveSettings();
}

function saveSettings() {
	if (storageSupported) {
		localStorage.kadalaSettings = JSON.stringify(appSettings);
		localStorage.kadalaSpent = JSON.stringify(shardsSpent);
		localStorage.kadalaLifetime = JSON.stringify(lifetime);
	}
}

function incrementShards(key,val) {
	if (typeof shardsSpent[key] !== 'undefined') {
		shardsSpent[key]+=val;
	}
	else {
		shardsSpent[key] = val;
	}
	if (typeof lifetime[key] !== 'undefined') {
		lifetime[key]+=val;
	}
	else {
		lifetime[key]=val;
	}
	saveSettings();
}


var AppStore = assign({},EventEmitter.prototype,{
	getSettings:getSettings,
	getShards:getShards,

	emitChange:function(){
		this.emit(CHANGE_EVENT);
	},
	addChangeListener:function(callback) {
		this.on(CHANGE_EVENT,callback);
	},
	removeChangeListener:function(callback) {
		this.removeListener(CHANGE_EVENT,callback);
	}
});

//hoisting overpowered
function mobileCheck() {
	var mobile = (window.innerWidth <= 768);

	//if different than current change
	if (mobile !== appSettings.mobile) {
		appSettings.mobile = mobile;
		appSettings.store = !mobile;
		appSettings.options = !mobile;
	}
	AppStore.emit(CHANGE_EVENT);

}

function init() {
	localStorageCheck();
	mobileCheck();
	window.onresize = mobileCheck;

	if (storageSupported) {
		var stored = JSON.parse(localStorage.getItem('kadalaSettings')) || {};

		//loop through existing defaults incase user has older version of app
		var settingsKeys = Object.keys(defaults);
		var keyLength = settingsKeys.length;
		for (var i =0; i < keyLength; i++) {
			appSettings[settingsKeys[i]] = stored[settingsKeys[i]] || defaults[settingsKeys[i]];
		}

		//pull the spent items
		shardsSpent = JSON.parse(localStorage.getItem('kadalaSpent')) || {};
		lifetime = JSON.parse(localStorage.getItem('kadalaLifetime')) || {};

		//save to storage
		saveSettings();
	}
}

init();

AppDispatcher.register(function(action) {
	switch(action.actionType){
		case AppConstants.CHANGE_SETTING:
			changeSetting(action.key,action.val);
			AppStore.emitChange();
			break;
		case AppConstants.INCREMENT_SHARDS:
			incrementShards(action.key,action.val);
			AppStore.emitChange();
			break;
		case AppConstants.TOGGLE_STORE:
			toggleStore();
			AppStore.emitChange();
			break;
		case AppConstants.TOGGLE_OPTIONS:
			toggleOptions();
			AppStore.emitChange();
			break;
		default:
			//noop
	}
});

module.exports = AppStore;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../constants/AppConstants":34,"../dispatcher/AppDispatcher":35,"events":2,"object-assign":7}],37:[function(require,module,exports){
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

//there are only two inventories being used with the ability to cycle back
var previousInventory;
var currentInventory;
var nextInventory;

var items = [];
var currentIndex = 0;

//creates nested array blank inventory and sets as the current inventory
function createInventory() {
	var newInventory = [];

	for (var i=0;i<10;i++) {
		//push a blank array to represent each column of the inventory
		newInventory.push([]);
	}

	//set the previous inventory to the latest inventory used
	previousInventory = nextInventory || currentInventory || undefined;
	//the new blank inventory is now the current inventory
	currentInventory = newInventory;
}

function getInventory() {
	return {
		previousInventory:previousInventory,
		currentInventory:currentInventory,
		nextInventory:nextInventory
	};
}

function getItem() {
	return {
		hasPrevious:(currentIndex !== 0),
		item:items[currentIndex],
		hasNext:(currentIndex < items.length - 1)
	};
}

function addItem(item) {
	var inventoryLength = currentInventory.length;
	//looping through each column of the inventory
	for (var i = 0; i < inventoryLength; i ++) {
		//loop through each item in said column
		var columnLength = currentInventory[i].length;
		var columnHeight = 0;
		for (var j = 0; j < columnLength; j++) {
			//add current item size to column height
			if(currentInventory[i][j].hasOwnProperty('size')) {
				columnHeight+=currentInventory[i][j].size;
			}
		}
		//check if the height is still less than 6 with new item
		//and add to that column and return to stop the madness
		if (columnHeight+item.size <=6) {
			currentInventory[i].push(item);
			//if we can successfully add to inventory call for items inventory
			addToItems(item);
			return;
		}
	}

	//if we made it this far the new item does not fit in the current inventory
	//check to see if there is a next inventory
	//so that we can cycle to next inventory and try and fit it in
	if (typeof nextInventory !== 'undefined') {
		gotoNext();
		addItem(item);
	}
	//there is no next inventory and we need to make a new one
	else {
		createInventory();
		addItem(item);
	}
}

function addToItems(item) {
	items.push(item);

	//if there are more than 10 items remove the first
	if (items.length > 10) {
		items.shift();
	}

	//set the currentindex to the new item
	currentIndex = items.length - 1;
}

function previousItem() {
	if (currentIndex !== 0) {
		currentIndex -=1;
	}
}
function nextItem() {
	if (currentIndex < items.length -1) {
		currentIndex +=1;
	}
}

//cycles through to the previous inventory
function gotoPrevious() {
	if(typeof previousInventory !== 'undefined') {
		nextInventory = currentInventory;
		currentInventory = previousInventory;
		previousInventory = undefined;
	}
}

//cycles through to the next inventory
function gotoNext() {
	if(typeof nextInventory !== 'undefined') {
		previousInventory = currentInventory;
		currentInventory = nextInventory;
		nextInventory = undefined;
	}
}

//initialize store by creating a blank inventory
createInventory();

var InventoryStore = assign({}, EventEmitter.prototype,{
	getInventory:getInventory,
	gotoPrevious:gotoPrevious,
	gotoNext:gotoNext,
	addItem:addItem,
	getItem:getItem,
	previousItem:previousItem,
	nextItem:nextItem,

	emitChange:function(){
		this.emit(CHANGE_EVENT);
	},
	addChangeListener:function(callback) {
		this.on(CHANGE_EVENT,callback);
	},
	removeChangeListener:function(callback) {
		this.removeListener(CHANGE_EVENT,callback);
	}
});

AppDispatcher.register(function(action) {
	switch(action.actionType) {

		case AppConstants.ADD_ITEM:
			addItem(action.item);
			InventoryStore.emitChange();
			break;

		case AppConstants.PREV_INV:
			gotoPrevious();
			InventoryStore.emitChange();
			break;

		case AppConstants.NEXT_INV:
			gotoNext();
			InventoryStore.emitChange();
			break;

		case AppConstants.PREV_ITEM:
			previousItem();
			InventoryStore.emitChange();
			break;

		case AppConstants.NEXT_ITEM:
			nextItem();
			InventoryStore.emitChange();
			break;

		default:
			//noop
	}
});

module.exports = InventoryStore;

},{"../constants/AppConstants":34,"../dispatcher/AppDispatcher":35,"events":2,"object-assign":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxhY3Rpb25zXFxBcHBBY3Rpb25zLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWFybW9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1ib2R5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1mbGF2b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWhlYWQuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLXN0YXQuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLXdlYXBvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbmRpdmlkdWFsLWl0ZW1cXGluZGl2aWR1YWwtaXRlbS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGluZGl2aWR1YWwtaXRlbVxcaXRlbS1sZWZ0LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW5kaXZpZHVhbC1pdGVtXFxpdGVtLXJpZ2h0LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxpbnZlbnRvcnktY29udGFpbmVyLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxpbnZlbnRvcnktc2xvdC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxuZXh0LWludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxccHJldmlvdXMtaW52ZW50b3J5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGNsYXNzLXNlbGVjdG9yLWJ1dHRvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxjbGFzcy1zZWxlY3Rvci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxnZW5kZXItc2VsZWN0b3ItYnV0dG9uLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGdlbmRlci1zZWxlY3Rvci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxoYXJkY29yZS1jaGVja2JveC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxvcHRpb25zLXBhbmVsLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXHNlYXNvbmFsLWNoZWNrYm94LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLXN0b3JlXFxrYWRhbGEtaXRlbS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1zdG9yZVxca2FkYWxhLXN0b3JlLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcbmF2XFxuYXZiYXIuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb25zdGFudHNcXEFwcENvbnN0YW50cy5qcyIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcZGlzcGF0Y2hlclxcQXBwRGlzcGF0Y2hlci5qcyIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcc3RvcmVzXFxBcHBTdG9yZS5qcyIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcc3RvcmVzXFxJbnZlbnRvcnlTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3BELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0FBQzVFLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0FBQ3hFLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBQ2hFLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDOztBQUVqRixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFL0MsSUFBSSxpQ0FBaUMsMkJBQUE7Q0FDcEMsZUFBZSxDQUFDLFdBQVc7RUFDMUIsT0FBTyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDOUI7Q0FDRCxpQkFBaUIsRUFBRSxXQUFXO0VBQzdCLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDM0M7Q0FDRCxvQkFBb0IsRUFBRSxXQUFXO0VBQ2hDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDOUM7Q0FDRCxTQUFTLENBQUMsV0FBVztFQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLEVBQUU7O0FBRUYsQ0FBQyxNQUFNLENBQUMsV0FBVztBQUNuQjs7RUFFRSxJQUFJLFNBQVMsQ0FBQztBQUNoQixFQUFFLElBQUksY0FBYyxDQUFDOztFQUVuQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0dBQ3RCLGNBQWMsR0FBRyxvQkFBQyxjQUFjLEVBQUEsSUFBQSxDQUFHLENBQUE7R0FDbkM7T0FDSTtHQUNKLFNBQVMsR0FBRyxvQkFBQyxTQUFTLEVBQUEsSUFBQSxDQUFHLENBQUE7QUFDNUIsR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxJQUFDLEVBQUE7R0FDTCxvQkFBQyxNQUFNLEVBQUEsQ0FBQSxDQUFDLE1BQUEsRUFBTSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTyxDQUFBLENBQUcsQ0FBQSxFQUFBO0dBQ3JDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsaUJBQWtCLENBQUEsRUFBQTtJQUNoQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLEtBQU0sQ0FBQSxFQUFBO0tBQ3BCLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsVUFBVyxDQUFBLEVBQUE7TUFDekIsb0JBQUMsWUFBWSxFQUFBLElBQUEsQ0FBRyxDQUFBO0tBQ1gsQ0FBQSxFQUFBO0tBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxVQUFXLENBQUEsRUFBQTtNQUN6QixvQkFBQyxXQUFXLEVBQUEsSUFBRSxDQUFBLEVBQUE7TUFDYixTQUFVO0tBQ04sQ0FBQTtJQUNELENBQUEsRUFBQTtJQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsS0FBTSxDQUFBLEVBQUE7S0FDcEIsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQTtNQUN6QixjQUFlO0tBQ1gsQ0FBQTtJQUNELENBQUE7R0FDRCxDQUFBO0dBQ0EsQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxLQUFLLENBQUMsTUFBTTtDQUNYLG9CQUFDLFdBQVcsRUFBQSxJQUFBLENBQUcsQ0FBQTtDQUNmLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO0NBQzlCOzs7OztBQ2hFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFB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ZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgTmF2YmFyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL25hdi9uYXZiYXIuanN4Jyk7XHJcbnZhciBPcHRpb25zUGFuZWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMva2FkYWxhLW9wdGlvbnMvb3B0aW9ucy1wYW5lbC5qc3gnKTtcclxudmFyIEthZGFsYVN0b3JlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2thZGFsYS1zdG9yZS9rYWRhbGEtc3RvcmUuanN4Jyk7XHJcbnZhciBJbnZlbnRvcnkgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaW52ZW50b3J5L2ludmVudG9yeS5qc3gnKTtcclxudmFyIEluZGl2aWR1YWxJdGVtID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2luZGl2aWR1YWwtaXRlbS9pbmRpdmlkdWFsLWl0ZW0uanN4Jyk7XHJcblxyXG52YXIgQXBwU3RvcmUgPSByZXF1aXJlKCcuL3N0b3Jlcy9BcHBTdG9yZS5qcycpO1xyXG5cclxudmFyIEFwcGxpY2F0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBcHBTdG9yZS5nZXRTZXR0aW5ncygpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShBcHBTdG9yZS5nZXRTZXR0aW5ncygpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly9jb25kaXRpb25hbGx5IHJlbmRlciBlaXRoZXIgdGhlIGludmVudG9yeSBvciBpbmRpdmlkdWFsIGl0ZW0gYmFzZWQgb24gc2NyZWVuIHNpemVcclxuXHRcdHZhciBpbnZlbnRvcnk7XHJcblx0XHR2YXIgaW5kaXZpZHVhbEl0ZW07XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUubW9iaWxlKSB7XHJcblx0XHRcdGluZGl2aWR1YWxJdGVtID0gPEluZGl2aWR1YWxJdGVtIC8+XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aW52ZW50b3J5ID0gPEludmVudG9yeSAvPlxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdDxOYXZiYXIgbW9iaWxlPXt0aGlzLnN0YXRlLm1vYmlsZX0gLz5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lci1mbHVpZCc+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTMnPlxyXG5cdFx0XHRcdFx0XHQ8T3B0aW9uc1BhbmVsIC8+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tOSc+XHJcblx0XHRcdFx0XHRcdDxLYWRhbGFTdG9yZS8+XHJcblx0XHRcdFx0XHRcdHtpbnZlbnRvcnl9XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInPlxyXG5cdFx0XHRcdFx0XHR7aW5kaXZpZHVhbEl0ZW19XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxuUmVhY3QucmVuZGVyKFxyXG5cdDxBcHBsaWNhdGlvbiAvPixcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcclxuKTsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbm1vZHVsZS5leHBvcnRzLkRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL2xpYi9EaXNwYXRjaGVyJylcbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogQHR5cGVjaGVja3NcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJy4vaW52YXJpYW50Jyk7XG5cbnZhciBfbGFzdElEID0gMTtcbnZhciBfcHJlZml4ID0gJ0lEXyc7XG5cbi8qKlxuICogRGlzcGF0Y2hlciBpcyB1c2VkIHRvIGJyb2FkY2FzdCBwYXlsb2FkcyB0byByZWdpc3RlcmVkIGNhbGxiYWNrcy4gVGhpcyBpc1xuICogZGlmZmVyZW50IGZyb20gZ2VuZXJpYyBwdWItc3ViIHN5c3RlbXMgaW4gdHdvIHdheXM6XG4gKlxuICogICAxKSBDYWxsYmFja3MgYXJlIG5vdCBzdWJzY3JpYmVkIHRvIHBhcnRpY3VsYXIgZXZlbnRzLiBFdmVyeSBwYXlsb2FkIGlzXG4gKiAgICAgIGRpc3BhdGNoZWQgdG8gZXZlcnkgcmVnaXN0ZXJlZCBjYWxsYmFjay5cbiAqICAgMikgQ2FsbGJhY2tzIGNhbiBiZSBkZWZlcnJlZCBpbiB3aG9sZSBvciBwYXJ0IHVudGlsIG90aGVyIGNhbGxiYWNrcyBoYXZlXG4gKiAgICAgIGJlZW4gZXhlY3V0ZWQuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoaXMgaHlwb3RoZXRpY2FsIGZsaWdodCBkZXN0aW5hdGlvbiBmb3JtLCB3aGljaFxuICogc2VsZWN0cyBhIGRlZmF1bHQgY2l0eSB3aGVuIGEgY291bnRyeSBpcyBzZWxlY3RlZDpcbiAqXG4gKiAgIHZhciBmbGlnaHREaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNvdW50cnkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENvdW50cnlTdG9yZSA9IHtjb3VudHJ5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNpdHkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENpdHlTdG9yZSA9IHtjaXR5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHRoZSBiYXNlIGZsaWdodCBwcmljZSBvZiB0aGUgc2VsZWN0ZWQgY2l0eVxuICogICB2YXIgRmxpZ2h0UHJpY2VTdG9yZSA9IHtwcmljZTogbnVsbH1cbiAqXG4gKiBXaGVuIGEgdXNlciBjaGFuZ2VzIHRoZSBzZWxlY3RlZCBjaXR5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjaXR5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDaXR5OiAncGFyaXMnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBgQ2l0eVN0b3JlYDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjaXR5LXVwZGF0ZScpIHtcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gcGF5bG9hZC5zZWxlY3RlZENpdHk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBjb3VudHJ5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjb3VudHJ5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDb3VudHJ5OiAnYXVzdHJhbGlhJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYm90aCBzdG9yZXM6XG4gKlxuICogICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb25UeXBlKSB7XG4gKiAgICAgICAgIGNhc2UgJ2NvdW50cnktdXBkYXRlJzpcbiAqICAgICAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NpdHlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBnZXRGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKlxuICogICAgICAgICBjYXNlICdjaXR5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgYGNvdW50cnktdXBkYXRlYCBwYXlsb2FkIHdpbGwgYmUgZ3VhcmFudGVlZCB0byBpbnZva2UgdGhlIHN0b3JlcydcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzIGluIG9yZGVyOiBgQ291bnRyeVN0b3JlYCwgYENpdHlTdG9yZWAsIHRoZW5cbiAqIGBGbGlnaHRQcmljZVN0b3JlYC5cbiAqL1xuXG4gIGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aXRoIGV2ZXJ5IGRpc3BhdGNoZWQgcGF5bG9hZC4gUmV0dXJuc1xuICAgKiBhIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgd2l0aCBgd2FpdEZvcigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgaWQgPSBfcHJlZml4ICsgX2xhc3RJRCsrO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNhbGxiYWNrIGJhc2VkIG9uIGl0cyB0b2tlbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS51bnJlZ2lzdGVyPWZ1bmN0aW9uKGlkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgJ0Rpc3BhdGNoZXIudW5yZWdpc3RlciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgIGlkXG4gICAgKTtcbiAgICBkZWxldGUgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIGNhbGxiYWNrcyBzcGVjaWZpZWQgdG8gYmUgaW52b2tlZCBiZWZvcmUgY29udGludWluZyBleGVjdXRpb25cbiAgICogb2YgdGhlIGN1cnJlbnQgY2FsbGJhY2suIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgYSBjYWxsYmFjayBpblxuICAgKiByZXNwb25zZSB0byBhIGRpc3BhdGNoZWQgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheTxzdHJpbmc+fSBpZHNcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLndhaXRGb3I9ZnVuY3Rpb24oaWRzKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJ1xuICAgICk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBpZCA9IGlkc1tpaV07XG4gICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgIGludmFyaWFudChcbiAgICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0sXG4gICAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIHdoaWxlICcgK1xuICAgICAgICAgICd3YWl0aW5nIGZvciBgJXNgLicsXG4gICAgICAgICAgaWRcbiAgICAgICAgKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpbnZhcmlhbnQoXG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgICAgaWRcbiAgICAgICk7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYSBwYXlsb2FkIHRvIGFsbCByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICAhdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoLmRpc3BhdGNoKC4uLik6IENhbm5vdCBkaXNwYXRjaCBpbiB0aGUgbWlkZGxlIG9mIGEgZGlzcGF0Y2guJ1xuICAgICk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nKHBheWxvYWQpO1xuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGlzIERpc3BhdGNoZXIgY3VycmVudGx5IGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuaXNEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoZSBjYWxsYmFjayBzdG9yZWQgd2l0aCB0aGUgZ2l2ZW4gaWQuIEFsc28gZG8gc29tZSBpbnRlcm5hbFxuICAgKiBib29ra2VlcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2s9ZnVuY3Rpb24oaWQpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSB0cnVlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSh0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdXAgYm9va2tlZXBpbmcgbmVlZGVkIHdoZW4gZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZz1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFyIGJvb2trZWVwaW5nIHVzZWQgZm9yIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChmYWxzZSkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkob2JqKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBrZXk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUb09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIGtleXM7XG5cdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gYXJndW1lbnRzW3NdO1xuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0b1trZXlzW2ldXSA9IGZyb21ba2V5c1tpXV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsInZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XHJcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHtcclxuXHJcblx0YWRkSXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLkFERF9JVEVNLFxyXG5cdFx0XHRpdGVtOml0ZW1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHByZXZpb3VzSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5QUkVWX0lOVlxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0bmV4dEludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuTkVYVF9JTlZcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHByZXZpb3VzSXRlbTpmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5QUkVWX0lURU1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG5leHRJdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLk5FWFRfSVRFTVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0Y2hhbmdlU2V0dGluZzpmdW5jdGlvbihrZXksdmFsKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuQ0hBTkdFX1NFVFRJTkcsXHJcblx0XHRcdGtleTprZXksXHJcblx0XHRcdHZhbDp2YWxcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRvZ2dsZVN0b3JlOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLlRPR0dMRV9TVE9SRVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0dG9nZ2xlT3B0aW9uczpmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5UT0dHTEVfT1BUSU9OU1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0aW5jcmVtZW50U2hhcmRzOmZ1bmN0aW9uKGtleSx2YWwpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5JTkNSRU1FTlRfU0hBUkRTLFxyXG5cdFx0XHRrZXk6a2V5LFxyXG5cdFx0XHR2YWw6dmFsXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBBY3Rpb25zOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0RDNJdGVtVG9vbHRpcEFybW9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS1hcm1vci1hcm1vclwiPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJiaWdcIj48cD48c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLmFybW9yfTwvc3Bhbj48L3A+PC9saT5cclxuXHRcdFx0XHQ8bGk+QXJtb3I8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwQXJtb3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcclxuXHREM0l0ZW1Ub29sdGlwQXJtb3IgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtYXJtb3IuanN4JyksXHJcblx0RDNJdGVtVG9vbHRpcFdlYXBvbiA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC13ZWFwb24uanN4JyksXHJcblx0RDNJdGVtVG9vbHRpcFN0YXQgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtc3RhdC5qc3gnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwQm9keSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgaWNvbkNsYXNzZXMgPSAnZDMtaWNvbiBkMy1pY29uLWl0ZW0gZDMtaWNvbi1pdGVtLWxhcmdlJztcclxuXHRcdHZhciBpdGVtVHlwZUNsYXNzID0nZDMtY29sb3ItJzsgXHJcblxyXG5cdFx0Ly9kZWNsYXJlIGFycmF5cyBmb3IgcHJpbWFyeSBhbmQgc2Vjb25kYXJ5IGl0ZW0gZWZmZWN0cy4gXHJcblx0XHQvL0FuIGl0ZW0gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBvZiBlYWNoLlxyXG5cdFx0Ly9DcmVhdGUgdGhlIGxpc3QgaXRlbSBmb3IgZWFjaCBzdGF0IGFuZCBwdXNoIGluIHRoZSBhcnJheXNcclxuXHRcdHZhciBwcmltYXJpZXMgPSBmb3JFYWNoKHRoaXMucHJvcHMuaXRlbS5wcmltYXJpZXMpO1xyXG5cdFx0dmFyIHNlY29uZGFyaWVzID0gZm9yRWFjaCh0aGlzLnByb3BzLml0ZW0uc2Vjb25kYXJpZXMpO1xyXG5cclxuXHRcdC8vaW1hZ2UgdXNlZCBhcyBpbmxpbmUtc3R5bGUgZm9yIGl0ZW0gdG9vbHRpcHNcclxuXHRcdHZhciBpbWFnZSA9IHtiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK3RoaXMucHJvcHMuaXRlbS5pbWFnZSsnKSd9O1xyXG5cclxuXHRcdC8vaWYgc3BlY2lmaWVkLCBzZXQgY29sb3IgZm9yIHRvb2x0aXAgY29tcG9uZW50c1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5jb2xvcikge1xyXG5cdFx0XHRpY29uQ2xhc3NlcyArPSAnIGQzLWljb24taXRlbS0nK3RoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdFx0aXRlbVR5cGVDbGFzcyArPXRoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdH1cclxuXHJcblx0XHQvL2lmIGl0IGlzIGFuIGFybW9yIG9yIHdlYXBvbiBhZGQgYWRkaXRpb25hbCBpbmZvIHRvIGljb24gc2VjdGlvblxyXG5cdFx0dmFyIHN1YkhlYWQ7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdhcm1vcicpKSB7XHJcblx0XHRcdHN1YkhlYWQgPSA8RDNJdGVtVG9vbHRpcEFybW9yIGFybW9yPXt0aGlzLnByb3BzLml0ZW0uYXJtb3J9Lz47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCd3ZWFwb24nKSkge1xyXG5cdFx0XHRzdWJIZWFkID0gPEQzSXRlbVRvb2x0aXBXZWFwb24gd2VhcG9uPXt0aGlzLnByb3BzLml0ZW0ud2VhcG9ufS8+O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vaWYgc29ja2V0cyBhcmUgbmVlZGVkXHJcblx0XHR2YXIgc29ja2V0cyA9IFtdO1xyXG5cdFx0dmFyIHNvY2tldEtleSA9IDA7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLnByaW1hcmllcy5oYXNPd25Qcm9wZXJ0eSgnU29ja2V0JykpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9MDsgaSA8IHRoaXMucHJvcHMuaXRlbS5wcmltYXJpZXMuU29ja2V0LnZhbHVlOyBpKyspIHtcclxuXHRcdFx0XHRzb2NrZXRzLnB1c2goPGxpIGNsYXNzTmFtZT0nZW1wdHktc29ja2V0IGQzLWNvbG9yLWJsdWUnIGtleT17c29ja2V0S2V5fSA+RW1wdHkgU29ja2V0PC9saT4pO1xyXG5cdFx0XHRcdHNvY2tldEtleSsrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9kZXRlcm1pbmUgdGhlIHdvcmQgdG8gcHV0IG5leHQgdG8gaXRlbSB0eXBlXHJcblx0XHR2YXIgaXRlbVR5cGVQcmVmaXg7XHJcblx0XHQvL2NoZWNrIGlmIGFuY2llbnQgc2V0IGl0ZW0gYW5kIG1hbnVhbGx5IHB1dFxyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5yYXJpdHkgPT09ICdhbmNpZW50JyAmJiB0aGlzLnByb3BzLml0ZW0uaGFzT3duUHJvcGVydHkoJ3NldCcpKSB7XHJcblx0XHRcdGl0ZW1UeXBlUHJlZml4ID0gJ0FuY2llbnQgU2V0JztcclxuXHRcdH1cclxuXHRcdC8vb3RoZXJ3aXNlIGl0IGlzIHNldC9hIHJhcml0eSBvbmx5XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aXRlbVR5cGVQcmVmaXggPSAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdzZXQnKSkgPyAnc2V0JyA6IHRoaXMucHJvcHMuaXRlbS5yYXJpdHk7XHJcblx0XHRcdC8vY2FwaXRhbGl6ZSBmaXJzdCBsZXR0ZXJcclxuXHRcdFx0aXRlbVR5cGVQcmVmaXggPSBpdGVtVHlwZVByZWZpeC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGl0ZW1UeXBlUHJlZml4LnNsaWNlKDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidG9vbHRpcC1ib2R5IGVmZmVjdC1iZyBlZmZlY3QtYmctYXJtb3IgZWZmZWN0LWJnLWFybW9yLWRlZmF1bHRcIj5cclxuXHJcblx0XHRcdFx0ey8qVGhlIGl0ZW0gaWNvbiBhbmQgY29udGFpbmVyLCBjb2xvciBuZWVkZWQgZm9yIGJhY2tncm91bmQqL31cclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9e2ljb25DbGFzc2VzfT5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImljb24taXRlbS1ncmFkaWVudFwiPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJpY29uLWl0ZW0taW5uZXIgaWNvbi1pdGVtLWRlZmF1bHRcIiBzdHlsZT17aW1hZ2V9PlxyXG5cdFx0XHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImQzLWl0ZW0tcHJvcGVydGllc1wiPlxyXG5cclxuXHRcdFx0XHRcdHsvKlNsb3QgYW5kIGlmIGNsYXNzIHNwZWNpZmljKi99XHJcblx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS10eXBlLXJpZ2h0XCI+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cIml0ZW0tc2xvdFwiPnt0aGlzLnByb3BzLml0ZW0uc2xvdC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMucHJvcHMuaXRlbS5zbG90LnNsaWNlKDEpfTwvbGk+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cIml0ZW0tY2xhc3Mtc3BlY2lmaWMgZDMtY29sb3Itd2hpdGVcIj57dGhpcy5wcm9wcy5pdGVtLmNsYXNzU3BlY2lmaWN9PC9saT5cclxuXHRcdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHRcdFx0ey8qUmFyaXR5IG9mIHRoZSBpdGVtIGFuZC9pZiBpdCBpcyBhbmNpZW50Ki99XHJcblx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS10eXBlXCI+XHJcblx0XHRcdFx0XHRcdDxsaT5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9e2l0ZW1UeXBlQ2xhc3N9PntpdGVtVHlwZVByZWZpeH0ge3RoaXMucHJvcHMuaXRlbS50eXBlfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHRcdFx0ey8qSWYgdGhlIGl0ZW0gaXMgYXJtb3Igb3Igd2VhcG9uLCB0aGUga2V5IGlzIGRlZmluZWQgYW5kIHdlIG5lZWQgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgdG9vbHRpcCovfVxyXG5cdFx0XHRcdFx0e3N1YkhlYWR9XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJpdGVtLWJlZm9yZS1lZmZlY3RzXCI+PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0ey8qQWN0dWFsIGl0ZW0gc3RhdHMqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWVmZmVjdHNcIj5cclxuXHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwiaXRlbS1wcm9wZXJ0eS1jYXRlZ29yeVwiPlByaW1hcnk8L3A+XHJcblx0XHRcdFx0XHRcdHtwcmltYXJpZXN9XHJcblx0XHRcdFx0XHRcdDxwIGNsYXNzTmFtZT1cIml0ZW0tcHJvcGVydHktY2F0ZWdvcnlcIj5TZWNvbmRhcnk8L3A+XHJcblx0XHRcdFx0XHRcdHtzZWNvbmRhcmllc31cclxuXHRcdFx0XHRcdFx0e3NvY2tldHN9XHJcblx0XHRcdFx0XHQ8L3VsPlxyXG5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0ZnVuY3Rpb24gZm9yRWFjaChzdGF0T2JqZWN0KSB7XHJcblx0XHR2YXIgcmVzdWx0cyA9IFtdO1xyXG5cclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3RhdE9iamVjdCk7XHJcblx0XHR2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKyspIHtcclxuXHRcdFx0dmFyIHN0YXQgPSBrZXlzW2ldO1xyXG5cdFx0XHR2YXIgdmFsID0gc3RhdE9iamVjdFtzdGF0XTtcclxuXHRcdFx0cmVzdWx0cy5wdXNoKDxEM0l0ZW1Ub29sdGlwU3RhdCBzdGF0PXt2YWx9IGtleT17aX0gLz4pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdHM7XHJcblx0fVxyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwQm9keTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBGbGF2b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J3Rvb2x0aXAtZXh0ZW5zaW9uJz5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmxhdm9yJz57dGhpcy5wcm9wcy5mbGF2b3J9PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwRmxhdm9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEhlYWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvL2luaXRpYWwgY2xhc3Mgc2V0IGZvciB0aGUgdG9vbHRpcCBoZWFkXHJcblx0XHR2YXIgZGl2Q2xhc3M9J3Rvb2x0aXAtaGVhZCc7XHJcblx0XHR2YXIgaDNDbGFzcz0nJztcclxuXHJcblx0XHQvL21vZGlmeSB0aGUgY2xhc3NlcyBpZiBhIGNvbG9yIHdhcyBwYXNzZWRcclxuXHRcdC8vZmFsbGJhY2sgY29sb3IgaXMgaGFuZGxlZCBieSBkMy10b29sdGlwIGNzc1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5jb2xvcikge1xyXG5cdFx0XHRkaXZDbGFzcyArPSAnIHRvb2x0aXAtaGVhZC0nICsgdGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0XHRoM0NsYXNzICs9ICdkMy1jb2xvci0nICsgdGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0fVxyXG5cdFx0Ly9tYWtlIHRoZSBmb250IHNtYWxsZXIgaWYgdGhlIG5hbWUgaXMgbG9uZ1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5uYW1lLmxlbmd0aCA+IDQwKSB7XHJcblx0XHRcdGgzQ2xhc3MrPSAnIHNtYWxsZXN0JztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYodGhpcy5wcm9wcy5pdGVtLm5hbWUubGVuZ3RoID4yMikge1xyXG5cdFx0XHRoM0NsYXNzKz0gJyBzbWFsbGVyJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17ZGl2Q2xhc3N9PlxyXG5cdFx0XHRcdDxoMyBjbGFzc05hbWU9e2gzQ2xhc3N9PlxyXG5cdFx0XHRcdFx0e3RoaXMucHJvcHMuaXRlbS5uYW1lfVxyXG5cdFx0XHRcdDwvaDM+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEhlYWQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwU3RhdD0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciB0ZXh0ID0gW107XHJcblx0XHR2YXIgdGV4dEtleSA9IDA7XHJcblx0XHQvL2NoZWNrIHRvIG1ha2Ugc3VyZSB0ZW1wbGF0ZSBuZWVkcyB0byBiZSB3b3JrZWQgd2l0aCBcclxuXHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5zdGF0LnRleHQgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHZhciB0ZW1wbGF0ZSA9IHRoaXMucHJvcHMuc3RhdC50ZXh0O1xyXG5cdFx0XHRpZiAodGVtcGxhdGUuaW5kZXhPZigneycpICE9PSAtMSkge1xyXG5cclxuXHRcdFx0XHQvL2RldGVybWluZSB0aGUgbnVtYmVyIG9mIGhpZ2hsaWdodGVkIGl0ZW1zIHRoZSB0b29sdGlwIHdpbGwgaGF2ZVxyXG5cdFx0XHRcdHZhciBwb3NpdGlvbiA9IHRlbXBsYXRlLmluZGV4T2YoJ3snKTtcclxuXHRcdFx0XHR2YXIgY291bnQgPSAwO1xyXG5cdFx0XHRcdHdoaWxlIChwb3NpdGlvbiAhPT0gLTEpIHtcclxuXHRcdFx0XHRcdGNvdW50KytcclxuXHRcdFx0XHRcdHBvc2l0aW9uID0gdGVtcGxhdGUuaW5kZXhPZigneycsIHBvc2l0aW9uKzEpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHN0YXJ0UG9zID0gMDtcclxuXHRcdFx0XHR2YXIgZW5kUG9zID0gMDtcclxuXHRcdFx0XHQvL2xvb3AgdGhyb3VnaCB0aGlzIGNvdW50IG9mIHRlbXBsYXRpbmdcclxuXHRcdFx0XHRmb3IgKHZhciBpID0wOyBpIDwgY291bnQ7IGkrKykge1xyXG5cdFx0XHRcdFx0dmFyIHN0YXJ0SW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKCd7JyxzdGFydFBvcykrMTtcclxuXHRcdFx0XHRcdHN0YXJ0UG9zID0gc3RhcnRJbmRleDtcclxuXHRcdFx0XHRcdHZhciBlbmRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ30nLGVuZFBvcyk7XHJcblx0XHRcdFx0XHRlbmRQb3MgPSBlbmRJbmRleCsxO1xyXG5cdFx0XHRcdFx0dmFyIHNsaWNlZCA9IHRlbXBsYXRlLnNsaWNlKHN0YXJ0SW5kZXgsZW5kSW5kZXgpO1xyXG5cclxuXHRcdFx0XHRcdC8vY2hlY2sgZm9yIGFueSByZXBsYWNlbWVudCBuZWVkZWRcclxuXHRcdFx0XHRcdGlmIChzbGljZWQuaW5kZXhPZignJCcpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnByb3BzLnN0YXQudmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0c2xpY2VkID0gc2xpY2VkLnJlcGxhY2UoJyQnLCB0aGlzLnByb3BzLnN0YXQudmFsdWVbaV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHNsaWNlZCA9IHNsaWNlZC5yZXBsYWNlKCckJyx0aGlzLnByb3BzLnN0YXQudmFsdWUpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly9pZiB3ZSBhcmUgYXQgdGhlIGZpcnN0IGxvb3AsIGFkZCBhbnl0aGluZyBmaXJzdCBhcyB0ZXh0XHJcblx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2godGVtcGxhdGUuc3BsaXQoJ3snKVswXSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly9jcmVhdGUgYW5kIHB1c2ggdGhlIHZhbHVlIGhpZ2hsaWdodGVkIGVsZW1lbnRcclxuXHRcdFx0XHRcdHZhciBlbGVtZW50ID0gPHNwYW4gY2xhc3NOYW1lPSd2YWx1ZScga2V5PXt0ZXh0S2V5fT57c2xpY2VkfTwvc3Bhbj47XHJcblx0XHRcdFx0XHR0ZXh0S2V5Kys7XHJcblx0XHRcdFx0XHR0ZXh0LnB1c2goZWxlbWVudCk7XHJcblxyXG5cdFx0XHRcdFx0Ly9pZiBub3QgdGhlIGxhc3QgbG9vcCwgcHVzaCBhbnl0aGluZyB1bnRpbCBuZXh0IGJyYWNrZXRcclxuXHRcdFx0XHRcdGlmIChjb3VudCAhPT0gMSAmJiBpIDwgY291bnQgLSAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0SW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKCd7Jywgc3RhcnRQb3MpO1xyXG5cdFx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2UoZW5kSW5kZXgrMSwgbmV4dEluZGV4KTtcclxuXHRcdFx0XHRcdFx0dGV4dC5wdXNoKHNsaWNlZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmKGNvdW50ID09PSAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCB0ZW1wbGF0ZS5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vbGFzdCBsb29wIHB1c2ggdG8gdGhlIGVuZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZihpID09PSBjb3VudC0xICYmIGNvdW50ID4gMSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2UoZW5kSW5kZXgrMSwgdGVtcGxhdGUubGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0dGV4dC5wdXNoKHNsaWNlZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vbm8gdGVtcGxhdGUgYW5kIHdlIGp1c3QgdGhyb3cgYWZmaXggdXBcclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGV4dC5wdXNoKHRoaXMucHJvcHMuc3RhdC50ZXh0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vZGV0ZXJtaW5lIGNvbG9yIG9mIGFmZml4IHRleHRcclxuXHRcdHZhciB0ZXh0Q29sb3IgPSAnZDMtaXRlbS1wcm9wZXJ0eS1kZWZhdWx0JztcclxuXHRcdGlmICh0aGlzLnByb3BzLnN0YXQuaGFzT3duUHJvcGVydHkoJ3R5cGUnKSAmJiB0aGlzLnByb3BzLnN0YXQudHlwZSA9PT0gJ2xlZ2VuZGFyeScpIHtcclxuXHRcdFx0dGV4dENvbG9yICs9ICcgZDMtY29sb3Itb3JhbmdlJztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0ZXh0Q29sb3IgKz0gJyBkMy1jb2xvci1ibHVlJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cclxuXHRcdFx0PGxpIGNsYXNzTmFtZT17dGV4dENvbG9yfT5cclxuXHRcdFx0XHQ8cD57dGV4dH08L3A+XHJcblx0XHRcdDwvbGk+XHJcblxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBTdGF0OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcFdlYXBvbj0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWFybW9yLXdlYXBvbiBpdGVtLXdlYXBvbi1kcHNcIj5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiYmlnXCI+PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy53ZWFwb24uZHBzfTwvc3Bhbj48L2xpPlxyXG5cdFx0XHRcdDxsaT5EYW1hZ2UgUGVyIFNlY29uZDwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWFybW9yLXdlYXBvbiBpdGVtLXdlYXBvbiBkYW1hZ2VcIj5cclxuXHRcdFx0XHQ8bGk+XHJcblx0XHRcdFx0XHQ8cD5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy53ZWFwb24ubWlufTwvc3Bhbj4gLVxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPiB7dGhpcy5wcm9wcy53ZWFwb24ubWF4fTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZDMtY29sb3ItRkY4ODg4ODhcIj4gRGFtYWdlPC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9wPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0PHA+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLnNwZWVkfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZDMtY29sb3ItRkY4ODg4ODhcIj4gQXR0YWNrcyBwZXIgU2Vjb25kPC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9wPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBXZWFwb247IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwSGVhZCA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC1oZWFkLmpzeCcpO1xyXG52YXIgRDNJdGVtVG9vbHRpcEJvZHkgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtYm9keS5qc3gnKTtcclxudmFyIEQzSXRlbVRvb2x0aXBGbGF2b3IgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtZmxhdm9yLmpzeCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b29sdGlwQ2xhc3MgPSdkMy10b29sdGlwIGQzLXRvb2x0aXAtaXRlbSc7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLnJhcml0eSA9PT0gJ2FuY2llbnQnKSB7XHJcblx0XHRcdHRvb2x0aXBDbGFzcys9JyBhbmNpZW50J1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGFkZCBmbGF2b3JcclxuXHRcdHZhciBmbGF2b3I7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdmbGF2b3InKSkge1xyXG5cdFx0XHRmbGF2b3IgPSA8RDNJdGVtVG9vbHRpcEZsYXZvciBmbGF2b3I9e3RoaXMucHJvcHMuaXRlbS5mbGF2b3J9IC8+XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1jb250ZW50Jz5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dG9vbHRpcENsYXNzfT5cclxuXHRcdFx0XHRcdDxEM0l0ZW1Ub29sdGlwSGVhZCBpdGVtPXt0aGlzLnByb3BzLml0ZW19IC8+XHJcblx0XHRcdFx0XHQ8RDNJdGVtVG9vbHRpcEJvZHkgaXRlbT17dGhpcy5wcm9wcy5pdGVtfSAvPlxyXG5cdFx0XHRcdFx0e2ZsYXZvcn1cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5U3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvSW52ZW50b3J5U3RvcmUnKTtcclxuXHJcbnZhciBJdGVtTGVmdCA9IHJlcXVpcmUoJy4vaXRlbS1sZWZ0LmpzeCcpO1xyXG52YXIgSXRlbVJpZ2h0ID0gcmVxdWlyZSgnLi9pdGVtLXJpZ2h0LmpzeCcpO1xyXG52YXIgRDNJdGVtVG9vbHRpcCA9IHJlcXVpcmUoJy4uL2QzLXRvb2x0aXAvZDMtdG9vbHRpcC5qc3gnKTtcclxuXHJcbnZhciBJbmRpdmlkdWFsSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIEludmVudG9yeVN0b3JlLmdldEl0ZW0oKTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEludmVudG9yeVN0b3JlLmdldEl0ZW0oKSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vb25seSBzaG93IHRvb2x0aXBzL2J1dHRvbnMgaWYgdGhleSBhcmUgbmVlZGVkXHJcblx0XHR2YXIgdG9vbHRpcDtcclxuXHRcdHZhciBoaWRkZW5CdXR0b25zID0gJ2hpZGRlbic7XHJcblx0XHRpZiAodHlwZW9mIHRoaXMuc3RhdGUuaXRlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dG9vbHRpcCA9IDxkaXYgY2xhc3NOYW1lPSd0b29sdGlwLWNvbnRhaW5lcic+PEQzSXRlbVRvb2x0aXAgaXRlbT17dGhpcy5zdGF0ZS5pdGVtfS8+PC9kaXY+O1xyXG5cdFx0XHRoaWRkZW5CdXR0b25zID0gJyc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjb2wteHMtMTIgdG9vbHRpcC1vdmVyZmxvdyc+XHJcblx0XHRcdFx0XHRcdDxJdGVtTGVmdCBoaWRlQ2xhc3M9e2hpZGRlbkJ1dHRvbnN9IGhhc1ByZXZpb3VzPXt0aGlzLnN0YXRlLmhhc1ByZXZpb3VzfSAvPlxyXG5cdFx0XHRcdFx0XHR7dG9vbHRpcH1cclxuXHRcdFx0XHRcdFx0PEl0ZW1SaWdodCBoaWRlQ2xhc3M9e2hpZGRlbkJ1dHRvbnN9IGhhc05leHQ9e3RoaXMuc3RhdGUuaGFzTmV4dH0gLz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5kaXZpZHVhbEl0ZW07IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBJdGVtTGVmdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5wcmV2aW91c0l0ZW0oKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24gc2hpZnQgbGVmdCc7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzUHJldmlvdXMpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5oaWRlQ2xhc3N9PlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMjMuMTIgMTEuMTJMMjEgOWwtOSA5IDkgOSAyLjEyLTIuMTJMMTYuMjQgMTh6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJdGVtTGVmdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG5cclxudmFyIEl0ZW1SaWdodCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5uZXh0SXRlbSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbiBzaGlmdCByaWdodCc7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzTmV4dCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgZGlzYWJsZWQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmhpZGVDbGFzc30+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLl9oYW5kbGVDbGlja30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMzZcIiBoZWlnaHQ9XCIzNlwiIHZpZXdCb3g9XCIwIDAgMzYgMzZcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0xNSA5bC0yLjEyIDIuMTJMMTkuNzYgMThsLTYuODggNi44OEwxNSAyN2w5LTl6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJdGVtUmlnaHQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTbG90ID0gcmVxdWlyZSgnLi9pbnZlbnRvcnktc2xvdC5qc3gnKTtcclxudmFyIFByZXZpb3VzSW52ZW50b3J5ID0gcmVxdWlyZSgnLi9wcmV2aW91cy1pbnZlbnRvcnkuanN4Jyk7XHJcbnZhciBOZXh0SW52ZW50b3J5ID0gcmVxdWlyZSgnLi9uZXh0LWludmVudG9yeS5qc3gnKTtcclxuXHJcblxyXG52YXIgSW52ZW50b3J5Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgaW52ZW50b3J5U2xvdHMgPSBbXTtcclxuXHRcdHZhciBrZXk9MDtcclxuXHJcblx0XHQvL2xvb3AgdGhyb3VnaCB0aGUgMTAgY29sdW1ucyBvZiBpbnZlbnRvcnlcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG5cdFx0XHR2YXIgY29sdW1uTGVuZ3RoID0gdGhpcy5wcm9wcy5pbnZlbnRvcnlbaV0ubGVuZ3RoO1xyXG5cclxuXHRcdFx0Ly9hIGNoZWNrIGZvciB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoaXMgY29sdW1uXHJcblx0XHRcdHZhciBoZWlnaHRDb3VudCA9IDA7XHJcblxyXG5cdFx0XHQvL2FkZCBhbGwgZXhpc3RpbmcgaXRlbXMgdG8gdGhlIGNvbHVtbnNcclxuXHRcdFx0Zm9yICh2YXIgaj0wOyBqIDwgY29sdW1uTGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5pbnZlbnRvcnlbaV1bal0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHRoZWlnaHRDb3VudCArPSB0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXS5zaXplO1xyXG5cdFx0XHRcdFx0aW52ZW50b3J5U2xvdHMucHVzaCg8SW52ZW50b3J5U2xvdCBkYXRhPXt0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXX0ga2V5PXtrZXl9IGNvbHVtbj17aX0vPilcclxuXHRcdFx0XHRcdGtleSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9ub3cgZmlsbCBpbiB0aGUgcmVzdCBvZiB0aGUgY29sdW1uIHdpdGggYmxhbmsgc3BhY2VzXHJcblx0XHRcdHdoaWxlKGhlaWdodENvdW50IDwgNikge1xyXG5cdFx0XHRcdGhlaWdodENvdW50Kys7XHJcblx0XHRcdFx0aW52ZW50b3J5U2xvdHMucHVzaCg8SW52ZW50b3J5U2xvdCBkYXRhPXt1bmRlZmluZWR9IGtleT17a2V5fSBjb2x1bW49e2l9Lz4pO1xyXG5cdFx0XHRcdGtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktY29udGFpbmVyJz5cclxuXHRcdFx0XHQ8UHJldmlvdXNJbnZlbnRvcnkgaGFzUHJldmlvdXM9e3RoaXMucHJvcHMuaGFzUHJldmlvdXN9Lz5cclxuXHRcdFx0XHR7aW52ZW50b3J5U2xvdHN9XHJcblx0XHRcdFx0PE5leHRJbnZlbnRvcnkgaGFzTmV4dD17dGhpcy5wcm9wcy5oYXNOZXh0fS8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnlDb250YWluZXIiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXAgPSByZXF1aXJlKCcuLi9kMy10b29sdGlwL2QzLXRvb2x0aXAuanN4Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5U2xvdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0VG9vbHRpcE9mZnNldCgpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRUb29sdGlwT2Zmc2V0KCk7XHJcblx0fSxcclxuXHJcblx0c2V0VG9vbHRpcE9mZnNldDpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBlbGVtID0gUmVhY3QuZmluZERPTU5vZGUodGhpcyk7XHJcblxyXG5cdFx0Ly9pZiB0aGUgaW52ZW50b3J5IHNsb3QgaGFzIGNoaWxkcmVuIChjb250ZW50KVxyXG5cdFx0aWYgKGVsZW0uY2hpbGRyZW4gJiYgZWxlbS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHZhciBlbGVtTG9jYXRpb24gPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuXHRcdFx0dmFyIHRvb2x0aXBIZWlnaHQgPSBlbGVtLmNoaWxkcmVuWzRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuXHRcdFx0dmFyIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0XHRcdC8vY2hlY2sgaWYgdGhlIHRvb2x0aXAgZml0cyB3aGVyZSBpdCBjdXJyZW50bHkgaXNcclxuXHRcdFx0aWYgKCEodG9vbHRpcEhlaWdodCArIGVsZW1Mb2NhdGlvbiA8IHdpbmRvd0hlaWdodCkpIHtcclxuXHRcdFx0XHR2YXIgb2Zmc2V0ID0gKHRvb2x0aXBIZWlnaHQgKyBlbGVtTG9jYXRpb24gLSB3aW5kb3dIZWlnaHQpO1xyXG5cclxuXHRcdFx0XHQvL2lmIHRoZSB0b29sdGlwIGlzIGJpZ2dlciB0aGFuIHdpbmRvdywganVzdCBzaG93IGF0IHRvcCBvZiB3aW5kb3dcclxuXHRcdFx0XHRpZiAob2Zmc2V0ID4gd2luZG93SGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRlbGVtLmNoaWxkcmVuWzRdLnN0eWxlLnRvcCA9ICctJysoZWxlbUxvY2F0aW9uLTIwKSsncHgnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vanVzdCBtb3ZlIGl0IHVwIGEgbGl0dGxlIHdpdGggYSBiaXQgYXQgYm90dG9tXHJcblx0XHRcdFx0XHRlbGVtLmNoaWxkcmVuWzRdLnN0eWxlLnRvcCA9ICctJysob2Zmc2V0KzEwKSsncHgnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNsb3RDb250ZW50PSBbXTtcclxuXHRcdHZhciBzbG90Q29udGVudEtleSA9IDA7XHJcblxyXG5cdFx0dmFyIHNsb3RDbGFzcz0naW52ZW50b3J5LXNsb3QnO1xyXG5cdFx0Ly9jaGVjayB0byBtYWtlIHN1cmUgYW4gYWN0dWFsIGl0ZW0gaXMgaW4gdGhlIGludmVudG9yeSBzbG90XHJcblx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMuZGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly9jaGFuZ2UgdGhlIHNpemUgdG8gbGFyZ2UgaWYgaXQgaXMgYSBsYXJnZSBpdGVtXHJcblx0XHRcdGlmKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnc2l6ZScpICYmIHRoaXMucHJvcHMuZGF0YS5zaXplID09PSAyKSB7XHJcblx0XHRcdFx0c2xvdENsYXNzICs9ICcgbGFyZ2UnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZih0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3Jhcml0eScpKSB7XHJcblx0XHRcdFx0dmFyIGJndXJsO1xyXG5cdFx0XHRcdHZhciBib3JkZXJDb2xvcj0nIzMwMmEyMSc7XHJcblxyXG5cdFx0XHRcdHN3aXRjaCh0aGlzLnByb3BzLmRhdGEucmFyaXR5KSB7XHJcblx0XHRcdFx0XHRjYXNlICdtYWdpYyc6XHJcblx0XHRcdFx0XHRcdGJndXJsPScvL3VzLmJhdHRsZS5uZXQvZDMvc3RhdGljL2ltYWdlcy9pdGVtL2ljb24tYmdzL2JsdWUucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyM3OTc5ZDQnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3JhcmUnOlxyXG5cdFx0XHRcdFx0XHRiZ3VybD0nLy91cy5iYXR0bGUubmV0L2QzL3N0YXRpYy9pbWFnZXMvaXRlbS9pY29uLWJncy95ZWxsb3cucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyNmOGNjMzUnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZ2VuZGFyeSc6XHJcblx0XHRcdFx0XHRcdGJndXJsPScvL3VzLmJhdHRsZS5uZXQvZDMvc3RhdGljL2ltYWdlcy9pdGVtL2ljb24tYmdzL29yYW5nZS5wbmcnO1xyXG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcj0nI2JmNjQyZic7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnYW5jaWVudCc6XHJcblx0XHRcdFx0XHRcdGJndXJsPScvL3VzLmJhdHRsZS5uZXQvZDMvc3RhdGljL2ltYWdlcy9pdGVtL2ljb24tYmdzL2dyZWVuLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjYmY2NDJmJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHQvL25vb3BcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vc3dpdGNoIGJnIHRvIGdyZWVuIGlmIGl0ZW0gaXMgcGFydCBvZiBhIHNldFxyXG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3NldCcpKSB7XHJcblx0XHRcdFx0XHRiZ3VybD0naW1nL2dyZWVuLnBuZyc7XHJcblx0XHRcdFx0XHRib3JkZXJDb2xvcj0nIzhiZDQ0Mic7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIGJndXJsICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0dmFyIGlubGluZSA9IHtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOid1cmwoJytiZ3VybCsnKSdcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRzbG90Q29udGVudC5wdXNoKDxkaXYgc3R5bGU9e2lubGluZX0gY2xhc3NOYW1lPSdpbnZlbnRvcnktYmcnIGtleT17c2xvdENvbnRlbnRLZXl9PjwvZGl2PilcclxuXHRcdFx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3NldCB0aGUgaXRlbSBpbWFnZVxyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdpbWFnZScpKSB7XHJcblx0XHRcdFx0dmFyIGlubGluZSA9IHtiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK3RoaXMucHJvcHMuZGF0YS5pbWFnZSsnKSd9O1xyXG5cdFx0XHRcdHNsb3RDb250ZW50LnB1c2goPGRpdiBzdHlsZT17aW5saW5lfSBjbGFzc05hbWU9J2ludmVudG9yeS1pbWFnZScga2V5PXtzbG90Q29udGVudEtleX0+PC9kaXY+KTtcclxuXHRcdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL2FkZCBhIGxpbmsgdG8gYWN0aXZhdGUgdG9vbHRpcFxyXG5cdFx0XHRzbG90Q29udGVudC5wdXNoKDxhIGNsYXNzTmFtZT0ndG9vbHRpcC1saW5rJyBrZXk9e3Nsb3RDb250ZW50S2V5fT48L2E+KTtcclxuXHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHJcblx0XHRcdC8vYWRkIGEgZ3JhZGllbnQgbWFza1xyXG5cdFx0XHRzbG90Q29udGVudC5wdXNoKDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktaXRlbS1ncmFkaWVudCcga2V5PXtzbG90Q29udGVudEtleX0+PC9kaXY+KTtcclxuXHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHJcblx0XHRcdC8vYWRkIGEgaGlkZGVuIHRvb2x0aXBcclxuXHRcdFx0dmFyIGlubGluZTtcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuY29sdW1uIDwgNSkge1xyXG5cdFx0XHRcdGlubGluZSA9IHtsZWZ0Oic1MHB4J307XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aW5saW5lID0ge3JpZ2h0Oic1MHB4J307XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNsb3RDb250ZW50LnB1c2goXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3Rvb2x0aXAtY29udGFpbmVyJyBzdHlsZT17aW5saW5lfSBrZXk9e3Nsb3RDb250ZW50S2V5fT5cclxuXHRcdFx0XHRcdDxEM0l0ZW1Ub29sdGlwIGl0ZW09e3RoaXMucHJvcHMuZGF0YX0vPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQpO1xyXG5cdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cclxuXHRcdFx0Ly9hZGQgc29ja2V0cyBvbiBob3ZlclxyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdwcmltYXJpZXMnKSAmJiB0aGlzLnByb3BzLmRhdGEucHJpbWFyaWVzLmhhc093blByb3BlcnR5KCdTb2NrZXQnKSkge1xyXG5cdFx0XHRcdHZhciBzb2NrZXRzO1xyXG5cdFx0XHRcdHZhciBzb2NrZXRDb3VudCA9IHRoaXMucHJvcHMuZGF0YS5wcmltYXJpZXMuU29ja2V0LnZhbHVlO1xyXG5cdFx0XHRcdHZhciBzb2NrZXRDb250ZW50cyA9IFtdO1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPTA7IGkgPCBzb2NrZXRDb3VudDsgaSsrKSB7XHJcblx0XHRcdFx0XHRzb2NrZXRDb250ZW50cy5wdXNoKDxkaXYgY2xhc3NOYW1lPSdzb2NrZXQnIGtleT17aX0+PC9kaXY+KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c29ja2V0cyA9IDxkaXYgY2xhc3NOYW1lPSdzb2NrZXRzLXdyYXBwZXInIGtleT17c2xvdENvbnRlbnRLZXl9PjxkaXYgY2xhc3NOYW1lPSdzb2NrZXRzLWFsaWduJz57c29ja2V0Q29udGVudHN9PC9kaXY+PC9kaXY+O1xyXG5cdFx0XHRcdHNsb3RDb250ZW50LnB1c2goc29ja2V0cyk7XHJcblx0XHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17c2xvdENsYXNzfSBzdHlsZT17e2JvcmRlckNvbG9yOmJvcmRlckNvbG9yfX0+XHJcblx0XHRcdFx0e3Nsb3RDb250ZW50fVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5U2xvdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEludmVudG9yeUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vaW52ZW50b3J5LWNvbnRhaW5lci5qc3gnKTtcclxudmFyIEludmVudG9yeVN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0ludmVudG9yeVN0b3JlJyk7XHJcblxyXG52YXIgSW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gSW52ZW50b3J5U3RvcmUuZ2V0SW52ZW50b3J5KCk7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShJbnZlbnRvcnlTdG9yZS5nZXRJbnZlbnRvcnkoKSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1zZWN0aW9uJz5cclxuXHRcdFx0XHQ8SW52ZW50b3J5Q29udGFpbmVyIFxyXG5cdFx0XHRcdFx0aW52ZW50b3J5PXt0aGlzLnN0YXRlLmN1cnJlbnRJbnZlbnRvcnl9IFxyXG5cdFx0XHRcdFx0aGFzUHJldmlvdXM9e3R5cGVvZiB0aGlzLnN0YXRlLnByZXZpb3VzSW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJ30gXHJcblx0XHRcdFx0XHRoYXNOZXh0PXt0eXBlb2YgdGhpcy5zdGF0ZS5uZXh0SW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJ31cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgTmV4dEludmVudG9yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRfaGFuZGxlQ2xpY2s6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBBY3Rpb25zLm5leHRJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24nO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc05leHQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWJ1dHRvbi1jb250YWluZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMTUgOWwtMi4xMiAyLjEyTDE5Ljc2IDE4bC02Ljg4IDYuODhMMTUgMjdsOS05elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV4dEludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG5cclxudmFyIFByZXZpb3VzSW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMucHJldmlvdXNJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24nO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc1ByZXZpb3VzKSB7XHJcblx0XHRcdGJ1dHRvbkNsYXNzKz0gJyBkaXNhYmxlZCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1idXR0b24tY29udGFpbmVyJz5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuX2hhbmRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIzNlwiIGhlaWdodD1cIjM2XCIgdmlld0JveD1cIjAgMCAzNiAzNlwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTIzLjEyIDExLjEyTDIxIDlsLTkgOSA5IDkgMi4xMi0yLjEyTDE2LjI0IDE4elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJldmlvdXNJbnZlbnRvcnk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHQvL3N0YXRlIGlzIGhhbmRsZWQgaW4gdGhlIHBhcmVudCBjb21wb25lbnRcclxuXHQvL3RoaXMgZnVuY3Rpb24gaXMgdXAgdGhlcmVcclxuXHRoYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlQ2xhc3ModGhpcy5wcm9wcy5uYW1lKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNob3J0ZW5lZE5hbWVzID0ge1xyXG5cdFx0XHRCYXJiYXJpYW46J2JhcmInLFxyXG5cdFx0XHRDcnVzYWRlcjonY3J1cycsXHJcblx0XHRcdCdEZW1vbiBIdW50ZXInOidkaCcsXHJcblx0XHRcdE1vbms6J21vbmsnLFxyXG5cdFx0XHQnV2l0Y2ggRG9jdG9yJzond2QnLFxyXG5cdFx0XHRXaXphcmQ6J3dpeidcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnY2xhc3Mtc2VsZWN0b3InO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJ1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbWFnZUNsYXNzPSB0aGlzLnByb3BzLm5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcgJywnJyk7XHJcblx0XHRpbWFnZUNsYXNzKz0gdGhpcy5wcm9wcy5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8bGk+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtpbWFnZUNsYXNzfT48L2Rpdj5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLm5hbWUudG9Mb3dlckNhc2UoKX08L3NwYW4+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJzaG9ydGVuZWRcIj57c2hvcnRlbmVkTmFtZXNbdGhpcy5wcm9wcy5uYW1lXX08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvbGk+XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yQnV0dG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBDbGFzc1NlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9jbGFzcy1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRDbGFzc2VzID0gWydCYXJiYXJpYW4nLCdDcnVzYWRlcicsJ0RlbW9uIEh1bnRlcicsJ01vbmsnLCdXaXRjaCBEb2N0b3InLCdXaXphcmQnXTtcclxuXHRcdHZhciBkQ2xhc3Nlc0xlbmd0aCA9IGRDbGFzc2VzLmxlbmd0aDtcclxuXHJcblx0XHR2YXIgY2xhc3NTZWxlY3RvcnMgPSBbXTtcclxuXHRcdGZvciAodmFyIGkgPTA7IGkgPCBkQ2xhc3Nlc0xlbmd0aDtpKyspIHtcclxuXHJcblx0XHRcdC8vY2hlY2sgZm9yIHNlbGVjdGVkIGNsYXNzIHN0b3JlZCBpbiBzdGF0ZSBvZiB0aGlzIGNvbXBvbmVudFxyXG5cdFx0XHR2YXIgc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09IGRDbGFzc2VzW2ldKSB7XHJcblx0XHRcdFx0c2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3B1dCBzZWxlY3RvcnMgaW4gYXJyYXkgdG8gYmUgcmVuZGVyZWRcclxuXHRcdFx0Y2xhc3NTZWxlY3RvcnMucHVzaChcclxuXHRcdFx0XHQ8Q2xhc3NTZWxlY3RvckJ1dHRvbiBcclxuXHRcdFx0XHRcdG5hbWU9e2RDbGFzc2VzW2ldfSBcclxuXHRcdFx0XHRcdGNoYW5nZUNsYXNzPXt0aGlzLnByb3BzLmNoYW5nZUNsYXNzfSBcclxuXHRcdFx0XHRcdGtleT17aX0gXHJcblx0XHRcdFx0XHRzZWxlY3RlZD17c2VsZWN0ZWR9XHJcblx0XHRcdFx0XHRnZW5kZXI9e3RoaXMucHJvcHMuZ2VuZGVyfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8dWwgY2xhc3NOYW1lPSdjbGFzcy1zZWxlY3Rvcic+XHJcblx0XHRcdFx0XHR7Y2xhc3NTZWxlY3RvcnN9XHJcblx0XHRcdFx0PC91bD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHVwZGF0ZUdlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlR2VuZGVyKHRoaXMucHJvcHMuZ2VuZGVyKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzPSdnZW5kZXItc2VsZWN0b3IgJyt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYnV0dG9uLXdyYXBwZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy51cGRhdGVHZW5kZXJ9ID5cclxuXHRcdFx0XHRcdDxkaXY+PC9kaXY+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5nZW5kZXIudG9Mb3dlckNhc2UoKX08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5kZXJTZWxlY3RvckJ1dHRvbjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9nZW5kZXItc2VsZWN0b3ItYnV0dG9uLmpzeCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWFsZVNlbGVjdGVkID0gKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09ICdNYWxlJyk7XHJcblx0XHR2YXIgZmVtYWxlU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gJ0ZlbWFsZScpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdnZW5kZXItc2VsZWN0b3InPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvckJ1dHRvbiBnZW5kZXI9J01hbGUnIGNoYW5nZUdlbmRlcj17dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXttYWxlU2VsZWN0ZWR9IC8+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yQnV0dG9uIGdlbmRlcj0nRmVtYWxlJyBjaGFuZ2VHZW5kZXI9e3RoaXMucHJvcHMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17ZmVtYWxlU2VsZWN0ZWR9IC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5kZXJTZWxlY3RvcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEhhcmRjb3JlQ2hlY2tib3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0dXBkYXRlSGFyZGNvcmU6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlSGFyZGNvcmUoIXRoaXMucHJvcHMuaGFyZGNvcmUpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjaGVja2JveC13cmFwcGVyJz5cclxuXHRcdFx0XHQ8bGFiZWw+XHJcblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGNsYXNzTmFtZT0nb3B0aW9ucy1jaGVja2JveCcgY2hlY2tlZD17dGhpcy5wcm9wcy5oYXJkY29yZX0gb25DaGFuZ2U9e3RoaXMudXBkYXRlSGFyZGNvcmV9Lz5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nY2hlY2tib3gtbGFiZWwnPkhhcmRjb3JlIDxzcGFuIGNsYXNzTmFtZT0naGlkZGVuLXNtJz5IZXJvPC9zcGFuPjwvc3Bhbj5cclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFyZGNvcmVDaGVja2JveDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMuanMnKTtcclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0FwcFN0b3JlLmpzJyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IHJlcXVpcmUoJy4vY2xhc3Mtc2VsZWN0b3IuanN4Jyk7XHJcbnZhciBHZW5kZXJTZWxlY3RvciA9IHJlcXVpcmUoJy4vZ2VuZGVyLXNlbGVjdG9yLmpzeCcpO1xyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IHJlcXVpcmUoJy4vc2Vhc29uYWwtY2hlY2tib3guanN4Jyk7XHJcbnZhciBIYXJkY29yZUNoZWNrYm94ID0gcmVxdWlyZSgnLi9oYXJkY29yZS1jaGVja2JveC5qc3gnKTtcclxuXHJcbnZhciBPcHRpb25zUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpbml0aWFsID0gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHRcdGQzc2ltLnNldEthZGFsYShpbml0aWFsLmRDbGFzcyxpbml0aWFsLnNlYXNvbmFsLGluaXRpYWwuaGFyZGNvcmUpO1xyXG5cdFx0cmV0dXJuIGluaXRpYWw7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0b3JlLmdldFNldHRpbmdzKCkpO1xyXG5cdH0sXHJcblxyXG5cdGNoYW5nZUdlbmRlcjpmdW5jdGlvbihnZW5kZXIpIHtcclxuXHRcdEFwcEFjdGlvbnMuY2hhbmdlU2V0dGluZygnZ2VuZGVyJyxnZW5kZXIpO1xyXG5cdH0sXHJcblx0Y2hhbmdlQ2xhc3M6ZnVuY3Rpb24oZENsYXNzKSB7XHJcblx0XHRBcHBBY3Rpb25zLmNoYW5nZVNldHRpbmcoJ2RDbGFzcycsZENsYXNzKTtcclxuXHR9LFxyXG5cdGNoYW5nZUhhcmRjb3JlOmZ1bmN0aW9uKGJvb2wpIHtcclxuXHRcdEFwcEFjdGlvbnMuY2hhbmdlU2V0dGluZygnaGFyZGNvcmUnLGJvb2wpO1xyXG5cdH0sXHJcblx0Y2hhbmdlU2Vhc29uYWw6ZnVuY3Rpb24oYm9vbCkge1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdzZWFzb25hbCcsYm9vbCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBvcHRzQ2xhc3MgPSAnb3B0aW9ucy1wYW5lbCc7XHJcblx0XHRpZiAodGhpcy5zdGF0ZS5vcHRpb25zKSB7XHJcblx0XHRcdG9wdHNDbGFzcyArPSAnIHVuaGlkZSc7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c2VjdGlvbiBjbGFzc05hbWU9e29wdHNDbGFzc30+XHJcblx0XHRcdFx0PENsYXNzU2VsZWN0b3IgY2hhbmdlQ2xhc3M9e3RoaXMuY2hhbmdlQ2xhc3N9IHNlbGVjdGVkPXt0aGlzLnN0YXRlLmRDbGFzc30gZ2VuZGVyPXt0aGlzLnN0YXRlLmdlbmRlcn0vPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvciBjaGFuZ2VHZW5kZXI9e3RoaXMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5nZW5kZXJ9Lz5cclxuXHRcdFx0XHQ8U2Vhc29uYWxDaGVja2JveCBzZWFzb25hbD17dGhpcy5zdGF0ZS5zZWFzb25hbH0gY2hhbmdlU2Vhc29uYWw9e3RoaXMuY2hhbmdlU2Vhc29uYWx9Lz5cclxuXHRcdFx0XHQ8SGFyZGNvcmVDaGVja2JveCBoYXJkY29yZT17dGhpcy5zdGF0ZS5oYXJkY29yZX0gY2hhbmdlSGFyZGNvcmU9e3RoaXMuY2hhbmdlSGFyZGNvcmV9Lz5cclxuXHRcdFx0PC9zZWN0aW9uPlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb25zUGFuZWw7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBTZWFzb25hbENoZWNrYm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHVwZGF0ZVNlYXNvbmFsOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VTZWFzb25hbCghdGhpcy5wcm9wcy5zZWFzb25hbCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2NoZWNrYm94LXdyYXBwZXInPlxyXG5cdFx0XHRcdDxsYWJlbD5cclxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPSdjaGVja2JveCcgY2xhc3NOYW1lPSdvcHRpb25zLWNoZWNrYm94JyBjaGVja2VkPXt0aGlzLnByb3BzLnNlYXNvbmFsfSBvbkNoYW5nZT17dGhpcy51cGRhdGVTZWFzb25hbH0vPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdjaGVja2JveC1sYWJlbCc+U2Vhc29uYWwgPHNwYW4gY2xhc3NOYW1lPSdoaWRkZW4tc20nPkhlcm88L3NwYW4+PC9zcGFuPlxyXG5cdFx0XHRcdDwvbGFiZWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZWFzb25hbENoZWNrYm94OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG52YXIgQXBwU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvQXBwU3RvcmUnKTtcclxuXHJcbnZhciBLYWRhbGFJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtb2JpbGU6QXBwU3RvcmUuZ2V0U2V0dGluZ3MoKS5tb2JpbGUsXHJcblx0XHRcdHNoYXJkQ291bnQ6QXBwU3RvcmUuZ2V0U2hhcmRzKHRoaXMucHJvcHMuaXRlbS50eXBlKVxyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdF9vbkNoYW5nZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRzaGFyZENvdW50OkFwcFN0b3JlLmdldFNoYXJkcyh0aGlzLnByb3BzLml0ZW0udHlwZSlcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0YnV5SXRlbTpmdW5jdGlvbigpIHtcclxuXHRcdC8vaW5jcmVtZW50IHRoZSBibG9vZCBzaGFyZCBjb3VudFxyXG5cdFx0dmFyIGN1cnJlbnRDb3VudCA9IHRoaXMuc3RhdGUuc2hhcmRDb3VudDtcclxuXHRcdGN1cnJlbnRDb3VudCArPSB0aGlzLnByb3BzLml0ZW0uY29zdDtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe3NoYXJkQ291bnQ6Y3VycmVudENvdW50fSk7XHJcblxyXG5cdFx0dmFyIGl0ZW0gPSBkM3NpbS5rYWRhbGFSb2xsKHRoaXMucHJvcHMuaXRlbS50eXBlKTtcclxuXHRcdGl0ZW0uc2l6ZSA9IHRoaXMucHJvcHMuaXRlbS5zaXplO1xyXG5cdFx0QXBwQWN0aW9ucy5hZGRJdGVtKGl0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdpdGVtJyx0aGlzLnByb3BzLml0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5pbmNyZW1lbnRTaGFyZHModGhpcy5wcm9wcy5pdGVtLnR5cGUsdGhpcy5wcm9wcy5pdGVtLmNvc3QpO1xyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLm1vYmlsZSkge1xyXG5cdFx0XHRBcHBBY3Rpb25zLnRvZ2dsZVN0b3JlKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZXNldENvdW50OmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2hhcmRDb3VudDowfSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBpY29uQ2xhc3MgPSAna2FkYWxhLWljb24nO1xyXG5cdFx0aWNvbkNsYXNzKz0nICcrdGhpcy5wcm9wcy5pdGVtLnR5cGU7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2thZGFsYS1pdGVtJz5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT0na2FkYWxhJyBvbkNsaWNrPXt0aGlzLmJ1eUl0ZW19PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2ljb25DbGFzc30+PC9kaXY+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5pdGVtLmNvc3R9PC9zcGFuPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdrYWRhbGEtY29udGVudCc+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2thZGFsYS1pdGVtLXRpdGxlJz57dGhpcy5wcm9wcy5pdGVtLnRleHR9PC9zcGFuPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdzaGFyZC1jb3VudCc+XHJcblx0XHRcdFx0XHRcdHt0aGlzLnN0YXRlLnNoYXJkQ291bnR9XHJcblx0XHRcdFx0XHRcdDxhIGNsYXNzTmFtZT0nc2hhcmQtZGVsZXRlJyBvbkNsaWNrPXt0aGlzLnJlc2V0Q291bnR9PlxyXG5cdFx0XHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0elwiLz5cclxuXHRcdFx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHRcdFx0PC9hPlxyXG5cdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2FkYWxhSXRlbTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEthZGFsYUl0ZW0gPSByZXF1aXJlKCcuL2thZGFsYS1pdGVtLmpzeCcpO1xyXG52YXIgQXBwU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvQXBwU3RvcmUnKTtcclxuXHJcbnZhciBLYWRhbGFTdG9yZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdF9vbkNoYW5nZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBrYWRhbGFDbGFzcyA9ICdrYWRhbGEtc3RvcmUnO1xyXG5cdFx0Ly90aGlzIGlzIGEgY2hlY2sgZm9yIGludGVybmV0IGV4cGxvcmVyXHJcblx0XHQvL2ZsZXgtZGlyZWN0aW9uOmNvbHVtbiBicmVha3MgZXZlcnl0aGluZyBzbyB3ZSBkZXRlY3QgZm9yIGl0IGhlcmVcclxuXHRcdGlmICgod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSAnKSAhPT0gLTEpfHwhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC4qcnZcXDoxMVxcLi8pKSB7XHJcblx0XHRcdGthZGFsYUNsYXNzKz0nIG5vaWUnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLnN0b3JlKSB7XHJcblx0XHRcdGthZGFsYUNsYXNzKz0nIHVuaGlkZSc7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGl0ZW1zID0gW1xyXG5cdFx0XHR7dHlwZTonaGVsbScsdGV4dDonTXlzdGVyeSBIZWxtZXQnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2Jvb3RzJyx0ZXh0OidNeXN0ZXJ5IEJvb3RzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidiZWx0Jyx0ZXh0OidNeXN0ZXJ5IEJlbHQnLGNvc3Q6MjUsc2l6ZToxfSxcclxuXHRcdFx0e3R5cGU6J3BhbnRzJyx0ZXh0OidNeXN0ZXJ5IFBhbnRzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidnbG92ZXMnLHRleHQ6J015c3RlcnkgR2xvdmVzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidjaGVzdCcsdGV4dDonTXlzdGVyeSBDaGVzdCcsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonc2hvdWxkZXJzJyx0ZXh0OidNeXN0ZXJ5IFNob3VsZGVycycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonYnJhY2VycycsdGV4dDonTXlzdGVyeSBCcmFjZXJzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidxdWl2ZXInLHRleHQ6J015c3RlcnkgUXVpdmVyJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidtb2pvJyx0ZXh0OidNeXN0ZXJ5IE1vam8nLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3NvdXJjZScsdGV4dDonTXlzdGVyeSBTb3VyY2UnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3NoaWVsZCcsdGV4dDonTXlzdGVyeSBTaGllbGQnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J29uZWhhbmQnLHRleHQ6JzEtSCBNeXN0ZXJ5IFdlYXBvbicsY29zdDo3NSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTondHdvaGFuZCcsdGV4dDonMi1IIE15c3RlcnkgV2VhcG9uJyxjb3N0Ojc1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidyaW5nJyx0ZXh0OidNeXN0ZXJ5IFJpbmcnLGNvc3Q6NTAsc2l6ZToxfSxcclxuXHRcdFx0e3R5cGU6J2FtdWxldCcsdGV4dDonTXlzdGVyeSBBbXVsZXQnLGNvc3Q6MTAwLHNpemU6MX1cclxuXHRcdF1cclxuXHJcblx0XHR2YXIga2FkYWxhU2xvdHMgPSBbXTtcclxuXHRcdHZhciBpdGVtc0xlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcclxuXHRcdGZvciAodmFyIGkgPTA7IGkgPCBpdGVtc0xlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGthZGFsYVNsb3RzLnB1c2goPEthZGFsYUl0ZW0ga2V5PXtpfSBpdGVtPXtpdGVtc1tpXX0vPik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2thZGFsYUNsYXNzfSBpZD0na2FkYWxhLXN0b3JlJz5cclxuXHRcdFx0XHR7a2FkYWxhU2xvdHN9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLYWRhbGFTdG9yZTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMuanMnKTtcclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0FwcFN0b3JlLmpzJyk7XHJcblxyXG52YXIgTmF2YmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBcHBTdG9yZS5nZXRTZXR0aW5ncygpO1xyXG5cdH0sXHJcblx0YnV5SXRlbTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpdGVtID0gZDNzaW0ua2FkYWxhUm9sbCh0aGlzLnN0YXRlLml0ZW0udHlwZSk7XHJcblx0XHRpdGVtLnNpemUgPSB0aGlzLnN0YXRlLml0ZW0uc2l6ZTtcclxuXHRcdEFwcEFjdGlvbnMuYWRkSXRlbShpdGVtKTtcclxuXHRcdEFwcEFjdGlvbnMuaW5jcmVtZW50U2hhcmRzKHRoaXMuc3RhdGUuaXRlbS50eXBlLHRoaXMuc3RhdGUuaXRlbS5jb3N0KTtcclxuXHR9LFxyXG5cclxuXHR0b2dnbGVPcHRpb25zOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy50b2dnbGVPcHRpb25zKCk7XHJcblx0fSxcclxuXHR0b2dnbGVTdG9yZTpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMudG9nZ2xlU3RvcmUoKTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0b3JlLmdldFNldHRpbmdzKCkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybihcclxuXHRcdFx0PG5hdj5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT0naGFtJyBvbkNsaWNrPXt0aGlzLnRvZ2dsZU9wdGlvbnN9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMyAxOGgxOHYtMkgzdjJ6bTAtNWgxOHYtMkgzdjJ6bTAtN3YyaDE4VjZIM3pcIi8+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0XHQ8aDE+S2FkYWxhIFNpbXVsYXRvcjwvaDE+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2J1eScgb25DbGljaz17dGhpcy5idXlJdGVtfT57dGhpcy5zdGF0ZS5pdGVtLnRleHR9PC9idXR0b24+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J3Nob3AnIG9uQ2xpY2s9e3RoaXMudG9nZ2xlU3RvcmV9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMTYgNlY0YzAtMS4xMS0uODktMi0yLTJoLTRjLTEuMTEgMC0yIC44OS0yIDJ2MkgydjEzYzAgMS4xMS44OSAyIDIgMmgxNmMxLjExIDAgMi0uODkgMi0yVjZoLTZ6bS02LTJoNHYyaC00VjR6TTkgMThWOWw3LjUgNEw5IDE4elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L25hdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyOyIsInZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcclxuXHRBRERfSVRFTTpudWxsLFxyXG5cclxuXHRQUkVWX0lOVjpudWxsLFxyXG5cdE5FWFRfSU5WOm51bGwsXHJcblxyXG5cdFBSRVZfSVRFTTpudWxsLFxyXG5cdE5FWFRfSVRFTTpudWxsLFxyXG5cclxuXHRDSEFOR0VfU0VUVElORzpudWxsLFxyXG5cdElOQ1JFTUVOVF9TSEFSRFM6bnVsbCxcclxuXHJcblx0VE9HR0xFX09QVElPTlM6bnVsbCxcclxuXHRUT0dHTEVfU1RPUkU6bnVsbFxyXG59KTsiLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpOyIsInZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xyXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xyXG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xyXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xyXG5cclxudmFyIENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xyXG5cclxudmFyIGFwcFNldHRpbmdzID0ge307XHJcbnZhciBkZWZhdWx0cyA9IHtcclxuXHRkQ2xhc3M6J0JhcmJhcmlhbicsXHJcblx0Z2VuZGVyOidGZW1hbGUnLFxyXG5cdGhhcmRjb3JlOmZhbHNlLFxyXG5cdHNlYXNvbmFsOnRydWUsXHJcblx0aXRlbTp7XCJ0eXBlXCI6XCJoZWxtXCIsXCJ0ZXh0XCI6XCJNeXN0ZXJ5IEhlbG1ldFwiLFwiY29zdFwiOjI1LFwic2l6ZVwiOjJ9XHJcbn07XHJcbnZhciBzaGFyZHNTcGVudCA9IHt9O1xyXG52YXIgbGlmZXRpbWUgPSB7fTtcclxuXHJcbnZhciBzdG9yYWdlU3VwcG9ydGVkO1xyXG5cclxuLy9EZXRlcm1pbmUgd2hldGhlciBvciBub3QgbG9jYWwgc3RvcmFnZSBpcyBzdXBwb3J0ZWRcclxuLy9mcm9tIGdpdGh1Yi5jb20vYWdydWJsZXYvYW5ndWxhckxvY2FsU3RvcmFnZVxyXG4vL01JVCBMaWNlbmNlXHJcbmZ1bmN0aW9uIGxvY2FsU3RvcmFnZUNoZWNrKCkge1xyXG5cdHZhciBzdG9yYWdlID0gKHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykgPyB1bmRlZmluZWQgOiB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG5cdHN1cHBvcnRlZCA9ICh0eXBlb2Ygc3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcpO1xyXG5cdGlmIChzdXBwb3J0ZWQpIHtcclxuXHRcdHZhciB0ZXN0S2V5ID0gJ19fJyArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlNyk7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0ZXN0S2V5LCB0ZXN0S2V5KTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGVzdEtleSk7XHJcblx0XHR9XHJcblx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdHN1cHBvcnRlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRzdG9yYWdlU3VwcG9ydGVkID0gc3VwcG9ydGVkO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVTdG9yZSgpIHtcclxuXHRhcHBTZXR0aW5ncy5zdG9yZSA9ICFhcHBTZXR0aW5ncy5zdG9yZTtcclxufVxyXG5mdW5jdGlvbiB0b2dnbGVPcHRpb25zKCkge1xyXG5cdGFwcFNldHRpbmdzLm9wdGlvbnMgPSAhYXBwU2V0dGluZ3Mub3B0aW9ucztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2V0dGluZ3MoKSB7XHJcblx0cmV0dXJuIGFwcFNldHRpbmdzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTaGFyZHMoa2V5KSB7XHJcblx0cmV0dXJuIHNoYXJkc1NwZW50W2tleV0gfHwgMDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hhbmdlU2V0dGluZyhrZXksdmFsKSB7XHJcblx0YXBwU2V0dGluZ3Nba2V5XSA9IHZhbDtcclxuXHRkM3NpbS5zZXRLYWRhbGEoYXBwU2V0dGluZ3MuZENsYXNzLGFwcFNldHRpbmdzLnNlYXNvbmFsLGFwcFNldHRpbmdzLmhhcmRjb3JlKTtcclxuXHRzYXZlU2V0dGluZ3MoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZVNldHRpbmdzKCkge1xyXG5cdGlmIChzdG9yYWdlU3VwcG9ydGVkKSB7XHJcblx0XHRsb2NhbFN0b3JhZ2Uua2FkYWxhU2V0dGluZ3MgPSBKU09OLnN0cmluZ2lmeShhcHBTZXR0aW5ncyk7XHJcblx0XHRsb2NhbFN0b3JhZ2Uua2FkYWxhU3BlbnQgPSBKU09OLnN0cmluZ2lmeShzaGFyZHNTcGVudCk7XHJcblx0XHRsb2NhbFN0b3JhZ2Uua2FkYWxhTGlmZXRpbWUgPSBKU09OLnN0cmluZ2lmeShsaWZldGltZSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbmNyZW1lbnRTaGFyZHMoa2V5LHZhbCkge1xyXG5cdGlmICh0eXBlb2Ygc2hhcmRzU3BlbnRba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHNoYXJkc1NwZW50W2tleV0rPXZhbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzaGFyZHNTcGVudFtrZXldID0gdmFsO1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIGxpZmV0aW1lW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRsaWZldGltZVtrZXldKz12YWw7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0bGlmZXRpbWVba2V5XT12YWw7XHJcblx0fVxyXG5cdHNhdmVTZXR0aW5ncygpO1xyXG59XHJcblxyXG5cclxudmFyIEFwcFN0b3JlID0gYXNzaWduKHt9LEV2ZW50RW1pdHRlci5wcm90b3R5cGUse1xyXG5cdGdldFNldHRpbmdzOmdldFNldHRpbmdzLFxyXG5cdGdldFNoYXJkczpnZXRTaGFyZHMsXHJcblxyXG5cdGVtaXRDaGFuZ2U6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuZW1pdChDSEFOR0VfRVZFTlQpO1xyXG5cdH0sXHJcblx0YWRkQ2hhbmdlTGlzdGVuZXI6ZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMub24oQ0hBTkdFX0VWRU5ULGNhbGxiYWNrKTtcclxuXHR9LFxyXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCxjYWxsYmFjayk7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vaG9pc3Rpbmcgb3ZlcnBvd2VyZWRcclxuZnVuY3Rpb24gbW9iaWxlQ2hlY2soKSB7XHJcblx0dmFyIG1vYmlsZSA9ICh3aW5kb3cuaW5uZXJXaWR0aCA8PSA3NjgpO1xyXG5cclxuXHQvL2lmIGRpZmZlcmVudCB0aGFuIGN1cnJlbnQgY2hhbmdlXHJcblx0aWYgKG1vYmlsZSAhPT0gYXBwU2V0dGluZ3MubW9iaWxlKSB7XHJcblx0XHRhcHBTZXR0aW5ncy5tb2JpbGUgPSBtb2JpbGU7XHJcblx0XHRhcHBTZXR0aW5ncy5zdG9yZSA9ICFtb2JpbGU7XHJcblx0XHRhcHBTZXR0aW5ncy5vcHRpb25zID0gIW1vYmlsZTtcclxuXHR9XHJcblx0QXBwU3RvcmUuZW1pdChDSEFOR0VfRVZFTlQpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRsb2NhbFN0b3JhZ2VDaGVjaygpO1xyXG5cdG1vYmlsZUNoZWNrKCk7XHJcblx0d2luZG93Lm9ucmVzaXplID0gbW9iaWxlQ2hlY2s7XHJcblxyXG5cdGlmIChzdG9yYWdlU3VwcG9ydGVkKSB7XHJcblx0XHR2YXIgc3RvcmVkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgna2FkYWxhU2V0dGluZ3MnKSkgfHwge307XHJcblxyXG5cdFx0Ly9sb29wIHRocm91Z2ggZXhpc3RpbmcgZGVmYXVsdHMgaW5jYXNlIHVzZXIgaGFzIG9sZGVyIHZlcnNpb24gb2YgYXBwXHJcblx0XHR2YXIgc2V0dGluZ3NLZXlzID0gT2JqZWN0LmtleXMoZGVmYXVsdHMpO1xyXG5cdFx0dmFyIGtleUxlbmd0aCA9IHNldHRpbmdzS2V5cy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwga2V5TGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0YXBwU2V0dGluZ3Nbc2V0dGluZ3NLZXlzW2ldXSA9IHN0b3JlZFtzZXR0aW5nc0tleXNbaV1dIHx8IGRlZmF1bHRzW3NldHRpbmdzS2V5c1tpXV07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9wdWxsIHRoZSBzcGVudCBpdGVtc1xyXG5cdFx0c2hhcmRzU3BlbnQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdrYWRhbGFTcGVudCcpKSB8fCB7fTtcclxuXHRcdGxpZmV0aW1lID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgna2FkYWxhTGlmZXRpbWUnKSkgfHwge307XHJcblxyXG5cdFx0Ly9zYXZlIHRvIHN0b3JhZ2VcclxuXHRcdHNhdmVTZXR0aW5ncygpO1xyXG5cdH1cclxufVxyXG5cclxuaW5pdCgpO1xyXG5cclxuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihhY3Rpb24pIHtcclxuXHRzd2l0Y2goYWN0aW9uLmFjdGlvblR5cGUpe1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuQ0hBTkdFX1NFVFRJTkc6XHJcblx0XHRcdGNoYW5nZVNldHRpbmcoYWN0aW9uLmtleSxhY3Rpb24udmFsKTtcclxuXHRcdFx0QXBwU3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLklOQ1JFTUVOVF9TSEFSRFM6XHJcblx0XHRcdGluY3JlbWVudFNoYXJkcyhhY3Rpb24ua2V5LGFjdGlvbi52YWwpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuVE9HR0xFX1NUT1JFOlxyXG5cdFx0XHR0b2dnbGVTdG9yZSgpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuVE9HR0xFX09QVElPTlM6XHJcblx0XHRcdHRvZ2dsZU9wdGlvbnMoKTtcclxuXHRcdFx0QXBwU3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdC8vbm9vcFxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFN0b3JlOyIsInZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XHJcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XHJcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcblxyXG52YXIgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XHJcblxyXG4vL3RoZXJlIGFyZSBvbmx5IHR3byBpbnZlbnRvcmllcyBiZWluZyB1c2VkIHdpdGggdGhlIGFiaWxpdHkgdG8gY3ljbGUgYmFja1xyXG52YXIgcHJldmlvdXNJbnZlbnRvcnk7XHJcbnZhciBjdXJyZW50SW52ZW50b3J5O1xyXG52YXIgbmV4dEludmVudG9yeTtcclxuXHJcbnZhciBpdGVtcyA9IFtdO1xyXG52YXIgY3VycmVudEluZGV4ID0gMDtcclxuXHJcbi8vY3JlYXRlcyBuZXN0ZWQgYXJyYXkgYmxhbmsgaW52ZW50b3J5IGFuZCBzZXRzIGFzIHRoZSBjdXJyZW50IGludmVudG9yeVxyXG5mdW5jdGlvbiBjcmVhdGVJbnZlbnRvcnkoKSB7XHJcblx0dmFyIG5ld0ludmVudG9yeSA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTwxMDtpKyspIHtcclxuXHRcdC8vcHVzaCBhIGJsYW5rIGFycmF5IHRvIHJlcHJlc2VudCBlYWNoIGNvbHVtbiBvZiB0aGUgaW52ZW50b3J5XHJcblx0XHRuZXdJbnZlbnRvcnkucHVzaChbXSk7XHJcblx0fVxyXG5cclxuXHQvL3NldCB0aGUgcHJldmlvdXMgaW52ZW50b3J5IHRvIHRoZSBsYXRlc3QgaW52ZW50b3J5IHVzZWRcclxuXHRwcmV2aW91c0ludmVudG9yeSA9IG5leHRJbnZlbnRvcnkgfHwgY3VycmVudEludmVudG9yeSB8fCB1bmRlZmluZWQ7XHJcblx0Ly90aGUgbmV3IGJsYW5rIGludmVudG9yeSBpcyBub3cgdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcblx0Y3VycmVudEludmVudG9yeSA9IG5ld0ludmVudG9yeTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW52ZW50b3J5KCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeTpwcmV2aW91c0ludmVudG9yeSxcclxuXHRcdGN1cnJlbnRJbnZlbnRvcnk6Y3VycmVudEludmVudG9yeSxcclxuXHRcdG5leHRJbnZlbnRvcnk6bmV4dEludmVudG9yeVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW0oKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdGhhc1ByZXZpb3VzOihjdXJyZW50SW5kZXggIT09IDApLFxyXG5cdFx0aXRlbTppdGVtc1tjdXJyZW50SW5kZXhdLFxyXG5cdFx0aGFzTmV4dDooY3VycmVudEluZGV4IDwgaXRlbXMubGVuZ3RoIC0gMSlcclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRJdGVtKGl0ZW0pIHtcclxuXHR2YXIgaW52ZW50b3J5TGVuZ3RoID0gY3VycmVudEludmVudG9yeS5sZW5ndGg7XHJcblx0Ly9sb29waW5nIHRocm91Z2ggZWFjaCBjb2x1bW4gb2YgdGhlIGludmVudG9yeVxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgaW52ZW50b3J5TGVuZ3RoOyBpICsrKSB7XHJcblx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIGl0ZW0gaW4gc2FpZCBjb2x1bW5cclxuXHRcdHZhciBjb2x1bW5MZW5ndGggPSBjdXJyZW50SW52ZW50b3J5W2ldLmxlbmd0aDtcclxuXHRcdHZhciBjb2x1bW5IZWlnaHQgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjb2x1bW5MZW5ndGg7IGorKykge1xyXG5cdFx0XHQvL2FkZCBjdXJyZW50IGl0ZW0gc2l6ZSB0byBjb2x1bW4gaGVpZ2h0XHJcblx0XHRcdGlmKGN1cnJlbnRJbnZlbnRvcnlbaV1bal0uaGFzT3duUHJvcGVydHkoJ3NpemUnKSkge1xyXG5cdFx0XHRcdGNvbHVtbkhlaWdodCs9Y3VycmVudEludmVudG9yeVtpXVtqXS5zaXplO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL2NoZWNrIGlmIHRoZSBoZWlnaHQgaXMgc3RpbGwgbGVzcyB0aGFuIDYgd2l0aCBuZXcgaXRlbVxyXG5cdFx0Ly9hbmQgYWRkIHRvIHRoYXQgY29sdW1uIGFuZCByZXR1cm4gdG8gc3RvcCB0aGUgbWFkbmVzc1xyXG5cdFx0aWYgKGNvbHVtbkhlaWdodCtpdGVtLnNpemUgPD02KSB7XHJcblx0XHRcdGN1cnJlbnRJbnZlbnRvcnlbaV0ucHVzaChpdGVtKTtcclxuXHRcdFx0Ly9pZiB3ZSBjYW4gc3VjY2Vzc2Z1bGx5IGFkZCB0byBpbnZlbnRvcnkgY2FsbCBmb3IgaXRlbXMgaW52ZW50b3J5XHJcblx0XHRcdGFkZFRvSXRlbXMoaXRlbSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vaWYgd2UgbWFkZSBpdCB0aGlzIGZhciB0aGUgbmV3IGl0ZW0gZG9lcyBub3QgZml0IGluIHRoZSBjdXJyZW50IGludmVudG9yeVxyXG5cdC8vY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbmV4dCBpbnZlbnRvcnlcclxuXHQvL3NvIHRoYXQgd2UgY2FuIGN5Y2xlIHRvIG5leHQgaW52ZW50b3J5IGFuZCB0cnkgYW5kIGZpdCBpdCBpblxyXG5cdGlmICh0eXBlb2YgbmV4dEludmVudG9yeSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdGdvdG9OZXh0KCk7XHJcblx0XHRhZGRJdGVtKGl0ZW0pO1xyXG5cdH1cclxuXHQvL3RoZXJlIGlzIG5vIG5leHQgaW52ZW50b3J5IGFuZCB3ZSBuZWVkIHRvIG1ha2UgYSBuZXcgb25lXHJcblx0ZWxzZSB7XHJcblx0XHRjcmVhdGVJbnZlbnRvcnkoKTtcclxuXHRcdGFkZEl0ZW0oaXRlbSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb0l0ZW1zKGl0ZW0pIHtcclxuXHRpdGVtcy5wdXNoKGl0ZW0pO1xyXG5cclxuXHQvL2lmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMTAgaXRlbXMgcmVtb3ZlIHRoZSBmaXJzdFxyXG5cdGlmIChpdGVtcy5sZW5ndGggPiAxMCkge1xyXG5cdFx0aXRlbXMuc2hpZnQoKTtcclxuXHR9XHJcblxyXG5cdC8vc2V0IHRoZSBjdXJyZW50aW5kZXggdG8gdGhlIG5ldyBpdGVtXHJcblx0Y3VycmVudEluZGV4ID0gaXRlbXMubGVuZ3RoIC0gMTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJldmlvdXNJdGVtKCkge1xyXG5cdGlmIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuXHRcdGN1cnJlbnRJbmRleCAtPTE7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIG5leHRJdGVtKCkge1xyXG5cdGlmIChjdXJyZW50SW5kZXggPCBpdGVtcy5sZW5ndGggLTEpIHtcclxuXHRcdGN1cnJlbnRJbmRleCArPTE7XHJcblx0fVxyXG59XHJcblxyXG4vL2N5Y2xlcyB0aHJvdWdoIHRvIHRoZSBwcmV2aW91cyBpbnZlbnRvcnlcclxuZnVuY3Rpb24gZ290b1ByZXZpb3VzKCkge1xyXG5cdGlmKHR5cGVvZiBwcmV2aW91c0ludmVudG9yeSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdG5leHRJbnZlbnRvcnkgPSBjdXJyZW50SW52ZW50b3J5O1xyXG5cdFx0Y3VycmVudEludmVudG9yeSA9IHByZXZpb3VzSW52ZW50b3J5O1xyXG5cdFx0cHJldmlvdXNJbnZlbnRvcnkgPSB1bmRlZmluZWQ7XHJcblx0fVxyXG59XHJcblxyXG4vL2N5Y2xlcyB0aHJvdWdoIHRvIHRoZSBuZXh0IGludmVudG9yeVxyXG5mdW5jdGlvbiBnb3RvTmV4dCgpIHtcclxuXHRpZih0eXBlb2YgbmV4dEludmVudG9yeSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHByZXZpb3VzSW52ZW50b3J5ID0gY3VycmVudEludmVudG9yeTtcclxuXHRcdGN1cnJlbnRJbnZlbnRvcnkgPSBuZXh0SW52ZW50b3J5O1xyXG5cdFx0bmV4dEludmVudG9yeSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcbn1cclxuXHJcbi8vaW5pdGlhbGl6ZSBzdG9yZSBieSBjcmVhdGluZyBhIGJsYW5rIGludmVudG9yeVxyXG5jcmVhdGVJbnZlbnRvcnkoKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSx7XHJcblx0Z2V0SW52ZW50b3J5OmdldEludmVudG9yeSxcclxuXHRnb3RvUHJldmlvdXM6Z290b1ByZXZpb3VzLFxyXG5cdGdvdG9OZXh0OmdvdG9OZXh0LFxyXG5cdGFkZEl0ZW06YWRkSXRlbSxcclxuXHRnZXRJdGVtOmdldEl0ZW0sXHJcblx0cHJldmlvdXNJdGVtOnByZXZpb3VzSXRlbSxcclxuXHRuZXh0SXRlbTpuZXh0SXRlbSxcclxuXHJcblx0ZW1pdENoYW5nZTpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5lbWl0KENIQU5HRV9FVkVOVCk7XHJcblx0fSxcclxuXHRhZGRDaGFuZ2VMaXN0ZW5lcjpmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5vbihDSEFOR0VfRVZFTlQsY2FsbGJhY2spO1xyXG5cdH0sXHJcblx0cmVtb3ZlQ2hhbmdlTGlzdGVuZXI6ZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ0hBTkdFX0VWRU5ULGNhbGxiYWNrKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihhY3Rpb24pIHtcclxuXHRzd2l0Y2goYWN0aW9uLmFjdGlvblR5cGUpIHtcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5BRERfSVRFTTpcclxuXHRcdFx0YWRkSXRlbShhY3Rpb24uaXRlbSk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuUFJFVl9JTlY6XHJcblx0XHRcdGdvdG9QcmV2aW91cygpO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLk5FWFRfSU5WOlxyXG5cdFx0XHRnb3RvTmV4dCgpO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLlBSRVZfSVRFTTpcclxuXHRcdFx0cHJldmlvdXNJdGVtKCk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuTkVYVF9JVEVNOlxyXG5cdFx0XHRuZXh0SXRlbSgpO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdC8vbm9vcFxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeVN0b3JlOyJdfQ==
