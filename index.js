// Referencing code from Module 12 Mini Project

// require packages
const mysql = require('mysql2');
const inquirer = require('inquirer');

// require custom module 
const sqlQueries = require('./util/sql-queries');

// define connection to MySQL database
const connection = mysql.createConnection(
  {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_tracker_db'
  },
  console.log('---------------------------------------------------\n| Connecting to the employee_tracker_db database. |\n---------------------------------------------------')
);

// Function to start connection, then call the startPrompt function
function startConnection(){
  connection.connect(function(err) {
    if (err) throw err;
    startPrompt();
  });
}

// Function to end the connection
function endConnection(){
  connection.end(function(err) {
    if (err) throw err;
    console.log('----------------------------------------------------------\n| Ending connection to the employee_tracker_db database. |\n----------------------------------------------------------');
  });
}

// Function to initiate an inquirer prompt where user chooses an option,
// then runs the selectOption() function with the inquirer response as an argument
function startPrompt() {
  inquirer
  .prompt({
    name: 'option',
    type: 'list',
    message: 'Please select an option',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'View employees by manager',
      'View employees by department',
      'View budget by department',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Update an employee manager',
      'Delete a department',
      'Delete a role',
      'Delete an employee',
      'Exit application'
    ]
  })
  .then(function(response) {
      selectOption(response);
  })
  .catch((err) => console.error(err))
}

// Provides user an inquirer prompt and asks if they want to do select any other options
const restartPrompt = function() {
  inquirer
  .prompt({
      name: 'redo',
      type: 'list',
      message: 'Select another option?',
      choices: [
          'Yes',
          'No'
      ]
  }).then(function(response) {
      if(response.redo == 'Yes'){
          // if yes, call the startPrompt() function again
          startPrompt();
      } else {
          // if no, end connection
          endConnection();
      }
  })
  .catch((err) => console.error(err))
}

// Function that uses a switch statement to handle user input
// If input not recognized, end the connection
// Each case passes in the connection variable and the restartPrompt function as arguments for the multiple "select option" functions
function selectOption(response) {
  switch (response.option) {
      case 'View all departments':
          sqlQueries.viewDepartments(connection, restartPrompt);
          break;

      case 'View all roles':
          sqlQueries.viewRoles(connection, restartPrompt);
          break;

      case 'View all employees':
          sqlQueries.viewEmployees(connection, restartPrompt);
          break;

      case 'View employees by manager':
          sqlQueries.viewEmployeesByManager(connection, restartPrompt);
          break;

      case 'View employees by department':
          sqlQueries.viewEmployeesByDepartment(connection, restartPrompt);
          break;

      case 'View budget by department':
          sqlQueries.viewBudgetByDepartment(connection, restartPrompt);
          break;
      
      case 'Add a department':
          // Had to pass in callback function as argument for the viewDepartments function to work
          sqlQueries.addDepartment(connection, function() {
            sqlQueries.viewDepartments(connection, restartPrompt)
          });
          break;

      case 'Add a role':
          // Had to pass in callback function as argument for the viewRoles function to work
          sqlQueries.addRole(connection, function() {
            sqlQueries.viewRoles(connection, restartPrompt)
          });
          break;

      case 'Add an employee':
          // Had to pass in callback function as argument for the viewEmployees function to work
          sqlQueries.addEmployee(connection, function() {
            sqlQueries.viewEmployees(connection, restartPrompt)
          });
          break;

      case 'Update an employee role':
          // Had to pass in callback function as argument for the viewEmployees function to work
          sqlQueries.updateEmployeeRole(connection, function() {
            sqlQueries.viewEmployees(connection, restartPrompt)
          });
          break;

      case 'Update an employee manager':
        // Had to pass in callback function as argument for the viewEmployees function to work
        sqlQueries.updateEmployeeManager(connection, function() {
          sqlQueries.viewEmployees(connection, restartPrompt)
        });
        break;    

      case 'Delete a department':
        // Had to pass in callback function as argument for the viewDepartments function to work
        sqlQueries.deleteDepartment(connection, function() {
          sqlQueries.viewDepartments(connection, restartPrompt)
        });
      break;

      case 'Delete a role':
        // Had to pass in callback function as argument for the viewRoles function to work
        sqlQueries.deleteRole(connection, function() {
          sqlQueries.viewRoles(connection, restartPrompt)
        });
      break;

      case 'Delete an employee':
        // Had to pass in callback function as argument for the viewEmployees function to work
        sqlQueries.deleteEmployee(connection, function() {
          sqlQueries.viewEmployees(connection, restartPrompt)
        });
      break;

      default:
          endConnection();
          break;
  }
}

// When index.js is run with node, call this function
startConnection();



