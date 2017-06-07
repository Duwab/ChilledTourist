// in src/Dashboard.js
import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { ViewTitle } from 'admin-on-rest/lib/mui';
import queryString from 'query-string';

export default (props) => (
  <div>
    {console.log('props', queryString.parse(props.location.search))}
    <ViewTitle title="Super Graph" />
    <Card style={{ margin: '2em' }}>
        <CardHeader title="Welcome to the SuperGraph" />
        <CardText>Lorem ipsum sic dolor amet...</CardText>
    </Card>
  </div>
);
