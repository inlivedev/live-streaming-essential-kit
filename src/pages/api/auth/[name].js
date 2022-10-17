import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const handler = async (request, reply) => {
  const name = request?.params?.name;

  if (name === 'login-with-credentials') {
    try {
      const { username, password } = request.body;

      const validCredentials =
        username === 'username' && password === 'password';

      if (!validCredentials)
        reply.code(400).send({ message: 'Invalid credentials' });

      const token = await tokenGenerator(username);

      reply.setCookie('token', token, {
        path: '/',
        sameSite: 'strict',
        httpOnly: true
      });

      reply.code(200).send({ success: true });
    } catch (err) {
      throw new Error(err);
    }
  } else if (name === 'validation') {
    try {
      const token = request?.headers?.cookie?.replace('token=', '');
      if (!token) reply.code(401).send({ message: 'You are not authorize' });

      const verify = await jwt.verify(token, JWT_SECRET);

      if (Date.now() / 1000 < parseInt(verify.exp)) {
        reply.code(200).send({ success: true });
      }
    } catch (err) {
      throw new Error(err);
    }
  }
};

/**
 * @summary A function to get token
 * @param {string} username of login user
 * @returns {Promise<string>} value of token
 */
const tokenGenerator = async (username) => {
  return jwt.sign({ username: `${username}${Date.now()}` }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

export default handler;
