import * as Yup from 'yup';
import Inscription from '../models/Inscription';

class InscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails.',
      });
    }
    const { student_id, plan_id, start_date } = req.body;

    const inscription = await Inscription.create({
      student_id,
      plan_id,
      start_date,
    });
    return res.json(inscription);
  }
}

export default new InscriptionController();
