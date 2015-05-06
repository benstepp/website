var React = require('react');

var CraftingItem = React.createClass({

    _handleClick:function() {
    
    },

    render:function() {
        return (
            <li onClick={this._handleClick}>{this.props.item.name}</li>
        );
    }
});

module.exports = CraftingItem;
