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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxhY3Rpb25zXFxBcHBBY3Rpb25zLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxjb21tb25cXGZvb3Rlci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGNvbW1vblxcbmF2YmFyLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1hcm1vci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAtYm9keS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAtZmxhdm9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1oZWFkLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC1zdGF0LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcZDMtdG9vbHRpcFxcZDMtdG9vbHRpcC13ZWFwb24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xcaW5kaXZpZHVhbC1pdGVtXFxpbmRpdmlkdWFsLWl0ZW0uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbmRpdmlkdWFsLWl0ZW1cXGl0ZW0tbGVmdC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGluZGl2aWR1YWwtaXRlbVxcaXRlbS1yaWdodC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LWNvbnRhaW5lci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LXNsb3QuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXGludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcbmV4dC1pbnZlbnRvcnkuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXHByZXZpb3VzLWludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxjbGFzcy1zZWxlY3Rvci1idXR0b24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcY2xhc3Mtc2VsZWN0b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcZ2VuZGVyLXNlbGVjdG9yLWJ1dHRvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxnZW5kZXItc2VsZWN0b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcaGFyZGNvcmUtY2hlY2tib3guanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcb3B0aW9ucy1wYW5lbC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxzZWFzb25hbC1jaGVja2JveC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1zdG9yZVxca2FkYWxhLWl0ZW0uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtc3RvcmVcXGthZGFsYS1zdG9yZS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbnN0YW50c1xcQXBwQ29uc3RhbnRzLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxkaXNwYXRjaGVyXFxBcHBEaXNwYXRjaGVyLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxzdG9yZXNcXEFwcFN0b3JlLmpzIiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxzdG9yZXNcXEludmVudG9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDdkQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUM7QUFDNUUsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFDeEUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDaEUsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7QUFDakYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7O0FBRXZELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUUvQyxJQUFJLGlDQUFpQywyQkFBQTtDQUNwQyxlQUFlLENBQUMsV0FBVztFQUMxQixPQUFPLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUM5QjtDQUNELGlCQUFpQixFQUFFLFdBQVc7QUFDL0IsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDOztFQUVFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEQsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDN0I7O0VBRUUsTUFBTSxD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkEsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRXhELElBQUksVUFBVSxHQUFHOztDQUVoQixPQUFPLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDdkIsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVE7R0FDaEMsSUFBSSxDQUFDLElBQUk7R0FDVCxDQUFDLENBQUM7QUFDTCxFQUFFOztDQUVELGlCQUFpQixFQUFFLFdBQVc7RUFDN0IsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVE7R0FDaEMsQ0FBQyxDQUFDO0FBQ0wsRUFBRTs7Q0FFRCxhQUFhLEVBQUUsV0FBVztFQUN6QixhQUFhLENBQUMsUUFBUSxDQUFDO0dBQ3RCLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUTtHQUNoQyxDQUFDLENBQUM7QUFDTCxFQUFFOztDQUVELFlBQVksQ0FBQyxXQUFXO0VBQ3ZCLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTO0dBQ2pDLENBQUMsQ0FBQztBQUNMLEVBQUU7O0NBRUQsUUFBUSxDQUFDLFdBQVc7RUFDbkIsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixVQUFVLENBQUMsWUFBWSxDQUFDLFNBQVM7R0FDakMsQ0FBQyxDQUFDO0FBQ0wsRUFBRTs7Q0FFRCxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxFQUFFO0VBQy9CLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxjQUFjO0dBQ3RDLEdBQUcsQ0FBQyxHQUFHO0dBQ1AsR0FBRyxDQUFDLEdBQUc7R0FDUCxDQUFDLENBQUM7QUFDTCxFQUFFOztDQUVELFdBQVcsQ0FBQyxXQUFXO0VBQ3RCLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZO0dBQ3BDLENBQUMsQ0FBQztBQUNMLEVBQUU7O0NBRUQsYUFBYSxDQUFDLFdBQVc7RUFDeEIsYUFBYSxDQUFDLFFBQVEsQ0FBQztHQUN0QixVQUFVLENBQUMsWUFBWSxDQUFDLGNBQWM7R0FDdEMsQ0FBQyxDQUFDO0FBQ0wsRUFBRTs7Q0FFRCxlQUFlLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxFQUFFO0VBQ2pDLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDdEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0I7R0FDeEMsR0FBRyxDQUFDLEdBQUc7R0FDUCxHQUFHLENBQUMsR0FBRztHQUNQLENBQUMsQ0FBQztBQUNMLEVBQUU7O0FBRUYsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVTs7OztBQ2xFM0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLDRCQUE0QixzQkFBQTtDQUMvQixNQUFNLENBQUMsV0FBVztFQUNqQjtHQUNDLG9CQUFBLFFBQU8sRUFBQSxJQUFDLEVBQUE7SUFDUCxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGFBQWMsQ0FBQSxFQUFBO0tBQzdCLG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsd0JBQXlCLENBQUEsRUFBQSxZQUFjLENBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQTtBQUFBLEtBQy9DLG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsMEJBQTJCLENBQUEsRUFBQSw4QkFBZ0MsQ0FBQTtJQUM3RCxDQUFBLEVBQUE7SUFDUCxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQWUsQ0FBQSxFQUFBO0lBQzlCLHNEQUF1RDtJQUN4RCxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLHVCQUF3QixDQUFBLEVBQUE7S0FDL0Isb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxPQUFBLEVBQU8sQ0FBQyxLQUFBLEVBQUssQ0FBQyxFQUFBLEVBQUUsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxLQUFBLEVBQUssQ0FBQyxDQUFBLEVBQUMsQ0FBQyxLQUFBLEVBQUs7T0FDN0MsS0FBQSxFQUFLLENBQUMsTUFBQSxFQUFNLENBQUMsTUFBQSxFQUFNLENBQUMsTUFBQSxFQUFNLENBQUMsT0FBQSxFQUFPLENBQUMsYUFBQSxFQUFhLENBQUMsbUJBQUEsRUFBaUIsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBO0tBQ3ZGLG9CQUFBLEdBQUUsRUFBQSxJQUFDLEVBQUE7TUFDRixvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFdBQUEsRUFBUyxDQUFDLFNBQUEsRUFBUyxDQUFDLFdBQUEsRUFBUyxDQUFDLFNBQUEsRUFBUyxDQUFDLENBQUEsRUFBQyxDQUFDLDBEQUFBO0FBQUEsT0FBQSxrSEFBQTtBQUFBLE9BQUEsNEhBQUE7QUFBQSxPQUFBLG9IQUFBO0FBQUEsT0FBQSx1SEFBQTtBQUFBLE9BQUEsOEdBQUE7QUFBQSxPQUFBLHdIQUFBO0FBQUEsT0FBQSxrSEFBQTtBQUFBLE9BQUEsMEdBUTBELENBQUUsQ0FBQTtLQUN6RyxDQUFBO0tBQ0UsQ0FBQTtJQUNILENBQUEsRUFBQTtJQUNILHVEQUF3RDtJQUN6RCxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLHdCQUF5QixDQUFBLEVBQUE7S0FDaEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxPQUFBLEVBQU8sQ0FBQyxLQUFBLEVBQUssQ0FBQyxFQUFBLEVBQUUsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxLQUFBLEVBQUssQ0FBQyxDQUFBLEVBQUMsQ0FBQyxLQUFBLEVBQUs7T0FDN0MsS0FBQSxFQUFLLENBQUMsTUFBQSxFQUFNLENBQUMsTUFBQSxFQUFNLENBQUMsTUFBQSxFQUFNLENBQUMsT0FBQSxFQUFPLENBQUMsYUFBQSxFQUFhLENBQUMsbUJBQUEsRUFBaUIsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBO0tBQ3ZGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsQ0FBQSxFQUFDLENBQUMsOEZBQUE7QUFBQSxNQUFBLHlIQUFBO0FBQUEsTUFBQSxtSEFBQTtBQUFBLE1BQUEsc0hBQUE7QUFBQSxNQUFBLGlIQUFBO0FBQUEsTUFBQSx1SEFBQTtBQUFBLE1BQUEscUhBQUE7QUFBQSxNQUFBLDBDQU9rQyxDQUFFLENBQUE7S0FDdEMsQ0FBQTtJQUNILENBQUEsRUFBQTtJQUNILHFEQUFzRDtJQUN2RCxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLGdDQUFpQyxDQUFBLEVBQUE7S0FDeEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxPQUFBLEVBQU8sQ0FBQyxLQUFBLEVBQUssQ0FBQyxFQUFBLEVBQUUsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxLQUFBLEVBQUssQ0FBQyxDQUFBLEVBQUMsQ0FBQyxLQUFBLEVBQUs7T0FDN0MsS0FBQSxFQUFLLENBQUMsTUFBQSxFQUFNLENBQUMsTUFBQSxFQUFNLENBQUMsTUFBQSxFQUFNLENBQUMsT0FBQSxFQUFPLENBQUMsYUFBQSxFQUFhLENBQUMsbUJBQUEsRUFBaUIsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBO0tBQ3ZGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsRUFBQSxFQUFFLENBQUMsT0FBQSxFQUFPLENBQUMsQ0FBQSxFQUFDLENBQUMsdUZBQUE7QUFBQSxNQUFBLHFJQUFBO0FBQUEsTUFBQSwyR0FBQTtBQUFBLE1BQUEsNEdBQUE7QUFBQSxNQUFBLHdJQUFBO0FBQUEsTUFBQSx5SEFBQTtBQUFBLE1BQUEscUlBQUE7QUFBQSxNQUFBLHVJQUFBO0FBQUEsTUFBQSx5SUFBQTtBQUFBLE9BQUEseUhBQUE7QUFBQSxNQUFBLGlJQUFBO0FBQUEsTUFBQSw2Q0FXMEIsQ0FBRSxDQUFBO0tBQ3pDLENBQUE7SUFDSCxDQUFBO0lBQ0csQ0FBQTtHQUNDLENBQUE7SUFDUjtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNOzs7Ozs7QUNsRXZCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3hELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUVuRCxJQUFJLDRCQUE0QixzQkFBQTtDQUMvQixlQUFlLENBQUMsV0FBVztFQUMxQixPQUFPLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUM5QjtDQUNELE9BQU8sQ0FBQyxXQUFXO0VBQ2xCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDakMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUN6QixVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RSxFQUFFOztDQUVELGFBQWEsQ0FBQyxXQUFXO0VBQ3hCLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztFQUMzQjtDQUNELFdBQVcsQ0FBQyxXQUFXO0VBQ3RCLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMzQixFQUFFOztDQUVELGlCQUFpQixFQUFFLFdBQVc7RUFDN0IsUUFBUSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMzQztDQUNELG9CQUFvQixFQUFFLFdBQVc7RUFDaEMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUM5QztDQUNELFNBQVMsQ0FBQyxXQUFXO0VBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDeEMsRUFBRTs7Q0FFRCxNQUFNLENBQUMsV0FBVztFQUNqQjtHQUNDLG9CQUFBLEtBQUksRUFBQSxJQUFDLEVBQUE7SUFDSixvQkFBQSxRQUFPLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLEtBQUEsRUFBSyxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxhQUFlLENBQUEsRUFBQTtLQUNuRCxvREFBcUQ7S0FDdEQsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxLQUFBLEVBQUssQ0FBQyw0QkFBQSxFQUE0QixDQUFDLEtBQUEsRUFBSyxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQUEsRUFBTSxDQUFDLElBQUEsRUFBSSxDQUFDLE9BQUEsRUFBTyxDQUFDLFdBQVksQ0FBQSxFQUFBO01BQ2xGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsQ0FBQSxFQUFDLENBQUMsK0NBQStDLENBQUUsQ0FBQTtLQUNwRCxDQUFBO0lBQ0UsQ0FBQSxFQUFBO0lBQ1Qsb0JBQUEsSUFBRyxFQUFBLElBQUMsRUFBQSxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLFVBQVcsQ0FBQSxFQUFBLGtCQUFvQixDQUFLLENBQUEsRUFBQTtJQUNoRCxvQkFBQSxRQUFPLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLEtBQUEsRUFBSyxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxPQUFTLENBQUEsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFjLENBQUEsRUFBQTtJQUM5RSxvQkFBQSxRQUFPLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLE1BQUEsRUFBTSxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxXQUFhLENBQUEsRUFBQTtLQUNsRCxvREFBcUQ7S0FDdEQsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxLQUFBLEVBQUssQ0FBQyw0QkFBQSxFQUE0QixDQUFDLEtBQUEsRUFBSyxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQUEsRUFBTSxDQUFDLElBQUEsRUFBSSxDQUFDLE9BQUEsRUFBTyxDQUFDLFdBQVksQ0FBQSxFQUFBO01BQ2xGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsQ0FBQSxFQUFDLENBQUMsa0lBQWtJLENBQUUsQ0FBQTtLQUN2SSxDQUFBO0lBQ0UsQ0FBQTtHQUNKLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNOzs7Ozs7QUN4RHZCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDNUIsQ0FBQyx3Q0FBd0Msa0NBQUE7O0FBRXpDLENBQUMsTUFBTSxFQUFFLFdBQVc7O0FBRXBCLEVBQUU7O0dBRUMsb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxvQ0FBcUMsQ0FBQSxFQUFBO0lBQ2xELG9CQUFBLElBQUcsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsS0FBTSxDQUFBLEVBQUEsb0JBQUEsR0FBRSxFQUFBLElBQUMsRUFBQSxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLE9BQVEsQ0FBQSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBYSxDQUFJLENBQUssQ0FBQSxFQUFBO0lBQ2pGLG9CQUFBLElBQUcsRUFBQSxJQUFDLEVBQUEsT0FBVSxDQUFBO0FBQ2xCLEdBQVEsQ0FBQTs7QUFFUixJQUFJOztBQUVKLEVBQUU7O0FBRUYsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxrQkFBa0I7Ozs7OztBQ2xCbkMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztDQUMzQixrQkFBa0IsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUM7Q0FDdEQsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0FBQ3pELENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRXRELElBQUksdUNBQXVDLGlDQUFBOztBQUUzQyxDQUFDLE1BQU0sRUFBRSxXQUFXOztFQUVsQixJQUFJLFdBQVcsR0FBRyx5Q0FBeUMsQ0FBQztBQUM5RCxFQUFFLElBQUksYUFBYSxFQUFFLFdBQVcsQ0FBQztBQUNqQztBQUNBO0FBQ0E7O0VBRUUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JELEVBQUUsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pEOztBQUVBLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRTs7RUFFRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtHQUMxQixXQUFXLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0dBQ3RELGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekMsR0FBRztBQUNIOztFQUVFLElBQUksT0FBTyxDQUFDO0VBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7R0FDNUMsT0FBTyxHQUFHLG9CQUFDLGtCQUFrQixFQUFBLENBQUEsQ0FBQyxLQUFBLEVBQUssQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFNLENBQUUsQ0FBQSxDQUFDO0dBQzlEO0VBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7R0FDN0MsT0FBTyxHQUFHLG9CQUFDLG1CQUFtQixFQUFBLENBQUEsQ0FBQyxNQUFBLEVBQU0sQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFPLENBQUUsQ0FBQSxDQUFDO0FBQ3BFLEdBQUc7QUFDSDs7RUFFRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7RUFDakIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0VBQ2xCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtHQUN2RCxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDL0QsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsR0FBQSxFQUFHLENBQUUsU0FBVSxDQUFFLENBQUEsRUFBQSxjQUFpQixDQUFBLENBQUMsQ0FBQztJQUM1RixTQUFTLEVBQUUsQ0FBQztJQUNaO0FBQ0osR0FBRztBQUNIOztBQUVBLEVBQUUsSUFBSSxjQUFjLENBQUM7O0VBRW5CLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7R0FDbEYsY0FBYyxHQUFHLGFBQWEsQ0FBQztBQUNsQyxHQUFHOztPQUVJO0FBQ1AsR0FBRyxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7R0FFMUYsY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRixHQUFHOztFQUVEO0FBQ0YsR0FBRyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGdFQUFpRSxDQUFBLEVBQUE7O0lBRTlFLDREQUE2RDtJQUM5RCxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFdBQWEsQ0FBQSxFQUFBO0tBQzdCLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsb0JBQXFCLENBQUEsRUFBQTtNQUNwQyxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1DQUFBLEVBQW1DLENBQUMsS0FBQSxFQUFLLENBQUUsS0FBTyxDQUFBO01BQzNELENBQUE7S0FDRCxDQUFBO0FBQ1osSUFBVyxDQUFBLEVBQUE7O0FBRVgsSUFBSSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG9CQUFxQixDQUFBLEVBQUE7O0tBRWxDLDhCQUErQjtLQUNoQyxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGlCQUFrQixDQUFBLEVBQUE7T0FDOUIsb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFPLENBQUEsRUFBQTtPQUM3RyxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG9DQUFxQyxDQUFBLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBbUIsQ0FBQTtBQUM5RixLQUFVLENBQUEsRUFBQTs7S0FFSiwyQ0FBNEM7S0FDN0Msb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQTtNQUN6QixvQkFBQSxJQUFHLEVBQUEsSUFBQyxFQUFBO09BQ0gsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxhQUFlLENBQUEsRUFBQyxjQUFjLEVBQUMsR0FBQSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQVksQ0FBQTtNQUMxRSxDQUFBO0FBQ1gsS0FBVSxDQUFBLEVBQUE7O0tBRUosa0dBQW1HO0FBQ3pHLEtBQU0sT0FBTyxFQUFDOztBQUVkLEtBQUssb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxxQkFBc0IsQ0FBTSxDQUFBLEVBQUE7O0tBRTFDLHFCQUFzQjtLQUN2QixvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQWUsQ0FBQSxFQUFBO01BQzVCLG9CQUFBLEdBQUUsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsd0JBQXlCLENBQUEsRUFBQSxTQUFXLENBQUEsRUFBQTtNQUNoRCxTQUFTLEVBQUM7TUFDWCxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLHdCQUF5QixDQUFBLEVBQUEsV0FBYSxDQUFBLEVBQUE7TUFDbEQsV0FBVyxFQUFDO01BQ1osT0FBUTtBQUNmLEtBQVUsQ0FBQTs7QUFFVixJQUFVLENBQUE7O0dBRUQsQ0FBQTtBQUNULElBQUk7O0NBRUgsU0FBUyxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQzlCLEVBQUUsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDOztFQUVqQixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7RUFFekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRTtHQUNqQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDbkIsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQUMsaUJBQWlCLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFFLEdBQUcsRUFBQyxDQUFDLEdBQUEsRUFBRyxDQUFFLENBQUUsQ0FBQSxDQUFHLENBQUEsQ0FBQyxDQUFDO0dBQ3ZEO0VBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsRUFBRTs7RUFFQTtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCOzs7Ozs7QUN6SGxDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSx5Q0FBeUMsbUNBQUE7Q0FDNUMsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7SUFDbEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxRQUFTLENBQUEsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWEsQ0FBQTtHQUM1QyxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsbUJBQW1COzs7Ozs7QUNacEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLHVDQUF1QyxpQ0FBQTtBQUMzQyxDQUFDLE1BQU0sRUFBRSxXQUFXO0FBQ3BCOztFQUVFLElBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQztBQUM5QixFQUFFLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQztBQUNqQjtBQUNBOztFQUVFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0dBQzFCLFFBQVEsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7R0FDckQsT0FBTyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDbEQsR0FBRzs7RUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO0dBQ3JDLE9BQU8sR0FBRyxXQUFXLENBQUM7R0FDdEI7T0FDSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFO0dBQ3hDLE9BQU8sR0FBRyxVQUFVLENBQUM7QUFDeEIsR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsUUFBVSxDQUFBLEVBQUE7SUFDekIsb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxPQUFTLENBQUEsRUFBQTtLQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFLO0lBQ2xCLENBQUE7R0FDQSxDQUFBO0FBQ1QsSUFBSTs7RUFFRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCOzs7Ozs7QUNsQ2xDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxzQ0FBc0MsaUNBQUE7O0FBRTFDLENBQUMsTUFBTSxFQUFFLFdBQVc7O0VBRWxCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQixFQUFFLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQzs7RUFFaEIsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7R0FDaEQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZDLEdBQUcsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3JDOztJQUVJLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsT0FBTyxRQUFRLEtBQUssQ0FBQyxDQUFDLEVBQUU7S0FDdkIsS0FBSyxFQUFFO0tBQ1AsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxLQUFLOztJQUVELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNyQixJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQzs7SUFFZixLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQzlCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRCxRQUFRLEdBQUcsVUFBVSxDQUFDO0tBQ3RCLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLEtBQUssSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEQ7O0tBRUssSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO01BQy9CLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtPQUN6QyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDdkQ7V0FDSTtPQUNKLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNuRDtBQUNQLE1BQU07QUFDTjs7S0FFSyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxNQUFNO0FBQ047O0tBRUssSUFBSSxPQUFPLEdBQUcsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxPQUFBLEVBQU8sQ0FBQyxHQUFBLEVBQUcsQ0FBRSxPQUFTLENBQUEsRUFBQyxNQUFjLENBQUEsQ0FBQztLQUNwRSxPQUFPLEVBQUUsQ0FBQztBQUNmLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4Qjs7S0FFSyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUU7TUFDakMsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDaEQsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDbEI7VUFDSSxHQUFHLEtBQUssS0FBSyxDQUFDLEVBQUU7TUFDcEIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUN6RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLE1BQU07O1VBRUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO01BQ25DLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDekQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNsQjtLQUNEO0FBQ0wsSUFBSTs7UUFFSTtJQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEM7QUFDSixHQUFHO0FBQ0g7O0VBRUUsSUFBSSxTQUFTLEdBQUcsMEJBQTBCLENBQUM7RUFDM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtHQUNuRixTQUFTLElBQUksa0JBQWtCLENBQUM7R0FDaEM7T0FDSTtHQUNKLFNBQVMsSUFBSSxnQkFBZ0IsQ0FBQztBQUNqQyxHQUFHOztBQUVILEVBQUU7O0dBRUMsb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxTQUFXLENBQUEsRUFBQTtJQUN6QixvQkFBQSxHQUFFLEVBQUEsSUFBQyxFQUFDLElBQVMsQ0FBQTtBQUNqQixHQUFRLENBQUE7O0FBRVIsSUFBSTs7QUFFSixFQUFFOztBQUVGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCOzs7Ozs7QUMvRmxDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSx3Q0FBd0MsbUNBQUE7O0FBRTVDLENBQUMsTUFBTSxFQUFFLFdBQVc7O0VBRWxCO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLElBQUMsRUFBQTtHQUNMLG9CQUFBLElBQUcsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsbUNBQW9DLENBQUEsRUFBQTtJQUNqRCxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLEtBQU0sQ0FBQSxFQUFBLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsT0FBUSxDQUFBLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBVyxDQUFLLENBQUEsRUFBQTtJQUMvRSxvQkFBQSxJQUFHLEVBQUEsSUFBQyxFQUFBLG1CQUFzQixDQUFBO0dBQ3RCLENBQUEsRUFBQTtHQUNMLG9CQUFBLElBQUcsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsc0NBQXVDLENBQUEsRUFBQTtJQUNwRCxvQkFBQSxJQUFHLEVBQUEsSUFBQyxFQUFBO0tBQ0gsb0JBQUEsR0FBRSxFQUFBLElBQUMsRUFBQTtNQUNGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsT0FBUSxDQUFBLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBVyxDQUFBLEVBQUEsSUFBQSxFQUFBO0FBQUEsTUFDdEQsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxPQUFRLENBQUEsRUFBQSxHQUFBLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBVyxDQUFBLEVBQUE7TUFDdkQsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxtQkFBb0IsQ0FBQSxFQUFBLFNBQWMsQ0FBQTtLQUMvQyxDQUFBO0lBQ0EsQ0FBQSxFQUFBO0lBQ0wsb0JBQUEsSUFBRyxFQUFBLElBQUMsRUFBQTtLQUNILG9CQUFBLEdBQUUsRUFBQSxJQUFDLEVBQUE7TUFDRixvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLE9BQVEsQ0FBQSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQWEsQ0FBQSxFQUFBO01BQ3hELG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsbUJBQW9CLENBQUEsRUFBQSxxQkFBMEIsQ0FBQTtLQUMzRCxDQUFBO0lBQ0EsQ0FBQTtHQUNELENBQUE7R0FDQyxDQUFBO0FBQ1QsSUFBSTs7QUFFSixFQUFFOztBQUVGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsbUJBQW1COzs7Ozs7QUNsQ3BDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN6RCxJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3pELElBQUksbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7O0FBRTdELElBQUksbUNBQW1DLDZCQUFBO0NBQ3RDLE1BQU0sRUFBRSxXQUFXO0VBQ2xCLElBQUksWUFBWSxFQUFFLDRCQUE0QixDQUFDO0VBQy9DLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtHQUN6QyxZQUFZLEVBQUUsVUFBVTtBQUMzQixHQUFHO0FBQ0g7O0VBRUUsSUFBSSxNQUFNLENBQUM7RUFDWCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtHQUM3QyxNQUFNLEdBQUcsb0JBQUMsbUJBQW1CLEVBQUEsQ0FBQSxDQUFDLE1BQUEsRUFBTSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQSxDQUFHLENBQUE7R0FDaEU7RUFDRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsaUJBQWtCLENBQUEsRUFBQTtJQUNoQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFlBQWMsQ0FBQSxFQUFBO0tBQzdCLG9CQUFDLGlCQUFpQixFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBQSxDQUFHLENBQUEsRUFBQTtLQUM1QyxvQkFBQyxpQkFBaUIsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUEsQ0FBRyxDQUFBLEVBQUE7S0FDM0MsTUFBTztJQUNILENBQUE7R0FDRCxDQUFBO0FBQ1QsSUFBSTs7RUFFRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYTs7Ozs7O0FDL0I5QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUU1RCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxQyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1QyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFNUQsSUFBSSxvQ0FBb0MsOEJBQUE7O0NBRXZDLGVBQWUsQ0FBQyxXQUFXO0VBQzFCLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLEVBQUU7O0NBRUQsaUJBQWlCLEVBQUUsV0FBVztFQUM3QixjQUFjLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ2pEO0NBQ0Qsb0JBQW9CLEVBQUUsV0FBVztFQUNoQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3BEO0NBQ0QsU0FBUyxDQUFDLFdBQVc7RUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMxQyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7QUFDbkI7O0VBRUUsSUFBSSxPQUFPLENBQUM7RUFDWixJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUM7RUFDN0IsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtHQUMzQyxPQUFPLEdBQUcsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxtQkFBb0IsQ0FBQSxFQUFBLG9CQUFDLGFBQWEsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUUsQ0FBTSxDQUFBLENBQUM7R0FDM0YsYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN0QixHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLElBQUMsRUFBQTtJQUNKLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsS0FBTSxDQUFBLEVBQUE7S0FDcEIsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyw0QkFBNkIsQ0FBQSxFQUFBO01BQzNDLG9CQUFDLFFBQVEsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsYUFBYSxFQUFDLENBQUMsV0FBQSxFQUFXLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFZLENBQUEsQ0FBRyxDQUFBLEVBQUE7TUFDMUUsT0FBTyxFQUFDO01BQ1Qsb0JBQUMsU0FBUyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxhQUFhLEVBQUMsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQSxDQUFHLENBQUE7S0FDL0QsQ0FBQTtJQUNELENBQUE7R0FDRCxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYzs7Ozs7O0FDaEQvQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXJELElBQUksOEJBQThCLHdCQUFBOztDQUVqQyxZQUFZLENBQUMsV0FBVztFQUN2QixVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDNUIsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLFdBQVcsR0FBRyw2QkFBNkIsQ0FBQztFQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7R0FDNUIsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM3QixHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVcsQ0FBQSxFQUFBO0lBQ3JDLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsV0FBVyxFQUFDLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFlBQWMsQ0FBQSxFQUFBO0tBQzFELG9EQUFxRDtLQUN0RCxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsS0FBQSxFQUFLLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBQSxFQUFNLENBQUMsSUFBQSxFQUFJLENBQUMsT0FBQSxFQUFPLENBQUMsV0FBWSxDQUFBLEVBQUE7TUFDbEYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxnREFBZ0QsQ0FBRSxDQUFBO0tBQ3JELENBQUE7SUFDRSxDQUFBO0dBQ0osQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVE7Ozs7OztBQzdCekIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUVyRCxJQUFJLCtCQUErQix5QkFBQTs7Q0FFbEMsWUFBWSxDQUFDLFdBQVc7RUFDdkIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3hCLEVBQUU7O0FBRUYsQ0FBQyxNQUFNLENBQUMsV0FBVzs7RUFFakIsSUFBSSxXQUFXLEdBQUcsOEJBQThCLENBQUM7RUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0dBQ3hCLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDN0IsR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFXLENBQUEsRUFBQTtJQUNyQyxvQkFBQSxRQUFPLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFdBQVcsRUFBQyxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxZQUFjLENBQUEsRUFBQTtLQUMxRCxvREFBcUQ7S0FDdEQsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxLQUFBLEVBQUssQ0FBQyw0QkFBQSxFQUE0QixDQUFDLEtBQUEsRUFBSyxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQUEsRUFBTSxDQUFDLElBQUEsRUFBSSxDQUFDLE9BQUEsRUFBTyxDQUFDLFdBQVksQ0FBQSxFQUFBO01BQ2xGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsQ0FBQSxFQUFDLENBQUMsaURBQWlELENBQUUsQ0FBQTtLQUN0RCxDQUFBO0lBQ0UsQ0FBQTtHQUNKLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTOzs7Ozs7QUM3QjFCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEQsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUM1RCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwRDs7QUFFQSxJQUFJLHdDQUF3QyxrQ0FBQTtBQUM1QyxDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDMUIsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDWjs7RUFFRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9CLEdBQUcsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3JEOztBQUVBLEdBQUcsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCOztHQUVHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDbkMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsRUFBRTtLQUN0RCxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQy9DLGNBQWMsQ0FBQyxJQUFJLENBQUMsb0JBQUMsYUFBYSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUEsRUFBRyxDQUFFLEdBQUcsRUFBQyxDQUFDLE1BQUEsRUFBTSxDQUFFLENBQUUsQ0FBRSxDQUFBLENBQUM7S0FDNUYsR0FBRyxFQUFFLENBQUM7S0FDTjtBQUNMLElBQUk7QUFDSjs7R0FFRyxNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQUU7SUFDdEIsV0FBVyxFQUFFLENBQUM7SUFDZCxjQUFjLENBQUMsSUFBSSxDQUFDLG9CQUFDLGFBQWEsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUUsU0FBUyxFQUFDLENBQUMsR0FBQSxFQUFHLENBQUUsR0FBRyxFQUFDLENBQUMsTUFBQSxFQUFNLENBQUUsQ0FBRSxDQUFFLENBQUEsQ0FBQyxDQUFDO0lBQzVFLEdBQUcsRUFBRSxDQUFDO0FBQ1YsSUFBSTs7QUFFSixHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxxQkFBc0IsQ0FBQSxFQUFBO0lBQ3BDLG9CQUFDLGlCQUFpQixFQUFBLENBQUEsQ0FBQyxXQUFBLEVBQVcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVksQ0FBRSxDQUFBLEVBQUE7SUFDeEQsY0FBYyxFQUFDO0lBQ2hCLG9CQUFDLGFBQWEsRUFBQSxDQUFBLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFRLENBQUUsQ0FBQTtHQUN4QyxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUc7Ozs7OztBQ2hEakIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFNUQsSUFBSSxtQ0FBbUMsNkJBQUE7Q0FDdEMsaUJBQWlCLENBQUMsV0FBVztFQUM1QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztFQUN4QjtDQUNELGtCQUFrQixDQUFDLFdBQVc7RUFDN0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDMUIsRUFBRTs7Q0FFRCxnQkFBZ0IsQ0FBQyxXQUFXO0FBQzdCLEVBQUUsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQzs7RUFFRSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0dBQzlDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUcsQ0FBQztHQUNwRCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ3ZFLEdBQUcsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUN6Qzs7R0FFRyxJQUFJLEVBQUUsYUFBYSxHQUFHLFlBQVksR0FBRyxZQUFZLENBQUMsRUFBRTtBQUN2RCxJQUFJLElBQUksTUFBTSxJQUFJLGFBQWEsR0FBRyxZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUM7QUFDL0Q7O0lBRUksSUFBSSxNQUFNLEdBQUcsWUFBWSxFQUFFO0tBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUN4RDtBQUNMLFNBQVM7O0tBRUosSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3ZELEtBQUs7O0lBRUQ7R0FDRDtBQUNILEVBQUU7O0FBRUYsQ0FBQyxNQUFNLENBQUMsV0FBVzs7RUFFakIsSUFBSSxXQUFXLEVBQUUsRUFBRSxDQUFDO0FBQ3RCLEVBQUUsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDOztBQUV6QixFQUFFLElBQUksU0FBUyxDQUFDLGdCQUFnQixDQUFDOztBQUVqQyxFQUFFLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7O0dBRTNDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7SUFDeEUsU0FBUyxJQUFJLFFBQVEsQ0FBQztBQUMxQixJQUFJOztHQUVELEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0lBQzVDLElBQUksS0FBSyxDQUFDO0FBQ2QsSUFBSSxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUM7O0lBRTFCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTTtLQUM1QixLQUFLLE9BQU87TUFDWCxLQUFLLENBQUMseURBQXlELENBQUM7TUFDaEUsV0FBVyxDQUFDLFNBQVMsQ0FBQztNQUN0QixNQUFNO0tBQ1AsS0FBSyxNQUFNO01BQ1YsS0FBSyxDQUFDLDJEQUEyRCxDQUFDO01BQ2xFLFdBQVcsQ0FBQyxTQUFTLENBQUM7TUFDdEIsTUFBTTtLQUNQLEtBQUssV0FBVztNQUNmLEtBQUssQ0FBQywyREFBMkQsQ0FBQztNQUNsRSxXQUFXLENBQUMsU0FBUyxDQUFDO01BQ3RCLE1BQU07S0FDUCxLQUFLLFNBQVM7TUFDYixLQUFLLENBQUMsMkRBQTJELENBQUM7TUFDbEUsV0FBVyxDQUFDLFNBQVMsQ0FBQztNQUN0QixNQUFNO0FBQ1osS0FBSyxRQUFROztBQUViLEtBQUs7QUFDTDs7SUFFSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtLQUMxQyxLQUFLLENBQUMsMERBQTBELENBQUM7S0FDakUsV0FBVyxDQUFDLFNBQVMsQ0FBQztBQUMzQixLQUFLOztJQUVELElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO0tBQ2pDLElBQUksTUFBTSxHQUFHO01BQ1osZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRztNQUNoQyxDQUFDO0tBQ0YsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFFLE1BQU0sRUFBQyxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQUEsRUFBYyxDQUFDLEdBQUEsRUFBRyxDQUFFLGNBQWdCLENBQU0sQ0FBQSxDQUFDO0tBQzFGLGNBQWMsRUFBRSxDQUFDO0tBQ2pCO0FBQ0wsSUFBSTtBQUNKOztHQUVHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQzVDLElBQUksTUFBTSxHQUFHLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEUsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFFLE1BQU0sRUFBQyxDQUFDLFNBQUEsRUFBUyxDQUFDLGlCQUFBLEVBQWlCLENBQUMsR0FBQSxFQUFHLENBQUUsY0FBZ0IsQ0FBTSxDQUFBLENBQUMsQ0FBQztJQUM5RixjQUFjLEVBQUUsQ0FBQztBQUNyQixJQUFJO0FBQ0o7O0dBRUcsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGNBQUEsRUFBYyxDQUFDLEdBQUEsRUFBRyxDQUFFLGNBQWdCLENBQUksQ0FBQSxDQUFDLENBQUM7QUFDM0UsR0FBRyxjQUFjLEVBQUUsQ0FBQztBQUNwQjs7R0FFRyxXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMseUJBQUEsRUFBeUIsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxjQUFnQixDQUFNLENBQUEsQ0FBQyxDQUFDO0FBQzFGLEdBQUcsY0FBYyxFQUFFLENBQUM7QUFDcEI7O0dBRUcsSUFBSSxNQUFNLENBQUM7R0FDWCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUMxQixNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkI7UUFDSTtJQUNKLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixJQUFJOztHQUVELFdBQVcsQ0FBQyxJQUFJO0lBQ2Ysb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxtQkFBQSxFQUFtQixDQUFDLEtBQUEsRUFBSyxDQUFFLE1BQU0sRUFBQyxDQUFDLEdBQUEsRUFBRyxDQUFFLGNBQWdCLENBQUEsRUFBQTtLQUN0RSxvQkFBQyxhQUFhLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFFLENBQUE7SUFDbEMsQ0FBQTtJQUNOLENBQUM7QUFDTCxHQUFHLGNBQWMsRUFBRSxDQUFDO0FBQ3BCOztHQUVHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7SUFDdEcsSUFBSSxPQUFPLENBQUM7SUFDWixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN6RCxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDeEIsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUNwQyxjQUFjLENBQUMsSUFBSSxDQUFDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsUUFBQSxFQUFRLENBQUMsR0FBQSxFQUFHLENBQUUsQ0FBRyxDQUFNLENBQUEsQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsT0FBTyxHQUFHLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsaUJBQUEsRUFBaUIsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxjQUFnQixDQUFBLEVBQUEsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxlQUFnQixDQUFBLEVBQUMsY0FBcUIsQ0FBTSxDQUFBLENBQUM7SUFDNUgsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQixjQUFjLEVBQUUsQ0FBQztBQUNyQixJQUFJOztBQUVKLEdBQUc7O0VBRUQ7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFNBQVMsRUFBQyxDQUFDLEtBQUEsRUFBSyxDQUFFLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBRyxDQUFBLEVBQUE7SUFDM0QsV0FBWTtHQUNSLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhOzs7Ozs7QUNqSjlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUM5RCxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFNUQsSUFBSSwrQkFBK0IseUJBQUE7Q0FDbEMsZUFBZSxFQUFFLFdBQVc7RUFDM0IsT0FBTyxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7RUFDckM7Q0FDRCxpQkFBaUIsRUFBRSxXQUFXO0VBQzdCLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDakQ7Q0FDRCxvQkFBb0IsRUFBRSxXQUFXO0VBQ2hDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsRUFBRTs7Q0FFRCxTQUFTLENBQUMsV0FBVztFQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLEVBQUU7O0NBRUQsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFBLEVBQUE7SUFDbEMsb0JBQUMsa0JBQWtCLEVBQUEsQ0FBQTtLQUNsQixTQUFBLEVBQVMsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFDO0tBQ3ZDLFdBQUEsRUFBVyxDQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxXQUFXLEVBQUM7S0FDakUsT0FBQSxFQUFPLENBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsS0FBSyxXQUFZLENBQUE7SUFDeEQsQ0FBQTtHQUNHLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTOzs7Ozs7QUNqQzFCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFckQsSUFBSSxtQ0FBbUMsNkJBQUE7Q0FDdEMsWUFBWSxDQUFDLFdBQVc7RUFDdkIsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzdCLEVBQUU7O0FBRUYsQ0FBQyxNQUFNLENBQUMsV0FBVzs7RUFFakIsSUFBSSxXQUFXLEdBQUcsa0JBQWtCLENBQUM7RUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0dBQ3hCLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDN0IsR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsNEJBQTZCLENBQUEsRUFBQTtJQUMzQyxvQkFBQSxRQUFPLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFdBQVcsRUFBQyxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxZQUFjLENBQUEsRUFBQTtLQUMxRCxvREFBcUQ7S0FDdEQsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxLQUFBLEVBQUssQ0FBQyw0QkFBQSxFQUE0QixDQUFDLEtBQUEsRUFBSyxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQUEsRUFBTSxDQUFDLElBQUEsRUFBSSxDQUFDLE9BQUEsRUFBTyxDQUFDLFdBQVksQ0FBQSxFQUFBO01BQ2xGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsQ0FBQSxFQUFDLENBQUMsaURBQWlELENBQUUsQ0FBQTtLQUN0RCxDQUFBO0lBQ0UsQ0FBQTtHQUNKLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhOzs7Ozs7QUM1QjlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFckQsSUFBSSx1Q0FBdUMsaUNBQUE7Q0FDMUMsWUFBWSxDQUFDLFdBQVc7RUFDdkIsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDakMsRUFBRTs7QUFFRixDQUFDLE1BQU0sQ0FBQyxXQUFXOztFQUVqQixJQUFJLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztFQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7R0FDNUIsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUM3QixHQUFHOztFQUVEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyw0QkFBNkIsQ0FBQSxFQUFBO0lBQzNDLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsV0FBVyxFQUFDLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFlBQWMsQ0FBQSxFQUFBO0tBQzFELG9EQUFxRDtLQUN0RCxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFDLDRCQUFBLEVBQTRCLENBQUMsS0FBQSxFQUFLLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBQSxFQUFNLENBQUMsSUFBQSxFQUFJLENBQUMsT0FBQSxFQUFPLENBQUMsV0FBWSxDQUFBLEVBQUE7TUFDbEYsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxnREFBZ0QsQ0FBRSxDQUFBO0tBQ3JELENBQUE7SUFDRSxDQUFBO0dBQ0osQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQjs7Ozs7O0FDNUJsQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUkseUNBQXlDLG1DQUFBO0FBQzdDO0FBQ0E7O0NBRUMsV0FBVyxDQUFDLFdBQVc7RUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0VBRWpCLElBQUksY0FBYyxHQUFHO0dBQ3BCLFNBQVMsQ0FBQyxNQUFNO0dBQ2hCLFFBQVEsQ0FBQyxNQUFNO0dBQ2YsY0FBYyxDQUFDLElBQUk7R0FDbkIsSUFBSSxDQUFDLE1BQU07R0FDWCxjQUFjLENBQUMsSUFBSTtHQUNuQixNQUFNLENBQUMsS0FBSztBQUNmLEdBQUc7O0VBRUQsSUFBSSxXQUFXLEdBQUcsZ0JBQWdCLENBQUM7RUFDbkMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtHQUN4QixXQUFXLEdBQUcsV0FBVztBQUM1QixHQUFHOztFQUVELElBQUksVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEUsRUFBRSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7O0VBRTdDO0dBQ0Msb0JBQUEsSUFBRyxFQUFBLElBQUMsRUFBQTtJQUNILG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsV0FBVyxFQUFDLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLFdBQWEsQ0FBQSxFQUFBO0tBQzFELG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsVUFBWSxDQUFNLENBQUEsRUFBQTtLQUNsQyxvQkFBQSxNQUFLLEVBQUEsSUFBQyxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBVSxDQUFBLEVBQUE7S0FDNUMsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQVMsQ0FBQTtJQUM1RCxDQUFBO0dBQ0wsQ0FBQTtJQUNKO0FBQ0osRUFBRTs7QUFFRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLG1CQUFtQjs7Ozs7O0FDMUNwQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFakUsSUFBSSxtQ0FBbUMsNkJBQUE7O0NBRXRDLE1BQU0sQ0FBQyxXQUFXO0VBQ2pCLElBQUksUUFBUSxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RixFQUFFLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0VBRXJDLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUMxQixFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDekM7O0dBRUcsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0dBQ3JCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ3hDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSTtBQUNKOztHQUVHLGNBQWMsQ0FBQyxJQUFJO0lBQ2xCLG9CQUFDLG1CQUFtQixFQUFBLENBQUE7S0FDbkIsSUFBQSxFQUFJLENBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDO0tBQ2xCLFdBQUEsRUFBVyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFDO0tBQ3BDLEdBQUEsRUFBRyxDQUFFLENBQUMsRUFBQztLQUNQLFFBQUEsRUFBUSxDQUFFLFFBQVEsRUFBQztLQUNuQixNQUFBLEVBQU0sQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU8sQ0FBQTtLQUN4QixDQUFBO0lBQ0gsQ0FBQztBQUNMLEdBQUc7QUFDSDs7RUFFRTtHQUNDLG9CQUFBLEtBQUksRUFBQSxJQUFDLEVBQUE7SUFDSixvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGdCQUFpQixDQUFBLEVBQUE7S0FDN0IsY0FBZTtJQUNaLENBQUE7R0FDQSxDQUFBO0FBQ1QsSUFBSTs7RUFFRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYTs7Ozs7O0FDMUM5QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksMENBQTBDLG9DQUFBOztDQUU3QyxZQUFZLENBQUMsV0FBVztFQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLEVBQUU7O0FBRUYsQ0FBQyxNQUFNLENBQUMsV0FBVzs7RUFFakIsSUFBSSxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDbkUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtHQUN4QixXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQzdCLEdBQUc7O0VBRUQ7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGdCQUFpQixDQUFBLEVBQUE7SUFDL0Isb0JBQUEsUUFBTyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxXQUFXLEVBQUMsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsWUFBYSxDQUFFLENBQUEsRUFBQTtLQUM1RCxvQkFBQSxLQUFJLEVBQUEsSUFBTyxDQUFBLEVBQUE7S0FDWCxvQkFBQSxNQUFLLEVBQUEsSUFBQyxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBVSxDQUFBO0lBQ3RDLENBQUE7R0FDSixDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsb0JBQW9COzs7Ozs7QUMxQnJDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFbkUsSUFBSSxvQ0FBb0MsOEJBQUE7O0NBRXZDLE1BQU0sQ0FBQyxXQUFXO0VBQ2pCLElBQUksWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELEVBQUUsSUFBSSxjQUFjLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUM7O0VBRXhEO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxpQkFBa0IsQ0FBQSxFQUFBO0lBQ2hDLG9CQUFDLG9CQUFvQixFQUFBLENBQUEsQ0FBQyxNQUFBLEVBQU0sQ0FBQyxNQUFBLEVBQU0sQ0FBQyxZQUFBLEVBQVksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBQyxDQUFDLFFBQUEsRUFBUSxDQUFFLFlBQWEsQ0FBQSxDQUFHLENBQUEsRUFBQTtJQUNyRyxvQkFBQyxvQkFBb0IsRUFBQSxDQUFBLENBQUMsTUFBQSxFQUFNLENBQUMsUUFBQSxFQUFRLENBQUMsWUFBQSxFQUFZLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUMsQ0FBQyxRQUFBLEVBQVEsQ0FBRSxjQUFlLENBQUEsQ0FBRyxDQUFBO0dBQ3BHLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjOzs7Ozs7QUNuQi9CLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxzQ0FBc0MsZ0NBQUE7Q0FDekMsY0FBYyxDQUFDLFVBQVU7RUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELEVBQUU7O0NBRUQsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGtCQUFtQixDQUFBLEVBQUE7SUFDakMsb0JBQUEsT0FBTSxFQUFBLElBQUMsRUFBQTtLQUNOLG9CQUFBLE9BQU0sRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsVUFBQSxFQUFVLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQUEsRUFBa0IsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBQyxDQUFDLFFBQUEsRUFBUSxDQUFFLElBQUksQ0FBQyxjQUFlLENBQUUsQ0FBQSxFQUFBO0tBQ2xILG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsZ0JBQWlCLENBQUEsRUFBQSxXQUFBLEVBQVMsb0JBQUEsTUFBSyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQSxNQUFXLENBQU8sQ0FBQTtJQUNqRixDQUFBO0dBQ0gsQ0FBQTtJQUNMO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQjs7Ozs7O0FDbkJqQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN4RCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFbkQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEQsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdEQsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMxRCxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztBQUUxRCxJQUFJLGtDQUFrQyw0QkFBQTs7Q0FFckMsZUFBZSxDQUFDLFdBQVc7RUFDMUIsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUNsRSxPQUFPLE9BQU8sQ0FBQztFQUNmO0NBQ0QsaUJBQWlCLEVBQUUsV0FBVztFQUM3QixRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzNDO0NBQ0Qsb0JBQW9CLEVBQUUsV0FBVztFQUNoQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzlDO0NBQ0QsU0FBUyxDQUFDLFdBQVc7RUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUN4QyxFQUFFOztDQUVELFlBQVksQ0FBQyxTQUFTLE1BQU0sRUFBRTtFQUM3QixVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUMxQztDQUNELFdBQVcsQ0FBQyxTQUFTLE1BQU0sRUFBRTtFQUM1QixVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUMxQztDQUNELGNBQWMsQ0FBQyxTQUFTLElBQUksRUFBRTtFQUM3QixVQUFVLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMxQztDQUNELGNBQWMsQ0FBQyxTQUFTLElBQUksRUFBRTtFQUM3QixVQUFVLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0VBRWpCLElBQUksU0FBUyxHQUFHLGVBQWUsQ0FBQztFQUNoQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0dBQ3ZCLFNBQVMsSUFBSSxTQUFTLENBQUM7R0FDdkI7RUFDRDtHQUNDLG9CQUFBLFNBQVEsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUUsU0FBVyxDQUFBLEVBQUE7SUFDOUIsb0JBQUMsYUFBYSxFQUFBLENBQUEsQ0FBQyxXQUFBLEVBQVcsQ0FBRSxJQUFJLENBQUMsV0FBVyxFQUFDLENBQUMsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsQ0FBQyxNQUFBLEVBQU0sQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU8sQ0FBRSxDQUFBLEVBQUE7SUFDdkcsb0JBQUMsY0FBYyxFQUFBLENBQUEsQ0FBQyxZQUFBLEVBQVksQ0FBRSxJQUFJLENBQUMsWUFBWSxFQUFDLENBQUMsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFPLENBQUUsQ0FBQSxFQUFBO0lBQy9FLG9CQUFDLGdCQUFnQixFQUFBLENBQUEsQ0FBQyxRQUFBLEVBQVEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBQyxDQUFDLGNBQUEsRUFBYyxDQUFFLElBQUksQ0FBQyxjQUFlLENBQUUsQ0FBQSxFQUFBO0lBQ3ZGLG9CQUFDLGdCQUFnQixFQUFBLENBQUEsQ0FBQyxRQUFBLEVBQVEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBQyxDQUFDLGNBQUEsRUFBYyxDQUFFLElBQUksQ0FBQyxjQUFlLENBQUUsQ0FBQTtHQUM5RSxDQUFBO0lBQ1Q7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWTs7Ozs7O0FDMUQ3QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksc0NBQXNDLGdDQUFBO0NBQ3pDLGNBQWMsQ0FBQyxXQUFXO0VBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRCxFQUFFOztDQUVELE1BQU0sQ0FBQyxXQUFXO0VBQ2pCO0dBQ0Msb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxrQkFBbUIsQ0FBQSxFQUFBO0lBQ2pDLG9CQUFBLE9BQU0sRUFBQSxJQUFDLEVBQUE7S0FDTixvQkFBQSxPQUFNLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLFVBQUEsRUFBVSxDQUFDLFNBQUEsRUFBUyxDQUFDLGtCQUFBLEVBQWtCLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUMsQ0FBQyxRQUFBLEVBQVEsQ0FBRSxJQUFJLENBQUMsY0FBZSxDQUFFLENBQUEsRUFBQTtLQUNsSCxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGdCQUFpQixDQUFBLEVBQUEsV0FBQSxFQUFTLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsV0FBWSxDQUFBLEVBQUEsTUFBVyxDQUFPLENBQUE7SUFDakYsQ0FBQTtHQUNILENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0I7Ozs7OztBQ25CakMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDckQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRWhELElBQUksZ0NBQWdDLDBCQUFBOztDQUVuQyxlQUFlLENBQUMsV0FBVztFQUMxQixPQUFPO0dBQ04sTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNO0dBQ3BDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztHQUNuRCxDQUFDO0VBQ0Y7Q0FDRCxpQkFBaUIsRUFBRSxXQUFXO0VBQzdCLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDM0M7Q0FDRCxvQkFBb0IsRUFBRSxXQUFXO0VBQ2hDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDOUM7Q0FDRCxTQUFTLENBQUMsV0FBVztFQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDO0dBQ2IsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0dBQ25ELENBQUMsQ0FBQztFQUNIO0FBQ0YsQ0FBQyxPQUFPLENBQUMsV0FBVzs7RUFFbEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7RUFDekMsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs7RUFFekMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztFQUNqQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3pCLFVBQVUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkQsRUFBRSxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7RUFFdEUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtHQUN0QixVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDekI7RUFDRDtDQUNELFVBQVUsQ0FBQyxXQUFXO0VBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0VBRWpCLElBQUksU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUNoQyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOztFQUVwQztHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsYUFBYyxDQUFBLEVBQUE7SUFDNUIsb0JBQUEsUUFBTyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxRQUFBLEVBQVEsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsT0FBUyxDQUFBLEVBQUE7S0FDakQsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBRSxTQUFXLENBQU0sQ0FBQSxFQUFBO0tBQ2pDLG9CQUFBLE1BQUssRUFBQSxJQUFDLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBWSxDQUFBO0lBQzNCLENBQUEsRUFBQTtJQUNULG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsZ0JBQWlCLENBQUEsRUFBQTtLQUMvQixvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFBLEVBQW1CLENBQUMsT0FBQSxFQUFPLENBQUUsSUFBSSxDQUFDLE9BQVMsQ0FBQSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQVksQ0FBQSxFQUFBO0tBQ3hGLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsYUFBYyxDQUFBLEVBQUE7TUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUM7TUFDdkIsb0JBQUEsR0FBRSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxjQUFBLEVBQWMsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsVUFBWSxDQUFBLEVBQUE7T0FDcEQsb0RBQXFEO09BQ3RELG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsS0FBQSxFQUFLLENBQUMsNEJBQUEsRUFBNEIsQ0FBQyxLQUFBLEVBQUssQ0FBQyxJQUFBLEVBQUksQ0FBQyxNQUFBLEVBQU0sQ0FBQyxJQUFBLEVBQUksQ0FBQyxPQUFBLEVBQU8sQ0FBQyxXQUFZLENBQUEsRUFBQTtRQUNsRixvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLENBQUEsRUFBQyxDQUFDLCtFQUErRSxDQUFFLENBQUE7T0FDcEYsQ0FBQTtNQUNILENBQUE7S0FDRSxDQUFBO0lBQ0YsQ0FBQTtHQUNELENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVOzs7Ozs7QUN6RTNCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDOUMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRWhELElBQUksaUNBQWlDLDJCQUFBO0NBQ3BDLGVBQWUsQ0FBQyxXQUFXO0VBQzFCLE9BQU8sUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQzlCO0NBQ0QsaUJBQWlCLEVBQUUsV0FBVztFQUM3QixRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzNDO0NBQ0Qsb0JBQW9CLEVBQUUsV0FBVztFQUNoQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzlDO0NBQ0QsU0FBUyxDQUFDLFdBQVc7RUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUN4QyxFQUFFOztBQUVGLENBQUMsTUFBTSxDQUFDLFdBQVc7O0FBRW5CLEVBQUUsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDO0FBQ25DOztFQUVFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0dBQzFHLFdBQVcsRUFBRSxPQUFPLENBQUM7QUFDeEIsR0FBRzs7RUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0dBQ3JCLFdBQVcsRUFBRSxTQUFTLENBQUM7QUFDMUIsR0FBRzs7RUFFRCxJQUFJLEtBQUssR0FBRztHQUNYLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2xELENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNsRCxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDaEQsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2xELENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ3BELENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNsRCxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUMxRCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUN0RCxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNwRCxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDaEQsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDcEQsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDcEQsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDekQsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDekQsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2hELENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3hELEdBQUc7O0VBRUQsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0VBQ3JCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7RUFDL0IsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtHQUNwQyxXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFDLFVBQVUsRUFBQSxDQUFBLENBQUMsR0FBQSxFQUFHLENBQUUsQ0FBQyxFQUFDLENBQUMsSUFBQSxFQUFJLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBRSxDQUFFLENBQUEsQ0FBQyxDQUFDO0FBQzNELEdBQUc7O0VBRUQ7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLFdBQVcsRUFBQyxDQUFDLEVBQUEsRUFBRSxDQUFDLGNBQWUsQ0FBQSxFQUFBO0lBQzdDLFdBQVk7R0FDUixDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVzs7Ozs7QUNqRTVCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFckMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDM0IsQ0FBQyxRQUFRLENBQUMsSUFBSTs7Q0FFYixRQUFRLENBQUMsSUFBSTtBQUNkLENBQUMsUUFBUSxDQUFDLElBQUk7O0NBRWIsU0FBUyxDQUFDLElBQUk7QUFDZixDQUFDLFNBQVMsQ0FBQyxJQUFJOztDQUVkLGNBQWMsQ0FBQyxJQUFJO0FBQ3BCLENBQUMsZ0JBQWdCLENBQUMsSUFBSTs7Q0FFckIsY0FBYyxDQUFDLElBQUk7Q0FDbkIsWUFBWSxDQUFDLElBQUk7Q0FDakIsQ0FBQzs7O0FDaEJGLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUM7O0FBRTVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxVQUFVLEVBQUU7Ozs7QUNGakMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ2xELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3hELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFdEMsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDOztBQUU1QixJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBSSxRQUFRLEdBQUc7Q0FDZCxNQUFNLENBQUMsV0FBVztDQUNsQixNQUFNLENBQUMsUUFBUTtDQUNmLFFBQVEsQ0FBQyxLQUFLO0NBQ2QsUUFBUSxDQUFDLElBQUk7Q0FDYixJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Q0FDL0QsQ0FBQztBQUNGLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRWxCLElBQUksZ0JBQWdCLENBQUM7O0FBRXJCLHFEQUFxRDtBQUNyRCw4Q0FBOEM7QUFDOUMsYUFBYTtBQUNiLFNBQVMsaUJBQWlCLEdBQUc7Q0FDNUIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxZQUFZLEtBQUssV0FBVyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0NBQzdGLFNBQVMsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQztDQUM3QyxJQUFJLFNBQVMsRUFBRTtFQUNkLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztFQUNyRCxJQUFJO0dBQ0gsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDdkMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNqQztFQUNELE9BQU8sR0FBRyxFQUFFO0dBQ1gsU0FBUyxHQUFHLEtBQUssQ0FBQztHQUNsQjtFQUNEO0NBQ0QsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO0FBQzlCLENBQUM7O0FBRUQsU0FBUyxXQUFXLEdBQUc7Q0FDdEIsV0FBVyxDQUFDLEtBQUssR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7Q0FDdkMsV0FBVyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Q0FDNUI7QUFDRCxTQUFTLGFBQWEsR0FBRztDQUN4QixXQUFXLENBQUMsT0FBTyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztDQUMzQyxXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUMzQixDQUFDOztBQUVELFNBQVMsV0FBVyxHQUFHO0NBQ3RCLE9BQU8sV0FBVyxDQUFDO0FBQ3BCLENBQUM7O0FBRUQsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFO0NBQ3ZCLE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixDQUFDOztBQUVELFNBQVMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Q0FDL0IsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztDQUN2QixLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDOUUsWUFBWSxFQUFFLENBQUM7QUFDaEIsQ0FBQzs7QUFFRCxTQUFTLFlBQVksR0FBRztDQUN2QixJQUFJLGdCQUFnQixFQUFFO0VBQ3JCLFlBQVksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUMxRCxZQUFZLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDdkQsWUFBWSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ3ZEO0FBQ0YsQ0FBQzs7QUFFRCxTQUFTLGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0NBQ2pDLElBQUksT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO0VBQzVDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUM7RUFDdEI7TUFDSTtFQUNKLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7RUFDdkI7Q0FDRCxJQUFJLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsRUFBRTtFQUN6QyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDO0VBQ25CO01BQ0k7RUFDSixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ2xCO0NBQ0QsWUFBWSxFQUFFLENBQUM7QUFDaEIsQ0FBQztBQUNEOztBQUVBLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztDQUMvQyxXQUFXLENBQUMsV0FBVztBQUN4QixDQUFDLFNBQVMsQ0FBQyxTQUFTOztDQUVuQixVQUFVLENBQUMsVUFBVTtFQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3hCO0NBQ0QsaUJBQWlCLENBQUMsU0FBUyxRQUFRLEVBQUU7RUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDL0I7Q0FDRCxvQkFBb0IsQ0FBQyxTQUFTLFFBQVEsRUFBRTtFQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUMzQztBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILHNCQUFzQjtBQUN0QixTQUFTLFdBQVcsR0FBRztBQUN2QixDQUFDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLENBQUM7QUFDekM7O0NBRUMsSUFBSSxNQUFNLEtBQUssV0FBVyxDQUFDLE1BQU0sRUFBRTtFQUNsQyxXQUFXLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztFQUM1QixXQUFXLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDO0VBQzVCLFdBQVcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDOUI7QUFDRixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRTdCLENBQUM7O0FBRUQsU0FBUyxJQUFJLEdBQUc7Q0FDZixpQkFBaUIsRUFBRSxDQUFDO0NBQ3BCLFdBQVcsRUFBRSxDQUFDO0FBQ2YsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQzs7QUFFL0IsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztDQUU3QixJQUFJLGdCQUFnQixFQUFFO0FBQ3ZCLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEU7O0VBRUUsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUN6QyxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0VBQ3BDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7R0FDbEMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkYsR0FBRztBQUNIOztFQUVFLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEUsRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEU7O0VBRUUsWUFBWSxFQUFFLENBQUM7RUFDZjtBQUNGLENBQUM7O0FBRUQsSUFBSSxFQUFFLENBQUM7O0FBRVAsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLE1BQU0sRUFBRTtDQUN2QyxPQUFPLE1BQU0sQ0FBQyxVQUFVO0VBQ3ZCLEtBQUssWUFBWSxDQUFDLGNBQWM7R0FDL0IsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3JDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUN0QixNQUFNO0VBQ1AsS0FBSyxZQUFZLENBQUMsZ0JBQWdCO0dBQ2pDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUN2QyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDdEIsTUFBTTtFQUNQLEtBQUssWUFBWSxDQUFDLFlBQVk7R0FDN0IsV0FBVyxFQUFFLENBQUM7R0FDZCxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDdEIsTUFBTTtFQUNQLEtBQUssWUFBWSxDQUFDLGNBQWM7R0FDL0IsYUFBYSxFQUFFLENBQUM7R0FDaEIsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ3RCLE1BQU07QUFDVCxFQUFFLFFBQVE7O0VBRVI7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVE7Ozs7O0FDekt6QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMzRCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ2xELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3hELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFdEMsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDOztBQUU1QiwwRUFBMEU7QUFDMUUsSUFBSSxpQkFBaUIsQ0FBQztBQUN0QixJQUFJLGdCQUFnQixDQUFDO0FBQ3JCLElBQUksYUFBYSxDQUFDOztBQUVsQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7O0FBRXJCLHdFQUF3RTtBQUN4RSxTQUFTLGVBQWUsR0FBRztBQUMzQixDQUFDLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQzs7QUFFdkIsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFOztFQUV0QixZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLEVBQUU7QUFDRjs7QUFFQSxDQUFDLGlCQUFpQixHQUFHLGFBQWEsSUFBSSxnQkFBZ0IsSUFBSSxTQUFTLENBQUM7O0NBRW5FLGdCQUFnQixHQUFHLFlBQVksQ0FBQztBQUNqQyxDQUFDOztBQUVELFNBQVMsWUFBWSxHQUFHO0NBQ3ZCLE9BQU87RUFDTixpQkFBaUIsQ0FBQyxpQkFBaUI7RUFDbkMsZ0JBQWdCLENBQUMsZ0JBQWdCO0VBQ2pDLGFBQWEsQ0FBQyxhQUFhO0VBQzNCLENBQUM7QUFDSCxDQUFDOztBQUVELFNBQVMsT0FBTyxHQUFHO0NBQ2xCLE9BQU87RUFDTixXQUFXLEVBQUUsWUFBWSxLQUFLLENBQUMsQ0FBQztFQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztFQUN4QixPQUFPLEVBQUUsWUFBWSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQ3pDLENBQUM7QUFDSCxDQUFDOztBQUVELFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRTtBQUN2QixDQUFDLElBQUksZUFBZSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzs7QUFFL0MsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsR0FBRyxFQUFFOztFQUUxQyxJQUFJLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDOUMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRTs7R0FFdEMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7SUFDakQsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMxQztBQUNKLEdBQUc7QUFDSDs7RUFFRSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNsQyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7R0FFL0IsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ2pCLE9BQU87R0FDUDtBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0NBRUMsSUFBSSxPQUFPLGFBQWEsS0FBSyxXQUFXLEVBQUU7RUFDekMsUUFBUSxFQUFFLENBQUM7RUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEIsRUFBRTs7TUFFSTtFQUNKLGVBQWUsRUFBRSxDQUFDO0VBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNkO0FBQ0YsQ0FBQzs7QUFFRCxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDMUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCOztDQUVDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7RUFDdEIsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hCLEVBQUU7QUFDRjs7Q0FFQyxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDakMsQ0FBQzs7QUFFRCxTQUFTLFlBQVksR0FBRztDQUN2QixJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7RUFDdkIsWUFBWSxHQUFHLENBQUMsQ0FBQztFQUNqQjtDQUNEO0FBQ0QsU0FBUyxRQUFRLEdBQUc7Q0FDbkIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7RUFDbkMsWUFBWSxHQUFHLENBQUMsQ0FBQztFQUNqQjtBQUNGLENBQUM7O0FBRUQsMENBQTBDO0FBQzFDLFNBQVMsWUFBWSxHQUFHO0NBQ3ZCLEdBQUcsT0FBTyxpQkFBaUIsS0FBSyxXQUFXLEVBQUU7RUFDNUMsYUFBYSxHQUFHLGdCQUFnQixDQUFDO0VBQ2pDLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDO0VBQ3JDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztFQUM5QjtBQUNGLENBQUM7O0FBRUQsc0NBQXNDO0FBQ3RDLFNBQVMsUUFBUSxHQUFHO0NBQ25CLEdBQUcsT0FBTyxhQUFhLEtBQUssV0FBVyxFQUFFO0VBQ3hDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO0VBQ3JDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQztFQUNqQyxhQUFhLEdBQUcsU0FBUyxDQUFDO0VBQzFCO0FBQ0YsQ0FBQzs7QUFFRCxnREFBZ0Q7QUFDaEQsZUFBZSxFQUFFLENBQUM7O0FBRWxCLElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQztDQUN0RCxZQUFZLENBQUMsWUFBWTtDQUN6QixZQUFZLENBQUMsWUFBWTtDQUN6QixRQUFRLENBQUMsUUFBUTtDQUNqQixPQUFPLENBQUMsT0FBTztDQUNmLE9BQU8sQ0FBQyxPQUFPO0NBQ2YsWUFBWSxDQUFDLFlBQVk7QUFDMUIsQ0FBQyxRQUFRLENBQUMsUUFBUTs7Q0FFakIsVUFBVSxDQUFDLFVBQVU7RUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUN4QjtDQUNELGlCQUFpQixDQUFDLFNBQVMsUUFBUSxFQUFFO0VBQ3BDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQy9CO0NBQ0Qsb0JBQW9CLENBQUMsU0FBUyxRQUFRLEVBQUU7RUFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDM0M7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsTUFBTSxFQUFFO0FBQ3hDLENBQUMsT0FBTyxNQUFNLENBQUMsVUFBVTs7RUFFdkIsS0FBSyxZQUFZLENBQUMsUUFBUTtHQUN6QixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3JCLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMvQixHQUFHLE1BQU07O0VBRVAsS0FBSyxZQUFZLENBQUMsUUFBUTtHQUN6QixZQUFZLEVBQUUsQ0FBQztHQUNmLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMvQixHQUFHLE1BQU07O0VBRVAsS0FBSyxZQUFZLENBQUMsUUFBUTtHQUN6QixRQUFRLEVBQUUsQ0FBQztHQUNYLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMvQixHQUFHLE1BQU07O0VBRVAsS0FBSyxZQUFZLENBQUMsU0FBUztHQUMxQixZQUFZLEVBQUUsQ0FBQztHQUNmLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMvQixHQUFHLE1BQU07O0VBRVAsS0FBSyxZQUFZLENBQUMsU0FBUztHQUMxQixRQUFRLEVBQUUsQ0FBQztHQUNYLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMvQixHQUFHLE1BQU07O0FBRVQsRUFBRSxRQUFROztFQUVSO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgTmF2YmFyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NvbW1vbi9uYXZiYXIuanN4Jyk7XHJcbnZhciBPcHRpb25zUGFuZWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMva2FkYWxhLW9wdGlvbnMvb3B0aW9ucy1wYW5lbC5qc3gnKTtcclxudmFyIEthZGFsYVN0b3JlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2thZGFsYS1zdG9yZS9rYWRhbGEtc3RvcmUuanN4Jyk7XHJcbnZhciBJbnZlbnRvcnkgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaW52ZW50b3J5L2ludmVudG9yeS5qc3gnKTtcclxudmFyIEluZGl2aWR1YWxJdGVtID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2luZGl2aWR1YWwtaXRlbS9pbmRpdmlkdWFsLWl0ZW0uanN4Jyk7XHJcbnZhciBGb290ZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY29tbW9uL2Zvb3Rlci5qc3gnKTtcclxuXHJcbnZhciBBcHBTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmVzL0FwcFN0b3JlLmpzJyk7XHJcblxyXG52YXIgQXBwbGljYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIEFwcFN0b3JlLmdldFNldHRpbmdzKCk7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblxyXG5cdFx0Ly9vcGFjaXR5IG9uIGxvYWRlciBmb3IgdGhlIG5pY2UgZmFkZSBlZmZlY3QgdmlhIGNzcyB0cmFuc2l0aW9uXHJcblx0XHR2YXIgbG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmcnKTtcclxuXHRcdGxvYWRlci5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG5cclxuXHRcdC8vZGlzcGxheSBub25lIHNvIHdlIGNhbiBjbGljayB0aHJvdWdoIGl0IGFzIHBvaW50ZXItZXZlbnRzIGlzIGJ1Z2d5XHJcblx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0bG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHR9LDEwMDApO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShBcHBTdG9yZS5nZXRTZXR0aW5ncygpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly9jb25kaXRpb25hbGx5IHJlbmRlciBlaXRoZXIgdGhlIGludmVudG9yeSBvciBpbmRpdmlkdWFsIGl0ZW0gYmFzZWQgb24gc2NyZWVuIHNpemVcclxuXHRcdHZhciBpbnZlbnRvcnk7XHJcblx0XHR2YXIgaW5kaXZpZHVhbEl0ZW07XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUubW9iaWxlKSB7XHJcblx0XHRcdGluZGl2aWR1YWxJdGVtID0gPEluZGl2aWR1YWxJdGVtIC8+XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aW52ZW50b3J5ID0gPEludmVudG9yeSAvPlxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdFx0PE5hdmJhciBtb2JpbGU9e3RoaXMuc3RhdGUubW9iaWxlfSAvPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXItZmx1aWQnPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjb2wtc20tMyc+XHJcblx0XHRcdFx0XHRcdFx0PE9wdGlvbnNQYW5lbCAvPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbC1zbS05Jz5cclxuXHRcdFx0XHRcdFx0XHQ8S2FkYWxhU3RvcmUvPlxyXG5cdFx0XHRcdFx0XHRcdHtpbnZlbnRvcnl9XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncm93Jz5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NvbC1zbS0xMic+XHJcblx0XHRcdFx0XHRcdFx0e2luZGl2aWR1YWxJdGVtfVxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDxGb290ZXIgLz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5SZWFjdC5yZW5kZXIoXHJcblx0PEFwcGxpY2F0aW9uIC8+LFxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKVxyXG4pOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMuRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vbGliL0Rpc3BhdGNoZXInKVxuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBEaXNwYXRjaGVyXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnLi9pbnZhcmlhbnQnKTtcblxudmFyIF9sYXN0SUQgPSAxO1xudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NpdHktdXBkYXRlJykge1xuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBwYXlsb2FkLnNlbGVjdGVkQ2l0eTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIGNvdW50cnksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NvdW50cnktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENvdW50cnk6ICdhdXN0cmFsaWEnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBib3RoIHN0b3JlczpcbiAqXG4gKiAgICBDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIENvdW50cnlTdG9yZS5jb3VudHJ5ID0gcGF5bG9hZC5zZWxlY3RlZENvdW50cnk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSBjYWxsYmFjayB0byB1cGRhdGUgYENvdW50cnlTdG9yZWAgaXMgcmVnaXN0ZXJlZCwgd2Ugc2F2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhlIHJldHVybmVkIHRva2VuLiBVc2luZyB0aGlzIHRva2VuIHdpdGggYHdhaXRGb3IoKWAsIHdlIGNhbiBndWFyYW50ZWVcbiAqIHRoYXQgYENvdW50cnlTdG9yZWAgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrIHRoYXQgdXBkYXRlcyBgQ2l0eVN0b3JlYFxuICogbmVlZHMgdG8gcXVlcnkgaXRzIGRhdGEuXG4gKlxuICogICBDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgbWF5IG5vdCBiZSB1cGRhdGVkLlxuICogICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBpcyBub3cgZ3VhcmFudGVlZCB0byBiZSB1cGRhdGVkLlxuICpcbiAqICAgICAgIC8vIFNlbGVjdCB0aGUgZGVmYXVsdCBjaXR5IGZvciB0aGUgbmV3IGNvdW50cnlcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gZ2V0RGVmYXVsdENpdHlGb3JDb3VudHJ5KENvdW50cnlTdG9yZS5jb3VudHJ5KTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSB1c2FnZSBvZiBgd2FpdEZvcigpYCBjYW4gYmUgY2hhaW5lZCwgZm9yIGV4YW1wbGU6XG4gKlxuICogICBGbGlnaHRQcmljZVN0b3JlLmRpc3BhdGNoVG9rZW4gPVxuICogICAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvblR5cGUpIHtcbiAqICAgICAgICAgY2FzZSAnY291bnRyeS11cGRhdGUnOlxuICogICAgICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIGdldEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqXG4gKiAgICAgICAgIGNhc2UgJ2NpdHktdXBkYXRlJzpcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBgY291bnRyeS11cGRhdGVgIHBheWxvYWQgd2lsbCBiZSBndWFyYW50ZWVkIHRvIGludm9rZSB0aGUgc3RvcmVzJ1xuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MgaW4gb3JkZXI6IGBDb3VudHJ5U3RvcmVgLCBgQ2l0eVN0b3JlYCwgdGhlblxuICogYEZsaWdodFByaWNlU3RvcmVgLlxuICovXG5cbiAgZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWQgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdpdGggZXZlcnkgZGlzcGF0Y2hlZCBwYXlsb2FkLiBSZXR1cm5zXG4gICAqIGEgdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGB3YWl0Rm9yKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3Rlcj1mdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBpZCA9IF9wcmVmaXggKyBfbGFzdElEKys7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgYmFzZWQgb24gaXRzIHRva2VuLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnVucmVnaXN0ZXI9ZnVuY3Rpb24oaWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAnRGlzcGF0Y2hlci51bnJlZ2lzdGVyKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgaWRcbiAgICApO1xuICAgIGRlbGV0ZSB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF07XG4gIH07XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgY2FsbGJhY2tzIHNwZWNpZmllZCB0byBiZSBpbnZva2VkIGJlZm9yZSBjb250aW51aW5nIGV4ZWN1dGlvblxuICAgKiBvZiB0aGUgY3VycmVudCBjYWxsYmFjay4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSBhIGNhbGxiYWNrIGluXG4gICAqIHJlc3BvbnNlIHRvIGEgZGlzcGF0Y2hlZCBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5PHN0cmluZz59IGlkc1xuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUud2FpdEZvcj1mdW5jdGlvbihpZHMpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nXG4gICAgKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaWRzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIGlkID0gaWRzW2lpXTtcbiAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSxcbiAgICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgJyArXG4gICAgICAgICAgJ3dhaXRpbmcgZm9yIGAlc2AuJyxcbiAgICAgICAgICBpZFxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGludmFyaWFudChcbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgICBpZFxuICAgICAgKTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIHBheWxvYWQgdG8gYWxsIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2g9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGludmFyaWFudChcbiAgICAgICF0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2guZGlzcGF0Y2goLi4uKTogQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nXG4gICAgKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZCk7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmcoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoaXMgRGlzcGF0Y2hlciBjdXJyZW50bHkgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5pc0Rpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGwgdGhlIGNhbGxiYWNrIHN0b3JlZCB3aXRoIHRoZSBnaXZlbiBpZC4gQWxzbyBkbyBzb21lIGludGVybmFsXG4gICAqIGJvb2trZWVwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjaz1mdW5jdGlvbihpZCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IHRydWU7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdKHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQpO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB1cCBib29ra2VlcGluZyBuZWVkZWQgd2hlbiBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gZmFsc2U7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXIgYm9va2tlZXBpbmcgdXNlZCBmb3IgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGF0Y2hlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKGZhbHNlKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0IEZhY2Vib29rLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigna2V5TWlycm9yKC4uLik6IEFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICB9XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIga2V5cztcblx0dmFyIHRvID0gVG9PYmplY3QodGFyZ2V0KTtcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBhcmd1bWVudHNbc107XG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKE9iamVjdChmcm9tKSk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRvW2tleXNbaV1dID0gZnJvbVtrZXlzW2ldXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwidmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcclxudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMnKTtcclxuXHJcbnZhciBBcHBBY3Rpb25zID0ge1xyXG5cclxuXHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuQUREX0lURU0sXHJcblx0XHRcdGl0ZW06aXRlbVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0cHJldmlvdXNJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLlBSRVZfSU5WXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRuZXh0SW52ZW50b3J5OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5ORVhUX0lOVlxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0cHJldmlvdXNJdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLlBSRVZfSVRFTVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0bmV4dEl0ZW06ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuTkVYVF9JVEVNXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRjaGFuZ2VTZXR0aW5nOmZ1bmN0aW9uKGtleSx2YWwpIHtcclxuXHRcdEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG5cdFx0XHRhY3Rpb25UeXBlOkFwcENvbnN0YW50cy5DSEFOR0VfU0VUVElORyxcclxuXHRcdFx0a2V5OmtleSxcclxuXHRcdFx0dmFsOnZhbFxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0dG9nZ2xlU3RvcmU6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuXHRcdFx0YWN0aW9uVHlwZTpBcHBDb25zdGFudHMuVE9HR0xFX1NUT1JFXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHR0b2dnbGVPcHRpb25zOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLlRPR0dMRV9PUFRJT05TXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRpbmNyZW1lbnRTaGFyZHM6ZnVuY3Rpb24oa2V5LHZhbCkge1xyXG5cdFx0QXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcblx0XHRcdGFjdGlvblR5cGU6QXBwQ29uc3RhbnRzLklOQ1JFTUVOVF9TSEFSRFMsXHJcblx0XHRcdGtleTprZXksXHJcblx0XHRcdHZhbDp2YWxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEFjdGlvbnM7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBGb290ZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGZvb3Rlcj5cclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2Zvb3Rlci1sZWZ0Jz5cclxuXHRcdFx0XHRcdDxhIGhyZWY9Jy8vdXMuYmF0dGxlLm5ldC9kMy9lbi8nPkRpYWJsbyBJSUk8L2E+IMKpIFxyXG5cdFx0XHRcdFx0PGEgaHJlZj0nLy91cy5ibGl6emFyZC5jb20vZW4tdXMvJz5CbGl6emFyZCBFbnRlcnRhaW5tZW50LCBJbmMuPC9hPlxyXG5cdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2Zvb3Rlci1yaWdodCc+XHJcblx0XHRcdFx0ey8qR2l0aHViIC0gRnJvbSBGb3VuZGF0aW9uIEljb25zIGJ5IFp1cmIgTUlUIExpY2VuY2UqL31cclxuXHRcdFx0XHQ8YSBocmVmPScvL2dpdGh1Yi5jb20vYmVuc3RlcHAnPlxyXG5cdFx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxyXG5cdFx0XHRcdFx0XHQgd2lkdGg9XCIyNHB4XCIgaGVpZ2h0PVwiMjRweFwiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCAxMDAgMTAwXCI+XHJcblx0XHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdFx0PHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTQ5Ljk5OCwxMS45NjNDMjguNDYxLDExLjk2MywxMSwyOS40MjUsMTEsNTAuOTY1XHJcblx0XHRcdFx0XHRcdFx0YzAsMTcuMjMxLDExLjE3MiwzMS44NDksMjYuNjcxLDM3LjAwM2MxLjk1MiwwLjM2MSwyLjY2Mi0wLjg0LDIuNjYyLTEuODc3YzAtMC45MjQtMC4wMzQtMy4zNzUtMC4wNTEtNi42MzNcclxuXHRcdFx0XHRcdFx0XHRjLTEwLjg0OSwyLjM1OS0xMy4xMzgtNS4yMjktMTMuMTM4LTUuMjI5Yy0xLjc3NC00LjUwNS00LjMzMS01LjcwMy00LjMzMS01LjcwM2MtMy41NDEtMi40MTgsMC4yNjktMi4zNzEsMC4yNjktMi4zNzFcclxuXHRcdFx0XHRcdFx0XHRjMy45MTQsMC4yNzcsNS45NzQsNC4wMTgsNS45NzQsNC4wMThjMy40NzgsNS45Niw5LjEyOSw0LjIzNSwxMS4zNSwzLjI0M2MwLjM1My0yLjUyNSwxLjM2My00LjI0LDIuNDc2LTUuMjE3XHJcblx0XHRcdFx0XHRcdFx0Yy04LjY1OS0wLjk4NC0xNy43NjMtNC4zMy0xNy43NjMtMTkuMjc0YzAtNC4yNTksMS41MTktNy43NDEsNC4wMTMtMTAuNDY4Yy0wLjM5OS0wLjk4Mi0xLjc0LTQuOTQ3LDAuMzgzLTEwLjMxOVxyXG5cdFx0XHRcdFx0XHRcdGMwLDAsMy4yNzQtMS4wNDgsMTAuNzI2LDQuMDAxYzMuMTA5LTAuODY5LDYuNDQ2LTEuMzAzLDkuNzYzLTEuMzE2YzMuMzEyLDAuMDE0LDYuNjUsMC40NDcsOS43NjMsMS4zMTZcclxuXHRcdFx0XHRcdFx0XHRjNy40NDctNS4wNDksMTAuNzE2LTQuMDAxLDEwLjcxNi00LjAwMWMyLjEyOCw1LjM3MiwwLjc4OCw5LjMzNywwLjM4OCwxMC4zMTljMi41LDIuNzI3LDQuMDA4LDYuMjA5LDQuMDA4LDEwLjQ2OFxyXG5cdFx0XHRcdFx0XHRcdGMwLDE0Ljk3OS05LjExNywxOC4yNzktMTcuODA1LDE5LjI0MWMxLjM5OCwxLjIwNSwyLjY0NiwzLjU5LDIuNjQ2LDcuMjI5YzAsNS4yMTEtMC4wNDcsOS40MTYtMC4wNDcsMTAuNjk1XHJcblx0XHRcdFx0XHRcdFx0YzAsMS4wNDUsMC43MDEsMi4yNiwyLjY4MSwxLjg3M0M3Ny44MzYsODIuNzk4LDg5LDY4LjE5MSw4OSw1MC45NjVDODksMjkuNDI1LDcxLjUzOSwxMS45NjMsNDkuOTk4LDExLjk2M3pcIi8+XHJcblx0XHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0ey8qVHdpdHRlciAtIEZyb20gRm91bmRhdGlvbiBJY29ucyBieSBadXJiIE1JVCBMaWNlbmNlKi99XHJcblx0XHRcdFx0PGEgaHJlZj0nLy90d2l0dGVyLmNvbS9iZW5zdGVwcCc+XHJcblx0XHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiXHJcblx0XHRcdFx0XHRcdCB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDEwMCAxMDBcIj5cclxuXHRcdFx0XHRcdDxwYXRoIGQ9XCJNODguNSwyNi4xMmMtMi44MzMsMS4yNTYtNS44NzcsMi4xMDUtOS4wNzMsMi40ODZjMy4yNjEtMS45NTUsNS43NjctNS4wNTEsNi45NDUtOC43MzhcclxuXHRcdFx0XHRcdFx0Yy0zLjA1MiwxLjgxLTYuNDM0LDMuMTI2LTEwLjAzMSwzLjgzMmMtMi44ODEtMy4wNjgtNi45ODctNC45ODgtMTEuNTMxLTQuOTg4Yy04LjcyNCwwLTE1Ljc5OCw3LjA3Mi0xNS43OTgsMTUuNzk4XHJcblx0XHRcdFx0XHRcdGMwLDEuMjM3LDAuMTQsMi40NDQsMC40MSwzLjYwMWMtMTMuMTMtMC42NTktMjQuNzctNi45NDktMzIuNTYyLTE2LjUwOGMtMS4zNiwyLjMzNC0yLjEzOSw1LjA0OS0yLjEzOSw3Ljk0M1xyXG5cdFx0XHRcdFx0XHRjMCw1LjQ4MSwyLjc4OSwxMC4zMTUsNy4wMjgsMTMuMTQ5Yy0yLjU4OS0wLjA4My01LjAyNS0wLjc5NC03LjE1NS0xLjk3NmMtMC4wMDIsMC4wNjYtMC4wMDIsMC4xMzEtMC4wMDIsMC4xOTlcclxuXHRcdFx0XHRcdFx0YzAsNy42NTIsNS40NDUsMTQuMDM3LDEyLjY3MSwxNS40OWMtMS4zMjUsMC4zNTktMi43MiwwLjU1My00LjE2MSwwLjU1M2MtMS4wMTksMC0yLjAwOC0wLjA5OC0yLjk3My0wLjI4M1xyXG5cdFx0XHRcdFx0XHRjMi4wMSw2LjI3NSw3Ljg0NCwxMC44NDQsMTQuNzU3LDEwLjk3MmMtNS40MDcsNC4yMzYtMTIuMjE4LDYuNzYzLTE5LjYyLDYuNzYzYy0xLjI3NSwwLTIuNTMyLTAuMDc0LTMuNzY5LTAuMjIxXHJcblx0XHRcdFx0XHRcdGM2Ljk5MSw0LjQ4MiwxNS4yOTUsNy4wOTYsMjQuMjE2LDcuMDk2YzI5LjA1OCwwLDQ0Ljk0OC0yNC4wNzEsNDQuOTQ4LTQ0Ljk0NWMwLTAuNjg0LTAuMDE2LTEuMzY3LTAuMDQ2LTIuMDQ2XHJcblx0XHRcdFx0XHRcdEM4My43MDQsMzIuMDcxLDg2LjM4MywyOS4yODgsODguNSwyNi4xMnpcIi8+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0ey8qU3RlYW0gLSBGcm9tIEZvdW5kYXRpb24gSWNvbnMgYnkgWnVyYiBNSVQgTGljZW5jZSovfVxyXG5cdFx0XHRcdDxhIGhyZWY9Jy8vc3RlYW1jb21tdW5pdHkuY29tL2lkL2Zvb21hbic+XHJcblx0XHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiXHJcblx0XHRcdFx0XHRcdCB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDEwMCAxMDBcIj5cclxuXHRcdFx0XHRcdDxwYXRoIGlkPVwiR2VhcnNcIiBkPVwiTTkyLjQzLDQwLjkzNWMwLDMuODg5LTMuMTU1LDcuMDM5LTcuMDQxLDcuMDM5Yy0zLjg4NiwwLTcuMDM5LTMuMTUtNy4wMzktNy4wMzlcclxuXHRcdFx0XHRcdFx0YzAtMy44ODMsMy4xNTMtNy4wMzksNy4wMzktNy4wMzlDODkuMjc1LDMzLjg5NSw5Mi40MywzNy4wNTIsOTIuNDMsNDAuOTM1eiBNODUuMzU0LDI3LjgzMWMtNy4yMTgsMC0xMy4wOCw1LjgyMi0xMy4xNDUsMTMuMDI1XHJcblx0XHRcdFx0XHRcdGwtOC4xOSwxMS43MzZjLTAuMzMzLTAuMDM1LTAuNjcyLTAuMDU1LTEuMDE2LTAuMDU1Yy0xLjgyOSwwLTMuNTM5LDAuNTA0LTUuMDA4LDEuMzgxTDIwLjkwMSwzOS4wMDFcclxuXHRcdFx0XHRcdFx0Yy0wLjk3LTQuNC00LjkwMy03LjcxOS05LjU4Ni03LjcxOWMtNS40MDYsMC05LjgxNSw0LjQyNC05LjgxNSw5LjgyOGMwLDUuNDEsNC40MDksOS44MTYsOS44MTUsOS44MTZcclxuXHRcdFx0XHRcdFx0YzEuODMsMCwzLjU0MS0wLjUwNCw1LjAwOS0xLjM3OWwzNy4wOTQsMTQuODg5YzAuOTU5LDQuNDEyLDQuODkzLDcuNzMzLDkuNTg0LDcuNzMzYzUuMDgzLDAsOS4yNzUtMy44OTYsOS43NjItOC44NThsMTIuNTg5LTkuMjAxXHJcblx0XHRcdFx0XHRcdGM3LjI1OCwwLDEzLjE0Ni01Ljg3NywxMy4xNDYtMTMuMTM1UzkyLjYxMiwyNy44MzEsODUuMzU0LDI3LjgzMXogTTg1LjM1NCwzMi4xNjNjNC44NjMsMCw4LjgxMywzLjk1MSw4LjgxMyw4LjgxMlxyXG5cdFx0XHRcdFx0XHRjMCw0Ljg2My0zLjk1MSw4LjgwMS04LjgxMyw4LjgwMWMtNC44NjEsMC04LjgxMy0zLjkzOC04LjgxMy04LjgwMUM3Ni41NDEsMzYuMTE0LDgwLjQ5MywzMi4xNjMsODUuMzU0LDMyLjE2M3ogTTExLjMxNSwzMy44ODJcclxuXHRcdFx0XHRcdFx0YzIuNzczLDAsNS4xNjYsMS41NDksNi4zNzcsMy44MzJsLTMuNTg4LTEuNDM2djAuMDE2Yy0yLjg5MS0xLjA0MS02LjEwMiwwLjM3NS03LjI1NiwzLjI0OGMtMS4xNTYsMi44NzMsMC4xNzQsNi4xMjcsMi45NzgsNy4zNzlcclxuXHRcdFx0XHRcdFx0djAuMDE0bDMuMDQ2LDEuMjE1Yy0wLjUwMSwwLjExMS0xLjAyMywwLjE3OC0xLjU1NywwLjE3OGMtMy45OTksMC03LjIxNS0zLjIxNy03LjIxNS03LjIxN0M0LjEsMzcuMTEyLDcuMzE1LDMzLjg4MiwxMS4zMTUsMzMuODgyelxyXG5cdFx0XHRcdFx0XHQgTTYzLjAwMiw1NS4xMzZjNC4wMDEsMCw3LjIxNiwzLjIxNyw3LjIxNiw3LjIxN2MwLDMuOTk4LTMuMjE1LDcuMjE1LTcuMjE2LDcuMjE1Yy0yLjc4MSwwLTUuMTg0LTEuNTUxLTYuMzg5LTMuODQ0XHJcblx0XHRcdFx0XHRcdGMxLjE4NywwLjQ4LDIuMzc1LDAuOTUzLDMuNTYsMS40MzZjMi45NDEsMS4xODIsNi4yOTItMC4yNDIsNy40NzMtMy4xODJjMS4xODMtMi45NDEtMC4yNTQtNi4yNzUtMy4xOTYtNy40NTlsLTMuMDA0LTEuMjA1XHJcblx0XHRcdFx0XHRcdEM2MS45NDcsNTUuMjA2LDYyLjQ2OSw1NS4xMzYsNjMuMDAyLDU1LjEzNnpcIi8+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHQ8L2Zvb3Rlcj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9vdGVyOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucy5qcycpO1xyXG52YXIgQXBwU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvQXBwU3RvcmUuanMnKTtcclxuXHJcbnZhciBOYXZiYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIEFwcFN0b3JlLmdldFNldHRpbmdzKCk7XHJcblx0fSxcclxuXHRidXlJdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGl0ZW0gPSBkM3NpbS5rYWRhbGFSb2xsKHRoaXMuc3RhdGUuaXRlbS50eXBlKTtcclxuXHRcdGl0ZW0uc2l6ZSA9IHRoaXMuc3RhdGUuaXRlbS5zaXplO1xyXG5cdFx0QXBwQWN0aW9ucy5hZGRJdGVtKGl0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5pbmNyZW1lbnRTaGFyZHModGhpcy5zdGF0ZS5pdGVtLnR5cGUsdGhpcy5zdGF0ZS5pdGVtLmNvc3QpO1xyXG5cdH0sXHJcblxyXG5cdHRvZ2dsZU9wdGlvbnM6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBBY3Rpb25zLnRvZ2dsZU9wdGlvbnMoKTtcclxuXHR9LFxyXG5cdHRvZ2dsZVN0b3JlOmZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwQWN0aW9ucy50b2dnbGVTdG9yZSgpO1xyXG5cdH0sXHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdF9vbkNoYW5nZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuKFxyXG5cdFx0XHQ8bmF2PlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdoYW0nIG9uQ2xpY2s9e3RoaXMudG9nZ2xlT3B0aW9uc30+XHJcblx0XHRcdFx0XHR7LypGcm9tIE1hdGVyaWFsIERlc2lnbiBpY29ucyBieSBHb29nbGUgKENDIGJ5IDQuMCkqL31cclxuXHRcdFx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuXHRcdFx0XHRcdFx0PHBhdGggZD1cIk0zIDE4aDE4di0ySDN2MnptMC01aDE4di0ySDN2MnptMC03djJoMThWNkgzelwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdDxoMT48YSBocmVmPScva2FkYWxhLyc+S2FkYWxhIFNpbXVsYXRvcjwvYT48L2gxPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdidXknIG9uQ2xpY2s9e3RoaXMuYnV5SXRlbX0+e3RoaXMuc3RhdGUuaXRlbS50ZXh0fTwvYnV0dG9uPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPSdzaG9wJyBvbkNsaWNrPXt0aGlzLnRvZ2dsZVN0b3JlfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTE2IDZWNGMwLTEuMTEtLjg5LTItMi0yaC00Yy0xLjExIDAtMiAuODktMiAydjJIMnYxM2MwIDEuMTEuODkgMiAyIDJoMTZjMS4xMSAwIDItLjg5IDItMlY2aC02em0tNi0yaDR2MmgtNFY0ek05IDE4VjlsNy41IDRMOSAxOHpcIi8+XHJcblx0XHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9uYXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmJhcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBBcm1vciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tYXJtb3Itd2VhcG9uIGl0ZW0tYXJtb3ItYXJtb3JcIj5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiYmlnXCI+PHA+PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy5hcm1vcn08L3NwYW4+PC9wPjwvbGk+XHJcblx0XHRcdFx0PGxpPkFybW9yPC9saT5cclxuXHRcdFx0PC91bD5cclxuXHJcblx0XHQpO1xyXG5cclxuXHR9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEFybW9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0RDNJdGVtVG9vbHRpcEFybW9yID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWFybW9yLmpzeCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBXZWFwb24gPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtd2VhcG9uLmpzeCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBTdGF0ID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLXN0YXQuanN4Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEJvZHkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGljb25DbGFzc2VzID0gJ2QzLWljb24gZDMtaWNvbi1pdGVtIGQzLWljb24taXRlbS1sYXJnZSc7XHJcblx0XHR2YXIgaXRlbVR5cGVDbGFzcyA9J2QzLWNvbG9yLSc7IFxyXG5cclxuXHRcdC8vZGVjbGFyZSBhcnJheXMgZm9yIHByaW1hcnkgYW5kIHNlY29uZGFyeSBpdGVtIGVmZmVjdHMuIFxyXG5cdFx0Ly9BbiBpdGVtIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgb2YgZWFjaC5cclxuXHRcdC8vQ3JlYXRlIHRoZSBsaXN0IGl0ZW0gZm9yIGVhY2ggc3RhdCBhbmQgcHVzaCBpbiB0aGUgYXJyYXlzXHJcblx0XHR2YXIgcHJpbWFyaWVzID0gZm9yRWFjaCh0aGlzLnByb3BzLml0ZW0ucHJpbWFyaWVzKTtcclxuXHRcdHZhciBzZWNvbmRhcmllcyA9IGZvckVhY2godGhpcy5wcm9wcy5pdGVtLnNlY29uZGFyaWVzKTtcclxuXHJcblx0XHQvL2ltYWdlIHVzZWQgYXMgaW5saW5lLXN0eWxlIGZvciBpdGVtIHRvb2x0aXBzXHJcblx0XHR2YXIgaW1hZ2UgPSB7YmFja2dyb3VuZEltYWdlOid1cmwoJyt0aGlzLnByb3BzLml0ZW0uaW1hZ2UrJyknfTtcclxuXHJcblx0XHQvL2lmIHNwZWNpZmllZCwgc2V0IGNvbG9yIGZvciB0b29sdGlwIGNvbXBvbmVudHNcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0uY29sb3IpIHtcclxuXHRcdFx0aWNvbkNsYXNzZXMgKz0gJyBkMy1pY29uLWl0ZW0tJyt0aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHRcdGl0ZW1UeXBlQ2xhc3MgKz10aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9pZiBpdCBpcyBhbiBhcm1vciBvciB3ZWFwb24gYWRkIGFkZGl0aW9uYWwgaW5mbyB0byBpY29uIHNlY3Rpb25cclxuXHRcdHZhciBzdWJIZWFkO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnYXJtb3InKSkge1xyXG5cdFx0XHRzdWJIZWFkID0gPEQzSXRlbVRvb2x0aXBBcm1vciBhcm1vcj17dGhpcy5wcm9wcy5pdGVtLmFybW9yfS8+O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnd2VhcG9uJykpIHtcclxuXHRcdFx0c3ViSGVhZCA9IDxEM0l0ZW1Ub29sdGlwV2VhcG9uIHdlYXBvbj17dGhpcy5wcm9wcy5pdGVtLndlYXBvbn0vPjtcclxuXHRcdH1cclxuXHJcblx0XHQvL2lmIHNvY2tldHMgYXJlIG5lZWRlZFxyXG5cdFx0dmFyIHNvY2tldHMgPSBbXTtcclxuXHRcdHZhciBzb2NrZXRLZXkgPSAwO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5wcmltYXJpZXMuaGFzT3duUHJvcGVydHkoJ1NvY2tldCcpKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPTA7IGkgPCB0aGlzLnByb3BzLml0ZW0ucHJpbWFyaWVzLlNvY2tldC52YWx1ZTsgaSsrKSB7XHJcblx0XHRcdFx0c29ja2V0cy5wdXNoKDxsaSBjbGFzc05hbWU9J2VtcHR5LXNvY2tldCBkMy1jb2xvci1ibHVlJyBrZXk9e3NvY2tldEtleX0gPkVtcHR5IFNvY2tldDwvbGk+KTtcclxuXHRcdFx0XHRzb2NrZXRLZXkrKztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vZGV0ZXJtaW5lIHRoZSB3b3JkIHRvIHB1dCBuZXh0IHRvIGl0ZW0gdHlwZVxyXG5cdFx0dmFyIGl0ZW1UeXBlUHJlZml4O1xyXG5cdFx0Ly9jaGVjayBpZiBhbmNpZW50IHNldCBpdGVtIGFuZCBtYW51YWxseSBwdXRcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0ucmFyaXR5ID09PSAnYW5jaWVudCcgJiYgdGhpcy5wcm9wcy5pdGVtLmhhc093blByb3BlcnR5KCdzZXQnKSkge1xyXG5cdFx0XHRpdGVtVHlwZVByZWZpeCA9ICdBbmNpZW50IFNldCc7XHJcblx0XHR9XHJcblx0XHQvL290aGVyd2lzZSBpdCBpcyBzZXQvYSByYXJpdHkgb25seVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGl0ZW1UeXBlUHJlZml4ID0gKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykpID8gJ3NldCcgOiB0aGlzLnByb3BzLml0ZW0ucmFyaXR5O1xyXG5cdFx0XHQvL2NhcGl0YWxpemUgZmlyc3QgbGV0dGVyXHJcblx0XHRcdGl0ZW1UeXBlUHJlZml4ID0gaXRlbVR5cGVQcmVmaXguY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpdGVtVHlwZVByZWZpeC5zbGljZSgxKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRvb2x0aXAtYm9keSBlZmZlY3QtYmcgZWZmZWN0LWJnLWFybW9yIGVmZmVjdC1iZy1hcm1vci1kZWZhdWx0XCI+XHJcblxyXG5cdFx0XHRcdHsvKlRoZSBpdGVtIGljb24gYW5kIGNvbnRhaW5lciwgY29sb3IgbmVlZGVkIGZvciBiYWNrZ3JvdW5kKi99XHJcblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPXtpY29uQ2xhc3Nlc30+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJpY29uLWl0ZW0tZ3JhZGllbnRcIj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1pdGVtLWlubmVyIGljb24taXRlbS1kZWZhdWx0XCIgc3R5bGU9e2ltYWdlfT5cclxuXHRcdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdDwvc3Bhbj5cclxuXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJkMy1pdGVtLXByb3BlcnRpZXNcIj5cclxuXHJcblx0XHRcdFx0XHR7LypTbG90IGFuZCBpZiBjbGFzcyBzcGVjaWZpYyovfVxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tdHlwZS1yaWdodFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJpdGVtLXNsb3RcIj57dGhpcy5wcm9wcy5pdGVtLnNsb3QuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnByb3BzLml0ZW0uc2xvdC5zbGljZSgxKX08L2xpPlxyXG5cdFx0XHRcdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJpdGVtLWNsYXNzLXNwZWNpZmljIGQzLWNvbG9yLXdoaXRlXCI+e3RoaXMucHJvcHMuaXRlbS5jbGFzc1NwZWNpZmljfTwvbGk+XHJcblx0XHRcdFx0XHQ8L3VsPlxyXG5cclxuXHRcdFx0XHRcdHsvKlJhcml0eSBvZiB0aGUgaXRlbSBhbmQvaWYgaXQgaXMgYW5jaWVudCovfVxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tdHlwZVwiPlxyXG5cdFx0XHRcdFx0XHQ8bGk+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPXtpdGVtVHlwZUNsYXNzfT57aXRlbVR5cGVQcmVmaXh9IHt0aGlzLnByb3BzLml0ZW0udHlwZX08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHQ8L3VsPlxyXG5cclxuXHRcdFx0XHRcdHsvKklmIHRoZSBpdGVtIGlzIGFybW9yIG9yIHdlYXBvbiwgdGhlIGtleSBpcyBkZWZpbmVkIGFuZCB3ZSBuZWVkIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIHRvb2x0aXAqL31cclxuXHRcdFx0XHRcdHtzdWJIZWFkfVxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1iZWZvcmUtZWZmZWN0c1wiPjwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdHsvKkFjdHVhbCBpdGVtIHN0YXRzKi99XHJcblx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1lZmZlY3RzXCI+XHJcblx0XHRcdFx0XHRcdDxwIGNsYXNzTmFtZT1cIml0ZW0tcHJvcGVydHktY2F0ZWdvcnlcIj5QcmltYXJ5PC9wPlxyXG5cdFx0XHRcdFx0XHR7cHJpbWFyaWVzfVxyXG5cdFx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJpdGVtLXByb3BlcnR5LWNhdGVnb3J5XCI+U2Vjb25kYXJ5PC9wPlxyXG5cdFx0XHRcdFx0XHR7c2Vjb25kYXJpZXN9XHJcblx0XHRcdFx0XHRcdHtzb2NrZXRzfVxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHJcblx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdGZ1bmN0aW9uIGZvckVhY2goc3RhdE9iamVjdCkge1xyXG5cdFx0dmFyIHJlc3VsdHMgPSBbXTtcclxuXHJcblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHN0YXRPYmplY3QpO1xyXG5cdFx0dmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICsrKSB7XHJcblx0XHRcdHZhciBzdGF0ID0ga2V5c1tpXTtcclxuXHRcdFx0dmFyIHZhbCA9IHN0YXRPYmplY3Rbc3RhdF07XHJcblx0XHRcdHJlc3VsdHMucHVzaCg8RDNJdGVtVG9vbHRpcFN0YXQgc3RhdD17dmFsfSBrZXk9e2l9IC8+KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHRzO1xyXG5cdH1cclxuXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEJvZHk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwRmxhdm9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSd0b29sdGlwLWV4dGVuc2lvbic+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2ZsYXZvcic+e3RoaXMucHJvcHMuZmxhdm9yfTwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEZsYXZvcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBIZWFkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly9pbml0aWFsIGNsYXNzIHNldCBmb3IgdGhlIHRvb2x0aXAgaGVhZFxyXG5cdFx0dmFyIGRpdkNsYXNzPSd0b29sdGlwLWhlYWQnO1xyXG5cdFx0dmFyIGgzQ2xhc3M9Jyc7XHJcblxyXG5cdFx0Ly9tb2RpZnkgdGhlIGNsYXNzZXMgaWYgYSBjb2xvciB3YXMgcGFzc2VkXHJcblx0XHQvL2ZhbGxiYWNrIGNvbG9yIGlzIGhhbmRsZWQgYnkgZDMtdG9vbHRpcCBjc3NcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0uY29sb3IpIHtcclxuXHRcdFx0ZGl2Q2xhc3MgKz0gJyB0b29sdGlwLWhlYWQtJyArIHRoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdFx0aDNDbGFzcyArPSAnZDMtY29sb3ItJyArIHRoaXMucHJvcHMuaXRlbS5jb2xvcjtcclxuXHRcdH1cclxuXHRcdC8vbWFrZSB0aGUgZm9udCBzbWFsbGVyIGlmIHRoZSBuYW1lIGlzIGxvbmdcclxuXHRcdGlmICh0aGlzLnByb3BzLml0ZW0ubmFtZS5sZW5ndGggPiA0MCkge1xyXG5cdFx0XHRoM0NsYXNzKz0gJyBzbWFsbGVzdCc7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKHRoaXMucHJvcHMuaXRlbS5uYW1lLmxlbmd0aCA+MjIpIHtcclxuXHRcdFx0aDNDbGFzcys9ICcgc21hbGxlcic7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2RpdkNsYXNzfT5cclxuXHRcdFx0XHQ8aDMgY2xhc3NOYW1lPXtoM0NsYXNzfT5cclxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLml0ZW0ubmFtZX1cclxuXHRcdFx0XHQ8L2gzPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBIZWFkOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcFN0YXQ9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgdGV4dCA9IFtdO1xyXG5cdFx0dmFyIHRleHRLZXkgPSAwO1xyXG5cdFx0Ly9jaGVjayB0byBtYWtlIHN1cmUgdGVtcGxhdGUgbmVlZHMgdG8gYmUgd29ya2VkIHdpdGggXHJcblx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMuc3RhdC50ZXh0ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR2YXIgdGVtcGxhdGUgPSB0aGlzLnByb3BzLnN0YXQudGV4dDtcclxuXHRcdFx0aWYgKHRlbXBsYXRlLmluZGV4T2YoJ3snKSAhPT0gLTEpIHtcclxuXHJcblx0XHRcdFx0Ly9kZXRlcm1pbmUgdGhlIG51bWJlciBvZiBoaWdobGlnaHRlZCBpdGVtcyB0aGUgdG9vbHRpcCB3aWxsIGhhdmVcclxuXHRcdFx0XHR2YXIgcG9zaXRpb24gPSB0ZW1wbGF0ZS5pbmRleE9mKCd7Jyk7XHJcblx0XHRcdFx0dmFyIGNvdW50ID0gMDtcclxuXHRcdFx0XHR3aGlsZSAocG9zaXRpb24gIT09IC0xKSB7XHJcblx0XHRcdFx0XHRjb3VudCsrXHJcblx0XHRcdFx0XHRwb3NpdGlvbiA9IHRlbXBsYXRlLmluZGV4T2YoJ3snLCBwb3NpdGlvbisxKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBzdGFydFBvcyA9IDA7XHJcblx0XHRcdFx0dmFyIGVuZFBvcyA9IDA7XHJcblx0XHRcdFx0Ly9sb29wIHRocm91Z2ggdGhpcyBjb3VudCBvZiB0ZW1wbGF0aW5nXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9MDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHRcdFx0XHRcdHZhciBzdGFydEluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZigneycsc3RhcnRQb3MpKzE7XHJcblx0XHRcdFx0XHRzdGFydFBvcyA9IHN0YXJ0SW5kZXg7XHJcblx0XHRcdFx0XHR2YXIgZW5kSW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKCd9JyxlbmRQb3MpO1xyXG5cdFx0XHRcdFx0ZW5kUG9zID0gZW5kSW5kZXgrMTtcclxuXHRcdFx0XHRcdHZhciBzbGljZWQgPSB0ZW1wbGF0ZS5zbGljZShzdGFydEluZGV4LGVuZEluZGV4KTtcclxuXHJcblx0XHRcdFx0XHQvL2NoZWNrIGZvciBhbnkgcmVwbGFjZW1lbnQgbmVlZGVkXHJcblx0XHRcdFx0XHRpZiAoc2xpY2VkLmluZGV4T2YoJyQnKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5zdGF0LnZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdHNsaWNlZCA9IHNsaWNlZC5yZXBsYWNlKCckJywgdGhpcy5wcm9wcy5zdGF0LnZhbHVlW2ldKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRzbGljZWQgPSBzbGljZWQucmVwbGFjZSgnJCcsdGhpcy5wcm9wcy5zdGF0LnZhbHVlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vaWYgd2UgYXJlIGF0IHRoZSBmaXJzdCBsb29wLCBhZGQgYW55dGhpbmcgZmlyc3QgYXMgdGV4dFxyXG5cdFx0XHRcdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0dGV4dC5wdXNoKHRlbXBsYXRlLnNwbGl0KCd7JylbMF0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vY3JlYXRlIGFuZCBwdXNoIHRoZSB2YWx1ZSBoaWdobGlnaHRlZCBlbGVtZW50XHJcblx0XHRcdFx0XHR2YXIgZWxlbWVudCA9IDxzcGFuIGNsYXNzTmFtZT0ndmFsdWUnIGtleT17dGV4dEtleX0+e3NsaWNlZH08L3NwYW4+O1xyXG5cdFx0XHRcdFx0dGV4dEtleSsrO1xyXG5cdFx0XHRcdFx0dGV4dC5wdXNoKGVsZW1lbnQpO1xyXG5cclxuXHRcdFx0XHRcdC8vaWYgbm90IHRoZSBsYXN0IGxvb3AsIHB1c2ggYW55dGhpbmcgdW50aWwgbmV4dCBicmFja2V0XHJcblx0XHRcdFx0XHRpZiAoY291bnQgIT09IDEgJiYgaSA8IGNvdW50IC0gMSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgbmV4dEluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZigneycsIHN0YXJ0UG9zKTtcclxuXHRcdFx0XHRcdFx0dmFyIHNsaWNlZCA9IHRlbXBsYXRlLnNsaWNlKGVuZEluZGV4KzEsIG5leHRJbmRleCk7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaChzbGljZWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZihjb3VudCA9PT0gMSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgc2xpY2VkID0gdGVtcGxhdGUuc2xpY2UoZW5kSW5kZXgrMSwgdGVtcGxhdGUubGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0dGV4dC5wdXNoKHNsaWNlZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2xhc3QgbG9vcCBwdXNoIHRvIHRoZSBlbmRcclxuXHRcdFx0XHRcdGVsc2UgaWYoaSA9PT0gY291bnQtMSAmJiBjb3VudCA+IDEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHNsaWNlZCA9IHRlbXBsYXRlLnNsaWNlKGVuZEluZGV4KzEsIHRlbXBsYXRlLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdHRleHQucHVzaChzbGljZWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvL25vIHRlbXBsYXRlIGFuZCB3ZSBqdXN0IHRocm93IGFmZml4IHVwXHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRleHQucHVzaCh0aGlzLnByb3BzLnN0YXQudGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvL2RldGVybWluZSBjb2xvciBvZiBhZmZpeCB0ZXh0XHJcblx0XHR2YXIgdGV4dENvbG9yID0gJ2QzLWl0ZW0tcHJvcGVydHktZGVmYXVsdCc7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5zdGF0Lmhhc093blByb3BlcnR5KCd0eXBlJykgJiYgdGhpcy5wcm9wcy5zdGF0LnR5cGUgPT09ICdsZWdlbmRhcnknKSB7XHJcblx0XHRcdHRleHRDb2xvciArPSAnIGQzLWNvbG9yLW9yYW5nZSc7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGV4dENvbG9yICs9ICcgZDMtY29sb3ItYmx1ZSc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHJcblx0XHRcdDxsaSBjbGFzc05hbWU9e3RleHRDb2xvcn0+XHJcblx0XHRcdFx0PHA+e3RleHR9PC9wPlxyXG5cdFx0XHQ8L2xpPlxyXG5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwU3RhdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBXZWFwb249IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2PlxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS13ZWFwb24tZHBzXCI+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cImJpZ1wiPjxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLmRwc308L3NwYW4+PC9saT5cclxuXHRcdFx0XHQ8bGk+RGFtYWdlIFBlciBTZWNvbmQ8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS13ZWFwb24gZGFtYWdlXCI+XHJcblx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0PHA+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLm1pbn08L3NwYW4+IC1cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj4ge3RoaXMucHJvcHMud2VhcG9uLm1heH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImQzLWNvbG9yLUZGODg4ODg4XCI+IERhbWFnZTwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvcD5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdDxsaT5cclxuXHRcdFx0XHRcdDxwPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLndlYXBvbi5zcGVlZH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImQzLWNvbG9yLUZGODg4ODg4XCI+IEF0dGFja3MgcGVyIFNlY29uZDwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvcD5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwV2VhcG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEhlYWQgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtaGVhZC5qc3gnKTtcclxudmFyIEQzSXRlbVRvb2x0aXBCb2R5ID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWJvZHkuanN4Jyk7XHJcbnZhciBEM0l0ZW1Ub29sdGlwRmxhdm9yID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWZsYXZvci5qc3gnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9vbHRpcENsYXNzID0nZDMtdG9vbHRpcCBkMy10b29sdGlwLWl0ZW0nO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5yYXJpdHkgPT09ICdhbmNpZW50Jykge1xyXG5cdFx0XHR0b29sdGlwQ2xhc3MrPScgYW5jaWVudCdcclxuXHRcdH1cclxuXHJcblx0XHQvL2RldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0byBhZGQgZmxhdm9yXHJcblx0XHR2YXIgZmxhdm9yO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnZmxhdm9yJykpIHtcclxuXHRcdFx0Zmxhdm9yID0gPEQzSXRlbVRvb2x0aXBGbGF2b3IgZmxhdm9yPXt0aGlzLnByb3BzLml0ZW0uZmxhdm9yfSAvPlxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J3Rvb2x0aXAtY29udGVudCc+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e3Rvb2x0aXBDbGFzc30+XHJcblx0XHRcdFx0XHQ8RDNJdGVtVG9vbHRpcEhlYWQgaXRlbT17dGhpcy5wcm9wcy5pdGVtfSAvPlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXBCb2R5IGl0ZW09e3RoaXMucHJvcHMuaXRlbX0gLz5cclxuXHRcdFx0XHRcdHtmbGF2b3J9XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEludmVudG9yeVN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0ludmVudG9yeVN0b3JlJyk7XHJcblxyXG52YXIgSXRlbUxlZnQgPSByZXF1aXJlKCcuL2l0ZW0tbGVmdC5qc3gnKTtcclxudmFyIEl0ZW1SaWdodCA9IHJlcXVpcmUoJy4vaXRlbS1yaWdodC5qc3gnKTtcclxudmFyIEQzSXRlbVRvb2x0aXAgPSByZXF1aXJlKCcuLi9kMy10b29sdGlwL2QzLXRvb2x0aXAuanN4Jyk7XHJcblxyXG52YXIgSW5kaXZpZHVhbEl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBJbnZlbnRvcnlTdG9yZS5nZXRJdGVtKCk7XHJcblx0fSxcclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SW52ZW50b3J5U3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SW52ZW50b3J5U3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShJbnZlbnRvcnlTdG9yZS5nZXRJdGVtKCkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvL29ubHkgc2hvdyB0b29sdGlwcy9idXR0b25zIGlmIHRoZXkgYXJlIG5lZWRlZFxyXG5cdFx0dmFyIHRvb2x0aXA7XHJcblx0XHR2YXIgaGlkZGVuQnV0dG9ucyA9ICdoaWRkZW4nO1xyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnN0YXRlLml0ZW0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHRvb2x0aXAgPSA8ZGl2IGNsYXNzTmFtZT0ndG9vbHRpcC1jb250YWluZXInPjxEM0l0ZW1Ub29sdGlwIGl0ZW09e3RoaXMuc3RhdGUuaXRlbX0vPjwvZGl2PjtcclxuXHRcdFx0aGlkZGVuQnV0dG9ucyA9ICcnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3Jvdyc+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY29sLXhzLTEyIHRvb2x0aXAtb3ZlcmZsb3cnPlxyXG5cdFx0XHRcdFx0XHQ8SXRlbUxlZnQgaGlkZUNsYXNzPXtoaWRkZW5CdXR0b25zfSBoYXNQcmV2aW91cz17dGhpcy5zdGF0ZS5oYXNQcmV2aW91c30gLz5cclxuXHRcdFx0XHRcdFx0e3Rvb2x0aXB9XHJcblx0XHRcdFx0XHRcdDxJdGVtUmlnaHQgaGlkZUNsYXNzPXtoaWRkZW5CdXR0b25zfSBoYXNOZXh0PXt0aGlzLnN0YXRlLmhhc05leHR9IC8+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEluZGl2aWR1YWxJdGVtOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgSXRlbUxlZnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMucHJldmlvdXNJdGVtKCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBidXR0b25DbGFzcyA9ICdpbnZlbnRvcnktYnV0dG9uIHNoaWZ0IGxlZnQnO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc1ByZXZpb3VzKSB7XHJcblx0XHRcdGJ1dHRvbkNsYXNzKz0gJyBkaXNhYmxlZCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e3RoaXMucHJvcHMuaGlkZUNsYXNzfT5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuX2hhbmRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIzNlwiIGhlaWdodD1cIjM2XCIgdmlld0JveD1cIjAgMCAzNiAzNlwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTIzLjEyIDExLjEyTDIxIDlsLTkgOSA5IDkgMi4xMi0yLjEyTDE2LjI0IDE4elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSXRlbUxlZnQ7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnKTtcclxuXHJcbnZhciBJdGVtUmlnaHQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMubmV4dEl0ZW0oKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24gc2hpZnQgcmlnaHQnO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc05leHQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5oaWRlQ2xhc3N9PlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMTUgOWwtMi4xMiAyLjEyTDE5Ljc2IDE4bC02Ljg4IDYuODhMMTUgMjdsOS05elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSXRlbVJpZ2h0OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5U2xvdCA9IHJlcXVpcmUoJy4vaW52ZW50b3J5LXNsb3QuanN4Jyk7XHJcbnZhciBQcmV2aW91c0ludmVudG9yeSA9IHJlcXVpcmUoJy4vcHJldmlvdXMtaW52ZW50b3J5LmpzeCcpO1xyXG52YXIgTmV4dEludmVudG9yeSA9IHJlcXVpcmUoJy4vbmV4dC1pbnZlbnRvcnkuanN4Jyk7XHJcblxyXG5cclxudmFyIEludmVudG9yeUNvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGludmVudG9yeVNsb3RzID0gW107XHJcblx0XHR2YXIga2V5PTA7XHJcblxyXG5cdFx0Ly9sb29wIHRocm91Z2ggdGhlIDEwIGNvbHVtbnMgb2YgaW52ZW50b3J5XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuXHRcdFx0dmFyIGNvbHVtbkxlbmd0aCA9IHRoaXMucHJvcHMuaW52ZW50b3J5W2ldLmxlbmd0aDtcclxuXHJcblx0XHRcdC8vYSBjaGVjayBmb3IgdGhlIHRvdGFsIGhlaWdodCBvZiB0aGlzIGNvbHVtblxyXG5cdFx0XHR2YXIgaGVpZ2h0Q291bnQgPSAwO1xyXG5cclxuXHRcdFx0Ly9hZGQgYWxsIGV4aXN0aW5nIGl0ZW1zIHRvIHRoZSBjb2x1bW5zXHJcblx0XHRcdGZvciAodmFyIGo9MDsgaiA8IGNvbHVtbkxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMuaW52ZW50b3J5W2ldW2pdICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0aGVpZ2h0Q291bnQgKz0gdGhpcy5wcm9wcy5pbnZlbnRvcnlbaV1bal0uc2l6ZTtcclxuXHRcdFx0XHRcdGludmVudG9yeVNsb3RzLnB1c2goPEludmVudG9yeVNsb3QgZGF0YT17dGhpcy5wcm9wcy5pbnZlbnRvcnlbaV1bal19IGtleT17a2V5fSBjb2x1bW49e2l9Lz4pXHJcblx0XHRcdFx0XHRrZXkrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vbm93IGZpbGwgaW4gdGhlIHJlc3Qgb2YgdGhlIGNvbHVtbiB3aXRoIGJsYW5rIHNwYWNlc1xyXG5cdFx0XHR3aGlsZShoZWlnaHRDb3VudCA8IDYpIHtcclxuXHRcdFx0XHRoZWlnaHRDb3VudCsrO1xyXG5cdFx0XHRcdGludmVudG9yeVNsb3RzLnB1c2goPEludmVudG9yeVNsb3QgZGF0YT17dW5kZWZpbmVkfSBrZXk9e2tleX0gY29sdW1uPXtpfS8+KTtcclxuXHRcdFx0XHRrZXkrKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWNvbnRhaW5lcic+XHJcblx0XHRcdFx0PFByZXZpb3VzSW52ZW50b3J5IGhhc1ByZXZpb3VzPXt0aGlzLnByb3BzLmhhc1ByZXZpb3VzfS8+XHJcblx0XHRcdFx0e2ludmVudG9yeVNsb3RzfVxyXG5cdFx0XHRcdDxOZXh0SW52ZW50b3J5IGhhc05leHQ9e3RoaXMucHJvcHMuaGFzTmV4dH0vPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5Q29udGFpbmVyIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwID0gcmVxdWlyZSgnLi4vZDMtdG9vbHRpcC9kMy10b29sdGlwLmpzeCcpO1xyXG5cclxudmFyIEludmVudG9yeVNsb3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Y29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFRvb2x0aXBPZmZzZXQoKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZFVwZGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0VG9vbHRpcE9mZnNldCgpO1xyXG5cdH0sXHJcblxyXG5cdHNldFRvb2x0aXBPZmZzZXQ6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZWxlbSA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpO1xyXG5cclxuXHRcdC8vaWYgdGhlIGludmVudG9yeSBzbG90IGhhcyBjaGlsZHJlbiAoY29udGVudClcclxuXHRcdGlmIChlbGVtLmNoaWxkcmVuICYmIGVsZW0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHR2YXIgZWxlbUxvY2F0aW9uID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcblx0XHRcdHZhciB0b29sdGlwSGVpZ2h0ID0gZWxlbS5jaGlsZHJlbls0XS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcblx0XHRcdHZhciB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG5cdFx0XHQvL2NoZWNrIGlmIHRoZSB0b29sdGlwIGZpdHMgd2hlcmUgaXQgY3VycmVudGx5IGlzXHJcblx0XHRcdGlmICghKHRvb2x0aXBIZWlnaHQgKyBlbGVtTG9jYXRpb24gPCB3aW5kb3dIZWlnaHQpKSB7XHJcblx0XHRcdFx0dmFyIG9mZnNldCA9ICh0b29sdGlwSGVpZ2h0ICsgZWxlbUxvY2F0aW9uIC0gd2luZG93SGVpZ2h0KTtcclxuXHJcblx0XHRcdFx0Ly9pZiB0aGUgdG9vbHRpcCBpcyBiaWdnZXIgdGhhbiB3aW5kb3csIGp1c3Qgc2hvdyBhdCB0b3Agb2Ygd2luZG93XHJcblx0XHRcdFx0aWYgKG9mZnNldCA+IHdpbmRvd0hlaWdodCkge1xyXG5cdFx0XHRcdFx0ZWxlbS5jaGlsZHJlbls0XS5zdHlsZS50b3AgPSAnLScrKGVsZW1Mb2NhdGlvbi0yMCkrJ3B4JztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHQvL2p1c3QgbW92ZSBpdCB1cCBhIGxpdHRsZSB3aXRoIGEgYml0IGF0IGJvdHRvbVxyXG5cdFx0XHRcdFx0ZWxlbS5jaGlsZHJlbls0XS5zdHlsZS50b3AgPSAnLScrKG9mZnNldCsxMCkrJ3B4JztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBzbG90Q29udGVudD0gW107XHJcblx0XHR2YXIgc2xvdENvbnRlbnRLZXkgPSAwO1xyXG5cclxuXHRcdHZhciBzbG90Q2xhc3M9J2ludmVudG9yeS1zbG90JztcclxuXHRcdC8vY2hlY2sgdG8gbWFrZSBzdXJlIGFuIGFjdHVhbCBpdGVtIGlzIGluIHRoZSBpbnZlbnRvcnkgc2xvdFxyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLmRhdGEgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdC8vY2hhbmdlIHRoZSBzaXplIHRvIGxhcmdlIGlmIGl0IGlzIGEgbGFyZ2UgaXRlbVxyXG5cdFx0XHRpZih0aGlzLnByb3BzLmRhdGEuaGFzT3duUHJvcGVydHkoJ3NpemUnKSAmJiB0aGlzLnByb3BzLmRhdGEuc2l6ZSA9PT0gMikge1xyXG5cdFx0XHRcdHNsb3RDbGFzcyArPSAnIGxhcmdlJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdyYXJpdHknKSkge1xyXG5cdFx0XHRcdHZhciBiZ3VybDtcclxuXHRcdFx0XHR2YXIgYm9yZGVyQ29sb3I9JyMzMDJhMjEnO1xyXG5cclxuXHRcdFx0XHRzd2l0Y2godGhpcy5wcm9wcy5kYXRhLnJhcml0eSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAnbWFnaWMnOlxyXG5cdFx0XHRcdFx0XHRiZ3VybD0nLy91cy5iYXR0bGUubmV0L2QzL3N0YXRpYy9pbWFnZXMvaXRlbS9pY29uLWJncy9ibHVlLnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjNzk3OWQ0JztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdyYXJlJzpcclxuXHRcdFx0XHRcdFx0Ymd1cmw9Jy8vdXMuYmF0dGxlLm5ldC9kMy9zdGF0aWMvaW1hZ2VzL2l0ZW0vaWNvbi1iZ3MveWVsbG93LnBuZyc7XHJcblx0XHRcdFx0XHRcdGJvcmRlckNvbG9yPScjZjhjYzM1JztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdsZWdlbmRhcnknOlxyXG5cdFx0XHRcdFx0XHRiZ3VybD0nLy91cy5iYXR0bGUubmV0L2QzL3N0YXRpYy9pbWFnZXMvaXRlbS9pY29uLWJncy9vcmFuZ2UucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyNiZjY0MmYnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2FuY2llbnQnOlxyXG5cdFx0XHRcdFx0XHRiZ3VybD0nLy91cy5iYXR0bGUubmV0L2QzL3N0YXRpYy9pbWFnZXMvaXRlbS9pY29uLWJncy9vcmFuZ2UucG5nJztcclxuXHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I9JyNiZjY0MmYnO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdC8vbm9vcFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9zd2l0Y2ggYmcgdG8gZ3JlZW4gaWYgaXRlbSBpcyBwYXJ0IG9mIGEgc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnc2V0JykpIHtcclxuXHRcdFx0XHRcdGJndXJsPScvL3VzLmJhdHRsZS5uZXQvZDMvc3RhdGljL2ltYWdlcy9pdGVtL2ljb24tYmdzL2dyZWVuLnBuZyc7XHJcblx0XHRcdFx0XHRib3JkZXJDb2xvcj0nIzhiZDQ0Mic7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIGJndXJsICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0dmFyIGlubGluZSA9IHtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOid1cmwoJytiZ3VybCsnKSdcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRzbG90Q29udGVudC5wdXNoKDxkaXYgc3R5bGU9e2lubGluZX0gY2xhc3NOYW1lPSdpbnZlbnRvcnktYmcnIGtleT17c2xvdENvbnRlbnRLZXl9PjwvZGl2PilcclxuXHRcdFx0XHRcdHNsb3RDb250ZW50S2V5Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3NldCB0aGUgaXRlbSBpbWFnZVxyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdpbWFnZScpKSB7XHJcblx0XHRcdFx0dmFyIGlubGluZSA9IHtiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK3RoaXMucHJvcHMuZGF0YS5pbWFnZSsnKSd9O1xyXG5cdFx0XHRcdHNsb3RDb250ZW50LnB1c2goPGRpdiBzdHlsZT17aW5saW5lfSBjbGFzc05hbWU9J2ludmVudG9yeS1pbWFnZScga2V5PXtzbG90Q29udGVudEtleX0+PC9kaXY+KTtcclxuXHRcdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL2FkZCBhIGxpbmsgdG8gYWN0aXZhdGUgdG9vbHRpcFxyXG5cdFx0XHRzbG90Q29udGVudC5wdXNoKDxhIGNsYXNzTmFtZT0ndG9vbHRpcC1saW5rJyBrZXk9e3Nsb3RDb250ZW50S2V5fT48L2E+KTtcclxuXHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHJcblx0XHRcdC8vYWRkIGEgZ3JhZGllbnQgbWFza1xyXG5cdFx0XHRzbG90Q29udGVudC5wdXNoKDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktaXRlbS1ncmFkaWVudCcga2V5PXtzbG90Q29udGVudEtleX0+PC9kaXY+KTtcclxuXHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHJcblx0XHRcdC8vYWRkIGEgaGlkZGVuIHRvb2x0aXBcclxuXHRcdFx0dmFyIGlubGluZTtcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuY29sdW1uIDwgNSkge1xyXG5cdFx0XHRcdGlubGluZSA9IHtsZWZ0Oic1MHB4J307XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aW5saW5lID0ge3JpZ2h0Oic1MHB4J307XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNsb3RDb250ZW50LnB1c2goXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3Rvb2x0aXAtY29udGFpbmVyJyBzdHlsZT17aW5saW5lfSBrZXk9e3Nsb3RDb250ZW50S2V5fT5cclxuXHRcdFx0XHRcdDxEM0l0ZW1Ub29sdGlwIGl0ZW09e3RoaXMucHJvcHMuZGF0YX0vPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQpO1xyXG5cdFx0XHRzbG90Q29udGVudEtleSsrO1xyXG5cclxuXHRcdFx0Ly9hZGQgc29ja2V0cyBvbiBob3ZlclxyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5kYXRhLmhhc093blByb3BlcnR5KCdwcmltYXJpZXMnKSAmJiB0aGlzLnByb3BzLmRhdGEucHJpbWFyaWVzLmhhc093blByb3BlcnR5KCdTb2NrZXQnKSkge1xyXG5cdFx0XHRcdHZhciBzb2NrZXRzO1xyXG5cdFx0XHRcdHZhciBzb2NrZXRDb3VudCA9IHRoaXMucHJvcHMuZGF0YS5wcmltYXJpZXMuU29ja2V0LnZhbHVlO1xyXG5cdFx0XHRcdHZhciBzb2NrZXRDb250ZW50cyA9IFtdO1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPTA7IGkgPCBzb2NrZXRDb3VudDsgaSsrKSB7XHJcblx0XHRcdFx0XHRzb2NrZXRDb250ZW50cy5wdXNoKDxkaXYgY2xhc3NOYW1lPSdzb2NrZXQnIGtleT17aX0+PC9kaXY+KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c29ja2V0cyA9IDxkaXYgY2xhc3NOYW1lPSdzb2NrZXRzLXdyYXBwZXInIGtleT17c2xvdENvbnRlbnRLZXl9PjxkaXYgY2xhc3NOYW1lPSdzb2NrZXRzLWFsaWduJz57c29ja2V0Q29udGVudHN9PC9kaXY+PC9kaXY+O1xyXG5cdFx0XHRcdHNsb3RDb250ZW50LnB1c2goc29ja2V0cyk7XHJcblx0XHRcdFx0c2xvdENvbnRlbnRLZXkrKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17c2xvdENsYXNzfSBzdHlsZT17e2JvcmRlckNvbG9yOmJvcmRlckNvbG9yfX0+XHJcblx0XHRcdFx0e3Nsb3RDb250ZW50fVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5U2xvdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEludmVudG9yeUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vaW52ZW50b3J5LWNvbnRhaW5lci5qc3gnKTtcclxudmFyIEludmVudG9yeVN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0ludmVudG9yeVN0b3JlJyk7XHJcblxyXG52YXIgSW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gSW52ZW50b3J5U3RvcmUuZ2V0SW52ZW50b3J5KCk7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRJbnZlbnRvcnlTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShJbnZlbnRvcnlTdG9yZS5nZXRJbnZlbnRvcnkoKSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1zZWN0aW9uJz5cclxuXHRcdFx0XHQ8SW52ZW50b3J5Q29udGFpbmVyIFxyXG5cdFx0XHRcdFx0aW52ZW50b3J5PXt0aGlzLnN0YXRlLmN1cnJlbnRJbnZlbnRvcnl9IFxyXG5cdFx0XHRcdFx0aGFzUHJldmlvdXM9e3R5cGVvZiB0aGlzLnN0YXRlLnByZXZpb3VzSW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJ30gXHJcblx0XHRcdFx0XHRoYXNOZXh0PXt0eXBlb2YgdGhpcy5zdGF0ZS5uZXh0SW52ZW50b3J5ICE9PSAndW5kZWZpbmVkJ31cclxuXHRcdFx0XHQvPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW52ZW50b3J5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBBcHBBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJyk7XHJcblxyXG52YXIgTmV4dEludmVudG9yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRfaGFuZGxlQ2xpY2s6ZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBBY3Rpb25zLm5leHRJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24nO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc05leHQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIGRpc2FibGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LWJ1dHRvbi1jb250YWluZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDM2IDM2XCI+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNMTUgOWwtMi4xMiAyLjEyTDE5Ljc2IDE4bC02Ljg4IDYuODhMMTUgMjdsOS05elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV4dEludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG5cclxudmFyIFByZXZpb3VzSW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdF9oYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdEFwcEFjdGlvbnMucHJldmlvdXNJbnZlbnRvcnkoKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2ludmVudG9yeS1idXR0b24nO1xyXG5cdFx0aWYgKCF0aGlzLnByb3BzLmhhc1ByZXZpb3VzKSB7XHJcblx0XHRcdGJ1dHRvbkNsYXNzKz0gJyBkaXNhYmxlZCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1idXR0b24tY29udGFpbmVyJz5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuX2hhbmRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdHsvKkZyb20gTWF0ZXJpYWwgRGVzaWduIGljb25zIGJ5IEdvb2dsZSAoQ0MgYnkgNC4wKSovfVxyXG5cdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIzNlwiIGhlaWdodD1cIjM2XCIgdmlld0JveD1cIjAgMCAzNiAzNlwiPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTTIzLjEyIDExLjEyTDIxIDlsLTkgOSA5IDkgMi4xMi0yLjEyTDE2LjI0IDE4elwiLz5cclxuXHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJldmlvdXNJbnZlbnRvcnk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHQvL3N0YXRlIGlzIGhhbmRsZWQgaW4gdGhlIHBhcmVudCBjb21wb25lbnRcclxuXHQvL3RoaXMgZnVuY3Rpb24gaXMgdXAgdGhlcmVcclxuXHRoYW5kbGVDbGljazpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlQ2xhc3ModGhpcy5wcm9wcy5uYW1lKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNob3J0ZW5lZE5hbWVzID0ge1xyXG5cdFx0XHRCYXJiYXJpYW46J2JhcmInLFxyXG5cdFx0XHRDcnVzYWRlcjonY3J1cycsXHJcblx0XHRcdCdEZW1vbiBIdW50ZXInOidkaCcsXHJcblx0XHRcdE1vbms6J21vbmsnLFxyXG5cdFx0XHQnV2l0Y2ggRG9jdG9yJzond2QnLFxyXG5cdFx0XHRXaXphcmQ6J3dpeidcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnY2xhc3Mtc2VsZWN0b3InO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJ1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbWFnZUNsYXNzPSB0aGlzLnByb3BzLm5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcgJywnJyk7XHJcblx0XHRpbWFnZUNsYXNzKz0gdGhpcy5wcm9wcy5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8bGk+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtpbWFnZUNsYXNzfT48L2Rpdj5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLm5hbWUudG9Mb3dlckNhc2UoKX08L3NwYW4+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJzaG9ydGVuZWRcIj57c2hvcnRlbmVkTmFtZXNbdGhpcy5wcm9wcy5uYW1lXX08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvbGk+XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yQnV0dG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBDbGFzc1NlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9jbGFzcy1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRDbGFzc2VzID0gWydCYXJiYXJpYW4nLCdDcnVzYWRlcicsJ0RlbW9uIEh1bnRlcicsJ01vbmsnLCdXaXRjaCBEb2N0b3InLCdXaXphcmQnXTtcclxuXHRcdHZhciBkQ2xhc3Nlc0xlbmd0aCA9IGRDbGFzc2VzLmxlbmd0aDtcclxuXHJcblx0XHR2YXIgY2xhc3NTZWxlY3RvcnMgPSBbXTtcclxuXHRcdGZvciAodmFyIGkgPTA7IGkgPCBkQ2xhc3Nlc0xlbmd0aDtpKyspIHtcclxuXHJcblx0XHRcdC8vY2hlY2sgZm9yIHNlbGVjdGVkIGNsYXNzIHN0b3JlZCBpbiBzdGF0ZSBvZiB0aGlzIGNvbXBvbmVudFxyXG5cdFx0XHR2YXIgc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09IGRDbGFzc2VzW2ldKSB7XHJcblx0XHRcdFx0c2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3B1dCBzZWxlY3RvcnMgaW4gYXJyYXkgdG8gYmUgcmVuZGVyZWRcclxuXHRcdFx0Y2xhc3NTZWxlY3RvcnMucHVzaChcclxuXHRcdFx0XHQ8Q2xhc3NTZWxlY3RvckJ1dHRvbiBcclxuXHRcdFx0XHRcdG5hbWU9e2RDbGFzc2VzW2ldfSBcclxuXHRcdFx0XHRcdGNoYW5nZUNsYXNzPXt0aGlzLnByb3BzLmNoYW5nZUNsYXNzfSBcclxuXHRcdFx0XHRcdGtleT17aX0gXHJcblx0XHRcdFx0XHRzZWxlY3RlZD17c2VsZWN0ZWR9XHJcblx0XHRcdFx0XHRnZW5kZXI9e3RoaXMucHJvcHMuZ2VuZGVyfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8dWwgY2xhc3NOYW1lPSdjbGFzcy1zZWxlY3Rvcic+XHJcblx0XHRcdFx0XHR7Y2xhc3NTZWxlY3RvcnN9XHJcblx0XHRcdFx0PC91bD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHVwZGF0ZUdlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlR2VuZGVyKHRoaXMucHJvcHMuZ2VuZGVyKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzPSdnZW5kZXItc2VsZWN0b3IgJyt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYnV0dG9uLXdyYXBwZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy51cGRhdGVHZW5kZXJ9ID5cclxuXHRcdFx0XHRcdDxkaXY+PC9kaXY+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5nZW5kZXIudG9Mb3dlckNhc2UoKX08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5kZXJTZWxlY3RvckJ1dHRvbjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9nZW5kZXItc2VsZWN0b3ItYnV0dG9uLmpzeCcpO1xyXG5cclxudmFyIEdlbmRlclNlbGVjdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbWFsZVNlbGVjdGVkID0gKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09ICdNYWxlJyk7XHJcblx0XHR2YXIgZmVtYWxlU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gJ0ZlbWFsZScpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdnZW5kZXItc2VsZWN0b3InPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvckJ1dHRvbiBnZW5kZXI9J01hbGUnIGNoYW5nZUdlbmRlcj17dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXttYWxlU2VsZWN0ZWR9IC8+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yQnV0dG9uIGdlbmRlcj0nRmVtYWxlJyBjaGFuZ2VHZW5kZXI9e3RoaXMucHJvcHMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17ZmVtYWxlU2VsZWN0ZWR9IC8+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5kZXJTZWxlY3RvcjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEhhcmRjb3JlQ2hlY2tib3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0dXBkYXRlSGFyZGNvcmU6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlSGFyZGNvcmUoIXRoaXMucHJvcHMuaGFyZGNvcmUpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjaGVja2JveC13cmFwcGVyJz5cclxuXHRcdFx0XHQ8bGFiZWw+XHJcblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGNsYXNzTmFtZT0nb3B0aW9ucy1jaGVja2JveCcgY2hlY2tlZD17dGhpcy5wcm9wcy5oYXJkY29yZX0gb25DaGFuZ2U9e3RoaXMudXBkYXRlSGFyZGNvcmV9Lz5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nY2hlY2tib3gtbGFiZWwnPkhhcmRjb3JlIDxzcGFuIGNsYXNzTmFtZT0naGlkZGVuLXNtJz5IZXJvPC9zcGFuPjwvc3Bhbj5cclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFyZGNvcmVDaGVja2JveDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgZDNzaW0gPSByZXF1aXJlKCdkM3NpbScpO1xyXG5cclxudmFyIEFwcEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMuanMnKTtcclxudmFyIEFwcFN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RvcmVzL0FwcFN0b3JlLmpzJyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IHJlcXVpcmUoJy4vY2xhc3Mtc2VsZWN0b3IuanN4Jyk7XHJcbnZhciBHZW5kZXJTZWxlY3RvciA9IHJlcXVpcmUoJy4vZ2VuZGVyLXNlbGVjdG9yLmpzeCcpO1xyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IHJlcXVpcmUoJy4vc2Vhc29uYWwtY2hlY2tib3guanN4Jyk7XHJcbnZhciBIYXJkY29yZUNoZWNrYm94ID0gcmVxdWlyZSgnLi9oYXJkY29yZS1jaGVja2JveC5qc3gnKTtcclxuXHJcbnZhciBPcHRpb25zUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpbml0aWFsID0gQXBwU3RvcmUuZ2V0U2V0dGluZ3MoKTtcclxuXHRcdGQzc2ltLnNldEthZGFsYShpbml0aWFsLmRDbGFzcyxpbml0aWFsLnNlYXNvbmFsLGluaXRpYWwuaGFyZGNvcmUpO1xyXG5cdFx0cmV0dXJuIGluaXRpYWw7XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRBcHBTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XHJcblx0fSxcclxuXHRfb25DaGFuZ2U6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0b3JlLmdldFNldHRpbmdzKCkpO1xyXG5cdH0sXHJcblxyXG5cdGNoYW5nZUdlbmRlcjpmdW5jdGlvbihnZW5kZXIpIHtcclxuXHRcdEFwcEFjdGlvbnMuY2hhbmdlU2V0dGluZygnZ2VuZGVyJyxnZW5kZXIpO1xyXG5cdH0sXHJcblx0Y2hhbmdlQ2xhc3M6ZnVuY3Rpb24oZENsYXNzKSB7XHJcblx0XHRBcHBBY3Rpb25zLmNoYW5nZVNldHRpbmcoJ2RDbGFzcycsZENsYXNzKTtcclxuXHR9LFxyXG5cdGNoYW5nZUhhcmRjb3JlOmZ1bmN0aW9uKGJvb2wpIHtcclxuXHRcdEFwcEFjdGlvbnMuY2hhbmdlU2V0dGluZygnaGFyZGNvcmUnLGJvb2wpO1xyXG5cdH0sXHJcblx0Y2hhbmdlU2Vhc29uYWw6ZnVuY3Rpb24oYm9vbCkge1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdzZWFzb25hbCcsYm9vbCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBvcHRzQ2xhc3MgPSAnb3B0aW9ucy1wYW5lbCc7XHJcblx0XHRpZiAodGhpcy5zdGF0ZS5vcHRpb25zKSB7XHJcblx0XHRcdG9wdHNDbGFzcyArPSAnIHVuaGlkZSc7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8c2VjdGlvbiBjbGFzc05hbWU9e29wdHNDbGFzc30+XHJcblx0XHRcdFx0PENsYXNzU2VsZWN0b3IgY2hhbmdlQ2xhc3M9e3RoaXMuY2hhbmdlQ2xhc3N9IHNlbGVjdGVkPXt0aGlzLnN0YXRlLmRDbGFzc30gZ2VuZGVyPXt0aGlzLnN0YXRlLmdlbmRlcn0vPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvciBjaGFuZ2VHZW5kZXI9e3RoaXMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5nZW5kZXJ9Lz5cclxuXHRcdFx0XHQ8U2Vhc29uYWxDaGVja2JveCBzZWFzb25hbD17dGhpcy5zdGF0ZS5zZWFzb25hbH0gY2hhbmdlU2Vhc29uYWw9e3RoaXMuY2hhbmdlU2Vhc29uYWx9Lz5cclxuXHRcdFx0XHQ8SGFyZGNvcmVDaGVja2JveCBoYXJkY29yZT17dGhpcy5zdGF0ZS5oYXJkY29yZX0gY2hhbmdlSGFyZGNvcmU9e3RoaXMuY2hhbmdlSGFyZGNvcmV9Lz5cclxuXHRcdFx0PC9zZWN0aW9uPlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb25zUGFuZWw7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBTZWFzb25hbENoZWNrYm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHVwZGF0ZVNlYXNvbmFsOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VTZWFzb25hbCghdGhpcy5wcm9wcy5zZWFzb25hbCk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2NoZWNrYm94LXdyYXBwZXInPlxyXG5cdFx0XHRcdDxsYWJlbD5cclxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPSdjaGVja2JveCcgY2xhc3NOYW1lPSdvcHRpb25zLWNoZWNrYm94JyBjaGVja2VkPXt0aGlzLnByb3BzLnNlYXNvbmFsfSBvbkNoYW5nZT17dGhpcy51cGRhdGVTZWFzb25hbH0vPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdjaGVja2JveC1sYWJlbCc+U2Vhc29uYWwgPHNwYW4gY2xhc3NOYW1lPSdoaWRkZW4tc20nPkhlcm88L3NwYW4+PC9zcGFuPlxyXG5cdFx0XHRcdDwvbGFiZWw+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZWFzb25hbENoZWNrYm94OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQXBwQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvQXBwQWN0aW9ucycpO1xyXG52YXIgQXBwU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvQXBwU3RvcmUnKTtcclxuXHJcbnZhciBLYWRhbGFJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtb2JpbGU6QXBwU3RvcmUuZ2V0U2V0dGluZ3MoKS5tb2JpbGUsXHJcblx0XHRcdHNoYXJkQ291bnQ6QXBwU3RvcmUuZ2V0U2hhcmRzKHRoaXMucHJvcHMuaXRlbS50eXBlKVxyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdEFwcFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcclxuXHR9LFxyXG5cdF9vbkNoYW5nZTpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRzaGFyZENvdW50OkFwcFN0b3JlLmdldFNoYXJkcyh0aGlzLnByb3BzLml0ZW0udHlwZSlcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0YnV5SXRlbTpmdW5jdGlvbigpIHtcclxuXHRcdC8vaW5jcmVtZW50IHRoZSBibG9vZCBzaGFyZCBjb3VudFxyXG5cdFx0dmFyIGN1cnJlbnRDb3VudCA9IHRoaXMuc3RhdGUuc2hhcmRDb3VudDtcclxuXHRcdGN1cnJlbnRDb3VudCArPSB0aGlzLnByb3BzLml0ZW0uY29zdDtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe3NoYXJkQ291bnQ6Y3VycmVudENvdW50fSk7XHJcblxyXG5cdFx0dmFyIGl0ZW0gPSBkM3NpbS5rYWRhbGFSb2xsKHRoaXMucHJvcHMuaXRlbS50eXBlKTtcclxuXHRcdGl0ZW0uc2l6ZSA9IHRoaXMucHJvcHMuaXRlbS5zaXplO1xyXG5cdFx0QXBwQWN0aW9ucy5hZGRJdGVtKGl0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5jaGFuZ2VTZXR0aW5nKCdpdGVtJyx0aGlzLnByb3BzLml0ZW0pO1xyXG5cdFx0QXBwQWN0aW9ucy5pbmNyZW1lbnRTaGFyZHModGhpcy5wcm9wcy5pdGVtLnR5cGUsdGhpcy5wcm9wcy5pdGVtLmNvc3QpO1xyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLm1vYmlsZSkge1xyXG5cdFx0XHRBcHBBY3Rpb25zLnRvZ2dsZVN0b3JlKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZXNldENvdW50OmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2hhcmRDb3VudDowfSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBpY29uQ2xhc3MgPSAna2FkYWxhLWljb24nO1xyXG5cdFx0aWNvbkNsYXNzKz0nICcrdGhpcy5wcm9wcy5pdGVtLnR5cGU7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2thZGFsYS1pdGVtJz5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT0na2FkYWxhJyBvbkNsaWNrPXt0aGlzLmJ1eUl0ZW19PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2ljb25DbGFzc30+PC9kaXY+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5pdGVtLmNvc3R9PC9zcGFuPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdrYWRhbGEtY29udGVudCc+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2thZGFsYS1pdGVtLXRpdGxlJyBvbkNsaWNrPXt0aGlzLmJ1eUl0ZW19Pnt0aGlzLnByb3BzLml0ZW0udGV4dH08L3NwYW4+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3NoYXJkLWNvdW50Jz5cclxuXHRcdFx0XHRcdFx0e3RoaXMuc3RhdGUuc2hhcmRDb3VudH1cclxuXHRcdFx0XHRcdFx0PGEgY2xhc3NOYW1lPSdzaGFyZC1kZWxldGUnIG9uQ2xpY2s9e3RoaXMucmVzZXRDb3VudH0+XHJcblx0XHRcdFx0XHRcdFx0ey8qRnJvbSBNYXRlcmlhbCBEZXNpZ24gaWNvbnMgYnkgR29vZ2xlIChDQyBieSA0LjApKi99XHJcblx0XHRcdFx0XHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD1cIk02IDE5YzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMlY3SDZ2MTJ6TTE5IDRoLTMuNWwtMS0xaC01bC0xIDFINXYyaDE0VjR6XCIvPlxyXG5cdFx0XHRcdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLYWRhbGFJdGVtOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgS2FkYWxhSXRlbSA9IHJlcXVpcmUoJy4va2FkYWxhLWl0ZW0uanN4Jyk7XHJcbnZhciBBcHBTdG9yZSA9IHJlcXVpcmUoJy4uLy4uL3N0b3Jlcy9BcHBTdG9yZScpO1xyXG5cclxudmFyIEthZGFsYVN0b3JlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBBcHBTdG9yZS5nZXRTZXR0aW5ncygpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0QXBwU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xyXG5cdH0sXHJcblx0X29uQ2hhbmdlOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShBcHBTdG9yZS5nZXRTZXR0aW5ncygpKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGthZGFsYUNsYXNzID0gJ2thZGFsYS1zdG9yZSc7XHJcblx0XHQvL3RoaXMgaXMgYSBjaGVjayBmb3IgaW50ZXJuZXQgZXhwbG9yZXJcclxuXHRcdC8vZmxleC1kaXJlY3Rpb246Y29sdW1uIGJyZWFrcyBldmVyeXRoaW5nIHNvIHdlIGRldGVjdCBmb3IgaXQgaGVyZVxyXG5cdFx0aWYgKCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFICcpICE9PSAtMSl8fCFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9UcmlkZW50LipydlxcOjExXFwuLykpIHtcclxuXHRcdFx0a2FkYWxhQ2xhc3MrPScgbm9pZSc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUuc3RvcmUpIHtcclxuXHRcdFx0a2FkYWxhQ2xhc3MrPScgdW5oaWRlJztcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaXRlbXMgPSBbXHJcblx0XHRcdHt0eXBlOidoZWxtJyx0ZXh0OidNeXN0ZXJ5IEhlbG1ldCcsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonYm9vdHMnLHRleHQ6J015c3RlcnkgQm9vdHMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2JlbHQnLHRleHQ6J015c3RlcnkgQmVsdCcsY29zdDoyNSxzaXplOjF9LFxyXG5cdFx0XHR7dHlwZToncGFudHMnLHRleHQ6J015c3RlcnkgUGFudHMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2dsb3ZlcycsdGV4dDonTXlzdGVyeSBHbG92ZXMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J2NoZXN0Jyx0ZXh0OidNeXN0ZXJ5IENoZXN0Jyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidzaG91bGRlcnMnLHRleHQ6J015c3RlcnkgU2hvdWxkZXJzJyxjb3N0OjI1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOidicmFjZXJzJyx0ZXh0OidNeXN0ZXJ5IEJyYWNlcnMnLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3F1aXZlcicsdGV4dDonTXlzdGVyeSBRdWl2ZXInLGNvc3Q6MjUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J21vam8nLHRleHQ6J015c3RlcnkgTW9qbycsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonc291cmNlJyx0ZXh0OidNeXN0ZXJ5IFNvdXJjZScsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonc2hpZWxkJyx0ZXh0OidNeXN0ZXJ5IFNoaWVsZCcsY29zdDoyNSxzaXplOjJ9LFxyXG5cdFx0XHR7dHlwZTonb25laGFuZCcsdGV4dDonMS1IIE15c3RlcnkgV2VhcG9uJyxjb3N0Ojc1LHNpemU6Mn0sXHJcblx0XHRcdHt0eXBlOid0d29oYW5kJyx0ZXh0OicyLUggTXlzdGVyeSBXZWFwb24nLGNvc3Q6NzUsc2l6ZToyfSxcclxuXHRcdFx0e3R5cGU6J3JpbmcnLHRleHQ6J015c3RlcnkgUmluZycsY29zdDo1MCxzaXplOjF9LFxyXG5cdFx0XHR7dHlwZTonYW11bGV0Jyx0ZXh0OidNeXN0ZXJ5IEFtdWxldCcsY29zdDoxMDAsc2l6ZToxfVxyXG5cdFx0XVxyXG5cclxuXHRcdHZhciBrYWRhbGFTbG90cyA9IFtdO1xyXG5cdFx0dmFyIGl0ZW1zTGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xyXG5cdFx0Zm9yICh2YXIgaSA9MDsgaSA8IGl0ZW1zTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0a2FkYWxhU2xvdHMucHVzaCg8S2FkYWxhSXRlbSBrZXk9e2l9IGl0ZW09e2l0ZW1zW2ldfS8+KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17a2FkYWxhQ2xhc3N9IGlkPSdrYWRhbGEtc3RvcmUnPlxyXG5cdFx0XHRcdHtrYWRhbGFTbG90c31cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEthZGFsYVN0b3JlOyIsInZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcclxuXHRBRERfSVRFTTpudWxsLFxyXG5cclxuXHRQUkVWX0lOVjpudWxsLFxyXG5cdE5FWFRfSU5WOm51bGwsXHJcblxyXG5cdFBSRVZfSVRFTTpudWxsLFxyXG5cdE5FWFRfSVRFTTpudWxsLFxyXG5cclxuXHRDSEFOR0VfU0VUVElORzpudWxsLFxyXG5cdElOQ1JFTUVOVF9TSEFSRFM6bnVsbCxcclxuXHJcblx0VE9HR0xFX09QVElPTlM6bnVsbCxcclxuXHRUT0dHTEVfU1RPUkU6bnVsbFxyXG59KTsiLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpOyIsInZhciBkM3NpbSA9IHJlcXVpcmUoJ2Qzc2ltJyk7XHJcblxyXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xyXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xyXG52YXIgQXBwQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0FwcENvbnN0YW50cycpO1xyXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xyXG5cclxudmFyIENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xyXG5cclxudmFyIGFwcFNldHRpbmdzID0ge307XHJcbnZhciBkZWZhdWx0cyA9IHtcclxuXHRkQ2xhc3M6J0JhcmJhcmlhbicsXHJcblx0Z2VuZGVyOidGZW1hbGUnLFxyXG5cdGhhcmRjb3JlOmZhbHNlLFxyXG5cdHNlYXNvbmFsOnRydWUsXHJcblx0aXRlbTp7XCJ0eXBlXCI6XCJoZWxtXCIsXCJ0ZXh0XCI6XCJNeXN0ZXJ5IEhlbG1ldFwiLFwiY29zdFwiOjI1LFwic2l6ZVwiOjJ9XHJcbn07XHJcbnZhciBzaGFyZHNTcGVudCA9IHt9O1xyXG52YXIgbGlmZXRpbWUgPSB7fTtcclxuXHJcbnZhciBzdG9yYWdlU3VwcG9ydGVkO1xyXG5cclxuLy9EZXRlcm1pbmUgd2hldGhlciBvciBub3QgbG9jYWwgc3RvcmFnZSBpcyBzdXBwb3J0ZWRcclxuLy9mcm9tIGdpdGh1Yi5jb20vYWdydWJsZXYvYW5ndWxhckxvY2FsU3RvcmFnZVxyXG4vL01JVCBMaWNlbmNlXHJcbmZ1bmN0aW9uIGxvY2FsU3RvcmFnZUNoZWNrKCkge1xyXG5cdHZhciBzdG9yYWdlID0gKHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykgPyB1bmRlZmluZWQgOiB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG5cdHN1cHBvcnRlZCA9ICh0eXBlb2Ygc3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcpO1xyXG5cdGlmIChzdXBwb3J0ZWQpIHtcclxuXHRcdHZhciB0ZXN0S2V5ID0gJ19fJyArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlNyk7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0ZXN0S2V5LCB0ZXN0S2V5KTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGVzdEtleSk7XHJcblx0XHR9XHJcblx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdHN1cHBvcnRlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRzdG9yYWdlU3VwcG9ydGVkID0gc3VwcG9ydGVkO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVTdG9yZSgpIHtcclxuXHRhcHBTZXR0aW5ncy5zdG9yZSA9ICFhcHBTZXR0aW5ncy5zdG9yZTtcclxuXHRhcHBTZXR0aW5ncy5vcHRpb25zID0gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gdG9nZ2xlT3B0aW9ucygpIHtcclxuXHRhcHBTZXR0aW5ncy5vcHRpb25zID0gIWFwcFNldHRpbmdzLm9wdGlvbnM7XHJcblx0YXBwU2V0dGluZ3Muc3RvcmUgPSBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2V0dGluZ3MoKSB7XHJcblx0cmV0dXJuIGFwcFNldHRpbmdzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTaGFyZHMoa2V5KSB7XHJcblx0cmV0dXJuIHNoYXJkc1NwZW50W2tleV0gfHwgMDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hhbmdlU2V0dGluZyhrZXksdmFsKSB7XHJcblx0YXBwU2V0dGluZ3Nba2V5XSA9IHZhbDtcclxuXHRkM3NpbS5zZXRLYWRhbGEoYXBwU2V0dGluZ3MuZENsYXNzLGFwcFNldHRpbmdzLnNlYXNvbmFsLGFwcFNldHRpbmdzLmhhcmRjb3JlKTtcclxuXHRzYXZlU2V0dGluZ3MoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZVNldHRpbmdzKCkge1xyXG5cdGlmIChzdG9yYWdlU3VwcG9ydGVkKSB7XHJcblx0XHRsb2NhbFN0b3JhZ2Uua2FkYWxhU2V0dGluZ3MgPSBKU09OLnN0cmluZ2lmeShhcHBTZXR0aW5ncyk7XHJcblx0XHRsb2NhbFN0b3JhZ2Uua2FkYWxhU3BlbnQgPSBKU09OLnN0cmluZ2lmeShzaGFyZHNTcGVudCk7XHJcblx0XHRsb2NhbFN0b3JhZ2Uua2FkYWxhTGlmZXRpbWUgPSBKU09OLnN0cmluZ2lmeShsaWZldGltZSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbmNyZW1lbnRTaGFyZHMoa2V5LHZhbCkge1xyXG5cdGlmICh0eXBlb2Ygc2hhcmRzU3BlbnRba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHNoYXJkc1NwZW50W2tleV0rPXZhbDtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRzaGFyZHNTcGVudFtrZXldID0gdmFsO1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIGxpZmV0aW1lW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRsaWZldGltZVtrZXldKz12YWw7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0bGlmZXRpbWVba2V5XT12YWw7XHJcblx0fVxyXG5cdHNhdmVTZXR0aW5ncygpO1xyXG59XHJcblxyXG5cclxudmFyIEFwcFN0b3JlID0gYXNzaWduKHt9LEV2ZW50RW1pdHRlci5wcm90b3R5cGUse1xyXG5cdGdldFNldHRpbmdzOmdldFNldHRpbmdzLFxyXG5cdGdldFNoYXJkczpnZXRTaGFyZHMsXHJcblxyXG5cdGVtaXRDaGFuZ2U6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuZW1pdChDSEFOR0VfRVZFTlQpO1xyXG5cdH0sXHJcblx0YWRkQ2hhbmdlTGlzdGVuZXI6ZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMub24oQ0hBTkdFX0VWRU5ULGNhbGxiYWNrKTtcclxuXHR9LFxyXG5cdHJlbW92ZUNoYW5nZUxpc3RlbmVyOmZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCxjYWxsYmFjayk7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vaG9pc3Rpbmcgb3ZlcnBvd2VyZWRcclxuZnVuY3Rpb24gbW9iaWxlQ2hlY2soKSB7XHJcblx0dmFyIG1vYmlsZSA9ICh3aW5kb3cuaW5uZXJXaWR0aCA8PSA3NjgpO1xyXG5cclxuXHQvL2lmIGRpZmZlcmVudCB0aGFuIGN1cnJlbnQgY2hhbmdlXHJcblx0aWYgKG1vYmlsZSAhPT0gYXBwU2V0dGluZ3MubW9iaWxlKSB7XHJcblx0XHRhcHBTZXR0aW5ncy5tb2JpbGUgPSBtb2JpbGU7XHJcblx0XHRhcHBTZXR0aW5ncy5zdG9yZSA9ICFtb2JpbGU7XHJcblx0XHRhcHBTZXR0aW5ncy5vcHRpb25zID0gIW1vYmlsZTtcclxuXHR9XHJcblx0QXBwU3RvcmUuZW1pdChDSEFOR0VfRVZFTlQpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRsb2NhbFN0b3JhZ2VDaGVjaygpO1xyXG5cdG1vYmlsZUNoZWNrKCk7XHJcblx0d2luZG93Lm9ucmVzaXplID0gbW9iaWxlQ2hlY2s7XHJcblxyXG5cdEFwcFN0b3JlLnNldE1heExpc3RlbmVycygyMCk7XHJcblxyXG5cdGlmIChzdG9yYWdlU3VwcG9ydGVkKSB7XHJcblx0XHR2YXIgc3RvcmVkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgna2FkYWxhU2V0dGluZ3MnKSkgfHwge307XHJcblxyXG5cdFx0Ly9sb29wIHRocm91Z2ggZXhpc3RpbmcgZGVmYXVsdHMgaW5jYXNlIHVzZXIgaGFzIG9sZGVyIHZlcnNpb24gb2YgYXBwXHJcblx0XHR2YXIgc2V0dGluZ3NLZXlzID0gT2JqZWN0LmtleXMoZGVmYXVsdHMpO1xyXG5cdFx0dmFyIGtleUxlbmd0aCA9IHNldHRpbmdzS2V5cy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwga2V5TGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0YXBwU2V0dGluZ3Nbc2V0dGluZ3NLZXlzW2ldXSA9IHN0b3JlZFtzZXR0aW5nc0tleXNbaV1dIHx8IGRlZmF1bHRzW3NldHRpbmdzS2V5c1tpXV07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9wdWxsIHRoZSBzcGVudCBpdGVtc1xyXG5cdFx0c2hhcmRzU3BlbnQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdrYWRhbGFTcGVudCcpKSB8fCB7fTtcclxuXHRcdGxpZmV0aW1lID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgna2FkYWxhTGlmZXRpbWUnKSkgfHwge307XHJcblxyXG5cdFx0Ly9zYXZlIHRvIHN0b3JhZ2VcclxuXHRcdHNhdmVTZXR0aW5ncygpO1xyXG5cdH1cclxufVxyXG5cclxuaW5pdCgpO1xyXG5cclxuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihhY3Rpb24pIHtcclxuXHRzd2l0Y2goYWN0aW9uLmFjdGlvblR5cGUpe1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuQ0hBTkdFX1NFVFRJTkc6XHJcblx0XHRcdGNoYW5nZVNldHRpbmcoYWN0aW9uLmtleSxhY3Rpb24udmFsKTtcclxuXHRcdFx0QXBwU3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLklOQ1JFTUVOVF9TSEFSRFM6XHJcblx0XHRcdGluY3JlbWVudFNoYXJkcyhhY3Rpb24ua2V5LGFjdGlvbi52YWwpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuVE9HR0xFX1NUT1JFOlxyXG5cdFx0XHR0b2dnbGVTdG9yZSgpO1xyXG5cdFx0XHRBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuVE9HR0xFX09QVElPTlM6XHJcblx0XHRcdHRvZ2dsZU9wdGlvbnMoKTtcclxuXHRcdFx0QXBwU3RvcmUuZW1pdENoYW5nZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdC8vbm9vcFxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFN0b3JlOyIsInZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XHJcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzJyk7XHJcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcblxyXG52YXIgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XHJcblxyXG4vL3RoZXJlIGFyZSBvbmx5IHR3byBpbnZlbnRvcmllcyBiZWluZyB1c2VkIHdpdGggdGhlIGFiaWxpdHkgdG8gY3ljbGUgYmFja1xyXG52YXIgcHJldmlvdXNJbnZlbnRvcnk7XHJcbnZhciBjdXJyZW50SW52ZW50b3J5O1xyXG52YXIgbmV4dEludmVudG9yeTtcclxuXHJcbnZhciBpdGVtcyA9IFtdO1xyXG52YXIgY3VycmVudEluZGV4ID0gMDtcclxuXHJcbi8vY3JlYXRlcyBuZXN0ZWQgYXJyYXkgYmxhbmsgaW52ZW50b3J5IGFuZCBzZXRzIGFzIHRoZSBjdXJyZW50IGludmVudG9yeVxyXG5mdW5jdGlvbiBjcmVhdGVJbnZlbnRvcnkoKSB7XHJcblx0dmFyIG5ld0ludmVudG9yeSA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTwxMDtpKyspIHtcclxuXHRcdC8vcHVzaCBhIGJsYW5rIGFycmF5IHRvIHJlcHJlc2VudCBlYWNoIGNvbHVtbiBvZiB0aGUgaW52ZW50b3J5XHJcblx0XHRuZXdJbnZlbnRvcnkucHVzaChbXSk7XHJcblx0fVxyXG5cclxuXHQvL3NldCB0aGUgcHJldmlvdXMgaW52ZW50b3J5IHRvIHRoZSBsYXRlc3QgaW52ZW50b3J5IHVzZWRcclxuXHRwcmV2aW91c0ludmVudG9yeSA9IG5leHRJbnZlbnRvcnkgfHwgY3VycmVudEludmVudG9yeSB8fCB1bmRlZmluZWQ7XHJcblx0Ly90aGUgbmV3IGJsYW5rIGludmVudG9yeSBpcyBub3cgdGhlIGN1cnJlbnQgaW52ZW50b3J5XHJcblx0Y3VycmVudEludmVudG9yeSA9IG5ld0ludmVudG9yeTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW52ZW50b3J5KCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRwcmV2aW91c0ludmVudG9yeTpwcmV2aW91c0ludmVudG9yeSxcclxuXHRcdGN1cnJlbnRJbnZlbnRvcnk6Y3VycmVudEludmVudG9yeSxcclxuXHRcdG5leHRJbnZlbnRvcnk6bmV4dEludmVudG9yeVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW0oKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdGhhc1ByZXZpb3VzOihjdXJyZW50SW5kZXggIT09IDApLFxyXG5cdFx0aXRlbTppdGVtc1tjdXJyZW50SW5kZXhdLFxyXG5cdFx0aGFzTmV4dDooY3VycmVudEluZGV4IDwgaXRlbXMubGVuZ3RoIC0gMSlcclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRJdGVtKGl0ZW0pIHtcclxuXHR2YXIgaW52ZW50b3J5TGVuZ3RoID0gY3VycmVudEludmVudG9yeS5sZW5ndGg7XHJcblx0Ly9sb29waW5nIHRocm91Z2ggZWFjaCBjb2x1bW4gb2YgdGhlIGludmVudG9yeVxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgaW52ZW50b3J5TGVuZ3RoOyBpICsrKSB7XHJcblx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIGl0ZW0gaW4gc2FpZCBjb2x1bW5cclxuXHRcdHZhciBjb2x1bW5MZW5ndGggPSBjdXJyZW50SW52ZW50b3J5W2ldLmxlbmd0aDtcclxuXHRcdHZhciBjb2x1bW5IZWlnaHQgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjb2x1bW5MZW5ndGg7IGorKykge1xyXG5cdFx0XHQvL2FkZCBjdXJyZW50IGl0ZW0gc2l6ZSB0byBjb2x1bW4gaGVpZ2h0XHJcblx0XHRcdGlmKGN1cnJlbnRJbnZlbnRvcnlbaV1bal0uaGFzT3duUHJvcGVydHkoJ3NpemUnKSkge1xyXG5cdFx0XHRcdGNvbHVtbkhlaWdodCs9Y3VycmVudEludmVudG9yeVtpXVtqXS5zaXplO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL2NoZWNrIGlmIHRoZSBoZWlnaHQgaXMgc3RpbGwgbGVzcyB0aGFuIDYgd2l0aCBuZXcgaXRlbVxyXG5cdFx0Ly9hbmQgYWRkIHRvIHRoYXQgY29sdW1uIGFuZCByZXR1cm4gdG8gc3RvcCB0aGUgbWFkbmVzc1xyXG5cdFx0aWYgKGNvbHVtbkhlaWdodCtpdGVtLnNpemUgPD02KSB7XHJcblx0XHRcdGN1cnJlbnRJbnZlbnRvcnlbaV0ucHVzaChpdGVtKTtcclxuXHRcdFx0Ly9pZiB3ZSBjYW4gc3VjY2Vzc2Z1bGx5IGFkZCB0byBpbnZlbnRvcnkgY2FsbCBmb3IgaXRlbXMgaW52ZW50b3J5XHJcblx0XHRcdGFkZFRvSXRlbXMoaXRlbSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vaWYgd2UgbWFkZSBpdCB0aGlzIGZhciB0aGUgbmV3IGl0ZW0gZG9lcyBub3QgZml0IGluIHRoZSBjdXJyZW50IGludmVudG9yeVxyXG5cdC8vY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbmV4dCBpbnZlbnRvcnlcclxuXHQvL3NvIHRoYXQgd2UgY2FuIGN5Y2xlIHRvIG5leHQgaW52ZW50b3J5IGFuZCB0cnkgYW5kIGZpdCBpdCBpblxyXG5cdGlmICh0eXBlb2YgbmV4dEludmVudG9yeSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdGdvdG9OZXh0KCk7XHJcblx0XHRhZGRJdGVtKGl0ZW0pO1xyXG5cdH1cclxuXHQvL3RoZXJlIGlzIG5vIG5leHQgaW52ZW50b3J5IGFuZCB3ZSBuZWVkIHRvIG1ha2UgYSBuZXcgb25lXHJcblx0ZWxzZSB7XHJcblx0XHRjcmVhdGVJbnZlbnRvcnkoKTtcclxuXHRcdGFkZEl0ZW0oaXRlbSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb0l0ZW1zKGl0ZW0pIHtcclxuXHRpdGVtcy5wdXNoKGl0ZW0pO1xyXG5cclxuXHQvL2lmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMTAgaXRlbXMgcmVtb3ZlIHRoZSBmaXJzdFxyXG5cdGlmIChpdGVtcy5sZW5ndGggPiAxMCkge1xyXG5cdFx0aXRlbXMuc2hpZnQoKTtcclxuXHR9XHJcblxyXG5cdC8vc2V0IHRoZSBjdXJyZW50aW5kZXggdG8gdGhlIG5ldyBpdGVtXHJcblx0Y3VycmVudEluZGV4ID0gaXRlbXMubGVuZ3RoIC0gMTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJldmlvdXNJdGVtKCkge1xyXG5cdGlmIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuXHRcdGN1cnJlbnRJbmRleCAtPTE7XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIG5leHRJdGVtKCkge1xyXG5cdGlmIChjdXJyZW50SW5kZXggPCBpdGVtcy5sZW5ndGggLTEpIHtcclxuXHRcdGN1cnJlbnRJbmRleCArPTE7XHJcblx0fVxyXG59XHJcblxyXG4vL2N5Y2xlcyB0aHJvdWdoIHRvIHRoZSBwcmV2aW91cyBpbnZlbnRvcnlcclxuZnVuY3Rpb24gZ290b1ByZXZpb3VzKCkge1xyXG5cdGlmKHR5cGVvZiBwcmV2aW91c0ludmVudG9yeSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdG5leHRJbnZlbnRvcnkgPSBjdXJyZW50SW52ZW50b3J5O1xyXG5cdFx0Y3VycmVudEludmVudG9yeSA9IHByZXZpb3VzSW52ZW50b3J5O1xyXG5cdFx0cHJldmlvdXNJbnZlbnRvcnkgPSB1bmRlZmluZWQ7XHJcblx0fVxyXG59XHJcblxyXG4vL2N5Y2xlcyB0aHJvdWdoIHRvIHRoZSBuZXh0IGludmVudG9yeVxyXG5mdW5jdGlvbiBnb3RvTmV4dCgpIHtcclxuXHRpZih0eXBlb2YgbmV4dEludmVudG9yeSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHByZXZpb3VzSW52ZW50b3J5ID0gY3VycmVudEludmVudG9yeTtcclxuXHRcdGN1cnJlbnRJbnZlbnRvcnkgPSBuZXh0SW52ZW50b3J5O1xyXG5cdFx0bmV4dEludmVudG9yeSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcbn1cclxuXHJcbi8vaW5pdGlhbGl6ZSBzdG9yZSBieSBjcmVhdGluZyBhIGJsYW5rIGludmVudG9yeVxyXG5jcmVhdGVJbnZlbnRvcnkoKTtcclxuXHJcbnZhciBJbnZlbnRvcnlTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSx7XHJcblx0Z2V0SW52ZW50b3J5OmdldEludmVudG9yeSxcclxuXHRnb3RvUHJldmlvdXM6Z290b1ByZXZpb3VzLFxyXG5cdGdvdG9OZXh0OmdvdG9OZXh0LFxyXG5cdGFkZEl0ZW06YWRkSXRlbSxcclxuXHRnZXRJdGVtOmdldEl0ZW0sXHJcblx0cHJldmlvdXNJdGVtOnByZXZpb3VzSXRlbSxcclxuXHRuZXh0SXRlbTpuZXh0SXRlbSxcclxuXHJcblx0ZW1pdENoYW5nZTpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5lbWl0KENIQU5HRV9FVkVOVCk7XHJcblx0fSxcclxuXHRhZGRDaGFuZ2VMaXN0ZW5lcjpmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdFx0dGhpcy5vbihDSEFOR0VfRVZFTlQsY2FsbGJhY2spO1xyXG5cdH0sXHJcblx0cmVtb3ZlQ2hhbmdlTGlzdGVuZXI6ZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ0hBTkdFX0VWRU5ULGNhbGxiYWNrKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihhY3Rpb24pIHtcclxuXHRzd2l0Y2goYWN0aW9uLmFjdGlvblR5cGUpIHtcclxuXHJcblx0XHRjYXNlIEFwcENvbnN0YW50cy5BRERfSVRFTTpcclxuXHRcdFx0YWRkSXRlbShhY3Rpb24uaXRlbSk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuUFJFVl9JTlY6XHJcblx0XHRcdGdvdG9QcmV2aW91cygpO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLk5FWFRfSU5WOlxyXG5cdFx0XHRnb3RvTmV4dCgpO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgQXBwQ29uc3RhbnRzLlBSRVZfSVRFTTpcclxuXHRcdFx0cHJldmlvdXNJdGVtKCk7XHJcblx0XHRcdEludmVudG9yeVN0b3JlLmVtaXRDaGFuZ2UoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSBBcHBDb25zdGFudHMuTkVYVF9JVEVNOlxyXG5cdFx0XHRuZXh0SXRlbSgpO1xyXG5cdFx0XHRJbnZlbnRvcnlTdG9yZS5lbWl0Q2hhbmdlKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdC8vbm9vcFxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeVN0b3JlOyJdfQ==
