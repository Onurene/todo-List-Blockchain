pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
    bool deleted;
    uint priority;
  }

  struct SortedTask {
    uint id;
    string content;
    bool completed;
    bool deleted;
    uint priority;
  }

  

  mapping(uint => Task) public tasks;
  mapping(uint => SortedTask) public sortedTasks;

  event TaskCreated(
    uint id,
    string content,
    bool completed,
    bool deleted,
    uint priority
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  event TaskDeleted(
    uint id,
    bool deleted
  );

  event TaskUpdated(
    uint id,
    string content,
    bool completed,
    bool deleted,
    uint priority

  );

  event sortedTasksCreated(
    uint id,
    string content,
    bool completed,
    bool deleted,
    uint priority
  );

  constructor() public {
    createTask("Task #1",1);
  }

  function createTask(string memory _content,uint _priority) public {
    require(_priority >= 1 && _priority <= 3, "Invalid priority level");
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false,false,_priority);
    emit TaskCreated(taskCount, _content, false,false,_priority);
  }
  
  function getTasks() public{
  uint count=0;
  uint[] memory taskIds = new uint[](taskCount);
  uint[] memory taskPriorities = new uint[](taskCount);
  uint highPriorityIndex = 0;
  uint mediumPriorityIndex = 0;
  uint lowPriorityIndex = 0;
  for (uint i = 1; i <= taskCount; i++) {
    taskIds[i-1] = i;
    taskPriorities[i-1] = tasks[i].priority;

    if (tasks[i].priority == 3) {
      highPriorityIndex++;
    } else if (tasks[i].priority == 2) {
      mediumPriorityIndex++;
    } else {
      lowPriorityIndex++;
    }
  }
  //uint[] memory sortedTaskIds = new uint[](taskCount);
  uint index = 0;
  string memory _content;
  uint _priority;

  for (uint j = 3; j >= 1; j--) {
    for (uint k = 0; k < taskCount; k++) {
 _content=tasks[taskIds[k]].content;
   _priority=tasks[taskIds[k]].priority;

      if (taskPriorities[k] == j) {
        
        if (j == 3) {
          sortedTasks[index].id = taskIds[k];
          highPriorityIndex--;
          
        } else if (j == 2) {
          sortedTasks[index].id = taskIds[k];
          mediumPriorityIndex--;
        }
          else{
          sortedTasks[index].id = taskIds[k];
          lowPriorityIndex--;
          }
          index++;
        sortedTasks[count] = SortedTask(count, _content, false,false,_priority);
        count++;
      }
    }
    
    emit sortedTasksCreated(count, _content, false,false,_priority);

  //return sortedTaskIds;

  //emit sortCompleted(sortedTasks);
  }
  }








  function deleteTask(uint _id) public {
    require(_id <= taskCount, "Invalid task ID");
    Task memory _task = tasks[_id];
    _task.deleted = true;
    tasks[_id] = _task;
    for (uint i = _id; i<taskCount; i++){
            tasks[i] = tasks[i+1];
            tasks[i].id = tasks[i].id-1;
        }
    delete tasks[taskCount];
    taskCount--;
    emit TaskDeleted(_id,_task.deleted);
  }



  function editTask(uint _id, string memory _newContent, uint _priority) public {
      require(_id > 0 && _id <= taskCount, "Invalid task ID");
      require(_priority >= 1 && _priority <= 3, "Invalid priority level");

      Task storage task = tasks[_id];
      require(!task.deleted, "Task has been deleted");
      task.content = _newContent;
      task.priority = _priority;
      tasks[_id] = task;
      emit TaskUpdated(_id, task.content, task.completed, task.deleted,task.priority);
}

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }

/*
  function getTasks() public view returns (uint[] memory) {
    uint[] memory memoryArrayid = new uint[](taskCount);
    
    for(uint i = 0; i < taskCount; i++) {
        memoryArrayid[i] = tasks[i].id;
    }
    return memoryArrayid;

  }
  
*/
  //function getTasks() public view returns (uint[] memory) {
 

}

