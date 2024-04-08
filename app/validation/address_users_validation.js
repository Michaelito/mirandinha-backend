const Joi = require('joi');

module.exports = function (obj, next) {

    console.log(obj)

    // Definindo um esquema para o objeto
    const schema = Joi.object({
        user_id: Joi.number().integer().positive(),
        cep: Joi.string().min(9).max(9).required(),
        numero: Joi.string().required(),

        // Adicione mais campos e validações conforme necessário
    });

    // Validando o objeto
    const { error } = schema.validate(obj);

    // Verificando se há erro
    if (error) {
        console.error('Erro de validação:', error.details);




        throw new Error(JSON.stringify(error.details));


        //return error.details;
    }



};