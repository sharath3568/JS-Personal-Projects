// const promise = new Promise(function(resolve,reject){
//     setTimeout(function(){
//         reject("Promise rejected");
//     },5000);
// })

// promise.then(function(result){
//     console.log(result);
// })
// .catch(function(result){
//     console.log(result);
// })

function task1() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("Task 1 Completed");
      resolve("Nani");
    }, 2000);
  });
}

function task2(result) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("Task 2 received : ", result);
      resolve("Task 2 Completed");
    }, 4000);
  });
}

function task3(result) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("Task 3 received : ", result);
      resolve("Task 3 Completed");
    }, 4000);
  });
}

//result 1 value from task 1 passed as parameter to task 2
// task1()
//     .then(function(result1){
//         return task2(result1);
//     })
//     .then(function(result2){
//         return task3(result2);
//     })
//     .then(function(result3){
//         console.log(result3);
//     })
//     .catch(function(error){
//         console.log(error);
//     })

//await will wait for the Promise returned by task1() to settle, and give me its resolved value."
async function runTasks() {
  try {
    const result1 = await task1();
    const result2 = await task2(result1);
    const result3 = await task3(result2);
    console.log(result3);
  } catch (error) {
    console.log("Error:", error);
  }
}

//Long version
// fetch("https://jsonplaceholder.typicode.com/todos/1")
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(data){
//         console.log(data);
//     })

//Best Version
async function getTask() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    if(!response.ok){
        throw new Error(`HTTP error : ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } 
  catch (error) {
    console.log("Something went wrong:", error);
  }
}

async function createTask(){
    try{
        const newTask = {
            title : "Learn React",
            completed : false,
            userId : 1
        };

        const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)
        });

        if(!response.ok){
            throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json();

        console.log(data);
    }
    catch(error){
        console.log("Error: ",error.message);
    }
}
getTask();
createTask();

//runTasks();
