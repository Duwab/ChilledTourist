import { simpleRestClient } from 'admin-on-rest';

const restClient = simpleRestClient('http://localhost:3001');
export default (type, resource, params) => new Promise(resolve => setTimeout(() => resolve(restClient(type, resource, params)), 500));
