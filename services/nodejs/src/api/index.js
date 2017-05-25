import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import todosRoutes from './todos';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));
	api.use('/todos', todosRoutes({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version, "other 223": 212323233 });
	});

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version, "other 223": 212323233, "message": "This is the default route" });
	});

	return api;
}
