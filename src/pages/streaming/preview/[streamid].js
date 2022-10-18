import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const PreviewLiveStream = (
  /** @type {{ streamTitle: string; streamDescription: string; startTime: string; streamId: string; streamStatus: string; }} */ properties
) => {
  const { streamTitle, streamDescription, startTime, streamId, streamStatus } =
    properties;

  return html`
    <app-viewer-landing
      streamTitle=${streamTitle}
      streamDescription=${streamDescription}
      startTime=${startTime}
      streamId=${streamId}
      streamStatus=${streamStatus}
    ></app-viewer-landing>
  `;
};

export const scripts = `
<script type="module" src="/__client/features/viewer/landing/app-viewer-landing.js"></script>
`;

export default PreviewLiveStream;

export const getServerSideProps = async (
  /** @type {{ params: { streamid: string; }; }} */ request
) => {
  const streamId = Number.parseInt(request.params.streamid);

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

  let streamStatus;
  if (!streamData.data.start_time && !streamData.data.end_time) {
    streamStatus = 'streamScheduled';
  } else if (
    streamData.data.start_time !== null &&
    streamData.data.end_time !== null &&
    streamData.data.start_time !== '' &&
    streamData.data.end_time !== ''
  ) {
    streamStatus = 'streamEnded';
  } else if (
    streamData.data.start_time !== null &&
    streamData.data.start_time !== '' &&
    !streamData.data.end_time
  ) {
    streamStatus = 'streamLive';
  }

  return {
    props: {
      streamTitle: streamData.data.name || '',
      streamDescription: streamData.data.description || '',
      startTime: convertStartTimeStream || '',
      streamId: streamId,
      streamStatus: streamStatus
    }
  };
};
