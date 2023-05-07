App = {
  loading: false,
  contracts: {},

  load: async () => {
    // Load app...
    // console.log("app loading...")
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()

    await App.render()
  },

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        await ethereum.enable()
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
      }
    }
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      web3.eth.sendTransaction({/* ... */})
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    App.account = (await web3.eth.getAccounts())[0];
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json');
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider)

    App.todoList = await App.contracts.TodoList.deployed();
    
  },

  render: async () => {
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },


  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    
    const $taskTemplate = $('.taskTemplate')

    const $taskList = $('#taskList')
    const $completedTaskList = $('#completedTaskList')
    $taskList.empty()
    $completedTaskList.empty()

   let dict = {}


   for (var i = 1; i <= taskCount; i++) {
    // Fetch the task data from the blockchain
    const task = await App.todoList.tasks(i)
    const taskId = task[0].toNumber()
    const taskPriority =parseInt(task[4],10)

    if (taskPriority in dict)
      dict[taskPriority].push(taskId)
    else
    dict[taskPriority] = [taskId]
   }


  for(var i=3;i>=1;i--){
    if(dict[i]){
  for(var j=0;j<dict[i].length;j++){
    const task = await App.todoList.tasks(dict[i][j])
    const taskId = task[0].toNumber()
    const taskContent = task[1]
    const taskCompleted = task[2]
    const taskIsDeleted = task[3]
    const taskPriority =task[4]
    const user = task[5]
     
    // Create the html for the task
    const $newTaskTemplate = $taskTemplate.clone()
    $newTaskTemplate.find('.content').html("Task title: " + taskContent+" " + "assigned to: " +user)
    $newTaskTemplate.find('input')
                    .prop('name', taskId)
                    .prop('checked', taskCompleted)
                    .on('click', App.toggleCompleted)
                    
    $newTaskTemplate.find('.delete-button')
    .prop('name', taskId)
    .on('click', App.deleteTask)
      
      
    $newTaskTemplate.find('.edit-button')
    .prop('name', taskId)
                  .on('click', App.editTask); 

    // Put the task in the correct list
    if (taskCompleted) {
      const taskstart= await App.todoList.starttime(taskId)
      const taskend= await App.todoList.endtime(taskId)
      const tasktime= (taskend-taskstart)/60
      $('#completedTaskList').html("Task Completed in:"+tasktime.toFixed(2) +" minutes").append($newTaskTemplate)
    } else {
      $('#taskList').append($newTaskTemplate)
    }

    if (taskIsDeleted) {
      window.alert(5 + 6);
      $newTaskTemplate.find('.deleteButton').remove()
      // $newTaskTemplate.find('.content').addClass('deleted')
    }
      
    // Show the task
    $newTaskTemplate.show()
  }
}
}
},
    
  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId, {from: App.account})
    window.location.reload()
  },

  editTask: async(e) =>{
    App.setLoading(true)
    const taskId = e.target.name
    const newContent = prompt('Enter new task content:');
    const newPriority = prompt('Enter new task priority:');
    const user = prompt('Enter new user :');
    
    await App.todoList.editTask(taskId, newContent,parseInt(newPriority,10) ,user,{from: App.account});
    window.location.reload()

  },
  
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

  deleteTask: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.deleteTask(taskId, {from: App.account})
    window.location.reload()
  },

  createTask: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    const priority = $('#priorityTask').val()
    const user = $('#userTask').val()
    await App.todoList.createTask(content, parseInt(priority,10),user,{from: App.account})
    // refresh the page to refetch the tasks
    window.location.reload()
  },

  filterByUser: async() =>{
    const taskCount = await App.todoList.taskCount()
    App.setLoading(true)
    const user = $('#username').val()
    
    await App.todoList.filterByUser(user,{from: App.account})
    const $userTemplate=$('.userTemplate')
    const $userList = $('#userList')
    $userList.empty()

    // Create the html for the task
    for(var i=0;i<=taskCount;i++)
    {
      const data = await App.todoList.contentData(i);
      console.log(data)
      if (data!=""){
        const $userTaskTemplate = $userTemplate.clone()
      $userTaskTemplate.find('.usercontent').html("Task title: " + data +" " + "assigned to: " +user)  
      $('#userList').append($userTaskTemplate)
      $userTaskTemplate.show()
      }   
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })

})