var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var D3ItemTooltipWeapon= React.createClass({

	propTypes:{
		damageRange:React.PropTypes.array,
		speed:React.PropTypes.number,
		weaponDps:React.PropTypes.number
	},

	mixins: [PureRenderMixin],

	render: function() {
		return (
			<div>
			<ul className="item-armor-weapon item-weapon-dps">
				<li className="big"><span className="value">{Math.round( this.props.weaponDps * 10 ) / 10}</span></li>
				<li>Damage Per Second</li>
			</ul>
			<ul className="item-armor-weapon item-weapon damage">
				<li>
					<p>
						<span className="value">{this.props.damageRange[0]}</span> -
						<span className="value"> {this.props.damageRange[1]}</span>
						<span className="d3-color-FF888888"> Damage</span>
					</p>
				</li>
				<li>
					<p>
						<span className="value">{this.props.speed.toFixed(2)}</span>
						<span className="d3-color-FF888888"> Attacks per Second</span>
					</p>
				</li>
			</ul>
			</div>
		);
	}
});

module.exports = D3ItemTooltipWeapon;