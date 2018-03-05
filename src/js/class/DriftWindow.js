export default function DriftWindow(windowSelector) {
	this.$window = $(windowSelector);
}

DriftWindow.prototype.initWindowsPosition = function initWindowsPosition() {
	$('.driftWindow--show').each(function (index) {
		$(this).css('bottom', `${(index * 82) + 26}px`);
	});
	return this;
};

DriftWindow.prototype.show = function show() {
	this.$window.addClass('driftWindow--show');
	this.initWindowsPosition();
	return this;
};

DriftWindow.prototype.hide = function hide() {
	this.$window.removeClass('driftWindow--show');
	this.initWindowsPosition();
	return this;
};
