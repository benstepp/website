var React = require('react');
var ClassSelectorButton = require('./class-selector-button.jsx');

var ClassSelector = React.createClass({
	getInitialState: function() {
		return {selected:'Barbarian'};
	},

	//updates the selected d3 class
	updateClass:function(dClass) {
		this.setState({
			selected:dClass
		});
	},

	render:function() {
		var dClasses = ['Barbarian','Crusader','Demon Hunter','Monk','Witch Doctor','Wizard'];
		var dClassesLength = dClasses.length;

		var classSelectors = [];
		for (var i =0; i < dClassesLength;i++) {

			//check for selected class stored in state of this component
			var selected = false;
			if (this.state.selected === dClasses[i]) {
				selected = true;
			}

			//put selectors in array to be rendered
			classSelectors.push(
				<ClassSelectorButton name={dClasses[i]} updateClass={this.updateClass} key={i} selected={selected}/>
			);
		}


		return (
			<div>
				<ul className='classSelector'>
					{classSelectors}
				</ul>
			</div>
		);

	}
});

module.exports = ClassSelector;