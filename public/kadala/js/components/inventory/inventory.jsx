var React = require('react');

var InventoryContainer = require('./inventory-container.jsx');

var Inventory = React.createClass({
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
			<div>
				<div className='col-sm-1'></div>
				<InventoryContainer inventory={this.state.currentInventory}/>
			</div>
		);
	}
});

module.exports = Inventory;