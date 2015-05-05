var React = require('react');

var AppActions = require('../../actions/AppActions');

var SimSelector = React.createClass({
    _handleChange:function() {
        var value = document.getElementById('sim-select').value;
        AppActions.changeSim(value);
    },

	render:function() {
		return (
            <div className='sim-select-wrap'>
			<select className='sim-select' id='sim-select' onChange={this._handleChange}>
	            <option value='Kadala'>Kadala</option>
                <option value='Crafting'>Crafting</option>
			</select>
            </div>
	       	       );
	}
});

module.exports = SimSelector;
