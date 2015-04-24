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

		var mobile = this.mobileCheck();
		//add a listner to the resize event
		window.onresize = this.mobileCheck;

		return {
			mobile:mobile
		}
	},

	mobileCheck:function() {
		var mobile = (window.innerWidth <= 768);

		//if the app is mounted (has a state) and they are different set it
		if (this.isMounted() && mobile !== this.state.mobile) {
			this.setState({
				mobile:mobile
			});
		}

		//boolean based on bootstrap breakpoint of 768px
		return mobile;
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

	changeSetting:function(key,val) {
		AppDispatcher.dispatch({
			actionType:AppConstants.CHANGE_SETTING,
			key:key,
			val:val
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
						React.createElement(ItemLeft, {hideClass: hiddenButtons}), 
						tooltip, 
						React.createElement(ItemRight, {hideClass: hiddenButtons})
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

	},

	render:function() {

		var buttonClass = 'inventory-button shift left';

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

var ItemRight = React.createClass({displayName: "ItemRight",

	_handleClick:function() {

	},

	render:function() {

		var buttonClass = 'inventory-button shift right';

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

},{}],19:[function(require,module,exports){
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
						bgurl='img/blue.png';
						borderColor='#7979d4';
						break;
					case 'rare':
						bgurl='img/yellow.png';
						borderColor='#f8cc35';
						break;
					case 'legendary':
						bgurl='img/orange.png';
						borderColor='#bf642f';
						break;
					case 'ancient':
						bgurl='img/orange.png';
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

	changeGender:function(gender) {
		this.setState({
			gender:gender
		});
		AppActions.changeSetting('gender',gender);
	},
	changeClass:function(dClass) {
		this.setState({
			dClass:dClass
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
			AppActions.changeSetting('dClass',dClass);
		});
	},
	changeHardcore:function(bool) {
		this.setState({
			hardcore:bool
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
			AppActions.changeSetting('hardcore',bool);
		});
	},
	changeSeasonal:function(bool) {
		this.setState({
			seasonal:bool
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
			AppActions.changeSetting('seasonal',bool);
		});
	},

	render:function() {
		return (
			React.createElement("section", {className: "options-panel", id: "options-panel"}, 
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

var KadalaItem = React.createClass({displayName: "KadalaItem",

	getInitialState:function() {
		return {shardCount:0};
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

},{"../../actions/AppActions":8}],32:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var KadalaItem = require('./kadala-item.jsx');

var KadalaStore = React.createClass({displayName: "KadalaStore",
	render:function() {

		var kadalaClass = 'kadala-store';
		//this is a check for internet explorer
		//flex-direction:column breaks everything so we detect for it here
		if ((window.navigator.userAgent.indexOf('MSIE ') !== -1)||!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			kadalaClass+=' noie'
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

},{"./kadala-item.jsx":31}],33:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);

var AppActions = require('../../actions/AppActions.js');
var AppStore = require('../../stores/AppStore.js');

var Navbar = React.createClass({displayName: "Navbar",
	getInitialState:function() {
		var item = AppStore.getSettings().item;
		return {
			options:false,
			store:false,
			item:item
		};
	},
	toggleOptions:function() {
		//toggle the option panel and the state
		document.getElementById('options-panel').style.display = (this.state.options)? 'none':'block';
		this.setState({options:!this.state.options});
	},
	toggleStore:function() {
		document.getElementById('kadala-store').style.display = (this.state.store)? 'none':'block';
		this.setState({store:!this.state.store});
	},
	buyItem:function() {
		var item = d3sim.kadalaRoll(this.state.item.type);
		item.size = this.state.item.size;
		AppActions.addItem(item);
		AppActions.incrementShards(this.state.item.type,this.state.item.cost);
	},
	componentDidUpdate:function() {
		//if we are on a large screen and options/store are not visible
		//make them visible
		if (!this.props.mobile && !(this.state.options || this.state.store)) {
			this.setState({
				options:true,
				store:true
			});
		}
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
	INCREMENT_SHARDS:null
});

},{"keymirror":6}],35:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":3}],36:[function(require,module,exports){
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

function getSettings() {
	return appSettings;
}

function changeSetting(key,val) {
	appSettings[key] = val;
	saveSettings();
}

function saveSettings() {
	if (storageSupported) {
		localStorage.kadalaSettings = JSON.stringify(appSettings);
		localStorage.kadalaSpent = JSON.stringify(shardsSpent);
	}
}

function incrementShards(key,val) {
	if (typeof shardsSpent[key] !== 'undefined') {
		shardsSpent[key]+=val;
	}
	else {
		shardsSpent[key] = val;
	}
	saveSettings();
}

function init() {
	localStorageCheck();
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

		//save to storage
		saveSettings();
	}
}


init();

var AppStore = assign({},EventEmitter.prototype,{
	getSettings:getSettings,

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
	switch(action.actionType){
		case AppConstants.CHANGE_SETTING:
			changeSetting(action.key,action.val);
			AppStore.emitChange();
			break;
		case AppConstants.INCREMENT_SHARDS:
			incrementShards(action.key,action.val);
			break;
		default:
			//noop
	}
});

module.exports = AppStore;

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
		item:items[currentIndex]
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

		default:
			//noop
	}
});

module.exports = InventoryStore;

},{"../constants/AppConstants":34,"../dispatcher/AppDispatcher":35,"events":2,"object-assign":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxhY3Rpb25zXFxBcHBBY3Rpb25zLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWFybW9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1ib2R5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1mbGF2b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWhlYWQuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLXN0YXQuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLXdlYXBvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbmRpdmlkdWFsLWl0ZW1cXGluZGl2aWR1YWwtaXRlbS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGluZGl2aWR1YWwtaXRlbVxcaXRlbS1sZWZ0LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW5kaXZpZHVhbC1pdGVtXFxpdGVtLXJpZ2h0LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxpbnZlbnRvcnktY29udGFpbmVyLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxpbnZlbnRvcnktc2xvdC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxuZXh0LWludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxccHJldmlvdXMtaW52ZW50b3J5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGNsYXNzLXNlbGVjdG9yLWJ1dHRvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxjbGFzcy1zZWxlY3Rvci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxnZW5kZXItc2VsZWN0b3ItYnV0dG9uLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGdlbmRlci1zZWxlY3Rvci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxoYXJkY29yZS1jaGVja2JveC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxvcHRpb25zLXBhbmVsLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXHNlYXNvbmFsLWNoZWNrYm94LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLXN0b3JlXFxrYWRhbGEtaXRlbS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1zdG9yZVxca2FkYWxhLXN0b3JlLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcbmF2XFxuYXZiYXIuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb25zdGFudHNcXEFwcENvbnN0YW50cy5qcyIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcZGlzcGF0Y2hlclxcQXBwRGlzcGF0Y2hlci5qcyIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcc3RvcmVzXFxBcHBTdG9yZS5qcyIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcc3RvcmVzXFxJbnZlbnRvcnlTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3BELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0FBQzVFLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0FBQ3hFLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBQ2hFLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDOztBQUVqRixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFL0MsSUFBSSxpQ0FBaUMsMkJBQUE7QUFDckMsQ0FBQyxlQUFlLENBQUMsV0FBVzs7QUFFNUIsRUFBRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7O0FBRWxDLEVBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDOztFQUVuQyxPQUFPO0dBQ04sTUFBTSxDQUFDLE1BQU07R0FDYjtBQUNILEVBQUU7O0NBRUQsV0FBVyxDQUFDLFdBQVc7QUFDeEIsRUFBRSxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQzFDOztFQUVFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtHQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ2IsTUFBTSxDQUFDLE1BQU07SUFDYixDQUFDLENBQUM7QUFDTixHQUFHO0FBQ0g7O0VBRUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXO0FBQ25COztFQUVFLElBQUksU0FBUyxDQUFDO0VBQ2QsSUFBSSxjQUFjLENBQUM7RUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtHQUN0QixjQUFjLEdBQUcsb0JBQUMsY0FBYyxFQUFBLElBQUEsQ0FBRyxDQUFBO0dBQ25DO09BQ0k7R0FDSixTQUFTLEdBQUcsb0JBQUMsU0FBUyxFQUFBLElBQUEsQ0FBRyxDQUFBO0FBQzVCLEdBQUc7O0VBRUQ7R0FDQyxvQkFBQSxLQUFJLEVBQUEsSUFBQyxFQUFBO0dBQ0wsb0JBQUMsTUFBTSxFQUFBLENBQUEsQ0FBQyxNQUFBLEVBQU0sQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU8sQ0FBQSxDQUFHLENBQUEsRUFBQTtHQUNyQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGlCQUFrQixDQUFBLEVBQUE7SUFDaEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxLQUFNLENBQUEsRUFBQTtLQUNwQixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLFVBQVcsQ0FBQSxFQUFBO01BQ3pCLG9CQUFDLFlBQVksRUFBQSxJQUFBLENBQUcsQ0FBQTtLQUNYLENBQUEsRUFBQTtLQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsVUFBVyxDQUFBLEVBQUE7TUFDekIsb0JBQUMsV0FBVyxFQUFBLElBQUEsQ0FBRyxDQUFBLEVBQUE7TUFDZCxTQUFVO0tBQ04sQ0FBQTtJQUNELENBQUEsRUFBQTtJQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsS0FBTSxDQUFBLEVBQUE7S0FDcEIsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQTtNQUN6QixjQUFlO0tBQ1gsQ0FBQTtJQUNELENBQUE7R0FDRCxDQUFBO0dBQ0EsQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxLQUFLLENBQUMsTUFBTTtDQUNYLG9CQUFDLFdBQVcsRUFBQSxJQUFBLENBQUcsQ0FBQTtDQUNmLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO0NBQzlCOzs7OztBQzNFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QVk7Q0FDekIsUUFBUSxDQUFDLFFBQVE7Q0FDakIsT0FBTyxDQUFDLE9BQU87QUFDaEIsQ0FBQyxPQUFPLENBQUMsT0FBTzs7Q0FFZixVQUFVLENBQUMsVUFBVTtFQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3hCO0NBQ0QsaUJBQWlCLENBQUMsU0FBUyxRQUFRLEVBQUU7RUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDL0I7Q0FDRCxvQkFBb0IsQ0FBQyxTQUFTLFFBQVEsRUFBRTtFQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUMzQztBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxNQUFNLEVBQUU7QUFDeEMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxVQUFVOztFQUV2QixLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDckIsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLFlBQVksRUFBRSxDQUFDO0dBQ2YsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLFFBQVEsRUFBRSxDQUFDO0dBQ1gsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7QUFFVCxFQUFFLFFBQVE7O0VBRVI7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvbmF2L25hdmJhci5qc3gnKTtcclxudmFyIE9wdGlvbnNQYW5lbCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9rYWRhbGEtb3B0aW9ucy9vcHRpb25zLXBhbmVsLmpzeCcpO1xyXG52YXIgS2FkYWxhU3RvcmUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMva2FkYWxhLXN0b3JlL2thZGFsYS1zdG9yZS5qc3gnKTtcclxudmFyIEludmVudG9yeSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9pbnZlbnRvcnkvaW52ZW50b3J5LmpzeCcpO1xyXG52YXIgSW5kaXZpZHVhbEl0ZW0gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaW5kaXZpZHVhbC1pdGVtL2luZGl2aWR1YWwtaXRlbS5qc3gnKTtcclxuXHJcbnZhciBBcHBTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmVzL0FwcFN0b3JlLmpzJyk7XHJcblxyXG52YXIgQXBwbGljYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBtb2JpbGUgPSB0aGlzLm1vYmlsZUNoZWNrKCk7XHJcblx0XHQvL2FkZCBhIGxpc3RuZXIgdG8gdGhlIHJlc2l6ZSBldmVudFxyXG5cdFx0d2luZG93Lm9ucmVzaXplID0gdGhpcy5tb2JpbGVDaGVjaztcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtb2JpbGU6bW9iaWxlXHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0bW9iaWxlQ2hlY2s6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbW9iaWxlID0gKHdpbmRvdy5pbm5lcldpZHRoIDw9IDc2OCk7XHJcblxyXG5cdFx0Ly9pZiB0aGUgYXBwIGlzIG1vdW50ZWQgKGhhcyBhIHN0YXRlKSBhbmQgdGhleSBhcmUgZGlmZmVyZW50IHNldCBpdFxyXG5cdFx0aWYgKHRoaXMuaXNNb3VudGVkKCkgJiYgbW9iaWxlICE9PSB0aGlzLnN0YXRlLm1vYmlsZSkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRtb2JpbGU6bW9iaWxlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vYm9vbGVhbiBiYXNlZCBvbiBib290c3RyYXAgYnJlYWtwb2ludCBvZiA3NjhweFxyXG5cdFx0cmV0dXJuIG1vYmlsZTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly9jb25kaXRpb25hbGx5IHJlbmRlciBlaXRoZXIgdGhlIGludmVudG9yeSBvciBpbmRpdmlkdWFsIGl0ZW0gYmFzZWQgb24gc2NyZWVuIHNpemVcclxuXHRcdHZhciBpbnZlbnRvcnk7XHJcblx0XHR2YXIgaW5kaXZpZHVhbEl0ZW07XHJcblx0XHRpZiAodGhpcy5zdGF0ZS5tb2JpbGUpIHtcclxuXHRcdFx0aW5kaXZpZHVhbEl0ZW0gPSA8SW5kaXZpZHVhbEl0ZW0gLz5cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpbnZlbnRvcnkgPSA8SW52ZW50b3J5IC8+XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0PE5hdmJhciBtb2JpbGU9e3RoaXMuc3RhdGUubW9iaWxlfSAvPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyLWZsdWlkJz5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMyc+XHJcblx0XHRcdFx0XHRcdDxPcHRpb25zUGFuZWwgLz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbC1zbS05Jz5cclxuXHRcdFx0XHRcdFx0PEthZGFsYVN0b3JlIC8+XHJcblx0XHRcdFx0XHRcdHtpbnZlbnRvcnl9XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMTInPlxyXG5cdFx0XHRcdFx0XHR7aW5kaXZpZHVhbEl0ZW19XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxuUmVhY3QucmVuZGVyKFxyXG5cdDxBcHBsaWNhdGlvbiAvPixcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcclxuKTsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbm1vZHVsZS5leHBvcnRzLkRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL2xpYi9EaXNwYXRjaGVyJylcbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogQHR5cGVjaGVja3NcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJy4vaW52YXJpYW50Jyk7XG5cbnZhciBfbGFzdElEID0gMTtcbnZhciBfcHJlZml4ID0gJ0lEXyc7XG5cbi8qKlxuICogRGlzcGF0Y2hlciBpcyB1c2VkIHRvIGJyb2FkY2FzdCBwYXlsb2FkcyB0byByZWdpc3RlcmVkIGNhbGxiYWNrcy4gVGhpcyBpc1xuICogZGlmZmVyZW50IGZyb20gZ2VuZXJpYyBwdWItc3ViIHN5c3RlbXMgaW4gdHdvIHdheXM6XG4gKlxuICogICAxKSBDYWxsYmFja3MgYXJlIG5vdCBzdWJzY3JpYmVkIHRvIHBhcnRpY3VsYXIgZXZlbnRzLiBFdmVyeSBwYXlsb2FkIGlzXG4gKiAgICAgIGRpc3BhdGNoZWQgdG8gZXZlcnkgcmVnaXN0ZXJlZCBjYWxsYmFjay5cbiAqICAgMikgQ2FsbGJhY2tzIGNhbiBiZSBkZWZlcnJlZCBpbiB3aG9sZSBvciBwYXJ0IHVudGlsIG90aGVyIGNhbGxiYWNrcyBoYXZlXG4gKiAgICAgIGJlZW4gZXhlY3V0ZWQuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoaXMgaHlwb3RoZXRpY2FsIGZsaWdodCBkZXN0aW5hdGlvbiBmb3JtLCB3aGljaFxuICogc2VsZWN0cyBhIGRlZmF1bHQgY2l0eSB3aGVuIGEgY291bnRyeSBpcyBzZWxlY3RlZDpcbiAqXG4gKiAgIHZhciBmbGlnaHREaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNvdW50cnkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENvdW50cnlTdG9yZSA9IHtjb3VudHJ5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNpdHkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENpdHlTdG9yZSA9IHtjaXR5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHRoZSBiYXNlIGZsaWdodCBwcmljZSBvZiB0aGUgc2VsZWN0ZWQgY2l0eVxuICogICB2YXIgRmxpZ2h0UHJpY2VTdG9yZSA9IHtwcmljZTogbnVsbH1cbiAqXG4gKiBXaGVuIGEgdXNlciBjaGFuZ2VzIHRoZSBzZWxlY3RlZCBjaXR5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjaXR5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDaXR5OiAncGFyaXMnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBgQ2l0eVN0b3JlYDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjaXR5LXVwZGF0ZScpIHtcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gcGF5bG9hZC5zZWxlY3RlZENpdHk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBjb3VudHJ5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjb3VudHJ5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDb3VudHJ5OiAnYXVzdHJhbGlhJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYm90aCBzdG9yZXM6XG4gKlxuICogICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb25UeXBlKSB7XG4gKiAgICAgICAgIGNhc2UgJ2NvdW50cnktdXBkYXRlJzpcbiAqICAgICAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NpdHlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBnZXRGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKlxuICogICAgICAgICBjYXNlICdjaXR5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgYGNvdW50cnktdXBkYXRlYCBwYXlsb2FkIHdpbGwgYmUgZ3VhcmFudGVlZCB0byBpbnZva2UgdGhlIHN0b3JlcydcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzIGluIG9yZGVyOiBgQ291bnRyeVN0b3JlYCwgYENpdHlTdG9yZWAsIHRoZW5cbiAqIGBGbGlnaHRQcmljZVN0b3JlYC5cbiAqL1xuXG4gIGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aXRoIGV2ZXJ5IGRpc3BhdGNoZWQgcGF5bG9hZC4gUmV0dXJuc1xuICAgKiBhIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgd2l0aCBgd2FpdEZvcigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgaWQgPSBfcHJlZml4ICsgX2xhc3RJRCsrO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNhbGxiYWNrIGJhc2VkIG9uIGl0cyB0b2tlbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS51bnJlZ2lzdGVyPWZ1bmN0aW9uKGlkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgJ0Rpc3BhdGNoZXIudW5yZWdpc3RlciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgIGlkXG4gICAgKTtcbiAgICBkZWxldGUgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIGNhbGxiYWNrcyBzcGVjaWZpZWQgdG8gYmUgaW52b2tlZCBiZWZvcmUgY29udGludWluZyBleGVjdXRpb25cbiAgICogb2YgdGhlIGN1cnJlbnQgY2FsbGJhY2suIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgYSBjYWxsYmFjayBpblxuICAgKiByZXNwb25zZSB0byBhIGRpc3BhdGNoZWQgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheTxzdHJpbmc+fSBpZHNcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLndhaXRGb3I9ZnVuY3Rpb24oaWRzKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJ1xuICAgICk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBpZCA9IGlkc1tpaV07XG4gICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgIGludmFyaWFudChcbiAgICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0sXG4gICAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIHdoaWxlICcgK1xuICAgICAgICAgICd3YWl0aW5nIGZvciBgJXNgLicsXG4gICAgICAgICAgaWRcbiAgICAgICAgKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpbnZhcmlhbnQoXG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgICAgaWRcbiAgICAgICk7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYSBwYXlsb2FkIHRvIGFsbCByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICAhdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoLmRpc3BhdGNoKC4uLik6IENhbm5vdCBkaXNwYXRjaCBpbiB0aGUgbWlkZGxlIG9mIGEgZGlzcGF0Y2guJ1xuICAgICk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nKHBheWxvYWQpO1xuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGlzIERpc3BhdGNoZXIgY3VycmVudGx5IGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuaXNEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoZSBjYWxsYmFjayBzdG9yZWQgd2l0aCB0aGUgZ2l2ZW4gaWQuIEFsc28gZG8gc29tZSBpbnRlcm5hbFxuICAgKiBib29ra2VlcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2s9ZnVuY3Rpb24oaWQpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSB0cnVlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSh0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdXAgYm9va2tlZXBpbmcgbmVlZGVkIHdoZW4gZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZz1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFyIGJvb2trZWVwaW5nIHVzZWQgZm9yIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChmYWxzZSkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkob2JqKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBrZXk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUb09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIGtleXM7XG5cdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gYXJndW1lbnRzW3NdO1xuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0b1trZXlzW2ldXSA9IGZyb21ba2V5c1tpXV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsInZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XHJcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHtcclxuXHJcblx0YWRkSXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLkFERF9JVEVNLFxyXG5cdFx0XHRpdGVtOml0ZW1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHByZXZpb3VzSW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5QUkVWX0lOVlxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0bmV4dEludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuTkVYVF9JTlZcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGNoYW5nZVNldHRpbmc6ZnVuY3Rpb24oa2V5LHZhbCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLkNIQU5HRV9TRVRUSU5HLFxyXG5cdFx0XHRrZXk6a2V5LFxyXG5cdFx0XHR2YWw6dmFsXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRpbmNyZW1lbnRTaGFyZHM6ZnVuY3Rpb24oa2V5LHZhbCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLklOQ1JFTUVOVF9TSEFSRFMsXHJcblx0XHRcdGtleTprZXksXHJcblx0XHRcdHZhbDp2YWxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEFjdGlvbnM7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcclxuXHREM0l0ZW1Ub29sdGlwQXJtb3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0XHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWFybW9yLXdlYXBvbiBpdGVtLWFybW9yLWFybW9yXCI+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cImJpZ1wiPjxwPjxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMuYXJtb3J9PC9zcGFuPjwvcD48L2xpPlxyXG5cdFx0XHRcdDxsaT5Bcm1vcjwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBBcm1vcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBBcm1vciA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC1hcm1vci5qc3gnKSxcclxuXHREM0l0ZW1Ub29sdGlwV2VhcG9uID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLXdlYXBvbi5qc3gnKSxcclxuXHREM0l0ZW1Ub29sdGlwU3RhdCA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC1zdGF0LmpzeCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBCb2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBpY29uQ2xhc3NlcyA9ICdkMy1pY29uIGQzLWljb24taXRlbSBkMy1pY29uLWl0ZW0tbGFyZ2UnO1xyXG5cdFx0dmFyIGl0ZW1UeXBlQ2xhc3MgPSdkMy1jb2xvci0nOyBcclxuXHJcblx0XHQvL2RlY2xhcmUgYXJyYXlzIGZvciBwcmltYXJ5IGFuZCBzZWNvbmRhcnkgaXRlbSBlZmZlY3RzLiBcclxuXHRcdC8vQW4gaXRlbSBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIG9mIGVhY2guXHJcblx0XHQvL0NyZWF0ZSB0aGUgbGlzdCBpdGVtIGZvciBlYWNoIHN0YXQgYW5kIHB1c2ggaW4gdGhlIGFycmF5c1xyXG5cdFx0dmFyIHByaW1hcmllcyA9IGZvckVhY2godGhpcy5wcm9wcy5pdGVtLnByaW1hcmllcyk7XHJcblx0XHR2YXIgc2Vjb25kYXJpZXMgPSBmb3JFYWNoKHRoaXMucHJvcHMuaXRlbS5zZWNvbmRhcmllcyk7XHJcblxyXG5cdFx0Ly9pbWFnZSB1c2VkIGFzIGlubGluZS1zdHlsZSBmb3IgaXRlbSB0b29sdGlwc1xyXG5cdFx0dmFyIGltYWdlID0ge2JhY2tncm91bmRJbWFnZTondXJsKCcrdGhpcy5wcm9wcy5pdGVtLmltYWdlKycpJ307XHJcblxyXG5cdFx0Ly9pZiBzcGVjaWZpZWQsIHNldCBjb2xvciBmb3IgdG9vbHRpcCBjb21wb25lbnRzXHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmNvbG9yKSB7XHJcblx0XHRcdGljb25DbGFzc2VzICs9ICcgZDMtaWNvbi1pdGVtLScrdGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0XHRpdGVtVHlwZUNsYXNzICs9dGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vaWYgaXQgaXMgYW4gYXJtb3Igb3Igd2VhcG9uIGFkZCBhZGRpdGlvbmFsIGluZm8gdG8gaWNvbiBzZWN0aW9uXHJcblx0XHR2YXIgc3ViSGVhZDtcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0uaGFzT3duUHJvcGVydHkoJ2FybW9yJykpIHtcclxuXHRcdFx0c3ViSGVhZCA9IDxEM0l0ZW1Ub29sdGlwQXJtb3IgYXJtb3I9e3RoaXMucHJvcHMuaXRlbS5hcm1vcn0vPjtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0uaGFzT3duUHJvcGVydHkoJ3dlYXBvbicpKSB7XHJcblx0XHRcdHN1YkhlYWQgPSA8RDNJdGVtVG9vbHRpcFdlYXBvbiB3ZWFwb249e3RoaXMucHJvcHMuaXRlbS53ZWFwb259Lz47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9pZiBzb2NrZXRzIGFyZSBuZWVkZWRcclxuXHRcdHZhciBzb2NrZXRzID0gW107XHJcblx0XHR2YXIgc29ja2V0S2V5ID0gMDtcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0ucHJpbWFyaWVzLmhhc093blByb3BlcnR5KCdTb2NrZXQnKSkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0wOyBpIDwgdGhpcy5wcm9wcy5pdGVtLnByaW1hcmllcy5Tb2NrZXQudmFsdWU7IGkrKykge1xyXG5cdFx0XHRcdHNvY2tldHMucHVzaCg8bGkgY2xhc3NOYW1lPSdlbXB0eS1zb2NrZXQgZDMtY29sb3ItYmx1ZScga2V5PXtzb2NrZXRLZXl9ID5FbXB0eSBTb2NrZXQ8L2xpPik7XHJcblx0XHRcdFx0c29ja2V0S2V5Kys7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvL2RldGVybWluZSB0aGUgd29yZCB0byBwdXQgbmV4dCB0byBpdGVtIHR5cGVcclxuXHRcdHZhciBpdGVtVHlwZVByZWZpeDtcclxuXHRcdC8vY2hlY2sgaWYgYW5jaWVudCBzZXQgaXRlbSBhbmQgbWFudWFsbHkgcHV0XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLnJhcml0eSA9PT0gJ2FuY2llbnQnICYmIHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykpIHtcclxuXHRcdFx0aXRlbVR5cGVQcmVmaXggPSAnQW5jaWVudCBTZXQnO1xyXG5cdFx0fVxyXG5cdFx0Ly9vdGhlcndpc2UgaXQgaXMgc2V0L2EgcmFyaXR5IG9ubHlcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpdGVtVHlwZVByZWZpeCA9ICh0aGlzLnByb3BzLml0ZW0uaGFzT3duUHJvcGVydHkoJ3NldCcpKSA/ICdzZXQnIDogdGhpcy5wcm9wcy5pdGVtLnJhcml0eTtcclxuXHRcdFx0Ly9jYXBpdGFsaXplIGZpcnN0IGxldHRlclxyXG5cdFx0XHRpdGVtVHlwZVByZWZpeCA9IGl0ZW1UeXBlUHJlZml4LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaXRlbVR5cGVQcmVmaXguc2xpY2UoMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ0b29sdGlwLWJvZHkgZWZmZWN0LWJnIGVmZmVjdC1iZy1hcm1vciBlZmZlY3QtYmctYXJtb3ItZGVmYXVsdFwiPlxyXG5cclxuXHRcdFx0XHR7LypUaGUgaXRlbSBpY29uIGFuZCBjb250YWluZXIsIGNvbG9yIG5lZWRlZCBmb3IgYmFja2dyb3VuZCovfVxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT17aWNvbkNsYXNzZXN9PlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1pdGVtLWdyYWRpZW50XCI+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImljb24taXRlbS1pbm5lciBpY29uLWl0ZW0tZGVmYXVsdFwiIHN0eWxlPXtpbWFnZX0+XHJcblx0XHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHQ8L3NwYW4+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZDMtaXRlbS1wcm9wZXJ0aWVzXCI+XHJcblxyXG5cdFx0XHRcdFx0ey8qU2xvdCBhbmQgaWYgY2xhc3Mgc3BlY2lmaWMqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLXR5cGUtcmlnaHRcIj5cclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiaXRlbS1zbG90XCI+e3RoaXMucHJvcHMuaXRlbS5zbG90LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5wcm9wcy5pdGVtLnNsb3Quc2xpY2UoMSl9PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiaXRlbS1jbGFzcy1zcGVjaWZpYyBkMy1jb2xvci13aGl0ZVwiPnt0aGlzLnByb3BzLml0ZW0uY2xhc3NTcGVjaWZpY308L2xpPlxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHJcblx0XHRcdFx0XHR7LypSYXJpdHkgb2YgdGhlIGl0ZW0gYW5kL2lmIGl0IGlzIGFuY2llbnQqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLXR5cGVcIj5cclxuXHRcdFx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT17aXRlbVR5cGVDbGFzc30+e2l0ZW1UeXBlUHJlZml4fSB7dGhpcy5wcm9wcy5pdGVtLnR5cGV9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHJcblx0XHRcdFx0XHR7LypJZiB0aGUgaXRlbSBpcyBhcm1vciBvciB3ZWFwb24sIHRoZSBrZXkgaXMgZGVmaW5lZCBhbmQgd2UgbmVlZCBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSB0b29sdGlwKi99XHJcblx0XHRcdFx0XHR7c3ViSGVhZH1cclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIml0ZW0tYmVmb3JlLWVmZmVjdHNcIj48L2Rpdj5cclxuXHJcblx0XHRcdFx0XHR7LypBY3R1YWwgaXRlbSBzdGF0cyovfVxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tZWZmZWN0c1wiPlxyXG5cdFx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJpdGVtLXByb3BlcnR5LWNhdGVnb3J5XCI+UHJpbWFyeTwvcD5cclxuXHRcdFx0XHRcdFx0e3ByaW1hcmllc31cclxuXHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwiaXRlbS1wcm9wZXJ0eS1jYXRlZ29yeVwiPlNlY29uZGFyeTwvcD5cclxuXHRcdFx0XHRcdFx0e3NlY29uZGFyaWVzfVxyXG5cdFx0XHRcdFx0XHR7c29ja2V0c31cclxuXHRcdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHRmdW5jdGlvbiBmb3JFYWNoKHN0YXRPYmplY3QpIHtcclxuXHRcdHZhciByZXN1bHRzID0gW107XHJcblxyXG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhzdGF0T2JqZWN0KTtcclxuXHRcdHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArKykge1xyXG5cdFx0XHR2YXIgc3RhdCA9IGtleXNbaV07XHJcblx0XHRcdHZhciB2YWwgPSBzdGF0T2JqZWN0W3N0YXRdO1xyXG5cdFx0XHRyZXN1bHRzLnB1c2goPEQzSXRlbVRvb2x0aXBTdGF0IHN0YXQ9e3ZhbH0ga2V5PXtpfSAvPik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0cztcclxuXHR9XHJcblxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBCb2R5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEZsYXZvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1leHRlbnNpb24nPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmbGF2b3InPnt0aGlzLnByb3BzLmZsYXZvcn08L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBGbGF2b3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwSGVhZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vaW5pdGlhbCBjbGFzcyBzZXQgZm9yIHRoZSB0b29sdGlwIGhlYWRcclxuXHRcdHZhciBkaXZDbGFzcz0ndG9vbHRpcC1oZWFkJztcclxuXHRcdHZhciBoM0NsYXNzPScnO1xyXG5cclxuXHRcdC8vbW9kaWZ5IHRoZSBjbGFzc2VzIGlmIGEgY29sb3Igd2FzIHBhc3NlZFxyXG5cdFx0Ly9mYWxsYmFjayBjb2xvciBpcyBoYW5kbGVkIGJ5IGQzLXRvb2x0aXAgY3NzXHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmNvbG9yKSB7XHJcblx0XHRcdGRpdkNsYXNzICs9ICcgdG9vbHRpcC1oZWFkLScgKyB0aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHRcdGgzQ2xhc3MgKz0gJ2QzLWNvbG9yLScgKyB0aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHR9XHJcblx0XHQvL21ha2UgdGhlIGZvbnQgc21hbGxlciBpZiB0aGUgbmFtZSBpcyBsb25nXHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLm5hbWUubGVuZ3RoID4gNDApIHtcclxuXHRcdFx0aDNDbGFzcys9ICcgc21hbGxlc3QnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZih0aGlzLnByb3BzLml0ZW0ubmFtZS5sZW5ndGggPjIyKSB7XHJcblx0XHRcdGgzQ2xhc3MrPSAnIHNtYWxsZXInO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtkaXZDbGFzc30+XHJcblx0XHRcdFx0PGgzIGNsYXNzTmFtZT17aDNDbGFzc30+XHJcblx0XHRcdFx0XHR7dGhpcy5wcm9wcy5pdGVtLm5hbWV9XHJcblx0XHRcdFx0PC9oMz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwSGVhZDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBTdGF0PSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHRleHQgPSBbXTtcclxuXHRcdHZhciB0ZXh0S2V5ID0gMDtcclxuXHRcdC8vY2hlY2sgdG8gbWFrZSBzdXJlIHRlbXBsYXRlIG5lZWRzIHRvIGJlIHdvcmtlZCB3aXRoIFxyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLnN0YXQudGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dmFyIHRlbXBsYXRlID0gdGhpcy5wcm9wcy5zdGF0LnRleHQ7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZS5pbmRleE9mKCd7JykgIT09IC0xKSB7XHJcblxyXG5cdFx0XHRcdC8vZGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgaGlnaGxpZ2h0ZWQgaXRlbXMgdGhlIHRvb2x0aXAgd2lsbCBoYXZlXHJcblx0XHRcdFx0dmFyIHBvc2l0aW9uID0gdGVtcGxhdGUuaW5kZXhPZigneycpO1xyXG5cdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0d2hpbGUgKHBvc2l0aW9uICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0Y291bnQrK1xyXG5cdFx0XHRcdFx0cG9zaXRpb24gPSB0ZW1wbGF0ZS5pbmRleE9mKCd7JywgcG9zaXRpb24rMSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgc3RhcnRQb3MgPSAwO1xyXG5cdFx0XHRcdHZhciBlbmRQb3MgPSAwO1xyXG5cdFx0XHRcdC8vbG9vcCB0aHJvdWdoIHRoaXMgY291bnQgb2YgdGVtcGxhdGluZ1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPTA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgc3RhcnRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ3snLHN0YXJ0UG9zKSsxO1xyXG5cdFx0XHRcdFx0c3RhcnRQb3MgPSBzdGFydEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZEluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZignfScsZW5kUG9zKTtcclxuXHRcdFx0XHRcdGVuZFBvcyA9IGVuZEluZGV4KzE7XHJcblx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2Uoc3RhcnRJbmRleCxlbmRJbmRleCk7XHJcblxyXG5cdFx0XHRcdFx0Ly9jaGVjayBmb3IgYW55IHJlcGxhY2VtZW50IG5lZWRlZFxyXG5cdFx0XHRcdFx0aWYgKHNsaWNlZC5pbmRleE9mKCckJykgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuc3RhdC52YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRzbGljZWQgPSBzbGljZWQucmVwbGFjZSgnJCcsIHRoaXMucHJvcHMuc3RhdC52YWx1ZVtpXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0c2xpY2VkID0gc2xpY2VkLnJlcGxhY2UoJyQnLHRoaXMucHJvcHMuc3RhdC52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvL2lmIHdlIGFyZSBhdCB0aGUgZmlyc3QgbG9vcCwgYWRkIGFueXRoaW5nIGZpcnN0IGFzIHRleHRcclxuXHRcdFx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaCh0ZW1wbGF0ZS5zcGxpdCgneycpWzBdKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvL2NyZWF0ZSBhbmQgcHVzaCB0aGUgdmFsdWUgaGlnaGxpZ2h0ZWQgZWxlbWVudFxyXG5cdFx0XHRcdFx0dmFyIGVsZW1lbnQgPSA8c3BhbiBjbGFzc05hbWU9J3ZhbHVlJyBrZXk9e3RleHRLZXl9PntzbGljZWR9PC9zcGFuPjtcclxuXHRcdFx0XHRcdHRleHRLZXkrKztcclxuXHRcdFx0XHRcdHRleHQucHVzaChlbGVtZW50KTtcclxuXHJcblx0XHRcdFx0XHQvL2lmIG5vdCB0aGUgbGFzdCBsb29wLCBwdXNoIGFueXRoaW5nIHVudGlsIG5leHQgYnJhY2tldFxyXG5cdFx0XHRcdFx0aWYgKGNvdW50ICE9PSAxICYmIGkgPCBjb3VudCAtIDEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG5leHRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ3snLCBzdGFydFBvcyk7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCBuZXh0SW5kZXgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYoY291bnQgPT09IDEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHNsaWNlZCA9IHRlbXBsYXRlLnNsaWNlKGVuZEluZGV4KzEsIHRlbXBsYXRlLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaChzbGljZWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9sYXN0IGxvb3AgcHVzaCB0byB0aGUgZW5kXHJcblx0XHRcdFx0XHRlbHNlIGlmKGkgPT09IGNvdW50LTEgJiYgY291bnQgPiAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCB0ZW1wbGF0ZS5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9ubyB0ZW1wbGF0ZSBhbmQgd2UganVzdCB0aHJvdyBhZmZpeCB1cFxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0ZXh0LnB1c2godGhpcy5wcm9wcy5zdGF0LnRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9kZXRlcm1pbmUgY29sb3Igb2YgYWZmaXggdGV4dFxyXG5cdFx0dmFyIHRleHRDb2xvciA9ICdkMy1pdGVtLXByb3BlcnR5LWRlZmF1bHQnO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc3RhdC5oYXNPd25Qcm9wZXJ0eSgndHlwZScpICYmIHRoaXMucHJvcHMuc3RhdC50eXBlID09PSAnbGVnZW5kYXJ5Jykge1xyXG5cdFx0XHR0ZXh0Q29sb3IgKz0gJyBkMy1jb2xvci1vcmFuZ2UnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRleHRDb2xvciArPSAnIGQzLWNvbG9yLWJsdWUnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblxyXG5cdFx0XHQ8bGkgY2xhc3NOYW1lPXt0ZXh0Q29sb3J9PlxyXG5cdFx0XHRcdDxwPnt0ZXh0fTwvcD5cclxuXHRcdFx0PC9saT5cclxuXHJcblx0XHQpO1xyXG5cclxuXHR9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcFN0YXQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwV2VhcG9uPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tYXJtb3Itd2VhcG9uIGl0ZW0td2VhcG9uLWRwc1wiPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJiaWdcIj48c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLndlYXBvbi5kcHN9PC9zcGFuPjwvbGk+XHJcblx0XHRcdFx0PGxpPkRhbWFnZSBQZXIgU2Vjb25kPC9saT5cclxuXHRcdFx0PC91bD5cclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tYXJtb3Itd2VhcG9uIGl0ZW0td2VhcG9uIGRhbWFnZVwiPlxyXG5cdFx0XHRcdDxsaT5cclxuXHRcdFx0XHRcdDxwPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLndlYXBvbi5taW59PC9zcGFuPiAtXHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+IHt0aGlzLnByb3BzLndlYXBvbi5tYXh9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJkMy1jb2xvci1GRjg4ODg4OFwiPiBEYW1hZ2U8L3NwYW4+XHJcblx0XHRcdFx0XHQ8L3A+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHQ8bGk+XHJcblx0XHRcdFx0XHQ8cD5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy53ZWFwb24uc3BlZWR9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJkMy1jb2xvci1GRjg4ODg4OFwiPiBBdHRhY2tzIHBlciBTZWNvbmQ8L3NwYW4+XHJcblx0XHRcdFx0XHQ8L3A+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0PC91bD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcFdlYXBvbjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBIZWFkID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWhlYWQuanN4Jyk7XHJcbnZhciBEM0l0ZW1Ub29sdGlwQm9keSA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC1ib2R5LmpzeCcpO1xyXG52YXIgRDNJdGVtVG9vbHRpcEZsYXZvciA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC1mbGF2b3IuanN4Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvb2x0aXBDbGFzcyA9J2QzLXRvb2x0aXAgZDMtdG9vbHRpcC1pdGVtJztcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0ucmFyaXR5ID09PSAnYW5jaWVudCcpIHtcclxuXHRcdFx0dG9vbHRpcENsYXNzKz0nIGFuY2llbnQnXHJcblx0XHR9XHJcblxyXG5cdFx0Ly9kZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gYWRkIGZsYXZvclxyXG5cdFx0dmFyIGZsYXZvcjtcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0uaGFzT3duUHJvcGVydHkoJ2ZsYXZvcicpKSB7XHJcblx0XHRcdGZsYXZvciA9IDxEM0l0ZW1Ub29sdGlwRmxhdm9yIGZsYXZvcj17dGhpcy5wcm9wcy5pdGVtLmZsYXZvcn0gLz5cclxuXHRcdH1cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSd0b29sdGlwLWNvbnRlbnQnPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0b29sdGlwQ2xhc3N9PlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXBIZWFkIGl0ZW09e3RoaXMucHJvcHMuaXRlbX0gLz5cclxuXHRcdFx0XHRcdDxEM0l0ZW1Ub29sdGlwQm9keSBpdGVtPXt0aGlzLnByb3BzLml0ZW19IC8+XHJcblx0XHRcdFx0XHR7Zmxhdm9yfVxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXA7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTdG9yZSA9IHJlcXVpcmUoJy4uLy4uL3N0b3Jlcy9JbnZlbnRvcnlTdG9yZScpO1xyXG5cclxudmFyIEl0ZW1MZWZ0ID0gcmVxdWlyZSgnLi9pdGVtLWxlZnQuanN4Jyk7XHJcbnZhciBJdGVtUmlnaHQgPSByZXF1aXJlKCcuL2l0ZW0tcmlnaHQuanN4Jyk7XHJcbnZhciBEM0l0ZW1Ub29sdGlwID0gcmVxdWlyZSgnLi4vZDMtdG9vbHRpcC9kMy10b29sdGlwLmpzeCcpO1xyXG5cclxudmFyIEluZGl2aWR1YWxJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gSW52ZW50b3J5U3RvcmUuZ2V0SXRlbSgpO1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdF9vbkNoYW5nZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoSW52ZW50b3J5U3RvcmUuZ2V0SXRlbSgpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly9vbmx5IHNob3cgdG9vbHRpcHMvYnV0dG9ucyBpZiB0aGV5IGFyZSBuZWVkZWRcclxuXHRcdHZhciB0b29sdGlwO1xyXG5cdFx0dmFyIGhpZGRlbkJ1dHRvbnMgPSAnaGlkZGVuJztcclxuXHRcdGlmICh0eXBlb2YgdGhpcy5zdGF0ZS5pdGVtICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR0b29sdGlwID0gPGRpdiBjbGFzc05hbWU9J3Rvb2x0aXAtY29udGFpbmVyJz48RDNJdGVtVG9vbHRpcCBpdGVtPXt0aGlzLnN0YXRlLml0ZW19Lz48L2Rpdj47XHJcblx0XHRcdGhpZGRlbkJ1dHRvbnMgPSAnJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbC14cy0xMiB0b29sdGlwLW92ZXJmbG93Jz5cclxuXHRcdFx0XHRcdFx0PEl0ZW1MZWZ0IGhpZGVDbGFzcz17aGlkZGVuQnV0dG9uc30gLz5cclxuXHRcdFx0XHRcdFx0e3Rvb2x0aXB9XHJcblx0XHRcdFx0XHRcdDxJdGVtUmlnaHQgaGlkZUNsYXNzPXtoaWRkZW5CdXR0b25zfSAvPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbmRpdmlkdWFsSXRlbTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG5cclxudmFyIEl0ZW1MZWZ0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRfaGFuZGxlQ2xpY2s6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbiBzaGlmdCBsZWZ0JztcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5oaWRlQ2xhc3N9PlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMjMuMTIgMTEuMTJMMjEgOWwtOSA5IDkgOSAyLjEyLTIuMTJMMTYuMjQgMTh6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJdGVtTGVmdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEl0ZW1SaWdodCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24gc2hpZnQgcmlnaHQnO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmhpZGVDbGFzc30+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLl9oYW5kbGVDbGlja30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMzZcIiBoZWlnaHQ9XCIzNlwiIHZpZXdCb3g9XCIwIDAgMzYgMzZcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0xNSA5bC0yLjEyIDIuMTJMMTkuNzYgMThsLTYuODggNi44OEwxNSAyN2w5LTl6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJdGVtUmlnaHQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTbG90ID0gcmVxdWlyZSgnLi9pbnZlbnRvcnktc2xvdC5qc3gnKTtcclxudmFyIFByZXZpb3VzSW52ZW50b3J5ID0gcmVxdWlyZSgnLi9wcmV2aW91cy1pbnZlbnRvcnkuanN4Jyk7XHJcbnZhciBOZXh0SW52ZW50b3J5ID0gcmVxdWlyZSgnLi9uZXh0LWludmVudG9yeS5qc3gnKTtcclxuXHJcblxyXG52YXIgSW52ZW50b3J5Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgaW52ZW50b3J5U2xvdHMgPSBbXTtcclxuXHRcdHZhciBrZXk9MDtcclxuXHJcblx0XHQvL2xvb3AgdGhyb3VnaCB0aGUgMTAgY29sdW1ucyBvZiBpbnZlbnRvcnlcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG5cdFx0XHR2YXIgY29sdW1uTGVuZ3RoID0gdGhpcy5wcm9wcy5pbnZlbnRvcnlbaV0ubGVuZ3RoO1xyXG5cclxuXHRcdFx0Ly9hIGNoZWNrIGZvciB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoaXMgY29sdW1uXHJcblx0XHRcdHZhciBoZWlnaHRDb3VudCA9IDA7XHJcblxyXG5cdFx0XHQvL2FkZCBhbGwgZXhpc3RpbmcgaXRlbXMgdG8gdGhlIGNvbHVtbnNcclxuXHRcdFx0Zm9yICh2YXIgaj0wOyBqIDwgY29sdW1uTGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5pbnZlbnRvcnlbaV1bal0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHRoZWlnaHRDb3VudCArPSB0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXS5zaXplO1xyXG5cdFx0XHRcdFx0aW52ZW50b3J5U2xvdHMucHVzaCg8SW52ZW50b3J5U2xvdCBkYXRhPXt0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXX0ga2V5PXtrZXl9IGNvbHVtbj17aX0vPilcclxuXHRcdFx0XHRcdGtleSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9ub3cgZmlsbCBpbiB0aGUgcmVzdCBvZiB0aGUgY29sdW1uIHdpdGggYmxhbmsgc3BhY2VzXHJcblx0XHRcdHdoaWxlKGhlaWdodENvdW50IDwgNikge1xyXG5cdFx0XHRcdGhlaWdodENvdW50Kys7XHJcblx0XHRcdFx0aW52ZW50b3J5U2xvdHMucHVzaCg8SW52ZW50b3J5U2xvdCBkYXRhPXt1bmRlZmluZWR9IGtleT17a2V5fSBjb2x1bW49e2l9Lz4pO1xyXG5cdFx0XHRcdGtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktY29udGFpbmVyJz5cclxuXHRcdFx0XHQ8UHJldmlvdXNJbnZlbnRvcnkgaGFzUHJldmlvdXM9e3RoaXMucHJvcHMuaGFzUHJldmlvdXN9Lz5cclxuXHRcdFx0XHR7aW52ZW50b3J5U2xvdHN9XHJcblx0XHRcdFx0PE5leHRJbnZlbnRvcnkgaGFzTmV4dD17dGhpcy5wcm9wcy5oYXNOZXh0fS8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnlDb250YWluZXIiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXAgPSByZXF1aXJlKCcuLi9kMy10b29sdGlwL2QzLXRvb2x0aXAuanN4Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5U2xvdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0VG9vbHRpcE9mZnNldCgpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRUb29sdGlwT2Zmc2V0KCk7XHJcblx0fSxcclxuXHJcblx0c2V0VG9vbHRpcE9mZnNldDpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBlbGVtID0gUmVhY3QuZmluZERPTU5vZGUodGhpcyk7XHJcblxyXG5cdFx0Ly9pZiB0aGUgaW52ZW50b3J5IHNsb3QgaGFzIGNoaWxkcmVuIChjb250ZW50KVxyXG5cdFx0aWYgKGVsZW0uY2hpbGRyZW4gJiYgZWxlbS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHZhciBlbGVtTG9jYXRpb24gPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuXHRcdFx0dmFyIHRvb2x0aXBIZWlnaHQgPSBlbGVtLmNoaWxkcmVuWzRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuXHRcdFx0dmFyIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0XHRcdC8vY2hlY2sgaWYgdGhlIHRvb2x0aXAgZml0cyB3aGVyZSBpdCBjdXJyZW50bHkgaXNcclxuXHRcdFx0aWYgKCEodG9vbHRpcEhlaWdodCArIGVsZW1Mb2NhdGlvbiA8IHdpbmRvd0hlaWdodCkpIHtcclxuXHRcdFx0XHR2YXIgb2Zmc2V0ID0gKHRvb2x0aXBIZWlnaHQgKyBlbGVtTG9jYXRpb24gLSB3aW5kb3dIZWlnaHQpO1xyXG5cclxuXHRcdFx0XHQvL2lmIHRoZSB0b29sdGlwIGlzIGJpZ2dlciB0aGFuIHdpbmRvdywganVzdCBzaG93IGF0IHRvcCBvZiB3aW5kb3dcclxuXHRcdFx0XHRpZiAob2Zmc2V0ID4gd2luZG93SGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRlbGVtLmNoaWxkcmVuWzRdLnN0eWxlLnRvcCA9ICctJysoZWxlbUxvY2F0aW9uLTIwKSsncHgnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vanVzdCBtb3ZlIGl0IHVwIGEgbGl0dGxlIHdpdGggYSBiaXQgYXQgYm90dG9tXHJcblx0XHRcdFx0XHRlbGVtLmNoaWxkcmVuWzRdLnN0eWxlLnRvcCA9ICctJysob2Zmc2V0KzEwKSsncHgnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNsb3RDb250ZW50PSBbXTtcclxuXHRcdHZhciBzbG90Q29udGVudEtleSA9IDA7XHJcblxyXG5cdFx0dmFyIHNsb3RDbGFzcz0naW52ZW50b3J5LXNsb3QnO1xyXG5cdFx0Ly9jaGVjayB0byBtYWtlIHN1cmUgYW4gYWN0dWFsIGl0ZW0gaXMgaW4gdGhlIGludmVudG9yeSBzbG90XHJcblx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMuZGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly9jaGFuZ2UgdGhlIHNpemUgdG8gbGFyZ2UgaWYgaXQgaXMgYSBsYXJnZSBpdGVtXHJcblx0XHRcdGlmKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnc2l6ZScpICYmIHRoaXMucHJvcHMuZGF0YS5zaXplID09PSAyKSB7XHJcblx0XHRcdFx0c2xvdENsYXNzICs9ICcgbGFyZ2UnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZih0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3Jhcml0eScpKSB7XHJcblx0XHRcdFx0dmFyIGJndXJsO1xyXG5cdFx0XHRcdHZhciBib3JkZXJDb2xvcj0nIzMwMmEyMSc7XHJcblxyXG5cdFx0XHRcdHN3aXRjaCh0aGlzLnByb3BzLmRhdGEucmFyaXR5KSB7XHJcblx0XHRcdFx0XHRjYXNlICdtYWdpYyc6XHJcblx0XHRcdFx0XHRcdGJndXJsPSdpbWcvYmx1ZS5wbmcnO1xyXG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcj0nIzc5NzlkNCc7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAncmFyZSc6XHJcblx0XHRcdFx0XHRcdGJndXJsPSdpbWcveWVsbG93LnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjZjhjYzM1JztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdsZWdlbmRhcnknOlxyXG5cdFx0XHRcdFx0XHRiZ3VybD0naW1nL29yYW5nZS5wbmcnO1xyXG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcj0nI2JmNjQyZic7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnYW5jaWVudCc6XHJcblx0XHRcdFx0XHRcdGJndXJsPSdpbWcvb3JhbmdlLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjYmY2NDJmJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHQvL25vb3BcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vc3dpdGNoIGJnIHRvIGdyZWVuIGlmIGl0ZW0gaXMgcGFydCBvZiBhIHNldFxyXG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3NldCcpKSB7XHJcblx0XHRcdFx0XHRiZ3VybD0naW1nL2dyZWVuLnBuZyc7XHJcblx0XHRcdFx0XHRib3JkZXJDb2xvcj0nIzhiZDQ0Mic7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIGJndXJsICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0dmFyIGlubGluZSA9IHtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOid1cmwoJytiZ3VybCsnKSdcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRzbG90Q29udGVudC5wdXNoKDxkaXYgc3R5bGU9e2lubGluZX0gY2xhc3NOYW1lPSdpbnZlbnRvcnktYmcnIGtleT17c2xvdENvbnRlbnRLZXl9PjwvZGl2PilcclxuXHRcdFx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3NldCB0aGUgaXRlbSBpbWFnZVxyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdpbWFnZScpKSB7XHJcblx0XHRcdFx0dmFyIGlubGluZSA9IHtiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK3RoaXMucHJvcHMuZGF0YS5pbWFnZSsnKSd9O1xyXG5cdFx0XHRcdHNsb3RDb250ZW50LnB1c2goPGRpdiBzdHlsZT17aW5saW5lfSBjbGFzc05hbWU9J2ludmVudG9yeS1pbWFnZScga2V5PXtzbG90Q29udGVudEtleX0+PC9kaXY+KTtcclxuXHRcdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL2FkZCBhIGxpbmsgdG8gYWN0aXZhdGUgdG9vbHRpcFxyXG5cdFx0XHRzbG90Q29udGVudC5wdXNoKDxhIGNsYXNzTmFtZT0ndG9vbHRpcC1saW5rJyBrZXk9e3Nsb3RDb250ZW50S2V5fT48L2E+KTtcclxuXHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHJcblx0XHRcdC8vYWRkIGEgZ3JhZGllbnQgbWFza1xyXG5cdFx0XHRzbG90Q29udGVudC5wdXNoKDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktaXRlbS1ncmFkaWVudCcga2V5PXtzbG90Q29udGVudEtleX0+PC9kaXY+KTtcclxuXHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHJcblx0XHRcdC8vYWRkIGEgaGlkZGVuIHRvb2x0aXBcclxuXHRcdFx0dmFyIGlubGluZTtcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuY29sdW1uIDwgNSkge1xyXG5cdFx0XHRcdGlubGluZSA9IHtsZWZ0Oic1MHB4J307XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aW5saW5lID0ge3JpZ2h0Oic1MHB4J307XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNsb3RDb250ZW50LnB1c2goXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3Rvb2x0aXAtY29udGFpbmVyJyBzdHlsZT17aW5saW5lfSBrZXk9e3Nsb3RDb250ZW50S2V5fT5cclxuXHRcdFx0XHRcdDxEM0l0ZW1Ub29sdGlwIGl0ZW09e3RoaXMucHJvcHMuZGF0YX0vPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQpO1xyXG5cdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cclxuXHRcdFx0Ly9hZGQgc29ja2V0cyBvbiBob3ZlclxyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdwcmltYXJpZXMnKSAmJiB0aGlzLnByb3BzLmRhdGEucHJpbWFyaWVzLmhhc093blByb3BlcnR5KCdTb2NrZXQnKSkge1xyXG5cdFx0XHRcdHZhciBzb2NrZXRzO1xyXG5cdFx0XHRcdHZhciBzb2NrZXRDb3VudCA9IHRoaXMucHJvcHMuZGF0YS5wcmltYXJpZXMuU29ja2V0LnZhbHVlO1xyXG5cdFx0XHRcdHZhciBzb2NrZXRDb250ZW50cyA9IFtdO1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPTA7IGkgPCBzb2NrZXRDb3VudDsgaSsrKSB7XHJcblx0XHRcdFx0XHRzb2NrZXRDb250ZW50cy5wdXNoKDxkaXYgY2xhc3NOYW1lPSdzb2NrZXQnIGtleT17aX0+PC9kaXY+KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c29ja2V0cyA9IDxkaXYgY2xhc3NOYW1lPSdzb2NrZXRzLXdyYXBwZXInIGtleT17c2xvdENvbnRlbnRLZXl9PjxkaXYgY2xhc3NOYW1lPSdzb2NrZXRzLWFsaWduJz57c29ja2V0Q29udGVudHN9PC9kaXY+PC9kaXY+O1xyXG5cdFx0XHRcdHNsb3RDb250ZW50LnB1c2goc29ja2V0cyk7XHJcblx0XHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17c2xvdENsYXNzfSBzdHlsZT17e2JvcmRlckNvbG9yOmJvcmRlckNvbG9yfX0+XHJcblx0XHRcdFx0e3Nsb3RDb250ZW50fVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5U2xvdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEludmVudG9yeUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vaW52ZW50b3J5LWNvbnRhaW5lci5qc3gnKTtcclxudmFyIEludmVudG9yeVN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0ludmVudG9yeVN0b3JlJyk7XHJcblxyXG52YXIgSW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gSW52ZW50b3J5U3RvcmUuZ2V0SW52ZW50b3J5KCk7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShJbnZlbnRvcnlTdG9yZS5nZXRJbnZlbnRvcnkoKSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1zZWN0aW9uJz5cclxuXHRcdFx0XHQ8SW52ZW50b3J5Q29udGFpbmVyIFxyXG5cdFx0XHRcdFx0aW52ZW50b3J5PXt0aGlzLnN0YXRlLmN1cnJlbnRJbnZlbnRvcnl9IFxyXG5cdFx0XHRcdFx0aGFzUHJldmlvdXM9e3R5cGVvZiB0aGlzLnN0YXRlLnByZXZpb3VzSW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJ30gXHJcblx0XHRcdFx0XHRoYXNOZXh0PXt0eXBlb2YgdGhpcy5zdGF0ZS5uZXh0SW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJ31cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgTmV4dEludmVudG9yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRfaGFuZGxlQ2xpY2s6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBBY3Rpb25zLm5leHRJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24nO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc05leHQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWJ1dHRvbi1jb250YWluZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMTUgOWwtMi4xMiAyLjEyTDE5Ljc2IDE4bC02Ljg4IDYuODhMMTUgMjdsOS05elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV4dEludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG5cclxudmFyIFByZXZpb3VzSW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMucHJldmlvdXNJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24nO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc1ByZXZpb3VzKSB7XHJcblx0XHRcdGJ1dHRvbkNsYXNzKz0gJyBkaXNhYmxlZCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1idXR0b24tY29udGFpbmVyJz5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuX2hhbmRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIzNlwiIGhlaWdodD1cIjM2XCIgdmlld0JveD1cIjAgMCAzNiAzNlwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTIzLjEyIDExLjEyTDIxIDlsLTkgOSA5IDkgMi4xMi0yLjEyTDE2LjI0IDE4elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJldmlvdXNJbnZlbnRvcnk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHQvL3N0YXRlIGlzIGhhbmRsZWQgaW4gdGhlIHBhcmVudCBjb21wb25lbnRcclxuXHQvL3RoaXMgZnVuY3Rpb24gaXMgdXAgdGhlcmVcclxuXHRoYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlQ2xhc3ModGhpcy5wcm9wcy5uYW1lKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNob3J0ZW5lZE5hbWVzID0ge1xyXG5cdFx0XHRCYXJiYXJpYW46J2JhcmInLFxyXG5cdFx0XHRDcnVzYWRlcjonY3J1cycsXHJcblx0XHRcdCdEZW1vbiBIdW50ZXInOidkaCcsXHJcblx0XHRcdE1vbms6J21vbmsnLFxyXG5cdFx0XHQnV2l0Y2ggRG9jdG9yJzond2QnLFxyXG5cdFx0XHRXaXphcmQ6J3dpeidcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnY2xhc3Mtc2VsZWN0b3InO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJ1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbWFnZUNsYXNzPSB0aGlzLnByb3BzLm5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcgJywnJyk7XHJcblx0XHRpbWFnZUNsYXNzKz0gdGhpcy5wcm9wcy5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8bGk+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtpbWFnZUNsYXNzfT48L2Rpdj5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLm5hbWUudG9Mb3dlckNhc2UoKX08L3NwYW4+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJzaG9ydGVuZWRcIj57c2hvcnRlbmVkTmFtZXNbdGhpcy5wcm9wcy5uYW1lXX08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvbGk+XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yQnV0dG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBDbGFzc1NlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9jbGFzcy1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRDbGFzc2VzID0gWydCYXJiYXJpYW4nLCdDcnVzYWRlcicsJ0RlbW9uIEh1bnRlcicsJ01vbmsnLCdXaXRjaCBEb2N0b3InLCdXaXphcmQnXTtcclxuXHRcdHZhciBkQ2xhc3Nlc0xlbmd0aCA9IGRDbGFzc2VzLmxlbmd0aDtcclxuXHJcblx0XHR2YXIgY2xhc3NTZWxlY3RvcnMgPSBbXTtcclxuXHRcdGZvciAodmFyIGkgPTA7IGkgPCBkQ2xhc3Nlc0xlbmd0aDtpKyspIHtcclxuXHJcblx0XHRcdC8vY2hlY2sgZm9yIHNlbGVjdGVkIGNsYXNzIHN0b3JlZCBpbiBzdGF0ZSBvZiB0aGlzIGNvbXBvbmVudFxyXG5cdFx0XHR2YXIgc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09IGRDbGFzc2VzW2ldKSB7XHJcblx0XHRcdFx0c2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3B1dCBzZWxlY3RvcnMgaW4gYXJyYXkgdG8gYmUgcmVuZGVyZWRcclxuXHRcdFx0Y2xhc3NTZWxlY3RvcnMucHVzaChcclxuXHRcdFx0XHQ8Q2xhc3NTZWxlY3RvckJ1dHRvbiBcclxuXHRcdFx0XHRcdG5hbWU9e2RDbGFzc2VzW2ldfSBcclxuXHRcdFx0XHRcdGNoYW5nZUNsYXNzPXt0aGlzLnByb3BzLmNoYW5nZUNsYXNzfSBcclxuXHRcdFx0XHRcdGtleT17aX0gXHJcblx0XHRcdFx0XHRzZWxlY3RlZD17c2VsZWN0ZWR9XHJcblx0XHRcdFx0XHRnZW5kZXI9e3RoaXMucHJvcHMuZ2VuZGVyfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8dWwgY2xhc3NOYW1lPSdjbGFzcy1zZWxlY3Rvcic+XHJcblx0XHRcdFx0XHR7Y2xhc3NTZWxlY3RvcnN9XHJcblx0XHRcdFx0PC91bD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHVwZGF0ZUdlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlR2VuZGVyKHRoaXMucHJvcHMuZ2VuZGVyKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzPSdnZW5kZXItc2VsZWN0b3IgJyt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYnV0dG9uLXdyYXBwZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy51cGRhdGVHZW5kZXJ9ID5cclxuXHRcdFx0XHRcdDxkaXY+PC9kaXY+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5nZW5kZXIudG9Mb3dlckNhc2UoKX08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5kZXJTZWxlY3RvckJ1dHRvbjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9nZW5kZXItc2VsZWN0b3ItYnV0dG9uLmpzeCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWFsZVNlbGVjdGVkID0gKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09ICdNYWxlJyk7XHJcblx0XHR2YXIgZmVtYWxlU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gJ0ZlbWFsZScpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdnZW5kZXItc2VsZWN0b3InPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvckJ1dHRvbiBnZW5kZXI9J01hbGUnIGNoYW5nZUdlbmRlcj17dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXttYWxlU2VsZWN0ZWR9IC8+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yQnV0dG9uIGdlbmRlcj0nRmVtYWxlJyBjaGFuZ2VHZW5kZXI9e3RoaXMucHJvcHMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17ZmVtYWxlU2VsZWN0ZWR9IC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5kZXJTZWxlY3RvcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEhhcmRjb3JlQ2hlY2tib3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0dXBkYXRlSGFyZGNvcmU6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlSGFyZGNvcmUoIXRoaXMucHJvcHMuaGFyZGNvcmUpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjaGVja2JveC13cmFwcGVyJz5cclxuXHRcdFx0XHQ8bGFiZWw+XHJcblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGNsYXNzTmFtZT0nb3B0aW9ucy1jaGVja2JveCcgY2hlY2tlZD17dGhpcy5wcm9wcy5oYXJkY29yZX0gb25DaGFuZ2U9e3RoaXMudXBkYXRlSGFyZGNvcmV9Lz5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nY2hlY2tib3gtbGFiZWwnPkhhcmRjb3JlIDxzcGFuIGNsYXNzTmFtZT0naGlkZGVuLXNtJz5IZXJvPC9zcGFuPjwvc3Bhbj5cclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFyZGNvcmVDaGVja2JveDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMuanMnKTtcclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0FwcFN0b3JlLmpzJyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IHJlcXVpcmUoJy4vY2xhc3Mtc2VsZWN0b3IuanN4Jyk7XHJcbnZhciBHZW5kZXJTZWxlY3RvciA9IHJlcXVpcmUoJy4vZ2VuZGVyLXNlbGVjdG9yLmpzeCcpO1xyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IHJlcXVpcmUoJy4vc2Vhc29uYWwtY2hlY2tib3guanN4Jyk7XHJcbnZhciBIYXJkY29yZUNoZWNrYm94ID0gcmVxdWlyZSgnLi9oYXJkY29yZS1jaGVja2JveC5qc3gnKTtcclxuXHJcbnZhciBPcHRpb25zUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpbml0aWFsID0gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHRcdGQzc2ltLnNldEthZGFsYShpbml0aWFsLmRDbGFzcyxpbml0aWFsLnNlYXNvbmFsLGluaXRpYWwuaGFyZGNvcmUpO1xyXG5cdFx0cmV0dXJuIGluaXRpYWw7XHJcblx0fSxcclxuXHJcblx0Y2hhbmdlR2VuZGVyOmZ1bmN0aW9uKGdlbmRlcikge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGdlbmRlcjpnZW5kZXJcclxuXHRcdH0pO1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdnZW5kZXInLGdlbmRlcik7XHJcblx0fSxcclxuXHRjaGFuZ2VDbGFzczpmdW5jdGlvbihkQ2xhc3MpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRkQ2xhc3M6ZENsYXNzXHJcblx0XHR9LGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRkM3NpbS5zZXRLYWRhbGEodGhpcy5zdGF0ZS5kQ2xhc3MsdGhpcy5zdGF0ZS5zZWFzb25hbCx0aGlzLnN0YXRlLmhhcmRjb3JlKTtcclxuXHRcdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdkQ2xhc3MnLGRDbGFzcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoYW5nZUhhcmRjb3JlOmZ1bmN0aW9uKGJvb2wpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRoYXJkY29yZTpib29sXHJcblx0XHR9LGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRkM3NpbS5zZXRLYWRhbGEodGhpcy5zdGF0ZS5kQ2xhc3MsdGhpcy5zdGF0ZS5zZWFzb25hbCx0aGlzLnN0YXRlLmhhcmRjb3JlKTtcclxuXHRcdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdoYXJkY29yZScsYm9vbCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoYW5nZVNlYXNvbmFsOmZ1bmN0aW9uKGJvb2wpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRzZWFzb25hbDpib29sXHJcblx0XHR9LGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRkM3NpbS5zZXRLYWRhbGEodGhpcy5zdGF0ZS5kQ2xhc3MsdGhpcy5zdGF0ZS5zZWFzb25hbCx0aGlzLnN0YXRlLmhhcmRjb3JlKTtcclxuXHRcdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdzZWFzb25hbCcsYm9vbCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c2VjdGlvbiBjbGFzc05hbWU9J29wdGlvbnMtcGFuZWwnIGlkPSdvcHRpb25zLXBhbmVsJz5cclxuXHRcdFx0XHQ8Q2xhc3NTZWxlY3RvciBjaGFuZ2VDbGFzcz17dGhpcy5jaGFuZ2VDbGFzc30gc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuZENsYXNzfSBnZW5kZXI9e3RoaXMuc3RhdGUuZ2VuZGVyfS8+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yIGNoYW5nZUdlbmRlcj17dGhpcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXt0aGlzLnN0YXRlLmdlbmRlcn0vPlxyXG5cdFx0XHRcdDxTZWFzb25hbENoZWNrYm94IHNlYXNvbmFsPXt0aGlzLnN0YXRlLnNlYXNvbmFsfSBjaGFuZ2VTZWFzb25hbD17dGhpcy5jaGFuZ2VTZWFzb25hbH0vPlxyXG5cdFx0XHRcdDxIYXJkY29yZUNoZWNrYm94IGhhcmRjb3JlPXt0aGlzLnN0YXRlLmhhcmRjb3JlfSBjaGFuZ2VIYXJkY29yZT17dGhpcy5jaGFuZ2VIYXJkY29yZX0vPlxyXG5cdFx0XHQ8L3NlY3Rpb24+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9wdGlvbnNQYW5lbDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIFNlYXNvbmFsQ2hlY2tib3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0dXBkYXRlU2Vhc29uYWw6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnByb3BzLmNoYW5nZVNlYXNvbmFsKCF0aGlzLnByb3BzLnNlYXNvbmFsKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2hlY2tib3gtd3JhcHBlcic+XHJcblx0XHRcdFx0PGxhYmVsPlxyXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzc05hbWU9J29wdGlvbnMtY2hlY2tib3gnIGNoZWNrZWQ9e3RoaXMucHJvcHMuc2Vhc29uYWx9IG9uQ2hhbmdlPXt0aGlzLnVwZGF0ZVNlYXNvbmFsfS8+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2NoZWNrYm94LWxhYmVsJz5TZWFzb25hbCA8c3BhbiBjbGFzc05hbWU9J2hpZGRlbi1zbSc+SGVybzwvc3Bhbj48L3NwYW4+XHJcblx0XHRcdFx0PC9sYWJlbD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXNvbmFsQ2hlY2tib3g7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIGQzc2ltID0gcmVxdWlyZSgnZDNzaW0nKTtcclxuXHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgS2FkYWxhSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtzaGFyZENvdW50OjB9O1xyXG5cdH0sXHJcblx0YnV5SXRlbTpmdW5jdGlvbigpIHtcclxuXHRcdC8vaW5jcmVtZW50IHRoZSBibG9vZCBzaGFyZCBjb3VudFxyXG5cdFx0dmFyIGN1cnJlbnRDb3VudCA9IHRoaXMuc3RhdGUuc2hhcmRDb3VudDtcclxuXHRcdGN1cnJlbnRDb3VudCArPSB0aGlzLnByb3BzLml0ZW0uY29zdDtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe3NoYXJkQ291bnQ6Y3VycmVudENvdW50fSk7XHJcblxyXG5cdFx0dmFyIGl0ZW0gPSBkM3NpbS5rYWRhbGFSb2xsKHRoaXMucHJvcHMuaXRlbS50eXBlKTtcclxuXHRcdGl0ZW0uc2l6ZSA9IHRoaXMucHJvcHMuaXRlbS5zaXplO1xyXG5cdFx0QXBwQWN0aW9ucy5hZGRJdGVtKGl0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdpdGVtJyx0aGlzLnByb3BzLml0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5pbmNyZW1lbnRTaGFyZHModGhpcy5wcm9wcy5pdGVtLnR5cGUsdGhpcy5wcm9wcy5pdGVtLmNvc3QpO1xyXG5cdH0sXHJcblx0cmVzZXRDb3VudDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe3NoYXJkQ291bnQ6MH0pO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgaWNvbkNsYXNzID0gJ2thZGFsYS1pY29uJztcclxuXHRcdGljb25DbGFzcys9JyAnK3RoaXMucHJvcHMuaXRlbS50eXBlO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdrYWRhbGEtaXRlbSc+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2thZGFsYScgb25DbGljaz17dGhpcy5idXlJdGVtfT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtpY29uQ2xhc3N9PjwvZGl2PlxyXG5cdFx0XHRcdFx0PHNwYW4+e3RoaXMucHJvcHMuaXRlbS5jb3N0fTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0na2FkYWxhLWNvbnRlbnQnPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdrYWRhbGEtaXRlbS10aXRsZSc+e3RoaXMucHJvcHMuaXRlbS50ZXh0fTwvc3Bhbj5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nc2hhcmQtY291bnQnPlxyXG5cdFx0XHRcdFx0XHR7dGhpcy5zdGF0ZS5zaGFyZENvdW50fVxyXG5cdFx0XHRcdFx0XHQ8YSBjbGFzc05hbWU9J3NoYXJkLWRlbGV0ZScgb25DbGljaz17dGhpcy5yZXNldENvdW50fT5cclxuXHRcdFx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHpcIi8+XHJcblx0XHRcdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0XHRcdDwvYT5cclxuXHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEthZGFsYUl0ZW07IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBLYWRhbGFJdGVtID0gcmVxdWlyZSgnLi9rYWRhbGEtaXRlbS5qc3gnKTtcclxuXHJcbnZhciBLYWRhbGFTdG9yZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGthZGFsYUNsYXNzID0gJ2thZGFsYS1zdG9yZSc7XHJcblx0XHQvL3RoaXMgaXMgYSBjaGVjayBmb3IgaW50ZXJuZXQgZXhwbG9yZXJcclxuXHRcdC8vZmxleC1kaXJlY3Rpb246Y29sdW1uIGJyZWFrcyBldmVyeXRoaW5nIHNvIHdlIGRldGVjdCBmb3IgaXQgaGVyZVxyXG5cdFx0aWYgKCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFICcpICE9PSAtMSl8fCFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9UcmlkZW50LipydlxcOjExXFwuLykpIHtcclxuXHRcdFx0a2FkYWxhQ2xhc3MrPScgbm9pZSdcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaXRlbXMgPSBbXHJcblx0XHRcdHt0eXBlOidoZWxtJyx0ZXh0OidNeXN0ZXJ5IEhlbG1ldCcsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonYm9vdHMnLHRleHQ6J015c3RlcnkgQm9vdHMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2JlbHQnLHRleHQ6J015c3RlcnkgQmVsdCcsY29zdDoyNSxzaXplOjF9LFxyXG5cdFx0XHR7dHlwZToncGFudHMnLHRleHQ6J015c3RlcnkgUGFudHMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2dsb3ZlcycsdGV4dDonTXlzdGVyeSBHbG92ZXMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2NoZXN0Jyx0ZXh0OidNeXN0ZXJ5IENoZXN0Jyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidzaG91bGRlcnMnLHRleHQ6J015c3RlcnkgU2hvdWxkZXJzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidicmFjZXJzJyx0ZXh0OidNeXN0ZXJ5IEJyYWNlcnMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3F1aXZlcicsdGV4dDonTXlzdGVyeSBRdWl2ZXInLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J21vam8nLHRleHQ6J015c3RlcnkgTW9qbycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonc291cmNlJyx0ZXh0OidNeXN0ZXJ5IFNvdXJjZScsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonc2hpZWxkJyx0ZXh0OidNeXN0ZXJ5IFNoaWVsZCcsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonb25laGFuZCcsdGV4dDonMS1IIE15c3RlcnkgV2VhcG9uJyxjb3N0Ojc1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOid0d29oYW5kJyx0ZXh0OicyLUggTXlzdGVyeSBXZWFwb24nLGNvc3Q6NzUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3JpbmcnLHRleHQ6J015c3RlcnkgUmluZycsY29zdDo1MCxzaXplOjF9LFxyXG5cdFx0XHR7dHlwZTonYW11bGV0Jyx0ZXh0OidNeXN0ZXJ5IEFtdWxldCcsY29zdDoxMDAsc2l6ZToxfVxyXG5cdFx0XVxyXG5cclxuXHRcdHZhciBrYWRhbGFTbG90cyA9IFtdO1xyXG5cdFx0dmFyIGl0ZW1zTGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xyXG5cdFx0Zm9yICh2YXIgaSA9MDsgaSA8IGl0ZW1zTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0a2FkYWxhU2xvdHMucHVzaCg8S2FkYWxhSXRlbSBrZXk9e2l9IGl0ZW09e2l0ZW1zW2ldfSAvPik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2thZGFsYUNsYXNzfSBpZD0na2FkYWxhLXN0b3JlJz5cclxuXHRcdFx0XHR7a2FkYWxhU2xvdHN9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLYWRhbGFTdG9yZTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMuanMnKTtcclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0FwcFN0b3JlLmpzJyk7XHJcblxyXG52YXIgTmF2YmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpdGVtID0gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKS5pdGVtO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0b3B0aW9uczpmYWxzZSxcclxuXHRcdFx0c3RvcmU6ZmFsc2UsXHJcblx0XHRcdGl0ZW06aXRlbVxyXG5cdFx0fTtcclxuXHR9LFxyXG5cdHRvZ2dsZU9wdGlvbnM6ZnVuY3Rpb24oKSB7XHJcblx0XHQvL3RvZ2dsZSB0aGUgb3B0aW9uIHBhbmVsIGFuZCB0aGUgc3RhdGVcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25zLXBhbmVsJykuc3R5bGUuZGlzcGxheSA9ICh0aGlzLnN0YXRlLm9wdGlvbnMpPyAnbm9uZSc6J2Jsb2NrJztcclxuXHRcdHRoaXMuc2V0U3RhdGUoe29wdGlvbnM6IXRoaXMuc3RhdGUub3B0aW9uc30pO1xyXG5cdH0sXHJcblx0dG9nZ2xlU3RvcmU6ZnVuY3Rpb24oKSB7XHJcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna2FkYWxhLXN0b3JlJykuc3R5bGUuZGlzcGxheSA9ICh0aGlzLnN0YXRlLnN0b3JlKT8gJ25vbmUnOidibG9jayc7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtzdG9yZTohdGhpcy5zdGF0ZS5zdG9yZX0pO1xyXG5cdH0sXHJcblx0YnV5SXRlbTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpdGVtID0gZDNzaW0ua2FkYWxhUm9sbCh0aGlzLnN0YXRlLml0ZW0udHlwZSk7XHJcblx0XHRpdGVtLnNpemUgPSB0aGlzLnN0YXRlLml0ZW0uc2l6ZTtcclxuXHRcdEFwcEFjdGlvbnMuYWRkSXRlbShpdGVtKTtcclxuXHRcdEFwcEFjdGlvbnMuaW5jcmVtZW50U2hhcmRzKHRoaXMuc3RhdGUuaXRlbS50eXBlLHRoaXMuc3RhdGUuaXRlbS5jb3N0KTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZFVwZGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdC8vaWYgd2UgYXJlIG9uIGEgbGFyZ2Ugc2NyZWVuIGFuZCBvcHRpb25zL3N0b3JlIGFyZSBub3QgdmlzaWJsZVxyXG5cdFx0Ly9tYWtlIHRoZW0gdmlzaWJsZVxyXG5cdFx0aWYgKCF0aGlzLnByb3BzLm1vYmlsZSAmJiAhKHRoaXMuc3RhdGUub3B0aW9ucyB8fCB0aGlzLnN0YXRlLnN0b3JlKSkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRvcHRpb25zOnRydWUsXHJcblx0XHRcdFx0c3RvcmU6dHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4oXHJcblx0XHRcdDxuYXY+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2hhbScgb25DbGljaz17dGhpcy50b2dnbGVPcHRpb25zfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTMgMThoMTh2LTJIM3Yyem0wLTVoMTh2LTJIM3Yyem0wLTd2MmgxOFY2SDN6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0PGgxPkthZGFsYSBTaW11bGF0b3I8L2gxPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdidXknIG9uQ2xpY2s9e3RoaXMuYnV5SXRlbX0+e3RoaXMuc3RhdGUuaXRlbS50ZXh0fTwvYnV0dG9uPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdzaG9wJyBvbkNsaWNrPXt0aGlzLnRvZ2dsZVN0b3JlfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTE2IDZWNGMwLTEuMTEtLjg5LTItMi0yaC00Yy0xLjExIDAtMiAuODktMiAydjJIMnYxM2MwIDEuMTEuODkgMiAyIDJoMTZjMS4xMSAwIDItLjg5IDItMlY2aC02em0tNi0yaDR2MmgtNFY0ek05IDE4VjlsNy41IDRMOSAxOHpcIi8+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9uYXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmJhcjsiLCJ2YXIga2V5TWlycm9yID0gcmVxdWlyZSgna2V5bWlycm9yJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XHJcblx0QUREX0lURU06bnVsbCxcclxuXHJcblx0UFJFVl9JTlY6bnVsbCxcclxuXHRORVhUX0lOVjpudWxsLFxyXG5cclxuXHRQUkVWX0lURU06bnVsbCxcclxuXHRORVhUX0lURU06bnVsbCxcclxuXHJcblx0Q0hBTkdFX1NFVFRJTkc6bnVsbCxcclxuXHRJTkNSRU1FTlRfU0hBUkRTOm51bGxcclxufSk7IiwidmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTsiLCJ2YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xyXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xyXG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xyXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xyXG5cclxudmFyIENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xyXG5cclxudmFyIGFwcFNldHRpbmdzID0ge307XHJcbnZhciBkZWZhdWx0cyA9IHtcclxuXHRkQ2xhc3M6J0JhcmJhcmlhbicsXHJcblx0Z2VuZGVyOidGZW1hbGUnLFxyXG5cdGhhcmRjb3JlOmZhbHNlLFxyXG5cdHNlYXNvbmFsOnRydWUsXHJcblx0aXRlbTp7XCJ0eXBlXCI6XCJoZWxtXCIsXCJ0ZXh0XCI6XCJNeXN0ZXJ5IEhlbG1ldFwiLFwiY29zdFwiOjI1LFwic2l6ZVwiOjJ9XHJcbn07XHJcbnZhciBzaGFyZHNTcGVudCA9IHt9O1xyXG5cclxudmFyIHN0b3JhZ2VTdXBwb3J0ZWQ7XHJcblxyXG4vL0RldGVybWluZSB3aGV0aGVyIG9yIG5vdCBsb2NhbCBzdG9yYWdlIGlzIHN1cHBvcnRlZFxyXG4vL2Zyb20gZ2l0aHViLmNvbS9hZ3J1Ymxldi9hbmd1bGFyTG9jYWxTdG9yYWdlXHJcbi8vTUlUIExpY2VuY2VcclxuZnVuY3Rpb24gbG9jYWxTdG9yYWdlQ2hlY2soKSB7XHJcblx0dmFyIHN0b3JhZ2UgPSAodHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSA/IHVuZGVmaW5lZCA6IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcblx0c3VwcG9ydGVkID0gKHR5cGVvZiBzdG9yYWdlICE9PSAndW5kZWZpbmVkJyk7XHJcblx0aWYgKHN1cHBvcnRlZCkge1xyXG5cdFx0dmFyIHRlc3RLZXkgPSAnX18nICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWU3KTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRlc3RLZXksIHRlc3RLZXkpO1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0ZXN0S2V5KTtcclxuXHRcdH1cclxuXHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0c3VwcG9ydGVkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdHN0b3JhZ2VTdXBwb3J0ZWQgPSBzdXBwb3J0ZWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNldHRpbmdzKCkge1xyXG5cdHJldHVybiBhcHBTZXR0aW5ncztcclxufVxyXG5cclxuZnVuY3Rpb24gY2hhbmdlU2V0dGluZyhrZXksdmFsKSB7XHJcblx0YXBwU2V0dGluZ3Nba2V5XSA9IHZhbDtcclxuXHRzYXZlU2V0dGluZ3MoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZVNldHRpbmdzKCkge1xyXG5cdGlmIChzdG9yYWdlU3VwcG9ydGVkKSB7XHJcblx0XHRsb2NhbFN0b3JhZ2Uua2FkYWxhU2V0dGluZ3MgPSBKU09OLnN0cmluZ2lmeShhcHBTZXR0aW5ncyk7XHJcblx0XHRsb2NhbFN0b3JhZ2Uua2FkYWxhU3BlbnQgPSBKU09OLnN0cmluZ2lmeShzaGFyZHNTcGVudCk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbmNyZW1lbnRTaGFyZHMoa2V5LHZhbCkge1xyXG5cdGlmICh0eXBlb2Ygc2hhcmRzU3BlbnRba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHNoYXJkc1NwZW50W2tleV0rPXZhbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzaGFyZHNTcGVudFtrZXldID0gdmFsO1xyXG5cdH1cclxuXHRzYXZlU2V0dGluZ3MoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRsb2NhbFN0b3JhZ2VDaGVjaygpO1xyXG5cdGlmIChzdG9yYWdlU3VwcG9ydGVkKSB7XHJcblx0XHR2YXIgc3RvcmVkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgna2FkYWxhU2V0dGluZ3MnKSkgfHwge307XHJcblxyXG5cdFx0Ly9sb29wIHRocm91Z2ggZXhpc3RpbmcgZGVmYXVsdHMgaW5jYXNlIHVzZXIgaGFzIG9sZGVyIHZlcnNpb24gb2YgYXBwXHJcblx0XHR2YXIgc2V0dGluZ3NLZXlzID0gT2JqZWN0LmtleXMoZGVmYXVsdHMpO1xyXG5cdFx0dmFyIGtleUxlbmd0aCA9IHNldHRpbmdzS2V5cy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwga2V5TGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0YXBwU2V0dGluZ3Nbc2V0dGluZ3NLZXlzW2ldXSA9IHN0b3JlZFtzZXR0aW5nc0tleXNbaV1dIHx8IGRlZmF1bHRzW3NldHRpbmdzS2V5c1tpXV07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9wdWxsIHRoZSBzcGVudCBpdGVtc1xyXG5cdFx0c2hhcmRzU3BlbnQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdrYWRhbGFTcGVudCcpKSB8fCB7fTtcclxuXHJcblx0XHQvL3NhdmUgdG8gc3RvcmFnZVxyXG5cdFx0c2F2ZVNldHRpbmdzKCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuaW5pdCgpO1xyXG5cclxudmFyIEFwcFN0b3JlID0gYXNzaWduKHt9LEV2ZW50RW1pdHRlci5wcm90b3R5cGUse1xyXG5cdGdldFNldHRpbmdzOmdldFNldHRpbmdzLFxyXG5cclxuXHRlbWl0Q2hhbmdlOmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLmVtaXQoQ0hBTkdFX0VWRU5UKTtcclxuXHR9LFxyXG5cdGFkZENoYW5nZUxpc3RlbmVyOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLm9uKENIQU5HRV9FVkVOVCxjYWxsYmFjayk7XHJcblx0fSxcclxuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcjpmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDSEFOR0VfRVZFTlQsY2FsbGJhY2spO1xyXG5cdH1cclxufSk7XHJcblxyXG5BcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbikge1xyXG5cdHN3aXRjaChhY3Rpb24uYWN0aW9uVHlwZSl7XHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5DSEFOR0VfU0VUVElORzpcclxuXHRcdFx0Y2hhbmdlU2V0dGluZyhhY3Rpb24ua2V5LGFjdGlvbi52YWwpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuSU5DUkVNRU5UX1NIQVJEUzpcclxuXHRcdFx0aW5jcmVtZW50U2hhcmRzKGFjdGlvbi5rZXksYWN0aW9uLnZhbCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0Ly9ub29wXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwU3RvcmU7IiwidmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcclxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcclxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcclxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxuXHJcbnZhciBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcclxuXHJcbi8vdGhlcmUgYXJlIG9ubHkgdHdvIGludmVudG9yaWVzIGJlaW5nIHVzZWQgd2l0aCB0aGUgYWJpbGl0eSB0byBjeWNsZSBiYWNrXHJcbnZhciBwcmV2aW91c0ludmVudG9yeTtcclxudmFyIGN1cnJlbnRJbnZlbnRvcnk7XHJcbnZhciBuZXh0SW52ZW50b3J5O1xyXG5cclxudmFyIGl0ZW1zID0gW107XHJcbnZhciBjdXJyZW50SW5kZXggPSAwO1xyXG5cclxuLy9jcmVhdGVzIG5lc3RlZCBhcnJheSBibGFuayBpbnZlbnRvcnkgYW5kIHNldHMgYXMgdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcbmZ1bmN0aW9uIGNyZWF0ZUludmVudG9yeSgpIHtcclxuXHR2YXIgbmV3SW52ZW50b3J5ID0gW107XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPDEwO2krKykge1xyXG5cdFx0Ly9wdXNoIGEgYmxhbmsgYXJyYXkgdG8gcmVwcmVzZW50IGVhY2ggY29sdW1uIG9mIHRoZSBpbnZlbnRvcnlcclxuXHRcdG5ld0ludmVudG9yeS5wdXNoKFtdKTtcclxuXHR9XHJcblxyXG5cdC8vc2V0IHRoZSBwcmV2aW91cyBpbnZlbnRvcnkgdG8gdGhlIGxhdGVzdCBpbnZlbnRvcnkgdXNlZFxyXG5cdHByZXZpb3VzSW52ZW50b3J5ID0gbmV4dEludmVudG9yeSB8fCBjdXJyZW50SW52ZW50b3J5IHx8IHVuZGVmaW5lZDtcclxuXHQvL3RoZSBuZXcgYmxhbmsgaW52ZW50b3J5IGlzIG5vdyB0aGUgY3VycmVudCBpbnZlbnRvcnlcclxuXHRjdXJyZW50SW52ZW50b3J5ID0gbmV3SW52ZW50b3J5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbnZlbnRvcnkoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHByZXZpb3VzSW52ZW50b3J5OnByZXZpb3VzSW52ZW50b3J5LFxyXG5cdFx0Y3VycmVudEludmVudG9yeTpjdXJyZW50SW52ZW50b3J5LFxyXG5cdFx0bmV4dEludmVudG9yeTpuZXh0SW52ZW50b3J5XHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbSgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0aXRlbTppdGVtc1tjdXJyZW50SW5kZXhdXHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSXRlbShpdGVtKSB7XHJcblx0dmFyIGludmVudG9yeUxlbmd0aCA9IGN1cnJlbnRJbnZlbnRvcnkubGVuZ3RoO1xyXG5cdC8vbG9vcGluZyB0aHJvdWdoIGVhY2ggY29sdW1uIG9mIHRoZSBpbnZlbnRvcnlcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGludmVudG9yeUxlbmd0aDsgaSArKykge1xyXG5cdFx0Ly9sb29wIHRocm91Z2ggZWFjaCBpdGVtIGluIHNhaWQgY29sdW1uXHJcblx0XHR2YXIgY29sdW1uTGVuZ3RoID0gY3VycmVudEludmVudG9yeVtpXS5sZW5ndGg7XHJcblx0XHR2YXIgY29sdW1uSGVpZ2h0ID0gMDtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY29sdW1uTGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0Ly9hZGQgY3VycmVudCBpdGVtIHNpemUgdG8gY29sdW1uIGhlaWdodFxyXG5cdFx0XHRpZihjdXJyZW50SW52ZW50b3J5W2ldW2pdLmhhc093blByb3BlcnR5KCdzaXplJykpIHtcclxuXHRcdFx0XHRjb2x1bW5IZWlnaHQrPWN1cnJlbnRJbnZlbnRvcnlbaV1bal0uc2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9jaGVjayBpZiB0aGUgaGVpZ2h0IGlzIHN0aWxsIGxlc3MgdGhhbiA2IHdpdGggbmV3IGl0ZW1cclxuXHRcdC8vYW5kIGFkZCB0byB0aGF0IGNvbHVtbiBhbmQgcmV0dXJuIHRvIHN0b3AgdGhlIG1hZG5lc3NcclxuXHRcdGlmIChjb2x1bW5IZWlnaHQraXRlbS5zaXplIDw9Nikge1xyXG5cdFx0XHRjdXJyZW50SW52ZW50b3J5W2ldLnB1c2goaXRlbSk7XHJcblx0XHRcdC8vaWYgd2UgY2FuIHN1Y2Nlc3NmdWxseSBhZGQgdG8gaW52ZW50b3J5IGNhbGwgZm9yIGl0ZW1zIGludmVudG9yeVxyXG5cdFx0XHRhZGRUb0l0ZW1zKGl0ZW0pO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvL2lmIHdlIG1hZGUgaXQgdGhpcyBmYXIgdGhlIG5ldyBpdGVtIGRvZXMgbm90IGZpdCBpbiB0aGUgY3VycmVudCBpbnZlbnRvcnlcclxuXHQvL2NoZWNrIHRvIHNlZSBpZiB0aGVyZSBpcyBhIG5leHQgaW52ZW50b3J5XHJcblx0Ly9zbyB0aGF0IHdlIGNhbiBjeWNsZSB0byBuZXh0IGludmVudG9yeSBhbmQgdHJ5IGFuZCBmaXQgaXQgaW5cclxuXHRpZiAodHlwZW9mIG5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRnb3RvTmV4dCgpO1xyXG5cdFx0YWRkSXRlbShpdGVtKTtcclxuXHR9XHJcblx0Ly90aGVyZSBpcyBubyBuZXh0IGludmVudG9yeSBhbmQgd2UgbmVlZCB0byBtYWtlIGEgbmV3IG9uZVxyXG5cdGVsc2Uge1xyXG5cdFx0Y3JlYXRlSW52ZW50b3J5KCk7XHJcblx0XHRhZGRJdGVtKGl0ZW0pO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG9JdGVtcyhpdGVtKSB7XHJcblx0aXRlbXMucHVzaChpdGVtKTtcclxuXHJcblx0Ly9pZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDEwIGl0ZW1zIHJlbW92ZSB0aGUgZmlyc3RcclxuXHRpZiAoaXRlbXMubGVuZ3RoID4gMTApIHtcclxuXHRcdGl0ZW1zLnNoaWZ0KCk7XHJcblx0fVxyXG5cclxuXHQvL3NldCB0aGUgY3VycmVudGluZGV4IHRvIHRoZSBuZXcgaXRlbVxyXG5cdGN1cnJlbnRJbmRleCA9IGl0ZW1zLmxlbmd0aCAtIDE7XHJcbn1cclxuXHJcbi8vY3ljbGVzIHRocm91Z2ggdG8gdGhlIHByZXZpb3VzIGludmVudG9yeVxyXG5mdW5jdGlvbiBnb3RvUHJldmlvdXMoKSB7XHJcblx0aWYodHlwZW9mIHByZXZpb3VzSW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0bmV4dEludmVudG9yeSA9IGN1cnJlbnRJbnZlbnRvcnk7XHJcblx0XHRjdXJyZW50SW52ZW50b3J5ID0gcHJldmlvdXNJbnZlbnRvcnk7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcbn1cclxuXHJcbi8vY3ljbGVzIHRocm91Z2ggdG8gdGhlIG5leHQgaW52ZW50b3J5XHJcbmZ1bmN0aW9uIGdvdG9OZXh0KCkge1xyXG5cdGlmKHR5cGVvZiBuZXh0SW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0cHJldmlvdXNJbnZlbnRvcnkgPSBjdXJyZW50SW52ZW50b3J5O1xyXG5cdFx0Y3VycmVudEludmVudG9yeSA9IG5leHRJbnZlbnRvcnk7XHJcblx0XHRuZXh0SW52ZW50b3J5ID0gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuLy9pbml0aWFsaXplIHN0b3JlIGJ5IGNyZWF0aW5nIGEgYmxhbmsgaW52ZW50b3J5XHJcbmNyZWF0ZUludmVudG9yeSgpO1xyXG5cclxudmFyIEludmVudG9yeVN0b3JlID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLHtcclxuXHRnZXRJbnZlbnRvcnk6Z2V0SW52ZW50b3J5LFxyXG5cdGdvdG9QcmV2aW91czpnb3RvUHJldmlvdXMsXHJcblx0Z290b05leHQ6Z290b05leHQsXHJcblx0YWRkSXRlbTphZGRJdGVtLFxyXG5cdGdldEl0ZW06Z2V0SXRlbSxcclxuXHJcblx0ZW1pdENoYW5nZTpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5lbWl0KENIQU5HRV9FVkVOVCk7XHJcblx0fSxcclxuXHRhZGRDaGFuZ2VMaXN0ZW5lcjpmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5vbihDSEFOR0VfRVZFTlQsY2FsbGJhY2spO1xyXG5cdH0sXHJcblx0cmVtb3ZlQ2hhbmdlTGlzdGVuZXI6ZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ0hBTkdFX0VWRU5ULGNhbGxiYWNrKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihhY3Rpb24pIHtcclxuXHRzd2l0Y2goYWN0aW9uLmFjdGlvblR5cGUpIHtcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5BRERfSVRFTTpcclxuXHRcdFx0YWRkSXRlbShhY3Rpb24uaXRlbSk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuUFJFVl9JTlY6XHJcblx0XHRcdGdvdG9QcmV2aW91cygpO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLk5FWFRfSU5WOlxyXG5cdFx0XHRnb3RvTmV4dCgpO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdC8vbm9vcFxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeVN0b3JlOyJdfQ==
