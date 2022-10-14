import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const PreviewLiveStream = (
  /** @type {{ streamTitle: string; streamDescription: string; startTime: string; streamId: string; isScheduled: boolean; isEnded: boolean; isLive: boolean; }} */ props
) => {
  const {
    streamTitle,
    streamDescription,
    startTime,
    streamId,
    isScheduled,
    isEnded,
    isLive
  } = props;

  return html`
    <app-viewer-landing
      streamTitle=${streamTitle}
      streamDescription=${streamDescription}
      startTime=${startTime}
      streamId=${streamId}
      isScheduled=${isScheduled}
      isEnded=${isEnded}
      isLive=${isLive}
    ></app-viewer-landing>
  `;
};

export const scripts = `
<script type="module" src="/__client/features/viewer/landing/app-viewer-landing.js"></script>
`;

export default PreviewLiveStream;

export const getServerSideProps = async (
  /** @type {{ params: { streamId: string; }; }} */ request
) => {
  const streamId = parseInt(request.params.streamId);

  // use getStream module SDK
  const streamData = await InliveStream.getStream(streamId);

  // convert ISO time into DD longMonth YYYY - HH:MM Tmz
  let convertStartTimeStream;
  if (
    streamData.data.start_time !== null &&
    streamData.data.start_time !== ''
  ) {
    const datetime = new Date(streamData.data.start_time);

    const date = new Intl.DateTimeFormat('id', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(datetime);
    const time = new Intl.DateTimeFormat('id', {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    }).format(datetime);

    convertStartTimeStream = date + ' - ' + time;
  }

  return {
    props: {
      streamTitle: streamData.data.name,
      streamDescription: streamData.data.description,
      startTime: convertStartTimeStream,
      streamId: streamId,
      isScheduled: !streamData.data.start_time && !streamData.data.end_time,
      isEnded:
        streamData.data.start_time !== null &&
        streamData.data.end_time !== null &&
        streamData.data.start_time !== '' &&
        streamData.data.end_time !== '',
      isLive:
        streamData.data.start_time !== null &&
        streamData.data.start_time !== '' &&
        !streamData.data.end_time
    }
  };
};
