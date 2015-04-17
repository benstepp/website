var React = require('react');

var ClassSelectorButton = React.createClass({

	//state is handled in the parent component
	//this function is up there
	handleClick:function() {
		this.props.changeClass(this.props.name);
	},

	render:function() {

		var buttonClass = 'classSelector';
		if (this.props.selected) {
			buttonClass+= ' selected'
		}

		var imageClass= this.props.name.toLowerCase().replace(' ','');
		imageClass+= this.props.gender.toLowerCase();

		return (
			<li>
				<button className={buttonClass} onClick={this.handleClick}>
					<img src={this.props.image} className={imageClass}></img>
					<span>{this.props.name.toLowerCase()}</span>
				</button>
			</li>
		);
	}

});

module.exports = ClassSelectorButton;