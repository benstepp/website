var React = require('react');
var d3sim = require('d3sim');

var AppActions = require('../../actions/AppActions.js');
var AppStore = require('../../stores/AppStore.js');

var ClassSelector = require('./class-selector.jsx');
var GenderSelector = require('./gender-selector.jsx');
var SeasonalCheckbox = require('./seasonal-checkbox.jsx');
var HardcoreCheckbox = require('./hardcore-checkbox.jsx');

var OptionsPanel = React.createClass({

	getInitialState:function() {
		var initial = AppStore.getSettings();
		d3sim.setKadala(initial.dClass,initial.seasonal,initial.hardcore);
		return initial;
	},

	changeGender:function(gender) {
		this.setState({
			gender:gender
		});
		AppActions.changeSetting('gender',gender);
	},
	changeClass:function(dClass) {
		this.setState({
			dClass:dClass
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
			AppActions.changeSetting('dClass',dClass);
		});
	},
	changeHardcore:function(bool) {
		this.setState({
			hardcore:bool
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
			AppActions.changeSetting('hardcore',bool);
		});
	},
	changeSeasonal:function(bool) {
		this.setState({
			seasonal:bool
		},function() {
			d3sim.setKadala(this.state.dClass,this.state.seasonal,this.state.hardcore);
			AppActions.changeSetting('seasonal',bool);
		});
	},

	render:function() {
		return (
			<section className='options-panel' id='options-panel'>
				<ClassSelector changeClass={this.changeClass} selected={this.state.dClass} gender={this.state.gender}/>
				<GenderSelector changeGender={this.changeGender} selected={this.state.gender}/>
				<SeasonalCheckbox seasonal={this.state.seasonal} changeSeasonal={this.changeSeasonal}/>
				<HardcoreCheckbox hardcore={this.state.hardcore} changeHardcore={this.changeHardcore}/>
			</section>
		);
	}
});

module.exports = OptionsPanel;