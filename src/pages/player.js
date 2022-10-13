import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const Player = (props) => {
  const { hlsManifestPath, dashManifestPath } = props;
  return html`<app-player
    src=${hlsManifestPath}
    dashUrl=${dashManifestPath}
    hlsUrl=${hlsManifestPath}
    autoplay
    muted
  ></app-player>`;
};

export const scripts = `
<script type="module" src="/__client/features/streamer/app-player.js"></script>
`;

export default Player;

export const getServerSideProps = async () => {
  // trial to use getStream module SDK
  const streamData = await InliveStream.getStream(43);
  console.log(streamData);

  return {
    props: {
      hlsManifestPath: streamData.data.hls_manifest_path,
      dashManifestPath: streamData.data.dash_manifest_path
    }
  };
};
