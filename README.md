Glyphy
======
Glyphy is a basic [CasperJS](http://casperjs.org/) web scraping script built to parse the http://wowhead.com website and get data about glyphs. The purpose was to build a JSON structure of glyphs in a known and parseable format.

The script will behave in the following sense. 

1. Load http://www.wowhead.com/items=16?filter=eb=1#0-2
2. Scrape the table of 50 glyphs for their item identifiers
3. Click, the "Next", link to follow the pagination
4. It will then parse the next 50 identifiers on each page until it no longer finds the "Next" pagenation
5. Will then go through the previously stored identifiers and load each glyph's item page to retrieve data about said glyph
6. Output, a local file, called glyphs.json

You can then use the list of the glyph data to your needs!

I would imagine this would be relatively easy to extend to other items you would just need to use the CSS paths to find the corresponding DOM elements.
