import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Inscription from '../models/Inscription';
import Plan from '../models/Plan';
import Student from '../models/Student';

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

    const student = await Student.findByPk(student_id);
    const plan = await Plan.findByPk(plan_id);

    if (!(await student)) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }
    if (!(await plan)) {
      return res.status(400).json({ error: 'Plan does not exist.' });
    }

    const studentRegistered = await Inscription.findOne({
      where: {
        student_id,
      },
    });
    if (studentRegistered) {
      return res
        .status(400)
        .json({ error: 'Student is already registered on a plan.' });
    }

    const end_date = await addMonths(parseISO(start_date), plan.duration);
    const price = await (plan.price * plan.duration);

    const inscription = await Inscription.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
    return res.json(inscription);
  }
}

export default new InscriptionController();
