const Joi = require("joi");

const createContestSchema = {
  body: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(2000).required(),
    category: Joi.string().valid("coding", "quiz", "design", "hackathon", "other").required(),
    difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().greater(Joi.ref("startTime")).required().messages({
      "date.greater": "End time must be after start time",
    }),
    prizePool: Joi.number().min(0).optional(),
    pointsForParticipation: Joi.number().min(0).optional(),
    pointsForWinning: Joi.number().min(0).optional(),
    maxParticipants: Joi.number().min(0).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    coverImage: Joi.string().uri().optional().allow(""),
    questions: Joi.array()
      .items(
        Joi.object({
          questionText: Joi.string().required(),
          options: Joi.array().items(Joi.string()).min(2).required(),
          correctAnswer: Joi.number().min(0).required(),
          points: Joi.number().min(0).optional(),
        })
      )
      .optional(),
  }),
};

const submitAnswerSchema = {
  body: Joi.object({
    answers: Joi.array()
      .items(
        Joi.object({
          questionIndex: Joi.number().required(),
          selectedOption: Joi.number().required(),
        })
      )
      .required(),
    timeTakenSeconds: Joi.number().min(0).optional(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = { createContestSchema, submitAnswerSchema };
