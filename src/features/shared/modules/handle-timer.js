/**
 * @type {any}
 */
export const handleTimer = (
  /** @type {{ handleStartTimer: (arg0: number | undefined) => void; handleEndTimer: () => void; handleFormatTime: (arg0: number) => void; }} */ appTimerCounter,
  /** @type {string} */ streamStatus,
  /** @type {string | number | Date} */ startTime,
  /** @type {string | number | Date} */ endTime
) => {
  // const appTimerCounter = this.renderRoot.querySelector('app-timer-counter');

  if (streamStatus === 'live' && appTimerCounter) {
    //when the stream is live but the user just reload the page, the timer will get the time when the stream started
    if (startTime) {
      const timeStartTime = new Date(startTime).getTime();
      appTimerCounter.handleStartTimer(timeStartTime);
    } else {
      //we don't need start time param when the stream is just started to live
      appTimerCounter.handleStartTimer();
    }
  } else if (streamStatus === 'end' && appTimerCounter) {
    appTimerCounter.handleEndTimer();

    //when loaded on first time, if the stream has already ended, will get the previous stream duration
    if (startTime && endTime) {
      const timeStartTime = new Date(startTime).getTime();
      const timeEndTime = new Date(endTime).getTime();
      const substractTime = timeEndTime - timeStartTime;
      appTimerCounter.handleFormatTime(substractTime);
    }

    //when loaded on first time, if the stream hasn't ended yet (still on going), will get the stream duration up until now
    if (startTime && !endTime) {
      const timeStartTime = new Date(startTime).getTime();
      const timeNow = Date.now();
      const substractTime = timeNow - timeStartTime;
      appTimerCounter.handleFormatTime(substractTime);
    }
  }
};
