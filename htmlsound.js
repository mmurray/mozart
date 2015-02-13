/**
 * Constructs an HTML5 audio sound.
 * @param {String} url Url of the sound file.
 * @constructor
 * @extends {MozartSound}
 */
var MozartHtmlSound = function(url, opt_options) {
  /**
   * The HTML5 audio element.
   * @type {Element}
   * @private
   */
  this.audioEl_ = new Audio(url);

  MozartSound.call(this, url, opt_options);
};
Mozart.inherit(MozartHtmlSound, MozartSound);


/** @override */
MozartHtmlSound.prototype.initialize = function(opt_options) {
  MozartSound.prototype.initialize.call(this, opt_options);
  this.audioEl_.addEventListener("loadeddata", Mozart.bind(this.handleLoaded, this), true);
  this.audioEl_.addEventListener("error", Mozart.bind(this.handleError, this), true);
  this.audioEl_.addEventListener("ended", Mozart.bind(this.handleFinished, this), true);
  this.audioEl_.load();
};


/** @override */
MozartHtmlSound.prototype.pause = function() {
  this.audioEl_.pause();
};


/** @override */
MozartHtmlSound.prototype.stop = function() {
  this.audioEl_.pause();
  this.audioEl_.currentTime = 0;
};


/** @override */
MozartHtmlSound.prototype.playInternal = function() {
  this.audioEl_.play();
};


/** @override */
MozartHtmlSound.prototype.deferredPlay = function() {
  if (this.deferredAttached) {
    return;
  }

  this.defferedAttached = true;
  var _this = this;
  this.audioEl_.addEventListener("loadeddata", function() {
    this.options['onPlay'].call(this.options['scope']);
    _this.playInternal();
  }, true);
};


/** @override */
MozartHtmlSound.prototype.getTime = function() {
  return this.audioEl_.currentTime;
};