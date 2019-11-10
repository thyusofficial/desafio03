import HelpOrder from '../models/HelpOrder';
import Mail from '../../lib/Mail';
import Student from '../models/Student';

class GymHelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      attributes: ['student_id', 'question'],
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const { id } = req.params;
    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
      ],
    });
    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order not found.' });
    }
    const { answer } = req.body;
    const date = new Date();

    await helpOrder.update({
      answer,
      answer_at: date,
    });

    await Mail.sendMail({
      to: `${helpOrder.Student.name} <${helpOrder.Student.email}>`,
      subject: 'Inscrição Realizada',
      template: 'helpOrder',
      context: {
        user: helpOrder.Student.name,
        question: helpOrder.question,
        answer,
      },
    });
    return res.json(helpOrder);
  }
}

export default new GymHelpOrderController();
