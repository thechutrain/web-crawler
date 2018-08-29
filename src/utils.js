const cheerio = require('cheerio');
const axios = require('axios');
const LINK_LIMIT = 4;

/** ======== requestPage() ========
 *
 * @param {string} url
 * @return {Promise}
 */
function requestPage(url) {
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then(res => {
				const htmlStr = res.data;
				resolve(htmlStr);
			})
			.catch(e => {
				reject(e);
			});
	});
}

/** ===== findPageLinks() =====
 *
 * @param {string} htmlStr
 * @return {array} links
 */
function findPageLinks(htmlStr) {
	const $ = cheerio.load(htmlStr);
	const aTags = $('a');
	const links = [];

	// Find all embedded links on current page
	aTags.each((_, element) => {
		// TODO: need to make a validator & check to see if the links are valid or not!
		// must be abs paths, not img files, not hashes
		let href = $(element).attr('href');
		if (href && validUrl(href)) {
			links.push(href);
		}
	});

	return typeof LINK_LIMIT === 'number' ? links.splice(0, LINK_LIMIT) : links;
}

/**
 *
 * @param {string} htmlStr
 * @param {string} key_word
 * @return {number} occurances
 */
function searchPageForText(htmlStr, key_word) {
	const pageContent = cheerio.load(htmlStr).text();
	const regex = new RegExp(key_word, 'gi');

	return (pageContent.match(regex) || []).length;
}

// TODO: make a function that determines if url is absolute or relative path
/**
 *
 * @param {string} urlPath
 * @return {bln} - whether path is absolute or relative
 */
// function checkAbsRelUrl(urlPath) {}

function validUrl(urlPath = '') {
	// NOTE: valid urls must either begin with http(s) or www.
	const regexUrl = new RegExp('^((https|http)|([w]{3}.))', 'gi');

	return urlPath.match(regexUrl) !== null;
}

module.exports = {
	requestPage,
	findPageLinks,
	searchPageForText,
	validUrl,
	// checkAbsRelUrl,
};
