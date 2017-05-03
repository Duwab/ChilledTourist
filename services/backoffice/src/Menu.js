// in src/Menu.js
import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

import {orange500} from 'material-ui/styles/colors';
// import {red500, green500, orange500} from 'material-ui/styles/colors';

import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';
import ChartIcon from 'material-ui/svg-icons/editor/multiline-chart';


export default ({ resources, onMenuTap, logout }) => (
    <div>
        <MenuItem
          containerElement={<Link to="/" />}
          primaryText="Dashboard"
          onTouchTap={onMenuTap}
          leftIcon={<DashboardIcon />} />
        <MenuItem containerElement={<Link to="/posts" />} primaryText="Posts" onTouchTap={onMenuTap} leftIcon={<PostIcon />}/>
        <MenuItem containerElement={<Link to="/users" />} primaryText="Users" onTouchTap={onMenuTap} leftIcon={<UserIcon />} />
        <MenuItem containerElement={<Link to="/super-graph" />} primaryText="Super Graph" onTouchTap={onMenuTap} leftIcon={<ChartIcon color={orange500}/>}/>
        {logout}
    </div>
);
