INSERT INTO department (name)
VALUES
("Human Resources (HR)"),
("Customer Service (CS)"),
("Accounting"),
("Public Relations");

INSERT INTO role (title, salary, department_id)
VALUES
("HR director", 80000, 1),
("HR representative", 45000, 1),
("CS director", 75000, 2),
("CS representative", 25000, 2),
("Accounting Manager", 100000, 3),
("Accounting clerk", 65000, 3),
("Public info officer", 85000, 4),
("Marketing coordinator", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Dina", "Rivera", 1, NULL),
("Howard", "Spencer", 2, 1),
("Margaret", "Bell", 3, NULL),
("Alexander", "Jones", 4, 3),
("Lorena", "Alfaro", 5, NULL),
("Isaac", "Bauer", 6, 5),
("Jamie", "Helms", 7, NULL),
("Jonas", "Brentson", 8, 7);

