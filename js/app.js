// Lista de tareas
let tasks = [];

// Índice de la tarea actualmente en edición
let editingIndex = -1;

// Función para activar la edición de una tarea
function editTask(index) {
    // Obtener la tarea seleccionada
    const selectedTask = tasks[index];

    // Asignar la tarea al input de edición en el modal
    const editTaskInput = document.getElementById('editTaskInput');
    editTaskInput.value = selectedTask;

    // Mostrar el modal de edición
    $('#editModal').modal('show');

    // Actualizar el índice de edición
    editingIndex = index;
}

// Función para agregar tarea o editar tarea existente
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const newTask = taskInput.value.trim();

    if (newTask !== '') {
        if (editingIndex === -1) {
            // Agregar nueva tarea
            tasks.push(newTask);
        } else {
            // Editar tarea existente
            tasks[editingIndex] = newTask;
            editingIndex = -1; // Restablecer el índice de edición
        }

        updateTaskList();
        saveTasksToLocalStorage();
        taskInput.value = ''; // Limpiar el campo de entrada
    }
}

// Función para manejar la pulsación de tecla en el campo de entrada
function handleKeyPress(event) {
    // Verificar si la tecla presionada es "Enter"
    if (event.key === 'Enter') {
        addTask();
    }
}

// Función para enviar tareas por WhatsApp
function sendTasksViaWhatsapp() {
    // Filtrar las tareas no tachadas
    const uncompletedTasks = tasks.filter((_, index) => !document.getElementById(`taskCheckbox${index}`).checked);

    // Obtener el texto de las tareas no tachadas
    const tasksForWhatsapp = uncompletedTasks.join('\n');

    // Obtener el número de teléfono del campo de entrada
    const phoneInput = document.getElementById('phoneSend');
    const phoneNumber = phoneInput.value.trim();

    // Validar el número de teléfono
    const isValidPhoneNumber = /^\d{10,13}$/.test(phoneNumber);

    // Obtener el elemento del mensaje de error
    const errorMessageElement = document.getElementById('errorMessage');

    if (isValidPhoneNumber) {
        // Limpiar el mensaje de error si el número de teléfono es válido
        errorMessageElement.textContent = '';

        // Mensaje de WhatsApp
        const whatsappMessage = `¡Listado del super!\n${tasksForWhatsapp}`;

        // Crear la URL de WhatsApp con el número de teléfono
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Abrir la URL en una nueva ventana
        window.open(whatsappURL, '_blank');
    } else {
        // Mostrar un mensaje de error debajo del input
        errorMessageElement.textContent = 'Por favor, introduce un número de teléfono válido con entre 10 y 13 dígitos.';
    }
}



// Añadir un event listener para permitir solo números
const phoneInput = document.getElementById('phoneSend');
phoneInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, ''); // Remover no números
});

function updateTask() {
    const editTaskInput = document.getElementById('editTaskInput');
    const updatedTask = editTaskInput.value.trim();

    if (updatedTask !== '') {
        tasks[editingIndex] = updatedTask;
        updateTaskList();
        saveTasksToLocalStorage();
        $('#editModal').modal('hide'); // Ocultar el modal
    }
}

// Función para actualizar la lista de tareas en el DOM
function updateTaskList() {
    const taskList = document.getElementById('taskList');
    const placeholderInfo = document.querySelector('.placeholder-info');

    // Limpiar la lista antes de actualizar
    taskList.innerHTML = '';

    // Verificar si hay tareas para mostrar
    if (tasks.length > 0) {
        // Ocultar el div de placeholder-info si hay tareas
        placeholderInfo.style.display = 'none';

        // Agregar cada tarea a la lista con checkbox y botones
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-item neo-row mb-2 p-2 ps-4 d-flex justify-content-between align-items-center'; // Clase Bootstrap para mejorar el maquetado

            // Agregar div para el checkbox y el texto de la tarea
            const taskCheckboxDiv = document.createElement('div');
            taskCheckboxDiv.classList.add('d-flex', 'align-items-center'); // Clases Bootstrap para el contenedor flex y centrado verticalmente

            // Agregar checkbox para la tarea
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-check-input mt-0 me-2'; // Clase Bootstrap para agregar margen derecho
            checkbox.id = `taskCheckbox${index}`;
            checkbox.checked = false; // Puedes ajustar esto según sea necesario

            // Agregar span para el texto de la tarea
            const taskText = document.createElement('span');
            taskText.textContent = task;

            // Agregar clase al span
            taskText.classList.add('text-task'); // Reemplaza 'mi-clase' con la clase que deseas agregar

            // Agregar evento de escucha al cambio del checkbox
            checkbox.addEventListener('change', () => {
                // Actualizar el estilo de la tarea según el estado del checkbox
                if (checkbox.checked) {
                    taskText.style.textDecoration = 'line-through'; // Tachar la tarea
                    taskText.style.color = 'var(--primary-dark)'; // Cambiar el color para indicar que está completada
                } else {
                    taskText.style.textDecoration = 'none'; // Eliminar el tachado
                    taskText.style.color = 'var(--primary)'; // Restaurar el color original
                }
            });

            // Agregar elementos al div del checkbox
            taskCheckboxDiv.appendChild(checkbox);
            taskCheckboxDiv.appendChild(taskText);

            // Agregar div para los botones
            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('display-btn');

            // Botón de editar
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-neo-text mt-0 mx-2'; // Clase Bootstrap para el botón de editar
            editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>'; // Ícono de lápiz
            editButton.onclick = () => editTask(index);

            // Botón de eliminar
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-neo-text mt-0'; // Clase Bootstrap para el botón de eliminar
            deleteButton.innerHTML = '<i class="bi bi-x-lg"></i>'; // Ícono de basura
            deleteButton.onclick = () => deleteTask(index);

            // Agregar elementos al div de botones
            buttonsDiv.appendChild(editButton);
            buttonsDiv.appendChild(deleteButton);

            // Agregar divs al listItem
            listItem.appendChild(taskCheckboxDiv);
            listItem.appendChild(buttonsDiv);
            
            // Agregar listItem a la lista
            taskList.appendChild(listItem);
        });
    } else {
        // Mostrar el div de placeholder-info si no hay tareas
        placeholderInfo.style.display = 'block';
    }
}

// Obtener el elemento del campo de entrada en el modal de edición
const editTaskInput = document.getElementById('editTaskInput');

// Agregar un escuchador de eventos para la tecla "Enter"
editTaskInput.addEventListener('keyup', function (event) {
    // Verificar si la tecla presionada es "Enter"
    if (event.key === 'Enter') {
        // Llamar a la función de actualización al presionar "Enter"
        updateTask();
    }
});

// Función para eliminar tarea
function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    saveTasksToLocalStorage();
}

// Función para guardar la lista de tareas en localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para cargar la lista de tareas desde localStorage al cargar la página
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        updateTaskList();
    }
}

// Añadir un event listener para escuchar la pulsación de tecla en el campo de entrada
const taskInput = document.getElementById('taskInput');
taskInput.addEventListener('keypress', handleKeyPress);

// Inicializar la lista de tareas al cargar la página
window.onload = () => {
    loadTasksFromLocalStorage();
    updateTaskList();
};
