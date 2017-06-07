// in src/App.js
import React from 'react';

import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';
// import { Delete } from 'admin-on-rest/lib/mui';

import authClient from './authClient';
import Menu from './Menu';
import customRoutes from './customRoutes';

import {Dashboard} from './Dashboard/simple-dashboard';
// import { PostList, PostEdit, PostCreate } from './posts';
import { UserList, UserCreate, UserEdit, UserDelete } from './Users/users';

// import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';

const App = () => (
    <Admin
      authClient={authClient}
      menu={Menu}
      title="Mon BO Admin Rest"
      customRoutes={customRoutes}
      dashboard={Dashboard}
      restClient={jsonServerRestClient('http://localhost:3001/api')}>
        <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit} remove={UserDelete} icon={UserIcon}/>
    </Admin>
);

export default App;

// http://jsonplaceholder.typicode.com
// <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} icon={PostIcon}/>
