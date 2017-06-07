// in src/users.js
import React from 'react';
import { List, Filter, Edit, Create, Delete, Datagrid, EditButton, EmailField, ReferenceField, ReferenceManyField, SingleFieldList, ChipField, TextField, SimpleForm, DisabledInput, TextInput, AutocompleteInput, SelectInput, ReferenceInput } from 'admin-on-rest/lib/mui';
import { required, minLength, maxLength, minValue, maxValue, number, regex, email, choices } from 'admin-on-rest';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { ListButton, DeleteButton } from 'admin-on-rest';


export const UserList = (props) => (
    <List title="All users" {...props} filters={<UserFilter/>}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="username" />
            <EmailField source="email" />
            <ReferenceField label="Recommended by" source="recommender_id" reference="users" allowEmpty>
                <TextField source="username" />
            </ReferenceField>
            <EditButton />
        </Datagrid>
    </List>
);

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const UserEditActions = ({ basePath, data, refresh }) => (
    <CardActions style={cardActionStyle}>
        <ListButton basePath={basePath} />
        <DeleteButton basePath={basePath} record={data} />
        <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
    </CardActions>
);

// <ReferenceManyField label="Recommandé par" reference="users" target="Recommenders">
//     <SingleFieldList>
//         <ChipField source="username" />
//     </SingleFieldList>
// </ReferenceManyField>

const UserTitle = ({ record }) => {
    return <span>{record ? `${record.username}` : ''}</span>;
};

const validateUserCreation = () => {
  // alert('custom');
  const errors = {};
  return errors;
}

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Username" source="q" />
        <TextInput label="Recommender" source="recommendedBy" />
    </Filter>
);


export const UserEdit = (props) => (
    <div>
      <Edit title={<UserTitle />} actions={<UserEditActions />} {...props}>
          <SimpleForm >
              <DisabledInput source="id" />
              <TextInput source="username" validate={required} />
              <TextInput source="email" type="email" validate={required}/>
              <ReferenceInput label="Recommandé par" source="recommender_id" reference="users"  allowEmpty>
                  <AutocompleteInput optionText={choice => `${choice.username}`} allowEmpty/>
              </ReferenceInput>
              <SelectInput source="status" choices={[
                  { id: 'delivered', name: 'delivered' },
                  { id: 'ordered', name: 'ordered' },
                  { id: 'cancelled', name: 'cancelled' },
              ]}/>
          </SimpleForm>
      </Edit>
      <Card style={{ marginTop: '2em', display: 'none' }}>
          <CardHeader title="You can add here some custom details about the user" />
          <CardText>Lorem ipsum sic dolor amet...</CardText>
      </Card>
    </div>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="username" validate={required} />
            <TextInput source="password" type="password" validate={required}  />
            <TextInput source="email" />
            <ReferenceInput label="Recommandé par" source="recommender_id" reference="users" allowEmpty>
                <AutocompleteInput optionText={choice => `${choice.username}`} allowEmpty/>
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

const UserDeleteTitle = ({ record, translate }) => <span>
    Are you sure you want to delete? &nbsp;
    {record && `${record.username}`}
</span>;

export const UserDelete = (props) => <Delete {...props} title={<UserDeleteTitle />} />;
