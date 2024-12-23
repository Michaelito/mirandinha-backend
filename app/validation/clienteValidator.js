const Joi = require('joi');

const clienteSchema = Joi.object({
  razao_social: Joi.string().max(255).required(),
  cnpj: Joi.string()
    .length(14)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'CNPJ must be exactly 14 characters long',
      'string.pattern.base': 'CNPJ must contain only numeric characters'
    }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports = clienteSchema;
