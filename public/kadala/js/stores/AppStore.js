var d3sim = require('d3sim');

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
	if(arguments.length > 0) {
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