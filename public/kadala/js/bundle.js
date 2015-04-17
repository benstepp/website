(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltip = require('./components/d3-tooltip/d3-tooltip.jsx');
var OptionsPanel = require('./components/kadala-options/options-panel.jsx');

var item = {
	name:'Marauder\'s Spine',
	color:'green',
	image:'//media.blizzard.com/d3/icons/items/large/unique_shoulder_set_07_x1_demonhunter_male.png',

	slot:'Shoulders',
	type:'Set Shoulders',
	classSpecific:'Demon Hunter',

	//armor:'609',

	weapon:{
		min:'1111',
		max:'4300',
		speed:'1.1',
		dps:'3100'
	},

	primaries:[
	{
		name:'<span>Dex</span>',
		value:955,
		color:'blue'
	},
	{
		name:'Vitality',
		value:555,
		color:'blue'
	},
	{
		name:'Cost Reduction',
		value:8,
		color:'orange'
	}
	],
	secondaries:[],
	socket:false


};

React.render(
	React.createElement(OptionsPanel, null),
	document.getElementById('example')
);


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./components/d3-tooltip/d3-tooltip.jsx":7,"./components/kadala-options/options-panel.jsx":13}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
	D3ItemTooltipArmor = require('./d3-tooltip-armor.jsx'),
	D3ItemTooltipWeapon = require('./d3-tooltip-weapon.jsx'),
	D3ItemTooltipStat = require('./d3-tooltip-stat.jsx');

var D3ItemTooltipBody = React.createClass({displayName: "D3ItemTooltipBody",
	getDefaultProps: function() {
		return {
			iconClasses:'d3-icon d3-icon-item d3-icon-item-large',
			itemTypeClass:'d3-color-'
		};
	},

	render: function() {

		//declare arrays for primary and secondary item effects. 
		//An item must have at least one of each.
		//Create the list item for each stat and push in the arrays
		var primaries = forEach(this.props.item.primaries);
		var secondaries = forEach(this.props.item.secondaries);

		//image used as inline-style for item tooltips
		var image = {backgroundImage:'url('+this.props.item.image+')'};

		//if specified, set color for tooltip components
		if (this.props.item.color) {
			this.props.iconClasses += ' d3-icon-item-'+this.props.item.color;
			this.props.itemTypeClass +=this.props.item.color;
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
				React.createElement("span", {className: this.props.iconClasses}, 
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
							React.createElement("span", {className: this.props.itemTypeClass}, this.props.item.type)
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
			results.push(React.createElement(D3ItemTooltipStat, {value: val, name: stat, key: i}));
		}
		return results;
	}

	}
});

module.exports = D3ItemTooltipBody;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./d3-tooltip-armor.jsx":2,"./d3-tooltip-stat.jsx":5,"./d3-tooltip-weapon.jsx":6}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var D3ItemTooltipStat= React.createClass({displayName: "D3ItemTooltipStat",

	render: function() {

		var text;

		text = React.createElement("p", null, React.createElement("span", {className: "value"}, "+", this.props.value), " ", this.props.name);

		return (

			React.createElement("li", {className: "d3-color-blue d3-item-property-default"}, 
				text
			)

		);

	}

});

module.exports = D3ItemTooltipStat;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./d3-tooltip-body.jsx":3,"./d3-tooltip-head.jsx":4}],8:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var ClassSelectorButton = React.createClass({displayName: "ClassSelectorButton",

	//state is handled in the parent component
	//this function is up there
	handleClick:function() {
		this.props.changeClass(this.props.name);
	},

	render:function() {

		var buttonClass = 'classSelector';
		if (this.props.selected) {
			buttonClass+= ' selected'
		}

		var imageClass= this.props.name.toLowerCase().replace(' ','');
		imageClass+= this.props.gender.toLowerCase();

		return (
			React.createElement("li", null, 
				React.createElement("button", {className: buttonClass, onClick: this.handleClick}, 
					React.createElement("img", {src: this.props.image, className: imageClass}), 
					React.createElement("span", null, this.props.name.toLowerCase())
				)
			)
		);
	}

});

module.exports = ClassSelectorButton;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
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
				React.createElement("ul", {className: "classSelector"}, 
					classSelectors
				)
			)
		);

	}
});

