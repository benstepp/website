var React = require('react');

var SeasonalCheckbox = React.createClass({
	render:function() {
		return (
			<div className='checkbox-wrapper'>
				<label>
					<input type='checkbox' className='options-checkbox' />
					Seasonal Hero
				</label>
			</div>
		);
	}
});

module.exports = SeasonalCheckbox;