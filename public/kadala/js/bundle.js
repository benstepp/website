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

},{"./components/inventory/inventory.jsx":4,"./components/kadala-options/options-panel.jsx":12,"./components/kadala-store/kadala-store.jsx":15}],2:[function(require,module,exports){
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
					heightCount += this.props.inventory[i][j].height;
					inventorySlots.push(React.createElement(InventorySlot, {data: this.props.inventory[i][j], key: key}))
					key++;
				}
			}

			//now fill in the rest of the column with blank spaces
			while(heightCount < 6) {
				heightCount++;
				inventorySlots.push(React.createElement(InventorySlot, {data: undefined, key: key}));
				key++;
			}

		}

		return (
			React.createElement("div", {className: "inventory-container"}, 
				React.createElement(PreviousInventory, null), 
				inventorySlots, 
				React.createElement(NextInventory, null)
			)
		);
	}
});

module.exports = InventoryContainer

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./inventory-slot.jsx":3,"./next-inventory.jsx":5,"./previous-inventory.jsx":6}],3:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var InventorySlot = React.createClass({displayName: "InventorySlot",
	render:function() {

		var slotContent= [];

		//check to make sure an actual item is in the inventory slot
		if (typeof this.props.data !== 'undefined') {

		}

		return (
			React.createElement("div", {className: "inventory-slot"}, 
				slotContent
			)
		);
	}
});

module.exports = InventorySlot;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var InventoryContainer = require('./inventory-container.jsx');

var Inventory = React.createClass({displayName: "Inventory",
	getInitialState: function() {

		//inventory is treated as a 10 columns represented as a nested array
		var currentInventory = [];
		for (var i =0; i < 10; i++) {
			currentInventory.push([]);
		}

		return {
			previousInventory:undefined,
			currentInventory:currentInventory,
			nextInventory:undefined
		};
	},

	render:function() {
		return (
			React.createElement("div", {className: "inventory-section"}, 
				React.createElement(InventoryContainer, {inventory: this.state.currentInventory})
			)
		);
	}
});

module.exports = Inventory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./inventory-container.jsx":2}],5:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var NextInventory = React.createClass({displayName: "NextInventory",
	render:function() {
		return (
			React.createElement("div", {className: "inventory-button"}, "n")
		);
	}
});

module.exports = NextInventory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var PreviousInventory = React.createClass({displayName: "PreviousInventory",
	render:function() {
		return (
			React.createElement("div", {className: "inventory-button"}, "p")
		);
	}
});

module.exports = PreviousInventory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./class-selector-button.jsx":7}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./gender-selector-button.jsx":9}],11:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var HardcoreCheckbox = React.createClass({displayName: "HardcoreCheckbox",
	render:function() {
		return (
			React.createElement("div", {className: "checkbox-wrapper"}, 
				React.createElement("label", null, 
					React.createElement("input", {type: "checkbox", className: "options-checkbox"}), 
					React.createElement("span", {className: "checkbox-label"}, "Hardcore ", React.createElement("span", {className: "hidden-sm"}, "Hero"))
				)
			)
		);
	}
});

module.exports = HardcoreCheckbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var ClassSelector = require('./class-selector.jsx');
var GenderSelector = require('./gender-selector.jsx');
var SeasonalCheckbox = require('./seasonal-checkbox.jsx');
var HardcoreCheckbox = require('./hardcore-checkbox.jsx');

var OptionsPanel = React.createClass({displayName: "OptionsPanel",

	getInitialState:function() {
		return {
			dClass:'Barbarian',
			gender:'Female'
		};
	},

	changeGender:function(gender) {
		this.setState({
			gender:gender
		});
	},

	changeClass:function(dClass) {
		this.setState({
			dClass:dClass
		});
	},

	render:function() {
		return (
			React.createElement("section", {className: "options-panel"}, 
				React.createElement(ClassSelector, {changeClass: this.changeClass, selected: this.state.dClass, gender: this.state.gender}), 
				React.createElement(GenderSelector, {changeGender: this.changeGender, selected: this.state.gender}), 
				React.createElement(SeasonalCheckbox, null), 
				React.createElement(HardcoreCheckbox, null)
			)
		);
	}
});

