# Blockchain Project - Todo List App - Ethereum

Simple todo list app created using ethereum by smart contracts. 

## Deployment 
```bash
# Clone 
$ https://github.com/Onurene/todo-List-Blockchain.git

# Install dependencies 
$ npm install -g truffle@5.0.2
$ npm install

# Migrate 
truffle migrate --reset

# Run the app
$ npm run dev
```

## Listing Tasks
Modeling task with struct and mapping state variable tasks. Allowing for look up on any task by id.

```solidity
// TodoList.sol
pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;
}
```

## Creating Tasks 

createTask function accepts one argument, text for the task, and stores the new task on the blockchain by adding it to tasks. We want to trigger an event any time a new task is created. Solidity allows for the listening of these events inside the client-side application. TaskCreated() is triggered anytime a new task is created in createTask().

```solidity
// TodoList.sol
pragma solidity ^0.5.0;

contract TodoList {

  // ...

  event TaskCreated(
    uint id,
    string content,
    bool completed
  );

  // ...

  function createTask(string memory _content) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskCreated(taskCount, _content, false);
  }
}
```
## Completing Tasks

Checking off tasks on the todo list will update the smart contract. 

```solidity
// TodoList.sol
pragma solidity ^0.5.0;

contract TodoList {

  // ...

  event TaskCompleted(
    uint id,
    bool completed
  );

  // ...

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }
}
```
 






