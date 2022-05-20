const tasksToDoEl = document.querySelector('#tasks-to-do')
const formEl = document.querySelector('#task-form')

const createTaskHandler = (event) => {
    event.preventDefault()

    const taskItemEl = document.createElement('li')
    taskItemEl.textContent = 'This is a new task'
    taskItemEl.className = 'task-item'
    tasksToDoEl.appendChild(taskItemEl)

}
formEl.addEventListener('submit', createTaskHandler)
