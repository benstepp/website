var React = require('react');
var d3sim = require('d3sim');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AppActions = require('../../actions/AppActions');

var D3TooltipHead = require('../d3-tooltip/d3-tooltip-head.jsx');

var CraftItemInfo = React.createClass({

    mixins: [PureRenderMixin],

    _craftItem:function() {
        var item = d3sim.craftItem(this.props.item.slot, this.props.dClass, this.props.item.name);
        AppActions.addItem(item);
    },

    render:function() {
        //return immediately a blank div if item is null
        if (this.props.item === null) {return <div></div>;}

        var headerClass= 'craft-item-header';
        var color;
        if (this.props.item.hasOwnProperty('set')) {
            headerClass+= ' set';
            color = 'green';
        }
        else {
            headerClass+= ' legendary';
            color = 'orange';
        }
        return (
            <div>
                <div className='d3-tooltip d3-tooltip-item'>
                    <D3TooltipHead name={this.props.item.name} color={color} />
                </div>
                <button className='craft-item' onClick={this._craftItem}>Craft</button>
            </div>
        );
    }
});

module.exports = CraftItemInfo;
