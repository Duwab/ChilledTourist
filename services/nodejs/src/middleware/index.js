import { Router } from 'express';
import auth from './security/auth';

export default ({ config, db }) => {
	let routes = Router();

	// add middleware here
	routes.use(auth({ config, db }));
	return routes;
}
