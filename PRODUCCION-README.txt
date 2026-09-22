CONTROL DE FALLAS SATELITAL - COPIA PREPARADA PARA PRODUCCION

Esta copia NO contiene credenciales de Aiven.
El respaldo local original no necesita modificarse.

Variables requeridas en Render:
DB_HOST     = anfitrion mostrado por Aiven
DB_PORT     = puerto mostrado por Aiven
DB_NAME     = nombre de la base predeterminada mostrado por Aiven
DB_USER     = usuario mostrado por Aiven
DB_PASSWORD = contrasena nueva de Aiven (mantener secreta)
DB_USE_SSL  = true
DB_REQUIRE_SSL = true

PORT no necesita fijarse manualmente si Render la proporciona.

Para uso local, si no se definen DB_HOST/DB_PORT/DB_NAME/DB_USER,
la aplicacion conserva localhost:3306/db_control_fallas_satelital y usuario root.
