#website
I'm learning how to make a website. 

This site is currently hosted at: http://fightingdragonswithtaylorswift.com


####Getting Started
Requires nodejs, mongodb, npm, node-gyp, bower, and gulp. These all have their own dependencies. Look them up.

#####Install dependencies
Simple with the package managers.
```bash
$ npm install
$ bower install
```

#####Setting up the server
Riftevents is simple just run the following from the base directory. 
```bash
$ node server/riftevents/db/db.js
```

Riftloot requires the Items.xml from Trion to be put into the /dev folder. Please excuse the lack of linux skills. Get the most recent from ftp://ftp.trionworlds.com/rift/data/.

```bash
$ cd dev
$ wget ftp://ftp.trionworlds.com/rift/data/Rift_Discoveries_2015-1-2.zip
$ unzip Rift_Discoveries_2015-1-2.zip
$ cd ..
$ node server/riftloot/db/db.js
```

Steam requires a Steam API key. You can get one at http://steamcommunity.com/dev/. Edit the server/steam/config/ApiKey.json with your key.

#####Build the Front End
I split it up into different files so you can update one project without updating the others. Save bandwidth that way if nothing has changed. Run one or more of the following from the base directory to build that particular project.
```bash
$ gulp index
$ gulp killingfloor
$ gulp riftevents
$ gulp riftloot
```

#####Start the Server
```bash
$ node server
```
You can now visit the site on port 3000. I'm using nginx and a proxy-pass with some proxy caching to serve the website.