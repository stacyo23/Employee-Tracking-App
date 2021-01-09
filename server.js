require('dotenv').config();
const inquirer =require('inquirer');
const mysql =require('mysql'); 
const cTable = require('console.table');

//Please note: there will be fewer commits on this project in Github due to having to delete 
//my previous repo since my root password is a password I use globally

//creates the connection
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // username
    user: "root",
  
    // Your password
    password: process.env.DB_PASS,

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
        choices: ["View all employees", "View all roles", "View all departments", "Add an employee", "Add a role", "Add a department", "Update employee role", "Delete employee", "Exit"]
      })
      .then(function(answer) {
      switch (answer.actions) {
        case "View all employees":
          return allEmployees();
          break;

        case "View all roles":
            return allRoles();
            break;
        
        case "View all departments":
              return allDepartments();
              break; 

        case "Add an employee":
          return addEmployee();
          break;
  
        case "Add a role":
          return addRole();
          break;

        case "Add a department": 
          return addDepartment();
          break;
  
        case "Update employee role":
          return updateEmployee();
          break;

          case "Delete employee":
            return deleteEmployee();
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

  function allRoles() {
    var query = "SELECT * FROM roles"
  connection.query(query, function(err, res) {
    if (err) throw err;
      console.table(res);
    start(); 
  })
  }

  function allDepartments() {
    var query = "SELECT name FROM department"
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
      message: "What is the id of the employee's role?"
    },
    {
      name:"manager",
      type: "input",
      message: "What is the employee id of the employee's manager?"
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

function addRole (){

  inquirer
  .prompt([
    {
    name:"role_title",
    type: "input",
    message: "What is name of the role to be added?"
  }, 
  {
    name:"salary",
    type: "input",
    message: "What is the salary for the new role?"
  }, 
  {
    name:"deptId",
    type: "input",
    message: "What is the department id to which this new role belongs?"
  }, 
])
.then(function(response){
  var query = "INSERT INTO roles SET ?" 
  
  var role = {
    title: response.role_title, 
    salary: response.salary, 
    department_id: response.deptId, 
    
  }
  connection.query(query, role, function(err, res) {
    if (err) throw err;
      console.table(res);
    start(); 
  })  
})
}


//adds departments to department database
function addDepartment (){

  inquirer
  .prompt([
    {
    name:"deptName",
    type: "input",
    message: "What is name of the department to be added?"
  }
])
.then(function(response){
  var query = "INSERT INTO department SET ?" 
  
  var deptName ={
    name: response.deptName, 
  }
  connection.query(query, deptName, function(err, res) {
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



function deleteEmployee() {
  var query = 'SELECT * from employee' 
  
  connection.query(query, function(err, res) {
    if (err) throw err; 

    var choices = res.map(employee => employee.first_name + ' ' + employee.last_name +' ' + employee.id); 

    inquirer
    .prompt([
      {
      name:"name",
      type: "rawlist",
      message: "Which employee would you like to remove?",
      choices: choices
    }
  ])
  .then(function(response) {
    var employeeChoiceArr = response.name.split(' ');
    var employeeId = employeeChoiceArr[employeeChoiceArr.length-1];
    var query = "DELETE FROM employee WHERE employee.id=?" 

    // var employee = {
    //   id: employeeId
    // }


      // console.log(employee);
    connection.query(query, [employeeId], function(err, res) {
    if (err) throw err; 
    console.table(res);
    console.log("Employee successfully removed");
    console.log(" ");
    start();
    
    })
  })
})
}


function exitApp(){
      connection.end();
  }


  
  