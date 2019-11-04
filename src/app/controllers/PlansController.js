import Plan from '../models/Plan';

class PlansController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const planExists = await Plan.findOne({
      where: {
        title: req.body.title,
        duration: req.body.duration,
        price: req.body.price,
      },
    });
    if (planExists) {
      return res.status(400).json({
        error: 'Plan already exists.',
      });
    }
    const plan = await Plan.create(req.body);
    return res.json(plan);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, duration, price } = req.body;

    const plan = await Plan.findByPk(id);

    if (
      title !== plan.title &&
      duration !== plan.duration &&
      price !== plan.price
    ) {
      const planExists = await Plan.findOne({
        where: {
          title: req.body.title,
          duration: req.body.duration,
          price: req.body.price,
        },
      });
      if (planExists) {
        return res.status(400).json({
          error: 'Plan already exists.',
        });
      }
    }
    await plan.update(req.body);

    return res.json({ title, duration, price });
  }

  async delete(req, res) {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist.' });
    }

    plan.destroy(id);
    return res.json();
  }
}

export default new PlansController();
