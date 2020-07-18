//routes.test.js
const request = require('supertest');
const server = require('../server.js');

beforeAll(async () => {
    console.log('starting router test');
});

// close the server after each test
afterAll(() => {
    server.close();
    console.log('closing server');
});

describe('basic router test', () => {
    test('route GET /', async () => {
        const response = await request(server).get('/');
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /blahblah for 404', async () => {
        const response = await request(server).get('/blahblah');
        expect(response.status).toEqual(404);
    });
});

describe('test router GET routes', function () {
    test('route GET /rhinoceros', async () => {
        const response = await request(server).get('/rhinoceros')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)['rhinoceroses']).toMatchSnapshot();
    });
    test('route GET /rhinoceros/:id - good UUID', async () => {
        const response = await request(server).get('/rhinoceros/a832bb9e-f20b-4be5-94aa-cf7883939b67')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /rhinoceros/:id - bad UUID', async () => {
        const response = await request(server).get('/rhinoceros/asdfasdf')
        expect(response.status).toEqual(400);
    });
    test('route GET /rhinoceros?name=Clyde', async () => {
        const response = await request(server).get('/rhinoceros?names=Clyde')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /rhinoceros?name=Clyde,clYdette', async () => {
        const response = await request(server).get('/rhinoceros?names=Clyde,clYdette')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /rhinoceros?species=white_rhinoceros', async () => {
        const response = await request(server).get('/rhinoceros?species=white_rhinoceros')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /rhinoceros?species=white_rhinoceros,javan_rhinoceros', async () => {
        const response = await request(server).get('/rhinoceros?species=white_rhinoceros,javan_rhinoceros')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /rhinoceros?species=', async () => {
        const response = await request(server).get('/rhinoceros?species=')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /rhinoceros?name=&species=', async () => {
        const response = await request(server).get('/rhinoceros?name=&species=')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /rhinoceros?names=clyde,Clydette,winston,spike,debra,stompy%20jr,reginald,phil,stompy,stompy&species=white_rhinoceros,javan_rhinoceros', async () => {
        const response = await request(server).get('/rhinoceros?names=clyde,Clydette,winston,spike,debra,stompy%20jr,reginald,phil,stompy,stompy&species=white_rhinoceros,javan_rhinoceros')
        expect(response.status).toEqual(200);
        expect(JSON.parse(response.text)).toMatchSnapshot();
    });
    test('route GET /endangered', async () => {
        // Initial check - we should have 1 based on seeded data
        const response = await request(server).get('/endangered');
        expect(response.status).toEqual(200);
        const parsed_response = JSON.parse(response.text);
        expect(parsed_response).toMatchSnapshot();
        expect(parsed_response.length).toEqual(1);

        // Add a new black rhino - meets endangered
        const response_add_amber = await request(server).post('/rhinoceros').send({
            name: 'Amber',
            species: 'black_rhinoceros'
        })
        expect(response_add_amber.status).toEqual(200);

        // Add another black rhino - meets endangered
        const response_add_alexandra = await request(server).post('/rhinoceros').send({
            name: 'Alexandra',
            species: 'black_rhinoceros'
        })
        expect(response_add_alexandra.status).toEqual(200);

        // Check for endangered - should expect 3
        const response_additional = await request(server).get('/endangered');
        expect(response_additional.status).toEqual(200);
        let parsed_response_additional = JSON.parse(response_additional.text);
        expect(parsed_response_additional.length).toEqual(3);

        // Add one more black rhino, should no longer count as endangered (based on required 2)
        const response_add_kate = await request(server).post('/rhinoceros').send({
            name: 'Kate',
            species: 'black_rhinoceros'
        })
        expect(response_add_kate.status).toEqual(200);

        // Check, should be back to 1
        const response_additional_2 = await request(server).get('/endangered');
        expect(response_additional_2.status).toEqual(200);
        let parsed_response_additional_2 = JSON.parse(response_additional_2.text);
        expect(parsed_response_additional_2.length).toEqual(1);
    });
});

describe('test router POST routes', function () {
    test('route POST /rhinoceros - good request', async () => {
        const response = await request(server).post('/rhinoceros').send({
            name: 'Tiny',
            species: 'white_rhinoceros'
        })
        expect(response.status).toEqual(200);

        // verify
        const res = JSON.parse(response.text)['id'];
        const responseGet = await request(server).get(`/rhinoceros/${res}`)
        const responseParsed = JSON.parse(responseGet.text)
        expect(responseParsed['name']).toEqual('Tiny')
    });
    test('route POST /rhinoceros - name too long', async () => {
        const response = await request(server).post('/rhinoceros').send({
            name: 'TinyTinyTinyTinyTinyTiny',
            species: 'white_rhinoceros'
        })
        expect(response.status).toEqual(400);
    });
    test('route POST /rhinoceros - name too short', async () => {
        const response = await request(server).post('/rhinoceros').send({
            name: '',
            species: 'white_rhinoceros'
        })
        expect(response.status).toEqual(400);
    });
    test('route POST /rhinoceros - bad species', async () => {
        const response = await request(server).post('/rhinoceros').send({
            name: '',
            species: 'possibly_not_a_rhino'
        })
        expect(response.status).toEqual(400);
    });
    test('route POST /rhinoceros - extra unknown key', async () => {
        const response = await request(server).post('/rhinoceros').send({
            name: '',
            species: 'white_rhinoceros',
            its_a_hidden_key: 'with_some_data'
        })
        expect(response.status).toEqual(400);
    });
});
