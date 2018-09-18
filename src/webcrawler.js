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

	// Request-related data structures
	this.pendingRequest = Array(this.MAX_REQ).fill(null);
	this.queuedRequest = [];

	this.visitedUrls = new Map();
	this.total_count = 0;
	this.num_request = 0; // debugging

	// this.example = [
	// 	{
	// 		url: this.START_URL,
	// 		depth: 0,
	// 		refPage: null, // original page that linked to this url
	// 		arrUrls: [],
	// 	},
	// ];
	// Begin the program
	this.init();
}

// ========= life cycle methods ===========
// init, onEnd, onError
//#region lifecycle methods
WebCrawler.prototype.init = function initWebCrawler() {
	const url_list = [
		{
			url: this.START_URL,
			depth: 0,
			refPage: null, // original page that linked to this url
			arrUrls: [],
		},
	];

	this.crawlPages(url_list);
	// this.crawlPages(this.example);
};

WebCrawler.prototype.onEnd = function onEnd() {
	console.log('----------- finished --------');
	console.log(`Made a total of ${this.num_request} request(s)`);
	console.log(this.visitedUrls);
	console.log(this.example);
};

//TODO: make an on error for promise catch block!
WebCrawler.prototype.onError = function onError() {};
//#endregion lifecycle methods

// =========== Primary functions ==========
//#region
WebCrawler.prototype.crawlPages = function crawlPages(urlLinks = []) {
	urlLinks.forEach(
		function(urlObj) {
			// Validate depth-level
			if (urlObj.depth > this.MAX_DEPTH) return;

			// Validate unique url only
			if (this.visitedUrls.has(urlObj.url)) return;

			// Check if room on our pending request array to make request
			let requestIndex = null;
			let canMakeRequest = this.pendingRequest.some((e, i) => {
				if (e === null) {
					requestIndex = i;
					return true;
				}
			});

			if (canMakeRequest && requestIndex !== null) {
				this.pendingRequest[requestIndex] = this._makePageRequest(
					urlObj,
					requestIndex
				);
				this.num_request++;
				this.visitedUrls.set(urlObj.url, null);
			} else {
				this.queuedRequest.push(urlObj);
			}
		}.bind(this)
	);
};

WebCrawler.prototype._makePageRequest = function _makePageRequest(
	urlObj,
	reqIndx
) {
	return requestPage(urlObj.url)
		.then(
			function successRequestHandler(htmlStr) {
				this.pendingRequest[reqIndx] = null;

				// Check for the next request on the queue
				if (this.queuedRequest.length) {
					let nextUrl = this.queuedRequest.shift();
					this.pendingRequest[reqIndx] = this._makePageRequest(
						nextUrl,
						reqIndx
					);
				}

				// Look for the keyword occurances
				const keyWordCount = searchPageForText(htmlStr, this.KEYWORD);
				this.visitedUrls.set(urlObj.url, keyWordCount);
				this.total_count += keyWordCount;

				// Find next set of external page links
				const newDepth = urlObj.depth + 1;
				//TODO: instead of getting every url, maybe get urls that don't match current hostname?
				const nextSetLinks = (urlObj.arrUrls = findPageLinks(htmlStr).map(
					url => ({
						url,
						depth: newDepth,
						refPage: urlObj.url,
					})
				));

				this.crawlPages(nextSetLinks);

				// Check if webcrawler is finished
				this._isDone();
			}.bind(this)
		)
		.catch(e => {
			console.log(`ERROR in requestPage promise: ${e}`);
			this.pendingRequest[reqIndx] = null;
			// Check for the next request on the queue
			if (this.queuedRequest.length) {
				let nextUrl = this.queuedRequest.shift();
				this.pendingRequest[reqIndx] = this._makePageRequest(nextUrl, reqIndx);
			}

			// Check if webcrawler is finished
			this._isDone();
		});
};

/**
 * @return {bln} whether or not webcrawler is done or not
 */
WebCrawler.prototype._isDone = function _isDone() {
	const queuedReqEmpty = this.queuedRequest.length === 0;
	const pendReqEmpty = this.pendingRequest.every(r => r === null);
	if (queuedReqEmpty && pendReqEmpty) {
		this.onEnd();
	}
};
//#endregion

// TESTING
new WebCrawler();
