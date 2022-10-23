import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const StudioStreamingPage = (properties) => {
  const {
    heading,
    description,
    streamId,
    startTime,
    endTime,
    preparedAt,
    quality
  } = properties;

  return html`
    <app-studio
      heading=${heading}
      description=${description}
      streamId=${streamId}
      startTime=${startTime}
      endTime=${endTime}
      preparedAt=${preparedAt}
      quality=${quality}
    >
    </app-studio>
  `;
};

export const scripts = `
  <script type="module" src="/__client/features/studio/app-studio.js"></script>
`;

export default StudioStreamingPage;

export const getServerSideProps = async (request) => {
  const streamId = Number.parseInt(request.params.streamid, 10);
  const streamResponse = await InliveStream.getStream(streamId);
  let streamData = {};

  if (streamResponse.status.code === 200 && streamResponse.data) {
    streamData = streamResponse.data;
  }

  console.log('streamData', streamData);

  return {
    props: {
      heading: streamData.name || '',
      description: streamData.description || '',
      streamId: streamData.id || undefined,
      startTime: streamData.startTime || undefined,
      endTime: streamData.endTime || undefined,
      preparedAt: streamData.preparedAt || undefined,
      quality: streamData.quality || undefined
    }
  };
};
