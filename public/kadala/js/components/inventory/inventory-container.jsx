var React = require('react');

var InventorySlot = require('./inventory-slot.jsx');

var InventoryContainer = React.createClass({
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
					inventorySlots.push(<InventorySlot data={this.props.inventory[i][j]} key={key}/>)
					key++;
				}
			}

			//now fill in the rest of the column with blank spaces
			while(heightCount < 6) {
				heightCount++;
				inventorySlots.push(<InventorySlot data={undefined} key={key}/>);
				key++;
			}


		}

		return (
			<div className='inventory-container'>
				{inventorySlots}
			</div>
		);
	}
});

module.exports = InventoryContainer