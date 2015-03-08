var React = require('react');

var D3ItemTooltipWeapon= React.createClass({

	render: function() {

		return (
			<div>
			<ul className="item-armor-weapon item-weapon-dps">
				<li className="big"><span className="value">{this.props.weapon.dps}</span></li>
				<li>Damage Per Second</li>
			</ul>
			<ul className="item-armor-weapon item-weapon damage">
				<li>
					<p>
						<span className="value">{this.props.weapon.min}</span> -
						<span className="value"> {this.props.weapon.max}</span>
						<span className="d3-color-FF888888"> Damage</span>
					</p>
				</li>
				<li>
					<p>
						<span className="value">{this.props.weapon.speed}</span>
						<span className="d3-color-FF888888"> Attacks per Second</span>
					</p>
				</li>
			</ul>
			</div>
		);

	}

});

module.exports = D3ItemTooltipWeapon;