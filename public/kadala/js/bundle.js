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
				React.createElement("h1", null, React.createElement("a", {href: "/kadala/"}, "Kadala Simulator")), 
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

},{"../../actions/AppActions.js":8,"../../stores/AppStore.js":37}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
		if (this.props.item.hasOwnProperty('weaponDps')) {
			subHead = React.createElement(D3ItemTooltipWeapon, {weapon: this.props.item});
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

},{"./d3-tooltip-armor.jsx":11,"./d3-tooltip-stat.jsx":15,"./d3-tooltip-weapon.jsx":16}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipWeapon= React.createClass({displayName: "D3ItemTooltipWeapon",

	render: function() {

		return (
			React.createElement("div", null, 
			React.createElement("ul", {className: "item-armor-weapon item-weapon-dps"}, 
				React.createElement("li", {className: "big"}, React.createElement("span", {className: "value"}, Math.round( this.props.weapon.weaponDps * 10 ) / 10)), 
				React.createElement("li", null, "Damage Per Second")
			), 
			React.createElement("ul", {className: "item-armor-weapon item-weapon damage"}, 
				React.createElement("li", null, 
					React.createElement("p", null, 
						React.createElement("span", {className: "value"}, this.props.weapon.damageRange[0]), " -", 
						React.createElement("span", {className: "value"}, " ", this.props.weapon.damageRange[1]), 
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

},{}],17:[function(require,module,exports){
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

},{"./d3-tooltip-body.jsx":12,"./d3-tooltip-flavor.jsx":13,"./d3-tooltip-head.jsx":14}],18:[function(require,module,exports){
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

},{"../../stores/InventoryStore":38,"../d3-tooltip/d3-tooltip.jsx":17,"./item-left.jsx":19,"./item-right.jsx":20}],19:[function(require,module,exports){
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

},{"../../actions/AppActions":8}],20:[function(require,module,exports){
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

},{"../../actions/AppActions":8}],21:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"./class-selector-button.jsx":26}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"./gender-selector-button.jsx":28}],30:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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
					React.createElement("span", {className: "kadala-item-title", onClick: this.buyItem}, this.props.item.text), 
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

},{"../../actions/AppActions":8,"../../stores/AppStore":37}],34:[function(require,module,exports){
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

},{"../../stores/AppStore":37,"./kadala-item.jsx":33}],35:[function(require,module,exports){
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

},{"keymirror":6}],36:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":3}],37:[function(require,module,exports){
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
	appSettings.options = false;
}
function toggleOptions() {
	appSettings.options = !appSettings.options;
	appSettings.store = false;
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

	AppStore.setMaxListeners(20);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxhY3Rpb25zXFxBcHBBY3Rpb25zLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxjb21tb25cXGZvb3Rlci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGNvbW1vblxcbmF2YmFyLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1hcm1vci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAtYm9keS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAtZmxhdm9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1oZWFkLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1zdGF0LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC13ZWFwb24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW5kaXZpZHVhbC1pdGVtXFxpbmRpdmlkdWFsLWl0ZW0uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbmRpdmlkdWFsLWl0ZW1cXGl0ZW0tbGVmdC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGluZGl2aWR1YWwtaXRlbVxcaXRlbS1yaWdodC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LWNvbnRhaW5lci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LXNsb3QuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXGludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcbmV4dC1pbnZlbnRvcnkuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXHByZXZpb3VzLWludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxjbGFzcy1zZWxlY3Rvci1idXR0b24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcY2xhc3Mtc2VsZWN0b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcZ2VuZGVyLXNlbGVjdG9yLWJ1dHRvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxnZW5kZXItc2VsZWN0b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcaGFyZGNvcmUtY2hlY2tib3guanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcb3B0aW9ucy1wYW5lbC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxzZWFzb25hbC1jaGVja2JveC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1zdG9yZVxca2FkYWxhLWl0ZW0uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtc3RvcmVcXGthZGFsYS1zdG9yZS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbnN0YW50c1xcQXBwQ29uc3RhbnRzLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxkaXNwYXRjaGVyXFxBcHBEaXNwYXRjaGVyLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxzdG9yZXNcXEFwcFN0b3JlLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxzdG9yZXNcXEludmVudG9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDdkQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUM7QUFDNUUsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFDeEUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDaEUsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7QUFDakYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7O0FBRXZELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUUvQyxJQUFJLGlDQUFpQywyQkFBQTtDQUNwQyxlQUFlLENBQUMsV0FBVztFQUMxQixPQUFPLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUM5QjtDQUNELGlCQUFpQixFQUFFLFdBQVc7QUFDL0IsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDOztFQUVFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEQsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDN0I7O0VBRUUsTUFBTSxD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDO0dBQ1gsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxTQUFTO0dBQzFCLFlBQVksRUFBRSxDQUFDO0dBQ2YsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7RUFFUCxLQUFLLFlBQVksQ0FBQyxTQUFTO0dBQzFCLFFBQVEsRUFBRSxDQUFDO0dBQ1gsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQy9CLEdBQUcsTUFBTTs7QUFFVCxFQUFFLFFBQVE7O0VBRVI7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBOYXZiYXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY29tbW9uL25hdmJhci5qc3gnKTtcclxudmFyIE9wdGlvbnNQYW5lbCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9rYWRhbGEtb3B0aW9ucy9vcHRpb25zLXBhbmVsLmpzeCcpO1xyXG52YXIgS2FkYWxhU3RvcmUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMva2FkYWxhLXN0b3JlL2thZGFsYS1zdG9yZS5qc3gnKTtcclxudmFyIEludmVudG9yeSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9pbnZlbnRvcnkvaW52ZW50b3J5LmpzeCcpO1xyXG52YXIgSW5kaXZpZHVhbEl0ZW0gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaW5kaXZpZHVhbC1pdGVtL2luZGl2aWR1YWwtaXRlbS5qc3gnKTtcclxudmFyIEZvb3RlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jb21tb24vZm9vdGVyLmpzeCcpO1xyXG5cclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZXMvQXBwU3RvcmUuanMnKTtcclxuXHJcbnZhciBBcHBsaWNhdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHJcblx0XHQvL29wYWNpdHkgb24gbG9hZGVyIGZvciB0aGUgbmljZSBmYWRlIGVmZmVjdCB2aWEgY3NzIHRyYW5zaXRpb25cclxuXHRcdHZhciBsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpO1xyXG5cdFx0bG9hZGVyLnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcblxyXG5cdFx0Ly9kaXNwbGF5IG5vbmUgc28gd2UgY2FuIGNsaWNrIHRocm91Z2ggaXQgYXMgcG9pbnRlci1ldmVudHMgaXMgYnVnZ3lcclxuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRsb2FkZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdH0sMTAwMCk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0b3JlLmdldFNldHRpbmdzKCkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvL2NvbmRpdGlvbmFsbHkgcmVuZGVyIGVpdGhlciB0aGUgaW52ZW50b3J5IG9yIGluZGl2aWR1YWwgaXRlbSBiYXNlZCBvbiBzY3JlZW4gc2l6ZVxyXG5cdFx0dmFyIGludmVudG9yeTtcclxuXHRcdHZhciBpbmRpdmlkdWFsSXRlbTtcclxuXHJcblx0XHRpZiAodGhpcy5zdGF0ZS5tb2JpbGUpIHtcclxuXHRcdFx0aW5kaXZpZHVhbEl0ZW0gPSA8SW5kaXZpZHVhbEl0ZW0gLz5cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpbnZlbnRvcnkgPSA8SW52ZW50b3J5IC8+XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8TmF2YmFyIG1vYmlsZT17dGhpcy5zdGF0ZS5tb2JpbGV9IC8+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lci1mbHVpZCc+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbC1zbS0zJz5cclxuXHRcdFx0XHRcdFx0XHQ8T3B0aW9uc1BhbmVsIC8+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTknPlxyXG5cdFx0XHRcdFx0XHRcdDxLYWRhbGFTdG9yZS8+XHJcblx0XHRcdFx0XHRcdFx0e2ludmVudG9yeX1cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdyb3cnPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY29sLXNtLTEyJz5cclxuXHRcdFx0XHRcdFx0XHR7aW5kaXZpZHVhbEl0ZW19XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PEZvb3RlciAvPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcblJlYWN0LnJlbmRlcihcclxuXHQ8QXBwbGljYXRpb24gLz4sXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpXHJcbik7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5EaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWIvRGlzcGF0Y2hlcicpXG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIERpc3BhdGNoZXJcbiAqIEB0eXBlY2hlY2tzXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCcuL2ludmFyaWFudCcpO1xuXG52YXIgX2xhc3RJRCA9IDE7XG52YXIgX3ByZWZpeCA9ICdJRF8nO1xuXG4vKipcbiAqIERpc3BhdGNoZXIgaXMgdXNlZCB0byBicm9hZGNhc3QgcGF5bG9hZHMgdG8gcmVnaXN0ZXJlZCBjYWxsYmFja3MuIFRoaXMgaXNcbiAqIGRpZmZlcmVudCBmcm9tIGdlbmVyaWMgcHViLXN1YiBzeXN0ZW1zIGluIHR3byB3YXlzOlxuICpcbiAqICAgMSkgQ2FsbGJhY2tzIGFyZSBub3Qgc3Vic2NyaWJlZCB0byBwYXJ0aWN1bGFyIGV2ZW50cy4gRXZlcnkgcGF5bG9hZCBpc1xuICogICAgICBkaXNwYXRjaGVkIHRvIGV2ZXJ5IHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gKiAgIDIpIENhbGxiYWNrcyBjYW4gYmUgZGVmZXJyZWQgaW4gd2hvbGUgb3IgcGFydCB1bnRpbCBvdGhlciBjYWxsYmFja3MgaGF2ZVxuICogICAgICBiZWVuIGV4ZWN1dGVkLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGlzIGh5cG90aGV0aWNhbCBmbGlnaHQgZGVzdGluYXRpb24gZm9ybSwgd2hpY2hcbiAqIHNlbGVjdHMgYSBkZWZhdWx0IGNpdHkgd2hlbiBhIGNvdW50cnkgaXMgc2VsZWN0ZWQ6XG4gKlxuICogICB2YXIgZmxpZ2h0RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjb3VudHJ5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDb3VudHJ5U3RvcmUgPSB7Y291bnRyeTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjaXR5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDaXR5U3RvcmUgPSB7Y2l0eTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgYmFzZSBmbGlnaHQgcHJpY2Ugb2YgdGhlIHNlbGVjdGVkIGNpdHlcbiAqICAgdmFyIEZsaWdodFByaWNlU3RvcmUgPSB7cHJpY2U6IG51bGx9XG4gKlxuICogV2hlbiBhIHVzZXIgY2hhbmdlcyB0aGUgc2VsZWN0ZWQgY2l0eSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY2l0eS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ2l0eTogJ3BhcmlzJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYENpdHlTdG9yZWA6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY2l0eS11cGRhdGUnKSB7XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IHBheWxvYWQuc2VsZWN0ZWRDaXR5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgY291bnRyeSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY291bnRyeS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ291bnRyeTogJ2F1c3RyYWxpYSdcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGJvdGggc3RvcmVzOlxuICpcbiAqICAgIENvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgQ291bnRyeVN0b3JlLmNvdW50cnkgPSBwYXlsb2FkLnNlbGVjdGVkQ291bnRyeTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIGNhbGxiYWNrIHRvIHVwZGF0ZSBgQ291bnRyeVN0b3JlYCBpcyByZWdpc3RlcmVkLCB3ZSBzYXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGUgcmV0dXJuZWQgdG9rZW4uIFVzaW5nIHRoaXMgdG9rZW4gd2l0aCBgd2FpdEZvcigpYCwgd2UgY2FuIGd1YXJhbnRlZVxuICogdGhhdCBgQ291bnRyeVN0b3JlYCBpcyB1cGRhdGVkIGJlZm9yZSB0aGUgY2FsbGJhY2sgdGhhdCB1cGRhdGVzIGBDaXR5U3RvcmVgXG4gKiBuZWVkcyB0byBxdWVyeSBpdHMgZGF0YS5cbiAqXG4gKiAgIENpdHlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBtYXkgbm90IGJlIHVwZGF0ZWQuXG4gKiAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIGlzIG5vdyBndWFyYW50ZWVkIHRvIGJlIHVwZGF0ZWQuXG4gKlxuICogICAgICAgLy8gU2VsZWN0IHRoZSBkZWZhdWx0IGNpdHkgZm9yIHRoZSBuZXcgY291bnRyeVxuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBnZXREZWZhdWx0Q2l0eUZvckNvdW50cnkoQ291bnRyeVN0b3JlLmNvdW50cnkpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIHVzYWdlIG9mIGB3YWl0Rm9yKClgIGNhbiBiZSBjaGFpbmVkLCBmb3IgZXhhbXBsZTpcbiAqXG4gKiAgIEZsaWdodFByaWNlU3RvcmUuZGlzcGF0Y2hUb2tlbiA9XG4gKiAgICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgZ2V0RmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGBjb3VudHJ5LXVwZGF0ZWAgcGF5bG9hZCB3aWxsIGJlIGd1YXJhbnRlZWQgdG8gaW52b2tlIHRoZSBzdG9yZXMnXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcyBpbiBvcmRlcjogYENvdW50cnlTdG9yZWAsIGBDaXR5U3RvcmVgLCB0aGVuXG4gKiBgRmxpZ2h0UHJpY2VTdG9yZWAuXG4gKi9cblxuICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2l0aCBldmVyeSBkaXNwYXRjaGVkIHBheWxvYWQuIFJldHVybnNcbiAgICogYSB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHdpdGggYHdhaXRGb3IoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIF9sYXN0SUQrKztcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3Rlcj1mdW5jdGlvbihpZCkge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICdEaXNwYXRjaGVyLnVucmVnaXN0ZXIoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICBpZFxuICAgICk7XG4gICAgZGVsZXRlIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gaWRzXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKGlkcykge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLidcbiAgICApO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdLFxuICAgICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICtcbiAgICAgICAgICAnd2FpdGluZyBmb3IgYCVzYC4nLFxuICAgICAgICAgIGlkXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KFxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaD1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgIXRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLidcbiAgICApO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY2FsbGJhY2sgc3RvcmVkIHdpdGggdGhlIGdpdmVuIGlkLiBBbHNvIGRvIHNvbWUgaW50ZXJuYWxcbiAgICogYm9va2tlZXBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrPWZ1bmN0aW9uKGlkKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0odGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHVwIGJvb2trZWVwaW5nIG5lZWRlZCB3aGVuIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmc9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoZmFsc2UpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhbiBlbnVtZXJhdGlvbiB3aXRoIGtleXMgZXF1YWwgdG8gdGhlaXIgdmFsdWUuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogICB2YXIgQ09MT1JTID0ga2V5TWlycm9yKHtibHVlOiBudWxsLCByZWQ6IG51bGx9KTtcbiAqICAgdmFyIG15Q29sb3IgPSBDT0xPUlMuYmx1ZTtcbiAqICAgdmFyIGlzQ29sb3JWYWxpZCA9ICEhQ09MT1JTW215Q29sb3JdO1xuICpcbiAqIFRoZSBsYXN0IGxpbmUgY291bGQgbm90IGJlIHBlcmZvcm1lZCBpZiB0aGUgdmFsdWVzIG9mIHRoZSBnZW5lcmF0ZWQgZW51bSB3ZXJlXG4gKiBub3QgZXF1YWwgdG8gdGhlaXIga2V5cy5cbiAqXG4gKiAgIElucHV0OiAge2tleTE6IHZhbDEsIGtleTI6IHZhbDJ9XG4gKiAgIE91dHB1dDoge2tleTE6IGtleTEsIGtleTI6IGtleTJ9XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG52YXIga2V5TWlycm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgdmFyIGtleTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gIH1cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gVG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciBrZXlzO1xuXHR2YXIgdG8gPSBUb09iamVjdCh0YXJnZXQpO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoT2JqZWN0KGZyb20pKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJ2YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xyXG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSB7XHJcblxyXG5cdGFkZEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5BRERfSVRFTSxcclxuXHRcdFx0aXRlbTppdGVtXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRwcmV2aW91c0ludmVudG9yeTogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuUFJFVl9JTlZcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdG5leHRJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLk5FWFRfSU5WXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRwcmV2aW91c0l0ZW06ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuUFJFVl9JVEVNXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRuZXh0SXRlbTpmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5ORVhUX0lURU1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGNoYW5nZVNldHRpbmc6ZnVuY3Rpb24oa2V5LHZhbCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLkNIQU5HRV9TRVRUSU5HLFxyXG5cdFx0XHRrZXk6a2V5LFxyXG5cdFx0XHR2YWw6dmFsXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHR0b2dnbGVTdG9yZTpmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5UT0dHTEVfU1RPUkVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRvZ2dsZU9wdGlvbnM6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuVE9HR0xFX09QVElPTlNcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGluY3JlbWVudFNoYXJkczpmdW5jdGlvbihrZXksdmFsKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuSU5DUkVNRU5UX1NIQVJEUyxcclxuXHRcdFx0a2V5OmtleSxcclxuXHRcdFx0dmFsOnZhbFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwQWN0aW9uczsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEZvb3RlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8Zm9vdGVyPlxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nZm9vdGVyLWxlZnQnPlxyXG5cdFx0XHRcdFx0PGEgaHJlZj0nLy91cy5iYXR0bGUubmV0L2QzL2VuLyc+RGlhYmxvIElJSTwvYT4gwqkgXHJcblx0XHRcdFx0XHQ8YSBocmVmPScvL3VzLmJsaXp6YXJkLmNvbS9lbi11cy8nPkJsaXp6YXJkIEVudGVydGFpbm1lbnQsIEluYy48L2E+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nZm9vdGVyLXJpZ2h0Jz5cclxuXHRcdFx0XHR7LypHaXRodWIgLSBGcm9tIEZvdW5kYXRpb24gSWNvbnMgYnkgWnVyYiBNSVQgTGljZW5jZSovfVxyXG5cdFx0XHRcdDxhIGhyZWY9Jy8vZ2l0aHViLmNvbS9iZW5zdGVwcCc+XHJcblx0XHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiXHJcblx0XHRcdFx0XHRcdCB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDEwMCAxMDBcIj5cclxuXHRcdFx0XHRcdDxnPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNNDkuOTk4LDExLjk2M0MyOC40NjEsMTEuOTYzLDExLDI5LjQyNSwxMSw1MC45NjVcclxuXHRcdFx0XHRcdFx0XHRjMCwxNy4yMzEsMTEuMTcyLDMxLjg0OSwyNi42NzEsMzcuMDAzYzEuOTUyLDAuMzYxLDIuNjYyLTAuODQsMi42NjItMS44NzdjMC0wLjkyNC0wLjAzNC0zLjM3NS0wLjA1MS02LjYzM1xyXG5cdFx0XHRcdFx0XHRcdGMtMTAuODQ5LDIuMzU5LTEzLjEzOC01LjIyOS0xMy4xMzgtNS4yMjljLTEuNzc0LTQuNTA1LTQuMzMxLTUuNzAzLTQuMzMxLTUuNzAzYy0zLjU0MS0yLjQxOCwwLjI2OS0yLjM3MSwwLjI2OS0yLjM3MVxyXG5cdFx0XHRcdFx0XHRcdGMzLjkxNCwwLjI3Nyw1Ljk3NCw0LjAxOCw1Ljk3NCw0LjAxOGMzLjQ3OCw1Ljk2LDkuMTI5LDQuMjM1LDExLjM1LDMuMjQzYzAuMzUzLTIuNTI1LDEuMzYzLTQuMjQsMi40NzYtNS4yMTdcclxuXHRcdFx0XHRcdFx0XHRjLTguNjU5LTAuOTg0LTE3Ljc2My00LjMzLTE3Ljc2My0xOS4yNzRjMC00LjI1OSwxLjUxOS03Ljc0MSw0LjAxMy0xMC40NjhjLTAuMzk5LTAuOTgyLTEuNzQtNC45NDcsMC4zODMtMTAuMzE5XHJcblx0XHRcdFx0XHRcdFx0YzAsMCwzLjI3NC0xLjA0OCwxMC43MjYsNC4wMDFjMy4xMDktMC44NjksNi40NDYtMS4zMDMsOS43NjMtMS4zMTZjMy4zMTIsMC4wMTQsNi42NSwwLjQ0Nyw5Ljc2MywxLjMxNlxyXG5cdFx0XHRcdFx0XHRcdGM3LjQ0Ny01LjA0OSwxMC43MTYtNC4wMDEsMTAuNzE2LTQuMDAxYzIuMTI4LDUuMzcyLDAuNzg4LDkuMzM3LDAuMzg4LDEwLjMxOWMyLjUsMi43MjcsNC4wMDgsNi4yMDksNC4wMDgsMTAuNDY4XHJcblx0XHRcdFx0XHRcdFx0YzAsMTQuOTc5LTkuMTE3LDE4LjI3OS0xNy44MDUsMTkuMjQxYzEuMzk4LDEuMjA1LDIuNjQ2LDMuNTksMi42NDYsNy4yMjljMCw1LjIxMS0wLjA0Nyw5LjQxNi0wLjA0NywxMC42OTVcclxuXHRcdFx0XHRcdFx0XHRjMCwxLjA0NSwwLjcwMSwyLjI2LDIuNjgxLDEuODczQzc3LjgzNiw4Mi43OTgsODksNjguMTkxLDg5LDUwLjk2NUM4OSwyOS40MjUsNzEuNTM5LDExLjk2Myw0OS45OTgsMTEuOTYzelwiLz5cclxuXHRcdFx0XHRcdDwvZz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYT5cclxuXHRcdFx0XHR7LypUd2l0dGVyIC0gRnJvbSBGb3VuZGF0aW9uIEljb25zIGJ5IFp1cmIgTUlUIExpY2VuY2UqL31cclxuXHRcdFx0XHQ8YSBocmVmPScvL3R3aXR0ZXIuY29tL2JlbnN0ZXBwJz5cclxuXHRcdFx0XHRcdDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHg9XCIwcHhcIiB5PVwiMHB4XCJcclxuXHRcdFx0XHRcdFx0IHdpZHRoPVwiMjRweFwiIGhlaWdodD1cIjI0cHhcIiB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMTAwIDEwMFwiPlxyXG5cdFx0XHRcdFx0PHBhdGggZD1cIk04OC41LDI2LjEyYy0yLjgzMywxLjI1Ni01Ljg3NywyLjEwNS05LjA3MywyLjQ4NmMzLjI2MS0xLjk1NSw1Ljc2Ny01LjA1MSw2Ljk0NS04LjczOFxyXG5cdFx0XHRcdFx0XHRjLTMuMDUyLDEuODEtNi40MzQsMy4xMjYtMTAuMDMxLDMuODMyYy0yLjg4MS0zLjA2OC02Ljk4Ny00Ljk4OC0xMS41MzEtNC45ODhjLTguNzI0LDAtMTUuNzk4LDcuMDcyLTE1Ljc5OCwxNS43OThcclxuXHRcdFx0XHRcdFx0YzAsMS4yMzcsMC4xNCwyLjQ0NCwwLjQxLDMuNjAxYy0xMy4xMy0wLjY1OS0yNC43Ny02Ljk0OS0zMi41NjItMTYuNTA4Yy0xLjM2LDIuMzM0LTIuMTM5LDUuMDQ5LTIuMTM5LDcuOTQzXHJcblx0XHRcdFx0XHRcdGMwLDUuNDgxLDIuNzg5LDEwLjMxNSw3LjAyOCwxMy4xNDljLTIuNTg5LTAuMDgzLTUuMDI1LTAuNzk0LTcuMTU1LTEuOTc2Yy0wLjAwMiwwLjA2Ni0wLjAwMiwwLjEzMS0wLjAwMiwwLjE5OVxyXG5cdFx0XHRcdFx0XHRjMCw3LjY1Miw1LjQ0NSwxNC4wMzcsMTIuNjcxLDE1LjQ5Yy0xLjMyNSwwLjM1OS0yLjcyLDAuNTUzLTQuMTYxLDAuNTUzYy0xLjAxOSwwLTIuMDA4LTAuMDk4LTIuOTczLTAuMjgzXHJcblx0XHRcdFx0XHRcdGMyLjAxLDYuMjc1LDcuODQ0LDEwLjg0NCwxNC43NTcsMTAuOTcyYy01LjQwNyw0LjIzNi0xMi4yMTgsNi43NjMtMTkuNjIsNi43NjNjLTEuMjc1LDAtMi41MzItMC4wNzQtMy43NjktMC4yMjFcclxuXHRcdFx0XHRcdFx0YzYuOTkxLDQuNDgyLDE1LjI5NSw3LjA5NiwyNC4yMTYsNy4wOTZjMjkuMDU4LDAsNDQuOTQ4LTI0LjA3MSw0NC45NDgtNDQuOTQ1YzAtMC42ODQtMC4wMTYtMS4zNjctMC4wNDYtMi4wNDZcclxuXHRcdFx0XHRcdFx0QzgzLjcwNCwzMi4wNzEsODYuMzgzLDI5LjI4OCw4OC41LDI2LjEyelwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYT5cclxuXHRcdFx0XHR7LypTdGVhbSAtIEZyb20gRm91bmRhdGlvbiBJY29ucyBieSBadXJiIE1JVCBMaWNlbmNlKi99XHJcblx0XHRcdFx0PGEgaHJlZj0nLy9zdGVhbWNvbW11bml0eS5jb20vaWQvZm9vbWFuJz5cclxuXHRcdFx0XHRcdDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHg9XCIwcHhcIiB5PVwiMHB4XCJcclxuXHRcdFx0XHRcdFx0IHdpZHRoPVwiMjRweFwiIGhlaWdodD1cIjI0cHhcIiB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMTAwIDEwMFwiPlxyXG5cdFx0XHRcdFx0PHBhdGggaWQ9XCJHZWFyc1wiIGQ9XCJNOTIuNDMsNDAuOTM1YzAsMy44ODktMy4xNTUsNy4wMzktNy4wNDEsNy4wMzljLTMuODg2LDAtNy4wMzktMy4xNS03LjAzOS03LjAzOVxyXG5cdFx0XHRcdFx0XHRjMC0zLjg4MywzLjE1My03LjAzOSw3LjAzOS03LjAzOUM4OS4yNzUsMzMuODk1LDkyLjQzLDM3LjA1Miw5Mi40Myw0MC45MzV6IE04NS4zNTQsMjcuODMxYy03LjIxOCwwLTEzLjA4LDUuODIyLTEzLjE0NSwxMy4wMjVcclxuXHRcdFx0XHRcdFx0bC04LjE5LDExLjczNmMtMC4zMzMtMC4wMzUtMC42NzItMC4wNTUtMS4wMTYtMC4wNTVjLTEuODI5LDAtMy41MzksMC41MDQtNS4wMDgsMS4zODFMMjAuOTAxLDM5LjAwMVxyXG5cdFx0XHRcdFx0XHRjLTAuOTctNC40LTQuOTAzLTcuNzE5LTkuNTg2LTcuNzE5Yy01LjQwNiwwLTkuODE1LDQuNDI0LTkuODE1LDkuODI4YzAsNS40MSw0LjQwOSw5LjgxNiw5LjgxNSw5LjgxNlxyXG5cdFx0XHRcdFx0XHRjMS44MywwLDMuNTQxLTAuNTA0LDUuMDA5LTEuMzc5bDM3LjA5NCwxNC44ODljMC45NTksNC40MTIsNC44OTMsNy43MzMsOS41ODQsNy43MzNjNS4wODMsMCw5LjI3NS0zLjg5Niw5Ljc2Mi04Ljg1OGwxMi41ODktOS4yMDFcclxuXHRcdFx0XHRcdFx0YzcuMjU4LDAsMTMuMTQ2LTUuODc3LDEzLjE0Ni0xMy4xMzVTOTIuNjEyLDI3LjgzMSw4NS4zNTQsMjcuODMxeiBNODUuMzU0LDMyLjE2M2M0Ljg2MywwLDguODEzLDMuOTUxLDguODEzLDguODEyXHJcblx0XHRcdFx0XHRcdGMwLDQuODYzLTMuOTUxLDguODAxLTguODEzLDguODAxYy00Ljg2MSwwLTguODEzLTMuOTM4LTguODEzLTguODAxQzc2LjU0MSwzNi4xMTQsODAuNDkzLDMyLjE2Myw4NS4zNTQsMzIuMTYzeiBNMTEuMzE1LDMzLjg4MlxyXG5cdFx0XHRcdFx0XHRjMi43NzMsMCw1LjE2NiwxLjU0OSw2LjM3NywzLjgzMmwtMy41ODgtMS40MzZ2MC4wMTZjLTIuODkxLTEuMDQxLTYuMTAyLDAuMzc1LTcuMjU2LDMuMjQ4Yy0xLjE1NiwyLjg3MywwLjE3NCw2LjEyNywyLjk3OCw3LjM3OVxyXG5cdFx0XHRcdFx0XHR2MC4wMTRsMy4wNDYsMS4yMTVjLTAuNTAxLDAuMTExLTEuMDIzLDAuMTc4LTEuNTU3LDAuMTc4Yy0zLjk5OSwwLTcuMjE1LTMuMjE3LTcuMjE1LTcuMjE3QzQuMSwzNy4xMTIsNy4zMTUsMzMuODgyLDExLjMxNSwzMy44ODJ6XHJcblx0XHRcdFx0XHRcdCBNNjMuMDAyLDU1LjEzNmM0LjAwMSwwLDcuMjE2LDMuMjE3LDcuMjE2LDcuMjE3YzAsMy45OTgtMy4yMTUsNy4yMTUtNy4yMTYsNy4yMTVjLTIuNzgxLDAtNS4xODQtMS41NTEtNi4zODktMy44NDRcclxuXHRcdFx0XHRcdFx0YzEuMTg3LDAuNDgsMi4zNzUsMC45NTMsMy41NiwxLjQzNmMyLjk0MSwxLjE4Miw2LjI5Mi0wLjI0Miw3LjQ3My0zLjE4MmMxLjE4My0yLjk0MS0wLjI1NC02LjI3NS0zLjE5Ni03LjQ1OWwtMy4wMDQtMS4yMDVcclxuXHRcdFx0XHRcdFx0QzYxLjk0Nyw1NS4yMDYsNjIuNDY5LDU1LjEzNiw2My4wMDIsNTUuMTM2elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYT5cclxuXHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdDwvZm9vdGVyPlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb290ZXI7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIGQzc2ltID0gcmVxdWlyZSgnZDNzaW0nKTtcclxuXHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zLmpzJyk7XHJcbnZhciBBcHBTdG9yZSA9IHJlcXVpcmUoJy4uLy4uL3N0b3Jlcy9BcHBTdG9yZS5qcycpO1xyXG5cclxudmFyIE5hdmJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHR9LFxyXG5cdGJ1eUl0ZW06ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaXRlbSA9IGQzc2ltLmthZGFsYVJvbGwodGhpcy5zdGF0ZS5pdGVtLnR5cGUpO1xyXG5cdFx0aXRlbS5zaXplID0gdGhpcy5zdGF0ZS5pdGVtLnNpemU7XHJcblx0XHRBcHBBY3Rpb25zLmFkZEl0ZW0oaXRlbSk7XHJcblx0XHRBcHBBY3Rpb25zLmluY3JlbWVudFNoYXJkcyh0aGlzLnN0YXRlLml0ZW0udHlwZSx0aGlzLnN0YXRlLml0ZW0uY29zdCk7XHJcblx0fSxcclxuXHJcblx0dG9nZ2xlT3B0aW9uczpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMudG9nZ2xlT3B0aW9ucygpO1xyXG5cdH0sXHJcblx0dG9nZ2xlU3RvcmU6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBBY3Rpb25zLnRvZ2dsZVN0b3JlKCk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShBcHBTdG9yZS5nZXRTZXR0aW5ncygpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4oXHJcblx0XHRcdDxuYXY+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2hhbScgb25DbGljaz17dGhpcy50b2dnbGVPcHRpb25zfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTMgMThoMTh2LTJIM3Yyem0wLTVoMTh2LTJIM3Yyem0wLTd2MmgxOFY2SDN6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0PGgxPjxhIGhyZWY9Jy9rYWRhbGEvJz5LYWRhbGEgU2ltdWxhdG9yPC9hPjwvaDE+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2J1eScgb25DbGljaz17dGhpcy5idXlJdGVtfT57dGhpcy5zdGF0ZS5pdGVtLnRleHR9PC9idXR0b24+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J3Nob3AnIG9uQ2xpY2s9e3RoaXMudG9nZ2xlU3RvcmV9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMTYgNlY0YzAtMS4xMS0uODktMi0yLTJoLTRjLTEuMTEgMC0yIC44OS0yIDJ2MkgydjEzYzAgMS4xMS44OSAyIDIgMmgxNmMxLjExIDAgMi0uODkgMi0yVjZoLTZ6bS02LTJoNHYyaC00VjR6TTkgMThWOWw3LjUgNEw5IDE4elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L25hdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0RDNJdGVtVG9vbHRpcEFybW9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdFxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS1hcm1vci1hcm1vclwiPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJiaWdcIj48cD48c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLmFybW9yfTwvc3Bhbj48L3A+PC9saT5cclxuXHRcdFx0XHQ8bGk+QXJtb3I8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwQXJtb3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcclxuXHREM0l0ZW1Ub29sdGlwQXJtb3IgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtYXJtb3IuanN4JyksXHJcblx0RDNJdGVtVG9vbHRpcFdlYXBvbiA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC13ZWFwb24uanN4JyksXHJcblx0RDNJdGVtVG9vbHRpcFN0YXQgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtc3RhdC5qc3gnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwQm9keSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgaWNvbkNsYXNzZXMgPSAnZDMtaWNvbiBkMy1pY29uLWl0ZW0gZDMtaWNvbi1pdGVtLWxhcmdlJztcclxuXHRcdHZhciBpdGVtVHlwZUNsYXNzID0nZDMtY29sb3ItJzsgXHJcblxyXG5cdFx0Ly9kZWNsYXJlIGFycmF5cyBmb3IgcHJpbWFyeSBhbmQgc2Vjb25kYXJ5IGl0ZW0gZWZmZWN0cy4gXHJcblx0XHQvL0FuIGl0ZW0gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBvZiBlYWNoLlxyXG5cdFx0Ly9DcmVhdGUgdGhlIGxpc3QgaXRlbSBmb3IgZWFjaCBzdGF0IGFuZCBwdXNoIGluIHRoZSBhcnJheXNcclxuXHRcdHZhciBwcmltYXJpZXMgPSBmb3JFYWNoKHRoaXMucHJvcHMuaXRlbS5wcmltYXJpZXMpO1xyXG5cdFx0dmFyIHNlY29uZGFyaWVzID0gZm9yRWFjaCh0aGlzLnByb3BzLml0ZW0uc2Vjb25kYXJpZXMpO1xyXG5cclxuXHRcdC8vaW1hZ2UgdXNlZCBhcyBpbmxpbmUtc3R5bGUgZm9yIGl0ZW0gdG9vbHRpcHNcclxuXHRcdHZhciBpbWFnZSA9IHtiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK3RoaXMucHJvcHMuaXRlbS5pbWFnZSsnKSd9O1xyXG5cclxuXHRcdC8vaWYgc3BlY2lmaWVkLCBzZXQgY29sb3IgZm9yIHRvb2x0aXAgY29tcG9uZW50c1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5jb2xvcikge1xyXG5cdFx0XHRpY29uQ2xhc3NlcyArPSAnIGQzLWljb24taXRlbS0nK3RoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdFx0aXRlbVR5cGVDbGFzcyArPXRoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdH1cclxuXHJcblx0XHQvL2lmIGl0IGlzIGFuIGFybW9yIG9yIHdlYXBvbiBhZGQgYWRkaXRpb25hbCBpbmZvIHRvIGljb24gc2VjdGlvblxyXG5cdFx0dmFyIHN1YkhlYWQ7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdhcm1vcicpKSB7XHJcblx0XHRcdHN1YkhlYWQgPSA8RDNJdGVtVG9vbHRpcEFybW9yIGFybW9yPXt0aGlzLnByb3BzLml0ZW0uYXJtb3J9Lz47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCd3ZWFwb25EcHMnKSkge1xyXG5cdFx0XHRzdWJIZWFkID0gPEQzSXRlbVRvb2x0aXBXZWFwb24gd2VhcG9uPXt0aGlzLnByb3BzLml0ZW19Lz47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9pZiBzb2NrZXRzIGFyZSBuZWVkZWRcclxuXHRcdHZhciBzb2NrZXRzID0gW107XHJcblx0XHR2YXIgc29ja2V0S2V5ID0gMDtcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0ucHJpbWFyaWVzLmhhc093blByb3BlcnR5KCdTb2NrZXQnKSkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0wOyBpIDwgdGhpcy5wcm9wcy5pdGVtLnByaW1hcmllcy5Tb2NrZXQudmFsdWU7IGkrKykge1xyXG5cdFx0XHRcdHNvY2tldHMucHVzaCg8bGkgY2xhc3NOYW1lPSdlbXB0eS1zb2NrZXQgZDMtY29sb3ItYmx1ZScga2V5PXtzb2NrZXRLZXl9ID5FbXB0eSBTb2NrZXQ8L2xpPik7XHJcblx0XHRcdFx0c29ja2V0S2V5Kys7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvL2RldGVybWluZSB0aGUgd29yZCB0byBwdXQgbmV4dCB0byBpdGVtIHR5cGVcclxuXHRcdHZhciBpdGVtVHlwZVByZWZpeDtcclxuXHRcdC8vY2hlY2sgaWYgYW5jaWVudCBzZXQgaXRlbSBhbmQgbWFudWFsbHkgcHV0XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLnJhcml0eSA9PT0gJ2FuY2llbnQnICYmIHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykpIHtcclxuXHRcdFx0aXRlbVR5cGVQcmVmaXggPSAnQW5jaWVudCBTZXQnO1xyXG5cdFx0fVxyXG5cdFx0Ly9vdGhlcndpc2UgaXQgaXMgc2V0L2EgcmFyaXR5IG9ubHlcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRpdGVtVHlwZVByZWZpeCA9ICh0aGlzLnByb3BzLml0ZW0uaGFzT3duUHJvcGVydHkoJ3NldCcpKSA/ICdzZXQnIDogdGhpcy5wcm9wcy5pdGVtLnJhcml0eTtcclxuXHRcdFx0Ly9jYXBpdGFsaXplIGZpcnN0IGxldHRlclxyXG5cdFx0XHRpdGVtVHlwZVByZWZpeCA9IGl0ZW1UeXBlUHJlZml4LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaXRlbVR5cGVQcmVmaXguc2xpY2UoMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ0b29sdGlwLWJvZHkgZWZmZWN0LWJnIGVmZmVjdC1iZy1hcm1vciBlZmZlY3QtYmctYXJtb3ItZGVmYXVsdFwiPlxyXG5cclxuXHRcdFx0XHR7LypUaGUgaXRlbSBpY29uIGFuZCBjb250YWluZXIsIGNvbG9yIG5lZWRlZCBmb3IgYmFja2dyb3VuZCovfVxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT17aWNvbkNsYXNzZXN9PlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1pdGVtLWdyYWRpZW50XCI+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImljb24taXRlbS1pbm5lciBpY29uLWl0ZW0tZGVmYXVsdFwiIHN0eWxlPXtpbWFnZX0+XHJcblx0XHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHQ8L3NwYW4+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZDMtaXRlbS1wcm9wZXJ0aWVzXCI+XHJcblxyXG5cdFx0XHRcdFx0ey8qU2xvdCBhbmQgaWYgY2xhc3Mgc3BlY2lmaWMqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLXR5cGUtcmlnaHRcIj5cclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiaXRlbS1zbG90XCI+e3RoaXMucHJvcHMuaXRlbS5zbG90LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5wcm9wcy5pdGVtLnNsb3Quc2xpY2UoMSl9PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiaXRlbS1jbGFzcy1zcGVjaWZpYyBkMy1jb2xvci13aGl0ZVwiPnt0aGlzLnByb3BzLml0ZW0uY2xhc3NTcGVjaWZpY308L2xpPlxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHJcblx0XHRcdFx0XHR7LypSYXJpdHkgb2YgdGhlIGl0ZW0gYW5kL2lmIGl0IGlzIGFuY2llbnQqL31cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9XCJpdGVtLXR5cGVcIj5cclxuXHRcdFx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT17aXRlbVR5cGVDbGFzc30+e2l0ZW1UeXBlUHJlZml4fSB7dGhpcy5wcm9wcy5pdGVtLnR5cGV9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHJcblx0XHRcdFx0XHR7LypJZiB0aGUgaXRlbSBpcyBhcm1vciBvciB3ZWFwb24sIHRoZSBrZXkgaXMgZGVmaW5lZCBhbmQgd2UgbmVlZCBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSB0b29sdGlwKi99XHJcblx0XHRcdFx0XHR7c3ViSGVhZH1cclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIml0ZW0tYmVmb3JlLWVmZmVjdHNcIj48L2Rpdj5cclxuXHJcblx0XHRcdFx0XHR7LypBY3R1YWwgaXRlbSBzdGF0cyovfVxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tZWZmZWN0c1wiPlxyXG5cdFx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJpdGVtLXByb3BlcnR5LWNhdGVnb3J5XCI+UHJpbWFyeTwvcD5cclxuXHRcdFx0XHRcdFx0e3ByaW1hcmllc31cclxuXHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwiaXRlbS1wcm9wZXJ0eS1jYXRlZ29yeVwiPlNlY29uZGFyeTwvcD5cclxuXHRcdFx0XHRcdFx0e3NlY29uZGFyaWVzfVxyXG5cdFx0XHRcdFx0XHR7c29ja2V0c31cclxuXHRcdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHRmdW5jdGlvbiBmb3JFYWNoKHN0YXRPYmplY3QpIHtcclxuXHRcdHZhciByZXN1bHRzID0gW107XHJcblxyXG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhzdGF0T2JqZWN0KTtcclxuXHRcdHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArKykge1xyXG5cdFx0XHR2YXIgc3RhdCA9IGtleXNbaV07XHJcblx0XHRcdHZhciB2YWwgPSBzdGF0T2JqZWN0W3N0YXRdO1xyXG5cdFx0XHRyZXN1bHRzLnB1c2goPEQzSXRlbVRvb2x0aXBTdGF0IHN0YXQ9e3ZhbH0ga2V5PXtpfSAvPik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0cztcclxuXHR9XHJcblxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBCb2R5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEZsYXZvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1leHRlbnNpb24nPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmbGF2b3InPnt0aGlzLnByb3BzLmZsYXZvcn08L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBGbGF2b3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwSGVhZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vaW5pdGlhbCBjbGFzcyBzZXQgZm9yIHRoZSB0b29sdGlwIGhlYWRcclxuXHRcdHZhciBkaXZDbGFzcz0ndG9vbHRpcC1oZWFkJztcclxuXHRcdHZhciBoM0NsYXNzPScnO1xyXG5cclxuXHRcdC8vbW9kaWZ5IHRoZSBjbGFzc2VzIGlmIGEgY29sb3Igd2FzIHBhc3NlZFxyXG5cdFx0Ly9mYWxsYmFjayBjb2xvciBpcyBoYW5kbGVkIGJ5IGQzLXRvb2x0aXAgY3NzXHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmNvbG9yKSB7XHJcblx0XHRcdGRpdkNsYXNzICs9ICcgdG9vbHRpcC1oZWFkLScgKyB0aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHRcdGgzQ2xhc3MgKz0gJ2QzLWNvbG9yLScgKyB0aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHR9XHJcblx0XHQvL21ha2UgdGhlIGZvbnQgc21hbGxlciBpZiB0aGUgbmFtZSBpcyBsb25nXHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLm5hbWUubGVuZ3RoID4gNDApIHtcclxuXHRcdFx0aDNDbGFzcys9ICcgc21hbGxlc3QnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZih0aGlzLnByb3BzLml0ZW0ubmFtZS5sZW5ndGggPjIyKSB7XHJcblx0XHRcdGgzQ2xhc3MrPSAnIHNtYWxsZXInO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtkaXZDbGFzc30+XHJcblx0XHRcdFx0PGgzIGNsYXNzTmFtZT17aDNDbGFzc30+XHJcblx0XHRcdFx0XHR7dGhpcy5wcm9wcy5pdGVtLm5hbWV9XHJcblx0XHRcdFx0PC9oMz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwSGVhZDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBTdGF0PSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHRleHQgPSBbXTtcclxuXHRcdHZhciB0ZXh0S2V5ID0gMDtcclxuXHRcdC8vY2hlY2sgdG8gbWFrZSBzdXJlIHRlbXBsYXRlIG5lZWRzIHRvIGJlIHdvcmtlZCB3aXRoIFxyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLnN0YXQudGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dmFyIHRlbXBsYXRlID0gdGhpcy5wcm9wcy5zdGF0LnRleHQ7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZS5pbmRleE9mKCd7JykgIT09IC0xKSB7XHJcblxyXG5cdFx0XHRcdC8vZGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgaGlnaGxpZ2h0ZWQgaXRlbXMgdGhlIHRvb2x0aXAgd2lsbCBoYXZlXHJcblx0XHRcdFx0dmFyIHBvc2l0aW9uID0gdGVtcGxhdGUuaW5kZXhPZigneycpO1xyXG5cdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0d2hpbGUgKHBvc2l0aW9uICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0Y291bnQrK1xyXG5cdFx0XHRcdFx0cG9zaXRpb24gPSB0ZW1wbGF0ZS5pbmRleE9mKCd7JywgcG9zaXRpb24rMSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgc3RhcnRQb3MgPSAwO1xyXG5cdFx0XHRcdHZhciBlbmRQb3MgPSAwO1xyXG5cdFx0XHRcdC8vbG9vcCB0aHJvdWdoIHRoaXMgY291bnQgb2YgdGVtcGxhdGluZ1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPTA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgc3RhcnRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ3snLHN0YXJ0UG9zKSsxO1xyXG5cdFx0XHRcdFx0c3RhcnRQb3MgPSBzdGFydEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZEluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZignfScsZW5kUG9zKTtcclxuXHRcdFx0XHRcdGVuZFBvcyA9IGVuZEluZGV4KzE7XHJcblx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2Uoc3RhcnRJbmRleCxlbmRJbmRleCk7XHJcblxyXG5cdFx0XHRcdFx0Ly9jaGVjayBmb3IgYW55IHJlcGxhY2VtZW50IG5lZWRlZFxyXG5cdFx0XHRcdFx0aWYgKHNsaWNlZC5pbmRleE9mKCckJykgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuc3RhdC52YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRzbGljZWQgPSBzbGljZWQucmVwbGFjZSgnJCcsIHRoaXMucHJvcHMuc3RhdC52YWx1ZVtpXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0c2xpY2VkID0gc2xpY2VkLnJlcGxhY2UoJyQnLHRoaXMucHJvcHMuc3RhdC52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvL2lmIHdlIGFyZSBhdCB0aGUgZmlyc3QgbG9vcCwgYWRkIGFueXRoaW5nIGZpcnN0IGFzIHRleHRcclxuXHRcdFx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaCh0ZW1wbGF0ZS5zcGxpdCgneycpWzBdKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvL2NyZWF0ZSBhbmQgcHVzaCB0aGUgdmFsdWUgaGlnaGxpZ2h0ZWQgZWxlbWVudFxyXG5cdFx0XHRcdFx0dmFyIGVsZW1lbnQgPSA8c3BhbiBjbGFzc05hbWU9J3ZhbHVlJyBrZXk9e3RleHRLZXl9PntzbGljZWR9PC9zcGFuPjtcclxuXHRcdFx0XHRcdHRleHRLZXkrKztcclxuXHRcdFx0XHRcdHRleHQucHVzaChlbGVtZW50KTtcclxuXHJcblx0XHRcdFx0XHQvL2lmIG5vdCB0aGUgbGFzdCBsb29wLCBwdXNoIGFueXRoaW5nIHVudGlsIG5leHQgYnJhY2tldFxyXG5cdFx0XHRcdFx0aWYgKGNvdW50ICE9PSAxICYmIGkgPCBjb3VudCAtIDEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG5leHRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJ3snLCBzdGFydFBvcyk7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCBuZXh0SW5kZXgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYoY291bnQgPT09IDEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHNsaWNlZCA9IHRlbXBsYXRlLnNsaWNlKGVuZEluZGV4KzEsIHRlbXBsYXRlLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaChzbGljZWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9sYXN0IGxvb3AgcHVzaCB0byB0aGUgZW5kXHJcblx0XHRcdFx0XHRlbHNlIGlmKGkgPT09IGNvdW50LTEgJiYgY291bnQgPiAxKSB7XHJcblx0XHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShlbmRJbmRleCsxLCB0ZW1wbGF0ZS5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR0ZXh0LnB1c2goc2xpY2VkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9ubyB0ZW1wbGF0ZSBhbmQgd2UganVzdCB0aHJvdyBhZmZpeCB1cFxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0ZXh0LnB1c2godGhpcy5wcm9wcy5zdGF0LnRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9kZXRlcm1pbmUgY29sb3Igb2YgYWZmaXggdGV4dFxyXG5cdFx0dmFyIHRleHRDb2xvciA9ICdkMy1pdGVtLXByb3BlcnR5LWRlZmF1bHQnO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc3RhdC5oYXNPd25Qcm9wZXJ0eSgndHlwZScpICYmIHRoaXMucHJvcHMuc3RhdC50eXBlID09PSAnbGVnZW5kYXJ5Jykge1xyXG5cdFx0XHR0ZXh0Q29sb3IgKz0gJyBkMy1jb2xvci1vcmFuZ2UnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRleHRDb2xvciArPSAnIGQzLWNvbG9yLWJsdWUnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblxyXG5cdFx0XHQ8bGkgY2xhc3NOYW1lPXt0ZXh0Q29sb3J9PlxyXG5cdFx0XHRcdDxwPnt0ZXh0fTwvcD5cclxuXHRcdFx0PC9saT5cclxuXHJcblx0XHQpO1xyXG5cclxuXHR9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcFN0YXQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwV2VhcG9uPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tYXJtb3Itd2VhcG9uIGl0ZW0td2VhcG9uLWRwc1wiPlxyXG5cdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJiaWdcIj48c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPntNYXRoLnJvdW5kKCB0aGlzLnByb3BzLndlYXBvbi53ZWFwb25EcHMgKiAxMCApIC8gMTB9PC9zcGFuPjwvbGk+XHJcblx0XHRcdFx0PGxpPkRhbWFnZSBQZXIgU2Vjb25kPC9saT5cclxuXHRcdFx0PC91bD5cclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tYXJtb3Itd2VhcG9uIGl0ZW0td2VhcG9uIGRhbWFnZVwiPlxyXG5cdFx0XHRcdDxsaT5cclxuXHRcdFx0XHRcdDxwPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLndlYXBvbi5kYW1hZ2VSYW5nZVswXX08L3NwYW4+IC1cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj4ge3RoaXMucHJvcHMud2VhcG9uLmRhbWFnZVJhbmdlWzFdfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZDMtY29sb3ItRkY4ODg4ODhcIj4gRGFtYWdlPC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9wPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0PHA+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLnNwZWVkfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiZDMtY29sb3ItRkY4ODg4ODhcIj4gQXR0YWNrcyBwZXIgU2Vjb25kPC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9wPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBXZWFwb247IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwSGVhZCA9IHJlcXVpcmUoJy4vZDMtdG9vbHRpcC1oZWFkLmpzeCcpO1xyXG52YXIgRDNJdGVtVG9vbHRpcEJvZHkgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtYm9keS5qc3gnKTtcclxudmFyIEQzSXRlbVRvb2x0aXBGbGF2b3IgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtZmxhdm9yLmpzeCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b29sdGlwQ2xhc3MgPSdkMy10b29sdGlwIGQzLXRvb2x0aXAtaXRlbSc7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLnJhcml0eSA9PT0gJ2FuY2llbnQnKSB7XHJcblx0XHRcdHRvb2x0aXBDbGFzcys9JyBhbmNpZW50J1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGFkZCBmbGF2b3JcclxuXHRcdHZhciBmbGF2b3I7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdmbGF2b3InKSkge1xyXG5cdFx0XHRmbGF2b3IgPSA8RDNJdGVtVG9vbHRpcEZsYXZvciBmbGF2b3I9e3RoaXMucHJvcHMuaXRlbS5mbGF2b3J9IC8+XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1jb250ZW50Jz5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dG9vbHRpcENsYXNzfT5cclxuXHRcdFx0XHRcdDxEM0l0ZW1Ub29sdGlwSGVhZCBpdGVtPXt0aGlzLnByb3BzLml0ZW19IC8+XHJcblx0XHRcdFx0XHQ8RDNJdGVtVG9vbHRpcEJvZHkgaXRlbT17dGhpcy5wcm9wcy5pdGVtfSAvPlxyXG5cdFx0XHRcdFx0e2ZsYXZvcn1cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5U3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvSW52ZW50b3J5U3RvcmUnKTtcclxuXHJcbnZhciBJdGVtTGVmdCA9IHJlcXVpcmUoJy4vaXRlbS1sZWZ0LmpzeCcpO1xyXG52YXIgSXRlbVJpZ2h0ID0gcmVxdWlyZSgnLi9pdGVtLXJpZ2h0LmpzeCcpO1xyXG52YXIgRDNJdGVtVG9vbHRpcCA9IHJlcXVpcmUoJy4uL2QzLXRvb2x0aXAvZDMtdG9vbHRpcC5qc3gnKTtcclxuXHJcbnZhciBJbmRpdmlkdWFsSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIEludmVudG9yeVN0b3JlLmdldEl0ZW0oKTtcclxuXHR9LFxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEludmVudG9yeVN0b3JlLmdldEl0ZW0oKSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vb25seSBzaG93IHRvb2x0aXBzL2J1dHRvbnMgaWYgdGhleSBhcmUgbmVlZGVkXHJcblx0XHR2YXIgdG9vbHRpcDtcclxuXHRcdHZhciBoaWRkZW5CdXR0b25zID0gJ2hpZGRlbic7XHJcblx0XHRpZiAodHlwZW9mIHRoaXMuc3RhdGUuaXRlbSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dG9vbHRpcCA9IDxkaXYgY2xhc3NOYW1lPSd0b29sdGlwLWNvbnRhaW5lcic+PEQzSXRlbVRvb2x0aXAgaXRlbT17dGhpcy5zdGF0ZS5pdGVtfS8+PC9kaXY+O1xyXG5cdFx0XHRoaWRkZW5CdXR0b25zID0gJyc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjb2wteHMtMTIgdG9vbHRpcC1vdmVyZmxvdyc+XHJcblx0XHRcdFx0XHRcdDxJdGVtTGVmdCBoaWRlQ2xhc3M9e2hpZGRlbkJ1dHRvbnN9IGhhc1ByZXZpb3VzPXt0aGlzLnN0YXRlLmhhc1ByZXZpb3VzfSAvPlxyXG5cdFx0XHRcdFx0XHR7dG9vbHRpcH1cclxuXHRcdFx0XHRcdFx0PEl0ZW1SaWdodCBoaWRlQ2xhc3M9e2hpZGRlbkJ1dHRvbnN9IGhhc05leHQ9e3RoaXMuc3RhdGUuaGFzTmV4dH0gLz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5kaXZpZHVhbEl0ZW07IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBJdGVtTGVmdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5wcmV2aW91c0l0ZW0oKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24gc2hpZnQgbGVmdCc7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzUHJldmlvdXMpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5oaWRlQ2xhc3N9PlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMjMuMTIgMTEuMTJMMjEgOWwtOSA5IDkgOSAyLjEyLTIuMTJMMTYuMjQgMTh6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJdGVtTGVmdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG5cclxudmFyIEl0ZW1SaWdodCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5uZXh0SXRlbSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbiBzaGlmdCByaWdodCc7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzTmV4dCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgZGlzYWJsZWQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmhpZGVDbGFzc30+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLl9oYW5kbGVDbGlja30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMzZcIiBoZWlnaHQ9XCIzNlwiIHZpZXdCb3g9XCIwIDAgMzYgMzZcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0xNSA5bC0yLjEyIDIuMTJMMTkuNzYgMThsLTYuODggNi44OEwxNSAyN2w5LTl6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJdGVtUmlnaHQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTbG90ID0gcmVxdWlyZSgnLi9pbnZlbnRvcnktc2xvdC5qc3gnKTtcclxudmFyIFByZXZpb3VzSW52ZW50b3J5ID0gcmVxdWlyZSgnLi9wcmV2aW91cy1pbnZlbnRvcnkuanN4Jyk7XHJcbnZhciBOZXh0SW52ZW50b3J5ID0gcmVxdWlyZSgnLi9uZXh0LWludmVudG9yeS5qc3gnKTtcclxuXHJcblxyXG52YXIgSW52ZW50b3J5Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgaW52ZW50b3J5U2xvdHMgPSBbXTtcclxuXHRcdHZhciBrZXk9MDtcclxuXHJcblx0XHQvL2xvb3AgdGhyb3VnaCB0aGUgMTAgY29sdW1ucyBvZiBpbnZlbnRvcnlcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG5cdFx0XHR2YXIgY29sdW1uTGVuZ3RoID0gdGhpcy5wcm9wcy5pbnZlbnRvcnlbaV0ubGVuZ3RoO1xyXG5cclxuXHRcdFx0Ly9hIGNoZWNrIGZvciB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoaXMgY29sdW1uXHJcblx0XHRcdHZhciBoZWlnaHRDb3VudCA9IDA7XHJcblxyXG5cdFx0XHQvL2FkZCBhbGwgZXhpc3RpbmcgaXRlbXMgdG8gdGhlIGNvbHVtbnNcclxuXHRcdFx0Zm9yICh2YXIgaj0wOyBqIDwgY29sdW1uTGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5pbnZlbnRvcnlbaV1bal0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHRoZWlnaHRDb3VudCArPSB0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXS5zaXplO1xyXG5cdFx0XHRcdFx0aW52ZW50b3J5U2xvdHMucHVzaCg8SW52ZW50b3J5U2xvdCBkYXRhPXt0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXX0ga2V5PXtrZXl9IGNvbHVtbj17aX0vPilcclxuXHRcdFx0XHRcdGtleSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9ub3cgZmlsbCBpbiB0aGUgcmVzdCBvZiB0aGUgY29sdW1uIHdpdGggYmxhbmsgc3BhY2VzXHJcblx0XHRcdHdoaWxlKGhlaWdodENvdW50IDwgNikge1xyXG5cdFx0XHRcdGhlaWdodENvdW50Kys7XHJcblx0XHRcdFx0aW52ZW50b3J5U2xvdHMucHVzaCg8SW52ZW50b3J5U2xvdCBkYXRhPXt1bmRlZmluZWR9IGtleT17a2V5fSBjb2x1bW49e2l9Lz4pO1xyXG5cdFx0XHRcdGtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktY29udGFpbmVyJz5cclxuXHRcdFx0XHQ8UHJldmlvdXNJbnZlbnRvcnkgaGFzUHJldmlvdXM9e3RoaXMucHJvcHMuaGFzUHJldmlvdXN9Lz5cclxuXHRcdFx0XHR7aW52ZW50b3J5U2xvdHN9XHJcblx0XHRcdFx0PE5leHRJbnZlbnRvcnkgaGFzTmV4dD17dGhpcy5wcm9wcy5oYXNOZXh0fS8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnlDb250YWluZXIiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXAgPSByZXF1aXJlKCcuLi9kMy10b29sdGlwL2QzLXRvb2x0aXAuanN4Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5U2xvdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0VG9vbHRpcE9mZnNldCgpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRUb29sdGlwT2Zmc2V0KCk7XHJcblx0fSxcclxuXHJcblx0c2V0VG9vbHRpcE9mZnNldDpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBlbGVtID0gUmVhY3QuZmluZERPTU5vZGUodGhpcyk7XHJcblxyXG5cdFx0Ly9pZiB0aGUgaW52ZW50b3J5IHNsb3QgaGFzIGNoaWxkcmVuIChjb250ZW50KVxyXG5cdFx0aWYgKGVsZW0uY2hpbGRyZW4gJiYgZWxlbS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHZhciBlbGVtTG9jYXRpb24gPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuXHRcdFx0dmFyIHRvb2x0aXBIZWlnaHQgPSBlbGVtLmNoaWxkcmVuWzRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuXHRcdFx0dmFyIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0XHRcdC8vY2hlY2sgaWYgdGhlIHRvb2x0aXAgZml0cyB3aGVyZSBpdCBjdXJyZW50bHkgaXNcclxuXHRcdFx0aWYgKCEodG9vbHRpcEhlaWdodCArIGVsZW1Mb2NhdGlvbiA8IHdpbmRvd0hlaWdodCkpIHtcclxuXHRcdFx0XHR2YXIgb2Zmc2V0ID0gKHRvb2x0aXBIZWlnaHQgKyBlbGVtTG9jYXRpb24gLSB3aW5kb3dIZWlnaHQpO1xyXG5cclxuXHRcdFx0XHQvL2lmIHRoZSB0b29sdGlwIGlzIGJpZ2dlciB0aGFuIHdpbmRvdywganVzdCBzaG93IGF0IHRvcCBvZiB3aW5kb3dcclxuXHRcdFx0XHRpZiAob2Zmc2V0ID4gd2luZG93SGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRlbGVtLmNoaWxkcmVuWzRdLnN0eWxlLnRvcCA9ICctJysoZWxlbUxvY2F0aW9uLTIwKSsncHgnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vanVzdCBtb3ZlIGl0IHVwIGEgbGl0dGxlIHdpdGggYSBiaXQgYXQgYm90dG9tXHJcblx0XHRcdFx0XHRlbGVtLmNoaWxkcmVuWzRdLnN0eWxlLnRvcCA9ICctJysob2Zmc2V0KzEwKSsncHgnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNsb3RDb250ZW50PSBbXTtcclxuXHRcdHZhciBzbG90Q29udGVudEtleSA9IDA7XHJcblxyXG5cdFx0dmFyIHNsb3RDbGFzcz0naW52ZW50b3J5LXNsb3QnO1xyXG5cdFx0Ly9jaGVjayB0byBtYWtlIHN1cmUgYW4gYWN0dWFsIGl0ZW0gaXMgaW4gdGhlIGludmVudG9yeSBzbG90XHJcblx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMuZGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0Ly9jaGFuZ2UgdGhlIHNpemUgdG8gbGFyZ2UgaWYgaXQgaXMgYSBsYXJnZSBpdGVtXHJcblx0XHRcdGlmKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnc2l6ZScpICYmIHRoaXMucHJvcHMuZGF0YS5zaXplID09PSAyKSB7XHJcblx0XHRcdFx0c2xvdENsYXNzICs9ICcgbGFyZ2UnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZih0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3Jhcml0eScpKSB7XHJcblx0XHRcdFx0dmFyIGJndXJsO1xyXG5cdFx0XHRcdHZhciBib3JkZXJDb2xvcj0nIzMwMmEyMSc7XHJcblxyXG5cdFx0XHRcdHN3aXRjaCh0aGlzLnByb3BzLmRhdGEucmFyaXR5KSB7XHJcblx0XHRcdFx0XHRjYXNlICdtYWdpYyc6XHJcblx0XHRcdFx0XHRcdGJndXJsPScvL3VzLmJhdHRsZS5uZXQvZDMvc3RhdGljL2ltYWdlcy9pdGVtL2ljb24tYmdzL2JsdWUucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyM3OTc5ZDQnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3JhcmUnOlxyXG5cdFx0XHRcdFx0XHRiZ3VybD0nLy91cy5iYXR0bGUubmV0L2QzL3N0YXRpYy9pbWFnZXMvaXRlbS9pY29uLWJncy95ZWxsb3cucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyNmOGNjMzUnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZ2VuZGFyeSc6XHJcblx0XHRcdFx0XHRcdGJndXJsPScvL3VzLmJhdHRsZS5uZXQvZDMvc3RhdGljL2ltYWdlcy9pdGVtL2ljb24tYmdzL29yYW5nZS5wbmcnO1xyXG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcj0nI2JmNjQyZic7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnYW5jaWVudCc6XHJcblx0XHRcdFx0XHRcdGJndXJsPScvL3VzLmJhdHRsZS5uZXQvZDMvc3RhdGljL2ltYWdlcy9pdGVtL2ljb24tYmdzL29yYW5nZS5wbmcnO1xyXG5cdFx0XHRcdFx0XHRib3JkZXJDb2xvcj0nI2JmNjQyZic7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0Ly9ub29wXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvL3N3aXRjaCBiZyB0byBncmVlbiBpZiBpdGVtIGlzIHBhcnQgb2YgYSBzZXRcclxuXHRcdFx0XHRpZiAodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdzZXQnKSkge1xyXG5cdFx0XHRcdFx0Ymd1cmw9Jy8vdXMuYmF0dGxlLm5ldC9kMy9zdGF0aWMvaW1hZ2VzL2l0ZW0vaWNvbi1iZ3MvZ3JlZW4ucG5nJztcclxuXHRcdFx0XHRcdGJvcmRlckNvbG9yPScjOGJkNDQyJztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2YgYmd1cmwgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR2YXIgaW5saW5lID0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK2JndXJsKycpJ1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHNsb3RDb250ZW50LnB1c2goPGRpdiBzdHlsZT17aW5saW5lfSBjbGFzc05hbWU9J2ludmVudG9yeS1iZycga2V5PXtzbG90Q29udGVudEtleX0+PC9kaXY+KVxyXG5cdFx0XHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vc2V0IHRoZSBpdGVtIGltYWdlXHJcblx0XHRcdGlmICh0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ2ltYWdlJykpIHtcclxuXHRcdFx0XHR2YXIgaW5saW5lID0ge2JhY2tncm91bmRJbWFnZTondXJsKCcrdGhpcy5wcm9wcy5kYXRhLmltYWdlKycpJ307XHJcblx0XHRcdFx0c2xvdENvbnRlbnQucHVzaCg8ZGl2IHN0eWxlPXtpbmxpbmV9IGNsYXNzTmFtZT0naW52ZW50b3J5LWltYWdlJyBrZXk9e3Nsb3RDb250ZW50S2V5fT48L2Rpdj4pO1xyXG5cdFx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vYWRkIGEgbGluayB0byBhY3RpdmF0ZSB0b29sdGlwXHJcblx0XHRcdHNsb3RDb250ZW50LnB1c2goPGEgY2xhc3NOYW1lPSd0b29sdGlwLWxpbmsnIGtleT17c2xvdENvbnRlbnRLZXl9PjwvYT4pO1xyXG5cdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cclxuXHRcdFx0Ly9hZGQgYSBncmFkaWVudCBtYXNrXHJcblx0XHRcdHNsb3RDb250ZW50LnB1c2goPGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1pdGVtLWdyYWRpZW50JyBrZXk9e3Nsb3RDb250ZW50S2V5fT48L2Rpdj4pO1xyXG5cdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cclxuXHRcdFx0Ly9hZGQgYSBoaWRkZW4gdG9vbHRpcFxyXG5cdFx0XHR2YXIgaW5saW5lO1xyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5jb2x1bW4gPCA1KSB7XHJcblx0XHRcdFx0aW5saW5lID0ge2xlZnQ6JzUwcHgnfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpbmxpbmUgPSB7cmlnaHQ6JzUwcHgnfTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2xvdENvbnRlbnQucHVzaChcclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1jb250YWluZXInIHN0eWxlPXtpbmxpbmV9IGtleT17c2xvdENvbnRlbnRLZXl9PlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXAgaXRlbT17dGhpcy5wcm9wcy5kYXRhfS8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdCk7XHJcblx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblxyXG5cdFx0XHQvL2FkZCBzb2NrZXRzIG9uIGhvdmVyXHJcblx0XHRcdGlmICh0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3ByaW1hcmllcycpICYmIHRoaXMucHJvcHMuZGF0YS5wcmltYXJpZXMuaGFzT3duUHJvcGVydHkoJ1NvY2tldCcpKSB7XHJcblx0XHRcdFx0dmFyIHNvY2tldHM7XHJcblx0XHRcdFx0dmFyIHNvY2tldENvdW50ID0gdGhpcy5wcm9wcy5kYXRhLnByaW1hcmllcy5Tb2NrZXQudmFsdWU7XHJcblx0XHRcdFx0dmFyIHNvY2tldENvbnRlbnRzID0gW107XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9MDsgaSA8IHNvY2tldENvdW50OyBpKyspIHtcclxuXHRcdFx0XHRcdHNvY2tldENvbnRlbnRzLnB1c2goPGRpdiBjbGFzc05hbWU9J3NvY2tldCcga2V5PXtpfT48L2Rpdj4pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzb2NrZXRzID0gPGRpdiBjbGFzc05hbWU9J3NvY2tldHMtd3JhcHBlcicga2V5PXtzbG90Q29udGVudEtleX0+PGRpdiBjbGFzc05hbWU9J3NvY2tldHMtYWxpZ24nPntzb2NrZXRDb250ZW50c308L2Rpdj48L2Rpdj47XHJcblx0XHRcdFx0c2xvdENvbnRlbnQucHVzaChzb2NrZXRzKTtcclxuXHRcdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtzbG90Q2xhc3N9IHN0eWxlPXt7Ym9yZGVyQ29sb3I6Ym9yZGVyQ29sb3J9fT5cclxuXHRcdFx0XHR7c2xvdENvbnRlbnR9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnlTbG90OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5Q29udGFpbmVyID0gcmVxdWlyZSgnLi9pbnZlbnRvcnktY29udGFpbmVyLmpzeCcpO1xyXG52YXIgSW52ZW50b3J5U3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvSW52ZW50b3J5U3RvcmUnKTtcclxuXHJcbnZhciBJbnZlbnRvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBJbnZlbnRvcnlTdG9yZS5nZXRJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEludmVudG9yeVN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEludmVudG9yeVN0b3JlLmdldEludmVudG9yeSgpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LXNlY3Rpb24nPlxyXG5cdFx0XHRcdDxJbnZlbnRvcnlDb250YWluZXIgXHJcblx0XHRcdFx0XHRpbnZlbnRvcnk9e3RoaXMuc3RhdGUuY3VycmVudEludmVudG9yeX0gXHJcblx0XHRcdFx0XHRoYXNQcmV2aW91cz17dHlwZW9mIHRoaXMuc3RhdGUucHJldmlvdXNJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnfSBcclxuXHRcdFx0XHRcdGhhc05leHQ9e3R5cGVvZiB0aGlzLnN0YXRlLm5leHRJbnZlbnRvcnkgIT09ICd1bmRlZmluZWQnfVxyXG5cdFx0XHRcdC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBOZXh0SW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMubmV4dEludmVudG9yeSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbic7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzTmV4dCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgZGlzYWJsZWQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktYnV0dG9uLWNvbnRhaW5lcic+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLl9oYW5kbGVDbGlja30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMzZcIiBoZWlnaHQ9XCIzNlwiIHZpZXdCb3g9XCIwIDAgMzYgMzZcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0xNSA5bC0yLjEyIDIuMTJMMTkuNzYgMThsLTYuODggNi44OEwxNSAyN2w5LTl6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZXh0SW52ZW50b3J5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgUHJldmlvdXNJbnZlbnRvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0X2hhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy5wcmV2aW91c0ludmVudG9yeSgpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnaW52ZW50b3J5LWJ1dHRvbic7XHJcblx0XHRpZiAoIXRoaXMucHJvcHMuaGFzUHJldmlvdXMpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWJ1dHRvbi1jb250YWluZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMjMuMTIgMTEuMTJMMjEgOWwtOSA5IDkgOSAyLjEyLTIuMTJMMTYuMjQgMTh6XCIvPlxyXG5cdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcmV2aW91c0ludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIENsYXNzU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdC8vc3RhdGUgaXMgaGFuZGxlZCBpbiB0aGUgcGFyZW50IGNvbXBvbmVudFxyXG5cdC8vdGhpcyBmdW5jdGlvbiBpcyB1cCB0aGVyZVxyXG5cdGhhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VDbGFzcyh0aGlzLnByb3BzLm5hbWUpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2hvcnRlbmVkTmFtZXMgPSB7XHJcblx0XHRcdEJhcmJhcmlhbjonYmFyYicsXHJcblx0XHRcdENydXNhZGVyOidjcnVzJyxcclxuXHRcdFx0J0RlbW9uIEh1bnRlcic6J2RoJyxcclxuXHRcdFx0TW9uazonbW9uaycsXHJcblx0XHRcdCdXaXRjaCBEb2N0b3InOid3ZCcsXHJcblx0XHRcdFdpemFyZDond2l6J1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBidXR0b25DbGFzcyA9ICdjbGFzcy1zZWxlY3Rvcic7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgc2VsZWN0ZWQnXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGltYWdlQ2xhc3M9IHRoaXMucHJvcHMubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCcnKTtcclxuXHRcdGltYWdlQ2xhc3MrPSB0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxsaT5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2ltYWdlQ2xhc3N9PjwvZGl2PlxyXG5cdFx0XHRcdFx0PHNwYW4+e3RoaXMucHJvcHMubmFtZS50b0xvd2VyQ2FzZSgpfTwvc3Bhbj5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInNob3J0ZW5lZFwiPntzaG9ydGVuZWROYW1lc1t0aGlzLnByb3BzLm5hbWVdfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9saT5cclxuXHRcdCk7XHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzU2VsZWN0b3JCdXR0b247IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIENsYXNzU2VsZWN0b3JCdXR0b24gPSByZXF1aXJlKCcuL2NsYXNzLXNlbGVjdG9yLWJ1dHRvbi5qc3gnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZENsYXNzZXMgPSBbJ0JhcmJhcmlhbicsJ0NydXNhZGVyJywnRGVtb24gSHVudGVyJywnTW9uaycsJ1dpdGNoIERvY3RvcicsJ1dpemFyZCddO1xyXG5cdFx0dmFyIGRDbGFzc2VzTGVuZ3RoID0gZENsYXNzZXMubGVuZ3RoO1xyXG5cclxuXHRcdHZhciBjbGFzc1NlbGVjdG9ycyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaSA9MDsgaSA8IGRDbGFzc2VzTGVuZ3RoO2krKykge1xyXG5cclxuXHRcdFx0Ly9jaGVjayBmb3Igc2VsZWN0ZWQgY2xhc3Mgc3RvcmVkIGluIHN0YXRlIG9mIHRoaXMgY29tcG9uZW50XHJcblx0XHRcdHZhciBzZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gZENsYXNzZXNbaV0pIHtcclxuXHRcdFx0XHRzZWxlY3RlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vcHV0IHNlbGVjdG9ycyBpbiBhcnJheSB0byBiZSByZW5kZXJlZFxyXG5cdFx0XHRjbGFzc1NlbGVjdG9ycy5wdXNoKFxyXG5cdFx0XHRcdDxDbGFzc1NlbGVjdG9yQnV0dG9uIFxyXG5cdFx0XHRcdFx0bmFtZT17ZENsYXNzZXNbaV19IFxyXG5cdFx0XHRcdFx0Y2hhbmdlQ2xhc3M9e3RoaXMucHJvcHMuY2hhbmdlQ2xhc3N9IFxyXG5cdFx0XHRcdFx0a2V5PXtpfSBcclxuXHRcdFx0XHRcdHNlbGVjdGVkPXtzZWxlY3RlZH1cclxuXHRcdFx0XHRcdGdlbmRlcj17dGhpcy5wcm9wcy5nZW5kZXJ9XHJcblx0XHRcdFx0XHQvPlxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdDx1bCBjbGFzc05hbWU9J2NsYXNzLXNlbGVjdG9yJz5cclxuXHRcdFx0XHRcdHtjbGFzc1NlbGVjdG9yc31cclxuXHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzU2VsZWN0b3I7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBHZW5kZXJTZWxlY3RvckJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0dXBkYXRlR2VuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXIodGhpcy5wcm9wcy5nZW5kZXIpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3M9J2dlbmRlci1zZWxlY3RvciAnK3RoaXMucHJvcHMuZ2VuZGVyLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgc2VsZWN0ZWQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdidXR0b24td3JhcHBlcic+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLnVwZGF0ZUdlbmRlcn0gPlxyXG5cdFx0XHRcdFx0PGRpdj48L2Rpdj5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmRlclNlbGVjdG9yQnV0dG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSByZXF1aXJlKCcuL2dlbmRlci1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBtYWxlU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gJ01hbGUnKTtcclxuXHRcdHZhciBmZW1hbGVTZWxlY3RlZCA9ICh0aGlzLnByb3BzLnNlbGVjdGVkID09PSAnRmVtYWxlJyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dlbmRlci1zZWxlY3Rvcic+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yQnV0dG9uIGdlbmRlcj0nTWFsZScgY2hhbmdlR2VuZGVyPXt0aGlzLnByb3BzLmNoYW5nZUdlbmRlcn0gc2VsZWN0ZWQ9e21hbGVTZWxlY3RlZH0gLz5cclxuXHRcdFx0XHQ8R2VuZGVyU2VsZWN0b3JCdXR0b24gZ2VuZGVyPSdGZW1hbGUnIGNoYW5nZUdlbmRlcj17dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXtmZW1hbGVTZWxlY3RlZH0gLz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmRlclNlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSGFyZGNvcmVDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHR1cGRhdGVIYXJkY29yZTpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VIYXJkY29yZSghdGhpcy5wcm9wcy5oYXJkY29yZSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2NoZWNrYm94LXdyYXBwZXInPlxyXG5cdFx0XHRcdDxsYWJlbD5cclxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPSdjaGVja2JveCcgY2xhc3NOYW1lPSdvcHRpb25zLWNoZWNrYm94JyBjaGVja2VkPXt0aGlzLnByb3BzLmhhcmRjb3JlfSBvbkNoYW5nZT17dGhpcy51cGRhdGVIYXJkY29yZX0vPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdjaGVja2JveC1sYWJlbCc+SGFyZGNvcmUgPHNwYW4gY2xhc3NOYW1lPSdoaWRkZW4tc20nPkhlcm88L3NwYW4+PC9zcGFuPlxyXG5cdFx0XHRcdDwvbGFiZWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYXJkY29yZUNoZWNrYm94OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucy5qcycpO1xyXG52YXIgQXBwU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvQXBwU3RvcmUuanMnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yID0gcmVxdWlyZSgnLi9jbGFzcy1zZWxlY3Rvci5qc3gnKTtcclxudmFyIEdlbmRlclNlbGVjdG9yID0gcmVxdWlyZSgnLi9nZW5kZXItc2VsZWN0b3IuanN4Jyk7XHJcbnZhciBTZWFzb25hbENoZWNrYm94ID0gcmVxdWlyZSgnLi9zZWFzb25hbC1jaGVja2JveC5qc3gnKTtcclxudmFyIEhhcmRjb3JlQ2hlY2tib3ggPSByZXF1aXJlKCcuL2hhcmRjb3JlLWNoZWNrYm94LmpzeCcpO1xyXG5cclxudmFyIE9wdGlvbnNQYW5lbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGluaXRpYWwgPSBBcHBTdG9yZS5nZXRTZXR0aW5ncygpO1xyXG5cdFx0ZDNzaW0uc2V0S2FkYWxhKGluaXRpYWwuZENsYXNzLGluaXRpYWwuc2Vhc29uYWwsaW5pdGlhbC5oYXJkY29yZSk7XHJcblx0XHRyZXR1cm4gaW5pdGlhbDtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdF9vbkNoYW5nZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKSk7XHJcblx0fSxcclxuXHJcblx0Y2hhbmdlR2VuZGVyOmZ1bmN0aW9uKGdlbmRlcikge1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdnZW5kZXInLGdlbmRlcik7XHJcblx0fSxcclxuXHRjaGFuZ2VDbGFzczpmdW5jdGlvbihkQ2xhc3MpIHtcclxuXHRcdEFwcEFjdGlvbnMuY2hhbmdlU2V0dGluZygnZENsYXNzJyxkQ2xhc3MpO1xyXG5cdH0sXHJcblx0Y2hhbmdlSGFyZGNvcmU6ZnVuY3Rpb24oYm9vbCkge1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdoYXJkY29yZScsYm9vbCk7XHJcblx0fSxcclxuXHRjaGFuZ2VTZWFzb25hbDpmdW5jdGlvbihib29sKSB7XHJcblx0XHRBcHBBY3Rpb25zLmNoYW5nZVNldHRpbmcoJ3NlYXNvbmFsJyxib29sKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIG9wdHNDbGFzcyA9ICdvcHRpb25zLXBhbmVsJztcclxuXHRcdGlmICh0aGlzLnN0YXRlLm9wdGlvbnMpIHtcclxuXHRcdFx0b3B0c0NsYXNzICs9ICcgdW5oaWRlJztcclxuXHRcdH1cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGNsYXNzTmFtZT17b3B0c0NsYXNzfT5cclxuXHRcdFx0XHQ8Q2xhc3NTZWxlY3RvciBjaGFuZ2VDbGFzcz17dGhpcy5jaGFuZ2VDbGFzc30gc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuZENsYXNzfSBnZW5kZXI9e3RoaXMuc3RhdGUuZ2VuZGVyfS8+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yIGNoYW5nZUdlbmRlcj17dGhpcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXt0aGlzLnN0YXRlLmdlbmRlcn0vPlxyXG5cdFx0XHRcdDxTZWFzb25hbENoZWNrYm94IHNlYXNvbmFsPXt0aGlzLnN0YXRlLnNlYXNvbmFsfSBjaGFuZ2VTZWFzb25hbD17dGhpcy5jaGFuZ2VTZWFzb25hbH0vPlxyXG5cdFx0XHRcdDxIYXJkY29yZUNoZWNrYm94IGhhcmRjb3JlPXt0aGlzLnN0YXRlLmhhcmRjb3JlfSBjaGFuZ2VIYXJkY29yZT17dGhpcy5jaGFuZ2VIYXJkY29yZX0vPlxyXG5cdFx0XHQ8L3NlY3Rpb24+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9wdGlvbnNQYW5lbDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIFNlYXNvbmFsQ2hlY2tib3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0dXBkYXRlU2Vhc29uYWw6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnByb3BzLmNoYW5nZVNlYXNvbmFsKCF0aGlzLnByb3BzLnNlYXNvbmFsKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2hlY2tib3gtd3JhcHBlcic+XHJcblx0XHRcdFx0PGxhYmVsPlxyXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzc05hbWU9J29wdGlvbnMtY2hlY2tib3gnIGNoZWNrZWQ9e3RoaXMucHJvcHMuc2Vhc29uYWx9IG9uQ2hhbmdlPXt0aGlzLnVwZGF0ZVNlYXNvbmFsfS8+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2NoZWNrYm94LWxhYmVsJz5TZWFzb25hbCA8c3BhbiBjbGFzc05hbWU9J2hpZGRlbi1zbSc+SGVybzwvc3Bhbj48L3NwYW4+XHJcblx0XHRcdFx0PC9sYWJlbD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXNvbmFsQ2hlY2tib3g7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIGQzc2ltID0gcmVxdWlyZSgnZDNzaW0nKTtcclxuXHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcbnZhciBBcHBTdG9yZSA9IHJlcXVpcmUoJy4uLy4uL3N0b3Jlcy9BcHBTdG9yZScpO1xyXG5cclxudmFyIEthZGFsYUl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1vYmlsZTpBcHBTdG9yZS5nZXRTZXR0aW5ncygpLm1vYmlsZSxcclxuXHRcdFx0c2hhcmRDb3VudDpBcHBTdG9yZS5nZXRTaGFyZHModGhpcy5wcm9wcy5pdGVtLnR5cGUpXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdHNoYXJkQ291bnQ6QXBwU3RvcmUuZ2V0U2hhcmRzKHRoaXMucHJvcHMuaXRlbS50eXBlKVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRidXlJdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0Ly9pbmNyZW1lbnQgdGhlIGJsb29kIHNoYXJkIGNvdW50XHJcblx0XHR2YXIgY3VycmVudENvdW50ID0gdGhpcy5zdGF0ZS5zaGFyZENvdW50O1xyXG5cdFx0Y3VycmVudENvdW50ICs9IHRoaXMucHJvcHMuaXRlbS5jb3N0O1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2hhcmRDb3VudDpjdXJyZW50Q291bnR9KTtcclxuXHJcblx0XHR2YXIgaXRlbSA9IGQzc2ltLmthZGFsYVJvbGwodGhpcy5wcm9wcy5pdGVtLnR5cGUpO1xyXG5cdFx0aXRlbS5zaXplID0gdGhpcy5wcm9wcy5pdGVtLnNpemU7XHJcblx0XHRBcHBBY3Rpb25zLmFkZEl0ZW0oaXRlbSk7XHJcblx0XHRBcHBBY3Rpb25zLmNoYW5nZVNldHRpbmcoJ2l0ZW0nLHRoaXMucHJvcHMuaXRlbSk7XHJcblx0XHRBcHBBY3Rpb25zLmluY3JlbWVudFNoYXJkcyh0aGlzLnByb3BzLml0ZW0udHlwZSx0aGlzLnByb3BzLml0ZW0uY29zdCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUubW9iaWxlKSB7XHJcblx0XHRcdEFwcEFjdGlvbnMudG9nZ2xlU3RvcmUoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0Q291bnQ6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtzaGFyZENvdW50OjB9KTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGljb25DbGFzcyA9ICdrYWRhbGEtaWNvbic7XHJcblx0XHRpY29uQ2xhc3MrPScgJyt0aGlzLnByb3BzLml0ZW0udHlwZTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0na2FkYWxhLWl0ZW0nPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdrYWRhbGEnIG9uQ2xpY2s9e3RoaXMuYnV5SXRlbX0+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17aWNvbkNsYXNzfT48L2Rpdj5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLml0ZW0uY29zdH08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2thZGFsYS1jb250ZW50Jz5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0na2FkYWxhLWl0ZW0tdGl0bGUnIG9uQ2xpY2s9e3RoaXMuYnV5SXRlbX0+e3RoaXMucHJvcHMuaXRlbS50ZXh0fTwvc3Bhbj5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nc2hhcmQtY291bnQnPlxyXG5cdFx0XHRcdFx0XHR7dGhpcy5zdGF0ZS5zaGFyZENvdW50fVxyXG5cdFx0XHRcdFx0XHQ8YSBjbGFzc05hbWU9J3NoYXJkLWRlbGV0ZScgb25DbGljaz17dGhpcy5yZXNldENvdW50fT5cclxuXHRcdFx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHpcIi8+XHJcblx0XHRcdFx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFx0XHRcdDwvYT5cclxuXHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEthZGFsYUl0ZW07IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBLYWRhbGFJdGVtID0gcmVxdWlyZSgnLi9rYWRhbGEtaXRlbS5qc3gnKTtcclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0FwcFN0b3JlJyk7XHJcblxyXG52YXIgS2FkYWxhU3RvcmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIEFwcFN0b3JlLmdldFNldHRpbmdzKCk7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0b3JlLmdldFNldHRpbmdzKCkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIga2FkYWxhQ2xhc3MgPSAna2FkYWxhLXN0b3JlJztcclxuXHRcdC8vdGhpcyBpcyBhIGNoZWNrIGZvciBpbnRlcm5ldCBleHBsb3JlclxyXG5cdFx0Ly9mbGV4LWRpcmVjdGlvbjpjb2x1bW4gYnJlYWtzIGV2ZXJ5dGhpbmcgc28gd2UgZGV0ZWN0IGZvciBpdCBoZXJlXHJcblx0XHRpZiAoKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgJykgIT09IC0xKXx8IW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQuKnJ2XFw6MTFcXC4vKSkge1xyXG5cdFx0XHRrYWRhbGFDbGFzcys9JyBub2llJztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5zdGF0ZS5zdG9yZSkge1xyXG5cdFx0XHRrYWRhbGFDbGFzcys9JyB1bmhpZGUnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpdGVtcyA9IFtcclxuXHRcdFx0e3R5cGU6J2hlbG0nLHRleHQ6J015c3RlcnkgSGVsbWV0Jyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidib290cycsdGV4dDonTXlzdGVyeSBCb290cycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonYmVsdCcsdGV4dDonTXlzdGVyeSBCZWx0Jyxjb3N0OjI1LHNpemU6MX0sXHJcblx0XHRcdHt0eXBlOidwYW50cycsdGV4dDonTXlzdGVyeSBQYW50cycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonZ2xvdmVzJyx0ZXh0OidNeXN0ZXJ5IEdsb3ZlcycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonY2hlc3QnLHRleHQ6J015c3RlcnkgQ2hlc3QnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3Nob3VsZGVycycsdGV4dDonTXlzdGVyeSBTaG91bGRlcnMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2JyYWNlcnMnLHRleHQ6J015c3RlcnkgQnJhY2VycycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZToncXVpdmVyJyx0ZXh0OidNeXN0ZXJ5IFF1aXZlcicsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonbW9qbycsdGV4dDonTXlzdGVyeSBNb2pvJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidzb3VyY2UnLHRleHQ6J015c3RlcnkgU291cmNlJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidzaGllbGQnLHRleHQ6J015c3RlcnkgU2hpZWxkJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidvbmVoYW5kJyx0ZXh0OicxLUggTXlzdGVyeSBXZWFwb24nLGNvc3Q6NzUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3R3b2hhbmQnLHRleHQ6JzItSCBNeXN0ZXJ5IFdlYXBvbicsY29zdDo3NSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZToncmluZycsdGV4dDonTXlzdGVyeSBSaW5nJyxjb3N0OjUwLHNpemU6MX0sXHJcblx0XHRcdHt0eXBlOidhbXVsZXQnLHRleHQ6J015c3RlcnkgQW11bGV0Jyxjb3N0OjEwMCxzaXplOjF9XHJcblx0XHRdXHJcblxyXG5cdFx0dmFyIGthZGFsYVNsb3RzID0gW107XHJcblx0XHR2YXIgaXRlbXNMZW5ndGggPSBpdGVtcy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwgaXRlbXNMZW5ndGg7IGkrKykge1xyXG5cdFx0XHRrYWRhbGFTbG90cy5wdXNoKDxLYWRhbGFJdGVtIGtleT17aX0gaXRlbT17aXRlbXNbaV19Lz4pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtrYWRhbGFDbGFzc30gaWQ9J2thZGFsYS1zdG9yZSc+XHJcblx0XHRcdFx0e2thZGFsYVNsb3RzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2FkYWxhU3RvcmU7IiwidmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xyXG5cdEFERF9JVEVNOm51bGwsXHJcblxyXG5cdFBSRVZfSU5WOm51bGwsXHJcblx0TkVYVF9JTlY6bnVsbCxcclxuXHJcblx0UFJFVl9JVEVNOm51bGwsXHJcblx0TkVYVF9JVEVNOm51bGwsXHJcblxyXG5cdENIQU5HRV9TRVRUSU5HOm51bGwsXHJcblx0SU5DUkVNRU5UX1NIQVJEUzpudWxsLFxyXG5cclxuXHRUT0dHTEVfT1BUSU9OUzpudWxsLFxyXG5cdFRPR0dMRV9TVE9SRTpudWxsXHJcbn0pOyIsInZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEaXNwYXRjaGVyKCk7IiwidmFyIGQzc2ltID0gcmVxdWlyZSgnZDNzaW0nKTtcclxuXHJcbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XHJcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XHJcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcblxyXG52YXIgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XHJcblxyXG52YXIgYXBwU2V0dGluZ3MgPSB7fTtcclxudmFyIGRlZmF1bHRzID0ge1xyXG5cdGRDbGFzczonQmFyYmFyaWFuJyxcclxuXHRnZW5kZXI6J0ZlbWFsZScsXHJcblx0aGFyZGNvcmU6ZmFsc2UsXHJcblx0c2Vhc29uYWw6dHJ1ZSxcclxuXHRpdGVtOntcInR5cGVcIjpcImhlbG1cIixcInRleHRcIjpcIk15c3RlcnkgSGVsbWV0XCIsXCJjb3N0XCI6MjUsXCJzaXplXCI6Mn1cclxufTtcclxudmFyIHNoYXJkc1NwZW50ID0ge307XHJcbnZhciBsaWZldGltZSA9IHt9O1xyXG5cclxudmFyIHN0b3JhZ2VTdXBwb3J0ZWQ7XHJcblxyXG4vL0RldGVybWluZSB3aGV0aGVyIG9yIG5vdCBsb2NhbCBzdG9yYWdlIGlzIHN1cHBvcnRlZFxyXG4vL2Zyb20gZ2l0aHViLmNvbS9hZ3J1Ymxldi9hbmd1bGFyTG9jYWxTdG9yYWdlXHJcbi8vTUlUIExpY2VuY2VcclxuZnVuY3Rpb24gbG9jYWxTdG9yYWdlQ2hlY2soKSB7XHJcblx0dmFyIHN0b3JhZ2UgPSAodHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSA/IHVuZGVmaW5lZCA6IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcblx0c3VwcG9ydGVkID0gKHR5cGVvZiBzdG9yYWdlICE9PSAndW5kZWZpbmVkJyk7XHJcblx0aWYgKHN1cHBvcnRlZCkge1xyXG5cdFx0dmFyIHRlc3RLZXkgPSAnX18nICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWU3KTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRlc3RLZXksIHRlc3RLZXkpO1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0ZXN0S2V5KTtcclxuXHRcdH1cclxuXHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0c3VwcG9ydGVkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdHN0b3JhZ2VTdXBwb3J0ZWQgPSBzdXBwb3J0ZWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvZ2dsZVN0b3JlKCkge1xyXG5cdGFwcFNldHRpbmdzLnN0b3JlID0gIWFwcFNldHRpbmdzLnN0b3JlO1xyXG5cdGFwcFNldHRpbmdzLm9wdGlvbnMgPSBmYWxzZTtcclxufVxyXG5mdW5jdGlvbiB0b2dnbGVPcHRpb25zKCkge1xyXG5cdGFwcFNldHRpbmdzLm9wdGlvbnMgPSAhYXBwU2V0dGluZ3Mub3B0aW9ucztcclxuXHRhcHBTZXR0aW5ncy5zdG9yZSA9IGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZXR0aW5ncygpIHtcclxuXHRyZXR1cm4gYXBwU2V0dGluZ3M7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNoYXJkcyhrZXkpIHtcclxuXHRyZXR1cm4gc2hhcmRzU3BlbnRba2V5XSB8fCAwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGFuZ2VTZXR0aW5nKGtleSx2YWwpIHtcclxuXHRhcHBTZXR0aW5nc1trZXldID0gdmFsO1xyXG5cdGQzc2ltLnNldEthZGFsYShhcHBTZXR0aW5ncy5kQ2xhc3MsYXBwU2V0dGluZ3Muc2Vhc29uYWwsYXBwU2V0dGluZ3MuaGFyZGNvcmUpO1xyXG5cdHNhdmVTZXR0aW5ncygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlU2V0dGluZ3MoKSB7XHJcblx0aWYgKHN0b3JhZ2VTdXBwb3J0ZWQpIHtcclxuXHRcdGxvY2FsU3RvcmFnZS5rYWRhbGFTZXR0aW5ncyA9IEpTT04uc3RyaW5naWZ5KGFwcFNldHRpbmdzKTtcclxuXHRcdGxvY2FsU3RvcmFnZS5rYWRhbGFTcGVudCA9IEpTT04uc3RyaW5naWZ5KHNoYXJkc1NwZW50KTtcclxuXHRcdGxvY2FsU3RvcmFnZS5rYWRhbGFMaWZldGltZSA9IEpTT04uc3RyaW5naWZ5KGxpZmV0aW1lKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluY3JlbWVudFNoYXJkcyhrZXksdmFsKSB7XHJcblx0aWYgKHR5cGVvZiBzaGFyZHNTcGVudFtrZXldICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0c2hhcmRzU3BlbnRba2V5XSs9dmFsO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHNoYXJkc1NwZW50W2tleV0gPSB2YWw7XHJcblx0fVxyXG5cdGlmICh0eXBlb2YgbGlmZXRpbWVba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdGxpZmV0aW1lW2tleV0rPXZhbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRsaWZldGltZVtrZXldPXZhbDtcclxuXHR9XHJcblx0c2F2ZVNldHRpbmdzKCk7XHJcbn1cclxuXHJcblxyXG52YXIgQXBwU3RvcmUgPSBhc3NpZ24oe30sRXZlbnRFbWl0dGVyLnByb3RvdHlwZSx7XHJcblx0Z2V0U2V0dGluZ3M6Z2V0U2V0dGluZ3MsXHJcblx0Z2V0U2hhcmRzOmdldFNoYXJkcyxcclxuXHJcblx0ZW1pdENoYW5nZTpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5lbWl0KENIQU5HRV9FVkVOVCk7XHJcblx0fSxcclxuXHRhZGRDaGFuZ2VMaXN0ZW5lcjpmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5vbihDSEFOR0VfRVZFTlQsY2FsbGJhY2spO1xyXG5cdH0sXHJcblx0cmVtb3ZlQ2hhbmdlTGlzdGVuZXI6ZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ0hBTkdFX0VWRU5ULGNhbGxiYWNrKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuLy9ob2lzdGluZyBvdmVycG93ZXJlZFxyXG5mdW5jdGlvbiBtb2JpbGVDaGVjaygpIHtcclxuXHR2YXIgbW9iaWxlID0gKHdpbmRvdy5pbm5lcldpZHRoIDw9IDc2OCk7XHJcblxyXG5cdC8vaWYgZGlmZmVyZW50IHRoYW4gY3VycmVudCBjaGFuZ2VcclxuXHRpZiAobW9iaWxlICE9PSBhcHBTZXR0aW5ncy5tb2JpbGUpIHtcclxuXHRcdGFwcFNldHRpbmdzLm1vYmlsZSA9IG1vYmlsZTtcclxuXHRcdGFwcFNldHRpbmdzLnN0b3JlID0gIW1vYmlsZTtcclxuXHRcdGFwcFNldHRpbmdzLm9wdGlvbnMgPSAhbW9iaWxlO1xyXG5cdH1cclxuXHRBcHBTdG9yZS5lbWl0KENIQU5HRV9FVkVOVCk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG5cdGxvY2FsU3RvcmFnZUNoZWNrKCk7XHJcblx0bW9iaWxlQ2hlY2soKTtcclxuXHR3aW5kb3cub25yZXNpemUgPSBtb2JpbGVDaGVjaztcclxuXHJcblx0QXBwU3RvcmUuc2V0TWF4TGlzdGVuZXJzKDIwKTtcclxuXHJcblx0aWYgKHN0b3JhZ2VTdXBwb3J0ZWQpIHtcclxuXHRcdHZhciBzdG9yZWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdrYWRhbGFTZXR0aW5ncycpKSB8fCB7fTtcclxuXHJcblx0XHQvL2xvb3AgdGhyb3VnaCBleGlzdGluZyBkZWZhdWx0cyBpbmNhc2UgdXNlciBoYXMgb2xkZXIgdmVyc2lvbiBvZiBhcHBcclxuXHRcdHZhciBzZXR0aW5nc0tleXMgPSBPYmplY3Qua2V5cyhkZWZhdWx0cyk7XHJcblx0XHR2YXIga2V5TGVuZ3RoID0gc2V0dGluZ3NLZXlzLmxlbmd0aDtcclxuXHRcdGZvciAodmFyIGkgPTA7IGkgPCBrZXlMZW5ndGg7IGkrKykge1xyXG5cdFx0XHRhcHBTZXR0aW5nc1tzZXR0aW5nc0tleXNbaV1dID0gc3RvcmVkW3NldHRpbmdzS2V5c1tpXV0gfHwgZGVmYXVsdHNbc2V0dGluZ3NLZXlzW2ldXTtcclxuXHRcdH1cclxuXHJcblx0XHQvL3B1bGwgdGhlIHNwZW50IGl0ZW1zXHJcblx0XHRzaGFyZHNTcGVudCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2thZGFsYVNwZW50JykpIHx8IHt9O1xyXG5cdFx0bGlmZXRpbWUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdrYWRhbGFMaWZldGltZScpKSB8fCB7fTtcclxuXHJcblx0XHQvL3NhdmUgdG8gc3RvcmFnZVxyXG5cdFx0c2F2ZVNldHRpbmdzKCk7XHJcblx0fVxyXG59XHJcblxyXG5pbml0KCk7XHJcblxyXG5BcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbikge1xyXG5cdHN3aXRjaChhY3Rpb24uYWN0aW9uVHlwZSl7XHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5DSEFOR0VfU0VUVElORzpcclxuXHRcdFx0Y2hhbmdlU2V0dGluZyhhY3Rpb24ua2V5LGFjdGlvbi52YWwpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuSU5DUkVNRU5UX1NIQVJEUzpcclxuXHRcdFx0aW5jcmVtZW50U2hhcmRzKGFjdGlvbi5rZXksYWN0aW9uLnZhbCk7XHJcblx0XHRcdEFwcFN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5UT0dHTEVfU1RPUkU6XHJcblx0XHRcdHRvZ2dsZVN0b3JlKCk7XHJcblx0XHRcdEFwcFN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5UT0dHTEVfT1BUSU9OUzpcclxuXHRcdFx0dG9nZ2xlT3B0aW9ucygpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0Ly9ub29wXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwU3RvcmU7IiwidmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcclxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcclxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcclxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxuXHJcbnZhciBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcclxuXHJcbi8vdGhlcmUgYXJlIG9ubHkgdHdvIGludmVudG9yaWVzIGJlaW5nIHVzZWQgd2l0aCB0aGUgYWJpbGl0eSB0byBjeWNsZSBiYWNrXHJcbnZhciBwcmV2aW91c0ludmVudG9yeTtcclxudmFyIGN1cnJlbnRJbnZlbnRvcnk7XHJcbnZhciBuZXh0SW52ZW50b3J5O1xyXG5cclxudmFyIGl0ZW1zID0gW107XHJcbnZhciBjdXJyZW50SW5kZXggPSAwO1xyXG5cclxuLy9jcmVhdGVzIG5lc3RlZCBhcnJheSBibGFuayBpbnZlbnRvcnkgYW5kIHNldHMgYXMgdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcbmZ1bmN0aW9uIGNyZWF0ZUludmVudG9yeSgpIHtcclxuXHR2YXIgbmV3SW52ZW50b3J5ID0gW107XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPDEwO2krKykge1xyXG5cdFx0Ly9wdXNoIGEgYmxhbmsgYXJyYXkgdG8gcmVwcmVzZW50IGVhY2ggY29sdW1uIG9mIHRoZSBpbnZlbnRvcnlcclxuXHRcdG5ld0ludmVudG9yeS5wdXNoKFtdKTtcclxuXHR9XHJcblxyXG5cdC8vc2V0IHRoZSBwcmV2aW91cyBpbnZlbnRvcnkgdG8gdGhlIGxhdGVzdCBpbnZlbnRvcnkgdXNlZFxyXG5cdHByZXZpb3VzSW52ZW50b3J5ID0gbmV4dEludmVudG9yeSB8fCBjdXJyZW50SW52ZW50b3J5IHx8IHVuZGVmaW5lZDtcclxuXHQvL3RoZSBuZXcgYmxhbmsgaW52ZW50b3J5IGlzIG5vdyB0aGUgY3VycmVudCBpbnZlbnRvcnlcclxuXHRjdXJyZW50SW52ZW50b3J5ID0gbmV3SW52ZW50b3J5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbnZlbnRvcnkoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHByZXZpb3VzSW52ZW50b3J5OnByZXZpb3VzSW52ZW50b3J5LFxyXG5cdFx0Y3VycmVudEludmVudG9yeTpjdXJyZW50SW52ZW50b3J5LFxyXG5cdFx0bmV4dEludmVudG9yeTpuZXh0SW52ZW50b3J5XHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbSgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0aGFzUHJldmlvdXM6KGN1cnJlbnRJbmRleCAhPT0gMCksXHJcblx0XHRpdGVtOml0ZW1zW2N1cnJlbnRJbmRleF0sXHJcblx0XHRoYXNOZXh0OihjdXJyZW50SW5kZXggPCBpdGVtcy5sZW5ndGggLSAxKVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEl0ZW0oaXRlbSkge1xyXG5cdHZhciBpbnZlbnRvcnlMZW5ndGggPSBjdXJyZW50SW52ZW50b3J5Lmxlbmd0aDtcclxuXHQvL2xvb3BpbmcgdGhyb3VnaCBlYWNoIGNvbHVtbiBvZiB0aGUgaW52ZW50b3J5XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbnZlbnRvcnlMZW5ndGg7IGkgKyspIHtcclxuXHRcdC8vbG9vcCB0aHJvdWdoIGVhY2ggaXRlbSBpbiBzYWlkIGNvbHVtblxyXG5cdFx0dmFyIGNvbHVtbkxlbmd0aCA9IGN1cnJlbnRJbnZlbnRvcnlbaV0ubGVuZ3RoO1xyXG5cdFx0dmFyIGNvbHVtbkhlaWdodCA9IDA7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvbHVtbkxlbmd0aDsgaisrKSB7XHJcblx0XHRcdC8vYWRkIGN1cnJlbnQgaXRlbSBzaXplIHRvIGNvbHVtbiBoZWlnaHRcclxuXHRcdFx0aWYoY3VycmVudEludmVudG9yeVtpXVtqXS5oYXNPd25Qcm9wZXJ0eSgnc2l6ZScpKSB7XHJcblx0XHRcdFx0Y29sdW1uSGVpZ2h0Kz1jdXJyZW50SW52ZW50b3J5W2ldW2pdLnNpemU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vY2hlY2sgaWYgdGhlIGhlaWdodCBpcyBzdGlsbCBsZXNzIHRoYW4gNiB3aXRoIG5ldyBpdGVtXHJcblx0XHQvL2FuZCBhZGQgdG8gdGhhdCBjb2x1bW4gYW5kIHJldHVybiB0byBzdG9wIHRoZSBtYWRuZXNzXHJcblx0XHRpZiAoY29sdW1uSGVpZ2h0K2l0ZW0uc2l6ZSA8PTYpIHtcclxuXHRcdFx0Y3VycmVudEludmVudG9yeVtpXS5wdXNoKGl0ZW0pO1xyXG5cdFx0XHQvL2lmIHdlIGNhbiBzdWNjZXNzZnVsbHkgYWRkIHRvIGludmVudG9yeSBjYWxsIGZvciBpdGVtcyBpbnZlbnRvcnlcclxuXHRcdFx0YWRkVG9JdGVtcyhpdGVtKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly9pZiB3ZSBtYWRlIGl0IHRoaXMgZmFyIHRoZSBuZXcgaXRlbSBkb2VzIG5vdCBmaXQgaW4gdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcblx0Ly9jaGVjayB0byBzZWUgaWYgdGhlcmUgaXMgYSBuZXh0IGludmVudG9yeVxyXG5cdC8vc28gdGhhdCB3ZSBjYW4gY3ljbGUgdG8gbmV4dCBpbnZlbnRvcnkgYW5kIHRyeSBhbmQgZml0IGl0IGluXHJcblx0aWYgKHR5cGVvZiBuZXh0SW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0Z290b05leHQoKTtcclxuXHRcdGFkZEl0ZW0oaXRlbSk7XHJcblx0fVxyXG5cdC8vdGhlcmUgaXMgbm8gbmV4dCBpbnZlbnRvcnkgYW5kIHdlIG5lZWQgdG8gbWFrZSBhIG5ldyBvbmVcclxuXHRlbHNlIHtcclxuXHRcdGNyZWF0ZUludmVudG9yeSgpO1xyXG5cdFx0YWRkSXRlbShpdGVtKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvSXRlbXMoaXRlbSkge1xyXG5cdGl0ZW1zLnB1c2goaXRlbSk7XHJcblxyXG5cdC8vaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAxMCBpdGVtcyByZW1vdmUgdGhlIGZpcnN0XHJcblx0aWYgKGl0ZW1zLmxlbmd0aCA+IDEwKSB7XHJcblx0XHRpdGVtcy5zaGlmdCgpO1xyXG5cdH1cclxuXHJcblx0Ly9zZXQgdGhlIGN1cnJlbnRpbmRleCB0byB0aGUgbmV3IGl0ZW1cclxuXHRjdXJyZW50SW5kZXggPSBpdGVtcy5sZW5ndGggLSAxO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmV2aW91c0l0ZW0oKSB7XHJcblx0aWYgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG5cdFx0Y3VycmVudEluZGV4IC09MTtcclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gbmV4dEl0ZW0oKSB7XHJcblx0aWYgKGN1cnJlbnRJbmRleCA8IGl0ZW1zLmxlbmd0aCAtMSkge1xyXG5cdFx0Y3VycmVudEluZGV4ICs9MTtcclxuXHR9XHJcbn1cclxuXHJcbi8vY3ljbGVzIHRocm91Z2ggdG8gdGhlIHByZXZpb3VzIGludmVudG9yeVxyXG5mdW5jdGlvbiBnb3RvUHJldmlvdXMoKSB7XHJcblx0aWYodHlwZW9mIHByZXZpb3VzSW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0bmV4dEludmVudG9yeSA9IGN1cnJlbnRJbnZlbnRvcnk7XHJcblx0XHRjdXJyZW50SW52ZW50b3J5ID0gcHJldmlvdXNJbnZlbnRvcnk7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcbn1cclxuXHJcbi8vY3ljbGVzIHRocm91Z2ggdG8gdGhlIG5leHQgaW52ZW50b3J5XHJcbmZ1bmN0aW9uIGdvdG9OZXh0KCkge1xyXG5cdGlmKHR5cGVvZiBuZXh0SW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0cHJldmlvdXNJbnZlbnRvcnkgPSBjdXJyZW50SW52ZW50b3J5O1xyXG5cdFx0Y3VycmVudEludmVudG9yeSA9IG5leHRJbnZlbnRvcnk7XHJcblx0XHRuZXh0SW52ZW50b3J5ID0gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuLy9pbml0aWFsaXplIHN0b3JlIGJ5IGNyZWF0aW5nIGEgYmxhbmsgaW52ZW50b3J5XHJcbmNyZWF0ZUludmVudG9yeSgpO1xyXG5cclxudmFyIEludmVudG9yeVN0b3JlID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLHtcclxuXHRnZXRJbnZlbnRvcnk6Z2V0SW52ZW50b3J5LFxyXG5cdGdvdG9QcmV2aW91czpnb3RvUHJldmlvdXMsXHJcblx0Z290b05leHQ6Z290b05leHQsXHJcblx0YWRkSXRlbTphZGRJdGVtLFxyXG5cdGdldEl0ZW06Z2V0SXRlbSxcclxuXHRwcmV2aW91c0l0ZW06cHJldmlvdXNJdGVtLFxyXG5cdG5leHRJdGVtOm5leHRJdGVtLFxyXG5cclxuXHRlbWl0Q2hhbmdlOmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLmVtaXQoQ0hBTkdFX0VWRU5UKTtcclxuXHR9LFxyXG5cdGFkZENoYW5nZUxpc3RlbmVyOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLm9uKENIQU5HRV9FVkVOVCxjYWxsYmFjayk7XHJcblx0fSxcclxuXHRyZW1vdmVDaGFuZ2VMaXN0ZW5lcjpmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5yZW1vdmVMaXN0ZW5lcihDSEFOR0VfRVZFTlQsY2FsbGJhY2spO1xyXG5cdH1cclxufSk7XHJcblxyXG5BcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbikge1xyXG5cdHN3aXRjaChhY3Rpb24uYWN0aW9uVHlwZSkge1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLkFERF9JVEVNOlxyXG5cdFx0XHRhZGRJdGVtKGFjdGlvbi5pdGVtKTtcclxuXHRcdFx0SW52ZW50b3J5U3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5QUkVWX0lOVjpcclxuXHRcdFx0Z290b1ByZXZpb3VzKCk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuTkVYVF9JTlY6XHJcblx0XHRcdGdvdG9OZXh0KCk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuUFJFVl9JVEVNOlxyXG5cdFx0XHRwcmV2aW91c0l0ZW0oKTtcclxuXHRcdFx0SW52ZW50b3J5U3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5ORVhUX0lURU06XHJcblx0XHRcdG5leHRJdGVtKCk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0Ly9ub29wXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5U3RvcmU7Il19
