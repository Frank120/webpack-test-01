import React from 'react';
import Layout from '../../static/layout.component';
import Hello from '../../static/pages/hello/component';


const Content = () => (
    <Hello />
);

const Hello = () => (<Layout content={Content} />);

export default Hello;