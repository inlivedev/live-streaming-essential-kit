import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk';
import { initialization } from '../../../features/shared/modules/initialization.js';

const WatchStreamingPage = (properties) => {
  const {
    heading,
    description,
    hlsManifest,
    dashManifest,
    startTime,
    endTime
  } = properties;

  return html`
    <app-viewer-room
      heading=${heading}
      description=${description}
      hlsManifest=${hlsManifest}
      dashManifest=${dashManifest}
      startTime=${startTime}
      endTime=${endTime}
    >
    </app-viewer-room>
  `;
};

export const scripts = `
  <script type="module" src="/__client/features/viewer/room/app-viewer-room.js"></script>
`;

export default WatchStreamingPage;

export const getServerSideProps = async (request) => {
  const inliveApp = initialization();

  const streamId = Number.parseInt(request.params.streamid, 10);
  const streamResponse = await InliveStream.getStream(inliveApp, streamId);
  let streamData = {};

  if (streamResponse.status.code === 200 && streamResponse.data) {
    streamData = streamResponse.data;
  }

  return {
    props: {
      heading: streamData.name || '',
      description: streamData.description || '',
      hlsManifest: streamData.hlsManifestPath || '',
      dashManifest: streamData.dashManifestPath || '',
      startTime: streamData.startTime || '',
      endTime: streamData.endTime || ''
    }
  };
};
