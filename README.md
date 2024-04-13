# Task-Leveling

Task-Leveling (PWA) combina la gestión de tareas con elementos RPG. Organiza tus tareas diarias como si fueran misiones épicas, asignándoles niveles de importancia y estableciendo prioridades. ¡Domina tus responsabilidades y conviértete en el héroe de tu propia aventura diaria con Task-Leveling!

## Guía de Instalación

Para instalar el proyecto Task-Leveling, sigue estos pasos:

1. Clona el repositorio desde GitHub:

```bash
git clone https://github.com/Joshua-desings/TASK-LEVELING.git
```

La estructura del proyecto se divide en dos carpetas: `Frontend` y `Backend`. 

2. En cada carpeta, instala las dependencias utilizando npm:

```bash
cd Frontend
npm install

cd Backend
npm install
```

3. En la carpeta Backend, crea un archivo de entorno .env con los siguientes campos:

```bash
PORT=<PUERTO>
MONGODB_URI=<URI_DE_MONGODB>
NODE_ENV=development
ACCESS_TOKEN_SECRET=<TOKEN_SECRETO>

ADMIN_USERNAME=<NOMBRE_DE_ADMIN>
ADMIN_EMAIL=<EMAIL_DE_ADMIN>
ADMIN_PASSWORD=<CONTRASEÑA_DE_ADMIN>
```

Asegúrate de que los campos relacionados con el administrador (ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD) sean importantes ya que definirán al primer administrador de la base de datos.

4. Después de conectar a la base de datos MongoDB especificada en el archivo .env, inicia el servidor en la carpeta Backend con el comando:

```bash
npm start
```

5. En la carpeta Frontend, la aplicación se iniciara en el puerto 3000 con el comando:

```bash
npm run dev
```

6. Accede a la aplicación en tu navegador visitando http://localhost:3000.

## Instalando como PWA

Si deseas probar el proyecto como una PWA, ejecuta el siguiente comando para crear la carpeta dist que contiene todos los archivos necesarios:

```bash
npm run build
```

Y luego, para ejecutar la aplicación como una PWA, utiliza el comando:
```bash
serve dist
```
Si estas usando google chrome por ejemplo deberia salirte un simbolo en la barra de direcciones para instalar como PWA la aplicacion.

## Tecnologías Utilizadas

Backend
- Express: Framework de Node.js para construir aplicaciones web y API.
- MongoDB y Mongoose: Base de datos NoSQL y ODM para la gestión de datos.
- bcryptjs: Librería para el hashing de contraseñas.
- jsonwebtoken: Implementación de JSON Web Tokens para la autenticación.
- cors: Middleware para habilitar el intercambio de recursos entre diferentes orígenes.

Frontend
- React: Biblioteca de JavaScript para construir interfaces de usuario.
- Material-UI: Biblioteca de componentes React para un diseño más rápido y fácil.
- Axios: Cliente HTTP basado en promesas para el navegador y Node.js.
- react-router-dom: Enrutador para aplicaciones de React.
- react-spring: Librería para animaciones en React.
  
## Autor
@Joshua-designs 

## Futuras Actualizaciones

Se planean las siguientes mejoras y características para futuras actualizaciones:

- Cambio de diseño para crear notas con un toque más RPG.
- Integración del modo oscuro para una experiencia visual más cómoda.
- Capacidad de filtrar las tareas para una mejor organización.
- Optimización del código y resolución de errores.
- Posible integración de una API para agregar funcionalidades adicionales.
  
¡Gracias por instalar y utilizar Task-Leveling!