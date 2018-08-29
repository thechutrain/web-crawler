'use strict';
const requestPage = require('./utils').requestPage;
const findPageLinks = require('./utils').findPageLinks;
const searchPageForText = require('./utils').searchPageForText;

const MAX_DEPTH = 0; // inclusive value

// TODO: replace this with prompter
const args = process.argv.slice(2);

function WebCrawler(options = {}) {
	this.START_URL = options.startUrl || 'https://en.wikipedia.org/wiki/hotdog';
	this.KEYWORD = options.keyword || 'frankfurter';
	this.MAX_DEPTH = options.depth || 1;
	this.MAX_REQ = options.MAX_REQ || 3;
	this.pendingRequest = Array(this.MAX_REQ).fill(null);
	this.queuedRequest = [];
	this.visitedUrls = new Map();
	this.total_count = 0;
	this.num_request = 0; // debugging
	this.init();
}

WebCrawler.prototype.init = function initWebCrawler() {
	const url_list = [
		{
			url: this.START_URL,
			depth: 0,
		},
	];

	this.crawlPages(url_list);
};

WebCrawler.prototype.crawlPages = function crawlPages(url_links = []) {
	// const wc = this;
	url_links.forEach(
		function(urlObj) {
			if (urlObj.depth <= this.MAX_DEPTH) {
				// Check if room on our pending request array to make request
				let requestIndex = null;
				let canMakeRequest = this.pendingRequest.some((e, i) => {
					if (e === null) {
						requestIndex = i;
						return true;
					}
				});

				if (canMakeRequest && requestIndex !== null) {
					//debugging:
					console.log('--------- Request --------');
					console.log(this.num_request);
					console.log(this.pendingRequest);

					let newRequest = requestPage(urlObj.url)
						.then(
							function(htmlStr) {
								this.pendingRequest[requestIndex] = null;
								// TODO: check if any queuedRequest on page --> pass it

								// TODO: find page occurances
								this.total_count = searchPageForText(htmlStr, this.KEYWORD);

								// TODO: find page links
								const newDepth = urlObj.depth + 1;
								const url_links_2 = findPageLinks(htmlStr).map(url => ({
									url,
									depth: newDepth,
								}));
								this.crawlPages(url_links_2);
							}.bind(this)
						)
						.catch(e => {
							console.log(`ERROR in requesPage promise: ${e}`);
						});

					this.pendingRequest[requestIndex] = newRequest;
					this.num_request++;
				} else {
					this.queuedRequest.push(urlObj);
				}
			}
		}.bind(this)
	);
};

// TESTING
new WebCrawler();

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
// searchWikiPages(url_list, 'dog');
