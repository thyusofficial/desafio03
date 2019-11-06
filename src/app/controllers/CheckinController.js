import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    const date = new Date();

    return res.json({ ok: true });
  }
}

export default new CheckinController();
