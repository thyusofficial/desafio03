import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import PlansController from './app/controllers/PlansController';
import InscriptionController from './app/controllers/InscriptionController';
import CheckinController from './app/controllers/CheckinController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hello World' }));
routes.post('/sessions', SessionController.store);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.post('/inscriptions', InscriptionController.store);
routes.get('/inscriptions', InscriptionController.index);
routes.put('/inscriptions/:id', InscriptionController.update);
routes.delete('/inscriptions/:id', InscriptionController.delete);

export default routes;
