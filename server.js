//requires dotenv to omit the password from public exposure
require('dotenv').config();
//requires inquirer for application questions
const inquirer =require('inquirer');
//requires mysql to interact with db
const mysql =require('mysql'); 
//required to create tables
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
    console.log("Welcome to the Employee Tracking App..."); 
    // run the start function after the connection is made to prompt the user
    start();
  });

//initializes first prompt/response (via switch statement) initiates new function 
  function start() {

    console.log(" "); 
      inquirer
      .prompt({
        name: "actions",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View all employees", 
                  "View all roles", 
                  "View all departments", 
                  "Add an employee", 
                  "Add a role", 
                  "Add a department", 
                  "Update an employee's role", 
                  "Delete an employee", 
                  "Delete a role", 
                  "Delete a department",
                  "Exit"]
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
  
        case "Update an employee's role":
          return updateEmployee();
          break;

        case "Delete an employee":
          return deleteEmployee();
          break;

        case "Delete a role":
          return deleteRole();
          break;

        case "Delete a department":
          return deleteDepartment();
          break;
  
        case "Exit":
          return exitApp();
          break;
        }
      });
  }


  //generates a list of all employees, their roles, departments, pay; combines tables with LEFT JOINs
  function allEmployees() {
    //mysql "GET" statement with LEFT JOINS unifies all tables into one
    var query = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name AS department, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id"
  connection.query(query, function(err, res) {
    if (err) throw err;
    //shows all employees
      console.table(res);
    //restarts query
    start(); 
  })
  }


  //generates a list of roles with associated departments using INNER JOIN to join roles and dept tables
  function allRoles() {
    //mysql "GET" statement uses INNER JOIN to unite roles and department table
    var query = "SELECT roles.title, roles.salary, department.name AS department FROM roles INNER JOIN department on roles.department_id = department.id;"
  connection.query(query, function(err, res) {
    if (err) throw err;
    //shows all roles
      console.table(res);
  //restarts query
    start(); 
  })
  }

  //generates a list of departments 
  function allDepartments() {
    //mysql "GET" statement shows all departments
    var query = "SELECT name FROM department"
  connection.query(query, function(err, res) {
    if (err) throw err;
    //shows results
      console.table(res);
      //restarts query
    start(); 
  })
  }

  //adds employee with responses from prompt and then adds the new information to the employee table; new table comes up showing added employee
  function addEmployee(){
    console.log(" ");
    //prompts for new employee info
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
    //mysql INSERT creates a new record in employee db
    var query = "INSERT INTO employee SET ?" 
    
    //new parameters to be inserted into table
    var employee = {
      first_name: response.first_name, 
      last_name: response.last_name, 
      role_id: response.role, 
      manager_id: response.manager 
    }
    //combines the 2 variables to create a mysql statement, creating new employee in db
    connection.query(query, employee, function(err, res) {
      if (err) throw err;
        console.log(" ");
        console.log("Employee added!")
        console.log(" ");
        //shows updated employee table with new employee
      allEmployees(); 
    })  
  })
}

//adds role based information to roles table and shows new role added to table
function addRole (){
  console.log(" ");
  //question prompt
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
  //mysql statement to create/POST in roles db
  var query = "INSERT INTO roles SET ?" 
  
  //variable to hold roles parameters
  var role = {
    title: response.role_title, 
    salary: response.salary, 
    department_id: response.deptId, 
    
  }
  //combines 2 variables to create mysql statement to create the new role
  connection.query(query, role, function(err, res) {
    if (err) throw err;
      console.log(" ");
      console.log("New role added!"); 
      console.log(" "); 
      //shows updated roles table to see new role
    allRoles(); 
  })  
})
}


//adds departments to department database based on prompt responses and then shows departments table with newly added department
function addDepartment (){
  console.log(" ");
//questions prompt for new department
  inquirer
  .prompt([
    {
    name:"deptName",
    type: "input",
    message: "What is name of the department to be added?"
  }
])
.then(function(response){
  //mysql statement to create/POST new department
  var query = "INSERT INTO department SET ?" 
  
  //holds department parameter
  var deptName ={
    name: response.deptName, 
  }
  //combines 2 variables to create a mysql statement that creates a new department
  connection.query(query, deptName, function(err, res) {
    if (err) throw err;
    console.log(" ");
    console.log("New department added!");
    console.log(" ");
    //shows all departments to reveal new department added to table
    allDepartments(); 
  })  
})
}

