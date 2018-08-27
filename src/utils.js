const cheerio = require('cheerio');
const DEBUGGING = true;
const KEY_WORD = 'frankfurter';
let global_count = 0;

/** ===== parseWikiPage() =====
 *
 * @param {string} htmlDOM
 * @param {object} overload - depth, base url
 * @return {array} links
 */
function parsePage(htmlDOM, overload = {}) {
	const $ = cheerio.load(htmlDOM);
	const aTags = $('a');
	const links = [];
	const depth = overload.depth || 0;
	const baseUrl = overload.baseUrl;

	if (DEBUGGING) {
		console.log(`For depth of ${depth} found ${aTags.length} link(s)`);
	}

	// Find all embedded links on current page
	aTags.each((index, element) => {
		let href = $(element).attr('href');
		links.push({
			url: `${href}`,
			depth: depth,
		});
	});

	// Look for any occurances of our key word
	// TODO - searchPageForText()

	return DEBUGGING ? links.splice(0, 10) : links;
}

/**
 *
 * @param {string} htmlStr
 * @param {string} key_word
 * @return {number} occurances
 */
function searchPageForText(htmlStr, key_word) {
	// EDGE CASE: what if you have a class or id name some hidden attr
	// that matched the key_word?
	const pageContent = cheerio.load(htmlStr).text();
	const regex = new RegExp(key_word, 'gi');

	return (pageContent.match(regex) || []).length;
}

module.exports = {
	parsePage,
	searchPageForText,
};
