var React = require('react');

var HardcoreCheckbox = React.createClass({
	updateHardcore:function(){
		this.props.changeHardcore(!this.props.hardcore);
	},

	render:function() {
		return (
			<div className='checkbox-wrapper'>
				<label>
					<input type='checkbox' className='options-checkbox' checked={this.props.hardcore} onChange={this.updateHardcore}/>
					<span className='checkbox-label'>Hardcore <span className='hidden-sm'>Hero</span></span>
				</label>
			</div>
		);
	}
});

module.exports = HardcoreCheckbox;