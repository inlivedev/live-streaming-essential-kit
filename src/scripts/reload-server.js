import * as child from 'child_process';

let server = global.server || {
  process: undefined
};

global.server = server;

function toExit() {
  if (server.process) {
    server.process.kill('SIGTERM');
    process.off('SIGTERM', toExit);
    process.off('exit', toExit);
    server.process = undefined;
  }
}

const serve = (serverFilePath, cwd, env) => {
  if (!cwd) {
    cwd = '.';
  }

  if (!server.process) {
    process.on('SIGTERM', toExit);
    process.on('exit', toExit);
  }

  return {
    name: 'reload server',
    generateBundle() {
      if (server.process) {
        toExit();
      }

      server.process = child.spawn('node', [serverFilePath], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
        detached: false,
        cwd,
        env: Object.assign({}, process.env, env)
      });
    }
  };
};

export { serve };
