var riftloot = require('./models/item.js');
var _ = require('lodash');

module.exports = function(router) {

	router.use(function(req, res, next) {
		next();
	});

	router.route('/expert/:lang')
		.get(function(req, res) {
			riftloot.find({"drop.tier":"expert"}, function(err, results) {
				if (err) {console.log(err);}
				if (req.params.lang === 'de') {
					res.json(_.chain(results).map(_.omit(["name_en","name_fr","onEquip.ability_en","onEquip.ability_fr"])));
				}
				else if (req.params.lang === 'en') {
					res.json(_.chain(results).map(_.omit(["name_de","name_fr","onEquip.ability_de","onEquip.ability_fr"])));
				}
				else if (req.param.lang === 'fr') {
					res.json(_.chain(results).map(_.omit(["name_de","name_en","onEquip.ability_de","onEquip.ability_en"])));
				}
				else {
					res.json({error:"API requires a language parameter of de/en/fr"});
				}
			});
		});


};				