//Load the required base varables
var casper = require('casper').create();
var utils = require('utils');
var fs = require('fs');

//Arrays to store our item data
var glyphIds = [];
var glyphs = [];

/**
 * getGlyphList will parse the scraped DOM and will look for the links to the wowhead.com glyph item page.
 * It will the conintue to follow the pagination until we no longer have any more glyphs to pull from the website.
 */
function getGlyphList() {
	glyphIds = glyphIds.concat(
		this.evaluate(function() {
			var links = $('#lv-items > table > tbody > tr > td:nth-child(3) > div > a');
			return Array.prototype.map.call(links, function(e) {
				return e.getAttribute('href').replace('/item=','');
			});
		})
	);
	//Seeing if we have the "Next >" to click
	if(this.visible("#lv-items > div.listview-band-top > div.listview-nav > a:nth-child(4)")) {
		this.then(function(){
			//Keep clicking the "Next >" until we're out of glyphs!
			this.click("#lv-items > div.listview-band-top > div.listview-nav > a:nth-child(4)");
		});
		//Once we're done clicking we will need to parse the glyph table again
		this.then(getGlyphList);
	}
}

/**
 * Adds two numbers
 * @param {String} glyphId The unqiue World of Warcraft identifier
 * @return {Array} array Will return an array to be concactinated to our ongoing list of glyphs
 */
function parseItem(glyphId) {
	return [{
		itemId: glyphId,
		name: $('#main-contents h1').text(),
		reagentId: $('#tab-created-by-spell > table > tbody > tr > td:nth-child(4) > div > div:nth-child(2) > a').attr('href').replace('/item=',''),
		spellId: $('#tab-created-by-spell > table > tbody > tr > td:nth-child(3) > div > a').attr('href').replace('/spell=',''),
	}];
}

//Our beginning line
casper.start('http://www.wowhead.com/items=16?filter=eb=1#0-2', getGlyphList);

//Once we're done clicking "Next >" and getting all of the Glyph Ids we'll need to get the data about the actual glyph
casper.then(function() {
	casper.each(glyphIds, function(self, glyphId) {
		//Doing a wait here so we're not completely hammering their website. There will also be a built in cooldown from the page loading etc
		casper.wait(200, function() {
			self.thenOpen('http://www.wowhead.com/item='+glyphId, function() {
				this.echo("Parsing: " + this.getTitle().replace(' - Item - World of Warcraft',''));
				glyphs = glyphs.concat(this.evaluate(parseItem,glyphId));
			});
		});
	});
});

//Once we're all done with all the parsing, save it to a file in the relative directory
casper.then(function() {
	this.echo("We're all getting the glyph data, huzzah! Total Glyphs: " + glyphs.length);
	fs.write('glyphs.json',JSON.stringify(glyphs));
});

//Start the CasperJS script
casper.run();