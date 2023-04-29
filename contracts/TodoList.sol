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

  

  mapping(uint => Task) public tasks;

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

  constructor() public {
    createTask("Task #1",1);
  }

  function createTask(string memory _content,uint _priority) public {
    require(_priority >= 1 && _priority <= 3, "Invalid priority level");
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false,false,_priority);
    emit TaskCreated(taskCount, _content, false,false,_priority);
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

}

