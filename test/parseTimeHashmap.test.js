import parseTimeHashmap from '../src/js/lib/parseTimeHashmap.js';

const timeHashmap = {
	0: true,
	1: true,
};

const timeHashmap2 = {
	0: true,
	1: true,
	5: true,
	6: true,
	7: true,
};

const timeHashmap3 = {
	0: true,
	1: true,
	2: true,
	3: true,
	4: true,
	5: true,
	7: true,
	8: true,
	9: true,
	10: true,
	11: true,
	15: true,
	16: true,
};

test('continuous timeHashmap', () => {
	expect(parseTimeHashmap(timeHashmap)).toEqual([{
		startAt: 0,
		duration: 2,
	}]);
});

test('discontinuous timeHashmap', () => {
	expect(parseTimeHashmap(timeHashmap2)).toEqual([{
		startAt: 0,
		duration: 2,
	}, {
		startAt: 5,
		duration: 3,
	}]);
});

test('discontinuous timeHashmap 2', () => {
	expect(parseTimeHashmap(timeHashmap3)).toEqual([{
		startAt: 0,
		duration: 6,
	}, {
		startAt: 7,
		duration: 5,
	}, {
		startAt: 15,
		duration: 2,
	}]);
});
