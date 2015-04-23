(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var Navbar = require('./components/nav/navbar.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var KadalaStore = require('./components/kadala-store/kadala-store.jsx');
var Inventory = require('./components/inventory/inventory.jsx');

var Application = React.createClass({displayName: "Application",
	render:function() {
		return (
			React.createElement("div", null, 
			React.createElement(Navbar, null), 
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
			)
		);
	}
});

React.render(
	React.createElement(Application, null),
	document.getElementById('app')
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./components/inventory/inventory.jsx":18,"./components/kadala-options/options-panel.jsx":26,"./components/kadala-store/kadala-store.jsx":29,"./components/nav/navbar.jsx":30}],2:[function(require,module,exports){
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

},{"../constants/AppConstants":31,"../dispatcher/AppDispatcher":32}],9:[function(require,module,exports){
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

		return (

			React.createElement("li", {className: "d3-color-blue d3-item-property-default"}, 
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

},{"./inventory-slot.jsx":17,"./next-inventory.jsx":19,"./previous-inventory.jsx":20}],17:[function(require,module,exports){
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

},{"../d3-tooltip/d3-tooltip.jsx":15}],18:[function(require,module,exports){
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

},{"../../stores/InventoryStore":33,"./inventory-container.jsx":16}],19:[function(require,module,exports){
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

},{"../../actions/AppActions":8}],20:[function(require,module,exports){
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

},{"../../actions/AppActions":8}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"./class-selector-button.jsx":21}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./gender-selector-button.jsx":23}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{"./class-selector.jsx":22,"./gender-selector.jsx":24,"./hardcore-checkbox.jsx":25,"./seasonal-checkbox.jsx":27}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"../../actions/AppActions":8}],29:[function(require,module,exports){
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

},{"./kadala-item.jsx":28}],30:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var Navbar = React.createClass({displayName: "Navbar",
	getInitialState:function() {
		return {
			options:false,
			store:false
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
				React.createElement("button", {className: "buy"}, "Buy more Shit"), 
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

},{}],31:[function(require,module,exports){
var keyMirror = require('keymirror');

module.exports = keyMirror({
	ADD_ITEM:null,

	PREV_INV:null,
	NEXT_INV:null
});

},{"keymirror":6}],32:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":3}],33:[function(require,module,exports){
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

},{"../constants/AppConstants":31,"../dispatcher/AppDispatcher":32,"events":2,"object-assign":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxhY3Rpb25zXFxBcHBBY3Rpb25zLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWFybW9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1ib2R5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1mbGF2b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWhlYWQuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLXN0YXQuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLXdlYXBvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXGludmVudG9yeS1jb250YWluZXIuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXGludmVudG9yeS1zbG90LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxpbnZlbnRvcnkuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXG5leHQtaW52ZW50b3J5LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW52ZW50b3J5XFxwcmV2aW91cy1pbnZlbnRvcnkuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcY2xhc3Mtc2VsZWN0b3ItYnV0dG9uLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGNsYXNzLXNlbGVjdG9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGdlbmRlci1zZWxlY3Rvci1idXR0b24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcZ2VuZGVyLXNlbGVjdG9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGhhcmRjb3JlLWNoZWNrYm94LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXG9wdGlvbnMtcGFuZWwuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcc2Vhc29uYWwtY2hlY2tib3guanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtc3RvcmVcXGthZGFsYS1pdGVtLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLXN0b3JlXFxrYWRhbGEtc3RvcmUuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxuYXZcXG5hdmJhci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbnN0YW50c1xcQXBwQ29uc3RhbnRzLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxkaXNwYXRjaGVyXFxBcHBEaXNwYXRjaGVyLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxzdG9yZXNcXEludmVudG9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDcEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUM7QUFDNUUsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFDeEUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7O0FBRWhFLElBQUksaUNBQWlDLDJCQUFBO0NBQ3BDLE1BQU0sQ0FBQyxXQUFXO0VBQ2pCO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLElBQUMsRUFBQTtHQUNMLG9CQUFDLE1BQU0sRUFBQSxJQUFBLENBQUcsQ0FBQSxFQUFBO0dBQ1Ysb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBO0lBQ2hDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsS0FBTSxDQUFBLEVBQUE7S0FDcEIsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxVQUFXLENBQUEsRUFBQTtNQUN6QixvQkFBQyxZQUFZLEVBQUEsSUFBQSxDQUFHLENBQUE7S0FDWCxDQUFBLEVBQUE7S0FDTixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLFVBQVcsQ0FBQSxFQUFBO01BQ3pCLG9CQUFDLFdBQVcsRUFBQSxJQUFBLENBQUcsQ0FBQSxFQUFBO01BQ2Ysb0JBQUMsU0FBUyxFQUFBLElBQUEsQ0FBRyxDQUFBO0tBQ1IsQ0FBQTtJQUNELENBQUEsRUFBQTtJQUNOLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsS0FBTSxDQUFBO0lBQ2YsQ0FBQTtHQUNELENBQUE7R0FDQSxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILEtBQUssQ0FBQyxNQUFNO0NBQ1gsb0JBQUMsV0FBVyxFQUFBLElBQUEsQ0FBRyxDQUFBO0NBQ2YsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7Q0FDOUI7Ozs7O0FDakNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkEsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRXhELElBQUksVUFBVSxHQUFHOztDQUVoQixPQUFPLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDdkIsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixV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Qzs7RUFFaEIsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7R0FDaEQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZDLEdBQUcsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3JDOztJQUVJLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsT0FBTyxRQUFRLEtBQUssQ0FBQyxDQUFDLEVBQUU7S0FDdkIsS0FBSyxFQUFFO0tBQ1AsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxLQUFLOztJQUVELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNyQixJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQzs7SUFFZixLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQzlCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRCxRQUFRLEdBQUcsVUFBVSxDQUFDO0tBQ3RCLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLEtBQUssSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEQ7O0tBRUssSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFF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LENBQUMsQ0FBQztFQUMzQztBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxNQUFNLEVBQUU7QUFDeEMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxVQUFVOztFQUV2QixLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDckIsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLFlBQVksRUFBRSxDQUFDO0dBQ2YsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLFFBQVEsRUFBRSxDQUFDO0dBQ1gsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7QUFFVCxFQUFFLFFBQVE7O0VBRVI7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvbmF2L25hdmJhci5qc3gnKTtcclxudmFyIE9wdGlvbnNQYW5lbCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9rYWRhbGEtb3B0aW9ucy9vcHRpb25zLXBhbmVsLmpzeCcpO1xyXG52YXIgS2FkYWxhU3RvcmUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMva2FkYWxhLXN0b3JlL2thZGFsYS1zdG9yZS5qc3gnKTtcclxudmFyIEludmVudG9yeSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9pbnZlbnRvcnkvaW52ZW50b3J5LmpzeCcpO1xyXG5cclxudmFyIEFwcGxpY2F0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdDxOYXZiYXIgLz5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb250YWluZXItZmx1aWRcIj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tM1wiPlxyXG5cdFx0XHRcdFx0XHQ8T3B0aW9uc1BhbmVsIC8+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cclxuXHRcdFx0XHRcdFx0PEthZGFsYVN0b3JlIC8+XHJcblx0XHRcdFx0XHRcdDxJbnZlbnRvcnkgLz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcblJlYWN0LnJlbmRlcihcclxuXHQ8QXBwbGljYXRpb24gLz4sXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpXHJcbik7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5EaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWIvRGlzcGF0Y2hlcicpXG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIERpc3BhdGNoZXJcbiAqIEB0eXBlY2hlY2tzXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCcuL2ludmFyaWFudCcpO1xuXG52YXIgX2xhc3RJRCA9IDE7XG52YXIgX3ByZWZpeCA9ICdJRF8nO1xuXG4vKipcbiAqIERpc3BhdGNoZXIgaXMgdXNlZCB0byBicm9hZGNhc3QgcGF5bG9hZHMgdG8gcmVnaXN0ZXJlZCBjYWxsYmFja3MuIFRoaXMgaXNcbiAqIGRpZmZlcmVudCBmcm9tIGdlbmVyaWMgcHViLXN1YiBzeXN0ZW1zIGluIHR3byB3YXlzOlxuICpcbiAqICAgMSkgQ2FsbGJhY2tzIGFyZSBub3Qgc3Vic2NyaWJlZCB0byBwYXJ0aWN1bGFyIGV2ZW50cy4gRXZlcnkgcGF5bG9hZCBpc1xuICogICAgICBkaXNwYXRjaGVkIHRvIGV2ZXJ5IHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gKiAgIDIpIENhbGxiYWNrcyBjYW4gYmUgZGVmZXJyZWQgaW4gd2hvbGUgb3IgcGFydCB1bnRpbCBvdGhlciBjYWxsYmFja3MgaGF2ZVxuICogICAgICBiZWVuIGV4ZWN1dGVkLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGlzIGh5cG90aGV0aWNhbCBmbGlnaHQgZGVzdGluYXRpb24gZm9ybSwgd2hpY2hcbiAqIHNlbGVjdHMgYSBkZWZhdWx0IGNpdHkgd2hlbiBhIGNvdW50cnkgaXMgc2VsZWN0ZWQ6XG4gKlxuICogICB2YXIgZmxpZ2h0RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjb3VudHJ5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDb3VudHJ5U3RvcmUgPSB7Y291bnRyeTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjaXR5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDaXR5U3RvcmUgPSB7Y2l0eTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgYmFzZSBmbGlnaHQgcHJpY2Ugb2YgdGhlIHNlbGVjdGVkIGNpdHlcbiAqICAgdmFyIEZsaWdodFByaWNlU3RvcmUgPSB7cHJpY2U6IG51bGx9XG4gKlxuICogV2hlbiBhIHVzZXIgY2hhbmdlcyB0aGUgc2VsZWN0ZWQgY2l0eSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY2l0eS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ2l0eTogJ3BhcmlzJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYENpdHlTdG9yZWA6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY2l0eS11cGRhdGUnKSB7XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IHBheWxvYWQuc2VsZWN0ZWRDaXR5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgY291bnRyeSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY291bnRyeS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ291bnRyeTogJ2F1c3RyYWxpYSdcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGJvdGggc3RvcmVzOlxuICpcbiAqICAgIENvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgQ291bnRyeVN0b3JlLmNvdW50cnkgPSBwYXlsb2FkLnNlbGVjdGVkQ291bnRyeTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIGNhbGxiYWNrIHRvIHVwZGF0ZSBgQ291bnRyeVN0b3JlYCBpcyByZWdpc3RlcmVkLCB3ZSBzYXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGUgcmV0dXJuZWQgdG9rZW4uIFVzaW5nIHRoaXMgdG9rZW4gd2l0aCBgd2FpdEZvcigpYCwgd2UgY2FuIGd1YXJhbnRlZVxuICogdGhhdCBgQ291bnRyeVN0b3JlYCBpcyB1cGRhdGVkIGJlZm9yZSB0aGUgY2FsbGJhY2sgdGhhdCB1cGRhdGVzIGBDaXR5U3RvcmVgXG4gKiBuZWVkcyB0byBxdWVyeSBpdHMgZGF0YS5cbiAqXG4gKiAgIENpdHlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBtYXkgbm90IGJlIHVwZGF0ZWQuXG4gKiAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIGlzIG5vdyBndWFyYW50ZWVkIHRvIGJlIHVwZGF0ZWQuXG4gKlxuICogICAgICAgLy8gU2VsZWN0IHRoZSBkZWZhdWx0IGNpdHkgZm9yIHRoZSBuZXcgY291bnRyeVxuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBnZXREZWZhdWx0Q2l0eUZvckNvdW50cnkoQ291bnRyeVN0b3JlLmNvdW50cnkpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIHVzYWdlIG9mIGB3YWl0Rm9yKClgIGNhbiBiZSBjaGFpbmVkLCBmb3IgZXhhbXBsZTpcbiAqXG4gKiAgIEZsaWdodFByaWNlU3RvcmUuZGlzcGF0Y2hUb2tlbiA9XG4gKiAgICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgZ2V0RmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGBjb3VudHJ5LXVwZGF0ZWAgcGF5bG9hZCB3aWxsIGJlIGd1YXJhbnRlZWQgdG8gaW52b2tlIHRoZSBzdG9yZXMnXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcyBpbiBvcmRlcjogYENvdW50cnlTdG9yZWAsIGBDaXR5U3RvcmVgLCB0aGVuXG4gKiBgRmxpZ2h0UHJpY2VTdG9yZWAuXG4gKi9cblxuICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2l0aCBldmVyeSBkaXNwYXRjaGVkIHBheWxvYWQuIFJldHVybnNcbiAgICogYSB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHdpdGggYHdhaXRGb3IoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIF9sYXN0SUQrKztcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3Rlcj1mdW5jdGlvbihpZCkge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICdEaXNwYXRjaGVyLnVucmVnaXN0ZXIoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICBpZFxuICAgICk7XG4gICAgZGVsZXRlIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gaWRzXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKGlkcykge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLidcbiAgICApO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdLFxuICAgICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICtcbiAgICAgICAgICAnd2FpdGluZyBmb3IgYCVzYC4nLFxuICAgICAgICAgIGlkXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KFxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaD1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgIXRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLidcbiAgICApO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY2FsbGJhY2sgc3RvcmVkIHdpdGggdGhlIGdpdmVuIGlkLiBBbHNvIGRvIHNvbWUgaW50ZXJuYWxcbiAgICogYm9va2tlZXBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrPWZ1bmN0aW9uKGlkKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0odGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHVwIGJvb2trZWVwaW5nIG5lZWRlZCB3aGVuIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmc9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoZmFsc2UpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhbiBlbnVtZXJhdGlvbiB3aXRoIGtleXMgZXF1YWwgdG8gdGhlaXIgdmFsdWUuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogICB2YXIgQ09MT1JTID0ga2V5TWlycm9yKHtibHVlOiBudWxsLCByZWQ6IG51bGx9KTtcbiAqICAgdmFyIG15Q29sb3IgPSBDT0xPUlMuYmx1ZTtcbiAqICAgdmFyIGlzQ29sb3JWYWxpZCA9ICEhQ09MT1JTW215Q29sb3JdO1xuICpcbiAqIFRoZSBsYXN0IGxpbmUgY291bGQgbm90IGJlIHBlcmZvcm1lZCBpZiB0aGUgdmFsdWVzIG9mIHRoZSBnZW5lcmF0ZWQgZW51bSB3ZXJlXG4gKiBub3QgZXF1YWwgdG8gdGhlaXIga2V5cy5cbiAqXG4gKiAgIElucHV0OiAge2tleTE6IHZhbDEsIGtleTI6IHZhbDJ9XG4gKiAgIE91dHB1dDoge2tleTE6IGtleTEsIGtleTI6IGtleTJ9XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG52YXIga2V5TWlycm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgdmFyIGtleTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gIH1cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gVG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciBrZXlzO1xuXHR2YXIgdG8gPSBUb09iamVjdCh0YXJnZXQpO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoT2JqZWN0KGZyb20pKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJ2YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xyXG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSB7XHJcblxyXG5cdGFkZEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5BRERfSVRFTSxcclxuXHRcdFx0aXRlbTppdGVtXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRwcmV2aW91c0ludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuUFJFVl9JTlZcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG5leHRJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLk5FWFRfSU5WXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBBY3Rpb25zOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0RDNJdGVtVG9vbHRpcEFybW9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS1hcm1vci1hcm1vclwiPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJiaWdcIj48cD48c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLmFybW9yfTwvc3Bhbj48L3A+PC9saT5cclxuXHRcdFx0XHQ8bGk+QXJtb3I8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwQXJtb3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcclxuXHREM0l0ZW1Ub29sdGlwQXJtb3IgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtYXJtb3IuanN4JyksXHJcblx0RDNJdGVtVG9vbHRpcFdlYXBvbiA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC13ZWFwb24uanN4JyksXHJcblx0RDNJdGVtVG9vbHRpcFN0YXQgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtc3RhdC5qc3gnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwQm9keSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgaWNvbkNsYXNzZXMgPSAnZDMtaWNvbiBkMy1pY29uLWl0ZW0gZDMtaWNvbi1pdGVtLWxhcmdlJztcclxuXHRcdHZhciBpdGVtVHlwZUNsYXNzID0nZDMtY29sb3ItJzsgXHJcblxyXG5cdFx0Ly9kZWNsYXJlIGFycmF5cyBmb3IgcHJpbWFyeSBhbmQgc2Vjb25kYXJ5IGl0ZW0gZWZmZWN0cy4gXHJcblx0XHQvL0FuIGl0ZW0gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBvZiBlYWNoLlxyXG5cdFx0Ly9DcmVhdGUgdGhlIGxpc3QgaXRlbSBmb3IgZWFjaCBzdGF0IGFuZCBwdXNoIGluIHRoZSBhcnJheXNcclxuXHRcdHZhciBwcmltYXJpZXMgPSBmb3JFYWNoKHRoaXMucHJvcHMuaXRlbS5wcmltYXJpZXMpO1xyXG5cdFx0dmFyIHNlY29uZGFyaWVzID0gZm9yRWFjaCh0aGlzLnByb3BzLml0ZW0uc2Vjb25kYXJpZXMpO1xyXG5cclxuXHRcdC8vaW1hZ2UgdXNlZCBhcyBpbmxpbmUtc3R5bGUgZm9yIGl0ZW0gdG9vbHRpcHNcclxuXHRcdHZhciBpbWFnZSA9IHtiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK3RoaXMucHJvcHMuaXRlbS5pbWFnZSsnKSd9O1xyXG5cclxuXHRcdC8vaWYgc3BlY2lmaWVkLCBzZXQgY29sb3IgZm9yIHRvb2x0aXAgY29tcG9uZW50c1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5jb2xvcikge1xyXG5cdFx0XHRpY29uQ2xhc3NlcyArPSAnIGQzLWljb24taXRlbS0nK3RoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdFx0aXRlbVR5cGVDbGFzcyArPXRoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdH1cclxuXHJcblx0XHQvL2lmIGl0IGlzIGFuIGFybW9yIG9yIHdlYXBvbiBhZGQgYWRkaXRpb25hbCBpbmZvIHRvIGljb24gc2VjdGlvblxyXG5cdFx0dmFyIHN1YkhlYWQ7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdhcm1vcicpKSB7XHJcblx0XHRcdHN1YkhlYWQgPSA8RDNJdGVtVG9vbHRpcEFybW9yIGFybW9yPXt0aGlzLnByb3BzLml0ZW0uYXJtb3J9Lz47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCd3ZWFwb24nKSkge1xyXG5cdFx0XHRzdWJIZWFkID0gPEQzSXRlbVRvb2x0aXBXZWFwb24gd2VhcG9uPXt0aGlzLnByb3BzLml0ZW0ud2VhcG9ufS8+O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vaWYgc29ja2V0cyBhcmUgbmVlZGVkXHJcblx0XHR2YXIgc29ja2V0cyA9IFtdO1xyXG5cdFx0dmFyIHNvY2tldEtleSA9IDA7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLnByaW1hcmllcy5oYXNPd25Qcm9wZXJ0eSgnU29ja2V0JykpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9MDsgaSA8IHRoaXMucHJvcHMuaXRlbS5wcmltYXJpZXMuU29ja2V0LnZhbHVlOyBpKyspIHtcclxuXHRcdFx0XHRzb2NrZXRzLnB1c2goPGxpIGNsYXNzTmFtZT0nZW1wdHktc29ja2V0IGQzLWNvbG9yLWJsdWUnIGtleT17c29ja2V0S2V5fSA+RW1wdHkgU29ja2V0PC9saT4pO1xyXG5cdFx0XHRcdHNvY2tldEtleSsrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9kZXRlcm1pbmUgdGhlIHdvcmQgdG8gcHV0IG5leHQgdG8gaXRlbSB0eXBlXHJcblx0XHR2YXIgaXRlbVR5cGVQcmVmaXg7XHJcblx0XHQvL2NoZWNrIGlmIGFuY2llbnQgc2V0IGl0ZW0gYW5kIG1hbnVhbGx5IHB1dFxyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5yYXJpdHkgPT09ICdhbmNpZW50JyAmJiB0aGlzLnByb3BzLml0ZW0uaGFzT3duUHJvcGVydHkoJ3NldCcpKSB7XHJcblx0XHRcdGl0ZW1UeXBlUHJlZml4ID0gJ0FuY2llbnQgU2V0JztcclxuXHRcdH1cclxuXHRcdC8vb3RoZXJ3aXNlIGl0IGlzIHNldC9hIHJhcml0eSBvbmx5XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aXRlbVR5cGVQcmVmaXggPSAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdzZXQnKSkgPyAnc2V0JyA6IHRoaXMucHJvcHMuaXRlbS5yYXJpdHk7XHJcblx0XHRcdC8vY2FwaXRhbGl6ZSBmaXJzdCBsZXR0ZXJcclxuXHRcdFx0aXRlbVR5cGVQcmVmaXggPSBpdGVtVHlwZVByZWZpeC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGl0ZW1UeXBlUHJlZml4LnNsaWNlKDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidG9vbHRpcC1ib2R5IGVmZmVjdC1iZyBlZmZlY3QtYmctYXJtb3IgZWZmZWN0LWJnLWFybW9yLWRlZmF1bHRcIj5cclxuXHJcblx0XHRcdFx0ey8qVGhlIGl0ZW0gaWNvbiBhbmQgY29udGFpbmVyLCBjb2xvciBuZWVkZWQgZm9yIGJhY2tncm91bmQqL31cclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9e2ljb25DbGFzc2VzfT5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImljb24taXRlbS1ncmFkaWVudFwiPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJpY29uLWl0ZW0taW5uZXIgaWNvbi1pdGVtLWRlZmF1bHRcIiBzdHlsZT17aW1hZ2V9PlxyXG5cdFx0XHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImQzLWl0ZW0tcHJvcGVydGllc1wiPlxyXG5cclxuXHRcdFx0XHRcdHsvKlNsb3QgYW5kIGlmIGNsYXNzIHNwZWNpZmljKi99XHJcblx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS10eXBlLXJpZ2h0XCI+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cIml0ZW0tc2xvdFwiPnt0aGlzLnByb3BzLml0ZW0uc2xvdC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMucHJvcHMuaXRlbS5zbG90LnNsaWNlKDEpfTwvbGk+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cIml0ZW0tY2xhc3Mtc3BlY2lmaWMgZDMtY29sb3Itd2hpdGVcIj57dGhpcy5wcm9wcy5pdGVtLmNsYXNzU3BlY2lmaWN9PC9saT5cclxuXHRcdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHRcdFx0ey8qUmFyaXR5IG9mIHRoZSBpdGVtIGFuZC9pZiBpdCBpcyBhbmNpZW50Ki99XHJcblx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS10eXBlXCI+XHJcblx0XHRcdFx0XHRcdDxsaT5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9e2l0ZW1UeXBlQ2xhc3N9PntpdGVtVHlwZVByZWZpeH0ge3RoaXMucHJvcHMuaXRlbS50eXBlfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHRcdFx0ey8qSWYgdGhlIGl0ZW0gaXMgYXJtb3Igb3Igd2VhcG9uLCB0aGUga2V5IGlzIGRlZmluZWQgYW5kIHdlIG5lZWQgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgdG9vbHRpcCovfVxyXG5cdFx0XHRcdFx0e3N1YkhlYWR9XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJpdGVtLWJlZm9yZS1lZmZlY3RzXCI+PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0ey8qQWN0dWFsIGl0ZW0gc3RhdHMqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWVmZmVjdHNcIj5cclxuXHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwiaXRlbS1wcm9wZXJ0eS1jYXRlZ29yeVwiPlByaW1hcnk8L3A+XHJcblx0XHRcdFx0XHRcdHtwcmltYXJpZXN9XHJcblx0XHRcdFx0XHRcdDxwIGNsYXNzTmFtZT1cIml0ZW0tcHJvcGVydHktY2F0ZWdvcnlcIj5TZWNvbmRhcnk8L3A+XHJcblx0XHRcdFx0XHRcdHtzZWNvbmRhcmllc31cclxuXHRcdFx0XHRcdFx0e3NvY2tldHN9XHJcblx0XHRcdFx0XHQ8L3VsPlxyXG5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0ZnVuY3Rpb24gZm9yRWFjaChzdGF0T2JqZWN0KSB7XHJcblx0XHR2YXIgcmVzdWx0cyA9IFtdO1xyXG5cclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3RhdE9iamVjdCk7XHJcblx0XHR2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKyspIHtcclxuXHRcdFx0dmFyIHN0YXQgPSBrZXlzW2ldO1xyXG5cdFx0XHR2YXIgdmFsID0gc3RhdE9iamVjdFtzdGF0XTtcclxuXHRcdFx0cmVzdWx0cy5wdXNoKDxEM0l0ZW1Ub29sdGlwU3RhdCBzdGF0PXt2YWx9IGtleT17aX0gLz4pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdHM7XHJcblx0fVxyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwQm9keTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBGbGF2b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J3Rvb2x0aXAtZXh0ZW5zaW9uJz5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZmxhdm9yJz57dGhpcy5wcm9wcy5mbGF2b3J9PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwRmxhdm9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEhlYWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvL2luaXRpYWwgY2xhc3Mgc2V0IGZvciB0aGUgdG9vbHRpcCBoZWFkXHJcblx0XHR2YXIgZGl2Q2xhc3M9J3Rvb2x0aXAtaGVhZCc7XHJcblx0XHR2YXIgaDNDbGFzcz0nJztcclxuXHJcblx0XHQvL21vZGlmeSB0aGUgY2xhc3NlcyBpZiBhIGNvbG9yIHdhcyBwYXNzZWRcclxuXHRcdC8vZmFsbGJhY2sgY29sb3IgaXMgaGFuZGxlZCBieSBkMy10b29sdGlwIGNzc1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5jb2xvcikge1xyXG5cdFx0XHRkaXZDbGFzcyArPSAnIHRvb2x0aXAtaGVhZC0nICsgdGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0XHRoM0NsYXNzICs9ICdkMy1jb2xvci0nICsgdGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0fVxyXG5cdFx0Ly9tYWtlIHRoZSBmb250IHNtYWxsZXIgaWYgdGhlIG5hbWUgaXMgbG9uZ1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5uYW1lLmxlbmd0aCA+IDQwKSB7XHJcblx0XHRcdGgzQ2xhc3MrPSAnIHNtYWxsZXN0JztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYodGhpcy5wcm9wcy5pdGVtLm5hbWUubGVuZ3RoID4yMikge1xyXG5cdFx0XHRoM0NsYXNzKz0gJyBzbWFsbGVyJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17ZGl2Q2xhc3N9PlxyXG5cdFx0XHRcdDxoMyBjbGFzc05hbWU9e2gzQ2xhc3N9PlxyXG5cdFx0XHRcdFx0e3RoaXMucHJvcHMuaXRlbS5uYW1lfVxyXG5cdFx0XHRcdDwvaDM+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEhlYWQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwU3RhdD0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciB0ZXh0ID0gW107XHJcblx0XHR2YXIgdGV4dEtleSA9IDA7XHJcblx0XHQvL2NoZWNrIHRvIG1ha2Ugc3VyZSB0ZW1wbGF0ZSBuZWVkcyB0byBiZSB3b3JrZWQgd2l0aCBcclxuXHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5zdGF0LnRleHQgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHZhciB0ZW1wbGF0ZSA9IHRoaXMucHJvcHMuc3RhdC50ZXh0O1xyXG5cdFx0XHRpZiAodGVtcGxhdGUuaW5kZXhPZigneycpICE9PSAtMSkge1xyXG5cclxuXHRcdFx0XHQvL2RldGVybWluZSB0aGUgbnVtYmVyIG9mIGhpZ2hsaWdodGVkIGl0ZW1zIHRoZSB0b29sdGlwIHdpbGwgaGF2ZVxyXG5cdFx0XHRcdHZhciBwb3NpdGlvbiA9IHRlbXBsYXRlLmluZGV4T2YoJ3snKTtcclxuXHRcdFx0XHR2YXIgY291bnQgPSAwO1xyXG5cdFx0XHRcdHdoaWxlIChwb3NpdGlvbiAhPT0gLTEpIHtcclxuXHRcdFx0XHRcdGNvdW50KytcclxuXHRcdFx0XHRcdHBvc2l0aW9uID0gdGVtcGxhdGUuaW5kZXhPZigneycsIHBvc2l0aW9uKzEpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHN0YXJ0UG9zID0gMDtcclxuXHRcdFx0XHR2YXIgZW5kUG9zID0gMDtcclxuXHRcdFx0XHQvL2xvb3AgdGhyb3VnaCB0aGlzIGNvdW50IG9mIHRlbXBsYXRpbmdcclxuXHRcdFx0XHRmb3IgKHZhciBpID0wOyBpIDwgY291bnQ7IGkrKykge1xyXG5cdFx0XHRcdFx0dmFyIHN0YXJ0SW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKCd7JyxzdGFydFBvcykrMTtcclxuXHRcdFx0XHRcdHN0YXJ0UG9zID0gc3RhcnRJbmRleDtcclxuXHRcdFx0XHRcdHZhciBlbmRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ30nLGVuZFBvcyk7XHJcblx0XHRcdFx0XHRlbmRQb3MgPSBlbmRJbmRleCsxO1xyXG5cdFx0XHRcdFx0dmFyIHNsaWNlZCA9IHRlbXBsYXRlLnNsaWNlKHN0YXJ0SW5kZXgsZW5kSW5kZXgpO1xyXG5cclxuXHRcdFx0XHRcdC8vY2hlY2sgZm9yIGFueSByZXBsYWNlbWVudCBuZWVkZWRcclxuXHRcdFx0XHRcdGlmIChzbGljZWQuaW5kZXhPZignJCcpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnByb3BzLnN0YXQudmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0c2xpY2VkID0gc2xpY2VkLnJlcGxhY2UoJyQnLCB0aGlzLnByb3BzLnN0YXQudmFsdWVbaV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHNsaWNlZCA9IHNsaWNlZC5yZXBsYWNlKCckJyx0aGlzLnByb3BzLnN0YXQudmFsdWUpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly9pZiB3ZSBhcmUgYXQgdGhlIGZpcnN0IGxvb3AsIGFkZCBhbnl0aGluZyBmaXJzdCBhcyB0ZXh0XHJcblx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2godGVtcGxhdGUuc3BsaXQoJ3snKVswXSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly9jcmVhdGUgYW5kIHB1c2ggdGhlIHZhbHVlIGhpZ2hsaWdodGVkIGVsZW1lbnRcclxuXHRcdFx0XHRcdHZhciBlbGVtZW50ID0gPHNwYW4gY2xhc3NOYW1lPSd2YWx1ZScga2V5PXt0ZXh0S2V5fT57c2xpY2VkfTwvc3Bhbj47XHJcblx0XHRcdFx0XHR0ZXh0S2V5Kys7XHJcblx0XHRcdFx0XHR0ZXh0LnB1c2goZWxlbWVudCk7XHJcblxyXG5cdFx0XHRcdFx0Ly9pZiBub3QgdGhlIGxhc3QgbG9vcCwgcHVzaCBhbnl0aGluZyB1bnRpbCBuZXh0IGJyYWNrZXRcclxuXHRcdFx0XHRcdGlmIChjb3VudCAhPT0gMSAmJiBpIDwgY291bnQgLSAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0SW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKCd7Jywgc3RhcnRQb3MpO1xyXG5cdFx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2UoZW5kSW5kZXgrMSwgbmV4dEluZGV4KTtcclxuXHRcdFx0XHRcdFx0dGV4dC5wdXNoKHNsaWNlZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmKGNvdW50ID09PSAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCB0ZW1wbGF0ZS5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vbGFzdCBsb29wIHB1c2ggdG8gdGhlIGVuZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZihpID09PSBjb3VudC0xICYmIGNvdW50ID4gMSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2UoZW5kSW5kZXgrMSwgdGVtcGxhdGUubGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0dGV4dC5wdXNoKHNsaWNlZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vbm8gdGVtcGxhdGUgYW5kIHdlIGp1c3QgdGhyb3cgYWZmaXggdXBcclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGV4dC5wdXNoKHRoaXMucHJvcHMuc3RhdC50ZXh0KTtcclxuXHRcdFx0fVxyXG5cdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cclxuXHRcdFx0PGxpIGNsYXNzTmFtZT1cImQzLWNvbG9yLWJsdWUgZDMtaXRlbS1wcm9wZXJ0eS1kZWZhdWx0XCI+XHJcblx0XHRcdFx0PHA+e3RleHR9PC9wPlxyXG5cdFx0XHQ8L2xpPlxyXG5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwU3RhdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBXZWFwb249IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2PlxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS13ZWFwb24tZHBzXCI+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cImJpZ1wiPjxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLmRwc308L3NwYW4+PC9saT5cclxuXHRcdFx0XHQ8bGk+RGFtYWdlIFBlciBTZWNvbmQ8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS13ZWFwb24gZGFtYWdlXCI+XHJcblx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0PHA+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLm1pbn08L3NwYW4+IC1cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj4ge3RoaXMucHJvcHMud2VhcG9uLm1heH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImQzLWNvbG9yLUZGODg4ODg4XCI+IERhbWFnZTwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvcD5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdDxsaT5cclxuXHRcdFx0XHRcdDxwPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLndlYXBvbi5zcGVlZH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImQzLWNvbG9yLUZGODg4ODg4XCI+IEF0dGFja3MgcGVyIFNlY29uZDwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvcD5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwV2VhcG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEhlYWQgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtaGVhZC5qc3gnKTtcclxudmFyIEQzSXRlbVRvb2x0aXBCb2R5ID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWJvZHkuanN4Jyk7XHJcbnZhciBEM0l0ZW1Ub29sdGlwRmxhdm9yID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWZsYXZvci5qc3gnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9vbHRpcENsYXNzID0nZDMtdG9vbHRpcCBkMy10b29sdGlwLWl0ZW0nO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5yYXJpdHkgPT09ICdhbmNpZW50Jykge1xyXG5cdFx0XHR0b29sdGlwQ2xhc3MrPScgYW5jaWVudCdcclxuXHRcdH1cclxuXHJcblx0XHQvL2RldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0byBhZGQgZmxhdm9yXHJcblx0XHR2YXIgZmxhdm9yO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnZmxhdm9yJykpIHtcclxuXHRcdFx0Zmxhdm9yID0gPEQzSXRlbVRvb2x0aXBGbGF2b3IgZmxhdm9yPXt0aGlzLnByb3BzLml0ZW0uZmxhdm9yfSAvPlxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J3Rvb2x0aXAtY29udGVudCc+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e3Rvb2x0aXBDbGFzc30+XHJcblx0XHRcdFx0XHQ8RDNJdGVtVG9vbHRpcEhlYWQgaXRlbT17dGhpcy5wcm9wcy5pdGVtfSAvPlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXBCb2R5IGl0ZW09e3RoaXMucHJvcHMuaXRlbX0gLz5cclxuXHRcdFx0XHRcdHtmbGF2b3J9XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEludmVudG9yeVNsb3QgPSByZXF1aXJlKCcuL2ludmVudG9yeS1zbG90LmpzeCcpO1xyXG52YXIgUHJldmlvdXNJbnZlbnRvcnkgPSByZXF1aXJlKCcuL3ByZXZpb3VzLWludmVudG9yeS5qc3gnKTtcclxudmFyIE5leHRJbnZlbnRvcnkgPSByZXF1aXJlKCcuL25leHQtaW52ZW50b3J5LmpzeCcpO1xyXG5cclxuXHJcbnZhciBJbnZlbnRvcnlDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBpbnZlbnRvcnlTbG90cyA9IFtdO1xyXG5cdFx0dmFyIGtleT0wO1xyXG5cclxuXHRcdC8vbG9vcCB0aHJvdWdoIHRoZSAxMCBjb2x1bW5zIG9mIGludmVudG9yeVxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcblx0XHRcdHZhciBjb2x1bW5MZW5ndGggPSB0aGlzLnByb3BzLmludmVudG9yeVtpXS5sZW5ndGg7XHJcblxyXG5cdFx0XHQvL2EgY2hlY2sgZm9yIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhpcyBjb2x1bW5cclxuXHRcdFx0dmFyIGhlaWdodENvdW50ID0gMDtcclxuXHJcblx0XHRcdC8vYWRkIGFsbCBleGlzdGluZyBpdGVtcyB0byB0aGUgY29sdW1uc1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7IGogPCBjb2x1bW5MZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdGhlaWdodENvdW50ICs9IHRoaXMucHJvcHMuaW52ZW50b3J5W2ldW2pdLnNpemU7XHJcblx0XHRcdFx0XHRpbnZlbnRvcnlTbG90cy5wdXNoKDxJbnZlbnRvcnlTbG90IGRhdGE9e3RoaXMucHJvcHMuaW52ZW50b3J5W2ldW2pdfSBrZXk9e2tleX0gY29sdW1uPXtpfS8+KVxyXG5cdFx0XHRcdFx0a2V5Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL25vdyBmaWxsIGluIHRoZSByZXN0IG9mIHRoZSBjb2x1bW4gd2l0aCBibGFuayBzcGFjZXNcclxuXHRcdFx0d2hpbGUoaGVpZ2h0Q291bnQgPCA2KSB7XHJcblx0XHRcdFx0aGVpZ2h0Q291bnQrKztcclxuXHRcdFx0XHRpbnZlbnRvcnlTbG90cy5wdXNoKDxJbnZlbnRvcnlTbG90IGRhdGE9e3VuZGVmaW5lZH0ga2V5PXtrZXl9IGNvbHVtbj17aX0vPik7XHJcblx0XHRcdFx0a2V5Kys7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1jb250YWluZXInPlxyXG5cdFx0XHRcdDxQcmV2aW91c0ludmVudG9yeSBoYXNQcmV2aW91cz17dGhpcy5wcm9wcy5oYXNQcmV2aW91c30vPlxyXG5cdFx0XHRcdHtpbnZlbnRvcnlTbG90c31cclxuXHRcdFx0XHQ8TmV4dEludmVudG9yeSBoYXNOZXh0PXt0aGlzLnByb3BzLmhhc05leHR9Lz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeUNvbnRhaW5lciIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcCA9IHJlcXVpcmUoJy4uL2QzLXRvb2x0aXAvZDMtdG9vbHRpcC5qc3gnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTbG90ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGNvbXBvbmVudERpZE1vdW50OmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRUb29sdGlwT2Zmc2V0KCk7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRVcGRhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFRvb2x0aXBPZmZzZXQoKTtcclxuXHR9LFxyXG5cclxuXHRzZXRUb29sdGlwT2Zmc2V0OmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGVsZW0gPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzKTtcclxuXHJcblx0XHQvL2lmIHRoZSBpbnZlbnRvcnkgc2xvdCBoYXMgY2hpbGRyZW4gKGNvbnRlbnQpXHJcblx0XHRpZiAoZWxlbS5jaGlsZHJlbiAmJiBlbGVtLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0dmFyIGVsZW1Mb2NhdGlvbiA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG5cdFx0XHR2YXIgdG9vbHRpcEhlaWdodCA9IGVsZW0uY2hpbGRyZW5bNF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG5cdFx0XHR2YXIgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuXHRcdFx0Ly9jaGVjayBpZiB0aGUgdG9vbHRpcCBmaXRzIHdoZXJlIGl0IGN1cnJlbnRseSBpc1xyXG5cdFx0XHRpZiAoISh0b29sdGlwSGVpZ2h0ICsgZWxlbUxvY2F0aW9uIDwgd2luZG93SGVpZ2h0KSkge1xyXG5cdFx0XHRcdHZhciBvZmZzZXQgPSAodG9vbHRpcEhlaWdodCArIGVsZW1Mb2NhdGlvbiAtIHdpbmRvd0hlaWdodCk7XHJcblxyXG5cdFx0XHRcdC8vaWYgdGhlIHRvb2x0aXAgaXMgYmlnZ2VyIHRoYW4gd2luZG93LCBqdXN0IHNob3cgYXQgdG9wIG9mIHdpbmRvd1xyXG5cdFx0XHRcdGlmIChvZmZzZXQgPiB3aW5kb3dIZWlnaHQpIHtcclxuXHRcdFx0XHRcdGVsZW0uY2hpbGRyZW5bNF0uc3R5bGUudG9wID0gJy0nKyhlbGVtTG9jYXRpb24tMjApKydweCc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9qdXN0IG1vdmUgaXQgdXAgYSBsaXR0bGUgd2l0aCBhIGJpdCBhdCBib3R0b21cclxuXHRcdFx0XHRcdGVsZW0uY2hpbGRyZW5bNF0uc3R5bGUudG9wID0gJy0nKyhvZmZzZXQrMTApKydweCc7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2xvdENvbnRlbnQ9IFtdO1xyXG5cdFx0dmFyIHNsb3RDb250ZW50S2V5ID0gMDtcclxuXHJcblx0XHR2YXIgc2xvdENsYXNzPSdpbnZlbnRvcnktc2xvdCc7XHJcblx0XHQvL2NoZWNrIHRvIG1ha2Ugc3VyZSBhbiBhY3R1YWwgaXRlbSBpcyBpbiB0aGUgaW52ZW50b3J5IHNsb3RcclxuXHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5kYXRhICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHQvL2NoYW5nZSB0aGUgc2l6ZSB0byBsYXJnZSBpZiBpdCBpcyBhIGxhcmdlIGl0ZW1cclxuXHRcdFx0aWYodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdzaXplJykgJiYgdGhpcy5wcm9wcy5kYXRhLnNpemUgPT09IDIpIHtcclxuXHRcdFx0XHRzbG90Q2xhc3MgKz0gJyBsYXJnZSc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgncmFyaXR5JykpIHtcclxuXHRcdFx0XHR2YXIgYmd1cmw7XHJcblx0XHRcdFx0dmFyIGJvcmRlckNvbG9yPScjMzAyYTIxJztcclxuXHJcblx0XHRcdFx0c3dpdGNoKHRoaXMucHJvcHMuZGF0YS5yYXJpdHkpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ21hZ2ljJzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9J2ltZy9ibHVlLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjNzk3OWQ0JztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdyYXJlJzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9J2ltZy95ZWxsb3cucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyNmOGNjMzUnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZ2VuZGFyeSc6XHJcblx0XHRcdFx0XHRcdGJndXJsPSdpbWcvb3JhbmdlLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjYmY2NDJmJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdhbmNpZW50JzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9J2ltZy9vcmFuZ2UucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyNiZjY0MmYnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdC8vbm9vcFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9zd2l0Y2ggYmcgdG8gZ3JlZW4gaWYgaXRlbSBpcyBwYXJ0IG9mIGEgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykpIHtcclxuXHRcdFx0XHRcdGJndXJsPSdpbWcvZ3JlZW4ucG5nJztcclxuXHRcdFx0XHRcdGJvcmRlckNvbG9yPScjOGJkNDQyJztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2YgYmd1cmwgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR2YXIgaW5saW5lID0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK2JndXJsKycpJ1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHNsb3RDb250ZW50LnB1c2goPGRpdiBzdHlsZT17aW5saW5lfSBjbGFzc05hbWU9J2ludmVudG9yeS1iZycga2V5PXtzbG90Q29udGVudEtleX0+PC9kaXY+KVxyXG5cdFx0XHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vc2V0IHRoZSBpdGVtIGltYWdlXHJcblx0XHRcdGlmICh0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ2ltYWdlJykpIHtcclxuXHRcdFx0XHR2YXIgaW5saW5lID0ge2JhY2tncm91bmRJbWFnZTondXJsKCcrdGhpcy5wcm9wcy5kYXRhLmltYWdlKycpJ307XHJcblx0XHRcdFx0c2xvdENvbnRlbnQucHVzaCg8ZGl2IHN0eWxlPXtpbmxpbmV9IGNsYXNzTmFtZT0naW52ZW50b3J5LWltYWdlJyBrZXk9e3Nsb3RDb250ZW50S2V5fT48L2Rpdj4pO1xyXG5cdFx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vYWRkIGEgbGluayB0byBhY3RpdmF0ZSB0b29sdGlwXHJcblx0XHRcdHNsb3RDb250ZW50LnB1c2goPGEgY2xhc3NOYW1lPSd0b29sdGlwLWxpbmsnIGtleT17c2xvdENvbnRlbnRLZXl9PjwvYT4pO1xyXG5cdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cclxuXHRcdFx0Ly9hZGQgYSBncmFkaWVudCBtYXNrXHJcblx0XHRcdHNsb3RDb250ZW50LnB1c2goPGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1pdGVtLWdyYWRpZW50JyBrZXk9e3Nsb3RDb250ZW50S2V5fT48L2Rpdj4pO1xyXG5cdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cclxuXHRcdFx0Ly9hZGQgYSBoaWRkZW4gdG9vbHRpcFxyXG5cdFx0XHR2YXIgaW5saW5lO1xyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5jb2x1bW4gPCA1KSB7XHJcblx0XHRcdFx0aW5saW5lID0ge2xlZnQ6JzUwcHgnfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpbmxpbmUgPSB7cmlnaHQ6JzUwcHgnfTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2xvdENvbnRlbnQucHVzaChcclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1jb250YWluZXInIHN0eWxlPXtpbmxpbmV9IGtleT17c2xvdENvbnRlbnRLZXl9PlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXAgaXRlbT17dGhpcy5wcm9wcy5kYXRhfS8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdCk7XHJcblx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblxyXG5cdFx0XHQvL2FkZCBzb2NrZXRzIG9uIGhvdmVyXHJcblx0XHRcdGlmICh0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3ByaW1hcmllcycpICYmIHRoaXMucHJvcHMuZGF0YS5wcmltYXJpZXMuaGFzT3duUHJvcGVydHkoJ1NvY2tldCcpKSB7XHJcblx0XHRcdFx0dmFyIHNvY2tldHM7XHJcblx0XHRcdFx0dmFyIHNvY2tldENvdW50ID0gdGhpcy5wcm9wcy5kYXRhLnByaW1hcmllcy5Tb2NrZXQudmFsdWU7XHJcblx0XHRcdFx0dmFyIHNvY2tldENvbnRlbnRzID0gW107XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9MDsgaSA8IHNvY2tldENvdW50OyBpKyspIHtcclxuXHRcdFx0XHRcdHNvY2tldENvbnRlbnRzLnB1c2goPGRpdiBjbGFzc05hbWU9J3NvY2tldCcga2V5PXtpfT48L2Rpdj4pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzb2NrZXRzID0gPGRpdiBjbGFzc05hbWU9J3NvY2tldHMtd3JhcHBlcicga2V5PXtzbG90Q29udGVudEtleX0+PGRpdiBjbGFzc05hbWU9J3NvY2tldHMtYWxpZ24nPntzb2NrZXRDb250ZW50c308L2Rpdj48L2Rpdj47XHJcblx0XHRcdFx0c2xvdENvbnRlbnQucHVzaChzb2NrZXRzKTtcclxuXHRcdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtzbG90Q2xhc3N9IHN0eWxlPXt7Ym9yZGVyQ29sb3I6Ym9yZGVyQ29sb3J9fT5cclxuXHRcdFx0XHR7c2xvdENvbnRlbnR9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnlTbG90OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5Q29udGFpbmVyID0gcmVxdWlyZSgnLi9pbnZlbnRvcnktY29udGFpbmVyLmpzeCcpO1xyXG52YXIgSW52ZW50b3J5U3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvSW52ZW50b3J5U3RvcmUnKTtcclxuXHJcbnZhciBJbnZlbnRvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBJbnZlbnRvcnlTdG9yZS5nZXRJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEludmVudG9yeVN0b3JlLmdldEludmVudG9yeSgpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LXNlY3Rpb24nPlxyXG5cdFx0XHRcdDxJbnZlbnRvcnlDb250YWluZXIgXHJcblx0XHRcdFx0XHRpbnZlbnRvcnk9e3RoaXMuc3RhdGUuY3VycmVudEludmVudG9yeX0gXHJcblx0XHRcdFx0XHRoYXNQcmV2aW91cz17dHlwZW9mIHRoaXMuc3RhdGUucHJldmlvdXNJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnfSBcclxuXHRcdFx0XHRcdGhhc05leHQ9e3R5cGVvZiB0aGlzLnN0YXRlLm5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBOZXh0SW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMubmV4dEludmVudG9yeSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbic7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzTmV4dCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgZGlzYWJsZWQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktYnV0dG9uLWNvbnRhaW5lcic+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLl9oYW5kbGVDbGlja30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMzZcIiBoZWlnaHQ9XCIzNlwiIHZpZXdCb3g9XCIwIDAgMzYgMzZcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0xNSA5bC0yLjEyIDIuMTJMMTkuNzYgMThsLTYuODggNi44OEwxNSAyN2w5LTl6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZXh0SW52ZW50b3J5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgUHJldmlvdXNJbnZlbnRvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5wcmV2aW91c0ludmVudG9yeSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbic7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzUHJldmlvdXMpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWJ1dHRvbi1jb250YWluZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMjMuMTIgMTEuMTJMMjEgOWwtOSA5IDkgOSAyLjEyLTIuMTJMMTYuMjQgMTh6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcmV2aW91c0ludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIENsYXNzU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdC8vc3RhdGUgaXMgaGFuZGxlZCBpbiB0aGUgcGFyZW50IGNvbXBvbmVudFxyXG5cdC8vdGhpcyBmdW5jdGlvbiBpcyB1cCB0aGVyZVxyXG5cdGhhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VDbGFzcyh0aGlzLnByb3BzLm5hbWUpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2hvcnRlbmVkTmFtZXMgPSB7XHJcblx0XHRcdEJhcmJhcmlhbjonYmFyYicsXHJcblx0XHRcdENydXNhZGVyOidjcnVzJyxcclxuXHRcdFx0J0RlbW9uIEh1bnRlcic6J2RoJyxcclxuXHRcdFx0TW9uazonbW9uaycsXHJcblx0XHRcdCdXaXRjaCBEb2N0b3InOid3ZCcsXHJcblx0XHRcdFdpemFyZDond2l6J1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBidXR0b25DbGFzcyA9ICdjbGFzcy1zZWxlY3Rvcic7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgc2VsZWN0ZWQnXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGltYWdlQ2xhc3M9IHRoaXMucHJvcHMubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCcnKTtcclxuXHRcdGltYWdlQ2xhc3MrPSB0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxsaT5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2ltYWdlQ2xhc3N9PjwvZGl2PlxyXG5cdFx0XHRcdFx0PHNwYW4+e3RoaXMucHJvcHMubmFtZS50b0xvd2VyQ2FzZSgpfTwvc3Bhbj5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInNob3J0ZW5lZFwiPntzaG9ydGVuZWROYW1lc1t0aGlzLnByb3BzLm5hbWVdfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9saT5cclxuXHRcdCk7XHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzU2VsZWN0b3JCdXR0b247IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIENsYXNzU2VsZWN0b3JCdXR0b24gPSByZXF1aXJlKCcuL2NsYXNzLXNlbGVjdG9yLWJ1dHRvbi5qc3gnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZENsYXNzZXMgPSBbJ0JhcmJhcmlhbicsJ0NydXNhZGVyJywnRGVtb24gSHVudGVyJywnTW9uaycsJ1dpdGNoIERvY3RvcicsJ1dpemFyZCddO1xyXG5cdFx0dmFyIGRDbGFzc2VzTGVuZ3RoID0gZENsYXNzZXMubGVuZ3RoO1xyXG5cclxuXHRcdHZhciBjbGFzc1NlbGVjdG9ycyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaSA9MDsgaSA8IGRDbGFzc2VzTGVuZ3RoO2krKykge1xyXG5cclxuXHRcdFx0Ly9jaGVjayBmb3Igc2VsZWN0ZWQgY2xhc3Mgc3RvcmVkIGluIHN0YXRlIG9mIHRoaXMgY29tcG9uZW50XHJcblx0XHRcdHZhciBzZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gZENsYXNzZXNbaV0pIHtcclxuXHRcdFx0XHRzZWxlY3RlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vcHV0IHNlbGVjdG9ycyBpbiBhcnJheSB0byBiZSByZW5kZXJlZFxyXG5cdFx0XHRjbGFzc1NlbGVjdG9ycy5wdXNoKFxyXG5cdFx0XHRcdDxDbGFzc1NlbGVjdG9yQnV0dG9uIFxyXG5cdFx0XHRcdFx0bmFtZT17ZENsYXNzZXNbaV19IFxyXG5cdFx0XHRcdFx0Y2hhbmdlQ2xhc3M9e3RoaXMucHJvcHMuY2hhbmdlQ2xhc3N9IFxyXG5cdFx0XHRcdFx0a2V5PXtpfSBcclxuXHRcdFx0XHRcdHNlbGVjdGVkPXtzZWxlY3RlZH1cclxuXHRcdFx0XHRcdGdlbmRlcj17dGhpcy5wcm9wcy5nZW5kZXJ9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdDx1bCBjbGFzc05hbWU9J2NsYXNzLXNlbGVjdG9yJz5cclxuXHRcdFx0XHRcdHtjbGFzc1NlbGVjdG9yc31cclxuXHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzU2VsZWN0b3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBHZW5kZXJTZWxlY3RvckJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0dXBkYXRlR2VuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXIodGhpcy5wcm9wcy5nZW5kZXIpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3M9J2dlbmRlci1zZWxlY3RvciAnK3RoaXMucHJvcHMuZ2VuZGVyLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgc2VsZWN0ZWQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdidXR0b24td3JhcHBlcic+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLnVwZGF0ZUdlbmRlcn0gPlxyXG5cdFx0XHRcdFx0PGRpdj48L2Rpdj5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmRlclNlbGVjdG9yQnV0dG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSByZXF1aXJlKCcuL2dlbmRlci1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBtYWxlU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gJ01hbGUnKTtcclxuXHRcdHZhciBmZW1hbGVTZWxlY3RlZCA9ICh0aGlzLnByb3BzLnNlbGVjdGVkID09PSAnRmVtYWxlJyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dlbmRlci1zZWxlY3Rvcic+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yQnV0dG9uIGdlbmRlcj0nTWFsZScgY2hhbmdlR2VuZGVyPXt0aGlzLnByb3BzLmNoYW5nZUdlbmRlcn0gc2VsZWN0ZWQ9e21hbGVTZWxlY3RlZH0gLz5cclxuXHRcdFx0XHQ8R2VuZGVyU2VsZWN0b3JCdXR0b24gZ2VuZGVyPSdGZW1hbGUnIGNoYW5nZUdlbmRlcj17dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXtmZW1hbGVTZWxlY3RlZH0gLz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmRlclNlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSGFyZGNvcmVDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHR1cGRhdGVIYXJkY29yZTpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VIYXJkY29yZSghdGhpcy5wcm9wcy5oYXJkY29yZSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2NoZWNrYm94LXdyYXBwZXInPlxyXG5cdFx0XHRcdDxsYWJlbD5cclxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPSdjaGVja2JveCcgY2xhc3NOYW1lPSdvcHRpb25zLWNoZWNrYm94JyBjaGVja2VkPXt0aGlzLnByb3BzLmhhcmRjb3JlfSBvbkNoYW5nZT17dGhpcy51cGRhdGVIYXJkY29yZX0vPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdjaGVja2JveC1sYWJlbCc+SGFyZGNvcmUgPHNwYW4gY2xhc3NOYW1lPSdoaWRkZW4tc20nPkhlcm88L3NwYW4+PC9zcGFuPlxyXG5cdFx0XHRcdDwvbGFiZWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYXJkY29yZUNoZWNrYm94OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IHJlcXVpcmUoJy4vY2xhc3Mtc2VsZWN0b3IuanN4Jyk7XHJcbnZhciBHZW5kZXJTZWxlY3RvciA9IHJlcXVpcmUoJy4vZ2VuZGVyLXNlbGVjdG9yLmpzeCcpO1xyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IHJlcXVpcmUoJy4vc2Vhc29uYWwtY2hlY2tib3guanN4Jyk7XHJcbnZhciBIYXJkY29yZUNoZWNrYm94ID0gcmVxdWlyZSgnLi9oYXJkY29yZS1jaGVja2JveC5qc3gnKTtcclxuXHJcbnZhciBPcHRpb25zUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpbml0aWFsID0ge1xyXG5cdFx0XHRkQ2xhc3M6J0JhcmJhcmlhbicsXHJcblx0XHRcdGdlbmRlcjonRmVtYWxlJyxcclxuXHRcdFx0aGFyZGNvcmU6ZmFsc2UsXHJcblx0XHRcdHNlYXNvbmFsOnRydWVcclxuXHRcdH07XHJcblx0XHRkM3NpbS5zZXRLYWRhbGEoaW5pdGlhbC5kQ2xhc3MsaW5pdGlhbC5zZWFzb25hbCxpbml0aWFsLmhhcmRjb3JlKTtcclxuXHRcdHJldHVybiBpbml0aWFsO1xyXG5cdH0sXHJcblxyXG5cdGNoYW5nZUdlbmRlcjpmdW5jdGlvbihnZW5kZXIpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRnZW5kZXI6Z2VuZGVyXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoYW5nZUNsYXNzOmZ1bmN0aW9uKGRDbGFzcykge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGRDbGFzczpkQ2xhc3NcclxuXHRcdH0sZnVuY3Rpb24oKSB7XHJcblx0XHRcdGQzc2ltLnNldEthZGFsYSh0aGlzLnN0YXRlLmRDbGFzcyx0aGlzLnN0YXRlLnNlYXNvbmFsLHRoaXMuc3RhdGUuaGFyZGNvcmUpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjaGFuZ2VIYXJkY29yZTpmdW5jdGlvbihib29sKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0aGFyZGNvcmU6Ym9vbFxyXG5cdFx0fSxmdW5jdGlvbigpIHtcclxuXHRcdFx0ZDNzaW0uc2V0S2FkYWxhKHRoaXMuc3RhdGUuZENsYXNzLHRoaXMuc3RhdGUuc2Vhc29uYWwsdGhpcy5zdGF0ZS5oYXJkY29yZSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoYW5nZVNlYXNvbmFsOmZ1bmN0aW9uKGJvb2wpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRzZWFzb25hbDpib29sXHJcblx0XHR9LGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRkM3NpbS5zZXRLYWRhbGEodGhpcy5zdGF0ZS5kQ2xhc3MsdGhpcy5zdGF0ZS5zZWFzb25hbCx0aGlzLnN0YXRlLmhhcmRjb3JlKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGNsYXNzTmFtZT0nb3B0aW9ucy1wYW5lbCcgaWQ9J29wdGlvbnMtcGFuZWwnPlxyXG5cdFx0XHRcdDxDbGFzc1NlbGVjdG9yIGNoYW5nZUNsYXNzPXt0aGlzLmNoYW5nZUNsYXNzfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5kQ2xhc3N9IGdlbmRlcj17dGhpcy5zdGF0ZS5nZW5kZXJ9Lz5cclxuXHRcdFx0XHQ8R2VuZGVyU2VsZWN0b3IgY2hhbmdlR2VuZGVyPXt0aGlzLmNoYW5nZUdlbmRlcn0gc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuZ2VuZGVyfS8+XHJcblx0XHRcdFx0PFNlYXNvbmFsQ2hlY2tib3ggc2Vhc29uYWw9e3RoaXMuc3RhdGUuc2Vhc29uYWx9IGNoYW5nZVNlYXNvbmFsPXt0aGlzLmNoYW5nZVNlYXNvbmFsfS8+XHJcblx0XHRcdFx0PEhhcmRjb3JlQ2hlY2tib3ggaGFyZGNvcmU9e3RoaXMuc3RhdGUuaGFyZGNvcmV9IGNoYW5nZUhhcmRjb3JlPXt0aGlzLmNoYW5nZUhhcmRjb3JlfS8+XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uc1BhbmVsOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHR1cGRhdGVTZWFzb25hbDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlU2Vhc29uYWwoIXRoaXMucHJvcHMuc2Vhc29uYWwpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjaGVja2JveC13cmFwcGVyJz5cclxuXHRcdFx0XHQ8bGFiZWw+XHJcblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGNsYXNzTmFtZT0nb3B0aW9ucy1jaGVja2JveCcgY2hlY2tlZD17dGhpcy5wcm9wcy5zZWFzb25hbH0gb25DaGFuZ2U9e3RoaXMudXBkYXRlU2Vhc29uYWx9Lz5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nY2hlY2tib3gtbGFiZWwnPlNlYXNvbmFsIDxzcGFuIGNsYXNzTmFtZT0naGlkZGVuLXNtJz5IZXJvPC9zcGFuPjwvc3Bhbj5cclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Vhc29uYWxDaGVja2JveDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBLYWRhbGFJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge3NoYXJkQ291bnQ6MH07XHJcblx0fSxcclxuXHRidXlJdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0Ly9pbmNyZW1lbnQgdGhlIGJsb29kIHNoYXJkIGNvdW50XHJcblx0XHR2YXIgY3VycmVudENvdW50ID0gdGhpcy5zdGF0ZS5zaGFyZENvdW50O1xyXG5cdFx0Y3VycmVudENvdW50ICs9IHRoaXMucHJvcHMuaXRlbS5jb3N0O1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2hhcmRDb3VudDpjdXJyZW50Q291bnR9KTtcclxuXHJcblx0XHR2YXIgaXRlbSA9IGQzc2ltLmthZGFsYVJvbGwodGhpcy5wcm9wcy5pdGVtLnR5cGUpO1xyXG5cdFx0aXRlbS5zaXplID0gdGhpcy5wcm9wcy5pdGVtLnNpemU7XHJcblx0XHRBcHBBY3Rpb25zLmFkZEl0ZW0oaXRlbSk7XHJcblx0fSxcclxuXHRyZXNldENvdW50OmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2hhcmRDb3VudDowfSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBpY29uQ2xhc3MgPSAna2FkYWxhLWljb24nO1xyXG5cdFx0aWNvbkNsYXNzKz0nICcrdGhpcy5wcm9wcy5pdGVtLnR5cGU7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2thZGFsYS1pdGVtJz5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT0na2FkYWxhJyBvbkNsaWNrPXt0aGlzLmJ1eUl0ZW19PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2ljb25DbGFzc30+PC9kaXY+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5pdGVtLmNvc3R9PC9zcGFuPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdrYWRhbGEtY29udGVudCc+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2thZGFsYS1pdGVtLXRpdGxlJz57dGhpcy5wcm9wcy5pdGVtLnRleHR9PC9zcGFuPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdzaGFyZC1jb3VudCc+XHJcblx0XHRcdFx0XHRcdHt0aGlzLnN0YXRlLnNoYXJkQ291bnR9XHJcblx0XHRcdFx0XHRcdDxhIGNsYXNzTmFtZT0nc2hhcmQtZGVsZXRlJyBvbkNsaWNrPXt0aGlzLnJlc2V0Q291bnR9PlxyXG5cdFx0XHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0elwiLz5cclxuXHRcdFx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHRcdFx0PC9hPlxyXG5cdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2FkYWxhSXRlbTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEthZGFsYUl0ZW0gPSByZXF1aXJlKCcuL2thZGFsYS1pdGVtLmpzeCcpO1xyXG5cclxudmFyIEthZGFsYVN0b3JlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIga2FkYWxhQ2xhc3MgPSAna2FkYWxhLXN0b3JlJztcclxuXHRcdC8vdGhpcyBpcyBhIGNoZWNrIGZvciBpbnRlcm5ldCBleHBsb3JlclxyXG5cdFx0Ly9mbGV4LWRpcmVjdGlvbjpjb2x1bW4gYnJlYWtzIGV2ZXJ5dGhpbmcgc28gd2UgZGV0ZWN0IGZvciBpdCBoZXJlXHJcblx0XHRpZiAoKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgJykgIT09IC0xKXx8IW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQuKnJ2XFw6MTFcXC4vKSkge1xyXG5cdFx0XHRrYWRhbGFDbGFzcys9JyBub2llJ1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpdGVtcyA9IFtcclxuXHRcdFx0e3R5cGU6J2hlbG0nLHRleHQ6J015c3RlcnkgSGVsbWV0Jyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidib290cycsdGV4dDonTXlzdGVyeSBCb290cycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonYmVsdCcsdGV4dDonTXlzdGVyeSBCZWx0Jyxjb3N0OjI1LHNpemU6MX0sXHJcblx0XHRcdHt0eXBlOidwYW50cycsdGV4dDonTXlzdGVyeSBQYW50cycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonZ2xvdmVzJyx0ZXh0OidNeXN0ZXJ5IEdsb3ZlcycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonY2hlc3QnLHRleHQ6J015c3RlcnkgQ2hlc3QnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3Nob3VsZGVycycsdGV4dDonTXlzdGVyeSBTaG91bGRlcnMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2JyYWNlcnMnLHRleHQ6J015c3RlcnkgQnJhY2VycycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZToncXVpdmVyJyx0ZXh0OidNeXN0ZXJ5IFF1aXZlcicsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonbW9qbycsdGV4dDonTXlzdGVyeSBNb2pvJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidzb3VyY2UnLHRleHQ6J015c3RlcnkgU291cmNlJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidzaGllbGQnLHRleHQ6J015c3RlcnkgU2hpZWxkJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidvbmVoYW5kJyx0ZXh0OicxLUggTXlzdGVyeSBXZWFwb24nLGNvc3Q6NzUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3R3b2hhbmQnLHRleHQ6JzItSCBNeXN0ZXJ5IFdlYXBvbicsY29zdDo3NSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZToncmluZycsdGV4dDonTXlzdGVyeSBSaW5nJyxjb3N0OjUwLHNpemU6MX0sXHJcblx0XHRcdHt0eXBlOidhbXVsZXQnLHRleHQ6J015c3RlcnkgQW11bGV0Jyxjb3N0OjEwMCxzaXplOjF9XHJcblx0XHRdXHJcblxyXG5cdFx0dmFyIGthZGFsYVNsb3RzID0gW107XHJcblx0XHR2YXIgaXRlbXNMZW5ndGggPSBpdGVtcy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwgaXRlbXNMZW5ndGg7IGkrKykge1xyXG5cdFx0XHRrYWRhbGFTbG90cy5wdXNoKDxLYWRhbGFJdGVtIGtleT17aX0gaXRlbT17aXRlbXNbaV19IC8+KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17a2FkYWxhQ2xhc3N9IGlkPSdrYWRhbGEtc3RvcmUnPlxyXG5cdFx0XHRcdHtrYWRhbGFTbG90c31cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEthZGFsYVN0b3JlOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgTmF2YmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG9wdGlvbnM6ZmFsc2UsXHJcblx0XHRcdHN0b3JlOmZhbHNlXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0dG9nZ2xlT3B0aW9uczpmdW5jdGlvbigpIHtcclxuXHRcdC8vdG9nZ2xlIHRoZSBvcHRpb24gcGFuZWwgYW5kIHRoZSBzdGF0ZVxyXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29wdGlvbnMtcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gKHRoaXMuc3RhdGUub3B0aW9ucyk/ICdub25lJzonYmxvY2snO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7b3B0aW9uczohdGhpcy5zdGF0ZS5vcHRpb25zfSk7XHJcblx0fSxcclxuXHR0b2dnbGVTdG9yZTpmdW5jdGlvbigpIHtcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdrYWRhbGEtc3RvcmUnKS5zdHlsZS5kaXNwbGF5ID0gKHRoaXMuc3RhdGUuc3RvcmUpPyAnbm9uZSc6J2Jsb2NrJztcclxuXHRcdHRoaXMuc2V0U3RhdGUoe3N0b3JlOiF0aGlzLnN0YXRlLnN0b3JlfSk7XHJcblx0fSxcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4oXHJcblx0XHRcdDxuYXY+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2hhbScgb25DbGljaz17dGhpcy50b2dnbGVPcHRpb25zfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTMgMThoMTh2LTJIM3Yyem0wLTVoMTh2LTJIM3Yyem0wLTd2MmgxOFY2SDN6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0PGgxPkthZGFsYSBTaW11bGF0b3I8L2gxPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdidXknPkJ1eSBtb3JlIFNoaXQ8L2J1dHRvbj5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT0nc2hvcCcgb25DbGljaz17dGhpcy50b2dnbGVTdG9yZX0+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0xNiA2VjRjMC0xLjExLS44OS0yLTItMmgtNGMtMS4xMSAwLTIgLjg5LTIgMnYySDJ2MTNjMCAxLjExLjg5IDIgMiAyaDE2YzEuMTEgMCAyLS44OSAyLTJWNmgtNnptLTYtMmg0djJoLTRWNHpNOSAxOFY5bDcuNSA0TDkgMTh6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvbmF2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZiYXI7IiwidmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xyXG5cdEFERF9JVEVNOm51bGwsXHJcblxyXG5cdFBSRVZfSU5WOm51bGwsXHJcblx0TkVYVF9JTlY6bnVsbFxyXG59KTsiLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpOyIsInZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XHJcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XHJcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcblxyXG52YXIgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XHJcblxyXG4vL3RoZXJlIGFyZSBvbmx5IHR3byBpbnZlbnRvcmllcyBiZWluZyB1c2VkIHdpdGggdGhlIGFiaWxpdHkgdG8gY3ljbGUgYmFja1xyXG52YXIgcHJldmlvdXNJbnZlbnRvcnk7XHJcbnZhciBjdXJyZW50SW52ZW50b3J5O1xyXG52YXIgbmV4dEludmVudG9yeTtcclxuXHJcbi8vY3JlYXRlcyBuZXN0ZWQgYXJyYXkgYmxhbmsgaW52ZW50b3J5IGFuZCBzZXRzIGFzIHRoZSBjdXJyZW50IGludmVudG9yeVxyXG5mdW5jdGlvbiBjcmVhdGVJbnZlbnRvcnkoKSB7XHJcblx0dmFyIG5ld0ludmVudG9yeSA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTwxMDtpKyspIHtcclxuXHRcdC8vcHVzaCBhIGJsYW5rIGFycmF5IHRvIHJlcHJlc2VudCBlYWNoIGNvbHVtbiBvZiB0aGUgaW52ZW50b3J5XHJcblx0XHRuZXdJbnZlbnRvcnkucHVzaChbXSk7XHJcblx0fVxyXG5cclxuXHQvL3NldCB0aGUgcHJldmlvdXMgaW52ZW50b3J5IHRvIHRoZSBsYXRlc3QgaW52ZW50b3J5IHVzZWRcclxuXHRwcmV2aW91c0ludmVudG9yeSA9IG5leHRJbnZlbnRvcnkgfHwgY3VycmVudEludmVudG9yeSB8fCB1bmRlZmluZWQ7XHJcblx0Ly90aGUgbmV3IGJsYW5rIGludmVudG9yeSBpcyBub3cgdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcblx0Y3VycmVudEludmVudG9yeSA9IG5ld0ludmVudG9yeTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW52ZW50b3J5KCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeTpwcmV2aW91c0ludmVudG9yeSxcclxuXHRcdGN1cnJlbnRJbnZlbnRvcnk6Y3VycmVudEludmVudG9yeSxcclxuXHRcdG5leHRJbnZlbnRvcnk6bmV4dEludmVudG9yeVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEl0ZW0oaXRlbSkge1xyXG5cdHZhciBpbnZlbnRvcnlMZW5ndGggPSBjdXJyZW50SW52ZW50b3J5Lmxlbmd0aDtcclxuXHQvL2xvb3BpbmcgdGhyb3VnaCBlYWNoIGNvbHVtbiBvZiB0aGUgaW52ZW50b3J5XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbnZlbnRvcnlMZW5ndGg7IGkgKyspIHtcclxuXHRcdC8vbG9vcCB0aHJvdWdoIGVhY2ggaXRlbSBpbiBzYWlkIGNvbHVtblxyXG5cdFx0dmFyIGNvbHVtbkxlbmd0aCA9IGN1cnJlbnRJbnZlbnRvcnlbaV0ubGVuZ3RoO1xyXG5cdFx0dmFyIGNvbHVtbkhlaWdodCA9IDA7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvbHVtbkxlbmd0aDsgaisrKSB7XHJcblx0XHRcdC8vYWRkIGN1cnJlbnQgaXRlbSBzaXplIHRvIGNvbHVtbiBoZWlnaHRcclxuXHRcdFx0aWYoY3VycmVudEludmVudG9yeVtpXVtqXS5oYXNPd25Qcm9wZXJ0eSgnc2l6ZScpKSB7XHJcblx0XHRcdFx0Y29sdW1uSGVpZ2h0Kz1jdXJyZW50SW52ZW50b3J5W2ldW2pdLnNpemU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vY2hlY2sgaWYgdGhlIGhlaWdodCBpcyBzdGlsbCBsZXNzIHRoYW4gNiB3aXRoIG5ldyBpdGVtXHJcblx0XHQvL2FuZCBhZGQgdG8gdGhhdCBjb2x1bW4gYW5kIHJldHVybiB0byBzdG9wIHRoZSBtYWRuZXNzXHJcblx0XHRpZiAoY29sdW1uSGVpZ2h0K2l0ZW0uc2l6ZSA8PTYpIHtcclxuXHRcdFx0Y3VycmVudEludmVudG9yeVtpXS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvL2lmIHdlIG1hZGUgaXQgdGhpcyBmYXIgdGhlIG5ldyBpdGVtIGRvZXMgbm90IGZpdCBpbiB0aGUgY3VycmVudCBpbnZlbnRvcnlcclxuXHQvL2NoZWNrIHRvIHNlZSBpZiB0aGVyZSBpcyBhIG5leHQgaW52ZW50b3J5XHJcblx0Ly9zbyB0aGF0IHdlIGNhbiBjeWNsZSB0byBuZXh0IGludmVudG9yeSBhbmQgdHJ5IGFuZCBmaXQgaXQgaW5cclxuXHRpZiAodHlwZW9mIG5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRnb3RvTmV4dCgpO1xyXG5cdFx0YWRkSXRlbShpdGVtKTtcclxuXHR9XHJcblx0Ly90aGVyZSBpcyBubyBuZXh0IGludmVudG9yeSBhbmQgd2UgbmVlZCB0byBtYWtlIGEgbmV3IG9uZVxyXG5cdGVsc2Uge1xyXG5cdFx0Y3JlYXRlSW52ZW50b3J5KCk7XHJcblx0XHRhZGRJdGVtKGl0ZW0pO1xyXG5cdH1cclxufVxyXG5cclxuLy9jeWNsZXMgdGhyb3VnaCB0byB0aGUgcHJldmlvdXMgaW52ZW50b3J5XHJcbmZ1bmN0aW9uIGdvdG9QcmV2aW91cygpIHtcclxuXHRpZih0eXBlb2YgcHJldmlvdXNJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRuZXh0SW52ZW50b3J5ID0gY3VycmVudEludmVudG9yeTtcclxuXHRcdGN1cnJlbnRJbnZlbnRvcnkgPSBwcmV2aW91c0ludmVudG9yeTtcclxuXHRcdHByZXZpb3VzSW52ZW50b3J5ID0gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuLy9jeWNsZXMgdGhyb3VnaCB0byB0aGUgbmV4dCBpbnZlbnRvcnlcclxuZnVuY3Rpb24gZ290b05leHQoKSB7XHJcblx0aWYodHlwZW9mIG5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeSA9IGN1cnJlbnRJbnZlbnRvcnk7XHJcblx0XHRjdXJyZW50SW52ZW50b3J5ID0gbmV4dEludmVudG9yeTtcclxuXHRcdG5leHRJbnZlbnRvcnkgPSB1bmRlZmluZWQ7XHJcblx0fVxyXG59XHJcblxyXG4vL2luaXRpYWxpemUgc3RvcmUgYnkgY3JlYXRpbmcgYSBibGFuayBpbnZlbnRvcnlcclxuY3JlYXRlSW52ZW50b3J5KCk7XHJcblxyXG52YXIgSW52ZW50b3J5U3RvcmUgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUse1xyXG5cdGdldEludmVudG9yeTpnZXRJbnZlbnRvcnksXHJcblx0Z290b1ByZXZpb3VzOmdvdG9QcmV2aW91cyxcclxuXHRnb3RvTmV4dDpnb3RvTmV4dCxcclxuXHRhZGRJdGVtOmFkZEl0ZW0sXHJcblxyXG5cdGVtaXRDaGFuZ2U6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuZW1pdChDSEFOR0VfRVZFTlQpO1xyXG5cdH0sXHJcblx0YWRkQ2hhbmdlTGlzdGVuZXI6ZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMub24oQ0hBTkdFX0VWRU5ULGNhbGxiYWNrKTtcclxuXHR9LFxyXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCxjYWxsYmFjayk7XHJcblx0fVxyXG59KTtcclxuXHJcbkFwcERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24oYWN0aW9uKSB7XHJcblx0c3dpdGNoKGFjdGlvbi5hY3Rpb25UeXBlKSB7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuQUREX0lURU06XHJcblx0XHRcdGFkZEl0ZW0oYWN0aW9uLml0ZW0pO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLlBSRVZfSU5WOlxyXG5cdFx0XHRnb3RvUHJldmlvdXMoKTtcclxuXHRcdFx0SW52ZW50b3J5U3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5ORVhUX0lOVjpcclxuXHRcdFx0Z290b05leHQoKTtcclxuXHRcdFx0SW52ZW50b3J5U3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHQvL25vb3BcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnlTdG9yZTsiXX0=
