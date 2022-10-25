import { LitElement } from 'lit';

class AppTimerCounter extends LitElement {
  static properties = {
    duration: { type: String },
    start: { type: Boolean },
    startTime: { type: Number },
    endTime: { type: Number },
    _interval: { state: true }
  };

  constructor() {
    super();
    this.duration = '00:00:00';
    this.start = false;
    this.startTime = 0;
    this.endTime = 0;
    this._interval = undefined;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._interval);
    this.start = false;
  }

  /**
   * @param {number} startTimeStamp start time stamp
   */
  handleStartTimer(startTimeStamp) {
    if (!this.start) {
      this.start = true;
      const startTime = startTimeStamp || Date.now();
      this.startTime = startTime;

      this._interval = setInterval(() => {
        const currentTime = Date.now();
        const substractTime = currentTime - startTime;
        this.handleFormatTime(substractTime);
      }, 100);
    }
  }

  /**
   * @param {number} timestamp time stamp
   * @returns {string} format time in hh:mm:ss
   */
  handleFormatTime(timestamp) {
    let hours = Math.floor(
      (timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timestamp % (1000 * 60)) / 1000);

    hours = hours.toString();
    hours = hours.length === 1 ? '0' + hours : hours;

    minutes = minutes.toString();
    minutes = minutes.length === 1 ? '0' + minutes : minutes;

    seconds = seconds.toString();
    seconds = seconds.length === 1 ? '0' + seconds : seconds;

    const formatTime = `${hours}:${minutes}:${seconds}`;
    this.duration = formatTime;

    return formatTime;
  }

  handleEndTimer() {
    if (this.start) {
      this.endTime = Date.now();
      clearInterval(this._interval);
      this.start = false;
    }
  }

  render() {
    return this.duration;
  }
}

customElements.define('app-timer-counter', AppTimerCounter);
