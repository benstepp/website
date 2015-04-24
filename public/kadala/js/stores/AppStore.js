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
	item:'helm'
};

var storageSupported;

//Determine whether or not local storage is supported
//from github.com/agrublev/angularLocalStorage
//MIT Licence
function localStorageCheck() {
	var storage = (typeof $window.localStorage === 'undefined') ? undefined : $window.localStorage;
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
	}
}

function init() {
	var stored = JSON.parse(localStorage.getItem('kadalaSettings')) || {};

	//loop through existing defaults incase user has older version of app
	var settingsKeys = Object.keys(defaults);
	var keyLength = settingsKeys.length;
	for (var i =0; i < keyLength; i++) {
		appSettings[settingsKeys[i]] = stored[settingsKeys[i]] || defaults[settingsKeys[i]];
	}

	//save to storage
	saveSettings();
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
		default:
		//noop
	}
});

module.exports = AppStore;