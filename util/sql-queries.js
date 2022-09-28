// reference link for callback functions: https://developer.mozilla.org/en-US/docs/Glossary/Callback_function#:~:text=A%20callback%20function%20is%20a,kind%20of%20routine%20or%20action.

// reference link for using module.exports: https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files 

// require packages
const consoleTable = require('console.table');
const inquirer = require('inquirer');

// Exporting this code as a singular object with multiple functions within it
// Each function has arguments for a connection variable and a callback function to execute
// These functions execute unique query calls that are based on the inquirer prompt answers that come before them, if any
module.exports = {
  viewDepartments: function(connection, cbFunction) {
    const query = `
      SELECT 
          department.id AS department_id,
          department.name AS department_name
      FROM department
      ;
    `;
    connection.query(query, function(err, data) {
      if (err) throw err; 
      console.table(data);
      cbFunction();
    });
  },
  viewRoles: function(connection, cbFunction) {
    const query = `
      SELECT
          role.id AS role_id,
          role.title AS title,
          role.salary AS salary,
          department.name AS department
      FROM role
      JOIN department ON role.department_id = department.id
      ;
    `;
    connection.query(query, function(err, data) {
      if (err) throw err;
      console.table(data);
      cbFunction();
    });
  },
  viewEmployees: function(connection, cbFunction) {
    const query = `
      SELECT
          employee.id AS employee_id,
          employee.first_name AS first_name,
          employee.last_name AS last_name,
          role.title AS title,
          department.name AS department,
          role.salary AS salary,
          CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee 
      JOIN department ON employee.department_id = department.id
      JOIN role ON employee.role_id = role.id 
      JOIN manager ON employee.manager_id = manager.id
      ORDER BY employee.id
      ;
    `;
    connection.query(query, function(err, data) {
      if (err) throw err;  
      console.table(data);
      cbFunction();
    });
  },
  viewEmployeesByManager: function(connection, cbFunction) {
    inquirer
    .prompt([
      {
        name: 'manager',
        type: 'list',
        message: `Choose a manager `,
        choices: ['1: Zach Z', '2: Yelena Y', '3: Xavier X', '4: Wendy W'],
      },
    ]).then(function (response){
      const query = `
        SELECT
            employee.id AS employee_id,
            employee.first_name AS first_name,
            employee.last_name AS last_name,
            role.title AS title,
            department.name AS department,
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee 
        JOIN department ON employee.department_id = department.id
        JOIN role ON employee.role_id = role.id 
        JOIN manager ON employee.manager_id = manager.id
        WHERE ?
        ;
      `;
      connection.query(query, 
        [
          {
            // use the character at the 0th index of the inquire response,
            // which is a number that represents the manager_id (line 74)
            manager_id: response.manager.charAt(0)
          }
        ],
        function(err, data) {
          if (err) throw err;
          console.table(data);
          cbFunction();
        }
      );
    });
  },
  viewEmployeesByDepartment: function(connection, cbFunction) {
    inquirer
    .prompt([
      {
        name: 'department',
        type: 'list',
        message: `Choose a department `,
        choices: ['1: Legal', '2: Sales', '3: Marketing', '4: Engineering'],
      },
    ]).then(function (response){
      const query = `
        SELECT
            employee.id AS employee_id,
            employee.first_name AS first_name,
            employee.last_name AS last_name,
            role.title AS title,
            department.name AS department,
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee 
        JOIN department ON employee.department_id = department.id
        JOIN role ON employee.role_id = role.id 
        JOIN manager ON employee.manager_id = manager.id
        WHERE employee.?
        ;
      `;
      connection.query(query, 
        [
          {
            // use the character at the 0th index of the inquire response,
            // which is a number that represents the manager_id (line 154)
            department_id: response.department.charAt(0)
          }
        ],
        function(err, data) {
          if (err) throw err;
          console.table(data);
          cbFunction();
        }
      );
    });
  },
  viewBudgetByDepartment: function(connection, cbFunction) {
    inquirer
    .prompt([
      {
        name: 'department',
        type: 'list',
        message: `Choose a department `,
        choices: ['1: Legal', '2: Sales', '3: Marketing', '4: Engineering'],
      },
    ]).then(function (response){
      // reference link to details regarding SUM() function: https://www.w3resource.com/sql/aggregate-functions/sum-with-group-by.php
      const query = `
        SELECT
          department.name AS department,
          SUM(role.salary) AS budget
        FROM employee 
        JOIN role ON employee.role_id = role.id
        JOIN department ON employee.department_id = department.id
        WHERE employee.?
        GROUP BY employee.department_id
        ;
      `;
      connection.query(query, 
        [
          {
            // use the character at the 0th index of the inquire response,
            // which is a number that represents the manager_id (line 156)
            department_id: response.department.charAt(0)
          }
        ],
        function(err, data) {
          if (err) throw err;
          console.table(data);
          cbFunction();
        }
      );
    });
  },
  addDepartment: function(connection, cbFunction) {
    inquirer
    .prompt({
        name: 'newDepartment',
        type: 'input',
        message: 'Department name: ',
    }).then(function (response){
      connection.query('INSERT INTO department SET ?', 
        { 
          name: response.newDepartment 
        }, 
        function(err) {
        if (err) throw err;
        console.log('--------------------------------------\n| Successfully added new department. | \n--------------------------------------');
        cbFunction();
      });
    })
    .catch((err) => console.error(err))
  },
  addRole: function(connection, cbFunction) {
    inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Title of Role: ',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Salary: ',
      },
      {
        name: 'departmentId',
        type: 'list',
        message: 'Department ID: ',
        choices: ['1: Legal', '2: Sales', '3: Marketing', '4: Engineering'],
      },
    ]).then(function (response){
      connection.query('INSERT INTO role SET ?', 
        { 
          title: response.title,
          salary: response.salary,
          // use the character at the 0th index of the inquire response,
          // which is a number that represents the manager_id (line 223)
          department_id: response.departmentId.charAt(0)
        }, 
        function(err) {
          if (err) throw err;
          console.log('--------------------------------\n| Successfully added new role. |\n--------------------------------');
          cbFunction();
      });
    });
  },
  addEmployee: function(connection, cbFunction) {
    inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'First Name: ',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Last Name: ',
      },
      {
        name: 'departmentId',
        type: 'list',
        message: 'Department ID: ',
        choices: ['1: Legal', '2: Sales', '3: Marketing', '4: Engineering'],
      },
      {
        name: 'roleId',
        type: 'list',
        message: 'Role ID: ',
        choices: ['1: Counsel II','2: Sr. Sales Rep','3: Marketing Consultant','4: Princ. Engineer'],
      },
      {
        name: 'managerId',
        type: 'list',
        message: 'Manager ID:',
        choices: ['1: Zach Z', '2: Yelena Y', '3: Xavier X', '4: Wendy W']
      },
    ]).then(function (response){
      connection.query('INSERT INTO employee SET ?', 
        { 
          first_name: response.firstName,
          last_name: response.lastName,
          // use the character at the 0th index of the inquire response,
          // which is a number that represents the manager_id (lines 258, 264, 270)
          department_id: response.departmentId.charAt(0),
          role_id: response.roleId.charAt(0),
          manager_id: response.managerId.charAt(0)
        }, 
        function(err) {
          if (err) throw err;
          console.log('------------------------------------\n| Successfully added new employee. |\n------------------------------------');
          cbFunction();
        }
      );
    })
  },
  updateEmployeeRole: function(connection, cbFunction) {
    connection.query('SELECT * FROM employee', function(err, data) {
      if (err) throw err;
      inquirer
      .prompt([
        {
          name: 'employeeChoice',
          type: 'list',
          message: 'Choose employee: ',
          choices: function() {
            // for every result from the SELECT statement above,
            // push the full name of each employee to the array then return it as the value of the "choices" key
            const employeeChoiceArray = [];
            for (let i = 0; i < data.length; i++) {
              let fullName = `${data[i].first_name} ${data[i].last_name}`
              employeeChoiceArray.push(fullName);
            }
            return employeeChoiceArray;
          },
        },
        {
          name: 'newRole',
          type: 'list',
          message: 'Select New Role ID: ',
          choices: ['1: Counsel II', '2: Sr. Sales Rep', '3: Marketing Consultant', '4: Princ. Engineer'],
        },
      ]).then(function (response){

        // Function to return the id of whichever employee is selected from the choices available
        function selectedEmployeeId(){
          for (let i = 0; i < data.length; i++) {
            if(
              response.employeeChoice == `${data[i].first_name} ${data[i].last_name}`
            ){
              return data[i].id;
            }
          }
        }

        connection.query('UPDATE employee SET ? WHERE ?', 
          [
            {
              // use the character at the 0th index of the inquire response,
              // which is a number that represents the manager_id (line 315)
              role_id: response.newRole.charAt(0)
            },
            {
              id: selectedEmployeeId()
            }
          ], function(err) {
            if (err) throw err;
            console.log('---------------------------------------\n| Successfully updated employee role. |\n---------------------------------------');
            cbFunction();
        });
      });
    });
  },
  updateEmployeeManager: function(connection, cbFunction) {
    connection.query('SELECT * FROM employee', function(err, data) {
      if (err) throw err;
      inquirer
      .prompt([
        {
          name: 'employeeChoice',
          type: 'list',
          choices: function() {
            // for every result from the SELECT statement above,
            // push the full name of each employee to the array then return it as the value of the "choices" key
            const employeeChoiceArray = [];
            for (let i = 0; i < data.length; i++) {
              let fullName = `${data[i].first_name} ${data[i].last_name}`
              employeeChoiceArray.push(fullName);
            }
            return employeeChoiceArray;
          },
          message: 'Choose employee:',
        },
        {
          name: 'newManager',
          type: 'list',
          message: `Select New Manager's ID `,
          choices: ['1: Zach Z', '2: Yelena Y', '3: Xavier X', '4: Wendy W'],
        },
      ]).then(function (response){

        // Function to return the id of whichever employee is selected from the choices available
        function selectedEmployeeId(){
          for (let i = 0; i < data.length; i++) {
            if(
              response.employeeChoice == `${data[i].first_name} ${data[i].last_name}`
            ){
              return data[i].id;
            }
          }
        }

        connection.query('UPDATE employee SET ? WHERE ?', 
          [
            {
              // use the character at the 0th index of the inquire response,
              // which is a number that represents the manager_id (line 372)
              manager_id: response.newManager.charAt(0)
            },
            {
              id: selectedEmployeeId()
            }
          ], function(err) {
            if (err) throw err;
            console.log('------------------------------------------\n| Successfully updated employee manager. |\n------------------------------------------');
            cbFunction();
        });
      });
    });
  },
  deleteDepartment: function(connection, cbFunction) {
    connection.query('SELECT * FROM department', function(err) {
      if (err) throw err;

      inquirer
      .prompt([
        {
          name: 'department',
          type: 'list',
          message: 'Choose department to delete:',
          choices: ['1: Legal', '2: Sales', '3: Marketing', '4: Engineering']
        },
      ]).then(function (response){
        connection.query('DELETE FROM department WHERE ?', 
          [
            {
              // use the character at the 0th index of the inquire response,
              // which is a number that represents the manager_id (line 413)
              id: response.department.charAt(0)
            }
          ], function(err) {
            if (err) throw err;
            console.log('------------------------------------\n| Successfully deleted department. |\n------------------------------------');
            cbFunction();
        });
      });
    });
  },
  deleteRole: function(connection, cbFunction) {
    connection.query('SELECT * FROM role', function(err) {
      if (err) throw err;

      inquirer
      .prompt([
        {
          name: 'role',
          type: 'list',
          message: 'Choose role to delete:',
          choices: ['1: Counsel II', '2: Sr. Sales Rep', '3: Marketing Consultant', '4: Princ. Engineer'],
        },
      ]).then(function (response){
        connection.query('DELETE FROM role WHERE ?', 
          [
            {
              // use the character at the 0th index of the inquire response,
              // which is a number that represents the manager_id (line 443)
              id: response.role.charAt(0)
            }
          ], function(err) {
            if (err) throw err;
            console.log('------------------------------\n| Successfully deleted role. |\n------------------------------');
            cbFunction();
        });
      });
    });
  },
  deleteEmployee: function(connection, cbFunction) {
    connection.query('SELECT * FROM employee', function(err, data) {
      if (err) throw err;

      inquirer
      .prompt([
        {
          name: 'employeeChoice',
          type: 'list',
          message: 'Choose role to delete:',
          choices: function() {
            const employeeChoiceArray = [];
            for (let i = 0; i < data.length; i++) {
              let fullName = `${data[i].first_name} ${data[i].last_name}`
              employeeChoiceArray.push(fullName);
            }
            return employeeChoiceArray;
          },
        },
      ]).then(function (response){

        function selectedEmployeeId(){
          for (let i = 0; i < data.length; i++) {
            if(
              response.employeeChoice == `${data[i].first_name} ${data[i].last_name}`
            ){
              return data[i].id;
            }
          }
        }

        connection.query('DELETE FROM employee WHERE ?', 
          [
            {
              id: selectedEmployeeId()
            }
          ], function(err) {
            if (err) throw err;
            console.log('----------------------------------\n| Successfully deleted employee. |\n----------------------------------');
            cbFunction();
        });
      });
    });
  }
}