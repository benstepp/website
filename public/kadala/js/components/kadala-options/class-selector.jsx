var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var ClassSelectorButton = require('./class-selector-button.jsx');

var ClassSelector = React.createClass({

	propTypes:{
		changeClass:React.PropTypes.func,
		gender:React.PropTypes.string,
		selected:React.PropTypes.string
	},

	mixins: [PureRenderMixin],

	render:function() {

		var dClasses = ['Barbarian','Crusader','Demon Hunter','Monk','Witch Doctor','Wizard'];
		var dClassesLength = dClasses.length;

		var classSelectors = [];
		for (var i =0; i < dClassesLength;i++) {

			//check for selected class stored in state of this component
			var selected = (this.props.selected === dClasses[i]);

			//put selectors in array to be rendered
			classSelectors.push(
				<ClassSelectorButton 
					name={dClasses[i]} 
					changeClass={this.props.changeClass} 
					key={i} 
					selected={selected}
					gender={this.props.gender}
					/>
			);
		}

		return (
			<div>
				<ul className='class-selector'>
					{classSelectors}
				</ul>
			</div>
		);
	}
});

module.exports = ClassSelector;