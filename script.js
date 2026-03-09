 // Load data on start
        document.addEventListener('DOMContentLoaded', loadBoard);

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        function drop(ev) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            const draggedElement = document.getElementById(data);
            const dropzone = ev.target.closest('.column').querySelector('.task-list');
            
            dropzone.appendChild(draggedElement);
            saveBoard();
        }

        function addTask(status) {
            const text = prompt("Enter task description:");
            if (!text) return;

            const id = 'task-' + Date.now();
            createTaskElement(id, text, status);
            saveBoard();
        }

        function createTaskElement(id, text, status) {
            const card = document.createElement('div');
            card.className = 'card';
            card.id = id;
            card.draggable = true;
            card.ondragstart = drag;

            card.innerHTML = `
                <span>${text}</span>
                <button class="delete-btn" onclick="removeTask('${id}')">×</button>
            `;

            document.getElementById(status).appendChild(card);
        }

        function removeTask(id) {
            document.getElementById(id).remove();
            saveBoard();
        }

        function saveBoard() {
            const columns = ['todo', 'doing', 'done'];
            const boardState = {};

            columns.forEach(col => {
                const tasks = [];
                document.querySelectorAll(`#${col} .card`).forEach(card => {
                    tasks.push({
                        id: card.id,
                        text: card.querySelector('span').innerText
                    });
                });
                boardState[col] = tasks;
            });

            localStorage.setItem('kanbanData', JSON.stringify(boardState));
        }

        function loadBoard() {
            const data = JSON.parse(localStorage.getItem('kanbanData'));
            if (!data) return;

            Object.keys(data).forEach(status => {
                data[status].forEach(task => {
                    createTaskElement(task.id, task.text, status);
                });
            });
        }
