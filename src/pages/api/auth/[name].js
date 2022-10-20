const handler = async (request, reply) => {
  const name = request?.params?.name;

  if (request.method !== 'POST') {
    reply.code(400).send({
      success: false,
      code: 400,
      message: 'Method is not allowed'
    });
  }

  if (name === 'login-with-credentials') {
    try {
      const { username, password } = request.body;

      const validCredentials =
        username === 'username' && password === 'password';

      if (!validCredentials)
        reply.code(400).send({ message: 'Invalid credentials' });

      const token = await reply.jwtSign({
        username: `${username}${Date.now()}`
      });

      reply.setCookie('token', token, {
        path: '/',
        sameSite: 'strict',
        httpOnly: true
      });

      reply.code(200).send({ success: true });
    } catch (error) {
      throw new Error(error);
    }
  } else if (name === 'validation') {
    try {
      const token = request?.headers?.cookie?.replace('token=', '');
      if (!token) reply.code(401).send({ message: 'You are not authorize' });

      const verify = await request.jwtVerify();

      if (Date.now() / 1000 < Number.parseInt(verify.exp)) {
        reply.code(200).send({ success: true });
      }
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default handler;
