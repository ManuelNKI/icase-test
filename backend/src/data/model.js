module.exports = {
  "database": "postgres",
  "tables": {
    "cliente": {
      "entity": "Cliente",
      "columns": [
        {
          "name": "nombre",
          "column": "nombre",
          "type": "string"
        },
        {
          "name": "telefono",
          "column": "telefono",
          "type": "string"
        },
        {
          "name": "correo",
          "column": "correo",
          "type": "string"
        }
      ],
      "references": []
    },
    "menu": {
      "entity": "Menu",
      "columns": [
        {
          "name": "version",
          "column": "version",
          "type": "string"
        }
      ],
      "references": []
    },
    "platillo": {
      "entity": "Platillo",
      "columns": [
        {
          "name": "nombre",
          "column": "nombre",
          "type": "string"
        },
        {
          "name": "precio",
          "column": "precio",
          "type": "number"
        },
        {
          "name": "disponible",
          "column": "disponible",
          "type": "boolean"
        },
        {
          "name": "menu_id",
          "column": "menu_id",
          "type": "id",
          "references": "menu",
          "enforced": true
        },
        {
          "name": "pedido_id",
          "column": "pedido_id",
          "type": "id",
          "references": "pedido",
          "enforced": true
        }
      ],
      "references": [
        {
          "column": "menu_id",
          "table": "menu"
        },
        {
          "column": "pedido_id",
          "table": "pedido"
        }
      ]
    },
    "reserva": {
      "entity": "Reserva",
      "columns": [
        {
          "name": "fechaHora",
          "column": "fecha_hora",
          "type": "datetime"
        },
        {
          "name": "codigoQR",
          "column": "codigo_qr",
          "type": "string"
        },
        {
          "name": "estado",
          "column": "estado",
          "type": "string"
        },
        {
          "name": "cliente_id",
          "column": "cliente_id",
          "type": "id",
          "references": "cliente",
          "enforced": true
        },
        {
          "name": "mesa_id",
          "column": "mesa_id",
          "type": "id",
          "references": "mesa",
          "enforced": true
        }
      ],
      "references": [
        {
          "column": "cliente_id",
          "table": "cliente"
        },
        {
          "column": "mesa_id",
          "table": "mesa"
        }
      ]
    },
    "mesa": {
      "entity": "Mesa",
      "columns": [
        {
          "name": "numero",
          "column": "numero",
          "type": "integer"
        },
        {
          "name": "capacidad",
          "column": "capacidad",
          "type": "integer"
        },
        {
          "name": "estado",
          "column": "estado",
          "type": "string"
        }
      ],
      "references": []
    },
    "pedido": {
      "entity": "Pedido",
      "columns": [
        {
          "name": "fechaHora",
          "column": "fecha_hora",
          "type": "datetime"
        },
        {
          "name": "estado",
          "column": "estado",
          "type": "string"
        },
        {
          "name": "cliente_id",
          "column": "cliente_id",
          "type": "id",
          "references": "cliente",
          "enforced": true
        },
        {
          "name": "mesa_id",
          "column": "mesa_id",
          "type": "id",
          "references": "mesa",
          "enforced": true
        },
        {
          "name": "pago_id",
          "column": "pago_id",
          "type": "id",
          "references": "pago",
          "enforced": false
        }
      ],
      "references": [
        {
          "column": "cliente_id",
          "table": "cliente"
        },
        {
          "column": "mesa_id",
          "table": "mesa"
        }
      ]
    },
    "paquete_prepagado": {
      "entity": "PaquetePrepagado",
      "columns": [
        {
          "name": "descripcion",
          "column": "descripcion",
          "type": "string"
        },
        {
          "name": "saldo",
          "column": "saldo",
          "type": "number"
        },
        {
          "name": "cliente_id",
          "column": "cliente_id",
          "type": "id",
          "references": "cliente",
          "enforced": true
        }
      ],
      "references": [
        {
          "column": "cliente_id",
          "table": "cliente"
        }
      ]
    },
    "pago": {
      "entity": "Pago",
      "columns": [
        {
          "name": "monto",
          "column": "monto",
          "type": "number"
        },
        {
          "name": "metodo",
          "column": "metodo",
          "type": "string"
        }
      ],
      "references": []
    },
    "puntos": {
      "entity": "Puntos",
      "columns": [
        {
          "name": "cantidad",
          "column": "cantidad",
          "type": "integer"
        },
        {
          "name": "cliente_id",
          "column": "cliente_id",
          "type": "id",
          "references": "cliente",
          "enforced": true
        }
      ],
      "references": [
        {
          "column": "cliente_id",
          "table": "cliente"
        }
      ]
    },
    "icase_records": {
      "entity": null,
      "generic": true,
      "columns": [],
      "references": []
    }
  },
  "operations": {
    "rf-01": "menu",
    "rf-02": "reserva",
    "rf-03": "paquete_prepagado",
    "rf-04": "puntos",
    "rf-05": "pedido",
    "rf-06": "icase_records",
    "rf-07": "mesa",
    "rf-08": "reserva",
    "rf-09": "cliente",
    "rf-10": "menu"
  },
  "associations": []
};
