var React = require('react');

var InventorySlot = require('./inventory-slot.jsx');

var BlankInventory = React.createClass({

    render: function() {
        var slots = [];
        for (var i = 0; i < 60; i++) {
            slots.push(<InventorySlot data={undefined} column={0} />);
        }

        return (
            <div className='blank-inventory'>
                {slots}
            </div>
        );
    }

});

module.exports = BlankInventory;
