import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

let pages = [];

export const pageLoader = (fastify, pagesDirectoryPath) => {
  return readPagesRecursive(fastify, pagesDirectoryPath, pagesDirectoryPath)
    .then(() => {
      return pages;
    })
    .catch((error) => {
      throw error;
    });
};

const readPagesRecursive = async (fastify, rootPath, currentPath) => {
  const files = fs.readdirSync(currentPath, { withFileTypes: true });
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];

    if (file.isDirectory()) {
      const currentDirectory = `${currentPath}/${file.name}`;
      await readPagesRecursive(fastify, rootPath, currentDirectory);
    } else if (file.isFile()) {
      const fileURL = pathToFileURL(`${currentPath}/${file.name}`);
      const parsePath = path.parse(fileURL.pathname);
      const fileWithoutExtension = parsePath.name;
      const fileExtension = parsePath.ext;

      if (fileExtension === '.js') {
        const currentDirectory = currentPath.replace(rootPath, '');

        let urlpath = `${currentDirectory}/${fileWithoutExtension}`;
        let pageModule = {
          default: undefined,
          getServerSideProps: undefined,
          scripts: undefined
        };

        import(fileURL)
          .then((module) => {
            pageModule.default = module.default;
            pageModule.getServerSideProps = module.getServerSideProps;
            pageModule.scripts = module.scripts;
            return;
          })
          .catch((error) => {
            throw error;
          });

        const splitPath = urlpath.split('/');

        let pathCounter = splitPath.length - 1;

        do {
          let individualPath = splitPath[pathCounter];
          if (individualPath === 'index') {
            splitPath.pop();
            pathCounter--;
          } else if (
            individualPath[0] === '_' &&
            individualPath[individualPath.length - 1] === '_'
          ) {
            individualPath = individualPath.substring(
              1,
              individualPath.length - 1
            );
            splitPath[pathCounter] = `:${individualPath}`;
            pathCounter--;
          } else {
            pathCounter--;
          }
        } while (pathCounter > 0);

        urlpath = splitPath.join('/');
        urlpath = urlpath ? urlpath : '/';

        pages.push({
          path: urlpath,
          module: pageModule
        });
      }
    }
  }
};
