var React = require('react');

var SeasonalCheckbox = React.createClass({
	updateSeasonal:function() {
		this.props.changeSeasonal(!this.props.seasonal);
	},

	render:function() {
		return (
			<div className='checkbox-wrapper'>
				<label>
					<input type='checkbox' className='options-checkbox' checked={this.props.seasonal} onChange={this.updateSeasonal}/>
					<span className='checkbox-label'>Seasonal <span className='hidden-sm'>Hero</span></span>
				</label>
			</div>
		);
	}
});

module.exports = SeasonalCheckbox;