var item = {
	name:'Marauder\'s Spine',
	color:'green',

	slot:'Shoulders',
	type:'Set Shoulders',
	classSpecific:'Demon Hunter',

	armor:'609',

};

React.render(
	<D3ItemTooltip item={item} />,
	document.getElementById('example')
);