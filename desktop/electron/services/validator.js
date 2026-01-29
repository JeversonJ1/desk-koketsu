const Logger = require('./logger');

const validators = {
  string: (value, minLength = 1, maxLength = 255) => {
    if (typeof value !== 'string') return false;
    return value.length >= minLength && value.length <= maxLength;
  },

  number: (value, min = 0, max = Infinity) => {
    if (typeof value !== 'number' || isNaN(value)) return false;
    return value >= min && value <= max;
  },

  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  },

  phone: (value) => {
    const regex = /^[\d\s\-\(\)]+$/;
    return regex.test(value) && value.length >= 10;
  },

  array: (value) => Array.isArray(value),

  object: (value) => value !== null && typeof value === 'object' && !Array.isArray(value),

  id: (value) => {
    return typeof value === 'number' && value > 0;
  }
};

class Validator {
  static validateProduct(product) {
    const errors = [];

    if (!this._validate('string', product.nome, 3, 100)) {
      errors.push('Nome deve ter entre 3 e 100 caracteres');
    }

    if (!this._validate('number', product.preco, 0.01)) {
      errors.push('Preço deve ser um número positivo');
    }

    if (!this._validate('number', product.estoque, 0)) {
      errors.push('Estoque deve ser um número não-negativo');
    }

    const categoria = product.categoria;
    const categoriaValida =
      categoria === undefined ||
      categoria === null ||
      categoria === '' ||
      this._validate('string', categoria, 1, 50) ||
      this._validate('id', categoria);

    if (!categoriaValida) {
      errors.push('Categoria inválida');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateClient(client) {
    const errors = [];

    if (!this._validate('string', client.nome_clientes, 3, 100)) {
      errors.push('Nome deve ter entre 3 e 100 caracteres');
    }

    if (!this._validate('email', client.email_clientes)) {
      errors.push('Email inválido');
    }

    if (!this._validate('phone', client.telefone_clientes)) {
      errors.push('Telefone inválido');
    }

    if (!this._validate('string', client.endereco_clientes, 5, 200)) {
      errors.push('Endereço inválido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateOrder(order) {
    const errors = [];

    // Cliente é opcional - pode ser null para clientes não cadastrados
    if (order.cliente_id && !this._validate('id', order.cliente_id)) {
      errors.push('ID do cliente inválido');
    }

    if (!this._validate('array', order.itens) || order.itens.length === 0) {
      errors.push('Pedido deve ter pelo menos um item');
    }

    if (order.itens && order.itens.length > 0) {
      order.itens.forEach((item, index) => {
        if (!this._validate('id', item.produto_id)) {
          errors.push(`Item ${index + 1}: ID do produto inválido`);
        }
        if (!this._validate('number', item.quantidade, 1)) {
          errors.push(`Item ${index + 1}: Quantidade deve ser maior que 0`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static _validate(type, value, ...args) {
    const validator = validators[type];
    if (!validator) {
      Logger.warn(`Validador '${type}' não encontrado`);
      return false;
    }
    return validator(value, ...args);
  }
}

module.exports = Validator;
