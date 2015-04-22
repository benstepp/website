(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var KadalaStore = require('./components/kadala-store/kadala-store.jsx');
var Inventory = require('./components/inventory/inventory.jsx');

var Application = React.createClass({displayName: "Application",
	render:function() {
		return (
			React.createElement("div", {className: "container-fluid"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-sm-3"}, 
						React.createElement(OptionsPanel, null)
					), 
					React.createElement("div", {className: "col-sm-9"}, 
						React.createElement(KadalaStore, null), 
						React.createElement(Inventory, null)
					)
				), 
				React.createElement("div", {className: "row"}
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

},{"./components/inventory/inventory.jsx":17,"./components/kadala-options/options-panel.jsx":25,"./components/kadala-store/kadala-store.jsx":28}],2:[function(require,module,exports){
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
	}

};

module.exports = AppActions;

},{"../constants/AppConstants":29,"../dispatcher/AppDispatcher":30}],9:[function(require,module,exports){
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
							React.createElement("li", {className: "item-slot"}, this.props.item.slot), 
							React.createElement("li", {className: "item-class-specific d3-color-white"}, this.props.item.classSpecific)
					), 

					/*Rarity of the item and/if it is ancient*/
					React.createElement("ul", {className: "item-type"}, 
						React.createElement("li", null, 
							React.createElement("span", {className: itemTypeClass}, this.props.item.type)
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
						secondaries
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

},{"./d3-tooltip-armor.jsx":9,"./d3-tooltip-stat.jsx":12,"./d3-tooltip-weapon.jsx":13}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipStat= React.createClass({displayName: "D3ItemTooltipStat",

	render: function() {

		var text = [];
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
					var element = React.createElement("span", {className: "value"}, sliced);
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
				}

			}
	}

		return (

			React.createElement("li", {className: "d3-color-blue d3-item-property-default"}, 
				React.createElement("p", null, text)
			)

		);

	}

});

module.exports = D3ItemTooltipStat;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),

	D3ItemTooltipHead = require('./d3-tooltip-head.jsx'),
	D3ItemTooltipBody = require('./d3-tooltip-body.jsx');


var D3ItemTooltip = React.createClass({displayName: "D3ItemTooltip",
	render: function() {

		return (
			React.createElement("div", {className: "tooltip-content"}, 
				React.createElement("div", {className: "d3-tooltip d3-tooltip-item"}, 
					React.createElement(D3ItemTooltipHead, {item: this.props.item}), 
					React.createElement(D3ItemTooltipBody, {item: this.props.item})
				)
			)
		);

	}
});

module.exports = D3ItemTooltip;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./d3-tooltip-body.jsx":10,"./d3-tooltip-head.jsx":11}],15:[function(require,module,exports){
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

},{"./inventory-slot.jsx":16,"./next-inventory.jsx":18,"./previous-inventory.jsx":19}],16:[function(require,module,exports){
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
			var tooltipHeight = elem.children[3].getBoundingClientRect().height;
			var windowHeight = window.innerHeight;

			//check if the tooltip fits where it currently is
			if (!(tooltipHeight + elemLocation < windowHeight)) {
				var offset = (tooltipHeight + elemLocation - windowHeight);

				//if the tooltip is bigger than window, just show at top of window
				if (offset > windowHeight) {
					elem.children[3].style.top = '-'+(elemLocation-20)+'px';
				}
				else {
					//just move it up a little with a bit at bottom
					elem.children[3].style.top = '-'+(offset+10)+'px';
				}

			}
		}
	},

	render:function() {

		var slotContent= [];
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
					slotContent.push(React.createElement("div", {style: inline, className: "inventory-bg"}))
				}
			}

			//set the item image
			if (this.props.data.hasOwnProperty('image')) {
				var inline = {backgroundImage:'url('+this.props.data.image+')'};
				slotContent.push(React.createElement("div", {style: inline, className: "inventory-image"}));
			}

			//add a link to activate tooltip
			slotContent.push(React.createElement("a", {className: "tooltip-link"}));

			//add a hidden tooltip
			var inline;
			if (this.props.column < 5) {
				inline = {left:'50px'};
			}
			else {
				inline = {right:'50px'};
			}

			slotContent.push(
				React.createElement("div", {className: "tooltip-container", style: inline}, 
				React.createElement(D3ItemTooltip, {item: this.props.data})
				)
			)

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

},{"../d3-tooltip/d3-tooltip.jsx":14}],17:[function(require,module,exports){
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

},{"../../stores/InventoryStore":31,"./inventory-container.jsx":15}],18:[function(require,module,exports){
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

},{"../../actions/AppActions":8}],19:[function(require,module,exports){
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

},{"../../actions/AppActions":8}],20:[function(require,module,exports){
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
					React.createElement("img", {src: this.props.image, className: imageClass}), 
					React.createElement("span", null, this.props.name.toLowerCase()), 
					React.createElement("span", {className: "shortened"}, shortenedNames[this.props.name])
				)
			)
		);
	}

});

module.exports = ClassSelectorButton;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],21:[function(require,module,exports){
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

},{"./class-selector-button.jsx":20}],22:[function(require,module,exports){
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
					React.createElement("img", null), 
					React.createElement("span", null, this.props.gender.toLowerCase())
				)
			)
		);
	}
});

module.exports = GenderSelectorButton;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],23:[function(require,module,exports){
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

},{"./gender-selector-button.jsx":22}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);

var ClassSelector = require('./class-selector.jsx');
var GenderSelector = require('./gender-selector.jsx');
var SeasonalCheckbox = require('./seasonal-checkbox.jsx');
var HardcoreCheckbox = require('./hardcore-checkbox.jsx');

