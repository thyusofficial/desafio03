import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import PlansController from './app/controllers/PlansController';
import InscriptionController from './app/controllers/InscriptionController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import GymHelpOrderController from './app/controllers/GymHelpOrderController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hello World' }));
routes.post('/sessions', SessionController.store);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.post('/students/:id/help-orders', HelpOrderController.store);

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

routes.get('/help-orders', GymHelpOrderController.index);
routes.post('/help-orders/:id/answer', GymHelpOrderController.store);

export default routes;
