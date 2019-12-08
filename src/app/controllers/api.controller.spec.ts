// std
// The `assert` module provides a simple set of assertion tests.
import { ok, strictEqual } from 'assert';

// 3p
import { createController, getHttpMethod, getPath, isHttpResponseOK, Config } from '@foal/core';
import { connect, disconnect } from 'mongoose';

// App
import { HighScore } from '../models';
import { ApiController } from './api.controller';

require('dotenv').config();

// Define a group of tests.
describe('ApiController', () => {

  let controller: ApiController;

  // Create a connection to the database before running all the tets.
  before(async () => {
    let uri = Config.get<string>('mongodb.uri');
    uri = uri.replace('<dbuser>', process.env.TEST_DATABASE_USERNAME as string);
    uri = uri.replace('<dbpassword>', process.env.TEST_DATABASE_PASSWORD as string);
    connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
    await HighScore.deleteMany({});
  });

  // Close the database connection after running all the tests whether they succeed or failed.
  after(() => disconnect());

  // Create or re-create the controller before each test.
  beforeEach(() => controller = createController(ApiController));

  // Define a nested group of tests
  describe('has a "getHighScores" method that', () => {

    // Define a unit test
    it('should handle requests at GET /highscores', () => {
      // Throw an error and make the test fail if the http method of `getHighScores` is not GET.
      strictEqual(getHttpMethod(ApiController, 'getHighScores'), 'GET');
      // Throw an error and make the test fail if the path of `getHighScores` is not /todos.
      strictEqual(getPath(ApiController, 'getHighScores'), '/highscores');
    });

    // Define a unit test
    it('should return a HttpResponseOK.', async () => {
      // Create fake highscores.
      const highScore1 = new HighScore();
      highScore1.score = 100;
      highScore1.name = 'Sam';
      highScore1.time = 100;
      highScore1.powerUps = []; 

      const highScore2 = new HighScore();
      highScore2.score = 200;
      highScore2.name = 'Jeff';
      highScore2.time = 200;
      highScore2.powerUps = [{ type: 'MULTIPLIER', time: 100}];
      
      // Save the highscores. 
      await Promise.all([
        highScore1.save(),
        highScore2.save()
      ]);

      const response = await controller.getHighScores();
      ok(isHttpResponseOK(response), 'response should be an instance of HttpResponseOK.');

      const body = response.body;

      ok(Array.isArray(body), 'The body of the response should be an array.');
      strictEqual(body[0].name, 'Sam');
      strictEqual(body[0].score, 100);
      strictEqual(body[0].time, 100);
      ok(Array.isArray(body[0].powerUps), 'The body of the response should have a field `powerUps` that is an array');
      strictEqual(body[0].powerUps.length, 0);

      ok(Array.isArray(body), 'The body of the response should be an array.');
      strictEqual(body[1].name, 'Jeff');
      strictEqual(body[1].score, 200);
      strictEqual(body[1].time, 200);
      ok(Array.isArray(body[1].powerUps), 'The body of the response should have a field `powerUps` that is an array');
      strictEqual(body[1].powerUps.length, 1);
      strictEqual(body[1].powerUps[0].type, 'MULTIPLIER');
      strictEqual(body[1].powerUps[0].time, 100);
    });

  });

});
