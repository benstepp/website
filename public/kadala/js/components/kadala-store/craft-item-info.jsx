var React = require('react');

var AppActions = require('../../actions/AppActions');

var CraftItemInfo = React.createClass({
    render:function() {
        //return immediately a blank div if item is null
        if (this.props.item === null) {return <div></div>;}

        return (
            <div></div>
        );
    }
});

module.exports = CraftItemInfo;
