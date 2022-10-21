export const validation = async (request) => {
  try {
    const token = request?.cookies?.token;

    if (!token) return false;

    const verify = await request.jwtVerify();

    if (Date.now() / 1000 < Number.parseInt(verify.exp)) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
};