module.exports = ClassSelector;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./class-selector-button.jsx":8}],10:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var GenderSelectorButton = React.createClass({displayName: "GenderSelectorButton",

	updateGender:function() {
		this.props.changeGender(this.props.gender);
	},

	render:function() {

		var buttonClass='gender-selector';
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

},{}],11:[function(require,module,exports){
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

},{"./gender-selector-button.jsx":10}],12:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var HardcoreCheckbox = React.createClass({displayName: "HardcoreCheckbox",
	render:function() {
		return (
			React.createElement("div", {className: "checkbox-wrapper"}, 
				React.createElement("label", null, 
					React.createElement("input", {type: "checkbox", className: "options-checkbox"}), 
					"Hardcore Hero"
				)
			)
		);
	}
});

module.exports = HardcoreCheckbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],13:[function(require,module,exports){
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

},{"./class-selector.jsx":9,"./gender-selector.jsx":11,"./hardcore-checkbox.jsx":12,"./seasonal-checkbox.jsx":14}],14:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var SeasonalCheckbox = React.createClass({displayName: "SeasonalCheckbox",
	render:function() {
		return (
			React.createElement("div", {className: "checkbox-wrapper"}, 
				React.createElement("label", null, 
					React.createElement("input", {type: "checkbox", className: "options-checkbox"}), 
					"Seasonal Hero"
				)
			)
		);
	}
});

