var React = require('react');

var InventoryStore = require('../../stores/InventoryStore');

var ItemLeft = require('./item-left.jsx');
var ItemRight = require('./item-right.jsx');
var D3ItemTooltip = require('../d3-tooltip/d3-tooltip.jsx');

var IndividualItem = React.createClass({

	getInitialState:function() {
		return {item:InventoryStore.getItem()};
	},

	render:function() {

		//only show tooltips/buttons if they are needed
		var tooltip;
		var hiddenButtons = 'hidden';
		if (typeof this.state.item !== 'undefined') {
			tooltip = <div className='tooltip-container'><D3ItemTooltip item={this.state.item}/></div>;
			hiddenButtons = '';
		}

		return (
			<div>
				<div className='row'>
					<div className='col-xs-1'>
						<ItemLeft hideClass={hiddenButtons} />
					</div>
					<div className='col-xs-10'>
						{tooltip}
					</div>
					<div className='col-xs-1'>
						<ItemRight hideClass={hiddenButtons} />
					</div>
				</div>
			</div>
		);
	}
});

module.exports = IndividualItem;