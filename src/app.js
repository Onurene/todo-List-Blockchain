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
    const $sortedTaskList = $('#sortedTaskList')
    const $sortContent = $('.sortContent')

    const $taskList = $('#taskList')
    const $completedTaskList = $('#completedTaskList')
    $taskList.empty()
    $completedTaskList.empty()
    $sortedTaskList.empty()
    
   var dict = {}

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
   console.log(dict)



for(var i=3;i>=1;i--){
  if(dict[i]){
for(var j=0;j<dict[i].length;j++){
  console.log(" sorted tasks ids", dict[i][j])
  const task = await App.todoList.tasks(dict[i][j])
  console.log(" sorted tasks ids", task[1])
  const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]
      const taskIsDeleted = task[3]
      const taskPriority =task[4]

      /*
      console.log(task)
      console.log('taskId',taskId)
      console.log('taskContent',taskContent)
      console.log('taskCompleted',taskCompleted)
      console.log('taskDeleted',task[3])
      console.log('priority',task[4].words[0])
      */
      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
                      
      $newTaskTemplate.find('.delete-button')
      .prop('name', taskId)
      .on('click', App.deleteTask)
      
      
        $newTaskTemplate.find('.edit-button')
        .prop('name', taskId)
                      .on('click', App.editTask); // add event listener

      
      

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
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
      
   
}}
}
},

/*
    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]
      const taskIsDeleted = task[3]
      const taskPriority =task[4]

      /*
      console.log(task)
      console.log('taskId',taskId)
      console.log('taskContent',taskContent)
      console.log('taskCompleted',taskCompleted)
      console.log('taskDeleted',task[3])
      console.log('priority',task[4].words[0])
      
      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
                      
      $newTaskTemplate.find('.delete-button')
      .prop('name', taskId)
      .on('click', App.deleteTask)
      
      
        $newTaskTemplate.find('.edit-button')
        .prop('name', taskId)
                      .on('click', App.editTask); // add event listener

      
      $newTaskTemplate.find('.sort-button')
      .prop('name', taskId)
      .on('click', App.deleteTask)
                      const sorttask = await App.todoList.sortedTasks(i)
                      const sorttaskId = sorttask[0].toNumber()
                      const sorttaskContent = sorttask[1]
                      const sorttaskCompleted = sorttask[2]
                
      const $sortContentTemplate = $sortContent.clone()
      $sortContentTemplate.find('.sort-button')
                          .on('click',App.getTasks)
      
      $('#sortedTaskList').append($sortContentTemplate)
      

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
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
      console.log("Hello")
      $sortContentTemplate.show()
      console.log("bye")

    }
  },
*/
 createTask: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    const priority = $('#priorityTask').val()
    console.log('CREATE PRIORITY',parseInt(priority,10),typeof(parseInt(priority,10)))
    await App.todoList.createTask(content, parseInt(priority,10),{from: App.account})
    // refresh the page to refetch the tasks
    window.location.reload()
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
    console.log('new content',newContent);
    console.log('taskId',taskId);
    
    await App.todoList.editTask(taskId, newContent, {from: App.account});
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

  getTasks: async(e) =>{
    App.setLoading(true)
    //const taskId = e.target.name
    console.log("in gettasks")
    await App.todoList.getTasks({from: App.account})
    window.location.reload()
  }
 
}

$(() => {
  $(window).load(() => {
    App.load()
  })

})