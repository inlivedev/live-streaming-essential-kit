import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const PreviewLiveStream = (props) => {
  const {
    streamTitle,
    streamDescription,
    startTime,
    isScheduled,
    isEnded,
    isLive
  } = props;

  return html`
    <app-viewer-landing
      streamTitle=${streamTitle}
      streamDescription=${streamDescription}
      startTime=${startTime}
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
  const streamID = parseInt(request.params.streamId);

  // trial to use getStream module SDK
  const streamData = await InliveStream.getStream(streamID);
  console.log('cek', streamData);

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
      //   streamDescription:
      //     'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
      startTime: convertStartTimeStream,
      isScheduled:
        (streamData.data.start_time === null &&
          streamData.data.end_time === null) ||
        (streamData.data.start_time === '' && streamData.data.end_time === ''),
      isEnded:
        streamData.data.start_time !== null &&
        streamData.data.end_time !== null &&
        streamData.data.start_time !== '' &&
        streamData.data.end_time !== '',
      isLive:
        streamData.data.start_time !== null &&
        streamData.data.start_time !== '' &&
        (streamData.data.end_time === null || streamData.data.end_time === '')
    }
  };
};
