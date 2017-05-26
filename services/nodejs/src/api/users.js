import { Router } from 'express';
import resource from 'resource-router-middleware';
import facets from '../models/facets';
import {users} from '../controllers/index';

export default ({ config, db }) => {
	let api = Router();

	api.get('', users.list);
	api.get('/:userId', users.retrieve);
	api.post('', users.create);
	api.put('/:userId/recommendBy/:recommenderId', users.recommend);
	api.put('/:userId', users.update);
	api.delete('/:userId', users.destroy);

  return api
}
