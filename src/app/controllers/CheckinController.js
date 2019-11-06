import { subDays, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;
    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
      attributes: ['student_id', 'created_at'],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }
    const now = new Date();
    const checkins = await Checkin.count({
      where: {
        student_id: student.id,
        created_at: {
          [Op.between]: [subDays(now, 7), endOfWeek(now)],
        },
      },
    });
    if (checkins && checkins >= 5) {
      return res
        .status(400)
        .json({ error: `User ${student.name} reached week checkin limit.` });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });
    return res.json(checkin);
  }
}

export default new CheckinController();
