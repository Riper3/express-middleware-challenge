import fs from 'fs';
import checkTypes from './check-types';
import checkArrayTypes from './check-array-types';

export default async (req) => {
  const rawJson = await fs.readFileSync('lib/middleware/rules.json');

  const jsonData = await JSON.parse(rawJson);
  const errors = [];
  const pathData = jsonData.paths[`/api/account${req.path}`];
  const method = req.method.toLowerCase();
  let queryArrayRequested = [];

  if(pathData && pathData[method].parameters) {
    pathData[method].parameters.forEach(param => {
      const bodyLocation = req[param.in];

      // Validation for request with body

      if(param.in == 'body') {
        const schema = param.schema;

        // Check for extraneous parameters in a request with body

        Object.keys(bodyLocation).forEach(key => {
          if(!schema.required.includes(key)) {
            errors.push(`The ${key} must not be present`);
          }
        });

        schema.required.forEach(element => {
          if(!bodyLocation[element]) {
            errors.push(`The ${element} parameter is required in body`);
          } else if(!checkTypes(bodyLocation[element], schema.properties[element].type)) {
            errors.push(`The ${element} must be type ${schema.properties[element].type}`);
          }
        });

      // Validation for request with query

      } else if(param.in == 'query') {
        const value = bodyLocation[param.name];
        const type = param.type;

        queryArrayRequested.push(param.name);

        if(!value) {
          errors.push(`The ${param.name} parameter is required in query`);
        } else if(!checkTypes(value, type)) {
          errors.push(`The ${param.name} must be type ${param.type}`);
        } else if(type == 'array' && !checkArrayTypes(value, param.items.type)) {
          errors.push(`The array ${param.name} elements must be type ${param.items.type}`);
        }
      }

    });

    // Check for extraneous parameters in a request with query

    if(queryArrayRequested.length) {
      Object.keys(req.query).forEach(element => {
        if(!queryArrayRequested.includes(element)) {
          errors.push(`The ${element} must not be present`);
        }
      });
    }
  }


  return errors;
};
