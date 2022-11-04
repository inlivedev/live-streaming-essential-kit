import path from 'path';
import { Readable } from 'stream';
import { pageLoader } from './page-loader.js';
import { readNodeStream } from './read-node-stream.js';
import '@lit-labs/ssr/lib/install-global-dom-shim.js';
import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import { template } from '../template.js';

const root = process.cwd();

const pagesDirectoryPath = path.resolve(root, `build/__client/pages`);

export const ssrEntryServer = async (fastify) => {
  try {
    const pages = await pageLoader(fastify, pagesDirectoryPath);
    if (pages.length) {
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { path, module } = page;

        fastify.all(path, async (request, reply) => {
          let data = {
            props: {}
          };

          const isApiRoute = path.startsWith('/api');

          if (isApiRoute && module.default.name === 'handler') {
            await module.default(request, reply);
          } else if (!isApiRoute) {
            if (module.getServerSideProps) {
              const response =
                (await module.getServerSideProps(request, reply)) || {};
              data.props =
                typeof response.props === 'object'
                  ? response.props
                  : data.props;
            }

            if (module.default) {
              const renderedTemplate = render(
                template(module.default(data.props))
              );
              const readableStream = Readable.from(renderedTemplate);
              const ssrResult = await readNodeStream(readableStream);
              let scripts = module.scripts ? module.scripts : '';

              const html = ssrResult.replace(`<!--scripts-outlet-->`, scripts);
              reply.type('text/html').send(html);
            } else {
              throw new Error('Default export is needed for each pages file');
            }
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
