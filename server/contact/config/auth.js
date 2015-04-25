//using gmail authentication so you put your address here
//when launching the app use your gmail password as the first argument

var authConfig = {
	user:"YOUR_GMAIL_ADDRESS",
};

if (process.argv[2]) {
	authConfig.pass=process.argv[2];
}

module.exports = authConfig;