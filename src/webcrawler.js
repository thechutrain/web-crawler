const axios = require('axios');
const cheerio = require('cheerio');

// TODO - replace this with prompter
// adds in the ability to get info from a specific url
const args = process.argv.slice(2);
const url = args[0] || 'https://en.wikipedia.org/wiki/Two%27s_complement';

/** ----- searchWikiPages -------
 * given a topic name, makes a request to wikipedia, parses page
 * and returns a json object with the most important text
 *
 * @param {string} title
 * @return {Promise} jsonData of the webpage
 */
//#region searchWikiPages
function searchWikiPages(title = '') {
	const encodedTitle = encodeURI(title.trim());
	const url = `https://en.wikipedia.org/wiki/${encodedTitle}`;

	console.log(`Making a request to ${url} ...`);

	return new Promise((resolve, reject) => {
		axios.get(url).then(
			response => {
				const dataJSON = parseWikiPage(response.data);
				const dataStr = JSON.stringify(dataJSON);
				resolve(dataJSON);
			},
			err => {
				reject({ err_msg: `No page found on wikipedia for the url: ${url}` });
			}
		);
	});
}
//#endregion

/**
 *
 * @param {string} htmlDOM
 * @return {object} wikiContent
 */
//#region parseWikiPage
function parseWikiPage(htmlDOM) {
	const $ = cheerio.load(htmlDOM);
	const contentChildren = $('#mw-content-text .mw-parser-output').children();
	const title = $('#firstHeading').text();
	const timestamp = new Date().toISOString();
	const details = [];

	let keepCollecting = true;
	let index = 0;

	// Loop through each element inside the main content,
	// collect the text content inside p, until you reach table of contents tag
	while (keepCollecting && index < contentChildren.length) {
		let ele = contentChildren.eq(index);

		if (ele.get(0).tagName == 'p') {
			let detailStr = ele.text().trim();
			if (detailStr !== '') {
				detailStr = detailStr.replace(/\[[\d]+\]/gi, '');
				details.push(detailStr);
			}
		} else if (ele.attr('id') === 'toc') {
			keepCollecting = false;
		}
		index++;
	}

	return { title, details, timestamp };
}
//#endregion

// --------- TESTING ------------
// tests that you can make a request to page & prints data
const topic = args[0];
searchWikiPages(topic)
	.then(dataStr => {
		console.log('---------');
		console.log(dataStr);
	})
	.catch(err => {
		if (err.err_msg) {
			console.log(err.err_msg);
		}
	});
