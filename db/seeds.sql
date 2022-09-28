USE employee_tracker_db;

INSERT INTO department (name)
VALUES  
    ("Legal"),
    ("Sales"),
    ("Marketing"),
    ("Engineering")
;

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Counsel II", 200000, 1),
    ("Sr. Sales Rep", 80000, 2),
    ("Marketing Consultant", 70000, 3),
    ("Princ. Engineer", 150000, 4)
; 

INSERT INTO manager (first_name, last_name, department_id)
VALUES 
    ("Zach", "Z", 1),
    ("Yelena", "Y", 2),
    ("Xavier", "X", 3),
    ("Wendy", "W", 4)
;

INSERT INTO employee (first_name, last_name, department_id, role_id, manager_id)
VALUES 
    ("Aaron", "A", 1, 1, 1), 
    ("Bob", "B", 2, 2, 2), 
    ("Carry", "C", 3, 3, 3), 
    ("Daisy", "D", 4, 4, 4),
    ("Edward", "E", 1, 1, 1), 
    ("Francis", "F", 2, 2, 2), 
    ("Gale", "G", 3, 3, 3), 
    ("Holly", "H", 4, 4, 4),
    ("Ian", "I", 1, 1, 1), 
    ("Jessica", "J", 2, 2, 2), 
    ("Kyle", "K", 3, 3, 3), 
    ("Lisa", "L", 4, 4, 4)
;

