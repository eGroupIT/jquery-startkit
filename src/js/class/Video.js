/**
 * Video.js
 * Copyright 2013-2017 eGroup
 * Licensed under MIT
 * @param {*} videoContainer
 * @param {*} settings
 */
export default function Video(videoContainer, settings) {
	this.$videoContainer = $(videoContainer);
	this.$video = this.$videoContainer.find('video');
	this.$playButton = this.$videoContainer.find('.video__playButton');
	this.$seekBar = this.$videoContainer.find('.video__seekBar');
	this.$slider = this.$seekBar.find('.video__seekBarSlider');
	this.$thumb = this.$slider.find('.video__seekBarThumb');
	this.min = 0;
	this.max = 0;
	this.seekBarPageX = 0;
	this.settings = settings || {
		timeupdateCb() {},
	};
	this.seekBarInterval = null;
	this.initVariables = this.initVariables.bind(this);
	this.onMouseDown = this.onMouseDown.bind(this);
	this.onMouseUp = this.onMouseUp.bind(this);
	this.onMouseMove = this.onMouseMove.bind(this);
	this.styleSeekBarWhilePlaying = this.styleSeekBarWhilePlaying.bind(this);
	this.init();
}
/**
 * init variables and bind events
 */
Video.prototype.init = function init() {
	this.initVariables();
	this.bindEvents();
};
/**
 * Set variables in order to calculate seekbar position
 */
Video.prototype.initVariables = function initVariables() {
	this.max = this.$seekBar.width();
	this.seekBarPageX = this.$seekBar[0] ? this.$seekBar[0].getBoundingClientRect().left : 0;
};
/**
 * bind events
 */
Video.prototype.bindEvents = function bindEvents() {
	const self = this;
	const $window = $(window);
	self.$seekBar.on('mousedown', self.onMouseDown);
	self.$seekBar.on('mouseup', self.onMouseUp);
	self.$video.on('play', () => {
		self.seekBarInterval = setInterval(self.styleSeekBarWhilePlaying, 100);
		self.updatePlayButton();
	});
	self.$video.on('pause', () => {
		clearInterval(self.seekBarInterval);
		self.styleSeekBarWhilePlaying();
		self.updatePlayButton();
	});
	self.$video.on('timeupdate', () => {
		this.settings.timeupdateCb(this.$video[0]);
	});
	self.$playButton.on('click', () => {
		if (self.$video[0].paused) {
			self.$video[0].play();
		} else {
			self.$video[0].pause();
		}
	});
	$window.on('resize', self.initVariables);
	$window.on('mouseup', () => {
		$window.off('mousemove touchmove', self.onMouseMove);
	});
};
/**
 * Will bind window mouseMove event when mouse is down
 * @param {*} e
 */
Video.prototype.onMouseDown = function onMouseDown(e) {
	const value = this.getUpdateValue(e);
	this.updateCurrentTime(value);
	this.updateSeekBar(value);
	$(window).on('mousemove touchmove', this.onMouseMove);
	this.$video[0].pause();
};
/**
 * Will play video when mouse is up
 */
Video.prototype.onMouseUp = function onMouseUp() {
	this.$video[0].play();
};
/**
 * Will update video current time and seekbar style when mouse is move
 */
Video.prototype.onMouseMove = function onMouseMove(e) {
	const value = this.getUpdateValue(e);
	this.updateCurrentTime(value);
	this.updateSeekBar(value);
};
/**
 * use seekbar's percentage to update video's currentTime value
 * @param {*} value
 */
Video.prototype.updateCurrentTime = function updateCurrentTime(value) {
	const time = this.$video[0].duration * value;
	if (isNaN(time)) return;
	this.$video[0].currentTime = time;
};
/**
 * get value to update seekbar
 * @param {*} e
 */
Video.prototype.getUpdateValue = function getUpdateValue(e) {
	let value = (e.pageX - this.seekBarPageX) / this.max;
	if (value > 1) value = 1;
	else if (value < 0) value = 0;
	return value;
};
/**
 * A warpper function to smooth seekbar animation while playing
 */
Video.prototype.styleSeekBarWhilePlaying = function styleSeekBarWhilePlaying() {
	const value = this.$video[0].currentTime / this.$video[0].duration;
	this.updateSeekBar(value);
};
/**
 * update playbutton style
 */
Video.prototype.updatePlayButton = function updatePlayButton() {
	if (this.$video[0].paused) {
		this.$playButton[0].innerHTML = 'Play';
	} else {
		this.$playButton[0].innerHTML = 'Pause';
	}
};
/**
 * update seekbar style
 */
Video.prototype.updateSeekBar = function updateSeekBar(value) {
	this.$slider.width(`${value * 100}%`);
};
