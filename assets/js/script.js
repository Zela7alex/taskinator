const tasksToDoEl = document.querySelector('#tasks-to-do')
const formEl = document.querySelector('#task-form')
const pageContentEl = document.querySelector('#page-content')
let taskIdCounter = 0;

//** Function **/
const taskFormHandler = (event) => {
    event.preventDefault()

    const taskNameInput = document.querySelector("input[name='task-name']").value
    const taskTypeInput = document.querySelector("select[name='task-type']").value

    //Checking if input values are empty strings
    if(!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!")
        return false // This will stop the function from runnning if both inputs are empty, will not create list item
    }
    formEl.reset() //resets form inputs to original state(only works on forms) 

    //task info made into object
    taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    }
    //Sending taskDataObj as an argument to createTaskEl()
    createTaskEl(taskDataObj)
}
//** Function **/
const createTaskEl = taskDataObj => {
      //Create list item
      const listItemEl = document.createElement('li')
      listItemEl.className = 'task-item'
      //Added task id as a custom attribute
      listItemEl.setAttribute("data-task-id", taskIdCounter)
      
      //Create div to hold task name/type and add to listItemEl
      const taskInfoEl = document.createElement('div')
      taskInfoEl.className = "task-info"
      taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>"
  
      //Append to listItemEl
      listItemEl.appendChild(taskInfoEl)
    
      //Append the createTaskActions() to listItemEl with taskIdCounter
      const taskActionsEl = createTaskActions(taskIdCounter)
      listItemEl.appendChild(taskActionsEl)
  
      //Append entire list item to toDolist
      tasksToDoEl.appendChild(listItemEl) 

      //Increasing task counter for next unique id on each task 
      taskIdCounter++

}
//** Function **/
const createTaskActions = taskId => {
    const actionContainerEl = document.createElement('div')
    actionContainerEl.className = 'task-actions'

    //Creating edit button for each individul list item created
    const editButtonEl = document.createElement('button')
    editButtonEl.textContent = 'Edit'
    editButtonEl.className = 'btn edit-btn'
    editButtonEl.setAttribute('data-task-id', taskId)
    
    actionContainerEl.appendChild(editButtonEl)

    //Creating delete button for each individual list item created
    const deleteButtonEl = document.createElement('button')
    deleteButtonEl.textContent = 'Delete'
    deleteButtonEl.className = 'btn delete-btn'
    deleteButtonEl.setAttribute('data-task-id', taskId)
    
    actionContainerEl.appendChild(deleteButtonEl)

    //Creating dropdown menu for status of task
    const statusSelectEl = document.createElement('select')
    statusSelectEl.className = 'select-status'
    statusSelectEl.setAttribute('name', 'status-change')
    statusSelectEl.setAttribute('data-task-id', taskId)

    actionContainerEl.appendChild(statusSelectEl)
       
    // Adding status choices to dropdown menu
    const statusChoices = ['To Do', 'In Progress', 'Completed']
    
    statusChoices.forEach(createEachStatus)
    
    function createEachStatus(choices){
        const statusOptionEl = document.createElement('option')
        statusOptionEl.textContent = choices
        statusOptionEl.setAttribute('value',choices)
        statusSelectEl.appendChild(statusOptionEl)
    }

    return actionContainerEl
}

//** Function **/
const taskButtonHandler = (event) => {
    const targetEl = event.target // get's target element froom event 
    console.log(targetEl) // identifies what container is being clicked

    if(targetEl.matches('.edit-btn')){
        let taskId = targetEl.getAttribute("data-task-id")
        editTask(taskId)
    }
    else if (event.target.matches('.delete-btn')){
        let taskId = event.target.getAttribute('data-task-id') // captures the id of the task that will be deleted
        deleteTask(taskId)
    }
}
//** Function **/
const deleteTask = taskId => {
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove() // remove() is a method that will remove the item from the page 
}

//** Function **/
const editTask = taskId => {
    console.log('editing task #' + taskId)

    //Grabbing task list item element
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")

    //Grabbing content from task Name and Type
    let taskName = taskSelected.querySelector('h3.task-name').textContent
    
    let taskType = taskSelected.querySelector('span.task-type').textContent

    document.querySelector("input[name='task-name']").value = taskName
    document.querySelector("select[name='task-type']").value = taskType

    document.querySelector("#save-task").textContent = "Save Task"

    formEl.setAttribute("data-task-id", taskId)
   
}






pageContentEl.addEventListener('click', taskButtonHandler)
formEl.addEventListener('submit', taskFormHandler)
