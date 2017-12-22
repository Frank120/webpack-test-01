import React from 'react';
import './style.scss';

const Layout = (props) => {
    const Content = props.content;
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <script src="./lib/promise.min.js"></script>
            </head>
            <body>
                <Comment {...props.contentProps} />
                <script src="./interface/interface.js" defer></script>
            </body>
        </html>
    );
};

export default Layout;