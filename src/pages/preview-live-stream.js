import { html } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

const PreviewLiveStream = (props) => {
  const { streamData, title } = props;
  return html`
    <viewer-landing streamData=${streamData} title=${title}></viewer-landing>
  `;
};

export const scripts = `
<script type="module" src="/__client/features/viewer/landing/viewer-landing.js"></script>
`;

export default PreviewLiveStream;

export const getServerSideProps = () => {
  const getStreamData = async (id) => {
    console.log('disiniiiii');
    const streamData = await InliveStream.getStream(id);
    console.log(streamData);
    return streamData;
  };

  const streamData = getStreamData(414);
  return {
    props: {
      streamData: streamData,
      title: 'title'
    }
  };
};