module.exports = OptionsPanel;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./class-selector.jsx":8,"./gender-selector.jsx":10,"./hardcore-checkbox.jsx":11,"./seasonal-checkbox.jsx":13}],13:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var SeasonalCheckbox = React.createClass({displayName: "SeasonalCheckbox",
	render:function() {
		return (
			React.createElement("div", {className: "checkbox-wrapper"}, 
				React.createElement("label", null, 
					React.createElement("input", {type: "checkbox", className: "options-checkbox"}), 
					React.createElement("span", {className: "checkbox-label"}, "Seasonal ", React.createElement("span", {className: "hidden-sm"}, "Hero"))
				)
			)
		);
	}
});

module.exports = SeasonalCheckbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],14:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var KadalaItem = React.createClass({displayName: "KadalaItem",
	render:function() {

		var shardClass = 'shard-count';
		if (typeof this.props.item === 'undefined') {
			shardClass+=' hidden-shards'
		}

		return (
			React.createElement("div", {className: "kadala-item"}, 
				React.createElement("button", {className: "kadala"}, 
					React.createElement("img", {className: "kadala-icon"})
				), 
				React.createElement("div", {className: "kadala-content"}, 
					React.createElement("span", null, this.props.item), 
					React.createElement("span", {className: shardClass}, this.props.shardCount || 0)
				)
			)
		);
	}
});

module.exports = KadalaItem;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],15:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var KadalaItem = require('./kadala-item.jsx');

