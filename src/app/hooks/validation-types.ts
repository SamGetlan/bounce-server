const integer = {
  type: 'integer',
}

const string = {
  type: 'string'
}

const powerUp = {
  type : 'object',
  properties : {
    type: {
      type: 'string'
    },
    time: {
      type: 'integer'
    },
  },
  required: ['type', 'time']
}

export class ValidationTypes {
  static integer = integer;
  static string = string;
  static powerUp = powerUp;
}