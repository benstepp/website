var React = require('react');

var GenderSelectorButton = require('./gender-selector-button.jsx');

var GenderSelector = React.createClass({

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