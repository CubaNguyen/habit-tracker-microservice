import * as Joi from 'joi';

export const validateEnv = (config: Record<string, unknown>) => {
  const schema = Joi.object({
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    RABBIT_URL: Joi.string().required(),
    DEFAULT_TIMEZONE: Joi.string().default('Asia/Ho_Chi_Minh'),
    SCHEDULE_HORIZON_DAYS: Joi.number().default(10),
  });

  const { error, value } = schema.validate(config, { allowUnknown: true });
  if (error) throw new Error(`❌ Env validation error: ${error.message}`);
  return value;
};
