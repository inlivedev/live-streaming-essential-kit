import { html } from 'lit';

export const template = (pageComponent) => {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Starter Kit" />
        <title></title>
      </head>
      <body>
        <div id="app">${pageComponent}</div>
        <!--scripts-outlet-->
      </body>
    </html>`;
};
