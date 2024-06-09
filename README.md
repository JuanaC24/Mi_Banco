# Sistema de Gestión de Transferencias Bancarias

Este proyecto es un sistema de gestión de transferencias bancarias desarrollado en Node.js. Permite a los usuarios realizar transferencias entre cuentas, consultar las últimas transferencias y verificar saldos de cuentas. Es ideal para entidades financieras que buscan una solución simple y efectiva para la gestión de transacciones.

## Funcionalidades

- **Registro de Transferencias**: Permite a los usuarios registrar transferencias de dinero entre cuentas.
- **Consulta de Transferencias**: Los usuarios pueden ver las últimas 10 transferencias realizadas por una cuenta específica.
- **Consulta de Saldo**: Permite a los usuarios verificar el saldo actual de cualquier cuenta registrada.
- **Manejo Robusto de Errores**: Implementa un manejo avanzado de errores para asegurar la integridad de las transacciones.

## Tecnologías Utilizadas

Este proyecto está construido con las siguientes tecnologías:
- **Node.js**: Como entorno de ejecución del lado del servidor.
- **PostgreSQL**: Usado para la gestión de todas las transacciones y almacenamiento de datos.
- **dotenv**: Para la gestión de variables de entorno.

## Configuración Inicial

### Prerrequisitos

Necesitas tener instalado Node.js y PostgreSQL en tu máquina. También es esencial tener `npm` (Node package manager) para instalar las dependencias.

### Configuración de la Base de Datos

1. Instala PostgreSQL y crea una base de datos llamada `banco`.
2. Ejecuta el siguiente script SQL para configurar las tablas necesarias:

    ```sql
    CREATE TABLE cuentas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        saldo DECIMAL(10, 2) NOT NULL
    );

    CREATE TABLE transferencias (
        id SERIAL PRIMARY KEY,
        descripcion VARCHAR(255),
        fecha DATE,
        monto DECIMAL(10, 2),
        cuenta_origen INT,
        cuenta_destino INT,
        FOREIGN KEY (cuenta_origen) REFERENCES cuentas(id),
        FOREIGN KEY (cuenta_destino) REFERENCES cuentas(id)
    );
    ```

### Instalación del Proyecto

3. Clona el repositorio desde GitHub:

    ```
    git clone https://github.com/JuanaC24/Mi_Banco.git
    cd tu_repositorio
    ```

4. Instala todas las dependencias necesarias:

    ```
    npm install
    ```

5. Crea un archivo `.env` en la raíz del proyecto con las siguientes configuraciones de conexión a la base de datos:

    ```
    DB_USER=tu_usuario
    DB_HOST=localhost
    DB_DATABASE=banco
    DB_PASSWORD=tu_contraseña
    DB_PORT=5432
    ```

## Ejecución del Proyecto

Para iniciar el sistema, ejecuta el siguiente comando en la terminal:

node app.js


Sigue las instrucciones en consola para interactuar con el sistema. Se te presentará un menú de opciones para elegir las diferentes operaciones disponibles.

## Contribuciones

Las contribuciones son bienvenidas. Si tienes una sugerencia que podría mejorar este proyecto, por favor fork el repositorio y crea un pull request o simplemente abre un issue con la etiqueta "mejora".


## Autores

- **Juana Cortez** - Desarrollador Principal - [Perfil de GitHub](https://github.com/JuanaC24)

## Agradecimientos

- Agradecimientos a todos quienes contribuyeron con código, ideas y sugerencias para mejorar este proyecto.
