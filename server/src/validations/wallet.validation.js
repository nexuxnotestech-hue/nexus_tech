const Joi = require("joi");

const redeemRewardSchema = {
  params: Joi.object({
    rewardId: Joi.string().required().messages({
      "any.required": "Reward ID is required",
    }),
  }),
};

module.exports = { redeemRewardSchema };
