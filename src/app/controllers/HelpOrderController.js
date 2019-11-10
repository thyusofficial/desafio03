import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;
    const helpOrders = await HelpOrder.findAll({
      where: { student_id: id },
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'You must have a question.' });
    }
    const helpOrder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
