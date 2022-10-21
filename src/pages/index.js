import { html } from 'lit';

const LiveStream = () => {
  return html`<app-create-stream
      id="create-stream-component"
    ></app-create-stream>
    <p id="error-warning"></p> `;
};

export const scripts = `
<script type="module" src="/__client/features/streamer/app-create-stream.js"></script>
<script>
const username = prompt('input your username');
const password = prompt('input your password');

const userAuthentication = async () => {
  const response = await fetch('/api/auth/login-with-credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const authResponse = await response.json();

  // check if login is success, if not success then render error message
  if (authResponse.success) {
    document.getElementById('create-stream-component').style.display = 'block';
    document.getElementById('error-warning').style.display = 'none';
  } else {
    document.getElementById('create-stream-component').style.display = 'none';
    document.getElementById('error-warning').style.display = 'block';
    document.getElementById('error-warning').style.textAlign = 'center';
    document.getElementById('error-warning').innerHTML = authResponse.message + ': please input your valid username & password';
  };
};

userAuthentication();
</script>
`;

export default LiveStream;
