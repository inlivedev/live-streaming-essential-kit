import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk';
import { initialization } from '../../../features/shared/modules/initialization.js';

const EmbedStreamingPage = (properties) => {
  const { hlsManifest, dashManifest } = properties;

  return html`
    <app-player
      class="full-screen"
      src=${hlsManifest}
      dashUrl=${dashManifest}
      hlsUrl=${hlsManifest}
      autoplay
      muted
    ></app-player>
  `;
};

export const scripts = `
  <script type="module" src="/__client/features/player/app-player.js"></script>
`;

export default EmbedStreamingPage;

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
      hlsManifest: streamData.hlsManifestPath || '',
      dashManifest: streamData.dashManifestPath || ''
    }
  };
};
