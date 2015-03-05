var D3ItemTooltipBody = React.createClass({
	getDefaultProps: function() {
		return {
			iconClasses:'d3-icon d3-icon-item d3-icon-item-large',
			itemTypeClass:'d3-color-'
		};
	},

	render: function() {

		//image used as inline-style for item tooltips
		var image = {backgroundImage:'url(http://media.blizzard.com/d3/icons/items/large/unique_shoulder_set_07_x1_demonhunter_male.png)'};

		//if specified, set color for tooltip components
		if (this.props.item.color) {
			this.props.iconClasses += ' d3-icon-item-'+this.props.item.color;
			this.props.itemTypeClass +=this.props.item.color;
		}

		return (
			<div className="tooltip-body effect-bg effect-bg-armor effect-bg-armor-default">

				<span className={this.props.iconClasses}>
					<span className="icon-item-gradient">
						<span className="icon-item-inner icon-item-default" style={image}>
						</span>
					</span>
				</span>

				<div className="d3-item-properties">
					<ul className="item-type-right">
							<li className="item-slot">{this.props.item.slot}</li>
							<li className="item-class-specific d3-color-white">{this.props.item.classSpecific}</li>
					</ul>

					<ul className="item-type">
						<li>
							<span className={this.props.itemTypeClass}>{this.props.item.type}</span>
						</li>
					</ul>

					<ul className="item-armor-weapon item-armor-armor">
						<li className="big"><p><span className="value">{this.props.item.armor}</span></p></li>
						<li>Armor</li>
					</ul>
				</div>

				<div className="item-before-effects"></div>
			</div>
		);

	}
});