const tasksToDoEl = document.querySelector('#tasks-to-do')
const formEl = document.querySelector('#task-form')

const taskFormHandler = (event) => {
    event.preventDefault()

    const taskNameInput = document.querySelector("input[name='task-name']").value
    const taskTypeInput = document.querySelector("select[name='task-type']").value

    //task info made into object
    taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    }
    //Sending taskDataObj as an argument to createTaskEl()
    createTaskEl(taskDataObj)
}

const createTaskEl = taskDataObj => {
      //Create list item
      const listItemEl = document.createElement('li')
      listItemEl.className = 'task-item'
      
      //Create div to hold task name/type and add to listItemEl
      const taskInfoEl = document.createElement('div')
      taskInfoEl.className = "task-info"
      taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>"
  
      //Append to listItemEl
      listItemEl.appendChild(taskInfoEl)
  
      //Append entire list item to toDolist
      tasksToDoEl.appendChild(listItemEl) 

}

formEl.addEventListener('submit', taskFormHandler)
