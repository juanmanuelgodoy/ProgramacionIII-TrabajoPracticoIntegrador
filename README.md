ProgramaciÃ³n III Trabajo Final Integrador

Grupo AX 
Integrantes:
Fernandez, RubÃ©n Dario
Flores, Agostina Micaela 
Gatti, GermÃ¡n Enrique 
Godoy, Juan Manuel 
Rein, Jonathan Cesar
Tisocco Grigolatto, Araceli BelÃ©n

Link Video:  https://drive.google.com/file/d/1j2uFvBcDQWKGsYuR6JiesDy3o_1q1Fud/view

Prof.: la direcciÃ³n del repositorio de nuestro Trabajo PrÃ¡ctico Integrador es:
https://github.com/juanmanuelgodoy/ProgramacionIII-TrabajoPracticoIntegrador
La colecciÃ³n de Bruno para probar nuestro proyecto, estÃ¡ en el archivo ColeccionBrunoGrupoAX.json adjunto a la entrega. Para hacer pruebas de los distintos mÃ©todos respetando los roles se debe hacer el login para recibir el token, dicho token puede ser pegado en la variable de entorno "token". Verificar el recibimiento de los emails: Los usuarios con roles 1= administrador; 2= empleado y 3= cliente deben tener un email vÃ¡lido al que usted tenga acceso ( debe estar guardado dicho email  en la base de datos). Luego al ejecutar el mÃ©todo PUT reinicio de contraseÃ±a les llegaran los emails correspondientes. IMPORTANTE como la creaciÃ³n de usuarios solo lo puede realizar el administrador, es necesario aplicar la siguiente sentencia en SQL dentro de la base de datos para cambiar la contraseÃ±a a un administrador que ya exista: Ej para administrador Oscar: "UPDATE usuarios
SET contrasenia = SHA2('Oscar123!', 256)
WHERE nombre_usuario = 'oscram@correo.com' AND activo = 1"; luego al tener el token se podrÃ¡ crear mas usuarios (ahÃ­ usted debe colocar su email para rol de usuario que quiera probar los mÃ©todos). Muchas gracias. Saludos cordiales. 
