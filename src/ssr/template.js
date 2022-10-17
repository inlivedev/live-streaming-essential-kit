import { html } from 'lit';

export const template = (pageComponent) => {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Starter Kit" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
          }
        </style>
        <title></title>
      </head>
      <body>
        <div id="app">${pageComponent}</div>
        <!--scripts-outlet-->
      </body>
    </html>`;
};
