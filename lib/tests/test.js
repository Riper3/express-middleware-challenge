import assert from 'assert';
import checkRules from '../services/check-rules.js';

let tests = [];

const test = (name, fn) => {
  tests.push({ name, fn });
};

test('Should return an array with no errors', async () => {

    const req = {
      "path" : "/member",
      "method" : "DELETE",
      "body" : {
          "account_id": 1
      }
    };

    const result = await checkRules(req);

    assert.deepEqual(result, []);
});

test('Should return an array with one error', async () => {
    const req = {
      "path" : "/member",
      "method" : "DELETE",
      "body" : {

      }
    };

    const result = await checkRules(req);

    assert.deepEqual(result, [ 'The account_id parameter is required in body' ]);

});

tests.forEach(testruning => {

  try {

    testruning.fn();
    console.log('✅', testruning.name);

  } catch (error) {

    console.log('❌', testruning.name);
    console.log(error.stack);

  };
});
