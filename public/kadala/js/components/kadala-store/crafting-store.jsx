var React = require('react');
var d3sim = require('d3sim');

var AppStore = require('../../stores/AppStore');

var CraftingSlotBlock = require('./crafting-slot-block.jsx');
var CraftItemInfo = require('./craft-item-info.jsx');

var CraftingStore = React.createClass({

    getInitialState:function() {
        return AppStore.getSettings();
    },

    componentWillMount:function() {
        AppStore.addChangeListener(this._onChange);
    },
    componentWillUnmount:function() {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange:function() {
        this.setState(AppStore.getSettings());
    },

    render:function() {

        var craftables = d3sim.getCraftable(this.props.dClass);
        var craftSlots = [];
        var key = 0;

        for (var slot in craftables){
            craftSlots.push(<CraftingSlotBlock key={key} slot={slot} items={craftables[slot]}/>);
            key++;
        }


        return (
            <div className='crafting-store'>
                <div className='row'>
                    <div className='col-sm-6'>
                        <div className='crafting-list'>
                            {craftSlots}
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <CraftItemInfo item={this.state.craftItem} dClass={this.state.dClass} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CraftingStore;
