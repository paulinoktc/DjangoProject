<p align="center">
  <a href="https://www.djangoproject.com/" target="_blank">
    <img src="https://static.djangoproject.com/img/logos/django-logo-negative.svg" width="300" alt="Django Logo">
  </a>
</p>

# Frontend Gestión de Clientes - Django

Este frontend se conecta con el API laravel https://github.com/paulinoktc/ApiLaravel


Está construida usando **Django** y **Django Rest Framework**.

---

## Requisitos

- Python 3.11+
- Django 5.2+
- Base de datos MySQL

---

## Rutas

### Clientes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | /clientes/ | Listar todos los clientes |
| GET    | /clientes/details/{id}/ | Obtener detalles de un cliente por ID junto con sus contratos usa  ```  ?includeContratos=false```  para incluirlos|

#### Ejemplos de respuestas

**Listar clientes (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "1234567890"
  },
  {
    "id": 2,
    "name": "Ana López",
    "email": "ana@example.com",
    "phone": "9876543210"
  }
]
```
**Listar clientes con contratos (200 OK):**

```json
{
  "data": {
    "id": 6,
    "name": "roman",
    "email": "aspefrez@gmail.com",
    "phone": "3567871233",
    "status": "inactive",
    "created_at": "30/08/2025 15:28",
    "updated_at": "30/08/2025 15:28",
    "contratos": [
      {
        "id": 6,
        "cliente_id": 6,
        "numero_contrato": "620250831144234224",
        "monto": 25000.5,
        "fecha_inicio": "2025-09-01",
        "fecha_fin": "2025-09-26"
      },
      {
        "id": 7,
        "cliente_id": 7,
        "numero_contrato": "620250831145313375",
        "monto": 1500,
        "fecha_inicio": "2025-08-15",
        "fecha_fin": "2025-09-06"
      },
    
    ]
  }
}
```
