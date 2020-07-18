# Clyde Code Challenge

## Intro

Thank you for taking the time to go through Clyde's application process. Your code challenge will consist of adding to and modifying this project, and then walking a member of the Clyde team through the changes you've made and explaining your work.

Be sure to work independently but feel free to use any online resources available to you or reach out to us with questions. Once you have completed your work contact us and schedule a time for us to review it together.

This project is a simple JSON API written in Node.js, using the Koa framework. It currently contains two routes:

| Method | Path        | Description                                |
| ------ | ----------- | ------------------------------------------ |
| GET    | /rhinoceros | Returns all Rhinos that have been created  |
| POST   | /rhinoceros | Adds a new Rhino to the collection         |

## Running the project

If you have Node.js installed locally you can run the project from the `src` directory with `npm start`. Be sure to install the node modules first with `npm install`

If you don't have Node.js installed locally you can either download it [here](https://nodejs.org/en/download) or run the project via Docker. You can find installation instructions for Docker [here](https://docs.docker.com/install).

Once you have Docker installed and running you can start the project via docker-compose with `docker-compose build && docker-compose up`. If you need to run the project on a port other than `3000` make sure you update all of the appropriate values in `docker-compose.yaml`.

## Tasks

### 1. Add a new route to the API
Add a new route to the API that allows a user to fetch a specific Rhino by its ID.

### 2. Add validation to the Create Rhino route
The Create Rhino route contains no validation. Add validation to the route that satisfies the following criteria:

- The body of the request must contain a `name` key with a string value between 1 and 20 characters in length.
- The body of the request must contain a `species` key with a string value representing the species of the Rhino to be added. This value must be one of the following: `white_rhinoceros`, `black_rhinoceros`, `indian_rhinoceros`, `javan_rhinoceros`, `sumatran_rhinoceros`
- The body should contain no additional keys.

If the above criteria are not met the route should return an appropriate error response.

### 3. Add filters to the Get All Rhinos route
The Get All Rhinos route currently returns every Rhino that has been added to list. Modify this route so a user can pass in additional parameters on their request that allow them to do the following:
- Return all Rhinos of a specified species (from the list above)
- Return all Rhinos with the specified name

### 4. Add a route that returns Endangered Rhinos
Add an `endangered` route to the API that returns all Rhinos that belong to an endangered species.

For the purpose of this problem, a species is considered endangered when there are only one or two individuals of that species in the data.

## Node Modules

The following node modules are used as part of the project and you may wish to reference their documentation as you work through the problems below:
- [koa](http://koajs.com)
- [koa-router](https://www.npmjs.com/package/koa-router)
- [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser)
- [uuid](https://www.npmjs.com/package/uuid)


## Testing the API
Feel free to test the API with whatever tool is most comfortable for you. We prefer using curl or Postman.

[You can get postman here](https://www.getpostman.com/apps)

Here are example curl commands for the default routes:

```bash
curl http://127.0.0.1:3000/rhinoceros

curl http://127.0.0.1:3000/rhinoceros -X POST -d '{"name":"Clyde","species":"white_rhinoceros"}' -H "Content-Type: application/json"
```

## Things to keep in mind

This is a JSON-based API.

Feel free to expand beyond the scope of the tasks.

You are both welcome and encouraged to use any resources available to you, but any work you submit should be your own.

There are many ways to handle all of the tasks in this challenge. We don't expect or require that everything be done in the most optimal way but we do expect you to explain your decisions.

