import assert from 'assert';

const readNodeStream = (readableStream, encoding = 'utf8') => {
  readableStream.setEncoding(encoding);
  return new Promise((resolve, reject) => {
    let data = '';
    readableStream.on('data', (chunk) => {
      assert.equal(typeof chunk, 'string');
      data += chunk;
    });
    readableStream.on('end', () => resolve(data));
    readableStream.on('error', (error) => reject(error));
  });
};

export { readNodeStream };
