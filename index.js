// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

// Referencing code from Module 12 Mini Project

const mysql = require('mysql2');
const inquirer = require('inquirer');
const sqlQueries = require('./util/sql-queries');

const connection = mysql.createConnection(
  {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_tracker_db'
  },
  console.log('---------------------------------------------------\n| Connecting to the employee_tracker_db database. |\n---------------------------------------------------')
);

function startConnection(){
  connection.connect(function(err) {
    if (err) throw err;
    startPrompt();
  });
}

function endConnection(){
  connection.end(function(err) {
    if (err) throw err;
    console.log('----------------------------------------------------------\n| Ending connection to the employee_tracker_db database. |\n----------------------------------------------------------');
  });
}

function startPrompt() {
  inquirer
  .prompt({
    name: 'option',
    type: 'list',
    message: 'Please select an option',
    choices: [
      'View departments',
      'View roles',
      'View employees',
      'View employees by manager',
      'View employees by department',
      'View budget by department',
      'Add department',
      'Add role',
      'Add employee',
      'Update employee role',
      'Update employee manager',
      'Delete department',
      'Delete role',
      'Delete employee',
      'Exit application'
    ]
  })
  .then(function(response) {
      selectOption(response);
  })
  .catch((err) => console.error(err))
}

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
          startPrompt();
      } else {
          endConnection();
      }
  })
  .catch((err) => console.error(err))
}

function selectOption(response) {
  switch (response.option) {
      case 'View departments':
          sqlQueries.viewDepartments(connection, restartPrompt);
          break;

      case 'View roles':
          sqlQueries.viewRoles(connection, restartPrompt);
          break;

      case 'View employees':
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
      
      case 'Add department':
          sqlQueries.addDepartment(connection, function() {
            sqlQueries.viewDepartments(connection, restartPrompt)
          });
          break;

      case 'Add role':
          sqlQueries.addRole(connection, function() {
            sqlQueries.viewRoles(connection, restartPrompt)
          });
          break;

      case 'Add employee':
          sqlQueries.addEmployee(connection, function() {
            sqlQueries.viewEmployees(connection, restartPrompt)
          });
          break;

      case 'Update employee role':
          sqlQueries.updateEmployeeRole(connection, function() {
            sqlQueries.viewEmployees(connection, restartPrompt)
          });
          break;

      case 'Update employee manager':
        sqlQueries.updateEmployeeManager(connection, function() {
          sqlQueries.viewEmployees(connection, restartPrompt)
        });
        break;    

      case 'Delete department':
        sqlQueries.deleteDepartment(connection, function() {
          sqlQueries.viewDepartments(connection, restartPrompt)
        });
      break;

      case 'Delete role':
        sqlQueries.deleteRole(connection, function() {
          sqlQueries.viewRoles(connection, restartPrompt)
        });
      break;

      case 'Delete employee':
        sqlQueries.deleteEmployee(connection, function() {
          sqlQueries.viewEmployees(connection, restartPrompt)
        });
      break;

      default:
          endConnection();
          break;
  }
}

startConnection();



