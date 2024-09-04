class Student {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.notes = []; // Campo para notas
    }

    addOrUpdateNote(note) {
        if (this.notes.length === 0) {
            this.notes.push(note);
        } else {
            this.notes[0] = note;
        }
    }

    getAverage() {
        if (this.notes.length === 0) return 0;
        const total = this.notes.reduce((acc, note) => acc + note, 0);
        return (total / this.notes.length).toFixed(2); // Promedio con dos decimales
    }

    hasNote() {
        return this.notes.length > 0;
    }
}

class Course {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.students = []; // Lista de estudiantes
    }

    addStudent(name, email) {
        const student = new Student(name, email);
        this.students.push(student);
    }
}

class StudentManager {
    constructor() {
        this.courses = [];
        this.currentId = 1;
    }

    addCourse(name, description) {
        const course = new Course(name, description);
        this.courses.push(course);
        this.render();
    }

    removeCourse(index) {
        const course = this.courses[index];
        if (course.students.length > 0) {
            alert('No se puede eliminar el curso porque tiene estudiantes.');
            return; // No eliminar el curso si tiene estudiantes
        }
        this.courses.splice(index, 1); // Eliminar el curso en el índice dado
        this.render(); // Volver a renderizar la tabla
    }

    render() {
        const tableBody = document.querySelector('#studentTable tbody');
        tableBody.innerHTML = ''; // Limpiar tabla antes de renderizar
        this.courses.forEach((course, index) => {
            const row = `
            <tr>
                <th scope="row">${this.currentId++}</th>
                <td>${course.name}</td>
                <td>${course.description}</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="showCourseDetails(${index})">
                    Ver curso
                    </button>
                    <button type="button" class="btn btn-danger" onclick="studentManager.removeCourse(${index})">Eliminar curso</button>
                </td>
            </tr>
            `;
            tableBody.innerHTML += row;
        });
        this.currentId = 1; // Reiniciar ID para la próxima renderización
    }
}

const studentManager = new StudentManager();

document.getElementById('addStudentBtn').addEventListener('click', () => {
    const name = document.getElementById('cursoName').value;
    const description = document.getElementById('cursoDescription').value;
    if (name && description) {
        studentManager.addCourse(name, description);
        document.getElementById('cursoName').value = ''; // Limpiar campo
        document.getElementById('cursoDescription').value = ''; // Limpiar campo
    } else {
        alert('Por favor, complete todos los campos.');
    }
});

// Nueva función para mostrar detalles del curso en el modal
function showCourseDetails(courseIndex) {
    const course = studentManager.courses[courseIndex];
    document.getElementById('modalCourseName').innerText = `Nombre del curso: ${course.name}`;
    document.getElementById('modalCourseDescription').innerText = `Descripción: ${course.description}`;
    
    // Establecer el índice del curso en el modal
    document.querySelector('#exampleModal').setAttribute('data-course-index', courseIndex);

    // Limpiar lista de estudiantes
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    // Mostrar estudiantes en la lista
    course.students.forEach((student, studentIndex) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerText = `${student.name} (${student.email})`;

        // Campo para ingresar nota
        const noteInput = document.createElement('input');
        noteInput.type = 'number';
        noteInput.min = '1';
        noteInput.max = '10';
        noteInput.step = '0.1';
        noteInput.placeholder = 'Nota (1-10)';
        noteInput.className = 'form-control w-25 me-2';

        // Actualizar nota en tiempo real
        noteInput.addEventListener('input', () => {
            const note = parseFloat(noteInput.value);
            if (note >= 1 && note <= 10) {
                student.addOrUpdateNote(note);
                updateAverage(course); // Actualizar promedio
            } else {
                alert('Por favor, ingrese una nota válida entre 1 y 10.');
            }
        });

        // Deshabilitar campo de entrada si el estudiante ya tiene una nota
        if (student.hasNote()) {
            noteInput.value = student.notes[0];
        }

        listItem.appendChild(noteInput);
        studentList.appendChild(listItem);
    });

    // Actualizar promedio al mostrar detalles
    updateAverage(course);
}

// Función para actualizar el promedio de notas
function updateAverage(course) {
    const averageGradeElement = document.getElementById('averageGrade');
    const totalAverage = course.students.reduce((acc, student) => acc + parseFloat(student.getAverage()), 0);
    const average = totalAverage / course.students.length;
    averageGradeElement.innerText = isNaN(average) ? '0' : average.toFixed(2); // Mostrar promedio con dos decimales
}

// Agregar funcionalidad para agregar estudiantes
document.getElementById('addStudentToCourseBtn').onclick = () => {
    const studentName = document.getElementById('studentName').value;
    const studentEmail = document.getElementById('studentEmail').value;
    const courseIndex = document.querySelector('#exampleModal').getAttribute('data-course-index');
    const course = studentManager.courses[courseIndex];
    if (studentName && studentEmail) {
        course.addStudent(studentName, studentEmail);
        showCourseDetails(courseIndex); // Actualizar la lista de estudiantes
        document.getElementById('studentName').value = ''; // Limpiar campo
        document.getElementById('studentEmail').value = ''; // Limpiar campo
    } else {
        alert('Por favor, complete todos los campos del estudiante.');
    }
};
