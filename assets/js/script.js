const tasksToDoEl = document.querySelector('#tasks-to-do')
const formEl = document.querySelector('#task-form')
const pageContentEl = document.querySelector('#page-content')
const tasksInProgressEl = document.querySelector("#tasks-in-progress")
const tasksCompletedEl = document.querySelector("#tasks-completed")
let tasks = []
let taskIdCounter = 0;

// STEP 1) : Use DOM to properly select each new task created & their values through data attribute "taskId".
// STEP 2) : Add Edit and delete functionality to DOM elements.
// STEP 3) : Save to local storage by saving all current created taskDataObj to tasks [] array.

//** FUNCTION **/ This is where creating the list items begins by using the form and adding new tasks as well as editing tasks
const taskFormHandler = (event) => {
    event.preventDefault()

    const taskNameInput = document.querySelector("input[name='task-name']").value
    const taskTypeInput = document.querySelector("select[name='task-type']").value

    //Checking if input values are empty strings
    if(!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!")
        return false // This will stop the function from runnning if both inputs are empty, will not create list item
    }
    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = ''
    document.querySelector("select[name='task-type']").selectedIndex = 0

    const isEdit = formEl.hasAttribute("data-task-id");
     //Willl show false if the task does not have a data-task-id (Remember that data-task-id is created when createTaskEl function runs and all consecutive functions, so "false" will show up first for the listitemEl)

    // If formEl has data attribute "data-task-id ", get task id and call completeEditTask()
    if (isEdit) {
        const taskId = formEl.getAttribute('data-task-id')
        completeEditTask(taskNameInput, taskTypeInput, taskId)
    // If formEl doesn't have data attribute, create object as normal and continue creating normal task 
    } else {
    //task info made into object
    taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
     }
     //Sending taskDataObj as an argument to createTaskEl()
    createTaskEl(taskDataObj)
    }
}
//** FUNCTION **/ This creates the actual task list element
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

      switch (taskDataObj.status) {
        case "to do":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
          tasksToDoEl.append(listItemEl);
          break;
        case "in progress":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
          tasksInProgressEl.append(listItemEl);
          break;
        case "completed":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
          tasksCompletedEl.append(listItemEl);
          break;
        default:
          console.log("Something went wrong!");
      }
  
      //Adding data id to task object in taskHandlerForm()
      taskDataObj.id = taskIdCounter
      tasks.push(taskDataObj)//pushing the taskDataObj created to tasks Array

      saveTasks(); // Saving to local storage

      //Increasing task counter for next unique id on each task 
      taskIdCounter++
}
//** FUNCTION **/ This is creating the elements for "edit", "delete", "status of task"
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

    saveTasks() //Saving to local storage

    return actionContainerEl
}

//** FUNCTION **/ Shows and matches which element on screen is being clicked using the event.target
const taskButtonHandler = (event) => {
    const targetEl = event.target // get's target element from event 
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
//** Function **/ Deletes task created 
const deleteTask = taskId => {
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove() // remove() is a method that will remove the item from the page 

    //Creating new array to hold updated list of tasks
    const updatedTaskArr = [];
    // Looping through each task in array to sync with CURRENT task
    tasks.forEach(tasksArray)
    function tasksArray(eachTask) {
    if(eachTask.id !== parseInt(taskId)){
        updatedTaskArr.push(eachTask)
     }
    }

    tasks = updatedTaskArr // the tasks NOT being selected in deleteTask() will be pushed to updatedTaskArr [] and will then be set equal to tasks [] array. Now tasks [] array will only be the tasks that are not being deleted in this function.
    
    saveTasks() //Saving to local storage

}

//** FUNCTION **/ This function will grab the task made and plug the text content of task Name and task Type back into input fields in the form
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
//** FUNCTION */ Will finish changing text of task items
const completeEditTask = (taskName, taskType, taskId) => {
    // Finding the matching task list item
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId +"']")
    // Set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName
    taskSelected.querySelector("span.task-type").textContent = taskType 

    // Looping through each task in array to sync with CURRENT taskDataObject's edited taskName and edited TaskType
    tasks.forEach(tasksArray)
    function tasksArray(eachTask){
        if (eachTask.id === parseInt(taskId)){
            eachTask.name = taskName
            eachTask.type = taskType
        }
    }

    alert("Task Updated!")

    // Resetting the form back to regular formEl process with initial data-task-id
    formEl.removeAttribute("data-task-id")
    document.querySelector("#save-task").textContent = "Add Task"
 
}
//** FUNCTION */ Changes task item to other columns
const taskStatusChangeHandler = (event) => {
    // getting the task item's id
    const taskId = event.target.getAttribute("data-task-id")

    // getting the currently selected option's value and convert to lowercase
    const statusValue = event.target.value.toLowerCase()

    // find the parent task item element based on the id
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")

    if (statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected)
    } else if (statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSelected)
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected)
    }

    // Looping through each task in array syncing with CURRENT taskDataobject's statusValue
    tasks.forEach(tasksArray)
    function tasksArray(eachTask){
        if(eachTask.id === parseInt(taskId)){
            eachTask.status = statusValue
        }
    }
    saveTasks() //Saving to local storage
}

//** FUNCTION */ Saves tasks array to local storage- This array will be called any time an task item is changed
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks))// Remember to turn back to string or it will not show in localstorage
}

//** FUNCTION */ loads Tasks back onto page from local Storage
const loadTasks = () => {
    let savedTasks = localStorage.getItem("tasks")
    
    if(savedTasks === null){ // if array returns null
        return false
    }
    savedTasks = JSON.parse(savedTasks)
    console.log(savedTasks)
    
    savedTasks.forEach(tasksArray)

    //Looping through savedTasks array
    function tasksArray(eachTask){
        createTaskEl(eachTask) // passing each task object coming from localStorage through createTaskEl() in order to load back onto page
    }
    
}

pageContentEl.addEventListener('click', taskButtonHandler)
pageContentEl.addEventListener('change', taskStatusChangeHandler)
formEl.addEventListener('submit', taskFormHandler)
loadTasks()

