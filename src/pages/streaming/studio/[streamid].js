import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';
import { validation } from '../../../features/auth/validation.js';
import { initialization } from '../../../features/shared/modules/initialization.js';

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
  <script type="module" src="/__client/features/streamer/studio/app-studio.js"></script>
`;

export default StudioStreamingPage;

export const getServerSideProps = async (request, reply) => {
  const streamId = Number.parseInt(request.params.streamid, 10);
  const isAuthorized = await validation(request);

  if (!isAuthorized) {
    reply.code(403).send({
      code: 403,
      message: 'You are not authorized to see this page'
    });
  }

  const inliveApp = initialization();

  const streamResponse = await InliveStream.getStream(inliveApp, streamId);
  let streamData = {};

  if (streamResponse.status.code === 200 && streamResponse.data) {
    streamData = streamResponse.data;
  }

  return {
    props: {
      heading: streamData.name || '',
      description: streamData.description || '',
      streamId: streamData.id || undefined,
      startTime: streamData.startTime || '',
      endTime: streamData.endTime || '',
      preparedAt: streamData.preparedAt || '',
      quality: streamData.quality || undefined
    }
  };
};
