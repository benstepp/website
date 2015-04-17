var React = require('react');

var ClassSelector = require('./class-selector.jsx');
var GenderSelector = require('./gender-selector.jsx');
var SeasonalCheckbox = require('./seasonal-checkbox.jsx');
var HardcoreCheckbox = require('./hardcore-checkbox.jsx');

var OptionsPanel = React.createClass({

	getInitialState:function() {
		return {
			dClass:'Barbarian',
			gender:'Female'
		};
	},

	changeGender:function(gender) {
		this.setState({
			gender:gender
		});
	},

	changeClass:function(dClass) {
		this.setState({
			dClass:dClass
		});
	},

	render:function() {
		return (
			<section className='options-panel'>
				<ClassSelector changeClass={this.changeClass} selected={this.state.dClass} gender={this.state.gender}/>
				<GenderSelector changeGender={this.changeGender} selected={this.state.gender}/>
				<SeasonalCheckbox />
				<HardcoreCheckbox />
			</section>
		);
	}
});

module.exports = OptionsPanel;