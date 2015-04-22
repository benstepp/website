var React = require('react');

var InventoryContainer = require('./inventory-container.jsx');
var InventoryStore = require('../../stores/InventoryStore');

var Inventory = React.createClass({
	getInitialState: function() {
		return InventoryStore.getInventory();
	},
	componentDidMount: function() {
		InventoryStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		InventoryStore.removeChangeListener(this._onChange);
	},

	_onChange:function() {
		this.setState(InventoryStore.getInventory());
	},

	render:function() {
		return (
			<div className='inventory-section'>
				<InventoryContainer 
					inventory={this.state.currentInventory} 
					hasPrevious={typeof this.state.previousInventory !== 'undefined'} 
					hasNext={typeof this.state.nextInventory !== 'undefined'}
				/>
			</div>
		);
	}
});

module.exports = Inventory;