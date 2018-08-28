/*global describe it expect*/
const requestPage = require('../utils').requestPage;
const parsePage = require('../utils').parsePage;
const searchPageForText = require('../utils').searchPageForText;
const validUrl = require('../utils').validUrl;
// const checkAbsRelUrl = require('../utils').checkAbsRelUrl;

// Unit : requestPage()
//#region
describe('UTILS: requestPage', () => {
	it('should be able to find a keyword in an html page, case insensitive', () => {
		const url = 'https://en.wikipedia.org/wiki/Two%27s_complement';
		return requestPage(url).then(html => {
			expect(typeof html).toBe('string');
		});
	});

	it('should not find any keywords that are attributes, class names, ids', () => {
		const html = `<body>
										<h1 id="cat">My favorite animal:</h1>
										<p class="cat">No feline animal here</p>
									</body>`;
		expect(searchPageForText(html, 'cat')).toBe(0);
	});
});
//#endregion

// Unit tests: parsePage()
//#region
describe('UTILS: parsePage() ', () => {
	it('should be able to parse an empty page', () => {
		expect(parsePage('')).toEqual([]);
	});

	it('should be able to return link names', () => {
		const link_1 = 'www.wikipedia.com/';
		const link_2 = 'www.wikipedia.com/';
		let html = `<body>
									<a href='${link_1}'>link 1</a>
									<a href='${link_2}'>link 2</a>
								</body>`;
		const links = parsePage(html);
		expect(links.length).toBe(2);
		expect(links[0]).toEqual({ url: link_1 });
		expect(links[1]).toEqual({ url: link_2 });
	});
});
//#endregion

// Unit tests: searchPageForText()
//#region
describe('UTILS: searchPageForText', () => {
	it('should be able to find a keyword in an html page, case insensitive', () => {
		const html = `<body>
										<p> cat Cat CAT cAT cAt caT</p>
									</body>`;
		expect(searchPageForText(html, 'cat')).toBe(6);
	});

	it('should not find any keywords that are attributes, class names, ids', () => {
		const html = `<body>
										<h1 id="cat">My favorite animal:</h1>
										<p class="cat">No feline animal here</p>
									</body>`;
		expect(searchPageForText(html, 'cat')).toBe(0);
	});
});
//#endregion

// Unit tests: validUrl()
//#region validUrl()
describe('UTILS: validUrl()', () => {
	it('should validate proper urls', () => {
		expect(validUrl('https://www.google.com')).toBe(true);
		expect(validUrl('https://www.wikipedia.com/wiki')).toBe(true);
	});
	it('should not validate NON-valid urls', () => {
		expect(validUrl('google.com')).toBe(false);
		expect(validUrl('https://google.com')).toBe(false);
	});
});
//#endregion

// Unit tests: validUrl()
//#region validUrl()
describe('UTILS: validUrl()', () => {
	it('should validate proper urls', () => {
		expect(validUrl('https://www.google.com')).toBe(true);
		expect(validUrl('https://www.wikipedia.com/wiki')).toBe(true);
	});
	it('should not validate NON-valid urls', () => {
		expect(validUrl('google.com')).toBe(false);
		expect(validUrl('https://google.com')).toBe(false);
	});
});
//#endregion
