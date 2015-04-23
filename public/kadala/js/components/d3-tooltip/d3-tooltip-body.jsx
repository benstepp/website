var React = require('react'),
	D3ItemTooltipArmor = require('./d3-tooltip-armor.jsx'),
	D3ItemTooltipWeapon = require('./d3-tooltip-weapon.jsx'),
	D3ItemTooltipStat = require('./d3-tooltip-stat.jsx');

var D3ItemTooltipBody = React.createClass({

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
			subHead = <D3ItemTooltipArmor armor={this.props.item.armor}/>;
		}
		if (this.props.item.hasOwnProperty('weapon')) {
			subHead = <D3ItemTooltipWeapon weapon={this.props.item.weapon}/>;
		}

		//if sockets are needed
		var sockets = [];
		var socketKey = 0;
		if (this.props.item.primaries.hasOwnProperty('Socket')) {
			for (var i =0; i < this.props.item.primaries.Socket.value; i++) {
				sockets.push(<li className='empty-socket d3-color-blue' key={socketKey} >Empty Socket</li>);
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
			<div className="tooltip-body effect-bg effect-bg-armor effect-bg-armor-default">

				{/*The item icon and container, color needed for background*/}
				<span className={iconClasses}>
					<span className="icon-item-gradient">
						<span className="icon-item-inner icon-item-default" style={image}>
						</span>
					</span>
				</span>

				<div className="d3-item-properties">

					{/*Slot and if class specific*/}
					<ul className="item-type-right">
							<li className="item-slot">{this.props.item.slot.charAt(0).toUpperCase() + this.props.item.slot.slice(1)}</li>
							<li className="item-class-specific d3-color-white">{this.props.item.classSpecific}</li>
					</ul>

					{/*Rarity of the item and/if it is ancient*/}
					<ul className="item-type">
						<li>
							<span className={itemTypeClass}>{itemTypePrefix} {this.props.item.type}</span>
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
						{sockets}
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
			results.push(<D3ItemTooltipStat stat={val} key={i} />);
		}
		return results;
	}

	}
});

module.exports = D3ItemTooltipBody;