var KadalaStore = React.createClass({displayName: "KadalaStore",
	render:function() {

		//another nested array to represent each column of store
		var itemsForSale = [
			[{helm:'Mystery Helmet'},{boots:'Mystery Boots'},{belt:'Mystery Belt'},{pants:'Mystery Pants'}],
			[{gloves:'Mystery Gloves'},{chest:'Mystery Chest'},{shoulders:'Mystery Shoulders'},{bracers:'Mystery Bracers'}],
			[{quiver:'Mystery Quiver'},{mojo:'Mystery Mojo'},{source:'Mystery Orb'},{shield:'Mystery Shield'}],
			[{onehand:'1-H Mystery Weapon'},{twohand:'2-H Mystery Weapon'},{ring:'Mystery Ring'},{amulet:'Mystery Amulet'}]
		];

		var kadalaSlots = [];
		var key = 0;
		//loop through each column of store
		for (var i =0; i < 4; i++) {
			var rowCount = itemsForSale[i].length;
			for (var j=0; j < rowCount ; j++) {
				kadalaSlots.push(React.createElement(KadalaItem, {key: key, item: itemsForSale[i][j]}));
				key++;
			}

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

},{"./kadala-item.jsx":14}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LWNvbnRhaW5lci5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcaW52ZW50b3J5LXNsb3QuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXGludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGludmVudG9yeVxcbmV4dC1pbnZlbnRvcnkuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxpbnZlbnRvcnlcXHByZXZpb3VzLWludmVudG9yeS5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxjbGFzcy1zZWxlY3Rvci1idXR0b24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcY2xhc3Mtc2VsZWN0b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcZ2VuZGVyLXNlbGVjdG9yLWJ1dHRvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxnZW5kZXItc2VsZWN0b3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcaGFyZGNvcmUtY2hlY2tib3guanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcb3B0aW9ucy1wYW5lbC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1vcHRpb25zXFxzZWFzb25hbC1jaGVja2JveC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGthZGFsYS1zdG9yZVxca2FkYWxhLWl0ZW0uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtc3RvcmVcXGthZGFsYS1zdG9yZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUM1RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNENBQTRDLENBQUMsQ0FBQztBQUN4RSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQzs7QUFFaEUsSUFBSSxpQ0FBaUMsMkJBQUE7Q0FDcEMsTUFBTSxDQUFDLFdBQVc7RUFDakI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGlCQUFrQixDQUFBLEVBQUE7SUFDaEMsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxLQUFNLENBQUEsRUFBQTtLQUNwQixvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLFVBQVcsQ0FBQSxF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RUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtHQUMxQixJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0dBQ3RDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLEVBQUU7SUFDakMsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBQyxVQUFVLEVBQUEsQ0FBQSxDQUFDLEdBQUEsRUFBRyxDQUFFLEdBQUcsRUFBQyxDQUFDLElBQUEsRUFBSSxDQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBRSxDQUFBLENBQUMsQ0FBQztJQUNwRSxHQUFHLEVBQUUsQ0FBQztBQUNWLElBQUk7O0FBRUosR0FBRzs7RUFFRDtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsY0FBZSxDQUFBLEVBQUE7SUFDNUIsV0FBWTtHQUNSLENBQUE7SUFDTDtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgT3B0aW9uc1BhbmVsID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2thZGFsYS1vcHRpb25zL29wdGlvbnMtcGFuZWwuanN4Jyk7XHJcbnZhciBLYWRhbGFTdG9yZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9rYWRhbGEtc3RvcmUva2FkYWxhLXN0b3JlLmpzeCcpO1xyXG52YXIgSW52ZW50b3J5ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2ludmVudG9yeS9pbnZlbnRvcnkuanN4Jyk7XHJcblxyXG52YXIgQXBwbGljYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb250YWluZXItZmx1aWRcIj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJjb2wtc20tM1wiPlxyXG5cdFx0XHRcdFx0XHQ8T3B0aW9uc1BhbmVsIC8+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTlcIj5cclxuXHRcdFx0XHRcdFx0PEthZGFsYVN0b3JlIC8+XHJcblx0XHRcdFx0XHRcdDxJbnZlbnRvcnkgLz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxuUmVhY3QucmVuZGVyKFxyXG5cdDxBcHBsaWNhdGlvbiAvPixcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcclxuKTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEludmVudG9yeVNsb3QgPSByZXF1aXJlKCcuL2ludmVudG9yeS1zbG90LmpzeCcpO1xyXG52YXIgUHJldmlvdXNJbnZlbnRvcnkgPSByZXF1aXJlKCcuL3ByZXZpb3VzLWludmVudG9yeS5qc3gnKTtcclxudmFyIE5leHRJbnZlbnRvcnkgPSByZXF1aXJlKCcuL25leHQtaW52ZW50b3J5LmpzeCcpO1xyXG5cclxuXHJcbnZhciBJbnZlbnRvcnlDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBpbnZlbnRvcnlTbG90cyA9IFtdO1xyXG5cdFx0dmFyIGtleT0wO1xyXG5cclxuXHRcdC8vbG9vcCB0aHJvdWdoIHRoZSAxMCBjb2x1bW5zIG9mIGludmVudG9yeVxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcblx0XHRcdHZhciBjb2x1bW5MZW5ndGggPSB0aGlzLnByb3BzLmludmVudG9yeVtpXS5sZW5ndGg7XHJcblxyXG5cdFx0XHQvL2EgY2hlY2sgZm9yIHRoZSB0b3RhbCBoZWlnaHQgb2YgdGhpcyBjb2x1bW5cclxuXHRcdFx0dmFyIGhlaWdodENvdW50ID0gMDtcclxuXHJcblx0XHRcdC8vYWRkIGFsbCBleGlzdGluZyBpdGVtcyB0byB0aGUgY29sdW1uc1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7IGogPCBjb2x1bW5MZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLmludmVudG9yeVtpXVtqXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdGhlaWdodENvdW50ICs9IHRoaXMucHJvcHMuaW52ZW50b3J5W2ldW2pdLmhlaWdodDtcclxuXHRcdFx0XHRcdGludmVudG9yeVNsb3RzLnB1c2goPEludmVudG9yeVNsb3QgZGF0YT17dGhpcy5wcm9wcy5pbnZlbnRvcnlbaV1bal19IGtleT17a2V5fS8+KVxyXG5cdFx0XHRcdFx0a2V5Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL25vdyBmaWxsIGluIHRoZSByZXN0IG9mIHRoZSBjb2x1bW4gd2l0aCBibGFuayBzcGFjZXNcclxuXHRcdFx0d2hpbGUoaGVpZ2h0Q291bnQgPCA2KSB7XHJcblx0XHRcdFx0aGVpZ2h0Q291bnQrKztcclxuXHRcdFx0XHRpbnZlbnRvcnlTbG90cy5wdXNoKDxJbnZlbnRvcnlTbG90IGRhdGE9e3VuZGVmaW5lZH0ga2V5PXtrZXl9Lz4pO1xyXG5cdFx0XHRcdGtleSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktY29udGFpbmVyJz5cclxuXHRcdFx0XHQ8UHJldmlvdXNJbnZlbnRvcnkgLz5cclxuXHRcdFx0XHR7aW52ZW50b3J5U2xvdHN9XHJcblx0XHRcdFx0PE5leHRJbnZlbnRvcnkgLz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeUNvbnRhaW5lciIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5U2xvdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNsb3RDb250ZW50PSBbXTtcclxuXHJcblx0XHQvL2NoZWNrIHRvIG1ha2Ugc3VyZSBhbiBhY3R1YWwgaXRlbSBpcyBpbiB0aGUgaW52ZW50b3J5IHNsb3RcclxuXHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5kYXRhICE9PSAndW5kZWZpbmVkJykge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LXNsb3QnPlxyXG5cdFx0XHRcdHtzbG90Q29udGVudH1cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeVNsb3Q7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBJbnZlbnRvcnlDb250YWluZXIgPSByZXF1aXJlKCcuL2ludmVudG9yeS1jb250YWluZXIuanN4Jyk7XHJcblxyXG52YXIgSW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly9pbnZlbnRvcnkgaXMgdHJlYXRlZCBhcyBhIDEwIGNvbHVtbnMgcmVwcmVzZW50ZWQgYXMgYSBuZXN0ZWQgYXJyYXlcclxuXHRcdHZhciBjdXJyZW50SW52ZW50b3J5ID0gW107XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwgMTA7IGkrKykge1xyXG5cdFx0XHRjdXJyZW50SW52ZW50b3J5LnB1c2goW10pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHByZXZpb3VzSW52ZW50b3J5OnVuZGVmaW5lZCxcclxuXHRcdFx0Y3VycmVudEludmVudG9yeTpjdXJyZW50SW52ZW50b3J5LFxyXG5cdFx0XHRuZXh0SW52ZW50b3J5OnVuZGVmaW5lZFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW52ZW50b3J5LXNlY3Rpb24nPlxyXG5cdFx0XHRcdDxJbnZlbnRvcnlDb250YWluZXIgaW52ZW50b3J5PXt0aGlzLnN0YXRlLmN1cnJlbnRJbnZlbnRvcnl9Lz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIE5leHRJbnZlbnRvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ludmVudG9yeS1idXR0b24nPm48L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV4dEludmVudG9yeTsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIFByZXZpb3VzSW52ZW50b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbnZlbnRvcnktYnV0dG9uJz5wPC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByZXZpb3VzSW52ZW50b3J5OyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvckJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0Ly9zdGF0ZSBpcyBoYW5kbGVkIGluIHRoZSBwYXJlbnQgY29tcG9uZW50XHJcblx0Ly90aGlzIGZ1bmN0aW9uIGlzIHVwIHRoZXJlXHJcblx0aGFuZGxlQ2xpY2s6ZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnByb3BzLmNoYW5nZUNsYXNzKHRoaXMucHJvcHMubmFtZSk7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBzaG9ydGVuZWROYW1lcyA9IHtcclxuXHRcdFx0QmFyYmFyaWFuOidiYXJiJyxcclxuXHRcdFx0Q3J1c2FkZXI6J2NydXMnLFxyXG5cdFx0XHQnRGVtb24gSHVudGVyJzonZGgnLFxyXG5cdFx0XHRNb25rOidtb25rJyxcclxuXHRcdFx0J1dpdGNoIERvY3Rvcic6J3dkJyxcclxuXHRcdFx0V2l6YXJkOid3aXonXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzID0gJ2NsYXNzLXNlbGVjdG9yJztcclxuXHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdGVkKSB7XHJcblx0XHRcdGJ1dHRvbkNsYXNzKz0gJyBzZWxlY3RlZCdcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaW1hZ2VDbGFzcz0gdGhpcy5wcm9wcy5uYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnICcsJycpO1xyXG5cdFx0aW1hZ2VDbGFzcys9IHRoaXMucHJvcHMuZ2VuZGVyLnRvTG93ZXJDYXNlKCk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGxpPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XHJcblx0XHRcdFx0XHQ8aW1nIHNyYz17dGhpcy5wcm9wcy5pbWFnZX0gY2xhc3NOYW1lPXtpbWFnZUNsYXNzfT48L2ltZz5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLm5hbWUudG9Mb3dlckNhc2UoKX08L3NwYW4+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJzaG9ydGVuZWRcIj57c2hvcnRlbmVkTmFtZXNbdGhpcy5wcm9wcy5uYW1lXX08L3NwYW4+XHJcblx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdDwvbGk+XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yQnV0dG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBDbGFzc1NlbGVjdG9yQnV0dG9uID0gcmVxdWlyZSgnLi9jbGFzcy1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgQ2xhc3NTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRDbGFzc2VzID0gWydCYXJiYXJpYW4nLCdDcnVzYWRlcicsJ0RlbW9uIEh1bnRlcicsJ01vbmsnLCdXaXRjaCBEb2N0b3InLCdXaXphcmQnXTtcclxuXHRcdHZhciBkQ2xhc3Nlc0xlbmd0aCA9IGRDbGFzc2VzLmxlbmd0aDtcclxuXHJcblx0XHR2YXIgY2xhc3NTZWxlY3RvcnMgPSBbXTtcclxuXHRcdGZvciAodmFyIGkgPTA7IGkgPCBkQ2xhc3Nlc0xlbmd0aDtpKyspIHtcclxuXHJcblx0XHRcdC8vY2hlY2sgZm9yIHNlbGVjdGVkIGNsYXNzIHN0b3JlZCBpbiBzdGF0ZSBvZiB0aGlzIGNvbXBvbmVudFxyXG5cdFx0XHR2YXIgc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQgPT09IGRDbGFzc2VzW2ldKSB7XHJcblx0XHRcdFx0c2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3B1dCBzZWxlY3RvcnMgaW4gYXJyYXkgdG8gYmUgcmVuZGVyZWRcclxuXHRcdFx0Y2xhc3NTZWxlY3RvcnMucHVzaChcclxuXHRcdFx0XHQ8Q2xhc3NTZWxlY3RvckJ1dHRvbiBcclxuXHRcdFx0XHRcdG5hbWU9e2RDbGFzc2VzW2ldfSBcclxuXHRcdFx0XHRcdGNoYW5nZUNsYXNzPXt0aGlzLnByb3BzLmNoYW5nZUNsYXNzfSBcclxuXHRcdFx0XHRcdGtleT17aX0gXHJcblx0XHRcdFx0XHRzZWxlY3RlZD17c2VsZWN0ZWR9XHJcblx0XHRcdFx0XHRnZW5kZXI9e3RoaXMucHJvcHMuZ2VuZGVyfVxyXG5cdFx0XHRcdFx0Lz5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8dWwgY2xhc3NOYW1lPSdjbGFzcy1zZWxlY3Rvcic+XHJcblx0XHRcdFx0XHR7Y2xhc3NTZWxlY3RvcnN9XHJcblx0XHRcdFx0PC91bD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHVwZGF0ZUdlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlR2VuZGVyKHRoaXMucHJvcHMuZ2VuZGVyKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzPSdnZW5kZXItc2VsZWN0b3IgJyt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYnV0dG9uLXdyYXBwZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy51cGRhdGVHZW5kZXJ9ID5cclxuXHRcdFx0XHRcdDxpbWcgLz5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmRlclNlbGVjdG9yQnV0dG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSByZXF1aXJlKCcuL2dlbmRlci1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBtYWxlU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gJ01hbGUnKTtcclxuXHRcdHZhciBmZW1hbGVTZWxlY3RlZCA9ICh0aGlzLnByb3BzLnNlbGVjdGVkID09PSAnRmVtYWxlJyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dlbmRlci1zZWxlY3Rvcic+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yQnV0dG9uIGdlbmRlcj0nTWFsZScgY2hhbmdlR2VuZGVyPXt0aGlzLnByb3BzLmNoYW5nZUdlbmRlcn0gc2VsZWN0ZWQ9e21hbGVTZWxlY3RlZH0gLz5cclxuXHRcdFx0XHQ8R2VuZGVyU2VsZWN0b3JCdXR0b24gZ2VuZGVyPSdGZW1hbGUnIGNoYW5nZUdlbmRlcj17dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXtmZW1hbGVTZWxlY3RlZH0gLz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmRlclNlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSGFyZGNvcmVDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2hlY2tib3gtd3JhcHBlcic+XHJcblx0XHRcdFx0PGxhYmVsPlxyXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzc05hbWU9J29wdGlvbnMtY2hlY2tib3gnIC8+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2NoZWNrYm94LWxhYmVsJz5IYXJkY29yZSA8c3BhbiBjbGFzc05hbWU9J2hpZGRlbi1zbSc+SGVybzwvc3Bhbj48L3NwYW4+XHJcblx0XHRcdFx0PC9sYWJlbD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhcmRjb3JlQ2hlY2tib3g7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yID0gcmVxdWlyZSgnLi9jbGFzcy1zZWxlY3Rvci5qc3gnKTtcclxudmFyIEdlbmRlclNlbGVjdG9yID0gcmVxdWlyZSgnLi9nZW5kZXItc2VsZWN0b3IuanN4Jyk7XHJcbnZhciBTZWFzb25hbENoZWNrYm94ID0gcmVxdWlyZSgnLi9zZWFzb25hbC1jaGVja2JveC5qc3gnKTtcclxudmFyIEhhcmRjb3JlQ2hlY2tib3ggPSByZXF1aXJlKCcuL2hhcmRjb3JlLWNoZWNrYm94LmpzeCcpO1xyXG5cclxudmFyIE9wdGlvbnNQYW5lbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZENsYXNzOidCYXJiYXJpYW4nLFxyXG5cdFx0XHRnZW5kZXI6J0ZlbWFsZSdcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0Y2hhbmdlR2VuZGVyOmZ1bmN0aW9uKGdlbmRlcikge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGdlbmRlcjpnZW5kZXJcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGNoYW5nZUNsYXNzOmZ1bmN0aW9uKGRDbGFzcykge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGRDbGFzczpkQ2xhc3NcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGNsYXNzTmFtZT0nb3B0aW9ucy1wYW5lbCc+XHJcblx0XHRcdFx0PENsYXNzU2VsZWN0b3IgY2hhbmdlQ2xhc3M9e3RoaXMuY2hhbmdlQ2xhc3N9IHNlbGVjdGVkPXt0aGlzLnN0YXRlLmRDbGFzc30gZ2VuZGVyPXt0aGlzLnN0YXRlLmdlbmRlcn0vPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvciBjaGFuZ2VHZW5kZXI9e3RoaXMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5nZW5kZXJ9Lz5cclxuXHRcdFx0XHQ8U2Vhc29uYWxDaGVja2JveCAvPlxyXG5cdFx0XHRcdDxIYXJkY29yZUNoZWNrYm94IC8+XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uc1BhbmVsOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2hlY2tib3gtd3JhcHBlcic+XHJcblx0XHRcdFx0PGxhYmVsPlxyXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzc05hbWU9J29wdGlvbnMtY2hlY2tib3gnIC8+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2NoZWNrYm94LWxhYmVsJz5TZWFzb25hbCA8c3BhbiBjbGFzc05hbWU9J2hpZGRlbi1zbSc+SGVybzwvc3Bhbj48L3NwYW4+XHJcblx0XHRcdFx0PC9sYWJlbD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXNvbmFsQ2hlY2tib3g7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBLYWRhbGFJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2hhcmRDbGFzcyA9ICdzaGFyZC1jb3VudCc7XHJcblx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMuaXRlbSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0c2hhcmRDbGFzcys9JyBoaWRkZW4tc2hhcmRzJ1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdrYWRhbGEtaXRlbSc+XHJcblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2thZGFsYSc+XHJcblx0XHRcdFx0XHQ8aW1nIGNsYXNzTmFtZT0na2FkYWxhLWljb24nLz5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0na2FkYWxhLWNvbnRlbnQnPlxyXG5cdFx0XHRcdFx0PHNwYW4+e3RoaXMucHJvcHMuaXRlbX08L3NwYW4+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9e3NoYXJkQ2xhc3N9Pnt0aGlzLnByb3BzLnNoYXJkQ291bnQgfHwgMH08L3NwYW4+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLYWRhbGFJdGVtOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgS2FkYWxhSXRlbSA9IHJlcXVpcmUoJy4va2FkYWxhLWl0ZW0uanN4Jyk7XHJcblxyXG52YXIgS2FkYWxhU3RvcmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vYW5vdGhlciBuZXN0ZWQgYXJyYXkgdG8gcmVwcmVzZW50IGVhY2ggY29sdW1uIG9mIHN0b3JlXHJcblx0XHR2YXIgaXRlbXNGb3JTYWxlID0gW1xyXG5cdFx0XHRbe2hlbG06J015c3RlcnkgSGVsbWV0J30se2Jvb3RzOidNeXN0ZXJ5IEJvb3RzJ30se2JlbHQ6J015c3RlcnkgQmVsdCd9LHtwYW50czonTXlzdGVyeSBQYW50cyd9XSxcclxuXHRcdFx0W3tnbG92ZXM6J015c3RlcnkgR2xvdmVzJ30se2NoZXN0OidNeXN0ZXJ5IENoZXN0J30se3Nob3VsZGVyczonTXlzdGVyeSBTaG91bGRlcnMnfSx7YnJhY2VyczonTXlzdGVyeSBCcmFjZXJzJ31dLFxyXG5cdFx0XHRbe3F1aXZlcjonTXlzdGVyeSBRdWl2ZXInfSx7bW9qbzonTXlzdGVyeSBNb2pvJ30se3NvdXJjZTonTXlzdGVyeSBPcmInfSx7c2hpZWxkOidNeXN0ZXJ5IFNoaWVsZCd9XSxcclxuXHRcdFx0W3tvbmVoYW5kOicxLUggTXlzdGVyeSBXZWFwb24nfSx7dHdvaGFuZDonMi1IIE15c3RlcnkgV2VhcG9uJ30se3Jpbmc6J015c3RlcnkgUmluZyd9LHthbXVsZXQ6J015c3RlcnkgQW11bGV0J31dXHJcblx0XHRdO1xyXG5cclxuXHRcdHZhciBrYWRhbGFTbG90cyA9IFtdO1xyXG5cdFx0dmFyIGtleSA9IDA7XHJcblx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIGNvbHVtbiBvZiBzdG9yZVxyXG5cdFx0Zm9yICh2YXIgaSA9MDsgaSA8IDQ7IGkrKykge1xyXG5cdFx0XHR2YXIgcm93Q291bnQgPSBpdGVtc0ZvclNhbGVbaV0ubGVuZ3RoO1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7IGogPCByb3dDb3VudCA7IGorKykge1xyXG5cdFx0XHRcdGthZGFsYVNsb3RzLnB1c2goPEthZGFsYUl0ZW0ga2V5PXtrZXl9IGl0ZW09e2l0ZW1zRm9yU2FsZVtpXVtqXX0vPik7XHJcblx0XHRcdFx0a2V5Kys7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2thZGFsYS1zdG9yZSc+XHJcblx0XHRcdFx0e2thZGFsYVNsb3RzfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2FkYWxhU3RvcmU7Il19
