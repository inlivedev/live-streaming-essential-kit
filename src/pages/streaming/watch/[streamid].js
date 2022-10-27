import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const WatchStreamingPage = (properties) => {
  const { heading, description, hlsManifest, dashManifest, streamId } =
    properties;

  return html`
    <app-viewer-room
      heading=${heading}
      description=${description}
      hlsManifest=${hlsManifest}
      dashManifest=${dashManifest}
      streamId=${streamId}
    >
    </app-viewer-room>
  `;
};

export const scripts = `
  <script type="module" src="/__client/features/viewer/room/app-viewer-room.js"></script>
`;

export default WatchStreamingPage;

export const getServerSideProps = async (request) => {
  const streamId = Number.parseInt(request.params.streamid, 10);
  const streamResponse = await InliveStream.getStream(streamId);
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
      endTime: streamData.endTime || '',
      streamId: streamData.id || undefined
    }
  };
};
