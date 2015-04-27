var React = require('react');

var ClassSelectorButton = React.createClass({

	propTypes:{
		changeClass:React.PropTypes.func,
		gender:React.PropTypes.string,
		name:React.PropTypes.string,
		selected:React.PropTypes.bool
	},

	_handleClick:function() {
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
				<button className={buttonClass} onClick={this._handleClick}>
					<div className={imageClass}></div>
					<span>{this.props.name.toLowerCase()}</span>
					<span className="shortened">{shortenedNames[this.props.name]}</span>
				</button>
			</li>
		);
	}

});

module.exports = ClassSelectorButton;