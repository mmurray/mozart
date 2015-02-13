/**
 * Constructs a flash audio sound.
 * @param {String} url Url of the sound file.
 * @param {Object=} opt_options Optional callback object.
 * @param {String} elId Id of the flash object element.
 * @constructor
 * @extends {MozartSound}
 */
var MozartFlashSound = function(url, opt_options, elId) {
  /**
   * Reference to <object> element which contains our flash player
   * @type {Element}
   * @private
   */
  this.audioEl_ = document.getElementById(elId);

  /**
   * The id of the audio element.
   * @type {String}
   * @private
   */
  this.audioElId_ = elId;
  
  /**
   * The url to the mp3.
   * @type {String}
   * @private
   */
  this.url_ = url;

  MozartSound.call(this, url, opt_options);
};
Mozart.inherit(MozartFlashSound, MozartSound);


/** @override */
MozartFlashSound.prototype.initialize = function(opt_options) {
  // TODO(mike): add listeners
  Mozart.addEventListener("mzSoundEnd:"+this.uid,
      Mozart.bind(this.handleFinished, this));
  MozartSound.prototype.initialize.call(this, opt_options);
};


/** @override */
MozartFlashSound.prototype.pause = function() {
  this.audioEl_.pauseTrack();
};


/** @override */
MozartFlashSound.prototype.stop = function() {
  this.audioEl_.stopTrack();
};


/** @override */
MozartFlashSound.prototype.playInternal = function() {
  if (!this.audioEl_) {
    if (Mozart.SWF_READY) {
      this.audioEl_ = document.getElementById(this.audioElId_);
    } else {
      var _this = this;
      Mozart.swfReadyCallbacks.push(function() {
        _this.audioEl_ = document.getElementById(_this.audioElId_);
        _this.playInternal();
      });
      return;
    }
  }
  this.audioEl_.playTrack(this.url_, this.uid);
};


/** @override */
MozartFlashSound.prototype.deferredPlay = function() {
  if (this.deferredAttached) {
    return;
  }

  this.defferedAttached = true;
  var _this = this;
  window.addEventListener("loadeddata", function() {
    this.options['onPlay'].call(this.options['scope']);
  }, true);
  _this.playInternal();
};


/** @override */
MozartFlashSound.prototype.getTime = function() {
  if (!this.audioEl_) return 0;
  return this.audioEl_.getTime();
};