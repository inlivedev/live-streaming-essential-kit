import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const PreviewLiveStream = (props) => {
  const { streamTitle, streamDescription, startTime } = props;

  return html`
    <viewer-landing
      streamTitle=${streamTitle}
      streamDescription=${streamDescription}
      startTime=${startTime}
    ></viewer-landing>
  `;
};

export const scripts = `
<script type="module" src="/__client/features/viewer/landing/viewer-landing.js"></script>
`;

export default PreviewLiveStream;

export const getServerSideProps = async () => {
  // trial to use getStream module SDK
  const streamData = await InliveStream.getStream(414);

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
      startTime: convertStartTimeStream
    }
  };
};
