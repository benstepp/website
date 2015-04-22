var React = require('react');

var InventorySlot = React.createClass({
	render:function() {

		var slotContent= [];
		var slotClass='inventory-slot';
		//check to make sure an actual item is in the inventory slot
		if (typeof this.props.data !== 'undefined') {
			if(this.props.data.hasOwnProperty('size') && this.props.data.size === 2) {
				slotClass += ' large';
			}
		}

		return (
			<div className={slotClass}>
				{slotContent}
			</div>
		);
	}
});

module.exports = InventorySlot;