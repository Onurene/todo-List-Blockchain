pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
    bool deleted;
    uint priority;
    string assignedTo;
  }

  mapping(uint => Task) public tasks;
  string[]  public contentData;
  mapping(uint => uint) public starttime;
  mapping(uint => uint) public endtime;

  event TaskCreated(
    uint id,
    string content,
    bool completed,
    bool deleted,
    uint priority,
    string assignedTo

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
    uint priority,
    string assignedTo
  );

event userFiltered(
    string [] content
  );

  constructor() public {
    createTask("Task #1",1,"Jay");
  }

  function createTask(string memory _content,uint _priority, string memory _assignedTo) public {
    require(_priority >= 1 && _priority <= 3, "Invalid priority level");
    taskCount ++;
    starttime[taskCount]=block.timestamp;
    tasks[taskCount] = Task(taskCount, _content, false,false,_priority,_assignedTo);
    emit TaskCreated(taskCount, _content, false,false,_priority,_assignedTo);
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

  function editTask(uint _id, string memory _newContent, uint _priority,string memory _assignedTo) public {
      require(_id > 0 && _id <= taskCount, "Invalid task ID");
      require(_priority >= 1 && _priority <= 3, "Invalid priority level");

      Task storage task = tasks[_id];
      require(!task.deleted, "Task has been deleted");
      task.content = _newContent;
      task.priority = _priority;
      task.assignedTo = _assignedTo;
      tasks[_id] = task;
      emit TaskUpdated(_id, task.content, task.completed, task.deleted,task.priority,task.assignedTo);
}

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    endtime[taskCount]=block.timestamp;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  } 

  function assignTask(uint _id,string memory _assignedTo) public {
    require(_id > 0 && _id <= taskCount, "Invalid task ID");
    tasks[_id].assignedTo = _assignedTo;
  }

  function filterByUser(string memory _assignedTo) public {
    contentData = new string[](taskCount);
    uint count=0;
    for (uint i = 0; i<=taskCount; i++){
            if (compareStrings(tasks[i].assignedTo, _assignedTo)){
                contentData[count++]=tasks[i].content;
            }
        }
  }
  function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return keccak256(bytes(a)) == keccak256(bytes(b));
}

}

