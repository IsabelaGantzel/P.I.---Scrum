/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('projects/:projectId', 'ProjectsController.show')
Route.get('projects', 'ProjectsController.index')
Route.post('projects', 'ProjectsController.store')

Route.post('projects/:projectId/sprint-tasks', 'SprintsController.store')

Route.get('tasks/:taskId/next-stage', 'TasksController.nextStage')
Route.get('tasks/:taskId/prev-stage', 'TasksController.prevStage')
