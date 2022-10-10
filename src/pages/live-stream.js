import { html } from 'lit';

const LiveStream = () => {
  return html`<create-stream></create-stream>`;
};

export const scripts = `
<script type="module" src="/__client/features/streamer/create-stream.js"></script>
`;

export default LiveStream;

export const getServerSideProps = () => {
  return {
    props: {}
  };
};
