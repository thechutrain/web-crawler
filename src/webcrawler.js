const axios = require('axios');
const cheerio = require('cheerio');

const MAX_DEPTH = 0;
const KEY_WORD = 'hamburger';
let global_count = 0;

// TODO - replace this with prompter
// adds in the ability to get info from a specific url
const args = process.argv.slice(2);
// const url = args[0] || 'https://en.wikipedia.org/wiki/Two%27s_complement';

/** ----- searchWikiPages -------
 * given a topic name, makes a request to wikipedia, parses page
 * and returns a json object with the most important text
 *
 * @param {string} title
 * @return {Promise} jsonData of the webpage
 */
//#region searchWikiPages

const url_list = [
	{
		url: 'https://en.wikipedia.org/wiki/hotdog',
		depth: 0,
	},
];

function searchWikiPages(links = url_list) {
	links.forEach(function(urlObj) {
		if (urlObj.depth <= MAX_DEPTH) {
			let axiosPromise = new Promise((resolve, reject) => {
				axios.get(urlObj.url).then(response => {
					let newDepth = urlObj.depth + 1;
					const links = parseWikiPage(response.data, newDepth);
					searchWikiPages(links);
					console.log(global_count);
				});
			});
		}
	});
}
//#endregion

/**
 *
 * @param {string} htmlDOM
 * @return {object} wikiContent
 */
//#region parseWikiPage
function parseWikiPage(htmlDOM, depth) {
	const $ = cheerio.load(htmlDOM);
	const contentChildren = $('#mw-content-text .mw-parser-output').children();
	const links = [];
	const wikiHostUrl = 'https://en.wikipedia.org/';

	let linksFound = contentChildren.find('a').length;
	console.log(`For depth of ${depth} found ${linksFound} link(s)`);

	contentChildren.find('a').each((index, element) => {
		let href = $(element).attr('href');
		links.push({
			url: `${wikiHostUrl}${href}`,
			depth: depth,
		});
	});

	let pageContent = $.text();
	const regex = /frankfurter/gi;
	let count = (pageContent.match(regex) || []).length;
	global_count += count;

	return links.splice(0, 10);
}
//#endregion

// --------- TESTING ------------
// tests that you can make a request to page & prints data
// const url = args[0];
searchWikiPages(url_list);