module.exports = SeasonalCheckbox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGFwcC5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAtYXJtb3IuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWJvZHkuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLWhlYWQuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLXN0YXQuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxkMy10b29sdGlwXFxkMy10b29sdGlwLXdlYXBvbi5qc3giLCJEOlxcc3J2XFx3ZWJzaXRlXFxwdWJsaWNcXGthZGFsYVxcanNcXGNvbXBvbmVudHNcXGQzLXRvb2x0aXBcXGQzLXRvb2x0aXAuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcY2xhc3Mtc2VsZWN0b3ItYnV0dG9uLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGNsYXNzLXNlbGVjdG9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGdlbmRlci1zZWxlY3Rvci1idXR0b24uanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcZ2VuZGVyLXNlbGVjdG9yLmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXGhhcmRjb3JlLWNoZWNrYm94LmpzeCIsIkQ6XFxzcnZcXHdlYnNpdGVcXHB1YmxpY1xca2FkYWxhXFxqc1xcY29tcG9uZW50c1xca2FkYWxhLW9wdGlvbnNcXG9wdGlvbnMtcGFuZWwuanN4IiwiRDpcXHNydlxcd2Vic2l0ZVxccHVibGljXFxrYWRhbGFcXGpzXFxjb21wb25lbnRzXFxrYWRhbGEtb3B0aW9uc1xcc2Vhc29uYWwtY2hlY2tib3guanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7QUFDdEUsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUM7O0FBRTVFLElBQUksSUFBSSxHQUFHO0NBQ1YsSUFBSSxDQUFDLG1CQUFtQjtDQUN4QixLQUFLLENBQUMsT0FBTztBQUNkLENBQUMsS0FBSyxDQUFDLDBGQUEwRjs7Q0FFaEcsSUFBSSxDQUFDLFdBQVc7Q0FDaEIsSUFBSSxDQUFDLGVBQWU7QUFDckIsQ0FBQyxhQUFhLENBQUMsY0FBYztBQUM3QjtBQUNBOztDQUVDLE1BQU0sQ0FBQztFQUNOLEdBQUcsQ0FBQyxNQUFNO0VBQ1YsR0FBRyxDQUFDLE1BQU07RUFDVixLQUFLLENBQUMsS0FBSztFQUNYLEdBQUcsQ0FBQyxNQUFNO0FBQ1osRUFBRTs7Q0FFRCxTQUFTLENBQUM7Q0FDVjtFQUNDLElBQUksQ0FBQyxrQkFBa0I7RUFDdkIsS0FBSyxDQUFDLEdBQUc7RUFDVCxLQUFLLENBQUMsTUFB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RUFBQSxDQUFBLENBQUMsWUFBQSxFQUFZLENBQUUsSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDLFFBQUEsRUFBUSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTyxDQUFFLENBQUEsRUFBQTtJQUMvRSxvQkFBQyxnQkFBZ0IsRUFBQSxJQUFBLENBQUcsQ0FBQSxFQUFBO0lBQ3BCLG9CQUFDLGdCQUFnQixFQUFBLElBQUEsQ0FBRyxDQUFBO0dBQ1gsQ0FBQTtJQUNUO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVk7Ozs7OztBQ3hDN0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLHNDQUFzQyxnQ0FBQTtDQUN6QyxNQUFNLENBQUMsV0FBVztFQUNqQjtHQUNDLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsa0JBQW1CLENBQUEsRUFBQTtJQUNqQyxvQkFBQSxPQUFNLEVBQUEsSUFBQyxFQUFBO0tBQ04sb0JBQUEsT0FBTSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQyxVQUFBLEVBQVUsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxrQkFBa0IsQ0FBQSxDQUFHLENBQUEsRUFBQTtBQUFBLEtBQUEsZUFBQTtBQUFBLElBRS9DLENBQUE7R0FDSCxDQUFBO0lBQ0w7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kMy10b29sdGlwL2QzLXRvb2x0aXAuanN4Jyk7XHJcbnZhciBPcHRpb25zUGFuZWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMva2FkYWxhLW9wdGlvbnMvb3B0aW9ucy1wYW5lbC5qc3gnKTtcclxuXHJcbnZhciBpdGVtID0ge1xyXG5cdG5hbWU6J01hcmF1ZGVyXFwncyBTcGluZScsXHJcblx0Y29sb3I6J2dyZWVuJyxcclxuXHRpbWFnZTonLy9tZWRpYS5ibGl6emFyZC5jb20vZDMvaWNvbnMvaXRlbXMvbGFyZ2UvdW5pcXVlX3Nob3VsZGVyX3NldF8wN194MV9kZW1vbmh1bnRlcl9tYWxlLnBuZycsXHJcblxyXG5cdHNsb3Q6J1Nob3VsZGVycycsXHJcblx0dHlwZTonU2V0IFNob3VsZGVycycsXHJcblx0Y2xhc3NTcGVjaWZpYzonRGVtb24gSHVudGVyJyxcclxuXHJcblx0Ly9hcm1vcjonNjA5JyxcclxuXHJcblx0d2VhcG9uOntcclxuXHRcdG1pbjonMTExMScsXHJcblx0XHRtYXg6JzQzMDAnLFxyXG5cdFx0c3BlZWQ6JzEuMScsXHJcblx0XHRkcHM6JzMxMDAnXHJcblx0fSxcclxuXHJcblx0cHJpbWFyaWVzOltcclxuXHR7XHJcblx0XHRuYW1lOic8c3Bhbj5EZXg8L3NwYW4+JyxcclxuXHRcdHZhbHVlOjk1NSxcclxuXHRcdGNvbG9yOidibHVlJ1xyXG5cdH0sXHJcblx0e1xyXG5cdFx0bmFtZTonVml0YWxpdHknLFxyXG5cdFx0dmFsdWU6NTU1LFxyXG5cdFx0Y29sb3I6J2JsdWUnXHJcblx0fSxcclxuXHR7XHJcblx0XHRuYW1lOidDb3N0IFJlZHVjdGlvbicsXHJcblx0XHR2YWx1ZTo4LFxyXG5cdFx0Y29sb3I6J29yYW5nZSdcclxuXHR9XHJcblx0XSxcclxuXHRzZWNvbmRhcmllczpbXSxcclxuXHRzb2NrZXQ6ZmFsc2VcclxuXHJcblxyXG59O1xyXG5cclxuUmVhY3QucmVuZGVyKFxyXG5cdDxPcHRpb25zUGFuZWwgLz4sXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4YW1wbGUnKVxyXG4pO1xyXG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBBcm1vciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcclxuXHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tYXJtb3Itd2VhcG9uIGl0ZW0tYXJtb3ItYXJtb3JcIj5cclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPVwiYmlnXCI+PHA+PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj57dGhpcy5wcm9wcy5hcm1vcn08L3NwYW4+PC9wPjwvbGk+XHJcblx0XHRcdFx0PGxpPkFybW9yPC9saT5cclxuXHRcdFx0PC91bD5cclxuXHJcblx0XHQpO1xyXG5cclxuXHR9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEFybW9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblx0RDNJdGVtVG9vbHRpcEFybW9yID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWFybW9yLmpzeCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBXZWFwb24gPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtd2VhcG9uLmpzeCcpLFxyXG5cdEQzSXRlbVRvb2x0aXBTdGF0ID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLXN0YXQuanN4Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcEJvZHkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGljb25DbGFzc2VzOidkMy1pY29uIGQzLWljb24taXRlbSBkMy1pY29uLWl0ZW0tbGFyZ2UnLFxyXG5cdFx0XHRpdGVtVHlwZUNsYXNzOidkMy1jb2xvci0nXHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly9kZWNsYXJlIGFycmF5cyBmb3IgcHJpbWFyeSBhbmQgc2Vjb25kYXJ5IGl0ZW0gZWZmZWN0cy4gXHJcblx0XHQvL0FuIGl0ZW0gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBvZiBlYWNoLlxyXG5cdFx0Ly9DcmVhdGUgdGhlIGxpc3QgaXRlbSBmb3IgZWFjaCBzdGF0IGFuZCBwdXNoIGluIHRoZSBhcnJheXNcclxuXHRcdHZhciBwcmltYXJpZXMgPSBmb3JFYWNoKHRoaXMucHJvcHMuaXRlbS5wcmltYXJpZXMpO1xyXG5cdFx0dmFyIHNlY29uZGFyaWVzID0gZm9yRWFjaCh0aGlzLnByb3BzLml0ZW0uc2Vjb25kYXJpZXMpO1xyXG5cclxuXHRcdC8vaW1hZ2UgdXNlZCBhcyBpbmxpbmUtc3R5bGUgZm9yIGl0ZW0gdG9vbHRpcHNcclxuXHRcdHZhciBpbWFnZSA9IHtiYWNrZ3JvdW5kSW1hZ2U6J3VybCgnK3RoaXMucHJvcHMuaXRlbS5pbWFnZSsnKSd9O1xyXG5cclxuXHRcdC8vaWYgc3BlY2lmaWVkLCBzZXQgY29sb3IgZm9yIHRvb2x0aXAgY29tcG9uZW50c1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5jb2xvcikge1xyXG5cdFx0XHR0aGlzLnByb3BzLmljb25DbGFzc2VzICs9ICcgZDMtaWNvbi1pdGVtLScrdGhpcy5wcm9wcy5pdGVtLmNvbG9yO1xyXG5cdFx0XHR0aGlzLnByb3BzLml0ZW1UeXBlQ2xhc3MgKz10aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly9pZiBpdCBpcyBhbiBhcm1vciBvciB3ZWFwb24gYWRkIGFkZGl0aW9uYWwgaW5mbyB0byBpY29uIHNlY3Rpb25cclxuXHRcdHZhciBzdWJIZWFkO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnYXJtb3InKSkge1xyXG5cdFx0XHRzdWJIZWFkID0gPEQzSXRlbVRvb2x0aXBBcm1vciBhcm1vcj17dGhpcy5wcm9wcy5pdGVtLmFybW9yfS8+O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbS5oYXNPd25Qcm9wZXJ0eSgnd2VhcG9uJykpIHtcclxuXHRcdFx0c3ViSGVhZCA9IDxEM0l0ZW1Ub29sdGlwV2VhcG9uIHdlYXBvbj17dGhpcy5wcm9wcy5pdGVtLndlYXBvbn0vPjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRvb2x0aXAtYm9keSBlZmZlY3QtYmcgZWZmZWN0LWJnLWFybW9yIGVmZmVjdC1iZy1hcm1vci1kZWZhdWx0XCI+XHJcblxyXG5cdFx0XHRcdHsvKlRoZSBpdGVtIGljb24gYW5kIGNvbnRhaW5lciwgY29sb3IgbmVlZGVkIGZvciBiYWNrZ3JvdW5kKi99XHJcblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPXt0aGlzLnByb3BzLmljb25DbGFzc2VzfT5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImljb24taXRlbS1ncmFkaWVudFwiPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJpY29uLWl0ZW0taW5uZXIgaWNvbi1pdGVtLWRlZmF1bHRcIiBzdHlsZT17aW1hZ2V9PlxyXG5cdFx0XHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImQzLWl0ZW0tcHJvcGVydGllc1wiPlxyXG5cclxuXHRcdFx0XHRcdHsvKlNsb3QgYW5kIGlmIGNsYXNzIHNwZWNpZmljKi99XHJcblx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS10eXBlLXJpZ2h0XCI+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cIml0ZW0tc2xvdFwiPnt0aGlzLnByb3BzLml0ZW0uc2xvdH08L2xpPlxyXG5cdFx0XHRcdFx0XHRcdDxsaSBjbGFzc05hbWU9XCJpdGVtLWNsYXNzLXNwZWNpZmljIGQzLWNvbG9yLXdoaXRlXCI+e3RoaXMucHJvcHMuaXRlbS5jbGFzc1NwZWNpZmljfTwvbGk+XHJcblx0XHRcdFx0XHQ8L3VsPlxyXG5cclxuXHRcdFx0XHRcdHsvKlJhcml0eSBvZiB0aGUgaXRlbSBhbmQvaWYgaXQgaXMgYW5jaWVudCovfVxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzTmFtZT1cIml0ZW0tdHlwZVwiPlxyXG5cdFx0XHRcdFx0XHQ8bGk+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPXt0aGlzLnByb3BzLml0ZW1UeXBlQ2xhc3N9Pnt0aGlzLnByb3BzLml0ZW0udHlwZX08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHQ8L3VsPlxyXG5cclxuXHRcdFx0XHRcdHsvKklmIHRoZSBpdGVtIGlzIGFybW9yIG9yIHdlYXBvbiwgdGhlIGtleSBpcyBkZWZpbmVkIGFuZCB3ZSBuZWVkIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIHRvb2x0aXAqL31cclxuXHRcdFx0XHRcdHtzdWJIZWFkfVxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1iZWZvcmUtZWZmZWN0c1wiPjwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdHsvKkFjdHVhbCBpdGVtIHN0YXRzKi99XHJcblx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1lZmZlY3RzXCI+XHJcblx0XHRcdFx0XHRcdDxwIGNsYXNzTmFtZT1cIml0ZW0tcHJvcGVydHktY2F0ZWdvcnlcIj5QcmltYXJ5PC9wPlxyXG5cdFx0XHRcdFx0XHR7cHJpbWFyaWVzfVxyXG5cdFx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJpdGVtLXByb3BlcnR5LWNhdGVnb3J5XCI+U2Vjb25kYXJ5PC9wPlxyXG5cdFx0XHRcdFx0XHR7c2Vjb25kYXJpZXN9XHJcblx0XHRcdFx0XHQ8L3VsPlxyXG5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0ZnVuY3Rpb24gZm9yRWFjaChzdGF0T2JqZWN0KSB7XHJcblx0XHR2YXIgcmVzdWx0cyA9IFtdO1xyXG5cclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3RhdE9iamVjdCk7XHJcblx0XHR2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKyspIHtcclxuXHRcdFx0dmFyIHN0YXQgPSBrZXlzW2ldO1xyXG5cdFx0XHR2YXIgdmFsID0gc3RhdE9iamVjdFtzdGF0XTtcclxuXHRcdFx0cmVzdWx0cy5wdXNoKDxEM0l0ZW1Ub29sdGlwU3RhdCB2YWx1ZT17dmFsfSBuYW1lPXtzdGF0fSBrZXk9e2l9IC8+KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHRzO1xyXG5cdH1cclxuXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcEJvZHk7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBEM0l0ZW1Ub29sdGlwSGVhZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vaW5pdGlhbCBjbGFzcyBzZXQgZm9yIHRoZSB0b29sdGlwIGhlYWRcclxuXHRcdHZhciBkaXZDbGFzcz0ndG9vbHRpcC1oZWFkJztcclxuXHRcdHZhciBoM0NsYXNzPScnO1xyXG5cclxuXHRcdC8vbW9kaWZ5IHRoZSBjbGFzc2VzIGlmIGEgY29sb3Igd2FzIHBhc3NlZFxyXG5cdFx0Ly9mYWxsYmFjayBjb2xvciBpcyBoYW5kbGVkIGJ5IGQzLXRvb2x0aXAgY3NzXHJcblx0XHRpZiAodGhpcy5wcm9wcy5pdGVtLmNvbG9yKSB7XHJcblx0XHRcdGRpdkNsYXNzICs9ICcgdG9vbHRpcC1oZWFkLScgKyB0aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHRcdGgzQ2xhc3MgKz0gJ2QzLWNvbG9yLScgKyB0aGlzLnByb3BzLml0ZW0uY29sb3I7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2RpdkNsYXNzfT5cclxuXHRcdFx0XHQ8aDMgY2xhc3NOYW1lPXtoM0NsYXNzfT5cclxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLml0ZW0ubmFtZX1cclxuXHRcdFx0XHQ8L2gzPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEQzSXRlbVRvb2x0aXBIZWFkOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcFN0YXQ9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgdGV4dDtcclxuXHJcblx0XHR0ZXh0ID0gPHA+PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj4re3RoaXMucHJvcHMudmFsdWV9PC9zcGFuPiB7dGhpcy5wcm9wcy5uYW1lfTwvcD47XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHJcblx0XHRcdDxsaSBjbGFzc05hbWU9XCJkMy1jb2xvci1ibHVlIGQzLWl0ZW0tcHJvcGVydHktZGVmYXVsdFwiPlxyXG5cdFx0XHRcdHt0ZXh0fVxyXG5cdFx0XHQ8L2xpPlxyXG5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwU3RhdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIEQzSXRlbVRvb2x0aXBXZWFwb249IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2PlxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS13ZWFwb24tZHBzXCI+XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT1cImJpZ1wiPjxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLmRwc308L3NwYW4+PC9saT5cclxuXHRcdFx0XHQ8bGk+RGFtYWdlIFBlciBTZWNvbmQ8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8dWwgY2xhc3NOYW1lPVwiaXRlbS1hcm1vci13ZWFwb24gaXRlbS13ZWFwb24gZGFtYWdlXCI+XHJcblx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0PHA+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cInZhbHVlXCI+e3RoaXMucHJvcHMud2VhcG9uLm1pbn08L3NwYW4+IC1cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwidmFsdWVcIj4ge3RoaXMucHJvcHMud2VhcG9uLm1heH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImQzLWNvbG9yLUZGODg4ODg4XCI+IERhbWFnZTwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvcD5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdDxsaT5cclxuXHRcdFx0XHRcdDxwPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJ2YWx1ZVwiPnt0aGlzLnByb3BzLndlYXBvbi5zcGVlZH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImQzLWNvbG9yLUZGODg4ODg4XCI+IEF0dGFja3MgcGVyIFNlY29uZDwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvcD5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblxyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEM0l0ZW1Ub29sdGlwV2VhcG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXHJcblxyXG5cdEQzSXRlbVRvb2x0aXBIZWFkID0gcmVxdWlyZSgnLi9kMy10b29sdGlwLWhlYWQuanN4JyksXHJcblx0RDNJdGVtVG9vbHRpcEJvZHkgPSByZXF1aXJlKCcuL2QzLXRvb2x0aXAtYm9keS5qc3gnKTtcclxuXHJcblxyXG52YXIgRDNJdGVtVG9vbHRpcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidG9vbHRpcC1jb250ZW50XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJkMy10b29sdGlwIGQzLXRvb2x0aXAtaXRlbVwiPlxyXG5cdFx0XHRcdFx0PEQzSXRlbVRvb2x0aXBIZWFkIGl0ZW09e3RoaXMucHJvcHMuaXRlbX0gLz5cclxuXHRcdFx0XHRcdDxEM0l0ZW1Ub29sdGlwQm9keSBpdGVtPXt0aGlzLnByb3BzLml0ZW19IC8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRDNJdGVtVG9vbHRpcDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIENsYXNzU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdC8vc3RhdGUgaXMgaGFuZGxlZCBpbiB0aGUgcGFyZW50IGNvbXBvbmVudFxyXG5cdC8vdGhpcyBmdW5jdGlvbiBpcyB1cCB0aGVyZVxyXG5cdGhhbmRsZUNsaWNrOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5jaGFuZ2VDbGFzcyh0aGlzLnByb3BzLm5hbWUpO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgYnV0dG9uQ2xhc3MgPSAnY2xhc3NTZWxlY3Rvcic7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCkge1xyXG5cdFx0XHRidXR0b25DbGFzcys9ICcgc2VsZWN0ZWQnXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGltYWdlQ2xhc3M9IHRoaXMucHJvcHMubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCcnKTtcclxuXHRcdGltYWdlQ2xhc3MrPSB0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxsaT5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxyXG5cdFx0XHRcdFx0PGltZyBzcmM9e3RoaXMucHJvcHMuaW1hZ2V9IGNsYXNzTmFtZT17aW1hZ2VDbGFzc30+PC9pbWc+XHJcblx0XHRcdFx0XHQ8c3Bhbj57dGhpcy5wcm9wcy5uYW1lLnRvTG93ZXJDYXNlKCl9PC9zcGFuPlxyXG5cdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2xpPlxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2xhc3NTZWxlY3RvckJ1dHRvbjsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgQ2xhc3NTZWxlY3RvckJ1dHRvbiA9IHJlcXVpcmUoJy4vY2xhc3Mtc2VsZWN0b3ItYnV0dG9uLmpzeCcpO1xyXG5cclxudmFyIENsYXNzU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkQ2xhc3NlcyA9IFsnQmFyYmFyaWFuJywnQ3J1c2FkZXInLCdEZW1vbiBIdW50ZXInLCdNb25rJywnV2l0Y2ggRG9jdG9yJywnV2l6YXJkJ107XHJcblx0XHR2YXIgZENsYXNzZXNMZW5ndGggPSBkQ2xhc3Nlcy5sZW5ndGg7XHJcblxyXG5cdFx0dmFyIGNsYXNzU2VsZWN0b3JzID0gW107XHJcblx0XHRmb3IgKHZhciBpID0wOyBpIDwgZENsYXNzZXNMZW5ndGg7aSsrKSB7XHJcblxyXG5cdFx0XHQvL2NoZWNrIGZvciBzZWxlY3RlZCBjbGFzcyBzdG9yZWQgaW4gc3RhdGUgb2YgdGhpcyBjb21wb25lbnRcclxuXHRcdFx0dmFyIHNlbGVjdGVkID0gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLnByb3BzLnNlbGVjdGVkID09PSBkQ2xhc3Nlc1tpXSkge1xyXG5cdFx0XHRcdHNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9wdXQgc2VsZWN0b3JzIGluIGFycmF5IHRvIGJlIHJlbmRlcmVkXHJcblx0XHRcdGNsYXNzU2VsZWN0b3JzLnB1c2goXHJcblx0XHRcdFx0PENsYXNzU2VsZWN0b3JCdXR0b24gXHJcblx0XHRcdFx0XHRuYW1lPXtkQ2xhc3Nlc1tpXX0gXHJcblx0XHRcdFx0XHRjaGFuZ2VDbGFzcz17dGhpcy5wcm9wcy5jaGFuZ2VDbGFzc30gXHJcblx0XHRcdFx0XHRrZXk9e2l9IFxyXG5cdFx0XHRcdFx0c2VsZWN0ZWQ9e3NlbGVjdGVkfVxyXG5cdFx0XHRcdFx0Z2VuZGVyPXt0aGlzLnByb3BzLmdlbmRlcn1cclxuXHRcdFx0XHRcdC8+XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+XHJcblx0XHRcdFx0PHVsIGNsYXNzTmFtZT0nY2xhc3NTZWxlY3Rvcic+XHJcblx0XHRcdFx0XHR7Y2xhc3NTZWxlY3RvcnN9XHJcblx0XHRcdFx0PC91bD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc1NlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHVwZGF0ZUdlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucHJvcHMuY2hhbmdlR2VuZGVyKHRoaXMucHJvcHMuZ2VuZGVyKTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGJ1dHRvbkNsYXNzPSdnZW5kZXItc2VsZWN0b3InO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcclxuXHRcdFx0YnV0dG9uQ2xhc3MrPSAnIHNlbGVjdGVkJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYnV0dG9uLXdyYXBwZXInPlxyXG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gb25DbGljaz17dGhpcy51cGRhdGVHZW5kZXJ9ID5cclxuXHRcdFx0XHRcdDxpbWcgLz5cclxuXHRcdFx0XHRcdDxzcGFuPnt0aGlzLnByb3BzLmdlbmRlci50b0xvd2VyQ2FzZSgpfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmRlclNlbGVjdG9yQnV0dG9uOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3JCdXR0b24gPSByZXF1aXJlKCcuL2dlbmRlci1zZWxlY3Rvci1idXR0b24uanN4Jyk7XHJcblxyXG52YXIgR2VuZGVyU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBtYWxlU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3RlZCA9PT0gJ01hbGUnKTtcclxuXHRcdHZhciBmZW1hbGVTZWxlY3RlZCA9ICh0aGlzLnByb3BzLnNlbGVjdGVkID09PSAnRmVtYWxlJyk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2dlbmRlci1zZWxlY3Rvcic+XHJcblx0XHRcdFx0PEdlbmRlclNlbGVjdG9yQnV0dG9uIGdlbmRlcj0nTWFsZScgY2hhbmdlR2VuZGVyPXt0aGlzLnByb3BzLmNoYW5nZUdlbmRlcn0gc2VsZWN0ZWQ9e21hbGVTZWxlY3RlZH0gLz5cclxuXHRcdFx0XHQ8R2VuZGVyU2VsZWN0b3JCdXR0b24gZ2VuZGVyPSdGZW1hbGUnIGNoYW5nZUdlbmRlcj17dGhpcy5wcm9wcy5jaGFuZ2VHZW5kZXJ9IHNlbGVjdGVkPXtmZW1hbGVTZWxlY3RlZH0gLz5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmRlclNlbGVjdG9yOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgSGFyZGNvcmVDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2hlY2tib3gtd3JhcHBlcic+XHJcblx0XHRcdFx0PGxhYmVsPlxyXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzc05hbWU9J29wdGlvbnMtY2hlY2tib3gnIC8+XHJcblx0XHRcdFx0XHRIYXJkY29yZSBIZXJvXHJcblx0XHRcdFx0PC9sYWJlbD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhcmRjb3JlQ2hlY2tib3g7IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBDbGFzc1NlbGVjdG9yID0gcmVxdWlyZSgnLi9jbGFzcy1zZWxlY3Rvci5qc3gnKTtcclxudmFyIEdlbmRlclNlbGVjdG9yID0gcmVxdWlyZSgnLi9nZW5kZXItc2VsZWN0b3IuanN4Jyk7XHJcbnZhciBTZWFzb25hbENoZWNrYm94ID0gcmVxdWlyZSgnLi9zZWFzb25hbC1jaGVja2JveC5qc3gnKTtcclxudmFyIEhhcmRjb3JlQ2hlY2tib3ggPSByZXF1aXJlKCcuL2hhcmRjb3JlLWNoZWNrYm94LmpzeCcpO1xyXG5cclxudmFyIE9wdGlvbnNQYW5lbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZENsYXNzOidCYXJiYXJpYW4nLFxyXG5cdFx0XHRnZW5kZXI6J0ZlbWFsZSdcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0Y2hhbmdlR2VuZGVyOmZ1bmN0aW9uKGdlbmRlcikge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGdlbmRlcjpnZW5kZXJcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGNoYW5nZUNsYXNzOmZ1bmN0aW9uKGRDbGFzcykge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGRDbGFzczpkQ2xhc3NcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGNsYXNzTmFtZT0nb3B0aW9ucy1wYW5lbCc+XHJcblx0XHRcdFx0PENsYXNzU2VsZWN0b3IgY2hhbmdlQ2xhc3M9e3RoaXMuY2hhbmdlQ2xhc3N9IHNlbGVjdGVkPXt0aGlzLnN0YXRlLmRDbGFzc30gZ2VuZGVyPXt0aGlzLnN0YXRlLmdlbmRlcn0vPlxyXG5cdFx0XHRcdDxHZW5kZXJTZWxlY3RvciBjaGFuZ2VHZW5kZXI9e3RoaXMuY2hhbmdlR2VuZGVyfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5nZW5kZXJ9Lz5cclxuXHRcdFx0XHQ8U2Vhc29uYWxDaGVja2JveCAvPlxyXG5cdFx0XHRcdDxIYXJkY29yZUNoZWNrYm94IC8+XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uc1BhbmVsOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgU2Vhc29uYWxDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2hlY2tib3gtd3JhcHBlcic+XHJcblx0XHRcdFx0PGxhYmVsPlxyXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzc05hbWU9J29wdGlvbnMtY2hlY2tib3gnIC8+XHJcblx0XHRcdFx0XHRTZWFzb25hbCBIZXJvXHJcblx0XHRcdFx0PC9sYWJlbD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXNvbmFsQ2hlY2tib3g7Il19
