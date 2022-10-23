import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const PreviewLiveStream = (
  /** @type {{ streamTitle: string; streamDescription: string; startTime: string; streamId: string; streamStatus: string; }} */ properties
) => {
  const { streamTitle, streamDescription, startTime, streamId, streamStatus } =
    properties;

  return html`
    <app-viewer-preview
      streamTitle=${streamTitle}
      streamDescription=${streamDescription}
      startTime=${startTime}
      streamId=${streamId}
      streamStatus=${streamStatus}
    ></app-viewer-preview>
  `;
};

export const scripts = `
<script type="module" src="/__client/features/viewer/preview/app-viewer-preview.js"></script>
`;

export default PreviewLiveStream;

export const getServerSideProps = async (
  /** @type {{ params: { streamid: string; }; }} */ request
) => {
  const streamId = Number.parseInt(request.params.streamid, 10);
  const streamResponse = await InliveStream.getStream(streamId);

  let streamData = {};

  if (streamResponse.status.code === 200 && streamResponse.data) {
    streamData = streamResponse.data;
  }

  // convert ISO time into DD longMonth YYYY - HH:MM Tmz
  let convertStartTimeStream;
  if (streamData.startTime) {
    const datetime = new Date(streamData.startTime);

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
  if (!streamData.startTime && !streamData.endTime) {
    streamStatus = 'streamScheduled';
  } else if (streamData.startTime && streamData.endTime) {
    streamStatus = 'streamEnded';
  } else if (streamData.startTime && !streamData.endTime) {
    streamStatus = 'streamLive';
  }

  return {
    props: {
      streamTitle: streamData.name || '',
      streamDescription: streamData.description || '',
      startTime: convertStartTimeStream || '',
      streamId: streamData.id,
      streamStatus: streamStatus
    }
  };
};
