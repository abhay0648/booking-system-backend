const paymentService = require('../services/payment.service');

const webhook = async (req, res) => {
  try {
    const result = await paymentService.handleWebhook(req.body);

    res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  webhook,
};