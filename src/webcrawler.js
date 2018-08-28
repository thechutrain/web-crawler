const requestPage = require('./utils').requestPage;
const findPageLinks = require('./utils').findPageLinks;
const searchPageForText = require('./utils').searchPageForText;

const MAX_DEPTH = 0; // inclusive value

// TODO: replace this with prompter
const args = process.argv.slice(2);

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

let count = 0;
function searchWikiPages(links = url_list, keyword) {
	links.forEach(function(urlObj) {
		if (urlObj.depth <= MAX_DEPTH) {
			requestPage(urlObj.url)
				.then(htmlStr => {
					const newDepth = urlObj.depth + 1;

					// find the links
					const urlLinks = findPageLinks(htmlStr).map(url => {
						// TODO: determine if its abs or rel url
						return { url, depth: newDepth };
					});

					// find the occurances of some key word
					count += searchPageForText(htmlStr, keyword);

					searchWikiPages(urlLinks, keyword);
				})
				.catch(e => {
					console.log(`ERROR in requestPage: ${e}`);
				});
		} else {
			console.log(count);
		}
	});

	// Check if there are any pending promises
}
//#endregion

// --------- TESTING ------------
// tests that you can make a request to page & prints data
// const url = args[0];
searchWikiPages(url_list, 'dog');
