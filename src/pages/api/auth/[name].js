import jwt from 'jsonwebtoken';

const handler = async (request, reply) => {
  const name = request?.params?.name;

  const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

  if (name == 'login') {
    try {
      const { username, password } = request.body;

      const valid_credentials =
        username === 'username' && password === 'password';

      if (!valid_credentials)
        reply.code(400).send({ message: 'Invalid credentials' });

      reply.code(200).send({ success: true });
    } catch (err) {
      throw new Error(err);
    }
  } else if (name == 'generateToken') {
    const { username, password } = request.body;

    const valid_credentials =
      username === 'username' && password === 'password';

    if (!valid_credentials)
      reply.code(400).send({ message: 'Invalid credentials' });

    try {
      const token = jwt.sign(
        { username: `${username}${Date.now()}` },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN
        }
      );

      reply.code(200).send({ token });
    } catch (err) {
      throw new Error(err);
    }
  } else if (name === 'validation') {
    try {
      if (!request.headers.authorization)
        reply.code(401).send({ message: 'You are not authorize' });

      const token = request.headers.authorization.replace('Bearer ', '');

      const verify = await jwt.verify(token, JWT_SECRET);

      if (Date.now() < parseInt(verify.exp))
        reply.code(200).send({ success: true });
    } catch (err) {
      throw new Error(err);
    }
  }
};

export default handler;
