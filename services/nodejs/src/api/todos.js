import { Router } from 'express';
import resource from 'resource-router-middleware';
import facets from '../models/facets';
import {todos, todoItems} from '../controllers/index';

export default ({ config, db }) => {
	let api = Router();

	api.get('/test', (req, res) => {
    res.send({"message": "test OK"});
  });

	api.get('', todos.list);
	api.get('/:todoId', todos.retrieve);
	api.post('', todos.create);
	api.put('/:todoId', todos.update);
	api.delete('/:todoId', todos.destroy);


	api.post('/:todoId/items', todoItems.create);
	api.put('/:todoId/items/:todoItemId', todoItems.update);
	api.delete(
		'/:todoId/items/:todoItemId', todoItems.destroy
	);
	// For any other request method on todo items, we're going to return "Method Not Allowed"
  api.all('/:todoId/items', (req, res) =>
    res.status(405).send({
      message: 'Method Not Allowed',
  }));

  return api
}
