import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Inscription from '../models/Inscription';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class InscriptionController {
  async index(req, res) {
    const inscriptions = await Inscription.findAll({
      include: [
        {
          model: Student,
          attributes: ['name'],
        },
        {
          model: Plan,
          attributes: ['title'],
        },
      ],
      attributes: ['start_date', 'end_date', 'price'],
      where: {
        active: 'true',
      },
    });
    return res.json({ inscriptions });
  }

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

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.price * plan.duration;

    const inscription = await Inscription.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Inscrição Realizada',
      text: 'Inscrição realizada na Gympoint.',
    });

    return res.json(inscription);
  }

  async update(req, res) {
    const { id } = req.params;
    const { plan_id, start_date } = req.body;

    const inscription = await Inscription.findByPk(id);

    if (!inscription) {
      return res.status(400).json({ error: 'Inscription not found.' });
    }
    const plan = await Plan.findByPk(plan_id);
    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.price * plan.duration;

    const newInscription = await inscription.update({
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(newInscription);
  }
}

export default new InscriptionController();
