var React = require('react'),
	D3ItemTooltipArmor = require('./d3-tooltip-armor.jsx'),
	D3ItemTooltipWeapon = require('./d3-tooltip-weapon.jsx'),
	D3ItemTooltipStat = require('./d3-tooltip-stat.jsx');

var D3ItemTooltipBody = React.createClass({
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
		var subHead = [];
		console.log(this.props.item);
		if (this.props.item.armor) {
			subHead.push(<D3ItemTooltipArmor armor={this.props.item.armor}/>);
		}
		if (this.props.item.weapon) {
			subHead.push(<D3ItemTooltipWeapon weapon={this.props.item.weapon}/>);
		}

		return (
			<div className="tooltip-body effect-bg effect-bg-armor effect-bg-armor-default">

				{/*The item icon and container, color needed for background*/}
				<span className={this.props.iconClasses}>
					<span className="icon-item-gradient">
						<span className="icon-item-inner icon-item-default" style={image}>
						</span>
					</span>
				</span>

				<div className="d3-item-properties">

					{/*Slot and if class specific*/}
					<ul className="item-type-right">
							<li className="item-slot">{this.props.item.slot}</li>
							<li className="item-class-specific d3-color-white">{this.props.item.classSpecific}</li>
					</ul>

					{/*Rarity of the item and/if it is ancient*/}
					<ul className="item-type">
						<li>
							<span className={this.props.itemTypeClass}>{this.props.item.type}</span>
						</li>
					</ul>

					{/*If the item is armor or weapon, the key is defined and we need more information on the tooltip*/}
					{subHead}

					<div className="item-before-effects"></div>

					{/*Actual item stats*/}
					<ul className="item-effects">
						<p className="item-property-category">Primary</p>
						{primaries}
						<p className="item-property-category">Secondary</p>
						{secondaries}
					</ul>

				</div>

			</div>
		);

	function forEach(statObject) {
		var results = [];

		var keys = Object.keys(statObject);
		var length = keys.length;

		for (var i = 0; i < length; i ++) {
			var stat = keys[i];
			var val = statObject[stat];
			results.push(<D3ItemTooltipStat value={val} name={stat} />);
		}
		return results;
	}

	}
});

module.exports = D3ItemTooltipBody;