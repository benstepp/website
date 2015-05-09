var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AppActions = require('../../actions/AppActions');

var SimSelector = React.createClass({

	mixins: [PureRenderMixin],

    _handleChange:function() {
        var value = document.getElementById('sim-select').value;
        AppActions.changeSim(value);
    },

	render:function() {
		return (
            <div className='sim-select-wrap'>
			<select className='sim-select' id='sim-select' onChange={this._handleChange} value={this.props.current}>
	            <option value='Kadala'>Kadala</option>
                <option value='Crafting'>Crafting (experimental)</option>
			</select>
            </div>
	       	       );
	}
});

module.exports = SimSelector;
