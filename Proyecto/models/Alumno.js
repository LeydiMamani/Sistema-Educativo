document.addEventListener('DOMContentLoaded', () => {
    const botonNuevoEstudiante = document.querySelector('.new-button');
    const botonFiltrarEstudiantes = document.querySelector('.filter-buttons button:first-child');
    const botonLimpiarFiltro = document.querySelector('.filter-buttons .clear-button');
    const cuerpoTablaEstudiantes = document.querySelector('.table-container table tbody');
    const modalDocumentosElemento = document.getElementById('documentsModal');
    const botonCerrarModalDocumentos = modalDocumentosElemento.querySelector('.close-button');
    const listaDocumentosElemento = modalDocumentosElemento.querySelector('.documents-list');
    const etiquetaIdEstudianteModal = modalDocumentosElemento.querySelector('#studentId');

    // --- Modal Nuevo Estudiante ---
    const nuevoEstudianteModal = document.getElementById('nuevoEstudianteModal');
    const botonCerrarNuevoEstudianteModal = document.getElementById('cerrarNuevoEstudianteModal');
    const formularioNuevoEstudiante = document.getElementById('formularioNuevoEstudiante');
    const botonGuardarNuevoEstudiante = document.getElementById('guardarNuevoEstudiante');

    botonNuevoEstudiante.addEventListener('click', () => {
        nuevoEstudianteModal.style.display = 'block';
    });

    botonCerrarNuevoEstudianteModal.addEventListener('click', () => {
        nuevoEstudianteModal.style.display = 'none';
        formularioNuevoEstudiante.reset(); // Limpiar el formulario al cerrar
    });

    window.addEventListener('click', (evento) => {
        if (evento.target === nuevoEstudianteModal) {
            nuevoEstudianteModal.style.display = 'none';
            formularioNuevoEstudiante.reset(); // Limpiar el formulario al hacer clic fuera
        }
    });

    formularioNuevoEstudiante.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Evitar la recarga de la página

        const formData = new FormData(formularioNuevoEstudiante);
        const nuevoEstudiante = Object.fromEntries(formData.entries());

        fetch('/api/alumnos', { // Asegúrate de que esta sea la ruta correcta de tu API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoEstudiante),
        })
        .then(respuesta => respuesta.json())
        .then(data => {
            console.log('Estudiante creado:', data);
            nuevoEstudianteModal.style.display = 'none'; // Ocultar el modal
            formularioNuevoEstudiante.reset(); // Limpiar el formulario
            // Recargar la lista de estudiantes o añadir la nueva fila a la tabla
            // fetchEstudiantesAndUpdateTable();
        })
        .catch(error => {
            console.error('Error al crear estudiante:', error);
            // Mostrar mensaje de error al usuario
        });
    });

    // --- Botón "Filtrar" ---
    botonFiltrarEstudiantes.addEventListener('click', () => {
        const filtroNombre = document.getElementById('nombre').value;
        const filtroApellido = document.getElementById('apellido').value;
        const filtroEdad = document.getElementById('edad').value;
        const filtroGrupo = document.getElementById('salon').value;
        const filtroEstado = document.getElementById('estado').value;

        const urlFiltrado = `/api/alumnos/filtrar?nombre=${filtroNombre}&apellido=${filtroApellido}&edad=${filtroEdad}&salon=${filtroGrupo}&estado=${filtroEstado}`;

        fetch(urlFiltrado)
            .then(respuesta => respuesta.json())
            .then(estudiantesFiltrados => {
                console.log('Estudiantes filtrados:', estudiantesFiltrados);
                poblarTablaEstudiantes(estudiantesFiltrados);
            })
            .catch(error => {
                console.error('Error al filtrar estudiantes:', error);
                // Mostrar mensaje de error
            });
    });

    // --- Botón "Limpiar" ---
    botonLimpiarFiltro.addEventListener('click', () => {
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('edad').value = '';
        document.getElementById('salon').value = '';
        document.getElementById('estado').value = '';

        fetch('/api/alumnos') // Asegúrate de que esta sea la ruta correcta para obtener todos los alumnos
            .then(respuesta => respuesta.json())
            .then(todosLosEstudiantes => {
                console.log('Todos los estudiantes:', todosLosEstudiantes);
                poblarTablaEstudiantes(todosLosEstudiantes);
            })
            .catch(error => {
                console.error('Error al obtener todos los estudiantes:', error);
                // Mostrar mensaje de error
            });
    });

    // --- Delegación de eventos para botones "Editar", "Eliminar" y "Docs" ---
    cuerpoTablaEstudiantes.addEventListener('click', (evento) => {
        const elementoClicado = evento.target;
        const filaEstudiante = elementoClicado.closest('tr');
        if (!filaEstudiante) return;

        const identificadorEstudiante = filaEstudiante.querySelector('td:nth-child(2)').textContent;

        if (elementoClicado.classList.contains('edit-button')) {
            console.log('Editar estudiante con ID:', identificadorEstudiante);
            // Implementa la lógica para redirigir o mostrar un formulario de edición
        } else if (elementoClicado.classList.contains('delete-button')) {
            console.log('Eliminar estudiante con ID:', identificadorEstudiante);
            if (confirm(`¿Estás seguro de que quieres eliminar al estudiante con ID: ${identificadorEstudiante}?`)) {
                fetch(`/api/alumnos/${identificadorEstudiante}`, { // Asegúrate de que esta sea la ruta correcta para eliminar
                    method: 'DELETE',
                })
                .then(respuesta => {
                    if (respuesta.ok) {
                        console.log('Estudiante eliminado con éxito');
                        filaEstudiante.remove();
                        // O: fetchEstudiantesAndUpdateTable();
                    } else {
                        console.error('Error al eliminar estudiante');
                        // Mostrar mensaje de error
                    }
                })
                .catch(error => {
                    console.error('Error de red al eliminar estudiante:', error);
                    // Mostrar mensaje de error
                });
            }
        } else if (elementoClicado.classList.contains('documents-button')) {
            abrirModalDocumentos(identificadorEstudiante);
        }
    });

    // --- Modal para Documentos ---
    function abrirModalDocumentos(idEstudiante) {
        etiquetaIdEstudianteModal.textContent = idEstudiante;
        // Haz una llamada a la API aquí para obtener la lista de documentos del estudiante con este ID
        const documentosEjemplo = {
            'ALM001': ['Certificado.pdf', 'Carnet_ID.pdf', 'Boletin_Notas.pdf'],
            'ALM002': ['Formulario_Inscripcion.pdf', 'ID_Padre.pdf']
        };
        const documentosEstudiante = documentosEjemplo[idEstudiante] || [];
        listaDocumentosElemento.innerHTML = '';
        documentosEstudiante.forEach(doc => {
            const elementoLista = document.createElement('li');
            elementoLista.textContent = doc;
            listaDocumentosElemento.appendChild(elementoLista);
        });
        modalDocumentosElemento.style.display = 'block';
    }

    function cerrarModalDocumentos() {
        modalDocumentosElemento.style.display = 'none';
    }

    botonCerrarModalDocumentos.addEventListener('click', cerrarModalDocumentos);

    window.addEventListener('click', (evento) => {
        if (evento.target === modalDocumentosElemento) {
            cerrarModalDocumentos();
        }
    });

    // --- Carga inicial de datos (ejemplo) ---
    // fetch('/api/estudiantes')
    //     .then(respuesta => respuesta.json())
    //     .then(estudiantes => {
    //         poblarTablaEstudiantes(estudiantes);
    //     });

    function poblarTablaEstudiantes(estudiantes) {
        cuerpoTablaEstudiantes.innerHTML = '';
        estudiantes.forEach(estudiante => {
            const fila = cuerpoTablaEstudiantes.insertRow();
            fila.insertCell().textContent = 'N/A'; // Índice o contador
            fila.insertCell().textContent = estudiante.codigoEstudianteUnico || estudiante.identificadorEstudiante || 'N/A';
            fila.insertCell().textContent = '********'; // Ocultar contraseña/clave de acceso
            fila.insertCell().textContent = estudiante.nombre || 'N/A';
            fila.insertCell().textContent = estudiante.apellido || 'N/A';
            fila.insertCell().textContent = estudiante.edadAnios || 'N/A';
            fila.insertCell().textContent = estudiante.direccionResidencia || 'N/A';
            fila.insertCell().textContent = estudiante.numeroContacto || 'N/A';
            fila.insertCell().innerHTML = `<span class="status-${estudiante.estadoActual}">${estudiante.estadoActual}</span>` || 'N/A';
            fila.insertCell().textContent = estudiante.grupoEstudio || 'N/A';
            const celdaAcciones = fila.insertCell();
            celdaAcciones.classList.add('actions');
            celdaAcciones.innerHTML = `
                <button class="edit-button">Editar</button>
                <button class="delete-button">Eliminar</button>
                <button class="documents-button" onclick="abrirModalDocumentos('${estudiante.codigoEstudianteUnico || estudiante.identificadorEstudiante}')">Docs</button>
            `;
        });
    }
});