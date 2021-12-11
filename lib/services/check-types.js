export default (value, type) => {

  let boolean = false;

  switch (type) {
    case 'integer':
      boolean = Number.isInteger(parseInt(value));
      break;
    case 'string':
      boolean = (typeof value == 'string');
      break;
    case 'array':
      try {
        boolean = Array.isArray(JSON.parse(value));
      } catch(e) {

      }
      break;
    case 'object':
      try {
        boolean = (typeof JSON.parse(value) == 'object');
      } catch(e) {

      }
      break;
  }

  return boolean;

};