var OptionsPanel = React.createClass({displayName: "OptionsPanel",

	getInitialState:function() {
		var initial = {
			dClass:'Barbarian',
			gender:'Female',
			hardcore:false,
			seasonal:true
		};
		d3sim.setKadala(initial.dClass,initial.seasonal,initial.hardcore);
		return initial;
	},

	changeGender:function(gender) {
		this.setState({
			gender:gender
		});
	},
	changeClass:function(dClass) {
		this.setState({
			dClass:dClass
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
		});
	},
	changeHardcore:function(bool) {
		this.setState({
			hardcore:bool
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
		});
	},
	changeSeasonal:function(bool) {
		this.setState({
			seasonal:bool
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
		});
	},

	render:function() {
		return (
			React.createElement("section", {className: "options-panel"}, 
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

},{"./class-selector.jsx":21,"./gender-selector.jsx":23,"./hardcore-checkbox.jsx":24,"./seasonal-checkbox.jsx":26}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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
	},
	resetCount:function() {
		this.setState({shardCount:0});
	},

	render:function() {
		return (
			React.createElement("div", {className: "kadala-item"}, 
				React.createElement("button", {className: "kadala", onClick: this.buyItem}, 
					React.createElement("img", {className: "kadala-icon"}), 
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

},{"../../actions/AppActions":8}],28:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var KadalaItem = require('./kadala-item.jsx');

var KadalaStore = React.createClass({displayName: "KadalaStore",
	render:function() {

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
			React.createElement("div", {className: "kadala-store"}, 
				kadalaSlots
			)
		);
	}
});

module.exports = KadalaStore;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./kadala-item.jsx":27}],29:[function(require,module,exports){
var keyMirror = require('keymirror');

module.exports = keyMirror({
	ADD_ITEM:null,

	PREV_INV:null,
	NEXT_INV:null
});

},{"keymirror":6}],30:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":3}],31:[function(require,module,exports){
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

//there are only two inventories being used with the ability to cycle back
var previousInventory;
var currentInventory;
var nextInventory;

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

},{"../constants/AppConstants":29,"../dispatcher/AppDispatcher":30,"events":2,"object-assign":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxhY3Rpb25zXFxBcHBBY3Rpb25zLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWFybW9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1ib2R5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1oZWFkLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1zdGF0LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC13ZWFwb24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxpbnZlbnRvcnktY29udGFpbmVyLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxpbnZlbnRvcnktc2xvdC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxuZXh0LWludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxccHJldmlvdXMtaW52ZW50b3J5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGNsYXNzLXNlbGVjdG9yLWJ1dHRvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxjbGFzcy1zZWxlY3Rvci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxnZW5kZXItc2VsZWN0b3ItYnV0dG9uLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGdlbmRlci1zZWxlY3Rvci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxoYXJkY29yZS1jaGVja2JveC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxvcHRpb25zLXBhbmVsLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXHNlYXNvbmFsLWNoZWNrYm94LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLXN0b3JlXFxrYWRhbGEtaXRlbS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1zdG9yZVxca2FkYWxhLXN0b3JlLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29uc3RhbnRzXFxBcHBDb25zdGFudHMuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGRpc3BhdGNoZXJcXEFwcERpc3BhdGNoZXIuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXHN0b3Jlc1xcSW52ZW50b3J5U3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUM1RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNENBQTRDLENBQUMsQ0FBQztBQUN4RSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQzs7QUFFaEUsSUFBSSxpQ0FBaUMsMkJBQUE7Q0FDcEMsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGlCQUFrQixDQUFBLEVBQUE7SUFDaEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxLQUFNLENBQUEsRUFBQTtLQUNwQixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLFVBQVcsQ0FBQSxFQUFBO01BQ3pCLG9CQUFDLFlBQVksRUFBQSxJQUFBLENBQUcsQ0FBQTtLQUNYLENBQUEsRUFBQTtLQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsVUFBVyxDQUFBLEVBQUE7TUFDekIsb0JBQUMsV0FBVyxFQUFBLElBQUEsQ0FBRyxDQUFBLEVBQUE7TUFDZixvQkFBQyxTQUFTLEVBQUEsSUFBQSxDQUFHLENBQUE7S0FDUixDQUFBO0lBQ0QsQ0FBQSxFQUFBO0lBQ04sb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxLQUFNLENBQUE7SUFDZixDQUFBO0dBQ0QsQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxLQUFLLENBQUMsTUFBTTtDQUNYLG9CQUFDLFdBQVcsRUFBQSxJQUFBLENBQUcsQ0FBQTtDQUNmLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO0NBQzlCOzs7OztBQzdCRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFRO0dBQ3pCLFlBQVksRUFBRSxDQUFDO0dBQ2YsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLFFBQVEsRUFBRSxDQUFDO0dBQ1gsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7QUFFVCxFQUFFLFFBQVE7O0VBRVI7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBPcHRpb25zUGFuZWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMva2FkYWxhLW9wdGlvbnMvb3B0aW9ucy1wYW5lbC5qc3gnKTtcclxudmFyIEthZGFsYVN0b3JlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2thZGFsYS1zdG9yZS9rYWRhbGEtc3RvcmUuanN4Jyk7XHJcbnZhciBJbnZlbnRvcnkgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaW52ZW50b3J5L2ludmVudG9yeS5qc3gnKTtcclxuXHJcbnZhciBBcHBsaWNhdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0zXCI+XHJcblx0XHRcdFx0XHRcdDxPcHRpb25zUGFuZWwgLz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tOVwiPlxyXG5cdFx0XHRcdFx0XHQ8S2FkYWxhU3RvcmUgLz5cclxuXHRcdFx0XHRcdFx0PEludmVudG9yeSAvPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5SZWFjdC5yZW5kZXIoXHJcblx0PEFwcGxpY2F0aW9uIC8+LFxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKVxyXG4pOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMuRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vbGliL0Rpc3BhdGNoZXInKVxuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBEaXNwYXRjaGVyXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnLi9pbnZhcmlhbnQnKTtcblxudmFyIF9sYXN0SUQgPSAxO1xudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NpdHktdXBkYXRlJykge1xuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBwYXlsb2FkLnNlbGVjdGVkQ2l0eTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIGNvdW50cnksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NvdW50cnktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENvdW50cnk6ICdhdXN0cmFsaWEnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBib3RoIHN0b3JlczpcbiAqXG4gKiAgICBDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIENvdW50cnlTdG9yZS5jb3VudHJ5ID0gcGF5bG9hZC5zZWxlY3RlZENvdW50cnk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSBjYWxsYmFjayB0byB1cGRhdGUgYENvdW50cnlTdG9yZWAgaXMgcmVnaXN0ZXJlZCwgd2Ugc2F2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhlIHJldHVybmVkIHRva2VuLiBVc2luZyB0aGlzIHRva2VuIHdpdGggYHdhaXRGb3IoKWAsIHdlIGNhbiBndWFyYW50ZWVcbiAqIHRoYXQgYENvdW50cnlTdG9yZWAgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrIHRoYXQgdXBkYXRlcyBgQ2l0eVN0b3JlYFxuICogbmVlZHMgdG8gcXVlcnkgaXRzIGRhdGEuXG4gKlxuICogICBDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgbWF5IG5vdCBiZSB1cGRhdGVkLlxuICogICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBpcyBub3cgZ3VhcmFudGVlZCB0byBiZSB1cGRhdGVkLlxuICpcbiAqICAgICAgIC8vIFNlbGVjdCB0aGUgZGVmYXVsdCBjaXR5IGZvciB0aGUgbmV3IGNvdW50cnlcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gZ2V0RGVmYXVsdENpdHlGb3JDb3VudHJ5KENvdW50cnlTdG9yZS5jb3VudHJ5KTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSB1c2FnZSBvZiBgd2FpdEZvcigpYCBjYW4gYmUgY2hhaW5lZCwgZm9yIGV4YW1wbGU6XG4gKlxuICogICBGbGlnaHRQcmljZVN0b3JlLmRpc3BhdGNoVG9rZW4gPVxuICogICAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvblR5cGUpIHtcbiAqICAgICAgICAgY2FzZSAnY291bnRyeS11cGRhdGUnOlxuICogICAgICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIGdldEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqXG4gKiAgICAgICAgIGNhc2UgJ2NpdHktdXBkYXRlJzpcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBgY291bnRyeS11cGRhdGVgIHBheWxvYWQgd2lsbCBiZSBndWFyYW50ZWVkIHRvIGludm9rZSB0aGUgc3RvcmVzJ1xuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MgaW4gb3JkZXI6IGBDb3VudHJ5U3RvcmVgLCBgQ2l0eVN0b3JlYCwgdGhlblxuICogYEZsaWdodFByaWNlU3RvcmVgLlxuICovXG5cbiAgZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWQgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdpdGggZXZlcnkgZGlzcGF0Y2hlZCBwYXlsb2FkLiBSZXR1cm5zXG4gICAqIGEgdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGB3YWl0Rm9yKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3Rlcj1mdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBpZCA9IF9wcmVmaXggKyBfbGFzdElEKys7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgYmFzZWQgb24gaXRzIHRva2VuLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnVucmVnaXN0ZXI9ZnVuY3Rpb24oaWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAnRGlzcGF0Y2hlci51bnJlZ2lzdGVyKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgaWRcbiAgICApO1xuICAgIGRlbGV0ZSB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF07XG4gIH07XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgY2FsbGJhY2tzIHNwZWNpZmllZCB0byBiZSBpbnZva2VkIGJlZm9yZSBjb250aW51aW5nIGV4ZWN1dGlvblxuICAgKiBvZiB0aGUgY3VycmVudCBjYWxsYmFjay4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSBhIGNhbGxiYWNrIGluXG4gICAqIHJlc3BvbnNlIHRvIGEgZGlzcGF0Y2hlZCBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5PHN0cmluZz59IGlkc1xuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUud2FpdEZvcj1mdW5jdGlvbihpZHMpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nXG4gICAgKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaWRzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIGlkID0gaWRzW2lpXTtcbiAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSxcbiAgICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgJyArXG4gICAgICAgICAgJ3dhaXRpbmcgZm9yIGAlc2AuJyxcbiAgICAgICAgICBpZFxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGludmFyaWFudChcbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgICBpZFxuICAgICAgKTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIHBheWxvYWQgdG8gYWxsIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2g9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGludmFyaWFudChcbiAgICAgICF0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2guZGlzcGF0Y2goLi4uKTogQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nXG4gICAgKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZCk7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmcoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoaXMgRGlzcGF0Y2hlciBjdXJyZW50bHkgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5pc0Rpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGwgdGhlIGNhbGxiYWNrIHN0b3JlZCB3aXRoIHRoZSBnaXZlbiBpZC4gQWxzbyBkbyBzb21lIGludGVybmFsXG4gICAqIGJvb2trZWVwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjaz1mdW5jdGlvbihpZCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IHRydWU7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdKHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQpO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB1cCBib29ra2VlcGluZyBuZWVkZWQgd2hlbiBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gZmFsc2U7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXIgYm9va2tlZXBpbmcgdXNlZCBmb3IgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGF0Y2hlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKGZhbHNlKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0IEZhY2Vib29rLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigna2V5TWlycm9yKC4uLik6IEFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICB9XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIga2V5cztcblx0dmFyIHRvID0gVG9PYmplY3QodGFyZ2V0KTtcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBhcmd1bWVudHNbc107XG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKE9iamVjdChmcm9tKSk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRvW2tleXNbaV1dID0gZnJvbVtrZXlzW2ldXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwidmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcclxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcclxuXHJcbnZhciBBcHBBY3Rpb25zID0ge1xyXG5cclxuXHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuQUREX0lURU0sXHJcblx0XHRcdGl0ZW06aXRlbVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0cHJldmlvdXNJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLlBSRVZfSU5WXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRuZXh0SW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5ORVhUX0lOVlxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwQWN0aW9uczsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBBcm1vciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tYXJtb3Itd2VhcG9uIGl0ZW0tYXJtb3ItYXJtb3JcIj5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiYmlnXCI+PHA+PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy5hcm1vcn08L3NwYW4+PC9wPjwvbGk+XHJcblx0XHRcdFx0PGxpPkFybW9yPC9saT5cclxuXHRcdFx0PC91bD5cclxuXHJcblx0XHQpO1xyXG5cclxuXHR9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEFybW9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0RDNJdGVtVG9vbHRpcEFybW9yID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWFybW9yLmpzeCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBXZWFwb24gPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtd2VhcG9uLmpzeCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBTdGF0ID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLXN0YXQuanN4Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEJvZHkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGljb25DbGFzc2VzID0gJ2QzLWljb24gZDMtaWNvbi1pdGVtIGQzLWljb24taXRlbS1sYXJnZSc7XHJcblx0XHR2YXIgaXRlbVR5cGVDbGFzcyA9J2QzLWNvbG9yLSc7IFxyXG5cclxuXHRcdC8vZGVjbGFyZSBhcnJheXMgZm9yIHByaW1hcnkgYW5kIHNlY29uZGFyeSBpdGVtIGVmZmVjdHMuIFxyXG5cdFx0Ly9BbiBpdGVtIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgb2YgZWFjaC5cclxuXHRcdC8vQ3JlYXRlIHRoZSBsaXN0IGl0ZW0gZm9yIGVhY2ggc3RhdCBhbmQgcHVzaCBpbiB0aGUgYXJyYXlzXHJcblx0XHR2YXIgcHJpbWFyaWVzID0gZm9yRWFjaCh0aGlzLnByb3BzLml0ZW0ucHJpbWFyaWVzKTtcclxuXHRcdHZhciBzZWNvbmRhcmllcyA9IGZvckVhY2godGhpcy5wcm9wcy5pdGVtLnNlY29uZGFyaWVzKTtcclxuXHJcblx0XHQvL2ltYWdlIHVzZWQgYXMgaW5saW5lLXN0eWxlIGZvciBpdGVtIHRvb2x0aXBzXHJcblx0XHR2YXIgaW1hZ2UgPSB7YmFja2dyb3VuZEltYWdlOid1cmwoJyt0aGlzLnByb3BzLml0ZW0uaW1hZ2UrJyknfTtcclxuXHJcblx0XHQvL2lmIHNwZWNpZmllZCwgc2V0IGNvbG9yIGZvciB0b29sdGlwIGNvbXBvbmVudHNcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0uY29sb3IpIHtcclxuXHRcdFx0aWNvbkNsYXNzZXMgKz0gJyBkMy1pY29uLWl0ZW0tJyt0aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHRcdGl0ZW1UeXBlQ2xhc3MgKz10aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9pZiBpdCBpcyBhbiBhcm1vciBvciB3ZWFwb24gYWRkIGFkZGl0aW9uYWwgaW5mbyB0byBpY29uIHNlY3Rpb25cclxuXHRcdHZhciBzdWJIZWFkO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnYXJtb3InKSkge1xyXG5cdFx0XHRzdWJIZWFkID0gPEQzSXRlbVRvb2x0aXBBcm1vciBhcm1vcj17dGhpcy5wcm9wcy5pdGVtLmFybW9yfS8+O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnd2VhcG9uJykpIHtcclxuXHRcdFx0c3ViSGVhZCA9IDxEM0l0ZW1Ub29sdGlwV2VhcG9uIHdlYXBvbj17dGhpcy5wcm9wcy5pdGVtLndlYXBvbn0vPjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRvb2x0aXAtYm9keSBlZmZlY3QtYmcgZWZmZWN0LWJnLWFybW9yIGVmZmVjdC1iZy1hcm1vci1kZWZhdWx0XCI+XHJcblxyXG5cdFx0XHRcdHsvKlRoZSBpdGVtIGljb24gYW5kIGNvbnRhaW5lciwgY29sb3IgbmVlZGVkIGZvciBiYWNrZ3JvdW5kKi99XHJcblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPXtpY29uQ2xhc3Nlc30+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJpY29uLWl0ZW0tZ3JhZGllbnRcIj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1pdGVtLWlubmVyIGljb24taXRlbS1kZWZhdWx0XCIgc3R5bGU9e2ltYWdlfT5cclxuXHRcdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdDwvc3Bhbj5cclxuXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJkMy1pdGVtLXByb3BlcnRpZXNcIj5cclxuXHJcblx0XHRcdFx0XHR7LypTbG90IGFuZCBpZiBjbGFzcyBzcGVjaWZpYyovfVxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tdHlwZS1yaWdodFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJpdGVtLXNsb3RcIj57dGhpcy5wcm9wcy5pdGVtLnNsb3R9PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiaXRlbS1jbGFzcy1zcGVjaWZpYyBkMy1jb2xvci13aGl0ZVwiPnt0aGlzLnByb3BzLml0ZW0uY2xhc3NTcGVjaWZpY308L2xpPlxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHJcblx0XHRcdFx0XHR7LypSYXJpdHkgb2YgdGhlIGl0ZW0gYW5kL2lmIGl0IGlzIGFuY2llbnQqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLXR5cGVcIj5cclxuXHRcdFx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT17aXRlbVR5cGVDbGFzc30+e3RoaXMucHJvcHMuaXRlbS50eXBlfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHRcdFx0ey8qSWYgdGhlIGl0ZW0gaXMgYXJtb3Igb3Igd2VhcG9uLCB0aGUga2V5IGlzIGRlZmluZWQgYW5kIHdlIG5lZWQgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgdG9vbHRpcCovfVxyXG5cdFx0XHRcdFx0e3N1YkhlYWR9XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJpdGVtLWJlZm9yZS1lZmZlY3RzXCI+PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0ey8qQWN0dWFsIGl0ZW0gc3RhdHMqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWVmZmVjdHNcIj5cclxuXHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwiaXRlbS1wcm9wZXJ0eS1jYXRlZ29yeVwiPlByaW1hcnk8L3A+XHJcblx0XHRcdFx0XHRcdHtwcmltYXJpZXN9XHJcblx0XHRcdFx0XHRcdDxwIGNsYXNzTmFtZT1cIml0ZW0tcHJvcGVydHktY2F0ZWdvcnlcIj5TZWNvbmRhcnk8L3A+XHJcblx0XHRcdFx0XHRcdHtzZWNvbmRhcmllc31cclxuXHRcdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHRmdW5jdGlvbiBmb3JFYWNoKHN0YXRPYmplY3QpIHtcclxuXHRcdHZhciByZXN1bHRzID0gW107XHJcblxyXG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhzdGF0T2JqZWN0KTtcclxuXHRcdHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArKykge1xyXG5cdFx0XHR2YXIgc3RhdCA9IGtleXNbaV07XHJcblx0XHRcdHZhciB2YWwgPSBzdGF0T2JqZWN0W3N0YXRdO1xyXG5cdFx0XHRyZXN1bHRzLnB1c2goPEQzSXRlbVRvb2x0aXBTdGF0IHN0YXQ9e3ZhbH0ga2V5PXtpfSAvPik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0cztcclxuXHR9XHJcblxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBCb2R5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEhlYWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvL2luaXRpYWwgY2xhc3Mgc2V0IGZvciB0aGUgdG9vbHRpcCBoZWFkXHJcblx0XHR2YXIgZGl2Q2xhc3M9J3Rvb2x0aXAtaGVhZCc7XHJcblx0XHR2YXIgaDNDbGFzcz0nJztcclxuXHJcblx0XHQvL21vZGlmeSB0aGUgY2xhc3NlcyBpZiBhIGNvbG9yIHdhcyBwYXNzZWRcclxuXHRcdC8vZmFsbGJhY2sgY29sb3IgaXMgaGFuZGxlZCBieSBkMy10b29sdGlwIGNzc1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5jb2xvcikge1xyXG5cdFx0XHRkaXZDbGFzcyArPSAnIHRvb2x0aXAtaGVhZC0nICsgdGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0XHRoM0NsYXNzICs9ICdkMy1jb2xvci0nICsgdGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtkaXZDbGFzc30+XHJcblx0XHRcdFx0PGgzIGNsYXNzTmFtZT17aDNDbGFzc30+XHJcblx0XHRcdFx0XHR7dGhpcy5wcm9wcy5pdGVtLm5hbWV9XHJcblx0XHRcdFx0PC9oMz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwSGVhZDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBTdGF0PSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHRleHQgPSBbXTtcclxuXHRcdC8vY2hlY2sgdG8gbWFrZSBzdXJlIHRlbXBsYXRlIG5lZWRzIHRvIGJlIHdvcmtlZCB3aXRoIFxyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLnN0YXQudGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dmFyIHRlbXBsYXRlID0gdGhpcy5wcm9wcy5zdGF0LnRleHQ7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZS5pbmRleE9mKCd7JykgIT09IC0xKSB7XHJcblxyXG5cdFx0XHRcdC8vZGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgaGlnaGxpZ2h0ZWQgaXRlbXMgdGhlIHRvb2x0aXAgd2lsbCBoYXZlXHJcblx0XHRcdFx0dmFyIHBvc2l0aW9uID0gdGVtcGxhdGUuaW5kZXhPZigneycpO1xyXG5cdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0d2hpbGUgKHBvc2l0aW9uICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0Y291bnQrK1xyXG5cdFx0XHRcdFx0cG9zaXRpb24gPSB0ZW1wbGF0ZS5pbmRleE9mKCd7JywgcG9zaXRpb24rMSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgc3RhcnRQb3MgPSAwO1xyXG5cdFx0XHRcdHZhciBlbmRQb3MgPSAwO1xyXG5cdFx0XHRcdC8vbG9vcCB0aHJvdWdoIHRoaXMgY291bnQgb2YgdGVtcGxhdGluZ1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPTA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgc3RhcnRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ3snLHN0YXJ0UG9zKSsxO1xyXG5cdFx0XHRcdFx0c3RhcnRQb3MgPSBzdGFydEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZEluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZignfScsZW5kUG9zKTtcclxuXHRcdFx0XHRcdGVuZFBvcyA9IGVuZEluZGV4KzE7XHJcblx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2Uoc3RhcnRJbmRleCxlbmRJbmRleCk7XHJcblxyXG5cdFx0XHRcdFx0Ly9jaGVjayBmb3IgYW55IHJlcGxhY2VtZW50IG5lZWRlZFxyXG5cdFx0XHRcdFx0aWYgKHNsaWNlZC5pbmRleE9mKCckJykgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuc3RhdC52YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRzbGljZWQgPSBzbGljZWQucmVwbGFjZSgnJCcsIHRoaXMucHJvcHMuc3RhdC52YWx1ZVtpXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0c2xpY2VkID0gc2xpY2VkLnJlcGxhY2UoJyQnLHRoaXMucHJvcHMuc3RhdC52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvL2lmIHdlIGFyZSBhdCB0aGUgZmlyc3QgbG9vcCwgYWRkIGFueXRoaW5nIGZpcnN0IGFzIHRleHRcclxuXHRcdFx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaCh0ZW1wbGF0ZS5zcGxpdCgneycpWzBdKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvL2NyZWF0ZSBhbmQgcHVzaCB0aGUgdmFsdWUgaGlnaGxpZ2h0ZWQgZWxlbWVudFxyXG5cdFx0XHRcdFx0dmFyIGVsZW1lbnQgPSA8c3BhbiBjbGFzc05hbWU9J3ZhbHVlJz57c2xpY2VkfTwvc3Bhbj47XHJcblx0XHRcdFx0XHR0ZXh0LnB1c2goZWxlbWVudCk7XHJcblxyXG5cdFx0XHRcdFx0Ly9pZiBub3QgdGhlIGxhc3QgbG9vcCwgcHVzaCBhbnl0aGluZyB1bnRpbCBuZXh0IGJyYWNrZXRcclxuXHRcdFx0XHRcdGlmIChjb3VudCAhPT0gMSAmJiBpIDwgY291bnQgLSAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0SW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKCd7Jywgc3RhcnRQb3MpO1xyXG5cdFx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2UoZW5kSW5kZXgrMSwgbmV4dEluZGV4KTtcclxuXHRcdFx0XHRcdFx0dGV4dC5wdXNoKHNsaWNlZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmKGNvdW50ID09PSAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCB0ZW1wbGF0ZS5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblxyXG5cdFx0XHQ8bGkgY2xhc3NOYW1lPVwiZDMtY29sb3ItYmx1ZSBkMy1pdGVtLXByb3BlcnR5LWRlZmF1bHRcIj5cclxuXHRcdFx0XHQ8cD57dGV4dH08L3A+XHJcblx0XHRcdDwvbGk+XHJcblxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBTdGF0OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcFdlYXBvbj0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWFybW9yLXdlYXBvbiBpdGVtLXdlYXBvbi1kcHNcIj5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiYmlnXCI+PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy53ZWFwb24uZHBzfTwvc3Bhbj48L2xpPlxyXG5cdFx0XHRcdDxsaT5EYW1hZ2UgUGVyIFNlY29uZDwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWFybW9yLXdlYXBvbiBpdGVtLXdlYXBvbiBkYW1hZ2VcIj5cclxuXHRcdFx0XHQ8bGk+XHJcblx0XHRcdFx0XHQ8cD5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy53ZWFwb24ubWlufTwvc3Bhbj4gLVxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPiB7dGhpcy5wcm9wcy53ZWFwb24ubWF4fTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZDMtY29sb3ItRkY4ODg4ODhcIj4gRGFtYWdlPC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9wPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0PHA+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLnNwZWVkfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZDMtY29sb3ItRkY4ODg4ODhcIj4gQXR0YWNrcyBwZXIgU2Vjb25kPC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9wPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBXZWFwb247IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcclxuXHJcblx0RDNJdGVtVG9vbHRpcEhlYWQgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtaGVhZC5qc3gnKSxcclxuXHREM0l0ZW1Ub29sdGlwQm9keSA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC1ib2R5LmpzeCcpO1xyXG5cclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ0b29sdGlwLWNvbnRlbnRcIj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImQzLXRvb2x0aXAgZDMtdG9vbHRpcC1pdGVtXCI+XHJcblx0XHRcdFx0XHQ8RDNJdGVtVG9vbHRpcEhlYWQgaXRlbT17dGhpcy5wcm9wcy5pdGVtfSAvPlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXBCb2R5IGl0ZW09e3RoaXMucHJvcHMuaXRlbX0gLz5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5U2xvdCA9IHJlcXVpcmUoJy4vaW52ZW50b3J5LXNsb3QuanN4Jyk7XHJcbnZhciBQcmV2aW91c0ludmVudG9yeSA9IHJlcXVpcmUoJy4vcHJldmlvdXMtaW52ZW50b3J5LmpzeCcpO1xyXG52YXIgTmV4dEludmVudG9yeSA9IHJlcXVpcmUoJy4vbmV4dC1pbnZlbnRvcnkuanN4Jyk7XHJcblxyXG5cclxudmFyIEludmVudG9yeUNvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGludmVudG9yeVNsb3RzID0gW107XHJcblx0XHR2YXIga2V5PTA7XHJcblxyXG5cdFx0Ly9sb29wIHRocm91Z2ggdGhlIDEwIGNvbHVtbnMgb2YgaW52ZW50b3J5XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuXHRcdFx0dmFyIGNvbHVtbkxlbmd0aCA9IHRoaXMucHJvcHMuaW52ZW50b3J5W2ldLmxlbmd0aDtcclxuXHJcblx0XHRcdC8vYSBjaGVjayBmb3IgdGhlIHRvdGFsIGhlaWdodCBvZiB0aGlzIGNvbHVtblxyXG5cdFx0XHR2YXIgaGVpZ2h0Q291bnQgPSAwO1xyXG5cclxuXHRcdFx0Ly9hZGQgYWxsIGV4aXN0aW5nIGl0ZW1zIHRvIHRoZSBjb2x1bW5zXHJcblx0XHRcdGZvciAodmFyIGo9MDsgaiA8IGNvbHVtbkxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMuaW52ZW50b3J5W2ldW2pdICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0aGVpZ2h0Q291bnQgKz0gdGhpcy5wcm9wcy5pbnZlbnRvcnlbaV1bal0uc2l6ZTtcclxuXHRcdFx0XHRcdGludmVudG9yeVNsb3RzLnB1c2goPEludmVudG9yeVNsb3QgZGF0YT17dGhpcy5wcm9wcy5pbnZlbnRvcnlbaV1bal19IGtleT17a2V5fSBjb2x1bW49e2l9Lz4pXHJcblx0XHRcdFx0XHRrZXkrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vbm93IGZpbGwgaW4gdGhlIHJlc3Qgb2YgdGhlIGNvbHVtbiB3aXRoIGJsYW5rIHNwYWNlc1xyXG5cdFx0XHR3aGlsZShoZWlnaHRDb3VudCA8IDYpIHtcclxuXHRcdFx0XHRoZWlnaHRDb3VudCsrO1xyXG5cdFx0XHRcdGludmVudG9yeVNsb3RzLnB1c2goPEludmVudG9yeVNsb3QgZGF0YT17dW5kZWZpbmVkfSBrZXk9e2tleX0gY29sdW1uPXtpfS8+KTtcclxuXHRcdFx0XHRrZXkrKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWNvbnRhaW5lcic+XHJcblx0XHRcdFx0PFByZXZpb3VzSW52ZW50b3J5IGhhc1ByZXZpb3VzPXt0aGlzLnByb3BzLmhhc1ByZXZpb3VzfS8+XHJcblx0XHRcdFx0e2ludmVudG9yeVNsb3RzfVxyXG5cdFx0XHRcdDxOZXh0SW52ZW50b3J5IGhhc05leHQ9e3RoaXMucHJvcHMuaGFzTmV4dH0vPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5Q29udGFpbmVyIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwID0gcmVxdWlyZSgnLi4vZDMtdG9vbHRpcC9kMy10b29sdGlwLmpzeCcpO1xyXG5cclxudmFyIEludmVudG9yeVNsb3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Y29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFRvb2x0aXBPZmZzZXQoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZFVwZGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0VG9vbHRpcE9mZnNldCgpO1xyXG5cdH0sXHJcblxyXG5cdHNldFRvb2x0aXBPZmZzZXQ6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZWxlbSA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpO1xyXG5cclxuXHRcdC8vaWYgdGhlIGludmVudG9yeSBzbG90IGhhcyBjaGlsZHJlbiAoY29udGVudClcclxuXHRcdGlmIChlbGVtLmNoaWxkcmVuICYmIGVsZW0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHR2YXIgZWxlbUxvY2F0aW9uID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcblx0XHRcdHZhciB0b29sdGlwSGVpZ2h0ID0gZWxlbS5jaGlsZHJlblszXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcblx0XHRcdHZhciB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG5cdFx0XHQvL2NoZWNrIGlmIHRoZSB0b29sdGlwIGZpdHMgd2hlcmUgaXQgY3VycmVudGx5IGlzXHJcblx0XHRcdGlmICghKHRvb2x0aXBIZWlnaHQgKyBlbGVtTG9jYXRpb24gPCB3aW5kb3dIZWlnaHQpKSB7XHJcblx0XHRcdFx0dmFyIG9mZnNldCA9ICh0b29sdGlwSGVpZ2h0ICsgZWxlbUxvY2F0aW9uIC0gd2luZG93SGVpZ2h0KTtcclxuXHJcblx0XHRcdFx0Ly9pZiB0aGUgdG9vbHRpcCBpcyBiaWdnZXIgdGhhbiB3aW5kb3csIGp1c3Qgc2hvdyBhdCB0b3Agb2Ygd2luZG93XHJcblx0XHRcdFx0aWYgKG9mZnNldCA+IHdpbmRvd0hlaWdodCkge1xyXG5cdFx0XHRcdFx0ZWxlbS5jaGlsZHJlblszXS5zdHlsZS50b3AgPSAnLScrKGVsZW1Mb2NhdGlvbi0yMCkrJ3B4JztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvL2p1c3QgbW92ZSBpdCB1cCBhIGxpdHRsZSB3aXRoIGEgYml0IGF0IGJvdHRvbVxyXG5cdFx0XHRcdFx0ZWxlbS5jaGlsZHJlblszXS5zdHlsZS50b3AgPSAnLScrKG9mZnNldCsxMCkrJ3B4JztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBzbG90Q29udGVudD0gW107XHJcblx0XHR2YXIgc2xvdENsYXNzPSdpbnZlbnRvcnktc2xvdCc7XHJcblx0XHQvL2NoZWNrIHRvIG1ha2Ugc3VyZSBhbiBhY3R1YWwgaXRlbSBpcyBpbiB0aGUgaW52ZW50b3J5IHNsb3RcclxuXHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5kYXRhICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHQvL2NoYW5nZSB0aGUgc2l6ZSB0byBsYXJnZSBpZiBpdCBpcyBhIGxhcmdlIGl0ZW1cclxuXHRcdFx0aWYodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdzaXplJykgJiYgdGhpcy5wcm9wcy5kYXRhLnNpemUgPT09IDIpIHtcclxuXHRcdFx0XHRzbG90Q2xhc3MgKz0gJyBsYXJnZSc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgncmFyaXR5JykpIHtcclxuXHRcdFx0XHR2YXIgYmd1cmw7XHJcblx0XHRcdFx0dmFyIGJvcmRlckNvbG9yPScjMzAyYTIxJztcclxuXHJcblx0XHRcdFx0c3dpdGNoKHRoaXMucHJvcHMuZGF0YS5yYXJpdHkpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ21hZ2ljJzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9J2ltZy9ibHVlLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjNzk3OWQ0JztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdyYXJlJzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9J2ltZy95ZWxsb3cucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyNmOGNjMzUnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZ2VuZGFyeSc6XHJcblx0XHRcdFx0XHRcdGJndXJsPSdpbWcvb3JhbmdlLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjYmY2NDJmJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdhbmNpZW50JzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9J2ltZy9vcmFuZ2UucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyNiZjY0MmYnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdC8vbm9vcFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9zd2l0Y2ggYmcgdG8gZ3JlZW4gaWYgaXRlbSBpcyBwYXJ0IG9mIGEgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykpIHtcclxuXHRcdFx0XHRcdGJndXJsPSdpbWcvZ3JlZW4ucG5nJztcclxuXHRcdFx0XHRcdGJvcmRlckNvbG9yPScjOGJkNDQyJztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2YgYmd1cmwgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR2YXIgaW5saW5lID0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK2JndXJsKycpJ1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHNsb3RDb250ZW50LnB1c2goPGRpdiBzdHlsZT17aW5saW5lfSBjbGFzc05hbWU9J2ludmVudG9yeS1iZyc+PC9kaXY+KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9zZXQgdGhlIGl0ZW0gaW1hZ2VcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnaW1hZ2UnKSkge1xyXG5cdFx0XHRcdHZhciBpbmxpbmUgPSB7YmFja2dyb3VuZEltYWdlOid1cmwoJyt0aGlzLnByb3BzLmRhdGEuaW1hZ2UrJyknfTtcclxuXHRcdFx0XHRzbG90Q29udGVudC5wdXNoKDxkaXYgc3R5bGU9e2lubGluZX0gY2xhc3NOYW1lPSdpbnZlbnRvcnktaW1hZ2UnPjwvZGl2Pik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vYWRkIGEgbGluayB0byBhY3RpdmF0ZSB0b29sdGlwXHJcblx0XHRcdHNsb3RDb250ZW50LnB1c2goPGEgY2xhc3NOYW1lPSd0b29sdGlwLWxpbmsnPjwvYT4pO1xyXG5cclxuXHRcdFx0Ly9hZGQgYSBoaWRkZW4gdG9vbHRpcFxyXG5cdFx0XHR2YXIgaW5saW5lO1xyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5jb2x1bW4gPCA1KSB7XHJcblx0XHRcdFx0aW5saW5lID0ge2xlZnQ6JzUwcHgnfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpbmxpbmUgPSB7cmlnaHQ6JzUwcHgnfTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2xvdENvbnRlbnQucHVzaChcclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1jb250YWluZXInIHN0eWxlPXtpbmxpbmV9PlxyXG5cdFx0XHRcdDxEM0l0ZW1Ub29sdGlwIGl0ZW09e3RoaXMucHJvcHMuZGF0YX0vPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQpXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtzbG90Q2xhc3N9IHN0eWxlPXt7Ym9yZGVyQ29sb3I6Ym9yZGVyQ29sb3J9fT5cclxuXHRcdFx0XHR7c2xvdENvbnRlbnR9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnlTbG90OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5Q29udGFpbmVyID0gcmVxdWlyZSgnLi9pbnZlbnRvcnktY29udGFpbmVyLmpzeCcpO1xyXG52YXIgSW52ZW50b3J5U3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvSW52ZW50b3J5U3RvcmUnKTtcclxuXHJcbnZhciBJbnZlbnRvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBJbnZlbnRvcnlTdG9yZS5nZXRJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEludmVudG9yeVN0b3JlLmdldEludmVudG9yeSgpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LXNlY3Rpb24nPlxyXG5cdFx0XHRcdDxJbnZlbnRvcnlDb250YWluZXIgXHJcblx0XHRcdFx0XHRpbnZlbnRvcnk9e3RoaXMuc3RhdGUuY3VycmVudEludmVudG9yeX0gXHJcblx0XHRcdFx0XHRoYXNQcmV2aW91cz17dHlwZW9mIHRoaXMuc3RhdGUucHJldmlvdXNJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnfSBcclxuXHRcdFx0XHRcdGhhc05leHQ9e3R5cGVvZiB0aGlzLnN0YXRlLm5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBOZXh0SW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMubmV4dEludmVudG9yeSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbic7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzTmV4dCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgZGlzYWJsZWQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktYnV0dG9uLWNvbnRhaW5lcic+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLl9oYW5kbGVDbGlja30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMzZcIiBoZWlnaHQ9XCIzNlwiIHZpZXdCb3g9XCIwIDAgMzYgMzZcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0xNSA5bC0yLjEyIDIuMTJMMTkuNzYgMThsLTYuODggNi44OEwxNSAyN2w5LTl6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZXh0SW52ZW50b3J5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgUHJldmlvdXNJbnZlbnRvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5wcmV2aW91c0ludmVudG9yeSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbic7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzUHJldmlvdXMpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWJ1dHRvbi1jb250YWluZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMjMuMTIgMTEuMTJMMjEgOWwtOSA5IDkgOSAyLjEyLTIuMTJMMTYuMjQgMTh6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcmV2aW91c0ludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIENsYXNzU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdC8vc3RhdGUgaXMgaGFuZGxlZCBpbiB0aGUgcGFyZW50IGNvbXBvbmVudFxyXG5cdC8vdGhpcyBmdW5jdGlvbiBpcyB1cCB0aGVyZVxyXG5cdGhhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VDbGFzcyh0aGlzLnByb3BzLm5hbWUpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2hvcnRlbmVkTmFtZXMgPSB7XHJcblx0XHRcdEJhcmJhcmlhbjonYmFyYicsXHJcblx0XHRcdENydXNhZGVyOidjcnVzJyxcclxuXHRcdFx0J0RlbW9uIEh1bnRlcic6J2RoJyxcclxuXHRcdFx0TW9uazonbW9uaycsXHJcblx0XHRcdCdXaXRjaCBEb2N0b3InOid3ZCcsXHJcblx0XHRcdFdpemFyZDond2l6J1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBidXR0b25DbGFzcyA9ICdjbGFzcy1zZWxlY3Rvcic7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgc2VsZWN0ZWQnXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGltYWdlQ2xhc3M9IHRoaXMucHJvcHMubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCcnKTtcclxuXHRcdGltYWdlQ2xhc3MrPSB0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxsaT5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0PGltZyBzcmM9e3RoaXMucHJvcHMuaW1hZ2V9IGNsYXNzTmFtZT17aW1hZ2VDbGFzc30+PC9pbWc+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5uYW1lLnRvTG93ZXJDYXNlKCl9PC9zcGFuPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwic2hvcnRlbmVkXCI+e3Nob3J0ZW5lZE5hbWVzW3RoaXMucHJvcHMubmFtZV19PC9zcGFuPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2xpPlxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2xhc3NTZWxlY3RvckJ1dHRvbjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgQ2xhc3NTZWxlY3RvckJ1dHRvbiA9IHJlcXVpcmUoJy4vY2xhc3Mtc2VsZWN0b3ItYnV0dG9uLmpzeCcpO1xyXG5cclxudmFyIENsYXNzU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkQ2xhc3NlcyA9IFsnQmFyYmFyaWFuJywnQ3J1c2FkZXInLCdEZW1vbiBIdW50ZXInLCdNb25rJywnV2l0Y2ggRG9jdG9yJywnV2l6YXJkJ107XHJcblx0XHR2YXIgZENsYXNzZXNMZW5ndGggPSBkQ2xhc3Nlcy5sZW5ndGg7XHJcblxyXG5cdFx0dmFyIGNsYXNzU2VsZWN0b3JzID0gW107XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwgZENsYXNzZXNMZW5ndGg7aSsrKSB7XHJcblxyXG5cdFx0XHQvL2NoZWNrIGZvciBzZWxlY3RlZCBjbGFzcyBzdG9yZWQgaW4gc3RhdGUgb2YgdGhpcyBjb21wb25lbnRcclxuXHRcdFx0dmFyIHNlbGVjdGVkID0gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdGVkID09PSBkQ2xhc3Nlc1tpXSkge1xyXG5cdFx0XHRcdHNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9wdXQgc2VsZWN0b3JzIGluIGFycmF5IHRvIGJlIHJlbmRlcmVkXHJcblx0XHRcdGNsYXNzU2VsZWN0b3JzLnB1c2goXHJcblx0XHRcdFx0PENsYXNzU2VsZWN0b3JCdXR0b24gXHJcblx0XHRcdFx0XHRuYW1lPXtkQ2xhc3Nlc1tpXX0gXHJcblx0XHRcdFx0XHRjaGFuZ2VDbGFzcz17dGhpcy5wcm9wcy5jaGFuZ2VDbGFzc30gXHJcblx0XHRcdFx0XHRrZXk9e2l9IFxyXG5cdFx0XHRcdFx0c2VsZWN0ZWQ9e3NlbGVjdGVkfVxyXG5cdFx0XHRcdFx0Z2VuZGVyPXt0aGlzLnByb3BzLmdlbmRlcn1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdFx0PHVsIGNsYXNzTmFtZT0nY2xhc3Mtc2VsZWN0b3InPlxyXG5cdFx0XHRcdFx0e2NsYXNzU2VsZWN0b3JzfVxyXG5cdFx0XHRcdDwvdWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2xhc3NTZWxlY3RvcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHR1cGRhdGVHZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnByb3BzLmNoYW5nZUdlbmRlcih0aGlzLnByb3BzLmdlbmRlcik7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBidXR0b25DbGFzcz0nZ2VuZGVyLXNlbGVjdG9yICcrdGhpcy5wcm9wcy5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuXHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdGVkKSB7XHJcblx0XHRcdGJ1dHRvbkNsYXNzKz0gJyBzZWxlY3RlZCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2J1dHRvbi13cmFwcGVyJz5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMudXBkYXRlR2VuZGVyfSA+XHJcblx0XHRcdFx0XHQ8aW1nIC8+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5nZW5kZXIudG9Mb3dlckNhc2UoKX08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5kZXJTZWxlY3RvckJ1dHRvbjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9nZW5kZXItc2VsZWN0b3ItYnV0dG9uLmpzeCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWFsZVNlbGVjdGVkID0gKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09ICdNYWxlJyk7XHJcblx0XHR2YXIgZmVtYWxlU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gJ0ZlbWFsZScpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdnZW5kZXItc2VsZWN0b3InPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvckJ1dHRvbiBnZW5kZXI9J01hbGUnIGNoYW5nZUdlbmRlcj17dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXttYWxlU2VsZWN0ZWR9IC8+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yQnV0dG9uIGdlbmRlcj0nRmVtYWxlJyBjaGFuZ2VHZW5kZXI9e3RoaXMucHJvcHMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17ZmVtYWxlU2VsZWN0ZWR9IC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5kZXJTZWxlY3RvcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEhhcmRjb3JlQ2hlY2tib3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0dXBkYXRlSGFyZGNvcmU6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlSGFyZGNvcmUoIXRoaXMucHJvcHMuaGFyZGNvcmUpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjaGVja2JveC13cmFwcGVyJz5cclxuXHRcdFx0XHQ8bGFiZWw+XHJcblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGNsYXNzTmFtZT0nb3B0aW9ucy1jaGVja2JveCcgY2hlY2tlZD17dGhpcy5wcm9wcy5oYXJkY29yZX0gb25DaGFuZ2U9e3RoaXMudXBkYXRlSGFyZGNvcmV9Lz5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nY2hlY2tib3gtbGFiZWwnPkhhcmRjb3JlIDxzcGFuIGNsYXNzTmFtZT0naGlkZGVuLXNtJz5IZXJvPC9zcGFuPjwvc3Bhbj5cclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFyZGNvcmVDaGVja2JveDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIENsYXNzU2VsZWN0b3IgPSByZXF1aXJlKCcuL2NsYXNzLXNlbGVjdG9yLmpzeCcpO1xyXG52YXIgR2VuZGVyU2VsZWN0b3IgPSByZXF1aXJlKCcuL2dlbmRlci1zZWxlY3Rvci5qc3gnKTtcclxudmFyIFNlYXNvbmFsQ2hlY2tib3ggPSByZXF1aXJlKCcuL3NlYXNvbmFsLWNoZWNrYm94LmpzeCcpO1xyXG52YXIgSGFyZGNvcmVDaGVja2JveCA9IHJlcXVpcmUoJy4vaGFyZGNvcmUtY2hlY2tib3guanN4Jyk7XHJcblxyXG52YXIgT3B0aW9uc1BhbmVsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaW5pdGlhbCA9IHtcclxuXHRcdFx0ZENsYXNzOidCYXJiYXJpYW4nLFxyXG5cdFx0XHRnZW5kZXI6J0ZlbWFsZScsXHJcblx0XHRcdGhhcmRjb3JlOmZhbHNlLFxyXG5cdFx0XHRzZWFzb25hbDp0cnVlXHJcblx0XHR9O1xyXG5cdFx0ZDNzaW0uc2V0S2FkYWxhKGluaXRpYWwuZENsYXNzLGluaXRpYWwuc2Vhc29uYWwsaW5pdGlhbC5oYXJkY29yZSk7XHJcblx0XHRyZXR1cm4gaW5pdGlhbDtcclxuXHR9LFxyXG5cclxuXHRjaGFuZ2VHZW5kZXI6ZnVuY3Rpb24oZ2VuZGVyKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0Z2VuZGVyOmdlbmRlclxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGFuZ2VDbGFzczpmdW5jdGlvbihkQ2xhc3MpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRkQ2xhc3M6ZENsYXNzXHJcblx0XHR9LGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRkM3NpbS5zZXRLYWRhbGEodGhpcy5zdGF0ZS5kQ2xhc3MsdGhpcy5zdGF0ZS5zZWFzb25hbCx0aGlzLnN0YXRlLmhhcmRjb3JlKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hhbmdlSGFyZGNvcmU6ZnVuY3Rpb24oYm9vbCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGhhcmRjb3JlOmJvb2xcclxuXHRcdH0sZnVuY3Rpb24oKSB7XHJcblx0XHRcdGQzc2ltLnNldEthZGFsYSh0aGlzLnN0YXRlLmRDbGFzcyx0aGlzLnN0YXRlLnNlYXNvbmFsLHRoaXMuc3RhdGUuaGFyZGNvcmUpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGFuZ2VTZWFzb25hbDpmdW5jdGlvbihib29sKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0c2Vhc29uYWw6Ym9vbFxyXG5cdFx0fSxmdW5jdGlvbigpIHtcclxuXHRcdFx0ZDNzaW0uc2V0S2FkYWxhKHRoaXMuc3RhdGUuZENsYXNzLHRoaXMuc3RhdGUuc2Vhc29uYWwsdGhpcy5zdGF0ZS5oYXJkY29yZSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c2VjdGlvbiBjbGFzc05hbWU9J29wdGlvbnMtcGFuZWwnPlxyXG5cdFx0XHRcdDxDbGFzc1NlbGVjdG9yIGNoYW5nZUNsYXNzPXt0aGlzLmNoYW5nZUNsYXNzfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5kQ2xhc3N9IGdlbmRlcj17dGhpcy5zdGF0ZS5nZW5kZXJ9Lz5cclxuXHRcdFx0XHQ8R2VuZGVyU2VsZWN0b3IgY2hhbmdlR2VuZGVyPXt0aGlzLmNoYW5nZUdlbmRlcn0gc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuZ2VuZGVyfS8+XHJcblx0XHRcdFx0PFNlYXNvbmFsQ2hlY2tib3ggc2Vhc29uYWw9e3RoaXMuc3RhdGUuc2Vhc29uYWx9IGNoYW5nZVNlYXNvbmFsPXt0aGlzLmNoYW5nZVNlYXNvbmFsfS8+XHJcblx0XHRcdFx0PEhhcmRjb3JlQ2hlY2tib3ggaGFyZGNvcmU9e3RoaXMuc3RhdGUuaGFyZGNvcmV9IGNoYW5nZUhhcmRjb3JlPXt0aGlzLmNoYW5nZUhhcmRjb3JlfS8+XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uc1BhbmVsOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHR1cGRhdGVTZWFzb25hbDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlU2Vhc29uYWwoIXRoaXMucHJvcHMuc2Vhc29uYWwpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjaGVja2JveC13cmFwcGVyJz5cclxuXHRcdFx0XHQ8bGFiZWw+XHJcblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGNsYXNzTmFtZT0nb3B0aW9ucy1jaGVja2JveCcgY2hlY2tlZD17dGhpcy5wcm9wcy5zZWFzb25hbH0gb25DaGFuZ2U9e3RoaXMudXBkYXRlU2Vhc29uYWx9Lz5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nY2hlY2tib3gtbGFiZWwnPlNlYXNvbmFsIDxzcGFuIGNsYXNzTmFtZT0naGlkZGVuLXNtJz5IZXJvPC9zcGFuPjwvc3Bhbj5cclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Vhc29uYWxDaGVja2JveDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBLYWRhbGFJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge3NoYXJkQ291bnQ6MH07XHJcblx0fSxcclxuXHRidXlJdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0Ly9pbmNyZW1lbnQgdGhlIGJsb29kIHNoYXJkIGNvdW50XHJcblx0XHR2YXIgY3VycmVudENvdW50ID0gdGhpcy5zdGF0ZS5zaGFyZENvdW50O1xyXG5cdFx0Y3VycmVudENvdW50ICs9IHRoaXMucHJvcHMuaXRlbS5jb3N0O1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2hhcmRDb3VudDpjdXJyZW50Q291bnR9KTtcclxuXHJcblx0XHR2YXIgaXRlbSA9IGQzc2ltLmthZGFsYVJvbGwodGhpcy5wcm9wcy5pdGVtLnR5cGUpO1xyXG5cdFx0aXRlbS5zaXplID0gdGhpcy5wcm9wcy5pdGVtLnNpemU7XHJcblx0XHRBcHBBY3Rpb25zLmFkZEl0ZW0oaXRlbSk7XHJcblx0fSxcclxuXHRyZXNldENvdW50OmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2hhcmRDb3VudDowfSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2thZGFsYS1pdGVtJz5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT0na2FkYWxhJyBvbkNsaWNrPXt0aGlzLmJ1eUl0ZW19PlxyXG5cdFx0XHRcdFx0PGltZyBjbGFzc05hbWU9J2thZGFsYS1pY29uJy8+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5pdGVtLmNvc3R9PC9zcGFuPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdrYWRhbGEtY29udGVudCc+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2thZGFsYS1pdGVtLXRpdGxlJz57dGhpcy5wcm9wcy5pdGVtLnRleHR9PC9zcGFuPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdzaGFyZC1jb3VudCc+XHJcblx0XHRcdFx0XHRcdHt0aGlzLnN0YXRlLnNoYXJkQ291bnR9XHJcblx0XHRcdFx0XHRcdDxhIGNsYXNzTmFtZT0nc2hhcmQtZGVsZXRlJyBvbkNsaWNrPXt0aGlzLnJlc2V0Q291bnR9PlxyXG5cdFx0XHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0elwiLz5cclxuXHRcdFx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHRcdFx0PC9hPlxyXG5cdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2FkYWxhSXRlbTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEthZGFsYUl0ZW0gPSByZXF1aXJlKCcuL2thZGFsYS1pdGVtLmpzeCcpO1xyXG5cclxudmFyIEthZGFsYVN0b3JlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgaXRlbXMgPSBbXHJcblx0XHRcdHt0eXBlOidoZWxtJyx0ZXh0OidNeXN0ZXJ5IEhlbG1ldCcsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonYm9vdHMnLHRleHQ6J015c3RlcnkgQm9vdHMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2JlbHQnLHRleHQ6J015c3RlcnkgQmVsdCcsY29zdDoyNSxzaXplOjF9LFxyXG5cdFx0XHR7dHlwZToncGFudHMnLHRleHQ6J015c3RlcnkgUGFudHMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2dsb3ZlcycsdGV4dDonTXlzdGVyeSBHbG92ZXMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2NoZXN0Jyx0ZXh0OidNeXN0ZXJ5IENoZXN0Jyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidzaG91bGRlcnMnLHRleHQ6J015c3RlcnkgU2hvdWxkZXJzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidicmFjZXJzJyx0ZXh0OidNeXN0ZXJ5IEJyYWNlcnMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3F1aXZlcicsdGV4dDonTXlzdGVyeSBRdWl2ZXInLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J21vam8nLHRleHQ6J015c3RlcnkgTW9qbycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonc291cmNlJyx0ZXh0OidNeXN0ZXJ5IFNvdXJjZScsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonc2hpZWxkJyx0ZXh0OidNeXN0ZXJ5IFNoaWVsZCcsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonb25laGFuZCcsdGV4dDonMS1IIE15c3RlcnkgV2VhcG9uJyxjb3N0Ojc1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOid0d29oYW5kJyx0ZXh0OicyLUggTXlzdGVyeSBXZWFwb24nLGNvc3Q6NzUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3JpbmcnLHRleHQ6J015c3RlcnkgUmluZycsY29zdDo1MCxzaXplOjF9LFxyXG5cdFx0XHR7dHlwZTonYW11bGV0Jyx0ZXh0OidNeXN0ZXJ5IEFtdWxldCcsY29zdDoxMDAsc2l6ZToxfVxyXG5cdFx0XVxyXG5cclxuXHRcdHZhciBrYWRhbGFTbG90cyA9IFtdO1xyXG5cdFx0dmFyIGl0ZW1zTGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xyXG5cdFx0Zm9yICh2YXIgaSA9MDsgaSA8IGl0ZW1zTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0a2FkYWxhU2xvdHMucHVzaCg8S2FkYWxhSXRlbSBrZXk9e2l9IGl0ZW09e2l0ZW1zW2ldfSAvPik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2thZGFsYS1zdG9yZSc+XHJcblx0XHRcdFx0e2thZGFsYVNsb3RzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2FkYWxhU3RvcmU7IiwidmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xyXG5cdEFERF9JVEVNOm51bGwsXHJcblxyXG5cdFBSRVZfSU5WOm51bGwsXHJcblx0TkVYVF9JTlY6bnVsbFxyXG59KTsiLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpOyIsInZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XHJcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XHJcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcblxyXG52YXIgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XHJcblxyXG4vL3RoZXJlIGFyZSBvbmx5IHR3byBpbnZlbnRvcmllcyBiZWluZyB1c2VkIHdpdGggdGhlIGFiaWxpdHkgdG8gY3ljbGUgYmFja1xyXG52YXIgcHJldmlvdXNJbnZlbnRvcnk7XHJcbnZhciBjdXJyZW50SW52ZW50b3J5O1xyXG52YXIgbmV4dEludmVudG9yeTtcclxuXHJcbi8vY3JlYXRlcyBuZXN0ZWQgYXJyYXkgYmxhbmsgaW52ZW50b3J5IGFuZCBzZXRzIGFzIHRoZSBjdXJyZW50IGludmVudG9yeVxyXG5mdW5jdGlvbiBjcmVhdGVJbnZlbnRvcnkoKSB7XHJcblx0dmFyIG5ld0ludmVudG9yeSA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTwxMDtpKyspIHtcclxuXHRcdC8vcHVzaCBhIGJsYW5rIGFycmF5IHRvIHJlcHJlc2VudCBlYWNoIGNvbHVtbiBvZiB0aGUgaW52ZW50b3J5XHJcblx0XHRuZXdJbnZlbnRvcnkucHVzaChbXSk7XHJcblx0fVxyXG5cclxuXHQvL3NldCB0aGUgcHJldmlvdXMgaW52ZW50b3J5IHRvIHRoZSBsYXRlc3QgaW52ZW50b3J5IHVzZWRcclxuXHRwcmV2aW91c0ludmVudG9yeSA9IG5leHRJbnZlbnRvcnkgfHwgY3VycmVudEludmVudG9yeSB8fCB1bmRlZmluZWQ7XHJcblx0Ly90aGUgbmV3IGJsYW5rIGludmVudG9yeSBpcyBub3cgdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcblx0Y3VycmVudEludmVudG9yeSA9IG5ld0ludmVudG9yeTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW52ZW50b3J5KCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeTpwcmV2aW91c0ludmVudG9yeSxcclxuXHRcdGN1cnJlbnRJbnZlbnRvcnk6Y3VycmVudEludmVudG9yeSxcclxuXHRcdG5leHRJbnZlbnRvcnk6bmV4dEludmVudG9yeVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEl0ZW0oaXRlbSkge1xyXG5cdHZhciBpbnZlbnRvcnlMZW5ndGggPSBjdXJyZW50SW52ZW50b3J5Lmxlbmd0aDtcclxuXHQvL2xvb3BpbmcgdGhyb3VnaCBlYWNoIGNvbHVtbiBvZiB0aGUgaW52ZW50b3J5XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbnZlbnRvcnlMZW5ndGg7IGkgKyspIHtcclxuXHRcdC8vbG9vcCB0aHJvdWdoIGVhY2ggaXRlbSBpbiBzYWlkIGNvbHVtblxyXG5cdFx0dmFyIGNvbHVtbkxlbmd0aCA9IGN1cnJlbnRJbnZlbnRvcnlbaV0ubGVuZ3RoO1xyXG5cdFx0dmFyIGNvbHVtbkhlaWdodCA9IDA7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvbHVtbkxlbmd0aDsgaisrKSB7XHJcblx0XHRcdC8vYWRkIGN1cnJlbnQgaXRlbSBzaXplIHRvIGNvbHVtbiBoZWlnaHRcclxuXHRcdFx0aWYoY3VycmVudEludmVudG9yeVtpXVtqXS5oYXNPd25Qcm9wZXJ0eSgnc2l6ZScpKSB7XHJcblx0XHRcdFx0Y29sdW1uSGVpZ2h0Kz1jdXJyZW50SW52ZW50b3J5W2ldW2pdLnNpemU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vY2hlY2sgaWYgdGhlIGhlaWdodCBpcyBzdGlsbCBsZXNzIHRoYW4gNiB3aXRoIG5ldyBpdGVtXHJcblx0XHQvL2FuZCBhZGQgdG8gdGhhdCBjb2x1bW4gYW5kIHJldHVybiB0byBzdG9wIHRoZSBtYWRuZXNzXHJcblx0XHRpZiAoY29sdW1uSGVpZ2h0K2l0ZW0uc2l6ZSA8PTYpIHtcclxuXHRcdFx0Y3VycmVudEludmVudG9yeVtpXS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvL2lmIHdlIG1hZGUgaXQgdGhpcyBmYXIgdGhlIG5ldyBpdGVtIGRvZXMgbm90IGZpdCBpbiB0aGUgY3VycmVudCBpbnZlbnRvcnlcclxuXHQvL2NoZWNrIHRvIHNlZSBpZiB0aGVyZSBpcyBhIG5leHQgaW52ZW50b3J5XHJcblx0Ly9zbyB0aGF0IHdlIGNhbiBjeWNsZSB0byBuZXh0IGludmVudG9yeSBhbmQgdHJ5IGFuZCBmaXQgaXQgaW5cclxuXHRpZiAodHlwZW9mIG5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRnb3RvTmV4dCgpO1xyXG5cdFx0YWRkSXRlbShpdGVtKTtcclxuXHR9XHJcblx0Ly90aGVyZSBpcyBubyBuZXh0IGludmVudG9yeSBhbmQgd2UgbmVlZCB0byBtYWtlIGEgbmV3IG9uZVxyXG5cdGVsc2Uge1xyXG5cdFx0Y3JlYXRlSW52ZW50b3J5KCk7XHJcblx0XHRhZGRJdGVtKGl0ZW0pO1xyXG5cdH1cclxufVxyXG5cclxuLy9jeWNsZXMgdGhyb3VnaCB0byB0aGUgcHJldmlvdXMgaW52ZW50b3J5XHJcbmZ1bmN0aW9uIGdvdG9QcmV2aW91cygpIHtcclxuXHRpZih0eXBlb2YgcHJldmlvdXNJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRuZXh0SW52ZW50b3J5ID0gY3VycmVudEludmVudG9yeTtcclxuXHRcdGN1cnJlbnRJbnZlbnRvcnkgPSBwcmV2aW91c0ludmVudG9yeTtcclxuXHRcdHByZXZpb3VzSW52ZW50b3J5ID0gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuLy9jeWNsZXMgdGhyb3VnaCB0byB0aGUgbmV4dCBpbnZlbnRvcnlcclxuZnVuY3Rpb24gZ290b05leHQoKSB7XHJcblx0aWYodHlwZW9mIG5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeSA9IGN1cnJlbnRJbnZlbnRvcnk7XHJcblx0XHRjdXJyZW50SW52ZW50b3J5ID0gbmV4dEludmVudG9yeTtcclxuXHRcdG5leHRJbnZlbnRvcnkgPSB1bmRlZmluZWQ7XHJcblx0fVxyXG59XHJcblxyXG4vL2luaXRpYWxpemUgc3RvcmUgYnkgY3JlYXRpbmcgYSBibGFuayBpbnZlbnRvcnlcclxuY3JlYXRlSW52ZW50b3J5KCk7XHJcblxyXG52YXIgSW52ZW50b3J5U3RvcmUgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUse1xyXG5cdGdldEludmVudG9yeTpnZXRJbnZlbnRvcnksXHJcblx0Z290b1ByZXZpb3VzOmdvdG9QcmV2aW91cyxcclxuXHRnb3RvTmV4dDpnb3RvTmV4dCxcclxuXHRhZGRJdGVtOmFkZEl0ZW0sXHJcblxyXG5cdGVtaXRDaGFuZ2U6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuZW1pdChDSEFOR0VfRVZFTlQpO1xyXG5cdH0sXHJcblx0YWRkQ2hhbmdlTGlzdGVuZXI6ZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMub24oQ0hBTkdFX0VWRU5ULGNhbGxiYWNrKTtcclxuXHR9LFxyXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCxjYWxsYmFjayk7XHJcblx0fVxyXG59KTtcclxuXHJcbkFwcERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24oYWN0aW9uKSB7XHJcblx0c3dpdGNoKGFjdGlvbi5hY3Rpb25UeXBlKSB7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuQUREX0lURU06XHJcblx0XHRcdGFkZEl0ZW0oYWN0aW9uLml0ZW0pO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLlBSRVZfSU5WOlxyXG5cdFx0XHRnb3RvUHJldmlvdXMoKTtcclxuXHRcdFx0SW52ZW50b3J5U3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5ORVhUX0lOVjpcclxuXHRcdFx0Z290b05leHQoKTtcclxuXHRcdFx0SW52ZW50b3J5U3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHQvL25vb3BcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnlTdG9yZTsiXX0=
