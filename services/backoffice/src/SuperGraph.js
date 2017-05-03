// in src/Dashboard.js
import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { ViewTitle } from 'admin-on-rest/lib/mui';

export default () => (
  <div>
    <ViewTitle title="Super Graph" />
    <Card style={{ margin: '2em' }}>
        <CardHeader title="Welcome to the SuperGraph" />
        <CardText>Lorem ipsum sic dolor amet...</CardText>
    </Card>
  </div>
);
