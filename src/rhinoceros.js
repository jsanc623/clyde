const uuidv4 = require('uuid/v4');
let rhinoceroses = require('./data');
const Joi = require('@hapi/joi');

const validation = {};
exports.validation = validation;

exports.getAll = () => {
  return rhinoceroses;
};

validation.getOne = Joi.object({ id: Joi.string().guid({ version : 'uuidv4' }).required()});
exports.getOne = (params) => {
  return rhinoceroses.find(el => el.id === params.id) || {}
}

validation.newRhinoceros = Joi.object({
  name: Joi.string().min(1).max(20).required(),
  species: Joi.string().valid('white_rhinoceros','black_rhinoceros','indian_rhinoceros','javan_rhinoceros','sumatran_rhinoceros').required(),
});
exports.newRhinoceros = data => {
  const newRhino = {
    id: uuidv4(),
    name: data.name,
    species: data.species,
  };
  rhinoceroses.push(newRhino);
  return newRhino;
};