//updates an existing employee
function updateEmployee(){
  console.log(" ");

  //mysql "GET"/read employee data statement
var query = 'SELECT * from employee' 
  
//queries db to get all employees
  connection.query(query, function(err, res) {
    if (err) throw err; 

    //creates an array of existing employees from the table
    var choices = res.map(employee => employee.first_name + ' ' + employee.last_name +' ' + employee.id); 


    //questions prompt
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
    //splits the response at each space into an array on the space between the names and employee id
    var employeeChoiceArr = response.name.split(' ');
    //targets the employee id specifically 
    var employeeId = employeeChoiceArr[employeeChoiceArr.length-1];
    //PUT/update statement to change the role id at the employees id number (why we target employeeId specifically above)
    var query = "UPDATE employee SET role_id = ? WHERE id = ?" 

    //creates query from combination of variables above
    connection.query(query, [response.newRoleId, employeeId], function(err, res) {
    if (err) throw err; 
    console.log(" ");
    console.log("Employee information has been updated!");
    console.log(" ");
    //shows updated employee table to confirm employee info was updated
    allEmployees();
    })
  
  })
  
  
  })
  
}



function deleteEmployee() {
  console.log(" ");
//GET/read mysql statement to pull info from employee table so user can choose which one to delete
  var query = 'SELECT * from employee' 
  
  //db query gets all employees to choose from
  connection.query(query, function(err, res) {
    if (err) throw err; 

//creates an array of employees to choose from
    var choices = res.map(employee => employee.first_name + ' ' + employee.last_name +' ' + employee.id); 
//question prompt
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
    //splits response on the space such that it creates an array of each item in the response
    var employeeChoiceArr = response.name.split(' ');
    //singles out the employee id so it can be used in the mysql statement to delete at that id
    var employeeId = employeeChoiceArr[employeeChoiceArr.length-1];
    //mysql DELETE statement to remove the employee information where the id matches
    var query = "DELETE FROM employee WHERE employee.id=?" 

    //db query to actually delete employee at specific id
    connection.query(query, [employeeId], function(err, res) {
    if (err) throw err; 
    console.log(" ");
    console.log("Employee successfully removed!");
    console.log(" ");
    //shows employee table so newly deleted employee is confirmed
    allEmployees();
    
    })
  })
})
}

function deleteRole(){
  console.log(" ");
  //mysql GET/read statement to show all roles
  var query ='SELECT * FROM roles'
//db query to show all roles
  connection.query(query, function(err, res) {
    if (err) throw err;
//creates an array of all the roles so the user can choose which to delete
    var choices = res.map(roles => roles.title); 

    //allows user to choose which to delete
    inquirer
    .prompt([
      {
      name:"name",
      type: "rawlist",
      message: "Which role would you like to remove?",
      choices: choices
    }
  ])
  .then(function(response) {
//isolates the response into a variable
    var roleChoice = response.name;
    //mysql DELETE statement to remove the roles that match the associated title
    var query = "DELETE FROM roles WHERE roles.title = ?;" 

    //db query to delete the chosen role
    connection.query(query, roleChoice, function(err, res) {
    if (err) throw err; 
    console.log(" ");
    console.log("Role successfully removed!");
    console.log(" ");
    //shows the updated roles table to indicate removal of chosen role
    allRoles();
    
    })
  })
  })
}

function deleteDepartment(){
  console.log(" ");

  //mysql GET/read statement to show all available departments 
  var query ='SELECT * FROM department'

  //db query to actually get the information
  connection.query(query, function(err, res) {
    if (err) throw err;
//creates an array of departments for the user to choose from
    var choices = res.map(department => department.name); 

    //asks user to choose which department will be deleted
    inquirer
    .prompt([
      {
      name:"name",
      type: "rawlist",
      message: "Which department would you like to remove?",
      choices: choices
    }
  ])
  .then(function(response) {
    //stores response in a variable
    var deptChoice = response.name;
    //mysql DELETE statement
    var query = "DELETE FROM department WHERE department.name=?" 

    //db query to actually delete the chosen department from the table
    connection.query(query, deptChoice, function(err, res) {
    if (err) throw err; 
    console.log(" ");
    console.log("Department successfully removed!");
    console.log(" ");
    //calls the departments table again to confirm deletion
    allDepartments();
    })
  })
  })
}

//closes the connection to the db and ends the app
function exitApp(){
      console.log(" ");
      console.log("Thank you for using the Employee Tracking app! See you again soon!");
      console.log(" ");
      connection.end();
  }


  
  