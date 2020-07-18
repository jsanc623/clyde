const Router = require('koa-router');
const router = new Router();
const model = require('./rhinoceros');

// Fetches home status
router.get('/', (ctx) => {
  ctx.response.body = { 'status': 'ok' };
});

const cross_filter = function(haystack, needles, key_name){
  return haystack.filter(function(bale) {
    return needles.indexOf(bale[key_name].toLowerCase()) !== -1
  });
}

// Fetch all rhinoceros', with or without names/species filters
router.get('/rhinoceros', (ctx) => {
  let rhinoceroses = model.getAll();

  if(ctx.request.query['names']) {
    const names = ctx.request.query['names'].split(",").map(item => item.trim().toLowerCase());
    rhinoceroses = cross_filter(rhinoceroses, names, "name")
  }

  if(ctx.request.query['species']) {
    const species = ctx.request.query['species'].split(",").map(item => item.trim().toLowerCase());
    rhinoceroses = cross_filter(rhinoceroses, species, "species")
  }

  ctx.response.body = { rhinoceroses };
});

// Fetch a specific rhino
router.get('/rhinoceros/:id',async (ctx) => {
  try {
    await model.validation.getOne.validateAsync(ctx.params);
  } catch (err) {
    ctx.status = 400;
    return ctx.response.body = { message: err.message, raw: err };
  }
  ctx.response.body = model.getOne(ctx.params);
});

// Fetch all endangered rhinos
router.get('/endangered', (ctx) => {
  // Any species with a count less than this are considered endangered
  const species_ceil = 2;
  let rhinoceroses = model.getAll();

  // reduce and count species
  let counter = rhinoceroses.reduce(function (counter, current) {
    if (typeof counter[current['species']] == 'undefined') {
      counter[current['species']] = 0
    }
    counter[current['species']] += 1
    return counter;
  }, {});

  // determine which qualify as endangered
  let endangered = [];
  for(const specie in counter){
    if(counter[specie] > 0 && counter[specie] <= species_ceil) {
      endangered.push(specie);
    }
  }

  ctx.response.body = cross_filter(rhinoceroses, endangered, "species")
});

// Create a new rhino
router.post('/rhinoceros', async (ctx) => {
  try {
    await model.validation.newRhinoceros.validateAsync(ctx.request.body);
  } catch (err) {
    ctx.status = 400;
    return ctx.response.body = { message: err.message, raw: err };
  }
  ctx.response.body = model.newRhinoceros(ctx.request.body);
});

module.exports = router;
