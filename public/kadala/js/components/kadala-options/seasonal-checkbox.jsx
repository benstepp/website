var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var SeasonalCheckbox = React.createClass({

	propTypes:{
		changeSeasonal:React.PropTypes.func,
		seasonal:React.PropTypes.bool
	},

	mixins: [PureRenderMixin],

	_updateSeasonal:function() {
		this.props.changeSeasonal(!this.props.seasonal);
	},

	render:function() {
		return (
			<div className='checkbox-wrapper'>
				<label>
					<input type='checkbox' className='options-checkbox' checked={this.props.seasonal} onChange={this._updateSeasonal}/>
					<span className='checkbox-label'>Seasonal <span className='hidden-sm'>Hero</span></span>
				</label>
			</div>
		);
	}
});

module.exports = SeasonalCheckbox;