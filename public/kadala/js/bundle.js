(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var Navbar = require('./components/common/navbar.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');
var KadalaStore = require('./components/kadala-store/kadala-store.jsx');
var Inventory = require('./components/inventory/inventory.jsx');
var IndividualItem = require('./components/individual-item/individual-item.jsx');
var Footer = require('./components/common/footer.jsx');

var AppStore = require('./stores/AppStore.js');

var Application = React.createClass({displayName: "Application",
	getInitialState:function() {
		return AppStore.getSettings();
	},
	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);

		//opacity on loader for the nice fade effect via css transition
		var loader = document.getElementById('loading');
		loader.style.opacity = '0';

		//display none so we can click through it as pointer-events is buggy
		window.setTimeout(function() {
			loader.style.display = 'none';
		},1000);
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
				), 
				React.createElement(Footer, null)
			)
		);
	}
});

React.render(
	React.createElement(Application, null),
	document.getElementById('app')
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./components/common/footer.jsx":9,"./components/common/navbar.jsx":10,"./components/individual-item/individual-item.jsx":18,"./components/inventory/inventory.jsx":23,"./components/kadala-options/options-panel.jsx":31,"./components/kadala-store/kadala-store.jsx":34,"./stores/AppStore.js":37}],2:[function(require,module,exports){
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
	},
	clearShards:function(key) {
		AppDispatcher.dispatch({
			actionType:AppConstants.CLEAR_SHARDS,
			key:key
		});
	}

};

module.exports = AppActions;

},{"../constants/AppConstants":35,"../dispatcher/AppDispatcher":36}],9:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var Footer = React.createClass({displayName: "Footer",
	render:function() {
		return (
			React.createElement("footer", null, 
				React.createElement("span", {className: "footer-left"}, 
					React.createElement("a", {href: "//us.battle.net/d3/en/"}, "Diablo III"), " ©",  
					React.createElement("a", {href: "//us.blizzard.com/en-us/"}, "Blizzard Entertainment, Inc.")
				), 
				React.createElement("span", {className: "footer-right"}, 
				/*Github - From Foundation Icons by Zurb MIT Licence*/
				React.createElement("a", {href: "//github.com/benstepp"}, 
					React.createElement("svg", {version: "1.1", id: "Layer_1", x: "0px", y: "0px", 
						 width: "24px", height: "24px", viewBox: "0 0 100 100", "enable-background": "new 0 0 100 100"}, 
					React.createElement("g", null, 
						React.createElement("path", {"fill-rule": "evenodd", "clip-rule": "evenodd", d: "M49.998,11.963C28.461,11.963,11,29.425,11,50.965" + ' ' +
							"c0,17.231,11.172,31.849,26.671,37.003c1.952,0.361,2.662-0.84,2.662-1.877c0-0.924-0.034-3.375-0.051-6.633" + ' ' +
							"c-10.849,2.359-13.138-5.229-13.138-5.229c-1.774-4.505-4.331-5.703-4.331-5.703c-3.541-2.418,0.269-2.371,0.269-2.371" + ' ' +
							"c3.914,0.277,5.974,4.018,5.974,4.018c3.478,5.96,9.129,4.235,11.35,3.243c0.353-2.525,1.363-4.24,2.476-5.217" + ' ' +
							"c-8.659-0.984-17.763-4.33-17.763-19.274c0-4.259,1.519-7.741,4.013-10.468c-0.399-0.982-1.74-4.947,0.383-10.319" + ' ' +
							"c0,0,3.274-1.048,10.726,4.001c3.109-0.869,6.446-1.303,9.763-1.316c3.312,0.014,6.65,0.447,9.763,1.316" + ' ' +
							"c7.447-5.049,10.716-4.001,10.716-4.001c2.128,5.372,0.788,9.337,0.388,10.319c2.5,2.727,4.008,6.209,4.008,10.468" + ' ' +
							"c0,14.979-9.117,18.279-17.805,19.241c1.398,1.205,2.646,3.59,2.646,7.229c0,5.211-0.047,9.416-0.047,10.695" + ' ' +
							"c0,1.045,0.701,2.26,2.681,1.873C77.836,82.798,89,68.191,89,50.965C89,29.425,71.539,11.963,49.998,11.963z"})
					)
					)
				), 
				/*Twitter - From Foundation Icons by Zurb MIT Licence*/
				React.createElement("a", {href: "//twitter.com/benstepp"}, 
					React.createElement("svg", {version: "1.1", id: "Layer_1", x: "0px", y: "0px", 
						 width: "24px", height: "24px", viewBox: "0 0 100 100", "enable-background": "new 0 0 100 100"}, 
					React.createElement("path", {d: "M88.5,26.12c-2.833,1.256-5.877,2.105-9.073,2.486c3.261-1.955,5.767-5.051,6.945-8.738" + ' ' +
						"c-3.052,1.81-6.434,3.126-10.031,3.832c-2.881-3.068-6.987-4.988-11.531-4.988c-8.724,0-15.798,7.072-15.798,15.798" + ' ' +
						"c0,1.237,0.14,2.444,0.41,3.601c-13.13-0.659-24.77-6.949-32.562-16.508c-1.36,2.334-2.139,5.049-2.139,7.943" + ' ' +
						"c0,5.481,2.789,10.315,7.028,13.149c-2.589-0.083-5.025-0.794-7.155-1.976c-0.002,0.066-0.002,0.131-0.002,0.199" + ' ' +
						"c0,7.652,5.445,14.037,12.671,15.49c-1.325,0.359-2.72,0.553-4.161,0.553c-1.019,0-2.008-0.098-2.973-0.283" + ' ' +
						"c2.01,6.275,7.844,10.844,14.757,10.972c-5.407,4.236-12.218,6.763-19.62,6.763c-1.275,0-2.532-0.074-3.769-0.221" + ' ' +
						"c6.991,4.482,15.295,7.096,24.216,7.096c29.058,0,44.948-24.071,44.948-44.945c0-0.684-0.016-1.367-0.046-2.046" + ' ' +
						"C83.704,32.071,86.383,29.288,88.5,26.12z"})
					)
				), 
				/*Steam - From Foundation Icons by Zurb MIT Licence*/
				React.createElement("a", {href: "//steamcommunity.com/id/fooman"}, 
					React.createElement("svg", {version: "1.1", id: "Layer_1", x: "0px", y: "0px", 
						 width: "24px", height: "24px", viewBox: "0 0 100 100", "enable-background": "new 0 0 100 100"}, 
					React.createElement("path", {id: "Gears", d: "M92.43,40.935c0,3.889-3.155,7.039-7.041,7.039c-3.886,0-7.039-3.15-7.039-7.039" + ' ' +
						"c0-3.883,3.153-7.039,7.039-7.039C89.275,33.895,92.43,37.052,92.43,40.935z M85.354,27.831c-7.218,0-13.08,5.822-13.145,13.025" + ' ' +
						"l-8.19,11.736c-0.333-0.035-0.672-0.055-1.016-0.055c-1.829,0-3.539,0.504-5.008,1.381L20.901,39.001" + ' ' +
						"c-0.97-4.4-4.903-7.719-9.586-7.719c-5.406,0-9.815,4.424-9.815,9.828c0,5.41,4.409,9.816,9.815,9.816" + ' ' +
						"c1.83,0,3.541-0.504,5.009-1.379l37.094,14.889c0.959,4.412,4.893,7.733,9.584,7.733c5.083,0,9.275-3.896,9.762-8.858l12.589-9.201" + ' ' +
						"c7.258,0,13.146-5.877,13.146-13.135S92.612,27.831,85.354,27.831z M85.354,32.163c4.863,0,8.813,3.951,8.813,8.812" + ' ' +
						"c0,4.863-3.951,8.801-8.813,8.801c-4.861,0-8.813-3.938-8.813-8.801C76.541,36.114,80.493,32.163,85.354,32.163z M11.315,33.882" + ' ' +
						"c2.773,0,5.166,1.549,6.377,3.832l-3.588-1.436v0.016c-2.891-1.041-6.102,0.375-7.256,3.248c-1.156,2.873,0.174,6.127,2.978,7.379" + ' ' +
						"v0.014l3.046,1.215c-0.501,0.111-1.023,0.178-1.557,0.178c-3.999,0-7.215-3.217-7.215-7.217C4.1,37.112,7.315,33.882,11.315,33.882z" + ' ' +
						 "M63.002,55.136c4.001,0,7.216,3.217,7.216,7.217c0,3.998-3.215,7.215-7.216,7.215c-2.781,0-5.184-1.551-6.389-3.844" + ' ' +
						"c1.187,0.48,2.375,0.953,3.56,1.436c2.941,1.182,6.292-0.242,7.473-3.182c1.183-2.941-0.254-6.275-3.196-7.459l-3.004-1.205" + ' ' +
						"C61.947,55.206,62.469,55.136,63.002,55.136z"})
					)
				)
				)
			)
		);
	}
});

module.exports = Footer;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);

var AppActions = require('../../actions/AppActions.js');
var AppStore = require('../../stores/AppStore.js');

