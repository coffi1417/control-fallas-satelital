const loginForm = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    try {

        const respuesta = await fetch("/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        });

        if (respuesta.ok) {

            const usuario = await respuesta.json();

            // Guardar los datos del usuario que inició sesión
            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            // Ir al panel principal
            window.location.href = "/dashboard.html";

        } else if (respuesta.status === 401) {

            mensaje.textContent =
                "Correo o contraseña incorrectos.";

            mensaje.style.color = "red";

        } else {

            mensaje.textContent =
                "Ocurrió un error al iniciar sesión.";

            mensaje.style.color = "red";
        }

    } catch (error) {

        mensaje.textContent =
            "No se pudo conectar con el servidor.";

        mensaje.style.color = "red";

        console.error(error);
    }
});