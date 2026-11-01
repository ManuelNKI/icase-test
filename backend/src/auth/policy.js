module.exports = {
  "habilitada": true,
  "expiracion": "8h",
  "roles": {
    "cliente": {
      "nombre": "Cliente",
      "autoregistro": false
    },
    "personal-de-cocina": {
      "nombre": "Personal de Cocina",
      "autoregistro": false
    },
    "mesero": {
      "nombre": "Mesero",
      "autoregistro": false
    },
    "caja": {
      "nombre": "Caja",
      "autoregistro": false
    }
  },
  "operaciones": {
    "rf-01": {
      "cliente": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-02": {
      "cliente": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-03": {
      "cliente": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-04": {
      "cliente": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-05": {
      "personal-de-cocina": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-06": {
      "personal-de-cocina": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-07": {
      "mesero": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-08": {
      "mesero": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-09": {
      "caja": [
        "GET",
        "POST",
        "PATCH",
        "DELETE"
      ]
    },
    "rf-10": {}
  }
};
