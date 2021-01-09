const inquirer =require('inquirer');
const mysql =require('mysql'); 
const cTable = require('console.table');
require('dotenv').config()


//creates the connection
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // username
    user: "root",
  
    // Your password
    password: "process.env.DB_PASS",

    //database name
    database: "employee_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    console.log("Welcome to Employee Tracker..."); 
    // run the start function after the connection is made to prompt the user
    start();
  });


  function start() {
      inquirer
      .prompt({
        name: "actions",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View all employees", "Add an employee", "Remove an employee", "Update employee role", "Exit"]
      })
      .then(function(answer) {
      switch (answer.actions) {
        case "View all employees":
          return allEmployees();
          break;
  
        case "Add an employee":
          return addEmployee();
          break;
  
        case "Remove an employee":
          return removeEmployee();
          break;
  
        case "Update employee role":
          return updateEmployee();
          break;
  
        case "Exit":
          return exitApp();
          break;
        }
      });
  }

  function allEmployees() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name AS department, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id"
  connection.query(query, function(err, res) {
    if (err) throw err;
      console.table(res);
    start(); 
  })
  }

  function addEmployee(){
    inquirer
    .prompt([
      {
      name:"first_name",
      type: "input",
      message: "What is the employee's first name?"
    }, 
    {
      name:"last_name",
      type: "input",
      message: "What is the employee's last name?"
    }, 
    {
      name:"role",
      type: "input",
      message: "What is the employee's role?"
    },
    {
      name:"manager",
      type: "input",
      message: "Who is the employee's manager?"
    },
  ])
  .then(function(response){
    var query = "INSERT INTO employee SET ?" 
    
    var employee = {
      first_name: response.first_name, 
      last_name: response.last_name, 
      role_id: response.role, 
      manager_id: response.manager 
    }
    connection.query(query, employee, function(err, res) {
      if (err) throw err;
        console.table(res);
      start(); 
    })  
  })
}


function updateEmployee(){
var query = 'SELECT * from employee' 
  
  connection.query(query, function(err, res) {
    if (err) throw err; 

    var choices = res.map(employee => employee.first_name + ' ' + employee.last_name +' ' + employee.id); 

    inquirer
    .prompt([
      {
      name:"name",
      type: "rawlist",
      message: "Which employee's role would you like to update?",
      choices: choices
    }, 
    {
      name:"newRoleId",
      type: "input",
      message: "What is the employee's new role id?"
    }, 
  ])
  .then(function(response) {
    var employeeChoiceArr = response.name.split(' ');
    var employeeId = employeeChoiceArr[employeeChoiceArr.length-1];
    var query = "UPDATE employee SET role_id = ? WHERE id = ?" 

    connection.query(query, [response.newRoleId, employeeId], function(err, res) {
    if (err) throw err; 
    console.table(res);
    start();
    })
  
  })
  
  
  })
  
}

  function exitApp(){
      connection.end();
  }


  
  