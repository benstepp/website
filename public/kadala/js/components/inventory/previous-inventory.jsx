var React = require('react');

var PreviousInventory = React.createClass({
	render:function() {

		var buttonClass = 'inventory-button';
		if (!this.props.hasPrevious) {
			buttonClass+= ' disabled';
		}

		return (
			<div className='inventory-button-container'>
				<button className={buttonClass}>
					{/*From Material Design icons by Google (CC by 4.0)*/}
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
						<path d="M23.12 11.12L21 9l-9 9 9 9 2.12-2.12L16.24 18z"/>
					</svg>
				</button>
			</div>
		);
	}
});

module.exports = PreviousInventory;