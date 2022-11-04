export default {
  '!(*test).js': ['npm run lint', 'npm run prettier'],
  '*test.js': ['npm run lint', 'npm run prettier']
};
