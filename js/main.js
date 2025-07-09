// --- CONSTANTES Y ELEMENTOS DEL DOM ---
const CLAVE_STORAGE = 'listaTareas';
let LISTA_TAREAS = [];

const ingresarTarea = document.getElementById('ingresarTarea');
const agregarTareaBtn = document.getElementById('agregarTareaBtn');
const listaTareas = document.getElementById('listaTareas');
const estVacio = document.getElementById('estVacio');

const verTodoBtn = document.getElementById('verTodoBtn');
const verPendientesBtn = document.getElementById('verPendientesBtn');
const verCompletadasBtn = document.getElementById('verCompletadasBtn');

// --- FUNCIONES DE ALMACENAMIENTO ---

/**
 * Carga las tareas desde localStorage.
 * @returns {Array}
 */ 

const cargarTareas = () => {
    const tareasGuardadas = localStorage.getItem(CLAVE_STORAGE);
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
};

/**
 * Guarda las tareas en localStorage.
 * @param {Array} tareas
 */

const guardarTareas = (tareas) => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
};

// --- FUNCIONES DE RENDERIZADO Y LÓGICA DE TAREAS ---

/**
 * Renderiza la lista de tareas en el DOM.
 * @param {string} filter -
 */

const renderizarTareas = (filter = 'todo') => {
    listaTareas.innerHTML = '';
    let tareasFiltradas = [];

    if (filter === 'pendiente') {
        tareasFiltradas = LISTA_TAREAS.filter(tarea => !tarea.completada);
    } else if (filter === 'completada') {
        tareasFiltradas = LISTA_TAREAS.filter(tarea => tarea.completada);
    } else {
        tareasFiltradas = LISTA_TAREAS;
    }

    if (tareasFiltradas.length === 0) {
        estVacio.style.display = 'block';
    } else {
        estVacio.style.display = 'none';
        tareasFiltradas.forEach((tarea, index) => {
            const li = document.createElement('li');
            li.setAttribute('indice', LISTA_TAREAS.indexOf(tarea));

            if (tarea.completada) {
                li.classList.add('completada');
            }

            const spanTareas = document.createElement('span');
            spanTareas.classList.add('spanTareas');
            spanTareas.textContent = tarea.descripcion;

            const activarDiv = document.createElement('div');
            activarDiv.classList.add('activar');

            const completarBtn = document.createElement('button');
            completarBtn.classList.add('completarBtn');
            completarBtn.textContent = 'Completar';
            completarBtn.addEventListener('click', () => cambiarEstado(parseInt(li.getAttribute('indice'))));

            if (tarea.completada) {
                completarBtn.style.display = 'none';
            }

            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('eliminarBtn');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => eliminarTarea(parseInt(li.getAttribute('indice'))));

            activarDiv.appendChild(completarBtn);
            activarDiv.appendChild(eliminarBtn);

            li.appendChild(spanTareas);
            li.appendChild(activarDiv);
            listaTareas.appendChild(li);
        });
    }
    actualizarBotones(filter);
};

/**
 * Actualiza el estado de los botones de filtro.
 * @param {string} filtroActivo
 */

const actualizarBotones = (filtroActivo) => {
    verTodoBtn.classList.remove('active');
    verPendientesBtn.classList.remove('active');
    verCompletadasBtn.classList.remove('active');

    if (filtroActivo === 'todo') {
        verTodoBtn.classList.add('active');
    } else if (filtroActivo === 'pendiente') {
        verPendientesBtn.classList.add('active');
    } else if (filtroActivo === 'completada') {
        verCompletadasBtn.classList.add('active');
    }
};

const agregarTarea = () => {
    const descripcion = ingresarTarea.value.trim();
    if (descripcion === '') {
        alert('La descripción de la tarea no puede estar vacía.');
        return;
    }

    LISTA_TAREAS.push({
        descripcion: descripcion,
        completada: false,
    });
    guardarTareas(LISTA_TAREAS);
    ingresarTarea.value = '';
    renderizarTareas(filtroActivo);
};

/**
 * Alterna el estado de completado de una tarea.
 * @param {number} index
 */

const cambiarEstado = (index) => {
    if (index >= 0 && index < LISTA_TAREAS.length) {
        LISTA_TAREAS[index].completada = !LISTA_TAREAS[index].completada;
        guardarTareas(LISTA_TAREAS);
        renderizarTareas(filtroActivo);
    }
};

/**
 * Elimina una tarea de la lista.
 * @param {number} index
 */

const eliminarTarea = (index) => {
    if (index >= 0 && index < LISTA_TAREAS.length) {
        if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${LISTA_TAREAS[index].descripcion}"?`)) {
            LISTA_TAREAS.splice(index, 1);
            guardarTareas(LISTA_TAREAS);
            renderizarTareas(filtroActivo);
        }
    }
};

// --- INICIALIZACIÓN Y EVENT LISTENERS ---

let filtroActivo = 'todo';

document.addEventListener('DOMContentLoaded', () => {
    LISTA_TAREAS = cargarTareas();
    renderizarTareas(filtroActivo);
});

agregarTareaBtn.addEventListener('click', agregarTarea);

ingresarTarea.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        agregarTarea();
    }
});

verTodoBtn.addEventListener('click', () => {
    filtroActivo = 'todo';
    renderizarTareas(filtroActivo);
});

verPendientesBtn.addEventListener('click', () => {
    filtroActivo = 'pendiente';
    renderizarTareas(filtroActivo);
});

verCompletadasBtn.addEventListener('click', () => {
    filtroActivo = 'completada';
    renderizarTareas(filtroActivo);
});