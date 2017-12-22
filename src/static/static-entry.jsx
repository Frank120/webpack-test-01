import React from 'react';
import ReactDomServer from 'react-dom/server';

import Hello from '../entries/hello/template';

const render = () => ({
    '/hello.html': `<!DOCTYPE html>${ReactDomServer.renderToStaticMarkup((<Hello />))}`
});

export default render;