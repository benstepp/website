var React = require('react');

var SeasonalCheckbox = React.createClass({
	render:function() {
		return (
			<div className='checkbox-wrapper'>
				<label>
					<input type='checkbox' className='options-checkbox' />
					<span className='checkbox-label'>Seasonal <span className='hidden-sm'>Hero</span></span>
				</label>
			</div>
		);
	}
});

module.exports = SeasonalCheckbox;