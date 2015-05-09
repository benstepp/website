var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var GenderSelectorButton = require('./gender-selector-button.jsx');

var GenderSelector = React.createClass({

	propTypes:{
		changeGender:React.PropTypes.func,
		selected:React.PropTypes.string
	},

	mixins: [PureRenderMixin],

	render:function() {

		var maleSelected = (this.props.selected === 'Male');
		var femaleSelected = (this.props.selected === 'Female');

		return (
			<div className='gender-selector'>
				<GenderSelectorButton gender='Male' changeGender={this.props.changeGender} selected={maleSelected} />
				<GenderSelectorButton gender='Female' changeGender={this.props.changeGender} selected={femaleSelected} />
			</div>
		);
	}
});

module.exports = GenderSelector;