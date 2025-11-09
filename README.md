Programación III Trabajo Final Integrador

Grupo AX 
Integrantes:
Fernandez, Rubén Dario
Flores, Agostina Micaela 
Gatti, Germán Enrique 
Godoy, Juan Manuel 
Rein, Jonathan Cesar
Tisocco Grigolatto, Araceli Belén

Link Video:  https://drive.google.com/file/d/1j2uFvBcDQWKGsYuR6JiesDy3o_1q1Fud/view

Prof.: la dirección del repositorio de nuestro Trabajo Práctico Integrador es:
https://github.com/juanmanuelgodoy/ProgramacionIII-TrabajoPracticoIntegrador

La colección de Bruno para probar nuestro proyecto, está en el archivo ColeccionBrunoGrupoAX.json adjunto a la entrega. Para hacer pruebas de los distintos métodos respetando los roles se debe hacer el login para recibir el token, dicho token puede ser pegado en la variable de entorno "token". Verificar el recibimiento de los emails: Los usuarios con roles 1= administrador; 2= empleado y 3= cliente deben tener un email válido al que usted tenga acceso ( debe estar guardado dicho email  en la base de datos). Luego al ejecutar el método PUT reinicio de contraseña les llegaran los emails correspondientes.
IMPORTANTE como la creación de usuarios solo lo puede realizar el administrador, es necesario aplicar la siguiente sentencia en SQL dentro de la base de datos para cambiar la contraseña a un administrador que ya exista: Ej para administrador Oscar: "UPDATE usuarios SET contrasenia = SHA2('Oscar123!', 256) WHERE nombre_usuario = 'oscram@correo.com' AND activo = 1".
Luego al tener el token se podrá crear mas usuarios (ahí­ Usted debe colocar su email para rol de usuario que quiera probar los métodos). 
Muchas gracias. Saludos cordiales. 
