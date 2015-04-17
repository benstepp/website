var React = require('react');

var HardcoreCheckbox = React.createClass({
	render:function() {
		return (
			<div className='checkbox-wrapper'>
				<label>
					<input type='checkbox' className='options-checkbox' />
					<span className='checkbox-label'>Hardcore Hero</span>
				</label>
			</div>
		);
	}
});

module.exports = HardcoreCheckbox;