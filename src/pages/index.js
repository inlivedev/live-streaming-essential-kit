import { html } from 'lit';

const LiveStream = () => {
  return html`<app-create-stream></app-create-stream> `;
};

export const scripts = `
<script type="module" src="/__client/features/streamer/create-stream/app-create-stream.js"></script>
`;

export default LiveStream;
