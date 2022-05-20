const buttonEl = document.querySelector('#save-task')
const tasksToDoEl = document.querySelector('#tasks-to-do')

const createTaskHandler = () => {
    const taskItemEl = document.createElement('li')
    taskItemEl.textContent = 'This is a new task'
    taskItemEl.className = 'task-item'
    tasksToDoEl.appendChild(taskItemEl)
}
buttonEl.addEventListener('click', createTaskHandler)
