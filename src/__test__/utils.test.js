/*global describe it expect*/
const parsePage = require('../utils').parsePage;
const searchPageForText = require('../utils').searchPageForText;

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
		expect(links[0]).toEqual({ url: link_1, depth: 0 });
		expect(links[1]).toEqual({ url: link_2, depth: 0 });
	});
});

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
