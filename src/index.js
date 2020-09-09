import React from 'react';
import ReactDOM from 'react-dom';
import Normalize from 'react-normalize';
import IndexPage from './pages';

ReactDOM.render(
    <div>
        <Normalize />
        <IndexPage />
    </div>,
    document.getElementById('root')
);
