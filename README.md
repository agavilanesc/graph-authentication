# Graph Authentication

Aplicación creada con [Angular CLI](https://github.com/angular/angular-cli) version 10.0.4.

## Agregar nuevo registro de aplicación en Azure Active Directory para usar con Microsoft Graph

Para crear una aplicación en Azure Active Directory, debe agregar un nuevo registro de aplicación y, a continuación, configurar un nombre de aplicación y una ubicación de dirección URL.

Vaya al Portal de [Azure](https://portal.azure.com).

*   En el menú, seleccione Azure Active Directory.
*   En el Azure Active Directory, seleccione Registros de aplicaciones.
*   En el menú superior, seleccione el botón Nuevo registro.
*   Escribe el nombre de la aplicación; por ejemplo, My Angular App.
*   Para el tipo de cuentas admitidas, seleccione Cuentas en cualquier directorio de la organización (cualquier directorio de Azure AD - Multitenant) y cuentas personales de Microsoft (por ejemplo, Skype, Xbox).
*   Para el campo URI de redireccionamiento:

    *   Seleccione Aplicación de página única (SPA) y, en el campo Dirección URL, escriba la dirección URL de redireccionamiento http://localhost:4200
    *   Para guardar los cambios, seleccione el botón Registrar.

*   Vincular APP registrada:

    *   Una vez registrada la aplicación, reemplace la llave appId del archivo oauth.ts con el valor del Id. de Aplicación que se generó en el registro de la aplicación en Azure Active Directory.
