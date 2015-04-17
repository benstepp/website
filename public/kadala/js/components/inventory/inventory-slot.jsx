var React = require('react');

var InventorySlot = React.createClass({
	render:function() {

		var slotContent= [];

		//check to make sure an actual item is in the inventory slot
		if (typeof this.props.data !== 'undefined') {

		}

		return (
			<div className='inventory-slot'>
				{slotContent}
			</div>
		);
	}
});

module.exports = InventorySlot;