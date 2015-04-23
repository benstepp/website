var React = require('react');

var ClassSelectorButton = React.createClass({

	//state is handled in the parent component
	//this function is up there
	handleClick:function() {
		this.props.changeClass(this.props.name);
	},

	render:function() {

		var shortenedNames = {
			Barbarian:'barb',
			Crusader:'crus',
			'Demon Hunter':'dh',
			Monk:'monk',
			'Witch Doctor':'wd',
			Wizard:'wiz'
		}

		var buttonClass = 'class-selector';
		if (this.props.selected) {
			buttonClass+= ' selected'
		}

		var imageClass= this.props.name.toLowerCase().replace(' ','');
		imageClass+= this.props.gender.toLowerCase();

		return (
			<li>
				<button className={buttonClass} onClick={this.handleClick}>
					<div className={imageClass}></div>
					<span>{this.props.name.toLowerCase()}</span>
					<span className="shortened">{shortenedNames[this.props.name]}</span>
				</button>
			</li>
		);
	}

});

module.exports = ClassSelectorButton;