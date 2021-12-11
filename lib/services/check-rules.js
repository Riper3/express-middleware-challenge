import fs from 'fs';
import checkTypes from './check-types';
import checkArrayTypes from './check-array-types';

export default async (req) => {
  const rawJson = await fs.readFileSync('lib/middleware/rules.json');

  const jsonData = await JSON.parse(rawJson);
  const errors = [];
  const pathData = jsonData.paths['/api/account' + req.path];
  const method = req.method.toLowerCase();

  if(pathData && pathData[method].parameters) {
    pathData[method].parameters.forEach(param => {
      const bodyLocation = req[param.in];

      if(param.in == 'body') {
        const schema = param.schema;

        schema.required.forEach(element => {
          if(!bodyLocation[element]) {
            errors.push(`The ${element} parameter is required in body`);
          } else if(!checkTypes(bodyLocation[element], schema.properties[element].type)) {
            errors.push(`The ${element} must be type ${schema.properties[element].type}`);
          }
        });

      } else if(param.in == 'query') {
        const value = req[param.in][param.name];
        const type = param.type;

        if(!value) {
          errors.push(`The ${param.name} parameter is required in query`);
        } else if(!checkTypes(value, type)) {
          errors.push(`The ${param.name} must be type ${param.type}`);
        } else if(type == 'array' && !checkArrayTypes(value, param.items.type)) {
          errors.push(`The array ${param.name} elements must be type ${param.items.type}`);
        }
      }

    });
  }

  return errors;
};
