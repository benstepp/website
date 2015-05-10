var React = require('react');

var BlankInventory = require('./blank-inventory.jsx');
var InventoryColumn = require('./inventory-column.jsx');
var NextInventory = require('./next-inventory.jsx');
var PreviousInventory = require('./previous-inventory.jsx');

var InventoryContainer = React.createClass({

	propTypes:{
		hasNext:React.PropTypes.bool,
		hasPrevious:React.PropTypes.bool,
		inventory:React.PropTypes.array
	},

	render:function() {

        var inventoryColumns = [];
		var key=0;

        for (var i = 0; i < 10; i++) {
            inventoryColumns.push(<InventoryColumn items={this.props.inventory[i]} column={i} />);
        }

		return (
			<div className='inventory-container'>
				<PreviousInventory hasPrevious={this.props.hasPrevious}/>
                <div className='inventory-wrap'>
                    <div className='filled-inventory'>
                        {inventoryColumns}
                    </div>
                    <BlankInventory />
                </div>
				<NextInventory hasNext={this.props.hasNext}/>
			</div>
		);
	}
});

module.exports = InventoryContainer
