import checkTypes from './check-types';

export default (array, type) => {

  let boolean = true;

  try {
    JSON.parse(array).forEach(element => {
      if(!checkTypes(element, type)) {
        boolean = false;
        return;
      }
    });
  } catch { };

  return boolean;
};
