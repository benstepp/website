var React = require('react');

var InventorySlot = React.createClass({
	render:function() {

		var slotContent= [];
		var slotClass='inventory-slot';
		//check to make sure an actual item is in the inventory slot
		if (typeof this.props.data !== 'undefined') {
			//change the size to large if it is a large item
			if(this.props.data.hasOwnProperty('size') && this.props.data.size === 2) {
				slotClass += ' large';
			}

			//set the background
			if (this.props.data.hasOwnProperty('image')) {
				var inline = {backgroundImage:'url('+this.props.data.image+')'};
				slotContent.push(<div style={inline} className='inventory-image'></div>);
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