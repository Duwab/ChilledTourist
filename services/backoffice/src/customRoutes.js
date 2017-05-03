// in src/customRoutes.js
import React from 'react';
import { Route } from 'react-router';
import SuperGraph from './SuperGraph';

export default () => (
    <Route>
        <Route path="/super-graph" component={SuperGraph} />
    </Route>
);
