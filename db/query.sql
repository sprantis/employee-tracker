-- query all department info
SELECT 
    department.id AS department_id,
    department.name AS department_name
FROM department
;

-- query all role info
SELECT
    role.id AS role_id,
    role.title AS title,
    role.salary AS salary,
    department.name AS department
FROM role
JOIN department ON role.department_id = department.id
;

-- query all manager info
SELECT
    manager.id AS manager_id,
    manager.first_name AS first_name,
    manager.last_name AS last_name,
    department.name AS department
FROM manager
JOIN department ON manager.department_id = department.id
JOIN role ON manager.id = role.id
;

-- query all employee info (including department, role, and manager info)
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

-- query all employees by manager
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
ORDER BY manager
;

-- query all employees by department
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
ORDER BY department
;

-- query budget
SELECT
    department.name AS department,
    SUM(role.salary) AS budget
FROM employee 
JOIN role ON employee.role_id = role.id
JOIN department ON employee.department_id = department.id
WHERE employee.department_id = 3 -- static value
GROUP BY employee.department_id
;