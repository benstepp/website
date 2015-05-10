var React = require('react');

var InventorySlot = require('./inventory-slot.jsx');

var InventoryColumn = React.createClass({

    propTypes:{
        items:React.PropTypes.array,
        column:React.PropTypes.number
    },

    render: function() {
        var items = [];
        this.props.items.forEach(function(item) {
            items.push(<InventorySlot data={item} column={this.props.column} />);
        }.bind(this));

        return (
            <div className='inventory-column'>
                {items}
            </div>
        );
    }

});

module.exports = InventoryColumn;