var Navbar = React.createClass({displayName: "Navbar",

	propTypes:{
		mobile:React.PropTypes.bool
	},

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

	_buyItem:function() {
		var item = d3sim.kadalaRoll(this.state.item.type);
		item.size = this.state.item.size;
		AppActions.addItem(item);
		AppActions.incrementShards(this.state.item.type,this.state.item.cost);
	},
	_toggleOptions:function() {
		AppActions.toggleOptions();
	},
	_toggleStore:function() {
		AppActions.toggleStore();
	},

	render:function() {
		return(
			React.createElement("nav", null, 
				React.createElement("button", {className: "ham", onClick: this._toggleOptions}, 
					/*From Material Design icons by Google (CC by 4.0)*/
					React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"}, 
						React.createElement("path", {d: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"})
					)
				), 
				React.createElement("h1", null, React.createElement("a", {href: "/kadala/"}, "Kadala Simulator")), 
				React.createElement("button", {className: "buy", onClick: this._buyItem}, this.state.item.text), 
				React.createElement("button", {className: "shop", onClick: this._toggleStore}, 
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

},{"../../actions/AppActions.js":8,"../../stores/AppStore.js":37}],11:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipArmor = React.createClass({displayName: "D3ItemTooltipArmor",

	propTypes:{
		armor:React.PropTypes.number
	},

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

},{}],12:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipArmor = require('./d3-tooltip-armor.jsx');
var D3ItemTooltipStat = require('./d3-tooltip-stat.jsx');
var D3ItemTooltipWeapon = require('./d3-tooltip-weapon.jsx');

var D3ItemTooltipBody = React.createClass({displayName: "D3ItemTooltipBody",

	propTypes:{
		item:React.PropTypes.object
	},

	render: function() {

		var iconClasses = 'd3-icon d3-icon-item d3-icon-item-large';
		var itemTypeClass ='d3-color-'; 

		//declare arrays for primary and secondary item effects. 
		//An item must have at least one of each.
		//Create the list item for each stat and push in the arrays
		var primaries = forEach(this.props.item.primaries);
		var secondaries = forEach(this.props.item.secondaries);

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
		if (this.props.item.hasOwnProperty('weaponDps')) {
			subHead = React.createElement(D3ItemTooltipWeapon, {
				damageRange: this.props.item.damageRange, 
				speed: this.props.item.speed, 
				weaponDps: this.props.item.weaponDps}
				);
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
	}
});

module.exports = D3ItemTooltipBody;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./d3-tooltip-armor.jsx":11,"./d3-tooltip-stat.jsx":15,"./d3-tooltip-weapon.jsx":16}],13:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipFlavor = React.createClass({displayName: "D3ItemTooltipFlavor",

	propTypes:{
		flavor:React.PropTypes.string
	},

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

},{}],14:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipHead = React.createClass({displayName: "D3ItemTooltipHead",

	propTypes:{
		color:React.PropTypes.string,
		name:React.PropTypes.string,
	},

	render: function() {

		//initial class set for the tooltip head
		var divClass='tooltip-head';
		var h3Class='';

		//modify the classes if a color was passed
		//fallback color is handled by d3-tooltip css
		if (this.props.color) {
			divClass += ' tooltip-head-' + this.props.color;
			h3Class += 'd3-color-' + this.props.color;
		}
		//make the font smaller if the name is long
		if (this.props.name.length > 40) {
			h3Class+= ' smallest';
		}
		else if(this.props.name.length >22) {
			h3Class+= ' smaller';
		}

		return (
			React.createElement("div", {className: divClass}, 
				React.createElement("h3", {className: h3Class}, 
					this.props.name
				)
			)
		);
	}
});

module.exports = D3ItemTooltipHead;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],15:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipStat= React.createClass({displayName: "D3ItemTooltipStat",

	propTypes:{
		stat:React.PropTypes.object
	},

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

},{}],16:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipWeapon= React.createClass({displayName: "D3ItemTooltipWeapon",

	propTypes:{
		damageRange:React.PropTypes.array,
		speed:React.PropTypes.number,
		weaponDps:React.PropTypes.number
	},

	render: function() {
		return (
			React.createElement("div", null, 
			React.createElement("ul", {className: "item-armor-weapon item-weapon-dps"}, 
				React.createElement("li", {className: "big"}, React.createElement("span", {className: "value"}, Math.round( this.props.weaponDps * 10 ) / 10)), 
				React.createElement("li", null, "Damage Per Second")
			), 
			React.createElement("ul", {className: "item-armor-weapon item-weapon damage"}, 
				React.createElement("li", null, 
					React.createElement("p", null, 
						React.createElement("span", {className: "value"}, this.props.damageRange[0]), " -", 
						React.createElement("span", {className: "value"}, " ", this.props.damageRange[1]), 
						React.createElement("span", {className: "d3-color-FF888888"}, " Damage")
					)
				), 
				React.createElement("li", null, 
					React.createElement("p", null, 
						React.createElement("span", {className: "value"}, this.props.speed.toFixed(2)), 
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

},{}],17:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipHead = require('./d3-tooltip-head.jsx');
var D3ItemTooltipBody = require('./d3-tooltip-body.jsx');
var D3ItemTooltipFlavor = require('./d3-tooltip-flavor.jsx');

var D3ItemTooltip = React.createClass({displayName: "D3ItemTooltip",

	propTypes:{
		item:React.PropTypes.object
	},

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
					React.createElement(D3ItemTooltipHead, {color: this.props.item.color, name: this.props.item.name}), 
					React.createElement(D3ItemTooltipBody, {item: this.props.item}), 
					flavor
				)
			)
		);
	}
});

module.exports = D3ItemTooltip;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./d3-tooltip-body.jsx":12,"./d3-tooltip-flavor.jsx":13,"./d3-tooltip-head.jsx":14}],18:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltip = require('../d3-tooltip/d3-tooltip.jsx');
var InventoryStore = require('../../stores/InventoryStore');
var ItemLeft = require('./item-left.jsx');
var ItemRight = require('./item-right.jsx');

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

		//only show tooltips/buttons if an item has already been created
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

},{"../../stores/InventoryStore":38,"../d3-tooltip/d3-tooltip.jsx":17,"./item-left.jsx":19,"./item-right.jsx":20}],19:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var AppActions = require('../../actions/AppActions');

var ItemLeft = React.createClass({displayName: "ItemLeft",

	propTypes:{
		hasPrevious:React.PropTypes.bool,
		hideClass:React.PropTypes.string
	},

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

},{"../../actions/AppActions":8}],20:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var AppActions = require('../../actions/AppActions');

var ItemRight = React.createClass({displayName: "ItemRight",

	propTypes:{
		hasNext:React.PropTypes.bool,
		hideClass:React.PropTypes.string
	},

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

},{"../../actions/AppActions":8}],21:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var InventorySlot = require('./inventory-slot.jsx');
var NextInventory = require('./next-inventory.jsx');
var PreviousInventory = require('./previous-inventory.jsx');

var InventoryContainer = React.createClass({displayName: "InventoryContainer",

	propTypes:{
		hasNext:React.PropTypes.bool,
		hasPrevious:React.PropTypes.bool,
		inventory:React.PropTypes.array
	},

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

},{"./inventory-slot.jsx":22,"./next-inventory.jsx":24,"./previous-inventory.jsx":25}],22:[function(require,module,exports){
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
						bgurl='//us.battle.net/d3/static/images/item/icon-bgs/orange.png';
						borderColor='#bf642f';
						break;
					default:
						//noop
				}

				//switch bg to green if item is part of a set
				if (this.props.data.hasOwnProperty('set')) {
					bgurl='//us.battle.net/d3/static/images/item/icon-bgs/green.png';
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

},{"../d3-tooltip/d3-tooltip.jsx":17}],23:[function(require,module,exports){
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

},{"../../stores/InventoryStore":38,"./inventory-container.jsx":21}],24:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var AppActions = require('../../actions/AppActions');

var NextInventory = React.createClass({displayName: "NextInventory",

	propTypes:{
		hasNext:React.PropTypes.bool
	},

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

},{"../../actions/AppActions":8}],25:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var AppActions = require('../../actions/AppActions');

var PreviousInventory = React.createClass({displayName: "PreviousInventory",

	propTypes:{
		hasPrevious:React.PropTypes.bool
	},

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

},{"../../actions/AppActions":8}],26:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var ClassSelectorButton = React.createClass({displayName: "ClassSelectorButton",

	propTypes:{
		changeClass:React.PropTypes.func,
		gender:React.PropTypes.string,
		name:React.PropTypes.string,
		selected:React.PropTypes.bool
	},

	_handleClick:function() {
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
				React.createElement("button", {className: buttonClass, onClick: this._handleClick}, 
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

},{}],27:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var ClassSelectorButton = require('./class-selector-button.jsx');

var ClassSelector = React.createClass({displayName: "ClassSelector",

	propTypes:{
		changeClass:React.PropTypes.func,
		gender:React.PropTypes.string,
		selected:React.PropTypes.string
	},

	render:function() {

		var dClasses = ['Barbarian','Crusader','Demon Hunter','Monk','Witch Doctor','Wizard'];
		var dClassesLength = dClasses.length;

		var classSelectors = [];
		for (var i =0; i < dClassesLength;i++) {

			//check for selected class stored in state of this component
			var selected = (this.props.selected === dClasses[i]);

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

},{"./class-selector-button.jsx":26}],28:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var GenderSelectorButton = React.createClass({displayName: "GenderSelectorButton",

	propTypes:{
		changeGender:React.PropTypes.func,
		gender:React.PropTypes.string,
		selected:React.PropTypes.bool
	},

	_updateGender:function() {
		this.props.changeGender(this.props.gender);
	},

	render:function() {

		var buttonClass='gender-selector '+this.props.gender.toLowerCase();
		if (this.props.selected) {
			buttonClass+= ' selected';
		}

		return (
			React.createElement("div", {className: "button-wrapper"}, 
				React.createElement("button", {className: buttonClass, onClick: this._updateGender}, 
					React.createElement("div", null), 
					React.createElement("span", null, this.props.gender.toLowerCase())
				)
			)
		);
	}
});

module.exports = GenderSelectorButton;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],29:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var GenderSelectorButton = require('./gender-selector-button.jsx');

var GenderSelector = React.createClass({displayName: "GenderSelector",

	propTypes:{
		changeGender:React.PropTypes.func,
		selected:React.PropTypes.string
	},

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

},{"./gender-selector-button.jsx":28}],30:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var HardcoreCheckbox = React.createClass({displayName: "HardcoreCheckbox",

	propTypes:{
		changeHardcore:React.PropTypes.func,
		hardcore:React.PropTypes.bool
	},

	_updateHardcore:function(){
		this.props.changeHardcore(!this.props.hardcore);
	},

	render:function() {
		return (
			React.createElement("div", {className: "checkbox-wrapper"}, 
				React.createElement("label", null, 
					React.createElement("input", {type: "checkbox", className: "options-checkbox", checked: this.props.hardcore, onChange: this._updateHardcore}), 
					React.createElement("span", {className: "checkbox-label"}, "Hardcore ", React.createElement("span", {className: "hidden-sm"}, "Hero"))
				)
			)
		);
	}
});

module.exports = HardcoreCheckbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],31:[function(require,module,exports){
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

},{"../../actions/AppActions.js":8,"../../stores/AppStore.js":37,"./class-selector.jsx":27,"./gender-selector.jsx":29,"./hardcore-checkbox.jsx":30,"./seasonal-checkbox.jsx":32}],32:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var SeasonalCheckbox = React.createClass({displayName: "SeasonalCheckbox",

	propTypes:{
		changeSeasonal:React.PropTypes.func,
		seasonal:React.PropTypes.bool
	},

	_updateSeasonal:function() {
		this.props.changeSeasonal(!this.props.seasonal);
	},

	render:function() {
		return (
			React.createElement("div", {className: "checkbox-wrapper"}, 
				React.createElement("label", null, 
					React.createElement("input", {type: "checkbox", className: "options-checkbox", checked: this.props.seasonal, onChange: this._updateSeasonal}), 
					React.createElement("span", {className: "checkbox-label"}, "Seasonal ", React.createElement("span", {className: "hidden-sm"}, "Hero"))
				)
			)
		);
	}
});

module.exports = SeasonalCheckbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],33:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);

var AppActions = require('../../actions/AppActions');
var AppStore = require('../../stores/AppStore');

var KadalaItem = React.createClass({displayName: "KadalaItem",

	propTypes:{
		item:React.PropTypes.object,
		shardCount:React.PropTypes.number
	},

	_buyItem:function() {
		var item = d3sim.kadalaRoll(this.props.item.type);
		item.size = this.props.item.size;

		AppActions.addItem(item);
		AppActions.changeSetting('item',this.props.item);
		AppActions.incrementShards(this.props.item.type,this.props.item.cost);
	},
	_resetCount:function() {
		AppActions.clearShards(this.props.item.type);
	},

	render:function() {

		var iconClass = 'kadala-icon';
		iconClass+=' '+this.props.item.type;

		return (
			React.createElement("div", {className: "kadala-item"}, 
				React.createElement("button", {className: "kadala", onClick: this._buyItem}, 
					React.createElement("div", {className: iconClass}), 
					React.createElement("span", null, this.props.item.cost)
				), 
				React.createElement("div", {className: "kadala-content"}, 
					React.createElement("span", {className: "kadala-item-title", onClick: this._buyItem}, this.props.item.text), 
					React.createElement("span", {className: "shard-count"}, 
						this.props.shardCount, 
						React.createElement("a", {className: "shard-delete", onClick: this._resetCount}, 
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

},{"../../actions/AppActions":8,"../../stores/AppStore":37}],34:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var assign = require('object-assign');

var AppStore = require('../../stores/AppStore');
var KadalaItem = require('./kadala-item.jsx');

var KadalaStore = React.createClass({displayName: "KadalaStore",
	getInitialState:function() {
		return assign({},AppStore.getSettings(),{shards:AppStore.getShards()});
	},

	componentDidMount: function() {
		AppStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(this._onChange);
	},
	_onChange:function() {
		this.setState(AppStore.getSettings());
		this.setState({shards:AppStore.getShards()});
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
		var itemsLength = items.length;

		var kadalaSlots = [];
		for (var i =0; i < itemsLength; i++) {
			kadalaSlots.push(React.createElement(KadalaItem, {key: i, item: items[i], shardCount: this.state.shards[items[i].type] || 0}));
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

},{"../../stores/AppStore":37,"./kadala-item.jsx":33,"object-assign":7}],35:[function(require,module,exports){
var keyMirror = require('keymirror');

module.exports = keyMirror({
	ADD_ITEM:null,

	PREV_INV:null,
	NEXT_INV:null,

	PREV_ITEM:null,
	NEXT_ITEM:null,

	CHANGE_SETTING:null,
	INCREMENT_SHARDS:null,
	CLEAR_SHARDS:null,

	TOGGLE_OPTIONS:null,
	TOGGLE_STORE:null
});

},{"keymirror":6}],36:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":3}],37:[function(require,module,exports){
(function (global){
var d3sim = (typeof window !== "undefined" ? window.d3sim : typeof global !== "undefined" ? global.d3sim : null);
var assign = require('object-assign');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');

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
var lifetime = {Barbarian:{},Crusader:{},'Demon Hunter':{},Monk:{},'Witch Doctor':{},Wizard:{}};
var legCount = {Barbarian:{},Crusader:{},'Demon Hunter':{},Monk:{},'Witch Doctor':{},Wizard:{}};
var rarityCount = {Barbarian:{},Crusader:{},'Demon Hunter':{},Monk:{},'Witch Doctor':{},Wizard:{}};

var storageSupported;

//Determine whether or not local storage is supported
//from github.com/agrublev/angularLocalStorage
//MIT Licence
function localStorageCheck() {
	var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;
	var supported = (typeof storage !== 'undefined');
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
	appSettings.options = false;
}
function toggleOptions() {
	appSettings.options = !appSettings.options;
	appSettings.store = false;
}
function hideBoth() {
	appSettings.store = false;
	appSettings.options = false;
}

function getSettings() {
	return appSettings;
}

function getShards(key) {
	if(key) {
		return shardsSpent[key] || 0;
	}
	else {
		return shardsSpent;
	}
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
		localStorage.kadalaLegCount = JSON.stringify(legCount);
		localStorage.kadalaRarity = JSON.stringify(rarityCount);
	}
}

function incrementShards(key,val) {
	if (typeof shardsSpent[key] !== 'undefined') {
		shardsSpent[key]+=val;
	}
	else {
		shardsSpent[key] = val;
	}
	if (typeof lifetime[appSettings.dClass][key] !== 'undefined') {
		lifetime[appSettings.dClass][key]+=val;
	}
	else {
		lifetime[appSettings.dClass][key]=val;
	}
	saveSettings();
}

function clearShards(key) {
	shardsSpent[key] = 0;
	saveSettings();
}

//saves the item name/rarity into localstorage for future visuals
function saveItemData(item) {
	var name = item.name;
	var slot = item.slot;
	var rarity;
	var cost = appSettings.item.cost;

	if (typeof item.set !== 'undefined' && item.rarity === 'ancient') {
		rarity = 'ancientset';
	}
	else if(typeof item.set !=='undefined') {
		rarity = 'set';
	}
	else {
		rarity = item.rarity;
	}

	//storing rarity - if the slot has been purchased before
	if (rarityCount[appSettings.dClass].hasOwnProperty(slot)) {
		//that slot has received this rarity before
		if (rarityCount[appSettings.dClass][slot].hasOwnProperty(rarity)) {
			rarityCount[appSettings.dClass][slot][rarity] += 1;
		}
		else {
			rarityCount[appSettings.dClass][slot][rarity] = 1;
		}
	}
	//slot has never been purchased and needs to be created as a blank object first
	else {
		rarityCount[appSettings.dClass][slot] = {};
		rarityCount[appSettings.dClass][slot][rarity] = 1;
	}

	//this nesting is absolutely disgusting
	//storing legendary count. check that the item is a legendary
	if (['legendary','ancient','ancientset','set'].indexOf(rarity) > -1){
		//check if the slot has been purchased before
		if (legCount[appSettings.dClass].hasOwnProperty(slot)) {
			//that the slot has received this item before
			if (legCount[appSettings.dClass][slot].hasOwnProperty(name)) {
				//that the item name has been found in this rarity
				if (legCount[appSettings.dClass][slot][name].hasOwnProperty(rarity)) {
					legCount[appSettings.dClass][slot][name][rarity] += 1;
				}
				else {
					legCount[appSettings.dClass][slot][name][rarity] = 1;
				}
			}
			//item has never been found
			else {
				legCount[appSettings.dClass][slot][name] = {};
				legCount[appSettings.dClass][slot][name][rarity] = 1;
			}
		}
		//slot has never been purchased
		else {
			legCount[appSettings.dClass][slot] = {};
			legCount[appSettings.dClass][slot][name] = {};
			legCount[appSettings.dClass][slot][name][rarity] = 1;
		}
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

		//old version of app didnt save lifetime shards by class. track now
		var lifetimeLs = JSON.parse(localStorage.getItem('kadalaLifetime')) || {};
		if (lifetimeLs.hasOwnProperty('Barbarian')) {
			lifetime = JSON.parse(localStorage.getItem('kadalaLifetime')) || lifetime;
		}

		//pull the lifetime legendary count
		var lifetimeLc = JSON.parse(localStorage.getItem('kadalaLegCount')) || {};
		if (lifetimeLc.hasOwnProperty('Barbarian')) {
			legCount = JSON.parse(localStorage.getItem('kadalaLegCount')) || legCount;
		}
		//pull the lifetime legendary count
		var lifetimeRc = JSON.parse(localStorage.getItem('kadalaRarity')) || {};
		if (lifetimeRc.hasOwnProperty('Barbarian')) {
			rarityCount = JSON.parse(localStorage.getItem('kadalaRarity')) || lifetimeRc;
		}

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
		case AppConstants.ADD_ITEM:
			hideBoth();
			saveItemData(action.item);
			AppStore.emitChange();
			break;
		case AppConstants.CLEAR_SHARDS:
			clearShards(action.key);
			AppStore.emitChange();
			break;
		default:
			//noop
	}
});

module.exports = AppStore;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../constants/AppConstants":35,"../dispatcher/AppDispatcher":36,"events":2,"object-assign":7}],38:[function(require,module,exports){
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

},{"../constants/AppConstants":35,"../dispatcher/AppDispatcher":36,"events":2,"object-assign":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxhY3Rpb25zXFxBcHBBY3Rpb25zLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxjb21tb25cXGZvb3Rlci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGNvbW1vblxcbmF2YmFyLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1hcm1vci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAtYm9keS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAtZmxhdm9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1oZWFkLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1zdGF0LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC13ZWFwb24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW5kaXZpZHVhbC1pdGVtXFxpbmRpdmlkdWFsLWl0ZW0uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbmRpdmlkdWFsLWl0ZW1cXGl0ZW0tbGVmdC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGluZGl2aWR1YWwtaXRlbVxcaXRlbS1yaWdodC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LWNvbnRhaW5lci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LXNsb3QuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXGludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcbmV4dC1pbnZlbnRvcnkuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXHByZXZpb3VzLWludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxjbGFzcy1zZWxlY3Rvci1idXR0b24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcY2xhc3Mtc2VsZWN0b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcZ2VuZGVyLXNlbGVjdG9yLWJ1dHRvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxnZW5kZXItc2VsZWN0b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcaGFyZGNvcmUtY2hlY2tib3guanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcb3B0aW9ucy1wYW5lbC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxzZWFzb25hbC1jaGVja2JveC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1zdG9yZVxca2FkYWxhLWl0ZW0uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtc3RvcmVcXGthZGFsYS1zdG9yZS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbnN0YW50c1xcQXBwQ29uc3RhbnRzLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxkaXNwYXRjaGVyXFxBcHBEaXNwYXRjaGVyLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxzdG9yZXNcXEFwcFN0b3JlLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxzdG9yZXNcXEludmVudG9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDdkQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUM7QUFDNUUsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFDeEUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDaEUsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7QUFDakYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7O0FBRXZELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUUvQyxJQUFJLGlDQUFpQywyQkFBQTtDQUNwQyxlQUFlLENBQUMsV0FBVztFQUMxQixPQUFPLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUM5QjtDQUNELGlCQUFpQixFQUFFLFdBQVc7QUFDL0IsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDOztFQUVFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEQsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDN0I7O0VBRUUsTUFBTSxD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkEsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRXhELElBQUksVUFBVSxHQUFHOztDQUVoQixPQUFPLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDdkIsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVE7R0FDaEMsSUFBSSxDQUFDLElBQUk7R0FDVCxDQUFDLENBQUM7QUFDTCxFQUFFOztDQUVELGlCQUFpQixFQUFFLFdBQVc7RUFDN0IsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVE7R0FDaEMsQ0FBQyxDQUFDO0FBQ0wsRUFBRTs7Q0FFRCxhQUFhLEVBQUUsV0FBVztFQUN6QixhQUFhLENBQUMsUUFBUSxDQUFDO0dBQ3RCLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUTtHQUNoQyxDQUFDLENBQUM7QUFDTCxFQUFFOztDQUVELFlBQVksQ0FBQyxXQUFXO0VBQ3ZCLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTO0dBQ2pDLENBQUMsQ0FBQztBQUNMLEVBQUU7O0NBRUQsUUFBUSxDQUFDLFdBQVc7RUFDbkIsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixVQUFVLENBQUMsWUFBWSxDQUFDLFNBQVM7R0FDakMsQ0FBQyxDQUFDO0FBQ0wsRUFBRTs7Q0FFRCxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxFQUFFO0VBQy9CLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxjQUFjO0dBQ3RDLEdBQUcsQ0FBQyxHQUFHO0dBQ1AsR0FBRyxDQUFDLEdBQUc7R0FDUCxDQUFDLENBQUM7QUFDTCxFQUFFOztDQUVELFdBQVcsQ0FBQyxXQUFXO0VBQ3RCLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZO0dBQ3BDLENBQUMsQ0FBQztBQUNMLEVBQUU7O0NBRUQsYUFBYSxDQUFDLFdBQVc7RUFDeEIsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixVQUFVLENBQUMsWUFBWSxDQUFDLGNBQWM7R0FDdEMsQ0FBQyxDQUFDO0FBQ0wsRUFBRTs7Q0FFRCxlQUFlLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxFQUFFO0VBQ2pDLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0I7R0FDeEMsR0FBRyxDQUFDLEdBQUc7R0FDUCxHQUFHLENBQUMsR0FBRztHQUNQLENBQUMsQ0FBQztFQUNIO0NBQ0QsV0FBVyxDQUFDLFNBQVMsR0FBRyxFQUFFO0VBQ3pCLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZO0dBQ3BDLEdBQUcsQ0FBQyxHQUFHO0dBQ1AsQ0FBQyxDQUFDO0FBQ0wsRUFBRTs7QUFFRixDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVOzs7O0FDeEUzQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksNEJBQTRCLHNCQUFBO0NBQy9CLE1BQU0sQ0FBQyxXQUFXO0VBQ2pCO0dBQ0Msb0JBQUEsUUFBTyxFQUFBLElBQUMsRUFBQTtJQUNQLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsYUFBYyxDQUFBLEVBQUE7S0FDN0Isb0JBQUEsR0FBRSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQyx3QkFBeUIsQ0FBQSxFQUFBLFlBQWMsQ0FBQSxFQUFBLElBQUEsRUFBQSxDQUFBO0FBQUEsS0FDL0Msb0JBQUEsR0FBRSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQywwQkFBMkIsQ0FBQSxFQUFBLDhCQUFnQyxDQUFBO0lBQzdELENBQUEsRUFBQTtJQUNQLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsY0FBZSxDQUFBLEVBQUE7SUFDOUIsc0RBQXVEO0lBQ3hELG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsdUJBQXdCLENBQUEsRUFBQTtLQUMvQixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLE9BQUEsRUFBTyxDQUFDLEtBQUEsRUFBSyxDQUFDLEVBQUEsRUFBRSxDQUFDLFNBQUEsRUFBUyxDQUFDLENBQUEsRUFBQyxDQUFDLEtBQUEsRUFBSyxDQUFDLENBQUEsRUFBQyxDQUFDLEtBQUEsRUFBSztPQUM3QyxLQUFBLEVBQUssQ0FBQyxNQUFBLEVBQU0sQ0FBQyxNQUFBLEVBQU0sQ0FBQyxNQUFBLEVBQU0sQ0FBQyxPQUFBLEVBQU8sQ0FBQyxhQUFBLEVBQWEsQ0FBQyxtQkFBQSxFQUFpQixDQUFDLGlCQUFrQixDQUFBLEVBQUE7S0FDdkYsb0JBQUEsR0FBRSxFQUFBLElBQUMsRUFBQTtNQUNGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsV0FBQSxFQUFTLENBQUMsU0FBQSxFQUFTLENBQUMsV0FBQSxFQUFTLENBQUMsU0FBQSxFQUFTLENBQUMsQ0FBQSxFQUFDLENBQUMsMERBQUE7QUFBQSxPQUFBLGtIQUFBO0FBQUEsT0FBQSw0SEFBQTtBQUFBLE9BQUEsb0hBQUE7QUFBQSxPQUFBLHVIQUFBO0FBQUEsT0FBQSw4R0FBQTtBQUFBLE9BQUEsd0hBQUE7QUFBQSxPQUFBLGtIQUFBO0FBQUEsT0FBQSwwR0FRMEQsQ0FBRSxDQUFBO0tBQ3pHLENBQUE7S0FDRSxDQUFBO0lBQ0gsQ0FBQSxFQUFBO0lBQ0gsdURBQXdEO0lBQ3pELG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsd0JBQXlCLENBQUEsRUFBQTtLQUNoQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLE9BQUEsRUFBTyxDQUFDLEtBQUEsRUFBSyxDQUFDLEVBQUEsRUFBRSxDQUFDLFNBQUEsRUFBUyxDQUFDLENBQUEsRUFBQyxDQUFDLEtBQUEsRUFBSyxDQUFDLENBQUEsRUFBQyxDQUFDLEtBQUEsRUFBSztPQUM3QyxLQUFBLEVBQUssQ0FBQyxNQUFBLEVBQU0sQ0FBQyxNQUFBLEVBQU0sQ0FBQyxNQUFBLEVBQU0sQ0FBQyxPQUFBLEVBQU8sQ0FBQyxhQUFBLEVBQWEsQ0FBQyxtQkFBQSxFQUFpQixDQUFDLGlCQUFrQixDQUFBLEVBQUE7S0FDdkYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxDQUFBLEVBQUMsQ0FBQyw4RkFBQTtBQUFBLE1BQUEseUhBQUE7QUFBQSxNQUFBLG1IQUFBO0FBQUEsTUFBQSxzSEFBQTtBQUFBLE1BQUEsaUhBQUE7QUFBQSxNQUFBLHVIQUFBO0FBQUEsTUFBQSxxSEFBQTtBQUFBLE1BQUEsMENBT2tDLENBQUUsQ0FBQTtLQUN0QyxDQUFBO0lBQ0gsQ0FBQSxFQUFBO0lBQ0gscURBQXNEO0lBQ3ZELG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsZ0NBQWlDLENBQUEsRUFBQTtLQUN4QyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLE9BQUEsRUFBTyxDQUFDLEtBQUEsRUFBSyxDQUFDLEVBQUEsRUFBRSxDQUFDLFNBQUEsRUFBUyxDQUFDLENBQUEsRUFBQyxDQUFDLEtBQUEsRUFBSyxDQUFDLENBQUEsRUFBQyxDQUFDLEtBQUEsRUFBSztPQUM3QyxLQUFBLEVBQUssQ0FBQyxNQUFBLEVBQU0sQ0FBQyxNQUFBLEVBQU0sQ0FBQyxNQUFBLEVBQU0sQ0FBQyxPQUFBLEVBQU8sQ0FBQyxhQUFBLEVBQWEsQ0FBQyxtQkFBQSxFQUFpQixDQUFDLGlCQUFrQixDQUFBLEVBQUE7S0FDdkYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxFQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQU8sQ0FBQyxDQUFBLEVBQUMsQ0FBQyx1RkFBQTtBQUFBLE1BQUEscUlBQUE7QUFBQSxNQUFBLDJHQUFBO0FBQUEsTUFBQSw0R0FBQTtBQUFBLE1BQUEsd0lBQUE7QUFBQSxNQUFBLHlIQUFBO0FBQUEsTUFBQSxxSUFBQTtBQUFBLE1BQUEsdUlBQUE7QUFBQSxNQUFBLHlJQUFBO0FBQUEsT0FBQSx5SEFBQTtBQUFBLE1BQUEsaUlBQUE7QUFBQSxNQUFBLDZDQVcwQixDQUFFLENBQUE7S0FDekMsQ0FBQTtJQUNILENBQUE7SUFDRyxDQUFBO0dBQ0MsQ0FBQTtJQUNSO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU07Ozs7OztBQ2xFdkIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDeEQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRW5ELElBQUksNEJBQTRCLHNCQUFBOztDQUUvQixTQUFTLENBQUM7RUFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQzdCLEVBQUU7O0NBRUQsZUFBZSxDQUFDLFdBQVc7RUFDMUIsT0FBTyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDaEMsRUFBRTs7Q0FFRCxpQkFBaUIsRUFBRSxXQUFXO0VBQzdCLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDM0M7Q0FDRCxvQkFBb0IsRUFBRSxXQUFXO0VBQ2hDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDOUM7Q0FDRCxTQUFTLENBQUMsV0FBVztFQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLEVBQUU7O0NBRUQsUUFBUSxDQUFDLFdBQVc7RUFDbkIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztFQUNqQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3pCLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3RFO0NBQ0QsY0FBYyxDQUFDLFdBQVc7RUFDekIsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO0VBQzNCO0NBQ0QsWUFBWSxDQUFDLFdBQVc7RUFDdkIsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzNCLEVBQUU7O0NBRUQsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsSUFBQyxFQUFBO0lBQ0osb0JBQUEsUUFBTyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxLQUFBLEVBQUssQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsY0FBZ0IsQ0FBQSxFQUFBO0tBQ3BELG9EQUFxRDtLQUN0RCxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsS0FBQSxFQUFLLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBQSxFQUFNLENBQUMsSUFBQSxFQUFJLENBQUMsT0FBQSxFQUFPLENBQUMsV0FBWSxDQUFBLEVBQUE7TUFDbEYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxDQUFBLEVBQUMsQ0FBQywrQ0FBK0MsQ0FBRSxDQUFBO0tBQ3BELENBQUE7SUFDRSxDQUFBLEVBQUE7SUFDVCxvQkFBQSxJQUFHLEVBQUEsSUFBQyxFQUFBLG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsVUFBVyxDQUFBLEVBQUEsa0JBQW9CLENBQUssQ0FBQSxFQUFBO0lBQ2hELG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsS0FBQSxFQUFLLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFFBQVUsQ0FBQSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQWMsQ0FBQSxFQUFBO0lBQy9FLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsTUFBQSxFQUFNLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFlBQWMsQ0FBQSxFQUFBO0tBQ25ELG9EQUFxRDtLQUN0RCxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsS0FBQSxFQUFLLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBQSxFQUFNLENBQUMsSUFBQSxFQUFJLENBQUMsT0FBQSxFQUFPLENBQUMsV0FBWSxDQUFBLEVBQUE7TUFDbEYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxrSUFBa0ksQ0FBRSxDQUFBO0tBQ3ZJLENBQUE7SUFDRSxDQUFBO0dBQ0osQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU07Ozs7OztBQzdEdkIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLHdDQUF3QyxrQ0FBQTs7Q0FFM0MsU0FBUyxDQUFDO0VBQ1QsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUM5QixFQUFFOztDQUVELE1BQU0sRUFBRSxXQUFXO0VBQ2xCO0dBQ0Msb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxvQ0FBcUMsQ0FBQSxFQUFBO0lBQ2xELG9CQUFBLElBQUcsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsS0FBTSxDQUFBLEVBQUEsb0JBQUEsR0FBRSxFQUFBLElBQUMsRUFBQSxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLE9BQVEsQ0FBQSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBYSxDQUFJLENBQUssQ0FBQSxFQUFBO0lBQ2pGLG9CQUFBLElBQUcsRUFBQSxJQUFDLEVBQUEsT0FBVSxDQUFBO0dBQ1YsQ0FBQTtJQUNKO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGtCQUFrQjs7Ozs7O0FDbEJuQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksa0JBQWtCLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDM0QsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN6RCxJQUFJLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztBQUU3RCxJQUFJLHVDQUF1QyxpQ0FBQTs7Q0FFMUMsU0FBUyxDQUFDO0VBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUM3QixFQUFFOztBQUVGLENBQUMsTUFBTSxFQUFFLFdBQVc7O0VBRWxCLElBQUksV0FBVyxHQUFHLHlDQUF5QyxDQUFDO0FBQzlELEVBQUUsSUFBSSxhQUFhLEVBQUUsV0FBVyxDQUFDO0FBQ2pDO0FBQ0E7QUFDQTs7RUFFRSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckQsRUFBRSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0VBRXZELFNBQVMsT0FBTyxDQUFDLFVBQVUsRUFBRTtHQUM1QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDakIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUNuQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0dBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUU7SUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFDLGlCQUFpQixFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBRSxHQUFHLEVBQUMsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxDQUFFLENBQUEsQ0FBRyxDQUFBLENBQUMsQ0FBQztJQUN2RDtHQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2xCLEdBQUc7QUFDSDs7QUFFQSxFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakU7O0VBRUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7R0FDMUIsV0FBVyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztHQUN0RCxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3pDLEdBQUc7QUFDSDs7RUFFRSxJQUFJLE9BQU8sQ0FBQztFQUNaLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0dBQzVDLE9BQU8sR0FBRyxvQkFBQyxrQkFBa0IsRUFBQSxDQUFBLENBQUMsS0FBQSxFQUFLLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBTSxDQUFFLENBQUEsQ0FBQztHQUM5RDtFQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFO0dBQ2hELE9BQU8sR0FBRyxvQkFBQyxtQkFBbUIsRUFBQSxDQUFBO0lBQzdCLFdBQUEsRUFBVyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBQztJQUN6QyxLQUFBLEVBQUssQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUM7SUFDN0IsU0FBQSxFQUFTLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBVSxDQUFBO0lBQ25DLENBQUEsQ0FBQztBQUNQLEdBQUc7QUFDSDs7RUFFRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7RUFDakIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0VBQ2xCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtHQUN2RCxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDL0QsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsR0FBQSxFQUFHLENBQUUsU0FBVSxDQUFFLENBQUEsRUFBQSxjQUFpQixDQUFBLENBQUMsQ0FBQztJQUM1RixTQUFTLEVBQUUsQ0FBQztJQUNaO0FBQ0osR0FBRztBQUNIOztBQUVBLEVBQUUsSUFBSSxjQUFjLENBQUM7O0VBRW5CLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7R0FDbEYsY0FBYyxHQUFHLGFBQWEsQ0FBQztBQUNsQyxHQUFHOztPQUVJO0FBQ1AsR0FBRyxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7R0FFMUYsY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRixHQUFHOztFQUVEO0FBQ0YsR0FBRyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGdFQUFpRSxDQUFBLEVBQUE7O0lBRTlFLDREQUE2RDtJQUM5RCxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFdBQWEsQ0FBQSxFQUFBO0tBQzdCLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsb0JBQXFCLENBQUEsRUFBQTtNQUNwQyxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1DQUFBLEVBQW1DLENBQUMsS0FBQSxFQUFLLENBQUUsS0FBTyxDQUFBO01BQzNELENBQUE7S0FDRCxDQUFBO0FBQ1osSUFBVyxDQUFBLEVBQUE7O0FBRVgsSUFBSSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG9CQUFxQixDQUFBLEVBQUE7O0tBRWxDLDhCQUErQjtLQUNoQyxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGlCQUFrQixDQUFBLEVBQUE7T0FDOUIsb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFPLENBQUEsRUFBQTtPQUM3RyxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG9DQUFxQyxDQUFBLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBbUIsQ0FBQTtBQUM5RixLQUFVLENBQUEsRUFBQTs7S0FFSiwyQ0FBNEM7S0FDN0Msb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQTtNQUN6QixvQkFBQSxJQUFHLEVBQUEsSUFBQyxFQUFBO09BQ0gsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxhQUFlLENBQUEsRUFBQyxjQUFjLEVBQUMsR0FBQSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQVksQ0FBQTtNQUMxRSxDQUFBO0FBQ1gsS0FBVSxDQUFBLEVBQUE7O0tBRUosa0dBQW1HO0FBQ3pHLEtBQU0sT0FBTyxFQUFDOztBQUVkLEtBQUssb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxxQkFBc0IsQ0FBTSxDQUFBLEVBQUE7O0tBRTFDLHFCQUFzQjtLQUN2QixvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQWUsQ0FBQSxFQUFBO01BQzVCLG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsd0JBQXlCLENBQUEsRUFBQSxTQUFXLENBQUEsRUFBQTtNQUNoRCxTQUFTLEVBQUM7TUFDWCxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLHdCQUF5QixDQUFBLEVBQUEsV0FBYSxDQUFBLEVBQUE7TUFDbEQsV0FBVyxFQUFDO01BQ1osT0FBUTtLQUNMLENBQUE7SUFDQSxDQUFBO0dBQ0QsQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQjs7Ozs7O0FDN0hsQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUkseUNBQXlDLG1DQUFBOztDQUU1QyxTQUFTLENBQUM7RUFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQy9CLEVBQUU7O0NBRUQsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7SUFDbEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxRQUFTLENBQUEsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWEsQ0FBQTtHQUM1QyxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsbUJBQW1COzs7Ozs7QUNqQnBDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSx1Q0FBdUMsaUNBQUE7O0NBRTFDLFNBQVMsQ0FBQztFQUNULEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07RUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUM3QixFQUFFOztBQUVGLENBQUMsTUFBTSxFQUFFLFdBQVc7QUFDcEI7O0VBRUUsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDO0FBQzlCLEVBQUUsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDO0FBQ2pCO0FBQ0E7O0VBRUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtHQUNyQixRQUFRLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7R0FDaEQsT0FBTyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUM3QyxHQUFHOztFQUVELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtHQUNoQyxPQUFPLEdBQUcsV0FBVyxDQUFDO0dBQ3RCO09BQ0ksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFO0dBQ25DLE9BQU8sR0FBRyxVQUFVLENBQUM7QUFDeEIsR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsUUFBVSxDQUFBLEVBQUE7SUFDekIsb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxPQUFTLENBQUEsRUFBQTtLQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUs7SUFDYixDQUFBO0dBQ0EsQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQjs7Ozs7O0FDdkNsQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksc0NBQXNDLGlDQUFBOztDQUV6QyxTQUFTLENBQUM7RUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQzdCLEVBQUU7O0FBRUYsQ0FBQyxNQUFNLEVBQUUsV0FBVzs7RUFFbEIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLEVBQUUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDOztFQUVoQixJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtHQUNoRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDckM7O0lBRUksSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxPQUFPLFFBQVEsS0FBSyxDQUFDLENBQUMsRUFBRTtLQUN2QixLQUFLLEVBQUU7S0FDUCxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELEtBQUs7O0lBRUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLElBQUksSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDOztJQUVmLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7S0FDOUIsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xELFFBQVEsR0FBRyxVQUFVLENBQUM7S0FDdEIsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDNUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDekIsS0FBSyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0RDs7S0FFSyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7TUFDL0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO09BQ3pDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN2RDtXQUNJO09BQ0osTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ25EO0FBQ1AsTUFBTTtBQUNOOztLQUVLLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLE1BQU07QUFDTjs7S0FFSyxJQUFJLE9BQU8sR0FBRyxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLE9BQUEsRUFBTyxDQUFDLEdBQUEsRUFBRyxDQUFFLE9BQVMsQ0FBQSxFQUFDLE1BQWMsQ0FBQSxDQUFDO0tBQ3BFLE9BQU8sRUFBRSxDQUFDO0FBQ2YsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hCOztLQUVLLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRTtNQUNqQyxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztNQUNoRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNsQjtVQUNJLEdBQUcsS0FBSyxLQUFLLENBQUMsRUFBRTtNQUNwQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ3pELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsTUFBTTs7VUFFSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7TUFDbkMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUN6RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ2xCO0tBQ0Q7QUFDTCxJQUFJOztRQUVJO0lBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQztBQUNKLEdBQUc7QUFDSDs7RUFFRSxJQUFJLFNBQVMsR0FBRywwQkFBMEIsQ0FBQztFQUMzQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0dBQ25GLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQztHQUNoQztPQUNJO0dBQ0osU0FBUyxJQUFJLGdCQUFnQixDQUFDO0FBQ2pDLEdBQUc7O0VBRUQ7R0FDQyxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFNBQVcsQ0FBQSxFQUFBO0lBQ3pCLG9CQUFBLEdBQUUsRUFBQSxJQUFDLEVBQUMsSUFBUyxDQUFBO0dBQ1QsQ0FBQTtJQUNKO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQjs7Ozs7O0FDL0ZsQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksd0NBQXdDLG1DQUFBOztDQUUzQyxTQUFTLENBQUM7RUFDVCxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLO0VBQ2pDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07RUFDNUIsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNsQyxFQUFFOztDQUVELE1BQU0sRUFBRSxXQUFXO0VBQ2xCO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLElBQUMsRUFBQTtHQUNMLG9CQUFBLElBQUcsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsbUNBQW9DLENBQUEsRUFBQTtJQUNqRCxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLEtBQU0sQ0FBQSxFQUFBLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsT0FBUSxDQUFBLEVBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFVLENBQUssQ0FBQSxFQUFBO0lBQ3RHLG9CQUFBLElBQUcsRUFBQSxJQUFDLEVBQUEsbUJBQXNCLENBQUE7R0FDdEIsQ0FBQSxFQUFBO0dBQ0wsb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxzQ0FBdUMsQ0FBQSxFQUFBO0lBQ3BELG9CQUFBLElBQUcsRUFBQSxJQUFDLEVBQUE7S0FDSCxvQkFBQSxHQUFFLEVBQUEsSUFBQyxFQUFBO01BQ0Ysb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxPQUFRLENBQUEsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQVMsQ0FBQSxFQUFBLElBQUEsRUFBQTtBQUFBLE1BQzFELG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsT0FBUSxDQUFBLEVBQUEsR0FBQSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBUyxDQUFBLEVBQUE7TUFDM0Qsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxtQkFBb0IsQ0FBQSxFQUFBLFNBQWMsQ0FBQTtLQUMvQyxDQUFBO0lBQ0EsQ0FBQSxFQUFBO0lBQ0wsb0JBQUEsSUFBRyxFQUFBLElBQUMsRUFBQTtLQUNILG9CQUFBLEdBQUUsRUFBQSxJQUFDLEVBQUE7TUFDRixvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLE9BQVEsQ0FBQSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQVMsQ0FBQSxFQUFBO01BQzVELG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsbUJBQW9CLENBQUEsRUFBQSxxQkFBMEIsQ0FBQTtLQUMzRCxDQUFBO0lBQ0EsQ0FBQTtHQUNELENBQUE7R0FDQyxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsbUJBQW1COzs7Ozs7QUNyQ3BDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN6RCxJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3pELElBQUksbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7O0FBRTdELElBQUksbUNBQW1DLDZCQUFBOztDQUV0QyxTQUFTLENBQUM7RUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQzdCLEVBQUU7O0FBRUYsQ0FBQyxNQUFNLEVBQUUsV0FBVzs7RUFFbEIsSUFBSSxZQUFZLEVBQUUsNEJBQTRCLENBQUM7RUFDL0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0dBQ3pDLFlBQVksRUFBRSxVQUFVO0FBQzNCLEdBQUc7QUFDSDs7RUFFRSxJQUFJLE1BQU0sQ0FBQztFQUNYLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0dBQzdDLE1BQU0sR0FBRyxvQkFBQyxtQkFBbUIsRUFBQSxDQUFBLENBQUMsTUFBQSxFQUFNLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFBLENBQUcsQ0FBQTtBQUNuRSxHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBO0lBQ2hDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsWUFBYyxDQUFBLEVBQUE7S0FDN0Isb0JBQUMsaUJBQWlCLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDLElBQUEsRUFBSSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUssQ0FBQSxDQUFHLENBQUEsRUFBQTtLQUMvRSxvQkFBQyxpQkFBaUIsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUEsQ0FBRyxDQUFBLEVBQUE7S0FDM0MsTUFBTztJQUNILENBQUE7R0FDRCxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYTs7Ozs7O0FDckM5QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQzVELElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzVELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU1QyxJQUFJLG9DQUFvQyw4QkFBQTs7Q0FFdkMsZUFBZSxDQUFDLFdBQVc7RUFDMUIsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbEMsRUFBRTs7Q0FFRCxpQkFBaUIsRUFBRSxXQUFXO0VBQzdCLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDakQ7Q0FDRCxvQkFBb0IsRUFBRSxXQUFXO0VBQ2hDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDcEQ7Q0FDRCxTQUFTLENBQUMsV0FBVztFQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLEVBQUU7O0FBRUYsQ0FBQyxNQUFNLENBQUMsV0FBVztBQUNuQjs7RUFFRSxJQUFJLE9BQU8sQ0FBQztFQUNaLElBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQztFQUM3QixJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0dBQzNDLE9BQU8sR0FBRyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUEsb0JBQUMsYUFBYSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBRSxDQUFNLENBQUEsQ0FBQztHQUMzRixhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLEdBQUc7O0VBRUQ7R0FDQyxvQkFBQSxLQUFJLEVBQUEsSUFBQyxFQUFBO0lBQ0osb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxLQUFNLENBQUEsRUFBQTtLQUNwQixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLDRCQUE2QixDQUFBLEVBQUE7TUFDM0Msb0JBQUMsUUFBUSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxhQUFhLEVBQUMsQ0FBQyxXQUFBLEVBQVcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVksQ0FBQSxDQUFHLENBQUEsRUFBQTtNQUMxRSxPQUFPLEVBQUM7TUFDVCxvQkFBQyxTQUFTLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLGFBQWEsRUFBQyxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBUSxDQUFBLENBQUcsQ0FBQTtLQUMvRCxDQUFBO0lBQ0QsQ0FBQTtHQUNELENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjOzs7Ozs7QUMvQy9CLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXJELElBQUksOEJBQThCLHdCQUFBOztDQUVqQyxTQUFTLENBQUM7RUFDVCxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0VBQ2hDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDbEMsRUFBRTs7Q0FFRCxZQUFZLENBQUMsV0FBVztFQUN2QixVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDNUIsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLFdBQVcsR0FBRyw2QkFBNkIsQ0FBQztFQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7R0FDNUIsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM3QixHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVcsQ0FBQSxFQUFBO0lBQ3JDLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsV0FBVyxFQUFDLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFlBQWMsQ0FBQSxFQUFBO0tBQzFELG9EQUFxRDtLQUN0RCxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsS0FBQSxFQUFLLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBQSxFQUFNLENBQUMsSUFBQSxFQUFJLENBQUMsT0FBQSxFQUFPLENBQUMsV0FBWSxDQUFBLEVBQUE7TUFDbEYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxnREFBZ0QsQ0FBRSxDQUFBO0tBQ3JELENBQUE7SUFDRSxDQUFBO0dBQ0osQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVE7Ozs7OztBQ25DekIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFckQsSUFBSSwrQkFBK0IseUJBQUE7O0NBRWxDLFNBQVMsQ0FBQztFQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7RUFDNUIsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNsQyxFQUFFOztDQUVELFlBQVksQ0FBQyxXQUFXO0VBQ3ZCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN4QixFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0VBRWpCLElBQUksV0FBVyxHQUFHLDhCQUE4QixDQUFDO0VBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtHQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQzdCLEdBQUc7O0VBRUQ7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBVyxDQUFBLEVBQUE7SUFDckMsb0JBQUEsUUFBTyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxXQUFXLEVBQUMsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsWUFBYyxDQUFBLEVBQUE7S0FDMUQsb0RBQXFEO0tBQ3RELG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsS0FBQSxFQUFLLENBQUMsNEJBQUEsRUFBNEIsQ0FBQyxLQUFBLEVBQUssQ0FBQyxJQUFBLEVBQUksQ0FBQyxNQUFBLEVBQU0sQ0FBQyxJQUFBLEVBQUksQ0FBQyxPQUFBLEVBQU8sQ0FBQyxXQUFZLENBQUEsRUFBQTtNQUNsRixvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLENBQUEsRUFBQyxDQUFDLGlEQUFpRCxDQUFFLENBQUE7S0FDdEQsQ0FBQTtJQUNFLENBQUE7R0FDSixDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUzs7Ozs7O0FDbkMxQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3BELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3BELElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRTVELElBQUksd0NBQXdDLGtDQUFBOztDQUUzQyxTQUFTLENBQUM7RUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0VBQzVCLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7RUFDaEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSztBQUNqQyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0VBRWpCLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUMxQixFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNaOztFQUVFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0IsR0FBRyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDckQ7O0FBRUEsR0FBRyxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDdkI7O0dBRUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUNuQyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxFQUFFO0tBQ3RELFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDL0MsY0FBYyxDQUFDLElBQUksQ0FBQyxvQkFBQyxhQUFhLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFHLENBQUUsR0FBRyxFQUFDLENBQUMsTUFBQSxFQUFNLENBQUUsQ0FBRSxDQUFFLENBQUEsQ0FBQztLQUM1RixHQUFHLEVBQUUsQ0FBQztLQUNOO0FBQ0wsSUFBSTtBQUNKOztHQUVHLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBRTtJQUN0QixXQUFXLEVBQUUsQ0FBQztJQUNkLGNBQWMsQ0FBQyxJQUFJLENBQUMsb0JBQUMsYUFBYSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBRSxTQUFTLEVBQUMsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxHQUFHLEVBQUMsQ0FBQyxNQUFBLEVBQU0sQ0FBRSxDQUFFLENBQUUsQ0FBQSxDQUFDLENBQUM7SUFDNUUsR0FBRyxFQUFFLENBQUM7QUFDVixJQUFJOztBQUVKLEdBQUc7O0VBRUQ7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLHFCQUFzQixDQUFBLEVBQUE7SUFDcEMsb0JBQUMsaUJBQWlCLEVBQUEsQ0FBQSxDQUFDLFdBQUEsRUFBVyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBWSxDQUFFLENBQUEsRUFBQTtJQUN4RCxjQUFjLEVBQUM7SUFDaEIsb0JBQUMsYUFBYSxFQUFBLENBQUEsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBRSxDQUFBO0dBQ3hDLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRzs7Ozs7O0FDdERqQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztBQUU1RCxJQUFJLG1DQUFtQyw2QkFBQTtDQUN0QyxpQkFBaUIsQ0FBQyxXQUFXO0VBQzVCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0VBQ3hCO0NBQ0Qsa0JBQWtCLENBQUMsV0FBVztFQUM3QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQixFQUFFOztDQUVELGdCQUFnQixDQUFDLFdBQVc7QUFDN0IsRUFBRSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDOztFQUVFLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7R0FDOUMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRyxDQUFDO0dBQ3BELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDdkUsR0FBRyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3pDOztHQUVHLElBQUksRUFBRSxhQUFhLEdBQUcsWUFBWSxHQUFHLFlBQVksQ0FBQyxFQUFFO0FBQ3ZELElBQUksSUFBSSxNQUFNLElBQUksYUFBYSxHQUFHLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQztBQUMvRDs7SUFFSSxJQUFJLE1BQU0sR0FBRyxZQUFZLEVBQUU7S0FDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQ3hEO0FBQ0wsU0FBUzs7S0FFSixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDdkQsS0FBSzs7SUFFRDtHQUNEO0FBQ0gsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLFdBQVcsRUFBRSxFQUFFLENBQUM7QUFDdEIsRUFBRSxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7O0FBRXpCLEVBQUUsSUFBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUM7O0FBRWpDLEVBQUUsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTs7R0FFM0MsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtJQUN4RSxTQUFTLElBQUksUUFBUSxDQUFDO0FBQzFCLElBQUk7O0dBRUQsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7SUFDNUMsSUFBSSxLQUFLLENBQUM7QUFDZCxJQUFJLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQzs7SUFFMUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNO0tBQzVCLEtBQUssT0FBTztNQUNYLEtBQUssQ0FBQyx5REFBeUQsQ0FBQztNQUNoRSxXQUFXLENBQUMsU0FBUyxDQUFDO01BQ3RCLE1BQU07S0FDUCxLQUFLLE1BQU07TUFDVixLQUFLLENBQUMsMkRBQTJELENBQUM7TUFDbEUsV0FBVyxDQUFDLFNBQVMsQ0FBQztNQUN0QixNQUFNO0tBQ1AsS0FBSyxXQUFXO01BQ2YsS0FBSyxDQUFDLDJEQUEyRCxDQUFDO01BQ2xFLFdBQVcsQ0FBQyxTQUFTLENBQUM7TUFDdEIsTUFBTTtLQUNQLEtBQUssU0FBUztNQUNiLEtBQUssQ0FBQywyREFBMkQsQ0FBQztNQUNsRSxXQUFXLENBQUMsU0FBUyxDQUFDO01BQ3RCLE1BQU07QUFDWixLQUFLLFFBQVE7O0FBRWIsS0FBSztBQUNMOztJQUVJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO0tBQzFDLEtBQUssQ0FBQywwREFBMEQsQ0FBQztLQUNqRSxXQUFXLENBQUMsU0FBUyxDQUFDO0FBQzNCLEtBQUs7O0lBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7S0FDakMsSUFBSSxNQUFNLEdBQUc7TUFDWixlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHO01BQ2hDLENBQUM7S0FDRixXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsS0FBQSxFQUFLLENBQUUsTUFBTSxFQUFDLENBQUMsU0FBQSxFQUFTLENBQUMsY0FBQSxFQUFjLENBQUMsR0FBQSxFQUFHLENBQUUsY0FBZ0IsQ0FBTSxDQUFBLENBQUM7S0FDMUYsY0FBYyxFQUFFLENBQUM7S0FDakI7QUFDTCxJQUFJO0FBQ0o7O0dBRUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDNUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRSxXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsS0FBQSxFQUFLLENBQUUsTUFBTSxFQUFDLENBQUMsU0FBQSxFQUFTLENBQUMsaUJBQUEsRUFBaUIsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxjQUFnQixDQUFNLENBQUEsQ0FBQyxDQUFDO0lBQzlGLGNBQWMsRUFBRSxDQUFDO0FBQ3JCLElBQUk7QUFDSjs7R0FFRyxXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsY0FBQSxFQUFjLENBQUMsR0FBQSxFQUFHLENBQUUsY0FBZ0IsQ0FBSSxDQUFBLENBQUMsQ0FBQztBQUMzRSxHQUFHLGNBQWMsRUFBRSxDQUFDO0FBQ3BCOztHQUVHLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyx5QkFBQSxFQUF5QixDQUFDLEdBQUEsRUFBRyxDQUFFLGNBQWdCLENBQU0sQ0FBQSxDQUFDLENBQUM7QUFDMUYsR0FBRyxjQUFjLEVBQUUsQ0FBQztBQUNwQjs7R0FFRyxJQUFJLE1BQU0sQ0FBQztHQUNYLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQzFCLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QjtRQUNJO0lBQ0osTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLElBQUk7O0dBRUQsV0FBVyxDQUFDLElBQUk7SUFDZixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFBLEVBQW1CLENBQUMsS0FBQSxFQUFLLENBQUUsTUFBTSxFQUFDLENBQUMsR0FBQSxFQUFHLENBQUUsY0FBZ0IsQ0FBQSxFQUFBO0tBQ3RFLG9CQUFDLGFBQWEsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUUsQ0FBQTtJQUNsQyxDQUFBO0lBQ04sQ0FBQztBQUNMLEdBQUcsY0FBYyxFQUFFLENBQUM7QUFDcEI7O0dBRUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUN0RyxJQUFJLE9BQU8sQ0FBQztJQUNaLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3pELElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUN4QixLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ3BDLGNBQWMsQ0FBQyxJQUFJLENBQUMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxRQUFBLEVBQVEsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxDQUFHLENBQU0sQ0FBQSxDQUFDLENBQUM7S0FDNUQ7SUFDRCxPQUFPLEdBQUcsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxpQkFBQSxFQUFpQixDQUFDLEdBQUEsRUFBRyxDQUFFLGNBQWdCLENBQUEsRUFBQSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGVBQWdCLENBQUEsRUFBQyxjQUFxQixDQUFNLENBQUEsQ0FBQztJQUM1SCxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFCLGNBQWMsRUFBRSxDQUFDO0FBQ3JCLElBQUk7O0FBRUosR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsU0FBUyxFQUFDLENBQUMsS0FBQSxFQUFLLENBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFHLENBQUEsRUFBQTtJQUMzRCxXQUFZO0dBQ1IsQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWE7Ozs7OztBQ2pKOUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzlELElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUU1RCxJQUFJLCtCQUErQix5QkFBQTs7Q0FFbEMsZUFBZSxFQUFFLFdBQVc7RUFDM0IsT0FBTyxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7RUFDckM7Q0FDRCxpQkFBaUIsRUFBRSxXQUFXO0VBQzdCLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDakQ7Q0FDRCxvQkFBb0IsRUFBRSxXQUFXO0VBQ2hDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsRUFBRTs7Q0FFRCxTQUFTLENBQUMsV0FBVztFQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLEVBQUU7O0NBRUQsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7SUFDbEMsb0JBQUMsa0JBQWtCLEVBQUEsQ0FBQTtLQUNsQixTQUFBLEVBQVMsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFDO0tBQ3ZDLFdBQUEsRUFBVyxDQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxXQUFXLEVBQUM7S0FDakUsT0FBQSxFQUFPLENBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsS0FBSyxXQUFZLENBQUE7SUFDeEQsQ0FBQTtHQUNHLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTOzs7Ozs7QUNsQzFCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXJELElBQUksbUNBQW1DLDZCQUFBOztDQUV0QyxTQUFTLENBQUM7RUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQzlCLEVBQUU7O0NBRUQsWUFBWSxDQUFDLFdBQVc7RUFDdkIsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzdCLEVBQUU7O0FBRUYsQ0FBQyxNQUFNLENBQUMsV0FBVzs7RUFFakIsSUFBSSxXQUFXLEdBQUcsa0JBQWtCLENBQUM7RUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0dBQ3hCLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDN0IsR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsNEJBQTZCLENBQUEsRUFBQTtJQUMzQyxvQkFBQSxRQUFPLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFdBQVcsRUFBQyxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxZQUFjLENBQUEsRUFBQTtLQUMxRCxvREFBcUQ7S0FDdEQsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxLQUFBLEVBQUssQ0FBQyw0QkFBQSxFQUE0QixDQUFDLEtBQUEsRUFBSyxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQUEsRUFBTSxDQUFDLElBQUEsRUFBSSxDQUFDLE9BQUEsRUFBTyxDQUFDLFdBQVksQ0FBQSxFQUFBO01BQ2xGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsQ0FBQSxFQUFDLENBQUMsaURBQWlELENBQUUsQ0FBQTtLQUN0RCxDQUFBO0lBQ0UsQ0FBQTtHQUNKLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhOzs7Ozs7QUNsQzlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXJELElBQUksdUNBQXVDLGlDQUFBOztDQUUxQyxTQUFTLENBQUM7RUFDVCxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2xDLEVBQUU7O0NBRUQsWUFBWSxDQUFDLFdBQVc7RUFDdkIsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDakMsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztFQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7R0FDNUIsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM3QixHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyw0QkFBNkIsQ0FBQSxFQUFBO0lBQzNDLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsV0FBVyxFQUFDLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFlBQWMsQ0FBQSxFQUFBO0tBQzFELG9EQUFxRDtLQUN0RCxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsS0FBQSxFQUFLLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBQSxFQUFNLENBQUMsSUFBQSxFQUFJLENBQUMsT0FBQSxFQUFPLENBQUMsV0FBWSxDQUFBLEVBQUE7TUFDbEYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxnREFBZ0QsQ0FBRSxDQUFBO0tBQ3JELENBQUE7SUFDRSxDQUFBO0dBQ0osQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQjs7Ozs7O0FDbENsQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUkseUNBQXlDLG1DQUFBOztDQUU1QyxTQUFTLENBQUM7RUFDVCxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0VBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07RUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtFQUMzQixRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQy9CLEVBQUU7O0NBRUQsWUFBWSxDQUFDLFdBQVc7RUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0VBRWpCLElBQUksY0FBYyxHQUFHO0dBQ3BCLFNBQVMsQ0FBQyxNQUFNO0dBQ2hCLFFBQVEsQ0FBQyxNQUFNO0dBQ2YsY0FBYyxDQUFDLElBQUk7R0FDbkIsSUFBSSxDQUFDLE1BQU07R0FDWCxjQUFjLENBQUMsSUFBSTtHQUNuQixNQUFNLENBQUMsS0FBSztBQUNmLEdBQUc7O0VBRUQsSUFBSSxXQUFXLEdBQUcsZ0JBQWdCLENBQUM7RUFDbkMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtHQUN4QixXQUFXLEdBQUcsV0FBVztBQUM1QixHQUFHOztFQUVELElBQUksVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEUsRUFBRSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7O0VBRTdDO0dBQ0Msb0JBQUEsSUFBRyxFQUFBLElBQUMsRUFBQTtJQUNILG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsV0FBVyxFQUFDLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFlBQWMsQ0FBQSxFQUFBO0tBQzNELG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsVUFBWSxDQUFNLENBQUEsRUFBQTtLQUNsQyxvQkFBQSxNQUFLLEVBQUEsSUFBQyxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBVSxDQUFBLEVBQUE7S0FDNUMsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQVMsQ0FBQTtJQUM1RCxDQUFBO0dBQ0wsQ0FBQTtJQUNKO0FBQ0osRUFBRTs7QUFFRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLG1CQUFtQjs7Ozs7O0FDL0NwQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksbUJBQW1CLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRWpFLElBQUksbUNBQW1DLDZCQUFBOztDQUV0QyxTQUFTLENBQUM7RUFDVCxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0VBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07RUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNqQyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0VBRWpCLElBQUksUUFBUSxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RixFQUFFLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0VBRXJDLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUMxQixFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDekM7O0FBRUEsR0FBRyxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RDs7R0FFRyxjQUFjLENBQUMsSUFBSTtJQUNsQixvQkFBQyxtQkFBbUIsRUFBQSxDQUFBO0tBQ25CLElBQUEsRUFBSSxDQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQztLQUNsQixXQUFBLEVBQVcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBQztLQUNwQyxHQUFBLEVBQUcsQ0FBRSxDQUFDLEVBQUM7S0FDUCxRQUFBLEVBQVEsQ0FBRSxRQUFRLEVBQUM7S0FDbkIsTUFBQSxFQUFNLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFPLENBQUE7S0FDeEIsQ0FBQTtJQUNILENBQUM7QUFDTCxHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLElBQUMsRUFBQTtJQUNKLG9CQUFBLElBQUcsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsZ0JBQWlCLENBQUEsRUFBQTtLQUM3QixjQUFlO0lBQ1osQ0FBQTtHQUNBLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhOzs7Ozs7QUM3QzlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSwwQ0FBMEMsb0NBQUE7O0NBRTdDLFNBQVMsQ0FBQztFQUNULFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7RUFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtFQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQy9CLEVBQUU7O0NBRUQsYUFBYSxDQUFDLFdBQVc7RUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0VBRWpCLElBQUksV0FBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQ25FLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7R0FDeEIsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM3QixHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxnQkFBaUIsQ0FBQSxFQUFBO0lBQy9CLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsV0FBVyxFQUFDLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLGFBQWMsQ0FBRSxDQUFBLEVBQUE7S0FDN0Qsb0JBQUEsS0FBSSxFQUFBLElBQU8sQ0FBQSxFQUFBO0tBQ1gsb0JBQUEsTUFBSyxFQUFBLElBQUMsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQVUsQ0FBQTtJQUN0QyxDQUFBO0dBQ0osQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQjs7Ozs7O0FDaENyQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksb0JBQW9CLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7O0FBRW5FLElBQUksb0NBQW9DLDhCQUFBOztDQUV2QyxTQUFTLENBQUM7RUFDVCxZQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0VBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDakMsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsQ0FBQztBQUN0RCxFQUFFLElBQUksY0FBYyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDOztFQUV4RDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsaUJBQWtCLENBQUEsRUFBQTtJQUNoQyxvQkFBQyxvQkFBb0IsRUFBQSxDQUFBLENBQUMsTUFBQSxFQUFNLENBQUMsTUFBQSxFQUFNLENBQUMsWUFBQSxFQUFZLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUMsQ0FBQyxRQUFBLEVBQVEsQ0FBRSxZQUFhLENBQUEsQ0FBRyxDQUFBLEVBQUE7SUFDckcsb0JBQUMsb0JBQW9CLEVBQUEsQ0FBQSxDQUFDLE1BQUEsRUFBTSxDQUFDLFFBQUEsRUFBUSxDQUFDLFlBQUEsRUFBWSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFDLENBQUMsUUFBQSxFQUFRLENBQUUsY0FBZSxDQUFBLENBQUcsQ0FBQTtHQUNwRyxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYzs7Ozs7O0FDekIvQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksc0NBQXNDLGdDQUFBOztDQUV6QyxTQUFTLENBQUM7RUFDVCxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0VBQ25DLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7QUFDL0IsRUFBRTs7Q0FFRCxlQUFlLENBQUMsVUFBVTtFQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEQsRUFBRTs7Q0FFRCxNQUFNLENBQUMsV0FBVztFQUNqQjtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtJQUNqQyxvQkFBQSxPQUFNLEVBQUEsSUFBQyxFQUFBO0tBQ04sb0JBQUEsT0FBTSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQyxVQUFBLEVBQVUsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxrQkFBQSxFQUFrQixDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDLENBQUMsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLGVBQWdCLENBQUUsQ0FBQSxFQUFBO0tBQ25ILG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsZ0JBQWlCLENBQUEsRUFBQSxXQUFBLEVBQVMsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQSxNQUFXLENBQU8sQ0FBQTtJQUNqRixDQUFBO0dBQ0gsQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQjs7Ozs7O0FDekJqQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN4RCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFbkQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEQsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdEQsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMxRCxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztBQUUxRCxJQUFJLGtDQUFrQyw0QkFBQTs7Q0FFckMsZUFBZSxDQUFDLFdBQVc7RUFDMUIsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUNsRSxPQUFPLE9BQU8sQ0FBQztBQUNqQixFQUFFOztDQUVELGlCQUFpQixFQUFFLFdBQVc7RUFDN0IsUUFBUSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMzQztDQUNELG9CQUFvQixFQUFFLFdBQVc7RUFDaEMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUM5QztDQUNELFNBQVMsQ0FBQyxXQUFXO0VBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDeEMsRUFBRTs7Q0FFRCxZQUFZLENBQUMsU0FBUyxNQUFNLEVBQUU7RUFDN0IsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDMUM7Q0FDRCxXQUFXLENBQUMsU0FBUyxNQUFNLEVBQUU7RUFDNUIsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDMUM7Q0FDRCxjQUFjLENBQUMsU0FBUyxJQUFJLEVBQUU7RUFDN0IsVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDMUM7Q0FDRCxjQUFjLENBQUMsU0FBUyxJQUFJLEVBQUU7RUFDN0IsVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLFNBQVMsR0FBRyxlQUFlLENBQUM7RUFDaEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtHQUN2QixTQUFTLElBQUksU0FBUyxDQUFDO0dBQ3ZCO0VBQ0Q7R0FDQyxvQkFBQSxTQUFRLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFNBQVcsQ0FBQSxFQUFBO0lBQzlCLG9CQUFDLGFBQWEsRUFBQSxDQUFBLENBQUMsV0FBQSxFQUFXLENBQUUsSUFBSSxDQUFDLFdBQVcsRUFBQyxDQUFDLFFBQUEsRUFBUSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDLENBQUMsTUFBQSxFQUFNLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFPLENBQUUsQ0FBQSxFQUFBO0lBQ3ZHLG9CQUFDLGNBQWMsRUFBQSxDQUFBLENBQUMsWUFBQSxFQUFZLENBQUUsSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDLFFBQUEsRUFBUSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTyxDQUFFLENBQUEsRUFBQTtJQUMvRSxvQkFBQyxnQkFBZ0IsRUFBQSxDQUFBLENBQUMsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUMsQ0FBQyxjQUFBLEVBQWMsQ0FBRSxJQUFJLENBQUMsY0FBZSxDQUFFLENBQUEsRUFBQTtJQUN2RixvQkFBQyxnQkFBZ0IsRUFBQSxDQUFBLENBQUMsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUMsQ0FBQyxjQUFBLEVBQWMsQ0FBRSxJQUFJLENBQUMsY0FBZSxDQUFFLENBQUE7R0FDOUUsQ0FBQTtJQUNUO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVk7Ozs7OztBQzNEN0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLHNDQUFzQyxnQ0FBQTs7Q0FFekMsU0FBUyxDQUFDO0VBQ1QsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtFQUNuQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQy9CLEVBQUU7O0NBRUQsZUFBZSxDQUFDLFdBQVc7RUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELEVBQUU7O0NBRUQsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGtCQUFtQixDQUFBLEVBQUE7SUFDakMsb0JBQUEsT0FBTSxFQUFBLElBQUMsRUFBQTtLQUNOLG9CQUFBLE9BQU0sRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsVUFBQSxFQUFVLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQUEsRUFBa0IsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBQyxDQUFDLFFBQUEsRUFBUSxDQUFFLElBQUksQ0FBQyxlQUFnQixDQUFFLENBQUEsRUFBQTtLQUNuSCxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGdCQUFpQixDQUFBLEVBQUEsV0FBQSxFQUFTLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsV0FBWSxDQUFBLEVBQUEsTUFBVyxDQUFPLENBQUE7SUFDakYsQ0FBQTtHQUNILENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0I7Ozs7OztBQ3pCakMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDckQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRWhELElBQUksZ0NBQWdDLDBCQUFBOztDQUVuQyxTQUFTLENBQUM7RUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0VBQzNCLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDbkMsRUFBRTs7Q0FFRCxRQUFRLENBQUMsV0FBVztFQUNuQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O0VBRWpDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDekIsVUFBVSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNqRCxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUN0RTtDQUNELFdBQVcsQ0FBQyxXQUFXO0VBQ3RCLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUM7QUFDaEMsRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs7RUFFcEM7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGFBQWMsQ0FBQSxFQUFBO0lBQzVCLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsUUFBQSxFQUFRLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFFBQVUsQ0FBQSxFQUFBO0tBQ2xELG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsU0FBVyxDQUFNLENBQUEsRUFBQTtLQUNqQyxvQkFBQSxNQUFLLEVBQUEsSUFBQyxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQVksQ0FBQTtJQUMzQixDQUFBLEVBQUE7SUFDVCxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGdCQUFpQixDQUFBLEVBQUE7S0FDL0Isb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxtQkFBQSxFQUFtQixDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxRQUFVLENBQUEsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFZLENBQUEsRUFBQTtLQUN6RixvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGFBQWMsQ0FBQSxFQUFBO01BQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFDO01BQ3ZCLG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsY0FBQSxFQUFjLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFdBQWEsQ0FBQSxFQUFBO09BQ3JELG9EQUFxRDtPQUN0RCxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsS0FBQSxFQUFLLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBQSxFQUFNLENBQUMsSUFBQSxFQUFJLENBQUMsT0FBQSxFQUFPLENBQUMsV0FBWSxDQUFBLEVBQUE7UUFDbEYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxDQUFBLEVBQUMsQ0FBQywrRUFBK0UsQ0FBRSxDQUFBO09BQ3BGLENBQUE7TUFDSCxDQUFBO0tBQ0UsQ0FBQTtJQUNGLENBQUE7R0FDRCxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVTs7Ozs7O0FDckQzQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUV0QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNoRCxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFOUMsSUFBSSxpQ0FBaUMsMkJBQUE7Q0FDcEMsZUFBZSxDQUFDLFdBQVc7RUFDMUIsT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLEVBQUU7O0NBRUQsaUJBQWlCLEVBQUUsV0FBVztFQUM3QixRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzNDO0NBQ0Qsb0JBQW9CLEVBQUUsV0FBVztFQUNoQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzlDO0NBQ0QsU0FBUyxDQUFDLFdBQVc7RUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztFQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0MsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztBQUVuQixFQUFFLElBQUksV0FBVyxHQUFHLGNBQWMsQ0FBQztBQUNuQzs7RUFFRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBRTtHQUMxRyxXQUFXLEVBQUUsT0FBTyxDQUFDO0FBQ3hCLEdBQUc7O0VBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtHQUNyQixXQUFXLEVBQUUsU0FBUyxDQUFDO0FBQzFCLEdBQUc7O0VBRUQsSUFBSSxLQUFLLEdBQUc7R0FDWCxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNsRCxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDbEQsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2hELENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNsRCxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNwRCxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDbEQsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDMUQsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDdEQsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDcEQsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2hELENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ3BELENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ3BELENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ3pELENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ3pELENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNoRCxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNyRDtBQUNILEVBQUUsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7RUFFL0IsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0VBQ3JCLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7R0FDcEMsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBQyxVQUFVLEVBQUEsQ0FBQSxDQUFDLEdBQUEsRUFBRyxDQUFFLENBQUMsRUFBQyxDQUFDLElBQUEsRUFBSSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFVBQUEsRUFBVSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUUsQ0FBQSxDQUFDLENBQUM7QUFDOUcsR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsV0FBVyxFQUFDLENBQUMsRUFBQSxFQUFFLENBQUMsY0FBZSxDQUFBLEVBQUE7SUFDN0MsV0FBWTtHQUNSLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXOzs7OztBQ3BFNUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVyQyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUMzQixDQUFDLFFBQVEsQ0FBQyxJQUFJOztDQUViLFFBQVEsQ0FBQyxJQUFJO0FBQ2QsQ0FBQyxRQUFRLENBQUMsSUFBSTs7Q0FFYixTQUFTLENBQUMsSUFBSTtBQUNmLENBQUMsU0FBUyxDQUFDLElBQUk7O0NBRWQsY0FBYyxDQUFDLElBQUk7Q0FDbkIsZ0JBQWdCLENBQUMsSUFBSTtBQUN0QixDQUFDLFlBQVksQ0FBQyxJQUFJOztDQUVqQixjQUFjLENBQUMsSUFBSTtDQUNuQixZQUFZLENBQUMsSUFBSTtDQUNqQixDQUFDOzs7QUNqQkYsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQzs7QUFFNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLFVBQVUsRUFBRTs7OztBQ0ZqQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUV0QyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ2xELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztBQUV4RCxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUM7O0FBRTVCLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBRztDQUNkLE1BQU0sQ0FBQyxXQUFXO0NBQ2xCLE1BQU0sQ0FBQyxRQUFRO0NBQ2YsUUFBUSxDQUFDLEtBQUs7Q0FDZCxRQUFRLENBQUMsSUFBSTtDQUNiLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztDQUMvRCxDQUFDO0FBQ0YsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLElBQUksUUFBUSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoRyxJQUFJLFFBQVEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEcsSUFBSSxXQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVuRyxJQUFJLGdCQUFnQixDQUFDOztBQUVyQixxREFBcUQ7QUFDckQsOENBQThDO0FBQzlDLGFBQWE7QUFDYixTQUFTLGlCQUFpQixHQUFHO0NBQzVCLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxNQUFNLENBQUMsWUFBWSxLQUFLLFdBQVcsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztDQUM3RixJQUFJLFNBQVMsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQztDQUNqRCxJQUFJLFNBQVMsRUFBRTtFQUNkLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztFQUNyRCxJQUFJO0dBQ0gsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDdkMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNqQztFQUNELE9BQU8sR0FBRyxFQUFFO0dBQ1gsU0FBUyxHQUFHLEtBQUssQ0FBQztHQUNsQjtFQUNEO0NBQ0QsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO0FBQzlCLENBQUM7O0FBRUQsU0FBUyxXQUFXLEdBQUc7Q0FDdEIsV0FBVyxDQUFDLEtBQUssR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7Q0FDdkMsV0FBVyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Q0FDNUI7QUFDRCxTQUFTLGFBQWEsR0FBRztDQUN4QixXQUFXLENBQUMsT0FBTyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztDQUMzQyxXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztDQUMxQjtBQUNELFNBQVMsUUFBUSxHQUFHO0NBQ25CLFdBQVcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0NBQzFCLFdBQVcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQzdCLENBQUM7O0FBRUQsU0FBUyxXQUFXLEdBQUc7Q0FDdEIsT0FBTyxXQUFXLENBQUM7QUFDcEIsQ0FBQzs7QUFFRCxTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Q0FDdkIsR0FBRyxHQUFHLEVBQUU7RUFDUCxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0I7TUFDSTtFQUNKLE9BQU8sV0FBVyxDQUFDO0VBQ25CO0FBQ0YsQ0FBQzs7QUFFRCxTQUFTLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0NBQy9CLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7Q0FDdkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQzlFLFlBQVksRUFBRSxDQUFDO0FBQ2hCLENBQUM7O0FBRUQsU0FBUyxZQUFZLEdBQUc7Q0FDdkIsSUFBSSxnQkFBZ0IsRUFBRTtFQUNyQixZQUFZLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDMUQsWUFBWSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQ3ZELFlBQVksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUN2RCxZQUFZLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDdkQsWUFBWSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQ3hEO0FBQ0YsQ0FBQzs7QUFFRCxTQUFTLGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0NBQ2pDLElBQUksT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO0VBQzVDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUM7RUFDdEI7TUFDSTtFQUNKLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7RUFDdkI7Q0FDRCxJQUFJLE9BQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxXQUFXLEVBQUU7RUFDN0QsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUM7RUFDdkM7TUFDSTtFQUNKLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ3RDO0NBQ0QsWUFBWSxFQUFFLENBQUM7QUFDaEIsQ0FBQzs7QUFFRCxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7Q0FDekIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNyQixZQUFZLEVBQUUsQ0FBQztBQUNoQixDQUFDOztBQUVELGlFQUFpRTtBQUNqRSxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7Q0FDM0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztDQUNyQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0NBQ3JCLElBQUksTUFBTSxDQUFDO0FBQ1osQ0FBQyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs7Q0FFakMsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0VBQ2pFLE1BQU0sR0FBRyxZQUFZLENBQUM7RUFDdEI7TUFDSSxHQUFHLE9BQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSxXQUFXLEVBQUU7RUFDdkMsTUFBTSxHQUFHLEtBQUssQ0FBQztFQUNmO01BQ0k7RUFDSixNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN2QixFQUFFO0FBQ0Y7O0FBRUEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFOztFQUV6RCxJQUFJLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0dBQ2pFLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ25EO09BQ0k7R0FDSixXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNsRDtBQUNILEVBQUU7O01BRUk7RUFDSixXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUMzQyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRCxFQUFFO0FBQ0Y7QUFDQTs7QUFFQSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRXJFLEVBQUUsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7QUFFekQsR0FBRyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFOztJQUU1RCxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0tBQ3BFLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3REO1NBQ0k7S0FDSixRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyRDtBQUNMLElBQUk7O1FBRUk7SUFDSixRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM5QyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRDtBQUNKLEdBQUc7O09BRUk7R0FDSixRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztHQUN4QyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztHQUM5QyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNyRDtBQUNILEVBQUU7O0FBRUYsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFaEIsQ0FBQztBQUNEOztBQUVBLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztDQUMvQyxXQUFXLENBQUMsV0FBVztBQUN4QixDQUFDLFNBQVMsQ0FBQyxTQUFTOztDQUVuQixVQUFVLENBQUMsVUFBVTtFQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3hCO0NBQ0QsaUJBQWlCLENBQUMsU0FBUyxRQUFRLEVBQUU7RUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDL0I7Q0FDRCxvQkFBb0IsQ0FBQyxTQUFTLFFBQVEsRUFBRTtFQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUMzQztBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILHNCQUFzQjtBQUN0QixTQUFTLFdBQVcsR0FBRztBQUN2QixDQUFDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLENBQUM7QUFDekM7O0NBRUMsSUFBSSxNQUFNLEtBQUssV0FBVyxDQUFDLE1BQU0sRUFBRTtFQUNsQyxXQUFXLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztFQUM1QixXQUFXLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDO0VBQzVCLFdBQVcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDOUI7QUFDRixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRTdCLENBQUM7O0FBRUQsU0FBUyxJQUFJLEdBQUc7Q0FDZixpQkFBaUIsRUFBRSxDQUFDO0NBQ3BCLFdBQVcsRUFBRSxDQUFDO0FBQ2YsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQzs7Q0FFOUIsSUFBSSxnQkFBZ0IsRUFBRTtBQUN2QixFQUFFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hFOztFQUVFLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDekMsSUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztFQUNwQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0dBQ2xDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZGLEdBQUc7QUFDSDs7QUFFQSxFQUFFLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEU7O0VBRUUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDMUUsSUFBSSxVQUFVLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFO0dBQzNDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQztBQUM3RSxHQUFHO0FBQ0g7O0VBRUUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDMUUsSUFBSSxVQUFVLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFO0dBQzNDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQztBQUM3RSxHQUFHOztFQUVELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUN4RSxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEVBQUU7R0FDM0MsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQztBQUNoRixHQUFHO0FBQ0g7O0VBRUUsWUFBWSxFQUFFLENBQUM7RUFDZjtBQUNGLENBQUM7O0FBRUQsSUFBSSxFQUFFLENBQUM7O0FBRVAsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLE1BQU0sRUFBRTtDQUN2QyxPQUFPLE1BQU0sQ0FBQyxVQUFVO0VBQ3ZCLEtBQUssWUFBWSxDQUFDLGNBQWM7R0FDL0IsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3JDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUN0QixNQUFNO0VBQ1AsS0FBSyxZQUFZLENBQUMsZ0JBQWdCO0dBQ2pDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUN2QyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDdEIsTUFBTTtFQUNQLEtBQUssWUFBWSxDQUFDLFlBQVk7R0FDN0IsV0FBVyxFQUFFLENBQUM7R0FDZCxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDdEIsTUFBTTtFQUNQLEtBQUssWUFBWSxDQUFDLGNBQWM7R0FDL0IsYUFBYSxFQUFFLENBQUM7R0FDaEIsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ3RCLE1BQU07RUFDUCxLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLFFBQVEsRUFBRSxDQUFDO0dBQ1gsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxQixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDdEIsTUFBTTtFQUNQLEtBQUssWUFBWSxDQUFDLFlBQVk7R0FDN0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUN4QixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDdEIsTUFBTTtBQUNULEVBQUUsUUFBUTs7RUFFUjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUTs7Ozs7QUNwUnpCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDbEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUV0QyxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUM7O0FBRTVCLDBFQUEwRTtBQUMxRSxJQUFJLGlCQUFpQixDQUFDO0FBQ3RCLElBQUksZ0JBQWdCLENBQUM7QUFDckIsSUFBSSxhQUFhLENBQUM7O0FBRWxCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNmLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQzs7QUFFckIsd0VBQXdFO0FBQ3hFLFNBQVMsZUFBZSxHQUFHO0FBQzNCLENBQUMsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV2QixDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7O0VBRXRCLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEIsRUFBRTtBQUNGOztBQUVBLENBQUMsaUJBQWlCLEdBQUcsYUFBYSxJQUFJLGdCQUFnQixJQUFJLFNBQVMsQ0FBQzs7Q0FFbkUsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDO0FBQ2pDLENBQUM7O0FBRUQsU0FBUyxZQUFZLEdBQUc7Q0FDdkIsT0FBTztFQUNOLGlCQUFpQixDQUFDLGlCQUFpQjtFQUNuQyxnQkFBZ0IsQ0FBQyxnQkFBZ0I7RUFDakMsYUFBYSxDQUFDLGFBQWE7RUFDM0IsQ0FBQztBQUNILENBQUM7O0FBRUQsU0FBUyxPQUFPLEdBQUc7Q0FDbEIsT0FBTztFQUNOLFdBQVcsRUFBRSxZQUFZLEtBQUssQ0FBQyxDQUFDO0VBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0VBQ3hCLE9BQU8sRUFBRSxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDekMsQ0FBQztBQUNILENBQUM7O0FBRUQsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQ3ZCLENBQUMsSUFBSSxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDOztBQUUvQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLEVBQUUsQ0FBQyxHQUFHLEVBQUU7O0VBRTFDLElBQUksWUFBWSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztFQUM5QyxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdkIsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFOztHQUV0QyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUNqRCxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzFDO0FBQ0osR0FBRztBQUNIOztFQUVFLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO0FBQ2xDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztHQUUvQixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDakIsT0FBTztHQUNQO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7Q0FFQyxJQUFJLE9BQU8sYUFBYSxLQUFLLFdBQVcsRUFBRTtFQUN6QyxRQUFRLEVBQUUsQ0FBQztFQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQixFQUFFOztNQUVJO0VBQ0osZUFBZSxFQUFFLENBQUM7RUFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2Q7QUFDRixDQUFDOztBQUVELFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUMxQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEI7O0NBRUMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtFQUN0QixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEIsRUFBRTtBQUNGOztDQUVDLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDOztBQUVELFNBQVMsWUFBWSxHQUFHO0NBQ3ZCLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtFQUN2QixZQUFZLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCO0NBQ0Q7QUFDRCxTQUFTLFFBQVEsR0FBRztDQUNuQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtFQUNuQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCO0FBQ0YsQ0FBQzs7QUFFRCwwQ0FBMEM7QUFDMUMsU0FBUyxZQUFZLEdBQUc7Q0FDdkIsR0FBRyxPQUFPLGlCQUFpQixLQUFLLFdBQVcsRUFBRTtFQUM1QyxhQUFhLEdBQUcsZ0JBQWdCLENBQUM7RUFDakMsZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUM7RUFDckMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO0VBQzlCO0FBQ0YsQ0FBQzs7QUFFRCxzQ0FBc0M7QUFDdEMsU0FBUyxRQUFRLEdBQUc7Q0FDbkIsR0FBRyxPQUFPLGFBQWEsS0FBSyxXQUFXLEVBQUU7RUFDeEMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7RUFDckMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO0VBQ2pDLGFBQWEsR0FBRyxTQUFTLENBQUM7RUFDMUI7QUFDRixDQUFDOztBQUVELGdEQUFnRDtBQUNoRCxlQUFlLEVBQUUsQ0FBQzs7QUFFbEIsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLEVBQUUsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDO0NBQ3RELFlBQVksQ0FBQyxZQUFZO0NBQ3pCLFlBQVksQ0FBQyxZQUFZO0NBQ3pCLFFBQVEsQ0FBQyxRQUFRO0NBQ2pCLE9BQU8sQ0FBQyxPQUFPO0NBQ2YsT0FBTyxDQUFDLE9BQU87Q0FDZixZQUFZLENBQUMsWUFBWTtBQUMxQixDQUFDLFFBQVEsQ0FBQyxRQUFROztDQUVqQixVQUFVLENBQUMsVUFBVTtFQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3hCO0NBQ0QsaUJBQWlCLENBQUMsU0FBUyxRQUFRLEVBQUU7RUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDL0I7Q0FDRCxvQkFBb0IsQ0FBQyxTQUFTLFFBQVEsRUFBRTtFQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUMzQztBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxNQUFNLEVBQUU7QUFDeEMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxVQUFVOztFQUV2QixLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDckIsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLFlBQVksRUFBRSxDQUFDO0dBQ2YsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxRQUFRO0dBQ3pCLFFBQVEsRUFBRSxDQUFDO0dBQ1gsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxTQUFTO0dBQzFCLFlBQVksRUFBRSxDQUFDO0dBQ2YsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxTQUFTO0dBQzFCLFFBQVEsRUFBRSxDQUFDO0dBQ1gsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7QUFFVCxFQUFFLFFBQVE7O0VBRVI7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY29tbW9uL25hdmJhci5qc3gnKTtcclxudmFyIE9wdGlvbnNQYW5lbCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9rYWRhbGEtb3B0aW9ucy9vcHRpb25zLXBhbmVsLmpzeCcpO1xyXG52YXIgS2FkYWxhU3RvcmUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMva2FkYWxhLXN0b3JlL2thZGFsYS1zdG9yZS5qc3gnKTtcclxudmFyIEludmVudG9yeSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9pbnZlbnRvcnkvaW52ZW50b3J5LmpzeCcpO1xyXG52YXIgSW5kaXZpZHVhbEl0ZW0gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaW5kaXZpZHVhbC1pdGVtL2luZGl2aWR1YWwtaXRlbS5qc3gnKTtcclxudmFyIEZvb3RlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jb21tb24vZm9vdGVyLmpzeCcpO1xyXG5cclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZXMvQXBwU3RvcmUuanMnKTtcclxuXHJcbnZhciBBcHBsaWNhdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHJcblx0XHQvL29wYWNpdHkgb24gbG9hZGVyIGZvciB0aGUgbmljZSBmYWRlIGVmZmVjdCB2aWEgY3NzIHRyYW5zaXRpb25cclxuXHRcdHZhciBsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpO1xyXG5cdFx0bG9hZGVyLnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcblxyXG5cdFx0Ly9kaXNwbGF5IG5vbmUgc28gd2UgY2FuIGNsaWNrIHRocm91Z2ggaXQgYXMgcG9pbnRlci1ldmVudHMgaXMgYnVnZ3lcclxuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRsb2FkZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdH0sMTAwMCk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0b3JlLmdldFNldHRpbmdzKCkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvL2NvbmRpdGlvbmFsbHkgcmVuZGVyIGVpdGhlciB0aGUgaW52ZW50b3J5IG9yIGluZGl2aWR1YWwgaXRlbSBiYXNlZCBvbiBzY3JlZW4gc2l6ZVxyXG5cdFx0dmFyIGludmVudG9yeTtcclxuXHRcdHZhciBpbmRpdmlkdWFsSXRlbTtcclxuXHJcblx0XHRpZiAodGhpcy5zdGF0ZS5tb2JpbGUpIHtcclxuXHRcdFx0aW5kaXZpZHVhbEl0ZW0gPSA8SW5kaXZpZHVhbEl0ZW0gLz5cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpbnZlbnRvcnkgPSA8SW52ZW50b3J5IC8+XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8TmF2YmFyIG1vYmlsZT17dGhpcy5zdGF0ZS5tb2JpbGV9IC8+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lci1mbHVpZCc+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbC1zbS0zJz5cclxuXHRcdFx0XHRcdFx0XHQ8T3B0aW9uc1BhbmVsIC8+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTknPlxyXG5cdFx0XHRcdFx0XHRcdDxLYWRhbGFTdG9yZS8+XHJcblx0XHRcdFx0XHRcdFx0e2ludmVudG9yeX1cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTEyJz5cclxuXHRcdFx0XHRcdFx0XHR7aW5kaXZpZHVhbEl0ZW19XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PEZvb3RlciAvPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcblJlYWN0LnJlbmRlcihcclxuXHQ8QXBwbGljYXRpb24gLz4sXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpXHJcbik7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5EaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWIvRGlzcGF0Y2hlcicpXG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIERpc3BhdGNoZXJcbiAqIEB0eXBlY2hlY2tzXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCcuL2ludmFyaWFudCcpO1xuXG52YXIgX2xhc3RJRCA9IDE7XG52YXIgX3ByZWZpeCA9ICdJRF8nO1xuXG4vKipcbiAqIERpc3BhdGNoZXIgaXMgdXNlZCB0byBicm9hZGNhc3QgcGF5bG9hZHMgdG8gcmVnaXN0ZXJlZCBjYWxsYmFja3MuIFRoaXMgaXNcbiAqIGRpZmZlcmVudCBmcm9tIGdlbmVyaWMgcHViLXN1YiBzeXN0ZW1zIGluIHR3byB3YXlzOlxuICpcbiAqICAgMSkgQ2FsbGJhY2tzIGFyZSBub3Qgc3Vic2NyaWJlZCB0byBwYXJ0aWN1bGFyIGV2ZW50cy4gRXZlcnkgcGF5bG9hZCBpc1xuICogICAgICBkaXNwYXRjaGVkIHRvIGV2ZXJ5IHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gKiAgIDIpIENhbGxiYWNrcyBjYW4gYmUgZGVmZXJyZWQgaW4gd2hvbGUgb3IgcGFydCB1bnRpbCBvdGhlciBjYWxsYmFja3MgaGF2ZVxuICogICAgICBiZWVuIGV4ZWN1dGVkLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGlzIGh5cG90aGV0aWNhbCBmbGlnaHQgZGVzdGluYXRpb24gZm9ybSwgd2hpY2hcbiAqIHNlbGVjdHMgYSBkZWZhdWx0IGNpdHkgd2hlbiBhIGNvdW50cnkgaXMgc2VsZWN0ZWQ6XG4gKlxuICogICB2YXIgZmxpZ2h0RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjb3VudHJ5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDb3VudHJ5U3RvcmUgPSB7Y291bnRyeTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjaXR5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDaXR5U3RvcmUgPSB7Y2l0eTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgYmFzZSBmbGlnaHQgcHJpY2Ugb2YgdGhlIHNlbGVjdGVkIGNpdHlcbiAqICAgdmFyIEZsaWdodFByaWNlU3RvcmUgPSB7cHJpY2U6IG51bGx9XG4gKlxuICogV2hlbiBhIHVzZXIgY2hhbmdlcyB0aGUgc2VsZWN0ZWQgY2l0eSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY2l0eS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ2l0eTogJ3BhcmlzJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYENpdHlTdG9yZWA6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY2l0eS11cGRhdGUnKSB7XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IHBheWxvYWQuc2VsZWN0ZWRDaXR5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgY291bnRyeSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY291bnRyeS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ291bnRyeTogJ2F1c3RyYWxpYSdcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGJvdGggc3RvcmVzOlxuICpcbiAqICAgIENvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgQ291bnRyeVN0b3JlLmNvdW50cnkgPSBwYXlsb2FkLnNlbGVjdGVkQ291bnRyeTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIGNhbGxiYWNrIHRvIHVwZGF0ZSBgQ291bnRyeVN0b3JlYCBpcyByZWdpc3RlcmVkLCB3ZSBzYXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGUgcmV0dXJuZWQgdG9rZW4uIFVzaW5nIHRoaXMgdG9rZW4gd2l0aCBgd2FpdEZvcigpYCwgd2UgY2FuIGd1YXJhbnRlZVxuICogdGhhdCBgQ291bnRyeVN0b3JlYCBpcyB1cGRhdGVkIGJlZm9yZSB0aGUgY2FsbGJhY2sgdGhhdCB1cGRhdGVzIGBDaXR5U3RvcmVgXG4gKiBuZWVkcyB0byBxdWVyeSBpdHMgZGF0YS5cbiAqXG4gKiAgIENpdHlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBtYXkgbm90IGJlIHVwZGF0ZWQuXG4gKiAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIGlzIG5vdyBndWFyYW50ZWVkIHRvIGJlIHVwZGF0ZWQuXG4gKlxuICogICAgICAgLy8gU2VsZWN0IHRoZSBkZWZhdWx0IGNpdHkgZm9yIHRoZSBuZXcgY291bnRyeVxuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBnZXREZWZhdWx0Q2l0eUZvckNvdW50cnkoQ291bnRyeVN0b3JlLmNvdW50cnkpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIHVzYWdlIG9mIGB3YWl0Rm9yKClgIGNhbiBiZSBjaGFpbmVkLCBmb3IgZXhhbXBsZTpcbiAqXG4gKiAgIEZsaWdodFByaWNlU3RvcmUuZGlzcGF0Y2hUb2tlbiA9XG4gKiAgICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgZ2V0RmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGBjb3VudHJ5LXVwZGF0ZWAgcGF5bG9hZCB3aWxsIGJlIGd1YXJhbnRlZWQgdG8gaW52b2tlIHRoZSBzdG9yZXMnXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcyBpbiBvcmRlcjogYENvdW50cnlTdG9yZWAsIGBDaXR5U3RvcmVgLCB0aGVuXG4gKiBgRmxpZ2h0UHJpY2VTdG9yZWAuXG4gKi9cblxuICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2l0aCBldmVyeSBkaXNwYXRjaGVkIHBheWxvYWQuIFJldHVybnNcbiAgICogYSB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHdpdGggYHdhaXRGb3IoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIF9sYXN0SUQrKztcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3Rlcj1mdW5jdGlvbihpZCkge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICdEaXNwYXRjaGVyLnVucmVnaXN0ZXIoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICBpZFxuICAgICk7XG4gICAgZGVsZXRlIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gaWRzXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKGlkcykge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLidcbiAgICApO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdLFxuICAgICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICtcbiAgICAgICAgICAnd2FpdGluZyBmb3IgYCVzYC4nLFxuICAgICAgICAgIGlkXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KFxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaD1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgIXRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLidcbiAgICApO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY2FsbGJhY2sgc3RvcmVkIHdpdGggdGhlIGdpdmVuIGlkLiBBbHNvIGRvIHNvbWUgaW50ZXJuYWxcbiAgICogYm9va2tlZXBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrPWZ1bmN0aW9uKGlkKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0odGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHVwIGJvb2trZWVwaW5nIG5lZWRlZCB3aGVuIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmc9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoZmFsc2UpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhbiBlbnVtZXJhdGlvbiB3aXRoIGtleXMgZXF1YWwgdG8gdGhlaXIgdmFsdWUuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogICB2YXIgQ09MT1JTID0ga2V5TWlycm9yKHtibHVlOiBudWxsLCByZWQ6IG51bGx9KTtcbiAqICAgdmFyIG15Q29sb3IgPSBDT0xPUlMuYmx1ZTtcbiAqICAgdmFyIGlzQ29sb3JWYWxpZCA9ICEhQ09MT1JTW215Q29sb3JdO1xuICpcbiAqIFRoZSBsYXN0IGxpbmUgY291bGQgbm90IGJlIHBlcmZvcm1lZCBpZiB0aGUgdmFsdWVzIG9mIHRoZSBnZW5lcmF0ZWQgZW51bSB3ZXJlXG4gKiBub3QgZXF1YWwgdG8gdGhlaXIga2V5cy5cbiAqXG4gKiAgIElucHV0OiAge2tleTE6IHZhbDEsIGtleTI6IHZhbDJ9XG4gKiAgIE91dHB1dDoge2tleTE6IGtleTEsIGtleTI6IGtleTJ9XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG52YXIga2V5TWlycm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgdmFyIGtleTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gIH1cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gVG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciBrZXlzO1xuXHR2YXIgdG8gPSBUb09iamVjdCh0YXJnZXQpO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoT2JqZWN0KGZyb20pKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJ2YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xyXG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSB7XHJcblxyXG5cdGFkZEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5BRERfSVRFTSxcclxuXHRcdFx0aXRlbTppdGVtXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRwcmV2aW91c0ludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuUFJFVl9JTlZcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG5leHRJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLk5FWFRfSU5WXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRwcmV2aW91c0l0ZW06ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuUFJFVl9JVEVNXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRuZXh0SXRlbTpmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5ORVhUX0lURU1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGNoYW5nZVNldHRpbmc6ZnVuY3Rpb24oa2V5LHZhbCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLkNIQU5HRV9TRVRUSU5HLFxyXG5cdFx0XHRrZXk6a2V5LFxyXG5cdFx0XHR2YWw6dmFsXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHR0b2dnbGVTdG9yZTpmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5UT0dHTEVfU1RPUkVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRvZ2dsZU9wdGlvbnM6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuVE9HR0xFX09QVElPTlNcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGluY3JlbWVudFNoYXJkczpmdW5jdGlvbihrZXksdmFsKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuSU5DUkVNRU5UX1NIQVJEUyxcclxuXHRcdFx0a2V5OmtleSxcclxuXHRcdFx0dmFsOnZhbFxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjbGVhclNoYXJkczpmdW5jdGlvbihrZXkpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5DTEVBUl9TSEFSRFMsXHJcblx0XHRcdGtleTprZXlcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEFjdGlvbnM7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBGb290ZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGZvb3Rlcj5cclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2Zvb3Rlci1sZWZ0Jz5cclxuXHRcdFx0XHRcdDxhIGhyZWY9Jy8vdXMuYmF0dGxlLm5ldC9kMy9lbi8nPkRpYWJsbyBJSUk8L2E+IMKpIFxyXG5cdFx0XHRcdFx0PGEgaHJlZj0nLy91cy5ibGl6emFyZC5jb20vZW4tdXMvJz5CbGl6emFyZCBFbnRlcnRhaW5tZW50LCBJbmMuPC9hPlxyXG5cdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2Zvb3Rlci1yaWdodCc+XHJcblx0XHRcdFx0ey8qR2l0aHViIC0gRnJvbSBGb3VuZGF0aW9uIEljb25zIGJ5IFp1cmIgTUlUIExpY2VuY2UqL31cclxuXHRcdFx0XHQ8YSBocmVmPScvL2dpdGh1Yi5jb20vYmVuc3RlcHAnPlxyXG5cdFx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxyXG5cdFx0XHRcdFx0XHQgd2lkdGg9XCIyNHB4XCIgaGVpZ2h0PVwiMjRweFwiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCAxMDAgMTAwXCI+XHJcblx0XHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdFx0PHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTQ5Ljk5OCwxMS45NjNDMjguNDYxLDExLjk2MywxMSwyOS40MjUsMTEsNTAuOTY1XHJcblx0XHRcdFx0XHRcdFx0YzAsMTcuMjMxLDExLjE3MiwzMS44NDksMjYuNjcxLDM3LjAwM2MxLjk1MiwwLjM2MSwyLjY2Mi0wLjg0LDIuNjYyLTEuODc3YzAtMC45MjQtMC4wMzQtMy4zNzUtMC4wNTEtNi42MzNcclxuXHRcdFx0XHRcdFx0XHRjLTEwLjg0OSwyLjM1OS0xMy4xMzgtNS4yMjktMTMuMTM4LTUuMjI5Yy0xLjc3NC00LjUwNS00LjMzMS01LjcwMy00LjMzMS01LjcwM2MtMy41NDEtMi40MTgsMC4yNjktMi4zNzEsMC4yNjktMi4zNzFcclxuXHRcdFx0XHRcdFx0XHRjMy45MTQsMC4yNzcsNS45NzQsNC4wMTgsNS45NzQsNC4wMThjMy40NzgsNS45Niw5LjEyOSw0LjIzNSwxMS4zNSwzLjI0M2MwLjM1My0yLjUyNSwxLjM2My00LjI0LDIuNDc2LTUuMjE3XHJcblx0XHRcdFx0XHRcdFx0Yy04LjY1OS0wLjk4NC0xNy43NjMtNC4zMy0xNy43NjMtMTkuMjc0YzAtNC4yNTksMS41MTktNy43NDEsNC4wMTMtMTAuNDY4Yy0wLjM5OS0wLjk4Mi0xLjc0LTQuOTQ3LDAuMzgzLTEwLjMxOVxyXG5cdFx0XHRcdFx0XHRcdGMwLDAsMy4yNzQtMS4wNDgsMTAuNzI2LDQuMDAxYzMuMTA5LTAuODY5LDYuNDQ2LTEuMzAzLDkuNzYzLTEuMzE2YzMuMzEyLDAuMDE0LDYuNjUsMC40NDcsOS43NjMsMS4zMTZcclxuXHRcdFx0XHRcdFx0XHRjNy40NDctNS4wNDksMTAuNzE2LTQuMDAxLDEwLjcxNi00LjAwMWMyLjEyOCw1LjM3MiwwLjc4OCw5LjMzNywwLjM4OCwxMC4zMTljMi41LDIuNzI3LDQuMDA4LDYuMjA5LDQuMDA4LDEwLjQ2OFxyXG5cdFx0XHRcdFx0XHRcdGMwLDE0Ljk3OS05LjExNywxOC4yNzktMTcuODA1LDE5LjI0MWMxLjM5OCwxLjIwNSwyLjY0NiwzLjU5LDIuNjQ2LDcuMjI5YzAsNS4yMTEtMC4wNDcsOS40MTYtMC4wNDcsMTAuNjk1XHJcblx0XHRcdFx0XHRcdFx0YzAsMS4wNDUsMC43MDEsMi4yNiwyLjY4MSwxLjg3M0M3Ny44MzYsODIuNzk4LDg5LDY4LjE5MSw4OSw1MC45NjVDODksMjkuNDI1LDcxLjUzOSwxMS45NjMsNDkuOTk4LDExLjk2M3pcIi8+XHJcblx0XHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0ey8qVHdpdHRlciAtIEZyb20gRm91bmRhdGlvbiBJY29ucyBieSBadXJiIE1JVCBMaWNlbmNlKi99XHJcblx0XHRcdFx0PGEgaHJlZj0nLy90d2l0dGVyLmNvbS9iZW5zdGVwcCc+XHJcblx0XHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiXHJcblx0XHRcdFx0XHRcdCB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDEwMCAxMDBcIj5cclxuXHRcdFx0XHRcdDxwYXRoIGQ9XCJNODguNSwyNi4xMmMtMi44MzMsMS4yNTYtNS44NzcsMi4xMDUtOS4wNzMsMi40ODZjMy4yNjEtMS45NTUsNS43NjctNS4wNTEsNi45NDUtOC43MzhcclxuXHRcdFx0XHRcdFx0Yy0zLjA1MiwxLjgxLTYuNDM0LDMuMTI2LTEwLjAzMSwzLjgzMmMtMi44ODEtMy4wNjgtNi45ODctNC45ODgtMTEuNTMxLTQuOTg4Yy04LjcyNCwwLTE1Ljc5OCw3LjA3Mi0xNS43OTgsMTUuNzk4XHJcblx0XHRcdFx0XHRcdGMwLDEuMjM3LDAuMTQsMi40NDQsMC40MSwzLjYwMWMtMTMuMTMtMC42NTktMjQuNzctNi45NDktMzIuNTYyLTE2LjUwOGMtMS4zNiwyLjMzNC0yLjEzOSw1LjA0OS0yLjEzOSw3Ljk0M1xyXG5cdFx0XHRcdFx0XHRjMCw1LjQ4MSwyLjc4OSwxMC4zMTUsNy4wMjgsMTMuMTQ5Yy0yLjU4OS0wLjA4My01LjAyNS0wLjc5NC03LjE1NS0xLjk3NmMtMC4wMDIsMC4wNjYtMC4wMDIsMC4xMzEtMC4wMDIsMC4xOTlcclxuXHRcdFx0XHRcdFx0YzAsNy42NTIsNS40NDUsMTQuMDM3LDEyLjY3MSwxNS40OWMtMS4zMjUsMC4zNTktMi43MiwwLjU1My00LjE2MSwwLjU1M2MtMS4wMTksMC0yLjAwOC0wLjA5OC0yLjk3My0wLjI4M1xyXG5cdFx0XHRcdFx0XHRjMi4wMSw2LjI3NSw3Ljg0NCwxMC44NDQsMTQuNzU3LDEwLjk3MmMtNS40MDcsNC4yMzYtMTIuMjE4LDYuNzYzLTE5LjYyLDYuNzYzYy0xLjI3NSwwLTIuNTMyLTAuMDc0LTMuNzY5LTAuMjIxXHJcblx0XHRcdFx0XHRcdGM2Ljk5MSw0LjQ4MiwxNS4yOTUsNy4wOTYsMjQuMjE2LDcuMDk2YzI5LjA1OCwwLDQ0Ljk0OC0yNC4wNzEsNDQuOTQ4LTQ0Ljk0NWMwLTAuNjg0LTAuMDE2LTEuMzY3LTAuMDQ2LTIuMDQ2XHJcblx0XHRcdFx0XHRcdEM4My43MDQsMzIuMDcxLDg2LjM4MywyOS4yODgsODguNSwyNi4xMnpcIi8+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0ey8qU3RlYW0gLSBGcm9tIEZvdW5kYXRpb24gSWNvbnMgYnkgWnVyYiBNSVQgTGljZW5jZSovfVxyXG5cdFx0XHRcdDxhIGhyZWY9Jy8vc3RlYW1jb21tdW5pdHkuY29tL2lkL2Zvb21hbic+XHJcblx0XHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiXHJcblx0XHRcdFx0XHRcdCB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDEwMCAxMDBcIj5cclxuXHRcdFx0XHRcdDxwYXRoIGlkPVwiR2VhcnNcIiBkPVwiTTkyLjQzLDQwLjkzNWMwLDMuODg5LTMuMTU1LDcuMDM5LTcuMDQxLDcuMDM5Yy0zLjg4NiwwLTcuMDM5LTMuMTUtNy4wMzktNy4wMzlcclxuXHRcdFx0XHRcdFx0YzAtMy44ODMsMy4xNTMtNy4wMzksNy4wMzktNy4wMzlDODkuMjc1LDMzLjg5NSw5Mi40MywzNy4wNTIsOTIuNDMsNDAuOTM1eiBNODUuMzU0LDI3LjgzMWMtNy4yMTgsMC0xMy4wOCw1LjgyMi0xMy4xNDUsMTMuMDI1XHJcblx0XHRcdFx0XHRcdGwtOC4xOSwxMS43MzZjLTAuMzMzLTAuMDM1LTAuNjcyLTAuMDU1LTEuMDE2LTAuMDU1Yy0xLjgyOSwwLTMuNTM5LDAuNTA0LTUuMDA4LDEuMzgxTDIwLjkwMSwzOS4wMDFcclxuXHRcdFx0XHRcdFx0Yy0wLjk3LTQuNC00LjkwMy03LjcxOS05LjU4Ni03LjcxOWMtNS40MDYsMC05LjgxNSw0LjQyNC05LjgxNSw5LjgyOGMwLDUuNDEsNC40MDksOS44MTYsOS44MTUsOS44MTZcclxuXHRcdFx0XHRcdFx0YzEuODMsMCwzLjU0MS0wLjUwNCw1LjAwOS0xLjM3OWwzNy4wOTQsMTQuODg5YzAuOTU5LDQuNDEyLDQuODkzLDcuNzMzLDkuNTg0LDcuNzMzYzUuMDgzLDAsOS4yNzUtMy44OTYsOS43NjItOC44NThsMTIuNTg5LTkuMjAxXHJcblx0XHRcdFx0XHRcdGM3LjI1OCwwLDEzLjE0Ni01Ljg3NywxMy4xNDYtMTMuMTM1UzkyLjYxMiwyNy44MzEsODUuMzU0LDI3LjgzMXogTTg1LjM1NCwzMi4xNjNjNC44NjMsMCw4LjgxMywzLjk1MSw4LjgxMyw4LjgxMlxyXG5cdFx0XHRcdFx0XHRjMCw0Ljg2My0zLjk1MSw4LjgwMS04LjgxMyw4LjgwMWMtNC44NjEsMC04LjgxMy0zLjkzOC04LjgxMy04LjgwMUM3Ni41NDEsMzYuMTE0LDgwLjQ5MywzMi4xNjMsODUuMzU0LDMyLjE2M3ogTTExLjMxNSwzMy44ODJcclxuXHRcdFx0XHRcdFx0YzIuNzczLDAsNS4xNjYsMS41NDksNi4zNzcsMy44MzJsLTMuNTg4LTEuNDM2djAuMDE2Yy0yLjg5MS0xLjA0MS02LjEwMiwwLjM3NS03LjI1NiwzLjI0OGMtMS4xNTYsMi44NzMsMC4xNzQsNi4xMjcsMi45NzgsNy4zNzlcclxuXHRcdFx0XHRcdFx0djAuMDE0bDMuMDQ2LDEuMjE1Yy0wLjUwMSwwLjExMS0xLjAyMywwLjE3OC0xLjU1NywwLjE3OGMtMy45OTksMC03LjIxNS0zLjIxNy03LjIxNS03LjIxN0M0LjEsMzcuMTEyLDcuMzE1LDMzLjg4MiwxMS4zMTUsMzMuODgyelxyXG5cdFx0XHRcdFx0XHQgTTYzLjAwMiw1NS4xMzZjNC4wMDEsMCw3LjIxNiwzLjIxNyw3LjIxNiw3LjIxN2MwLDMuOTk4LTMuMjE1LDcuMjE1LTcuMjE2LDcuMjE1Yy0yLjc4MSwwLTUuMTg0LTEuNTUxLTYuMzg5LTMuODQ0XHJcblx0XHRcdFx0XHRcdGMxLjE4NywwLjQ4LDIuMzc1LDAuOTUzLDMuNTYsMS40MzZjMi45NDEsMS4xODIsNi4yOTItMC4yNDIsNy40NzMtMy4xODJjMS4xODMtMi45NDEtMC4yNTQtNi4yNzUtMy4xOTYtNy40NTlsLTMuMDA0LTEuMjA1XHJcblx0XHRcdFx0XHRcdEM2MS45NDcsNTUuMjA2LDYyLjQ2OSw1NS4xMzYsNjMuMDAyLDU1LjEzNnpcIi8+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHQ8L2Zvb3Rlcj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9vdGVyOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucy5qcycpO1xyXG52YXIgQXBwU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvQXBwU3RvcmUuanMnKTtcclxuXHJcbnZhciBOYXZiYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHByb3BUeXBlczp7XHJcblx0XHRtb2JpbGU6UmVhY3QuUHJvcFR5cGVzLmJvb2xcclxuXHR9LFxyXG5cclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0b3JlLmdldFNldHRpbmdzKCkpO1xyXG5cdH0sXHJcblxyXG5cdF9idXlJdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGl0ZW0gPSBkM3NpbS5rYWRhbGFSb2xsKHRoaXMuc3RhdGUuaXRlbS50eXBlKTtcclxuXHRcdGl0ZW0uc2l6ZSA9IHRoaXMuc3RhdGUuaXRlbS5zaXplO1xyXG5cdFx0QXBwQWN0aW9ucy5hZGRJdGVtKGl0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5pbmNyZW1lbnRTaGFyZHModGhpcy5zdGF0ZS5pdGVtLnR5cGUsdGhpcy5zdGF0ZS5pdGVtLmNvc3QpO1xyXG5cdH0sXHJcblx0X3RvZ2dsZU9wdGlvbnM6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBBY3Rpb25zLnRvZ2dsZU9wdGlvbnMoKTtcclxuXHR9LFxyXG5cdF90b2dnbGVTdG9yZTpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMudG9nZ2xlU3RvcmUoKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4oXHJcblx0XHRcdDxuYXY+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2hhbScgb25DbGljaz17dGhpcy5fdG9nZ2xlT3B0aW9uc30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0zIDE4aDE4di0ySDN2MnptMC01aDE4di0ySDN2MnptMC03djJoMThWNkgzelwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdDxoMT48YSBocmVmPScva2FkYWxhLyc+S2FkYWxhIFNpbXVsYXRvcjwvYT48L2gxPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdidXknIG9uQ2xpY2s9e3RoaXMuX2J1eUl0ZW19Pnt0aGlzLnN0YXRlLml0ZW0udGV4dH08L2J1dHRvbj5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT0nc2hvcCcgb25DbGljaz17dGhpcy5fdG9nZ2xlU3RvcmV9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMTYgNlY0YzAtMS4xMS0uODktMi0yLTJoLTRjLTEuMTEgMC0yIC44OS0yIDJ2MkgydjEzYzAgMS4xMS44OSAyIDIgMmgxNmMxLjExIDAgMi0uODkgMi0yVjZoLTZ6bS02LTJoNHYyaC00VjR6TTkgMThWOWw3LjUgNEw5IDE4elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L25hdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEFybW9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRwcm9wVHlwZXM6e1xyXG5cdFx0YXJtb3I6UmVhY3QuUHJvcFR5cGVzLm51bWJlclxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS1hcm1vci1hcm1vclwiPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJiaWdcIj48cD48c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLmFybW9yfTwvc3Bhbj48L3A+PC9saT5cclxuXHRcdFx0XHQ8bGk+QXJtb3I8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwQXJtb3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwQXJtb3IgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtYXJtb3IuanN4Jyk7XHJcbnZhciBEM0l0ZW1Ub29sdGlwU3RhdCA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC1zdGF0LmpzeCcpO1xyXG52YXIgRDNJdGVtVG9vbHRpcFdlYXBvbiA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC13ZWFwb24uanN4Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEJvZHkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHByb3BUeXBlczp7XHJcblx0XHRpdGVtOlJlYWN0LlByb3BUeXBlcy5vYmplY3RcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBpY29uQ2xhc3NlcyA9ICdkMy1pY29uIGQzLWljb24taXRlbSBkMy1pY29uLWl0ZW0tbGFyZ2UnO1xyXG5cdFx0dmFyIGl0ZW1UeXBlQ2xhc3MgPSdkMy1jb2xvci0nOyBcclxuXHJcblx0XHQvL2RlY2xhcmUgYXJyYXlzIGZvciBwcmltYXJ5IGFuZCBzZWNvbmRhcnkgaXRlbSBlZmZlY3RzLiBcclxuXHRcdC8vQW4gaXRlbSBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIG9mIGVhY2guXHJcblx0XHQvL0NyZWF0ZSB0aGUgbGlzdCBpdGVtIGZvciBlYWNoIHN0YXQgYW5kIHB1c2ggaW4gdGhlIGFycmF5c1xyXG5cdFx0dmFyIHByaW1hcmllcyA9IGZvckVhY2godGhpcy5wcm9wcy5pdGVtLnByaW1hcmllcyk7XHJcblx0XHR2YXIgc2Vjb25kYXJpZXMgPSBmb3JFYWNoKHRoaXMucHJvcHMuaXRlbS5zZWNvbmRhcmllcyk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZm9yRWFjaChzdGF0T2JqZWN0KSB7XHJcblx0XHRcdHZhciByZXN1bHRzID0gW107XHJcblx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3RhdE9iamVjdCk7XHJcblx0XHRcdHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKyspIHtcclxuXHRcdFx0XHR2YXIgc3RhdCA9IGtleXNbaV07XHJcblx0XHRcdFx0dmFyIHZhbCA9IHN0YXRPYmplY3Rbc3RhdF07XHJcblx0XHRcdFx0cmVzdWx0cy5wdXNoKDxEM0l0ZW1Ub29sdGlwU3RhdCBzdGF0PXt2YWx9IGtleT17aX0gLz4pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByZXN1bHRzO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vaW1hZ2UgdXNlZCBhcyBpbmxpbmUtc3R5bGUgZm9yIGl0ZW0gdG9vbHRpcHNcclxuXHRcdHZhciBpbWFnZSA9IHtiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK3RoaXMucHJvcHMuaXRlbS5pbWFnZSsnKSd9O1xyXG5cclxuXHRcdC8vaWYgc3BlY2lmaWVkLCBzZXQgY29sb3IgZm9yIHRvb2x0aXAgY29tcG9uZW50c1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5jb2xvcikge1xyXG5cdFx0XHRpY29uQ2xhc3NlcyArPSAnIGQzLWljb24taXRlbS0nK3RoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdFx0aXRlbVR5cGVDbGFzcyArPXRoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdH1cclxuXHJcblx0XHQvL2lmIGl0IGlzIGFuIGFybW9yIG9yIHdlYXBvbiBhZGQgYWRkaXRpb25hbCBpbmZvIHRvIGljb24gc2VjdGlvblxyXG5cdFx0dmFyIHN1YkhlYWQ7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdhcm1vcicpKSB7XHJcblx0XHRcdHN1YkhlYWQgPSA8RDNJdGVtVG9vbHRpcEFybW9yIGFybW9yPXt0aGlzLnByb3BzLml0ZW0uYXJtb3J9Lz47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCd3ZWFwb25EcHMnKSkge1xyXG5cdFx0XHRzdWJIZWFkID0gPEQzSXRlbVRvb2x0aXBXZWFwb24gXHJcblx0XHRcdFx0ZGFtYWdlUmFuZ2U9e3RoaXMucHJvcHMuaXRlbS5kYW1hZ2VSYW5nZX1cclxuXHRcdFx0XHRzcGVlZD17dGhpcy5wcm9wcy5pdGVtLnNwZWVkfSBcclxuXHRcdFx0XHR3ZWFwb25EcHM9e3RoaXMucHJvcHMuaXRlbS53ZWFwb25EcHN9XHJcblx0XHRcdFx0Lz47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9pZiBzb2NrZXRzIGFyZSBuZWVkZWRcclxuXHRcdHZhciBzb2NrZXRzID0gW107XHJcblx0XHR2YXIgc29ja2V0S2V5ID0gMDtcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0ucHJpbWFyaWVzLmhhc093blByb3BlcnR5KCdTb2NrZXQnKSkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0wOyBpIDwgdGhpcy5wcm9wcy5pdGVtLnByaW1hcmllcy5Tb2NrZXQudmFsdWU7IGkrKykge1xyXG5cdFx0XHRcdHNvY2tldHMucHVzaCg8bGkgY2xhc3NOYW1lPSdlbXB0eS1zb2NrZXQgZDMtY29sb3ItYmx1ZScga2V5PXtzb2NrZXRLZXl9ID5FbXB0eSBTb2NrZXQ8L2xpPik7XHJcblx0XHRcdFx0c29ja2V0S2V5Kys7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvL2RldGVybWluZSB0aGUgd29yZCB0byBwdXQgbmV4dCB0byBpdGVtIHR5cGVcclxuXHRcdHZhciBpdGVtVHlwZVByZWZpeDtcclxuXHRcdC8vY2hlY2sgaWYgYW5jaWVudCBzZXQgaXRlbSBhbmQgbWFudWFsbHkgcHV0XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLnJhcml0eSA9PT0gJ2FuY2llbnQnICYmIHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykpIHtcclxuXHRcdFx0aXRlbVR5cGVQcmVmaXggPSAnQW5jaWVudCBTZXQnO1xyXG5cdFx0fVxyXG5cdFx0Ly9vdGhlcndpc2UgaXQgaXMgc2V0L2EgcmFyaXR5IG9ubHlcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpdGVtVHlwZVByZWZpeCA9ICh0aGlzLnByb3BzLml0ZW0uaGFzT3duUHJvcGVydHkoJ3NldCcpKSA/ICdzZXQnIDogdGhpcy5wcm9wcy5pdGVtLnJhcml0eTtcclxuXHRcdFx0Ly9jYXBpdGFsaXplIGZpcnN0IGxldHRlclxyXG5cdFx0XHRpdGVtVHlwZVByZWZpeCA9IGl0ZW1UeXBlUHJlZml4LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaXRlbVR5cGVQcmVmaXguc2xpY2UoMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ0b29sdGlwLWJvZHkgZWZmZWN0LWJnIGVmZmVjdC1iZy1hcm1vciBlZmZlY3QtYmctYXJtb3ItZGVmYXVsdFwiPlxyXG5cclxuXHRcdFx0XHR7LypUaGUgaXRlbSBpY29uIGFuZCBjb250YWluZXIsIGNvbG9yIG5lZWRlZCBmb3IgYmFja2dyb3VuZCovfVxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT17aWNvbkNsYXNzZXN9PlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1pdGVtLWdyYWRpZW50XCI+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImljb24taXRlbS1pbm5lciBpY29uLWl0ZW0tZGVmYXVsdFwiIHN0eWxlPXtpbWFnZX0+XHJcblx0XHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHQ8L3NwYW4+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZDMtaXRlbS1wcm9wZXJ0aWVzXCI+XHJcblxyXG5cdFx0XHRcdFx0ey8qU2xvdCBhbmQgaWYgY2xhc3Mgc3BlY2lmaWMqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLXR5cGUtcmlnaHRcIj5cclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiaXRlbS1zbG90XCI+e3RoaXMucHJvcHMuaXRlbS5zbG90LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5wcm9wcy5pdGVtLnNsb3Quc2xpY2UoMSl9PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiaXRlbS1jbGFzcy1zcGVjaWZpYyBkMy1jb2xvci13aGl0ZVwiPnt0aGlzLnByb3BzLml0ZW0uY2xhc3NTcGVjaWZpY308L2xpPlxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHJcblx0XHRcdFx0XHR7LypSYXJpdHkgb2YgdGhlIGl0ZW0gYW5kL2lmIGl0IGlzIGFuY2llbnQqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLXR5cGVcIj5cclxuXHRcdFx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT17aXRlbVR5cGVDbGFzc30+e2l0ZW1UeXBlUHJlZml4fSB7dGhpcy5wcm9wcy5pdGVtLnR5cGV9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHJcblx0XHRcdFx0XHR7LypJZiB0aGUgaXRlbSBpcyBhcm1vciBvciB3ZWFwb24sIHRoZSBrZXkgaXMgZGVmaW5lZCBhbmQgd2UgbmVlZCBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSB0b29sdGlwKi99XHJcblx0XHRcdFx0XHR7c3ViSGVhZH1cclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIml0ZW0tYmVmb3JlLWVmZmVjdHNcIj48L2Rpdj5cclxuXHJcblx0XHRcdFx0XHR7LypBY3R1YWwgaXRlbSBzdGF0cyovfVxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tZWZmZWN0c1wiPlxyXG5cdFx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJpdGVtLXByb3BlcnR5LWNhdGVnb3J5XCI+UHJpbWFyeTwvcD5cclxuXHRcdFx0XHRcdFx0e3ByaW1hcmllc31cclxuXHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwiaXRlbS1wcm9wZXJ0eS1jYXRlZ29yeVwiPlNlY29uZGFyeTwvcD5cclxuXHRcdFx0XHRcdFx0e3NlY29uZGFyaWVzfVxyXG5cdFx0XHRcdFx0XHR7c29ja2V0c31cclxuXHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwQm9keTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBGbGF2b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHByb3BUeXBlczp7XHJcblx0XHRmbGF2b3I6UmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSd0b29sdGlwLWV4dGVuc2lvbic+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZsYXZvcic+e3RoaXMucHJvcHMuZmxhdm9yfTwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEZsYXZvcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBIZWFkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRwcm9wVHlwZXM6e1xyXG5cdFx0Y29sb3I6UmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHRcdG5hbWU6UmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vaW5pdGlhbCBjbGFzcyBzZXQgZm9yIHRoZSB0b29sdGlwIGhlYWRcclxuXHRcdHZhciBkaXZDbGFzcz0ndG9vbHRpcC1oZWFkJztcclxuXHRcdHZhciBoM0NsYXNzPScnO1xyXG5cclxuXHRcdC8vbW9kaWZ5IHRoZSBjbGFzc2VzIGlmIGEgY29sb3Igd2FzIHBhc3NlZFxyXG5cdFx0Ly9mYWxsYmFjayBjb2xvciBpcyBoYW5kbGVkIGJ5IGQzLXRvb2x0aXAgY3NzXHJcblx0XHRpZiAodGhpcy5wcm9wcy5jb2xvcikge1xyXG5cdFx0XHRkaXZDbGFzcyArPSAnIHRvb2x0aXAtaGVhZC0nICsgdGhpcy5wcm9wcy5jb2xvcjtcclxuXHRcdFx0aDNDbGFzcyArPSAnZDMtY29sb3ItJyArIHRoaXMucHJvcHMuY29sb3I7XHJcblx0XHR9XHJcblx0XHQvL21ha2UgdGhlIGZvbnQgc21hbGxlciBpZiB0aGUgbmFtZSBpcyBsb25nXHJcblx0XHRpZiAodGhpcy5wcm9wcy5uYW1lLmxlbmd0aCA+IDQwKSB7XHJcblx0XHRcdGgzQ2xhc3MrPSAnIHNtYWxsZXN0JztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYodGhpcy5wcm9wcy5uYW1lLmxlbmd0aCA+MjIpIHtcclxuXHRcdFx0aDNDbGFzcys9ICcgc21hbGxlcic7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2RpdkNsYXNzfT5cclxuXHRcdFx0XHQ8aDMgY2xhc3NOYW1lPXtoM0NsYXNzfT5cclxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLm5hbWV9XHJcblx0XHRcdFx0PC9oMz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBIZWFkOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcFN0YXQ9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cHJvcFR5cGVzOntcclxuXHRcdHN0YXQ6UmVhY3QuUHJvcFR5cGVzLm9iamVjdFxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHRleHQgPSBbXTtcclxuXHRcdHZhciB0ZXh0S2V5ID0gMDtcclxuXHRcdC8vY2hlY2sgdG8gbWFrZSBzdXJlIHRlbXBsYXRlIG5lZWRzIHRvIGJlIHdvcmtlZCB3aXRoIFxyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLnN0YXQudGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dmFyIHRlbXBsYXRlID0gdGhpcy5wcm9wcy5zdGF0LnRleHQ7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZS5pbmRleE9mKCd7JykgIT09IC0xKSB7XHJcblxyXG5cdFx0XHRcdC8vZGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgaGlnaGxpZ2h0ZWQgaXRlbXMgdGhlIHRvb2x0aXAgd2lsbCBoYXZlXHJcblx0XHRcdFx0dmFyIHBvc2l0aW9uID0gdGVtcGxhdGUuaW5kZXhPZigneycpO1xyXG5cdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0d2hpbGUgKHBvc2l0aW9uICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0Y291bnQrK1xyXG5cdFx0XHRcdFx0cG9zaXRpb24gPSB0ZW1wbGF0ZS5pbmRleE9mKCd7JywgcG9zaXRpb24rMSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgc3RhcnRQb3MgPSAwO1xyXG5cdFx0XHRcdHZhciBlbmRQb3MgPSAwO1xyXG5cdFx0XHRcdC8vbG9vcCB0aHJvdWdoIHRoaXMgY291bnQgb2YgdGVtcGxhdGluZ1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPTA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgc3RhcnRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ3snLHN0YXJ0UG9zKSsxO1xyXG5cdFx0XHRcdFx0c3RhcnRQb3MgPSBzdGFydEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZEluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZignfScsZW5kUG9zKTtcclxuXHRcdFx0XHRcdGVuZFBvcyA9IGVuZEluZGV4KzE7XHJcblx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2Uoc3RhcnRJbmRleCxlbmRJbmRleCk7XHJcblxyXG5cdFx0XHRcdFx0Ly9jaGVjayBmb3IgYW55IHJlcGxhY2VtZW50IG5lZWRlZFxyXG5cdFx0XHRcdFx0aWYgKHNsaWNlZC5pbmRleE9mKCckJykgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuc3RhdC52YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRzbGljZWQgPSBzbGljZWQucmVwbGFjZSgnJCcsIHRoaXMucHJvcHMuc3RhdC52YWx1ZVtpXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0c2xpY2VkID0gc2xpY2VkLnJlcGxhY2UoJyQnLHRoaXMucHJvcHMuc3RhdC52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvL2lmIHdlIGFyZSBhdCB0aGUgZmlyc3QgbG9vcCwgYWRkIGFueXRoaW5nIGZpcnN0IGFzIHRleHRcclxuXHRcdFx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaCh0ZW1wbGF0ZS5zcGxpdCgneycpWzBdKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvL2NyZWF0ZSBhbmQgcHVzaCB0aGUgdmFsdWUgaGlnaGxpZ2h0ZWQgZWxlbWVudFxyXG5cdFx0XHRcdFx0dmFyIGVsZW1lbnQgPSA8c3BhbiBjbGFzc05hbWU9J3ZhbHVlJyBrZXk9e3RleHRLZXl9PntzbGljZWR9PC9zcGFuPjtcclxuXHRcdFx0XHRcdHRleHRLZXkrKztcclxuXHRcdFx0XHRcdHRleHQucHVzaChlbGVtZW50KTtcclxuXHJcblx0XHRcdFx0XHQvL2lmIG5vdCB0aGUgbGFzdCBsb29wLCBwdXNoIGFueXRoaW5nIHVudGlsIG5leHQgYnJhY2tldFxyXG5cdFx0XHRcdFx0aWYgKGNvdW50ICE9PSAxICYmIGkgPCBjb3VudCAtIDEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG5leHRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ3snLCBzdGFydFBvcyk7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCBuZXh0SW5kZXgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYoY291bnQgPT09IDEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHNsaWNlZCA9IHRlbXBsYXRlLnNsaWNlKGVuZEluZGV4KzEsIHRlbXBsYXRlLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaChzbGljZWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9sYXN0IGxvb3AgcHVzaCB0byB0aGUgZW5kXHJcblx0XHRcdFx0XHRlbHNlIGlmKGkgPT09IGNvdW50LTEgJiYgY291bnQgPiAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCB0ZW1wbGF0ZS5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9ubyB0ZW1wbGF0ZSBhbmQgd2UganVzdCB0aHJvdyBhZmZpeCB1cFxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0ZXh0LnB1c2godGhpcy5wcm9wcy5zdGF0LnRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9kZXRlcm1pbmUgY29sb3Igb2YgYWZmaXggdGV4dFxyXG5cdFx0dmFyIHRleHRDb2xvciA9ICdkMy1pdGVtLXByb3BlcnR5LWRlZmF1bHQnO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc3RhdC5oYXNPd25Qcm9wZXJ0eSgndHlwZScpICYmIHRoaXMucHJvcHMuc3RhdC50eXBlID09PSAnbGVnZW5kYXJ5Jykge1xyXG5cdFx0XHR0ZXh0Q29sb3IgKz0gJyBkMy1jb2xvci1vcmFuZ2UnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRleHRDb2xvciArPSAnIGQzLWNvbG9yLWJsdWUnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxsaSBjbGFzc05hbWU9e3RleHRDb2xvcn0+XHJcblx0XHRcdFx0PHA+e3RleHR9PC9wPlxyXG5cdFx0XHQ8L2xpPlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwU3RhdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBXZWFwb249IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cHJvcFR5cGVzOntcclxuXHRcdGRhbWFnZVJhbmdlOlJlYWN0LlByb3BUeXBlcy5hcnJheSxcclxuXHRcdHNwZWVkOlJlYWN0LlByb3BUeXBlcy5udW1iZXIsXHJcblx0XHR3ZWFwb25EcHM6UmVhY3QuUHJvcFR5cGVzLm51bWJlclxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2PlxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS13ZWFwb24tZHBzXCI+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cImJpZ1wiPjxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e01hdGgucm91bmQoIHRoaXMucHJvcHMud2VhcG9uRHBzICogMTAgKSAvIDEwfTwvc3Bhbj48L2xpPlxyXG5cdFx0XHRcdDxsaT5EYW1hZ2UgUGVyIFNlY29uZDwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLWFybW9yLXdlYXBvbiBpdGVtLXdlYXBvbiBkYW1hZ2VcIj5cclxuXHRcdFx0XHQ8bGk+XHJcblx0XHRcdFx0XHQ8cD5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy5kYW1hZ2VSYW5nZVswXX08L3NwYW4+IC1cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj4ge3RoaXMucHJvcHMuZGFtYWdlUmFuZ2VbMV19PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJkMy1jb2xvci1GRjg4ODg4OFwiPiBEYW1hZ2U8L3NwYW4+XHJcblx0XHRcdFx0XHQ8L3A+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHQ8bGk+XHJcblx0XHRcdFx0XHQ8cD5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy5zcGVlZC50b0ZpeGVkKDIpfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZDMtY29sb3ItRkY4ODg4ODhcIj4gQXR0YWNrcyBwZXIgU2Vjb25kPC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9wPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwV2VhcG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEhlYWQgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtaGVhZC5qc3gnKTtcclxudmFyIEQzSXRlbVRvb2x0aXBCb2R5ID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWJvZHkuanN4Jyk7XHJcbnZhciBEM0l0ZW1Ub29sdGlwRmxhdm9yID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWZsYXZvci5qc3gnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRwcm9wVHlwZXM6e1xyXG5cdFx0aXRlbTpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgdG9vbHRpcENsYXNzID0nZDMtdG9vbHRpcCBkMy10b29sdGlwLWl0ZW0nO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5yYXJpdHkgPT09ICdhbmNpZW50Jykge1xyXG5cdFx0XHR0b29sdGlwQ2xhc3MrPScgYW5jaWVudCdcclxuXHRcdH1cclxuXHJcblx0XHQvL2RldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0byBhZGQgZmxhdm9yXHJcblx0XHR2YXIgZmxhdm9yO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnZmxhdm9yJykpIHtcclxuXHRcdFx0Zmxhdm9yID0gPEQzSXRlbVRvb2x0aXBGbGF2b3IgZmxhdm9yPXt0aGlzLnByb3BzLml0ZW0uZmxhdm9yfSAvPlxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSd0b29sdGlwLWNvbnRlbnQnPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0b29sdGlwQ2xhc3N9PlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXBIZWFkIGNvbG9yPXt0aGlzLnByb3BzLml0ZW0uY29sb3J9IG5hbWU9e3RoaXMucHJvcHMuaXRlbS5uYW1lfSAvPlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXBCb2R5IGl0ZW09e3RoaXMucHJvcHMuaXRlbX0gLz5cclxuXHRcdFx0XHRcdHtmbGF2b3J9XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcCA9IHJlcXVpcmUoJy4uL2QzLXRvb2x0aXAvZDMtdG9vbHRpcC5qc3gnKTtcclxudmFyIEludmVudG9yeVN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0ludmVudG9yeVN0b3JlJyk7XHJcbnZhciBJdGVtTGVmdCA9IHJlcXVpcmUoJy4vaXRlbS1sZWZ0LmpzeCcpO1xyXG52YXIgSXRlbVJpZ2h0ID0gcmVxdWlyZSgnLi9pdGVtLXJpZ2h0LmpzeCcpO1xyXG5cclxudmFyIEluZGl2aWR1YWxJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gSW52ZW50b3J5U3RvcmUuZ2V0SXRlbSgpO1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdF9vbkNoYW5nZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoSW52ZW50b3J5U3RvcmUuZ2V0SXRlbSgpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly9vbmx5IHNob3cgdG9vbHRpcHMvYnV0dG9ucyBpZiBhbiBpdGVtIGhhcyBhbHJlYWR5IGJlZW4gY3JlYXRlZFxyXG5cdFx0dmFyIHRvb2x0aXA7XHJcblx0XHR2YXIgaGlkZGVuQnV0dG9ucyA9ICdoaWRkZW4nO1xyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnN0YXRlLml0ZW0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHRvb2x0aXAgPSA8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1jb250YWluZXInPjxEM0l0ZW1Ub29sdGlwIGl0ZW09e3RoaXMuc3RhdGUuaXRlbX0vPjwvZGl2PjtcclxuXHRcdFx0aGlkZGVuQnV0dG9ucyA9ICcnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY29sLXhzLTEyIHRvb2x0aXAtb3ZlcmZsb3cnPlxyXG5cdFx0XHRcdFx0XHQ8SXRlbUxlZnQgaGlkZUNsYXNzPXtoaWRkZW5CdXR0b25zfSBoYXNQcmV2aW91cz17dGhpcy5zdGF0ZS5oYXNQcmV2aW91c30gLz5cclxuXHRcdFx0XHRcdFx0e3Rvb2x0aXB9XHJcblx0XHRcdFx0XHRcdDxJdGVtUmlnaHQgaGlkZUNsYXNzPXtoaWRkZW5CdXR0b25zfSBoYXNOZXh0PXt0aGlzLnN0YXRlLmhhc05leHR9IC8+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEluZGl2aWR1YWxJdGVtOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG5cclxudmFyIEl0ZW1MZWZ0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRwcm9wVHlwZXM6e1xyXG5cdFx0aGFzUHJldmlvdXM6UmVhY3QuUHJvcFR5cGVzLmJvb2wsXHJcblx0XHRoaWRlQ2xhc3M6UmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xyXG5cdH0sXHJcblxyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMucHJldmlvdXNJdGVtKCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBidXR0b25DbGFzcyA9ICdpbnZlbnRvcnktYnV0dG9uIHNoaWZ0IGxlZnQnO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc1ByZXZpb3VzKSB7XHJcblx0XHRcdGJ1dHRvbkNsYXNzKz0gJyBkaXNhYmxlZCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e3RoaXMucHJvcHMuaGlkZUNsYXNzfT5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuX2hhbmRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIzNlwiIGhlaWdodD1cIjM2XCIgdmlld0JveD1cIjAgMCAzNiAzNlwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTIzLjEyIDExLjEyTDIxIDlsLTkgOSA5IDkgMi4xMi0yLjEyTDE2LjI0IDE4elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSXRlbUxlZnQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgSXRlbVJpZ2h0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRwcm9wVHlwZXM6e1xyXG5cdFx0aGFzTmV4dDpSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcclxuXHRcdGhpZGVDbGFzczpSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXHJcblx0fSxcclxuXHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5uZXh0SXRlbSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbiBzaGlmdCByaWdodCc7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzTmV4dCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgZGlzYWJsZWQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmhpZGVDbGFzc30+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLl9oYW5kbGVDbGlja30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMzZcIiBoZWlnaHQ9XCIzNlwiIHZpZXdCb3g9XCIwIDAgMzYgMzZcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0xNSA5bC0yLjEyIDIuMTJMMTkuNzYgMThsLTYuODggNi44OEwxNSAyN2w5LTl6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJdGVtUmlnaHQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTbG90ID0gcmVxdWlyZSgnLi9pbnZlbnRvcnktc2xvdC5qc3gnKTtcclxudmFyIE5leHRJbnZlbnRvcnkgPSByZXF1aXJlKCcuL25leHQtaW52ZW50b3J5LmpzeCcpO1xyXG52YXIgUHJldmlvdXNJbnZlbnRvcnkgPSByZXF1aXJlKCcuL3ByZXZpb3VzLWludmVudG9yeS5qc3gnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHByb3BUeXBlczp7XHJcblx0XHRoYXNOZXh0OlJlYWN0LlByb3BUeXBlcy5ib29sLFxyXG5cdFx0aGFzUHJldmlvdXM6UmVhY3QuUHJvcFR5cGVzLmJvb2wsXHJcblx0XHRpbnZlbnRvcnk6UmVhY3QuUHJvcFR5cGVzLmFycmF5XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBpbnZlbnRvcnlTbG90cyA9IFtdO1xyXG5cdFx0dmFyIGtleT0wO1xyXG5cclxuXHRcdC8vbG9vcCB0aHJvdWdoIHRoZSAxMCBjb2x1bW5zIG9mIGludmVudG9yeVxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcblx0XHRcdHZhciBjb2x1bW5MZW5ndGggPSB0aGlzLnByb3BzLmludmVudG9yeVtpXS5sZW5ndGg7XHJcblxyXG5cdFx0XHQvL2EgY2hlY2sgZm9yIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhpcyBjb2x1bW5cclxuXHRcdFx0dmFyIGhlaWdodENvdW50ID0gMDtcclxuXHJcblx0XHRcdC8vYWRkIGFsbCBleGlzdGluZyBpdGVtcyB0byB0aGUgY29sdW1uc1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7IGogPCBjb2x1bW5MZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdGhlaWdodENvdW50ICs9IHRoaXMucHJvcHMuaW52ZW50b3J5W2ldW2pdLnNpemU7XHJcblx0XHRcdFx0XHRpbnZlbnRvcnlTbG90cy5wdXNoKDxJbnZlbnRvcnlTbG90IGRhdGE9e3RoaXMucHJvcHMuaW52ZW50b3J5W2ldW2pdfSBrZXk9e2tleX0gY29sdW1uPXtpfS8+KVxyXG5cdFx0XHRcdFx0a2V5Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL25vdyBmaWxsIGluIHRoZSByZXN0IG9mIHRoZSBjb2x1bW4gd2l0aCBibGFuayBzcGFjZXNcclxuXHRcdFx0d2hpbGUoaGVpZ2h0Q291bnQgPCA2KSB7XHJcblx0XHRcdFx0aGVpZ2h0Q291bnQrKztcclxuXHRcdFx0XHRpbnZlbnRvcnlTbG90cy5wdXNoKDxJbnZlbnRvcnlTbG90IGRhdGE9e3VuZGVmaW5lZH0ga2V5PXtrZXl9IGNvbHVtbj17aX0vPik7XHJcblx0XHRcdFx0a2V5Kys7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1jb250YWluZXInPlxyXG5cdFx0XHRcdDxQcmV2aW91c0ludmVudG9yeSBoYXNQcmV2aW91cz17dGhpcy5wcm9wcy5oYXNQcmV2aW91c30vPlxyXG5cdFx0XHRcdHtpbnZlbnRvcnlTbG90c31cclxuXHRcdFx0XHQ8TmV4dEludmVudG9yeSBoYXNOZXh0PXt0aGlzLnByb3BzLmhhc05leHR9Lz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeUNvbnRhaW5lciIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcCA9IHJlcXVpcmUoJy4uL2QzLXRvb2x0aXAvZDMtdG9vbHRpcC5qc3gnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTbG90ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGNvbXBvbmVudERpZE1vdW50OmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRUb29sdGlwT2Zmc2V0KCk7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRVcGRhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFRvb2x0aXBPZmZzZXQoKTtcclxuXHR9LFxyXG5cclxuXHRzZXRUb29sdGlwT2Zmc2V0OmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGVsZW0gPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzKTtcclxuXHJcblx0XHQvL2lmIHRoZSBpbnZlbnRvcnkgc2xvdCBoYXMgY2hpbGRyZW4gKGNvbnRlbnQpXHJcblx0XHRpZiAoZWxlbS5jaGlsZHJlbiAmJiBlbGVtLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0dmFyIGVsZW1Mb2NhdGlvbiA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG5cdFx0XHR2YXIgdG9vbHRpcEhlaWdodCA9IGVsZW0uY2hpbGRyZW5bNF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG5cdFx0XHR2YXIgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuXHRcdFx0Ly9jaGVjayBpZiB0aGUgdG9vbHRpcCBmaXRzIHdoZXJlIGl0IGN1cnJlbnRseSBpc1xyXG5cdFx0XHRpZiAoISh0b29sdGlwSGVpZ2h0ICsgZWxlbUxvY2F0aW9uIDwgd2luZG93SGVpZ2h0KSkge1xyXG5cdFx0XHRcdHZhciBvZmZzZXQgPSAodG9vbHRpcEhlaWdodCArIGVsZW1Mb2NhdGlvbiAtIHdpbmRvd0hlaWdodCk7XHJcblxyXG5cdFx0XHRcdC8vaWYgdGhlIHRvb2x0aXAgaXMgYmlnZ2VyIHRoYW4gd2luZG93LCBqdXN0IHNob3cgYXQgdG9wIG9mIHdpbmRvd1xyXG5cdFx0XHRcdGlmIChvZmZzZXQgPiB3aW5kb3dIZWlnaHQpIHtcclxuXHRcdFx0XHRcdGVsZW0uY2hpbGRyZW5bNF0uc3R5bGUudG9wID0gJy0nKyhlbGVtTG9jYXRpb24tMjApKydweCc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9qdXN0IG1vdmUgaXQgdXAgYSBsaXR0bGUgd2l0aCBhIGJpdCBhdCBib3R0b21cclxuXHRcdFx0XHRcdGVsZW0uY2hpbGRyZW5bNF0uc3R5bGUudG9wID0gJy0nKyhvZmZzZXQrMTApKydweCc7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2xvdENvbnRlbnQ9IFtdO1xyXG5cdFx0dmFyIHNsb3RDb250ZW50S2V5ID0gMDtcclxuXHJcblx0XHR2YXIgc2xvdENsYXNzPSdpbnZlbnRvcnktc2xvdCc7XHJcblx0XHQvL2NoZWNrIHRvIG1ha2Ugc3VyZSBhbiBhY3R1YWwgaXRlbSBpcyBpbiB0aGUgaW52ZW50b3J5IHNsb3RcclxuXHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5kYXRhICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHQvL2NoYW5nZSB0aGUgc2l6ZSB0byBsYXJnZSBpZiBpdCBpcyBhIGxhcmdlIGl0ZW1cclxuXHRcdFx0aWYodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdzaXplJykgJiYgdGhpcy5wcm9wcy5kYXRhLnNpemUgPT09IDIpIHtcclxuXHRcdFx0XHRzbG90Q2xhc3MgKz0gJyBsYXJnZSc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgncmFyaXR5JykpIHtcclxuXHRcdFx0XHR2YXIgYmd1cmw7XHJcblx0XHRcdFx0dmFyIGJvcmRlckNvbG9yPScjMzAyYTIxJztcclxuXHJcblx0XHRcdFx0c3dpdGNoKHRoaXMucHJvcHMuZGF0YS5yYXJpdHkpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ21hZ2ljJzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9Jy8vdXMuYmF0dGxlLm5ldC9kMy9zdGF0aWMvaW1hZ2VzL2l0ZW0vaWNvbi1iZ3MvYmx1ZS5wbmcnO1xyXG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcj0nIzc5NzlkNCc7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAncmFyZSc6XHJcblx0XHRcdFx0XHRcdGJndXJsPScvL3VzLmJhdHRsZS5uZXQvZDMvc3RhdGljL2ltYWdlcy9pdGVtL2ljb24tYmdzL3llbGxvdy5wbmcnO1xyXG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcj0nI2Y4Y2MzNSc7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnbGVnZW5kYXJ5JzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9Jy8vdXMuYmF0dGxlLm5ldC9kMy9zdGF0aWMvaW1hZ2VzL2l0ZW0vaWNvbi1iZ3Mvb3JhbmdlLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjYmY2NDJmJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdhbmNpZW50JzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9Jy8vdXMuYmF0dGxlLm5ldC9kMy9zdGF0aWMvaW1hZ2VzL2l0ZW0vaWNvbi1iZ3Mvb3JhbmdlLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjYmY2NDJmJztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHQvL25vb3BcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vc3dpdGNoIGJnIHRvIGdyZWVuIGlmIGl0ZW0gaXMgcGFydCBvZiBhIHNldFxyXG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3NldCcpKSB7XHJcblx0XHRcdFx0XHRiZ3VybD0nLy91cy5iYXR0bGUubmV0L2QzL3N0YXRpYy9pbWFnZXMvaXRlbS9pY29uLWJncy9ncmVlbi5wbmcnO1xyXG5cdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyM4YmQ0NDInO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBiZ3VybCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdHZhciBpbmxpbmUgPSB7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmRJbWFnZTondXJsKCcrYmd1cmwrJyknXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0c2xvdENvbnRlbnQucHVzaCg8ZGl2IHN0eWxlPXtpbmxpbmV9IGNsYXNzTmFtZT0naW52ZW50b3J5LWJnJyBrZXk9e3Nsb3RDb250ZW50S2V5fT48L2Rpdj4pXHJcblx0XHRcdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9zZXQgdGhlIGl0ZW0gaW1hZ2VcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnaW1hZ2UnKSkge1xyXG5cdFx0XHRcdHZhciBpbmxpbmUgPSB7YmFja2dyb3VuZEltYWdlOid1cmwoJyt0aGlzLnByb3BzLmRhdGEuaW1hZ2UrJyknfTtcclxuXHRcdFx0XHRzbG90Q29udGVudC5wdXNoKDxkaXYgc3R5bGU9e2lubGluZX0gY2xhc3NOYW1lPSdpbnZlbnRvcnktaW1hZ2UnIGtleT17c2xvdENvbnRlbnRLZXl9PjwvZGl2Pik7XHJcblx0XHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9hZGQgYSBsaW5rIHRvIGFjdGl2YXRlIHRvb2x0aXBcclxuXHRcdFx0c2xvdENvbnRlbnQucHVzaCg8YSBjbGFzc05hbWU9J3Rvb2x0aXAtbGluaycga2V5PXtzbG90Q29udGVudEtleX0+PC9hPik7XHJcblx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblxyXG5cdFx0XHQvL2FkZCBhIGdyYWRpZW50IG1hc2tcclxuXHRcdFx0c2xvdENvbnRlbnQucHVzaCg8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWl0ZW0tZ3JhZGllbnQnIGtleT17c2xvdENvbnRlbnRLZXl9PjwvZGl2Pik7XHJcblx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblxyXG5cdFx0XHQvL2FkZCBhIGhpZGRlbiB0b29sdGlwXHJcblx0XHRcdHZhciBpbmxpbmU7XHJcblx0XHRcdGlmICh0aGlzLnByb3BzLmNvbHVtbiA8IDUpIHtcclxuXHRcdFx0XHRpbmxpbmUgPSB7bGVmdDonNTBweCd9O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGlubGluZSA9IHtyaWdodDonNTBweCd9O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzbG90Q29udGVudC5wdXNoKFxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSd0b29sdGlwLWNvbnRhaW5lcicgc3R5bGU9e2lubGluZX0ga2V5PXtzbG90Q29udGVudEtleX0+XHJcblx0XHRcdFx0XHQ8RDNJdGVtVG9vbHRpcCBpdGVtPXt0aGlzLnByb3BzLmRhdGF9Lz5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0KTtcclxuXHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHJcblx0XHRcdC8vYWRkIHNvY2tldHMgb24gaG92ZXJcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgncHJpbWFyaWVzJykgJiYgdGhpcy5wcm9wcy5kYXRhLnByaW1hcmllcy5oYXNPd25Qcm9wZXJ0eSgnU29ja2V0JykpIHtcclxuXHRcdFx0XHR2YXIgc29ja2V0cztcclxuXHRcdFx0XHR2YXIgc29ja2V0Q291bnQgPSB0aGlzLnByb3BzLmRhdGEucHJpbWFyaWVzLlNvY2tldC52YWx1ZTtcclxuXHRcdFx0XHR2YXIgc29ja2V0Q29udGVudHMgPSBbXTtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0wOyBpIDwgc29ja2V0Q291bnQ7IGkrKykge1xyXG5cdFx0XHRcdFx0c29ja2V0Q29udGVudHMucHVzaCg8ZGl2IGNsYXNzTmFtZT0nc29ja2V0JyBrZXk9e2l9PjwvZGl2Pik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNvY2tldHMgPSA8ZGl2IGNsYXNzTmFtZT0nc29ja2V0cy13cmFwcGVyJyBrZXk9e3Nsb3RDb250ZW50S2V5fT48ZGl2IGNsYXNzTmFtZT0nc29ja2V0cy1hbGlnbic+e3NvY2tldENvbnRlbnRzfTwvZGl2PjwvZGl2PjtcclxuXHRcdFx0XHRzbG90Q29udGVudC5wdXNoKHNvY2tldHMpO1xyXG5cdFx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e3Nsb3RDbGFzc30gc3R5bGU9e3tib3JkZXJDb2xvcjpib3JkZXJDb2xvcn19PlxyXG5cdFx0XHRcdHtzbG90Q29udGVudH1cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeVNsb3Q7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlDb250YWluZXIgPSByZXF1aXJlKCcuL2ludmVudG9yeS1jb250YWluZXIuanN4Jyk7XHJcbnZhciBJbnZlbnRvcnlTdG9yZSA9IHJlcXVpcmUoJy4uLy4uL3N0b3Jlcy9JbnZlbnRvcnlTdG9yZScpO1xyXG5cclxudmFyIEludmVudG9yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBJbnZlbnRvcnlTdG9yZS5nZXRJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEludmVudG9yeVN0b3JlLmdldEludmVudG9yeSgpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LXNlY3Rpb24nPlxyXG5cdFx0XHRcdDxJbnZlbnRvcnlDb250YWluZXIgXHJcblx0XHRcdFx0XHRpbnZlbnRvcnk9e3RoaXMuc3RhdGUuY3VycmVudEludmVudG9yeX0gXHJcblx0XHRcdFx0XHRoYXNQcmV2aW91cz17dHlwZW9mIHRoaXMuc3RhdGUucHJldmlvdXNJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnfSBcclxuXHRcdFx0XHRcdGhhc05leHQ9e3R5cGVvZiB0aGlzLnN0YXRlLm5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgTmV4dEludmVudG9yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cHJvcFR5cGVzOntcclxuXHRcdGhhc05leHQ6UmVhY3QuUHJvcFR5cGVzLmJvb2xcclxuXHR9LFxyXG5cclxuXHRfaGFuZGxlQ2xpY2s6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBBY3Rpb25zLm5leHRJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24nO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc05leHQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWJ1dHRvbi1jb250YWluZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMTUgOWwtMi4xMiAyLjEyTDE5Ljc2IDE4bC02Ljg4IDYuODhMMTUgMjdsOS05elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV4dEludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBQcmV2aW91c0ludmVudG9yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cHJvcFR5cGVzOntcclxuXHRcdGhhc1ByZXZpb3VzOlJlYWN0LlByb3BUeXBlcy5ib29sXHJcblx0fSxcclxuXHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5wcmV2aW91c0ludmVudG9yeSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbic7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzUHJldmlvdXMpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWJ1dHRvbi1jb250YWluZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMjMuMTIgMTEuMTJMMjEgOWwtOSA5IDkgOSAyLjEyLTIuMTJMMTYuMjQgMTh6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcmV2aW91c0ludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIENsYXNzU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHByb3BUeXBlczp7XHJcblx0XHRjaGFuZ2VDbGFzczpSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuXHRcdGdlbmRlcjpSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cdFx0bmFtZTpSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG5cdFx0c2VsZWN0ZWQ6UmVhY3QuUHJvcFR5cGVzLmJvb2xcclxuXHR9LFxyXG5cclxuXHRfaGFuZGxlQ2xpY2s6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnByb3BzLmNoYW5nZUNsYXNzKHRoaXMucHJvcHMubmFtZSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBzaG9ydGVuZWROYW1lcyA9IHtcclxuXHRcdFx0QmFyYmFyaWFuOidiYXJiJyxcclxuXHRcdFx0Q3J1c2FkZXI6J2NydXMnLFxyXG5cdFx0XHQnRGVtb24gSHVudGVyJzonZGgnLFxyXG5cdFx0XHRNb25rOidtb25rJyxcclxuXHRcdFx0J1dpdGNoIERvY3Rvcic6J3dkJyxcclxuXHRcdFx0V2l6YXJkOid3aXonXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2NsYXNzLXNlbGVjdG9yJztcclxuXHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdGVkKSB7XHJcblx0XHRcdGJ1dHRvbkNsYXNzKz0gJyBzZWxlY3RlZCdcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaW1hZ2VDbGFzcz0gdGhpcy5wcm9wcy5uYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnICcsJycpO1xyXG5cdFx0aW1hZ2VDbGFzcys9IHRoaXMucHJvcHMuZ2VuZGVyLnRvTG93ZXJDYXNlKCk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGxpPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2ltYWdlQ2xhc3N9PjwvZGl2PlxyXG5cdFx0XHRcdFx0PHNwYW4+e3RoaXMucHJvcHMubmFtZS50b0xvd2VyQ2FzZSgpfTwvc3Bhbj5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInNob3J0ZW5lZFwiPntzaG9ydGVuZWROYW1lc1t0aGlzLnByb3BzLm5hbWVdfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9saT5cclxuXHRcdCk7XHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzU2VsZWN0b3JCdXR0b247IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9jbGFzcy1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cHJvcFR5cGVzOntcclxuXHRcdGNoYW5nZUNsYXNzOlJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG5cdFx0Z2VuZGVyOlJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXHJcblx0XHRzZWxlY3RlZDpSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBkQ2xhc3NlcyA9IFsnQmFyYmFyaWFuJywnQ3J1c2FkZXInLCdEZW1vbiBIdW50ZXInLCdNb25rJywnV2l0Y2ggRG9jdG9yJywnV2l6YXJkJ107XHJcblx0XHR2YXIgZENsYXNzZXNMZW5ndGggPSBkQ2xhc3Nlcy5sZW5ndGg7XHJcblxyXG5cdFx0dmFyIGNsYXNzU2VsZWN0b3JzID0gW107XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwgZENsYXNzZXNMZW5ndGg7aSsrKSB7XHJcblxyXG5cdFx0XHQvL2NoZWNrIGZvciBzZWxlY3RlZCBjbGFzcyBzdG9yZWQgaW4gc3RhdGUgb2YgdGhpcyBjb21wb25lbnRcclxuXHRcdFx0dmFyIHNlbGVjdGVkID0gKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09IGRDbGFzc2VzW2ldKTtcclxuXHJcblx0XHRcdC8vcHV0IHNlbGVjdG9ycyBpbiBhcnJheSB0byBiZSByZW5kZXJlZFxyXG5cdFx0XHRjbGFzc1NlbGVjdG9ycy5wdXNoKFxyXG5cdFx0XHRcdDxDbGFzc1NlbGVjdG9yQnV0dG9uIFxyXG5cdFx0XHRcdFx0bmFtZT17ZENsYXNzZXNbaV19IFxyXG5cdFx0XHRcdFx0Y2hhbmdlQ2xhc3M9e3RoaXMucHJvcHMuY2hhbmdlQ2xhc3N9IFxyXG5cdFx0XHRcdFx0a2V5PXtpfSBcclxuXHRcdFx0XHRcdHNlbGVjdGVkPXtzZWxlY3RlZH1cclxuXHRcdFx0XHRcdGdlbmRlcj17dGhpcy5wcm9wcy5nZW5kZXJ9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdFx0PHVsIGNsYXNzTmFtZT0nY2xhc3Mtc2VsZWN0b3InPlxyXG5cdFx0XHRcdFx0e2NsYXNzU2VsZWN0b3JzfVxyXG5cdFx0XHRcdDwvdWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHByb3BUeXBlczp7XHJcblx0XHRjaGFuZ2VHZW5kZXI6UmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcblx0XHRnZW5kZXI6UmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcclxuXHRcdHNlbGVjdGVkOlJlYWN0LlByb3BUeXBlcy5ib29sXHJcblx0fSxcclxuXHJcblx0X3VwZGF0ZUdlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlR2VuZGVyKHRoaXMucHJvcHMuZ2VuZGVyKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzPSdnZW5kZXItc2VsZWN0b3IgJyt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYnV0dG9uLXdyYXBwZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5fdXBkYXRlR2VuZGVyfSA+XHJcblx0XHRcdFx0XHQ8ZGl2PjwvZGl2PlxyXG5cdFx0XHRcdFx0PHNwYW4+e3RoaXMucHJvcHMuZ2VuZGVyLnRvTG93ZXJDYXNlKCl9PC9zcGFuPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VuZGVyU2VsZWN0b3JCdXR0b247IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBHZW5kZXJTZWxlY3RvckJ1dHRvbiA9IHJlcXVpcmUoJy4vZ2VuZGVyLXNlbGVjdG9yLWJ1dHRvbi5qc3gnKTtcclxuXHJcbnZhciBHZW5kZXJTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cHJvcFR5cGVzOntcclxuXHRcdGNoYW5nZUdlbmRlcjpSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuXHRcdHNlbGVjdGVkOlJlYWN0LlByb3BUeXBlcy5zdHJpbmdcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIG1hbGVTZWxlY3RlZCA9ICh0aGlzLnByb3BzLnNlbGVjdGVkID09PSAnTWFsZScpO1xyXG5cdFx0dmFyIGZlbWFsZVNlbGVjdGVkID0gKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09ICdGZW1hbGUnKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZ2VuZGVyLXNlbGVjdG9yJz5cclxuXHRcdFx0XHQ8R2VuZGVyU2VsZWN0b3JCdXR0b24gZ2VuZGVyPSdNYWxlJyBjaGFuZ2VHZW5kZXI9e3RoaXMucHJvcHMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17bWFsZVNlbGVjdGVkfSAvPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvckJ1dHRvbiBnZW5kZXI9J0ZlbWFsZScgY2hhbmdlR2VuZGVyPXt0aGlzLnByb3BzLmNoYW5nZUdlbmRlcn0gc2VsZWN0ZWQ9e2ZlbWFsZVNlbGVjdGVkfSAvPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VuZGVyU2VsZWN0b3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBIYXJkY29yZUNoZWNrYm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRwcm9wVHlwZXM6e1xyXG5cdFx0Y2hhbmdlSGFyZGNvcmU6UmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcblx0XHRoYXJkY29yZTpSZWFjdC5Qcm9wVHlwZXMuYm9vbFxyXG5cdH0sXHJcblxyXG5cdF91cGRhdGVIYXJkY29yZTpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VIYXJkY29yZSghdGhpcy5wcm9wcy5oYXJkY29yZSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2NoZWNrYm94LXdyYXBwZXInPlxyXG5cdFx0XHRcdDxsYWJlbD5cclxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPSdjaGVja2JveCcgY2xhc3NOYW1lPSdvcHRpb25zLWNoZWNrYm94JyBjaGVja2VkPXt0aGlzLnByb3BzLmhhcmRjb3JlfSBvbkNoYW5nZT17dGhpcy5fdXBkYXRlSGFyZGNvcmV9Lz5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nY2hlY2tib3gtbGFiZWwnPkhhcmRjb3JlIDxzcGFuIGNsYXNzTmFtZT0naGlkZGVuLXNtJz5IZXJvPC9zcGFuPjwvc3Bhbj5cclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFyZGNvcmVDaGVja2JveDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMuanMnKTtcclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0FwcFN0b3JlLmpzJyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IHJlcXVpcmUoJy4vY2xhc3Mtc2VsZWN0b3IuanN4Jyk7XHJcbnZhciBHZW5kZXJTZWxlY3RvciA9IHJlcXVpcmUoJy4vZ2VuZGVyLXNlbGVjdG9yLmpzeCcpO1xyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IHJlcXVpcmUoJy4vc2Vhc29uYWwtY2hlY2tib3guanN4Jyk7XHJcbnZhciBIYXJkY29yZUNoZWNrYm94ID0gcmVxdWlyZSgnLi9oYXJkY29yZS1jaGVja2JveC5qc3gnKTtcclxuXHJcbnZhciBPcHRpb25zUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpbml0aWFsID0gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHRcdGQzc2ltLnNldEthZGFsYShpbml0aWFsLmRDbGFzcyxpbml0aWFsLnNlYXNvbmFsLGluaXRpYWwuaGFyZGNvcmUpO1xyXG5cdFx0cmV0dXJuIGluaXRpYWw7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShBcHBTdG9yZS5nZXRTZXR0aW5ncygpKTtcclxuXHR9LFxyXG5cclxuXHRjaGFuZ2VHZW5kZXI6ZnVuY3Rpb24oZ2VuZGVyKSB7XHJcblx0XHRBcHBBY3Rpb25zLmNoYW5nZVNldHRpbmcoJ2dlbmRlcicsZ2VuZGVyKTtcclxuXHR9LFxyXG5cdGNoYW5nZUNsYXNzOmZ1bmN0aW9uKGRDbGFzcykge1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdkQ2xhc3MnLGRDbGFzcyk7XHJcblx0fSxcclxuXHRjaGFuZ2VIYXJkY29yZTpmdW5jdGlvbihib29sKSB7XHJcblx0XHRBcHBBY3Rpb25zLmNoYW5nZVNldHRpbmcoJ2hhcmRjb3JlJyxib29sKTtcclxuXHR9LFxyXG5cdGNoYW5nZVNlYXNvbmFsOmZ1bmN0aW9uKGJvb2wpIHtcclxuXHRcdEFwcEFjdGlvbnMuY2hhbmdlU2V0dGluZygnc2Vhc29uYWwnLGJvb2wpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgb3B0c0NsYXNzID0gJ29wdGlvbnMtcGFuZWwnO1xyXG5cdFx0aWYgKHRoaXMuc3RhdGUub3B0aW9ucykge1xyXG5cdFx0XHRvcHRzQ2xhc3MgKz0gJyB1bmhpZGUnO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHNlY3Rpb24gY2xhc3NOYW1lPXtvcHRzQ2xhc3N9PlxyXG5cdFx0XHRcdDxDbGFzc1NlbGVjdG9yIGNoYW5nZUNsYXNzPXt0aGlzLmNoYW5nZUNsYXNzfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5kQ2xhc3N9IGdlbmRlcj17dGhpcy5zdGF0ZS5nZW5kZXJ9Lz5cclxuXHRcdFx0XHQ8R2VuZGVyU2VsZWN0b3IgY2hhbmdlR2VuZGVyPXt0aGlzLmNoYW5nZUdlbmRlcn0gc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuZ2VuZGVyfS8+XHJcblx0XHRcdFx0PFNlYXNvbmFsQ2hlY2tib3ggc2Vhc29uYWw9e3RoaXMuc3RhdGUuc2Vhc29uYWx9IGNoYW5nZVNlYXNvbmFsPXt0aGlzLmNoYW5nZVNlYXNvbmFsfS8+XHJcblx0XHRcdFx0PEhhcmRjb3JlQ2hlY2tib3ggaGFyZGNvcmU9e3RoaXMuc3RhdGUuaGFyZGNvcmV9IGNoYW5nZUhhcmRjb3JlPXt0aGlzLmNoYW5nZUhhcmRjb3JlfS8+XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uc1BhbmVsOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cHJvcFR5cGVzOntcclxuXHRcdGNoYW5nZVNlYXNvbmFsOlJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG5cdFx0c2Vhc29uYWw6UmVhY3QuUHJvcFR5cGVzLmJvb2xcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlU2Vhc29uYWw6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnByb3BzLmNoYW5nZVNlYXNvbmFsKCF0aGlzLnByb3BzLnNlYXNvbmFsKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2hlY2tib3gtd3JhcHBlcic+XHJcblx0XHRcdFx0PGxhYmVsPlxyXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzc05hbWU9J29wdGlvbnMtY2hlY2tib3gnIGNoZWNrZWQ9e3RoaXMucHJvcHMuc2Vhc29uYWx9IG9uQ2hhbmdlPXt0aGlzLl91cGRhdGVTZWFzb25hbH0vPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdjaGVja2JveC1sYWJlbCc+U2Vhc29uYWwgPHNwYW4gY2xhc3NOYW1lPSdoaWRkZW4tc20nPkhlcm88L3NwYW4+PC9zcGFuPlxyXG5cdFx0XHRcdDwvbGFiZWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZWFzb25hbENoZWNrYm94OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG52YXIgQXBwU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvQXBwU3RvcmUnKTtcclxuXHJcbnZhciBLYWRhbGFJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRwcm9wVHlwZXM6e1xyXG5cdFx0aXRlbTpSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG5cdFx0c2hhcmRDb3VudDpSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXHJcblx0fSxcclxuXHJcblx0X2J1eUl0ZW06ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaXRlbSA9IGQzc2ltLmthZGFsYVJvbGwodGhpcy5wcm9wcy5pdGVtLnR5cGUpO1xyXG5cdFx0aXRlbS5zaXplID0gdGhpcy5wcm9wcy5pdGVtLnNpemU7XHJcblxyXG5cdFx0QXBwQWN0aW9ucy5hZGRJdGVtKGl0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdpdGVtJyx0aGlzLnByb3BzLml0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5pbmNyZW1lbnRTaGFyZHModGhpcy5wcm9wcy5pdGVtLnR5cGUsdGhpcy5wcm9wcy5pdGVtLmNvc3QpO1xyXG5cdH0sXHJcblx0X3Jlc2V0Q291bnQ6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBBY3Rpb25zLmNsZWFyU2hhcmRzKHRoaXMucHJvcHMuaXRlbS50eXBlKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGljb25DbGFzcyA9ICdrYWRhbGEtaWNvbic7XHJcblx0XHRpY29uQ2xhc3MrPScgJyt0aGlzLnByb3BzLml0ZW0udHlwZTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0na2FkYWxhLWl0ZW0nPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdrYWRhbGEnIG9uQ2xpY2s9e3RoaXMuX2J1eUl0ZW19PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2ljb25DbGFzc30+PC9kaXY+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5pdGVtLmNvc3R9PC9zcGFuPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdrYWRhbGEtY29udGVudCc+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2thZGFsYS1pdGVtLXRpdGxlJyBvbkNsaWNrPXt0aGlzLl9idXlJdGVtfT57dGhpcy5wcm9wcy5pdGVtLnRleHR9PC9zcGFuPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdzaGFyZC1jb3VudCc+XHJcblx0XHRcdFx0XHRcdHt0aGlzLnByb3BzLnNoYXJkQ291bnR9XHJcblx0XHRcdFx0XHRcdDxhIGNsYXNzTmFtZT0nc2hhcmQtZGVsZXRlJyBvbkNsaWNrPXt0aGlzLl9yZXNldENvdW50fT5cclxuXHRcdFx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHpcIi8+XHJcblx0XHRcdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0XHRcdDwvYT5cclxuXHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEthZGFsYUl0ZW07IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxuXHJcbnZhciBBcHBTdG9yZSA9IHJlcXVpcmUoJy4uLy4uL3N0b3Jlcy9BcHBTdG9yZScpO1xyXG52YXIgS2FkYWxhSXRlbSA9IHJlcXVpcmUoJy4va2FkYWxhLWl0ZW0uanN4Jyk7XHJcblxyXG52YXIgS2FkYWxhU3RvcmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGFzc2lnbih7fSxBcHBTdG9yZS5nZXRTZXR0aW5ncygpLHtzaGFyZHM6QXBwU3RvcmUuZ2V0U2hhcmRzKCl9KTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0b3JlLmdldFNldHRpbmdzKCkpO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2hhcmRzOkFwcFN0b3JlLmdldFNoYXJkcygpfSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBrYWRhbGFDbGFzcyA9ICdrYWRhbGEtc3RvcmUnO1xyXG5cdFx0Ly90aGlzIGlzIGEgY2hlY2sgZm9yIGludGVybmV0IGV4cGxvcmVyXHJcblx0XHQvL2ZsZXgtZGlyZWN0aW9uOmNvbHVtbiBicmVha3MgZXZlcnl0aGluZyBzbyB3ZSBkZXRlY3QgZm9yIGl0IGhlcmVcclxuXHRcdGlmICgod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSAnKSAhPT0gLTEpfHwhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC4qcnZcXDoxMVxcLi8pKSB7XHJcblx0XHRcdGthZGFsYUNsYXNzKz0nIG5vaWUnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLnN0b3JlKSB7XHJcblx0XHRcdGthZGFsYUNsYXNzKz0nIHVuaGlkZSc7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGl0ZW1zID0gW1xyXG5cdFx0XHR7dHlwZTonaGVsbScsdGV4dDonTXlzdGVyeSBIZWxtZXQnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2Jvb3RzJyx0ZXh0OidNeXN0ZXJ5IEJvb3RzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidiZWx0Jyx0ZXh0OidNeXN0ZXJ5IEJlbHQnLGNvc3Q6MjUsc2l6ZToxfSxcclxuXHRcdFx0e3R5cGU6J3BhbnRzJyx0ZXh0OidNeXN0ZXJ5IFBhbnRzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidnbG92ZXMnLHRleHQ6J015c3RlcnkgR2xvdmVzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidjaGVzdCcsdGV4dDonTXlzdGVyeSBDaGVzdCcsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonc2hvdWxkZXJzJyx0ZXh0OidNeXN0ZXJ5IFNob3VsZGVycycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonYnJhY2VycycsdGV4dDonTXlzdGVyeSBCcmFjZXJzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidxdWl2ZXInLHRleHQ6J015c3RlcnkgUXVpdmVyJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidtb2pvJyx0ZXh0OidNeXN0ZXJ5IE1vam8nLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3NvdXJjZScsdGV4dDonTXlzdGVyeSBTb3VyY2UnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3NoaWVsZCcsdGV4dDonTXlzdGVyeSBTaGllbGQnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J29uZWhhbmQnLHRleHQ6JzEtSCBNeXN0ZXJ5IFdlYXBvbicsY29zdDo3NSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTondHdvaGFuZCcsdGV4dDonMi1IIE15c3RlcnkgV2VhcG9uJyxjb3N0Ojc1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidyaW5nJyx0ZXh0OidNeXN0ZXJ5IFJpbmcnLGNvc3Q6NTAsc2l6ZToxfSxcclxuXHRcdFx0e3R5cGU6J2FtdWxldCcsdGV4dDonTXlzdGVyeSBBbXVsZXQnLGNvc3Q6MTAwLHNpemU6MX1cclxuXHRcdF1cclxuXHRcdHZhciBpdGVtc0xlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcclxuXHJcblx0XHR2YXIga2FkYWxhU2xvdHMgPSBbXTtcclxuXHRcdGZvciAodmFyIGkgPTA7IGkgPCBpdGVtc0xlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGthZGFsYVNsb3RzLnB1c2goPEthZGFsYUl0ZW0ga2V5PXtpfSBpdGVtPXtpdGVtc1tpXX0gc2hhcmRDb3VudD17dGhpcy5zdGF0ZS5zaGFyZHNbaXRlbXNbaV0udHlwZV0gfHwgMH0vPik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2thZGFsYUNsYXNzfSBpZD0na2FkYWxhLXN0b3JlJz5cclxuXHRcdFx0XHR7a2FkYWxhU2xvdHN9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLYWRhbGFTdG9yZTsiLCJ2YXIga2V5TWlycm9yID0gcmVxdWlyZSgna2V5bWlycm9yJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XHJcblx0QUREX0lURU06bnVsbCxcclxuXHJcblx0UFJFVl9JTlY6bnVsbCxcclxuXHRORVhUX0lOVjpudWxsLFxyXG5cclxuXHRQUkVWX0lURU06bnVsbCxcclxuXHRORVhUX0lURU06bnVsbCxcclxuXHJcblx0Q0hBTkdFX1NFVFRJTkc6bnVsbCxcclxuXHRJTkNSRU1FTlRfU0hBUkRTOm51bGwsXHJcblx0Q0xFQVJfU0hBUkRTOm51bGwsXHJcblxyXG5cdFRPR0dMRV9PUFRJT05TOm51bGwsXHJcblx0VE9HR0xFX1NUT1JFOm51bGxcclxufSk7IiwidmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTsiLCJ2YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xyXG5cclxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcclxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcclxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcclxuXHJcbnZhciBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcclxuXHJcbnZhciBhcHBTZXR0aW5ncyA9IHt9O1xyXG52YXIgZGVmYXVsdHMgPSB7XHJcblx0ZENsYXNzOidCYXJiYXJpYW4nLFxyXG5cdGdlbmRlcjonRmVtYWxlJyxcclxuXHRoYXJkY29yZTpmYWxzZSxcclxuXHRzZWFzb25hbDp0cnVlLFxyXG5cdGl0ZW06e1widHlwZVwiOlwiaGVsbVwiLFwidGV4dFwiOlwiTXlzdGVyeSBIZWxtZXRcIixcImNvc3RcIjoyNSxcInNpemVcIjoyfVxyXG59O1xyXG52YXIgc2hhcmRzU3BlbnQgPSB7fTtcclxudmFyIGxpZmV0aW1lID0ge0JhcmJhcmlhbjp7fSxDcnVzYWRlcjp7fSwnRGVtb24gSHVudGVyJzp7fSxNb25rOnt9LCdXaXRjaCBEb2N0b3InOnt9LFdpemFyZDp7fX07XHJcbnZhciBsZWdDb3VudCA9IHtCYXJiYXJpYW46e30sQ3J1c2FkZXI6e30sJ0RlbW9uIEh1bnRlcic6e30sTW9uazp7fSwnV2l0Y2ggRG9jdG9yJzp7fSxXaXphcmQ6e319O1xyXG52YXIgcmFyaXR5Q291bnQgPSB7QmFyYmFyaWFuOnt9LENydXNhZGVyOnt9LCdEZW1vbiBIdW50ZXInOnt9LE1vbms6e30sJ1dpdGNoIERvY3Rvcic6e30sV2l6YXJkOnt9fTtcclxuXHJcbnZhciBzdG9yYWdlU3VwcG9ydGVkO1xyXG5cclxuLy9EZXRlcm1pbmUgd2hldGhlciBvciBub3QgbG9jYWwgc3RvcmFnZSBpcyBzdXBwb3J0ZWRcclxuLy9mcm9tIGdpdGh1Yi5jb20vYWdydWJsZXYvYW5ndWxhckxvY2FsU3RvcmFnZVxyXG4vL01JVCBMaWNlbmNlXHJcbmZ1bmN0aW9uIGxvY2FsU3RvcmFnZUNoZWNrKCkge1xyXG5cdHZhciBzdG9yYWdlID0gKHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykgPyB1bmRlZmluZWQgOiB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG5cdHZhciBzdXBwb3J0ZWQgPSAodHlwZW9mIHN0b3JhZ2UgIT09ICd1bmRlZmluZWQnKTtcclxuXHRpZiAoc3VwcG9ydGVkKSB7XHJcblx0XHR2YXIgdGVzdEtleSA9ICdfXycgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTcpO1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0odGVzdEtleSwgdGVzdEtleSk7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRlc3RLZXkpO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRzdXBwb3J0ZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblx0c3RvcmFnZVN1cHBvcnRlZCA9IHN1cHBvcnRlZDtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9nZ2xlU3RvcmUoKSB7XHJcblx0YXBwU2V0dGluZ3Muc3RvcmUgPSAhYXBwU2V0dGluZ3Muc3RvcmU7XHJcblx0YXBwU2V0dGluZ3Mub3B0aW9ucyA9IGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIHRvZ2dsZU9wdGlvbnMoKSB7XHJcblx0YXBwU2V0dGluZ3Mub3B0aW9ucyA9ICFhcHBTZXR0aW5ncy5vcHRpb25zO1xyXG5cdGFwcFNldHRpbmdzLnN0b3JlID0gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gaGlkZUJvdGgoKSB7XHJcblx0YXBwU2V0dGluZ3Muc3RvcmUgPSBmYWxzZTtcclxuXHRhcHBTZXR0aW5ncy5vcHRpb25zID0gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNldHRpbmdzKCkge1xyXG5cdHJldHVybiBhcHBTZXR0aW5ncztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2hhcmRzKGtleSkge1xyXG5cdGlmKGtleSkge1xyXG5cdFx0cmV0dXJuIHNoYXJkc1NwZW50W2tleV0gfHwgMDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRyZXR1cm4gc2hhcmRzU3BlbnQ7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGFuZ2VTZXR0aW5nKGtleSx2YWwpIHtcclxuXHRhcHBTZXR0aW5nc1trZXldID0gdmFsO1xyXG5cdGQzc2ltLnNldEthZGFsYShhcHBTZXR0aW5ncy5kQ2xhc3MsYXBwU2V0dGluZ3Muc2Vhc29uYWwsYXBwU2V0dGluZ3MuaGFyZGNvcmUpO1xyXG5cdHNhdmVTZXR0aW5ncygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlU2V0dGluZ3MoKSB7XHJcblx0aWYgKHN0b3JhZ2VTdXBwb3J0ZWQpIHtcclxuXHRcdGxvY2FsU3RvcmFnZS5rYWRhbGFTZXR0aW5ncyA9IEpTT04uc3RyaW5naWZ5KGFwcFNldHRpbmdzKTtcclxuXHRcdGxvY2FsU3RvcmFnZS5rYWRhbGFTcGVudCA9IEpTT04uc3RyaW5naWZ5KHNoYXJkc1NwZW50KTtcclxuXHRcdGxvY2FsU3RvcmFnZS5rYWRhbGFMaWZldGltZSA9IEpTT04uc3RyaW5naWZ5KGxpZmV0aW1lKTtcclxuXHRcdGxvY2FsU3RvcmFnZS5rYWRhbGFMZWdDb3VudCA9IEpTT04uc3RyaW5naWZ5KGxlZ0NvdW50KTtcclxuXHRcdGxvY2FsU3RvcmFnZS5rYWRhbGFSYXJpdHkgPSBKU09OLnN0cmluZ2lmeShyYXJpdHlDb3VudCk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbmNyZW1lbnRTaGFyZHMoa2V5LHZhbCkge1xyXG5cdGlmICh0eXBlb2Ygc2hhcmRzU3BlbnRba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHNoYXJkc1NwZW50W2tleV0rPXZhbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzaGFyZHNTcGVudFtrZXldID0gdmFsO1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIGxpZmV0aW1lW2FwcFNldHRpbmdzLmRDbGFzc11ba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdGxpZmV0aW1lW2FwcFNldHRpbmdzLmRDbGFzc11ba2V5XSs9dmFsO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdGxpZmV0aW1lW2FwcFNldHRpbmdzLmRDbGFzc11ba2V5XT12YWw7XHJcblx0fVxyXG5cdHNhdmVTZXR0aW5ncygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhclNoYXJkcyhrZXkpIHtcclxuXHRzaGFyZHNTcGVudFtrZXldID0gMDtcclxuXHRzYXZlU2V0dGluZ3MoKTtcclxufVxyXG5cclxuLy9zYXZlcyB0aGUgaXRlbSBuYW1lL3Jhcml0eSBpbnRvIGxvY2Fsc3RvcmFnZSBmb3IgZnV0dXJlIHZpc3VhbHNcclxuZnVuY3Rpb24gc2F2ZUl0ZW1EYXRhKGl0ZW0pIHtcclxuXHR2YXIgbmFtZSA9IGl0ZW0ubmFtZTtcclxuXHR2YXIgc2xvdCA9IGl0ZW0uc2xvdDtcclxuXHR2YXIgcmFyaXR5O1xyXG5cdHZhciBjb3N0ID0gYXBwU2V0dGluZ3MuaXRlbS5jb3N0O1xyXG5cclxuXHRpZiAodHlwZW9mIGl0ZW0uc2V0ICE9PSAndW5kZWZpbmVkJyAmJiBpdGVtLnJhcml0eSA9PT0gJ2FuY2llbnQnKSB7XHJcblx0XHRyYXJpdHkgPSAnYW5jaWVudHNldCc7XHJcblx0fVxyXG5cdGVsc2UgaWYodHlwZW9mIGl0ZW0uc2V0ICE9PSd1bmRlZmluZWQnKSB7XHJcblx0XHRyYXJpdHkgPSAnc2V0JztcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRyYXJpdHkgPSBpdGVtLnJhcml0eTtcclxuXHR9XHJcblxyXG5cdC8vc3RvcmluZyByYXJpdHkgLSBpZiB0aGUgc2xvdCBoYXMgYmVlbiBwdXJjaGFzZWQgYmVmb3JlXHJcblx0aWYgKHJhcml0eUNvdW50W2FwcFNldHRpbmdzLmRDbGFzc10uaGFzT3duUHJvcGVydHkoc2xvdCkpIHtcclxuXHRcdC8vdGhhdCBzbG90IGhhcyByZWNlaXZlZCB0aGlzIHJhcml0eSBiZWZvcmVcclxuXHRcdGlmIChyYXJpdHlDb3VudFthcHBTZXR0aW5ncy5kQ2xhc3NdW3Nsb3RdLmhhc093blByb3BlcnR5KHJhcml0eSkpIHtcclxuXHRcdFx0cmFyaXR5Q291bnRbYXBwU2V0dGluZ3MuZENsYXNzXVtzbG90XVtyYXJpdHldICs9IDE7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmFyaXR5Q291bnRbYXBwU2V0dGluZ3MuZENsYXNzXVtzbG90XVtyYXJpdHldID0gMTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly9zbG90IGhhcyBuZXZlciBiZWVuIHB1cmNoYXNlZCBhbmQgbmVlZHMgdG8gYmUgY3JlYXRlZCBhcyBhIGJsYW5rIG9iamVjdCBmaXJzdFxyXG5cdGVsc2Uge1xyXG5cdFx0cmFyaXR5Q291bnRbYXBwU2V0dGluZ3MuZENsYXNzXVtzbG90XSA9IHt9O1xyXG5cdFx0cmFyaXR5Q291bnRbYXBwU2V0dGluZ3MuZENsYXNzXVtzbG90XVtyYXJpdHldID0gMTtcclxuXHR9XHJcblxyXG5cdC8vdGhpcyBuZXN0aW5nIGlzIGFic29sdXRlbHkgZGlzZ3VzdGluZ1xyXG5cdC8vc3RvcmluZyBsZWdlbmRhcnkgY291bnQuIGNoZWNrIHRoYXQgdGhlIGl0ZW0gaXMgYSBsZWdlbmRhcnlcclxuXHRpZiAoWydsZWdlbmRhcnknLCdhbmNpZW50JywnYW5jaWVudHNldCcsJ3NldCddLmluZGV4T2YocmFyaXR5KSA+IC0xKXtcclxuXHRcdC8vY2hlY2sgaWYgdGhlIHNsb3QgaGFzIGJlZW4gcHVyY2hhc2VkIGJlZm9yZVxyXG5cdFx0aWYgKGxlZ0NvdW50W2FwcFNldHRpbmdzLmRDbGFzc10uaGFzT3duUHJvcGVydHkoc2xvdCkpIHtcclxuXHRcdFx0Ly90aGF0IHRoZSBzbG90IGhhcyByZWNlaXZlZCB0aGlzIGl0ZW0gYmVmb3JlXHJcblx0XHRcdGlmIChsZWdDb3VudFthcHBTZXR0aW5ncy5kQ2xhc3NdW3Nsb3RdLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcblx0XHRcdFx0Ly90aGF0IHRoZSBpdGVtIG5hbWUgaGFzIGJlZW4gZm91bmQgaW4gdGhpcyByYXJpdHlcclxuXHRcdFx0XHRpZiAobGVnQ291bnRbYXBwU2V0dGluZ3MuZENsYXNzXVtzbG90XVtuYW1lXS5oYXNPd25Qcm9wZXJ0eShyYXJpdHkpKSB7XHJcblx0XHRcdFx0XHRsZWdDb3VudFthcHBTZXR0aW5ncy5kQ2xhc3NdW3Nsb3RdW25hbWVdW3Jhcml0eV0gKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRsZWdDb3VudFthcHBTZXR0aW5ncy5kQ2xhc3NdW3Nsb3RdW25hbWVdW3Jhcml0eV0gPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvL2l0ZW0gaGFzIG5ldmVyIGJlZW4gZm91bmRcclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bGVnQ291bnRbYXBwU2V0dGluZ3MuZENsYXNzXVtzbG90XVtuYW1lXSA9IHt9O1xyXG5cdFx0XHRcdGxlZ0NvdW50W2FwcFNldHRpbmdzLmRDbGFzc11bc2xvdF1bbmFtZV1bcmFyaXR5XSA9IDE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vc2xvdCBoYXMgbmV2ZXIgYmVlbiBwdXJjaGFzZWRcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRsZWdDb3VudFthcHBTZXR0aW5ncy5kQ2xhc3NdW3Nsb3RdID0ge307XHJcblx0XHRcdGxlZ0NvdW50W2FwcFNldHRpbmdzLmRDbGFzc11bc2xvdF1bbmFtZV0gPSB7fTtcclxuXHRcdFx0bGVnQ291bnRbYXBwU2V0dGluZ3MuZENsYXNzXVtzbG90XVtuYW1lXVtyYXJpdHldID0gMTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNhdmVTZXR0aW5ncygpO1xyXG5cclxufVxyXG5cclxuXHJcbnZhciBBcHBTdG9yZSA9IGFzc2lnbih7fSxFdmVudEVtaXR0ZXIucHJvdG90eXBlLHtcclxuXHRnZXRTZXR0aW5nczpnZXRTZXR0aW5ncyxcclxuXHRnZXRTaGFyZHM6Z2V0U2hhcmRzLFxyXG5cclxuXHRlbWl0Q2hhbmdlOmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLmVtaXQoQ0hBTkdFX0VWRU5UKTtcclxuXHR9LFxyXG5cdGFkZENoYW5nZUxpc3RlbmVyOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLm9uKENIQU5HRV9FVkVOVCxjYWxsYmFjayk7XHJcblx0fSxcclxuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcjpmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDSEFOR0VfRVZFTlQsY2FsbGJhY2spO1xyXG5cdH1cclxufSk7XHJcblxyXG4vL2hvaXN0aW5nIG92ZXJwb3dlcmVkXHJcbmZ1bmN0aW9uIG1vYmlsZUNoZWNrKCkge1xyXG5cdHZhciBtb2JpbGUgPSAod2luZG93LmlubmVyV2lkdGggPD0gNzY4KTtcclxuXHJcblx0Ly9pZiBkaWZmZXJlbnQgdGhhbiBjdXJyZW50IGNoYW5nZVxyXG5cdGlmIChtb2JpbGUgIT09IGFwcFNldHRpbmdzLm1vYmlsZSkge1xyXG5cdFx0YXBwU2V0dGluZ3MubW9iaWxlID0gbW9iaWxlO1xyXG5cdFx0YXBwU2V0dGluZ3Muc3RvcmUgPSAhbW9iaWxlO1xyXG5cdFx0YXBwU2V0dGluZ3Mub3B0aW9ucyA9ICFtb2JpbGU7XHJcblx0fVxyXG5cdEFwcFN0b3JlLmVtaXQoQ0hBTkdFX0VWRU5UKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0bG9jYWxTdG9yYWdlQ2hlY2soKTtcclxuXHRtb2JpbGVDaGVjaygpO1xyXG5cdHdpbmRvdy5vbnJlc2l6ZSA9IG1vYmlsZUNoZWNrO1xyXG5cclxuXHRpZiAoc3RvcmFnZVN1cHBvcnRlZCkge1xyXG5cdFx0dmFyIHN0b3JlZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2thZGFsYVNldHRpbmdzJykpIHx8IHt9O1xyXG5cclxuXHRcdC8vbG9vcCB0aHJvdWdoIGV4aXN0aW5nIGRlZmF1bHRzIGluY2FzZSB1c2VyIGhhcyBvbGRlciB2ZXJzaW9uIG9mIGFwcFxyXG5cdFx0dmFyIHNldHRpbmdzS2V5cyA9IE9iamVjdC5rZXlzKGRlZmF1bHRzKTtcclxuXHRcdHZhciBrZXlMZW5ndGggPSBzZXR0aW5nc0tleXMubGVuZ3RoO1xyXG5cdFx0Zm9yICh2YXIgaSA9MDsgaSA8IGtleUxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGFwcFNldHRpbmdzW3NldHRpbmdzS2V5c1tpXV0gPSBzdG9yZWRbc2V0dGluZ3NLZXlzW2ldXSB8fCBkZWZhdWx0c1tzZXR0aW5nc0tleXNbaV1dO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vcHVsbCB0aGUgc3BlbnQgaXRlbXNcclxuXHRcdHNoYXJkc1NwZW50ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgna2FkYWxhU3BlbnQnKSkgfHwge307XHJcblxyXG5cdFx0Ly9vbGQgdmVyc2lvbiBvZiBhcHAgZGlkbnQgc2F2ZSBsaWZldGltZSBzaGFyZHMgYnkgY2xhc3MuIHRyYWNrIG5vd1xyXG5cdFx0dmFyIGxpZmV0aW1lTHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdrYWRhbGFMaWZldGltZScpKSB8fCB7fTtcclxuXHRcdGlmIChsaWZldGltZUxzLmhhc093blByb3BlcnR5KCdCYXJiYXJpYW4nKSkge1xyXG5cdFx0XHRsaWZldGltZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2thZGFsYUxpZmV0aW1lJykpIHx8IGxpZmV0aW1lO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vcHVsbCB0aGUgbGlmZXRpbWUgbGVnZW5kYXJ5IGNvdW50XHJcblx0XHR2YXIgbGlmZXRpbWVMYyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2thZGFsYUxlZ0NvdW50JykpIHx8IHt9O1xyXG5cdFx0aWYgKGxpZmV0aW1lTGMuaGFzT3duUHJvcGVydHkoJ0JhcmJhcmlhbicpKSB7XHJcblx0XHRcdGxlZ0NvdW50ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgna2FkYWxhTGVnQ291bnQnKSkgfHwgbGVnQ291bnQ7XHJcblx0XHR9XHJcblx0XHQvL3B1bGwgdGhlIGxpZmV0aW1lIGxlZ2VuZGFyeSBjb3VudFxyXG5cdFx0dmFyIGxpZmV0aW1lUmMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdrYWRhbGFSYXJpdHknKSkgfHwge307XHJcblx0XHRpZiAobGlmZXRpbWVSYy5oYXNPd25Qcm9wZXJ0eSgnQmFyYmFyaWFuJykpIHtcclxuXHRcdFx0cmFyaXR5Q291bnQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdrYWRhbGFSYXJpdHknKSkgfHwgbGlmZXRpbWVSYztcclxuXHRcdH1cclxuXHJcblx0XHQvL3NhdmUgdG8gc3RvcmFnZVxyXG5cdFx0c2F2ZVNldHRpbmdzKCk7XHJcblx0fVxyXG59XHJcblxyXG5pbml0KCk7XHJcblxyXG5BcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbikge1xyXG5cdHN3aXRjaChhY3Rpb24uYWN0aW9uVHlwZSl7XHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5DSEFOR0VfU0VUVElORzpcclxuXHRcdFx0Y2hhbmdlU2V0dGluZyhhY3Rpb24ua2V5LGFjdGlvbi52YWwpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuSU5DUkVNRU5UX1NIQVJEUzpcclxuXHRcdFx0aW5jcmVtZW50U2hhcmRzKGFjdGlvbi5rZXksYWN0aW9uLnZhbCk7XHJcblx0XHRcdEFwcFN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5UT0dHTEVfU1RPUkU6XHJcblx0XHRcdHRvZ2dsZVN0b3JlKCk7XHJcblx0XHRcdEFwcFN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5UT0dHTEVfT1BUSU9OUzpcclxuXHRcdFx0dG9nZ2xlT3B0aW9ucygpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuQUREX0lURU06XHJcblx0XHRcdGhpZGVCb3RoKCk7XHJcblx0XHRcdHNhdmVJdGVtRGF0YShhY3Rpb24uaXRlbSk7XHJcblx0XHRcdEFwcFN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5DTEVBUl9TSEFSRFM6XHJcblx0XHRcdGNsZWFyU2hhcmRzKGFjdGlvbi5rZXkpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0Ly9ub29wXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwU3RvcmU7IiwidmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcclxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcclxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcclxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxuXHJcbnZhciBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcclxuXHJcbi8vdGhlcmUgYXJlIG9ubHkgdHdvIGludmVudG9yaWVzIGJlaW5nIHVzZWQgd2l0aCB0aGUgYWJpbGl0eSB0byBjeWNsZSBiYWNrXHJcbnZhciBwcmV2aW91c0ludmVudG9yeTtcclxudmFyIGN1cnJlbnRJbnZlbnRvcnk7XHJcbnZhciBuZXh0SW52ZW50b3J5O1xyXG5cclxudmFyIGl0ZW1zID0gW107XHJcbnZhciBjdXJyZW50SW5kZXggPSAwO1xyXG5cclxuLy9jcmVhdGVzIG5lc3RlZCBhcnJheSBibGFuayBpbnZlbnRvcnkgYW5kIHNldHMgYXMgdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcbmZ1bmN0aW9uIGNyZWF0ZUludmVudG9yeSgpIHtcclxuXHR2YXIgbmV3SW52ZW50b3J5ID0gW107XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPDEwO2krKykge1xyXG5cdFx0Ly9wdXNoIGEgYmxhbmsgYXJyYXkgdG8gcmVwcmVzZW50IGVhY2ggY29sdW1uIG9mIHRoZSBpbnZlbnRvcnlcclxuXHRcdG5ld0ludmVudG9yeS5wdXNoKFtdKTtcclxuXHR9XHJcblxyXG5cdC8vc2V0IHRoZSBwcmV2aW91cyBpbnZlbnRvcnkgdG8gdGhlIGxhdGVzdCBpbnZlbnRvcnkgdXNlZFxyXG5cdHByZXZpb3VzSW52ZW50b3J5ID0gbmV4dEludmVudG9yeSB8fCBjdXJyZW50SW52ZW50b3J5IHx8IHVuZGVmaW5lZDtcclxuXHQvL3RoZSBuZXcgYmxhbmsgaW52ZW50b3J5IGlzIG5vdyB0aGUgY3VycmVudCBpbnZlbnRvcnlcclxuXHRjdXJyZW50SW52ZW50b3J5ID0gbmV3SW52ZW50b3J5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbnZlbnRvcnkoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHByZXZpb3VzSW52ZW50b3J5OnByZXZpb3VzSW52ZW50b3J5LFxyXG5cdFx0Y3VycmVudEludmVudG9yeTpjdXJyZW50SW52ZW50b3J5LFxyXG5cdFx0bmV4dEludmVudG9yeTpuZXh0SW52ZW50b3J5XHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbSgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0aGFzUHJldmlvdXM6KGN1cnJlbnRJbmRleCAhPT0gMCksXHJcblx0XHRpdGVtOml0ZW1zW2N1cnJlbnRJbmRleF0sXHJcblx0XHRoYXNOZXh0OihjdXJyZW50SW5kZXggPCBpdGVtcy5sZW5ndGggLSAxKVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEl0ZW0oaXRlbSkge1xyXG5cdHZhciBpbnZlbnRvcnlMZW5ndGggPSBjdXJyZW50SW52ZW50b3J5Lmxlbmd0aDtcclxuXHQvL2xvb3BpbmcgdGhyb3VnaCBlYWNoIGNvbHVtbiBvZiB0aGUgaW52ZW50b3J5XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbnZlbnRvcnlMZW5ndGg7IGkgKyspIHtcclxuXHRcdC8vbG9vcCB0aHJvdWdoIGVhY2ggaXRlbSBpbiBzYWlkIGNvbHVtblxyXG5cdFx0dmFyIGNvbHVtbkxlbmd0aCA9IGN1cnJlbnRJbnZlbnRvcnlbaV0ubGVuZ3RoO1xyXG5cdFx0dmFyIGNvbHVtbkhlaWdodCA9IDA7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvbHVtbkxlbmd0aDsgaisrKSB7XHJcblx0XHRcdC8vYWRkIGN1cnJlbnQgaXRlbSBzaXplIHRvIGNvbHVtbiBoZWlnaHRcclxuXHRcdFx0aWYoY3VycmVudEludmVudG9yeVtpXVtqXS5oYXNPd25Qcm9wZXJ0eSgnc2l6ZScpKSB7XHJcblx0XHRcdFx0Y29sdW1uSGVpZ2h0Kz1jdXJyZW50SW52ZW50b3J5W2ldW2pdLnNpemU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vY2hlY2sgaWYgdGhlIGhlaWdodCBpcyBzdGlsbCBsZXNzIHRoYW4gNiB3aXRoIG5ldyBpdGVtXHJcblx0XHQvL2FuZCBhZGQgdG8gdGhhdCBjb2x1bW4gYW5kIHJldHVybiB0byBzdG9wIHRoZSBtYWRuZXNzXHJcblx0XHRpZiAoY29sdW1uSGVpZ2h0K2l0ZW0uc2l6ZSA8PTYpIHtcclxuXHRcdFx0Y3VycmVudEludmVudG9yeVtpXS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHQvL2lmIHdlIGNhbiBzdWNjZXNzZnVsbHkgYWRkIHRvIGludmVudG9yeSBjYWxsIGZvciBpdGVtcyBpbnZlbnRvcnlcclxuXHRcdFx0YWRkVG9JdGVtcyhpdGVtKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly9pZiB3ZSBtYWRlIGl0IHRoaXMgZmFyIHRoZSBuZXcgaXRlbSBkb2VzIG5vdCBmaXQgaW4gdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcblx0Ly9jaGVjayB0byBzZWUgaWYgdGhlcmUgaXMgYSBuZXh0IGludmVudG9yeVxyXG5cdC8vc28gdGhhdCB3ZSBjYW4gY3ljbGUgdG8gbmV4dCBpbnZlbnRvcnkgYW5kIHRyeSBhbmQgZml0IGl0IGluXHJcblx0aWYgKHR5cGVvZiBuZXh0SW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0Z290b05leHQoKTtcclxuXHRcdGFkZEl0ZW0oaXRlbSk7XHJcblx0fVxyXG5cdC8vdGhlcmUgaXMgbm8gbmV4dCBpbnZlbnRvcnkgYW5kIHdlIG5lZWQgdG8gbWFrZSBhIG5ldyBvbmVcclxuXHRlbHNlIHtcclxuXHRcdGNyZWF0ZUludmVudG9yeSgpO1xyXG5cdFx0YWRkSXRlbShpdGVtKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvSXRlbXMoaXRlbSkge1xyXG5cdGl0ZW1zLnB1c2goaXRlbSk7XHJcblxyXG5cdC8vaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAxMCBpdGVtcyByZW1vdmUgdGhlIGZpcnN0XHJcblx0aWYgKGl0ZW1zLmxlbmd0aCA+IDEwKSB7XHJcblx0XHRpdGVtcy5zaGlmdCgpO1xyXG5cdH1cclxuXHJcblx0Ly9zZXQgdGhlIGN1cnJlbnRpbmRleCB0byB0aGUgbmV3IGl0ZW1cclxuXHRjdXJyZW50SW5kZXggPSBpdGVtcy5sZW5ndGggLSAxO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmV2aW91c0l0ZW0oKSB7XHJcblx0aWYgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG5cdFx0Y3VycmVudEluZGV4IC09MTtcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gbmV4dEl0ZW0oKSB7XHJcblx0aWYgKGN1cnJlbnRJbmRleCA8IGl0ZW1zLmxlbmd0aCAtMSkge1xyXG5cdFx0Y3VycmVudEluZGV4ICs9MTtcclxuXHR9XHJcbn1cclxuXHJcbi8vY3ljbGVzIHRocm91Z2ggdG8gdGhlIHByZXZpb3VzIGludmVudG9yeVxyXG5mdW5jdGlvbiBnb3RvUHJldmlvdXMoKSB7XHJcblx0aWYodHlwZW9mIHByZXZpb3VzSW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0bmV4dEludmVudG9yeSA9IGN1cnJlbnRJbnZlbnRvcnk7XHJcblx0XHRjdXJyZW50SW52ZW50b3J5ID0gcHJldmlvdXNJbnZlbnRvcnk7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcbn1cclxuXHJcbi8vY3ljbGVzIHRocm91Z2ggdG8gdGhlIG5leHQgaW52ZW50b3J5XHJcbmZ1bmN0aW9uIGdvdG9OZXh0KCkge1xyXG5cdGlmKHR5cGVvZiBuZXh0SW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0cHJldmlvdXNJbnZlbnRvcnkgPSBjdXJyZW50SW52ZW50b3J5O1xyXG5cdFx0Y3VycmVudEludmVudG9yeSA9IG5leHRJbnZlbnRvcnk7XHJcblx0XHRuZXh0SW52ZW50b3J5ID0gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuLy9pbml0aWFsaXplIHN0b3JlIGJ5IGNyZWF0aW5nIGEgYmxhbmsgaW52ZW50b3J5XHJcbmNyZWF0ZUludmVudG9yeSgpO1xyXG5cclxudmFyIEludmVudG9yeVN0b3JlID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLHtcclxuXHRnZXRJbnZlbnRvcnk6Z2V0SW52ZW50b3J5LFxyXG5cdGdvdG9QcmV2aW91czpnb3RvUHJldmlvdXMsXHJcblx0Z290b05leHQ6Z290b05leHQsXHJcblx0YWRkSXRlbTphZGRJdGVtLFxyXG5cdGdldEl0ZW06Z2V0SXRlbSxcclxuXHRwcmV2aW91c0l0ZW06cHJldmlvdXNJdGVtLFxyXG5cdG5leHRJdGVtOm5leHRJdGVtLFxyXG5cclxuXHRlbWl0Q2hhbmdlOmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLmVtaXQoQ0hBTkdFX0VWRU5UKTtcclxuXHR9LFxyXG5cdGFkZENoYW5nZUxpc3RlbmVyOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLm9uKENIQU5HRV9FVkVOVCxjYWxsYmFjayk7XHJcblx0fSxcclxuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcjpmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDSEFOR0VfRVZFTlQsY2FsbGJhY2spO1xyXG5cdH1cclxufSk7XHJcblxyXG5BcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbikge1xyXG5cdHN3aXRjaChhY3Rpb24uYWN0aW9uVHlwZSkge1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLkFERF9JVEVNOlxyXG5cdFx0XHRhZGRJdGVtKGFjdGlvbi5pdGVtKTtcclxuXHRcdFx0SW52ZW50b3J5U3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5QUkVWX0lOVjpcclxuXHRcdFx0Z290b1ByZXZpb3VzKCk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuTkVYVF9JTlY6XHJcblx0XHRcdGdvdG9OZXh0KCk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuUFJFVl9JVEVNOlxyXG5cdFx0XHRwcmV2aW91c0l0ZW0oKTtcclxuXHRcdFx0SW52ZW50b3J5U3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5ORVhUX0lURU06XHJcblx0XHRcdG5leHRJdGVtKCk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0Ly9ub29wXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5U3RvcmU7Il19
