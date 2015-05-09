var React = require('react');

var CraftingItem = require('./crafting-item.jsx');

var CraftingSlotBlock = React.createClass({
    render:function() {

        var slotMap = {
            onehand:'One Handed',
            twohand:'Two Handed'
        };

        var readable;
        if (slotMap.hasOwnProperty(this.props.slot)) {
            readable = slotMap[this.props.slot];
        }
        else {
            readable = this.props.slot.charAt(0).toUpperCase() + this.props.slot.slice(1);
        }



        var lis = [];
        var slotLength = this.props.items.length;
        for (var i =0; i < slotLength; i++) {
            lis.push(<CraftingItem item={this.props.items[i]} slot={this.props.slot} key={i}/>);
        }

        //hide the group is there are no items for this slot
        var ulClass = '';
        if (slotLength === 0) {
            ulClass+= 'hidden';
        }

        return (
            <ul className={ulClass}>
                <li className='crafting-title'>{readable}</li>
                {lis}
            </ul>
        );
    }
});

module.exports = CraftingSlotBlock;
