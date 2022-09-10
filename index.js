const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const fs = require('fs');
const dbConnection = require('./db/connection');


function showMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What action would you like to execute?',
            choices: ['View all departments', 'View all roles', 'View all employees',
                'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit'],
            name: 'menu'
        }
    ]).then(userSelection => {
        switch (userSelection.menu) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateRole();
                break;
            case 'Exit':
                RequestingExit()
                break;
            default:
                console.log('Please select an action to execute');

        }
    });
}

function viewDepartments() {
    dbConnection.query('SELECT * from department ORDER BY id ASC', (err, results) => {
        if (err) { throw err }
        else {
            console.table(results)
        }
        showMenu()
    }

    )
};

function viewRoles() {
    dbConnection.query('SELECT * from role', (err, results) => {
        if (err) { throw err }
        else {
            console.table(results)
        }
        showMenu()
    })
};

function viewEmployees() {
    dbConnection.query(
        `SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, 
        role.title AS Job_Title, role.salary AS Salary, department.name AS Department_Name, 
        employee.manager_id AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department on role.department_id = department.id ORDER BY employee.id ASC`,
        (err, results) => {
            if (err) { throw err }
            else {
                console.table(results)
            }
            showMenu()
        })
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the department you would like to add?',
            name: 'department'
        }
    ]).then(function (response) {
        dbConnection.query('INSERT INTO department VALUES (DEFAULT, ?)', [response.department],
            (err) => {
                if (err) {
                    throw err
                } else {
                    console.log('Department added successfully')

                }
                showMenu()
            })
    })
};

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the title you would like to add?',
            name: 'title'
        },
        {
            type: 'input',
            message: 'What is the salary for this role?',
            name: 'salary',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: 'number',
            message: 'What is the department id for this role?',
            name: 'departmentId',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
    ]).then(function (response) {
        dbConnection.query('INSERT INTO role SET ?',
            {
                title: response.title,
                salary: response.salary,
                department_id: response.departmentId
            },
            (err) => {
                if (err) { throw err }
                else {
                    console.log('Role added successfully')
                    
                }
                showMenu()
            });
    });
};
function addEmployee() {
    dbConnection.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the employee first name?',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'What is the employee last name?',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'What is the role id for this employee?',
                name: 'role',
                choices: function () {
                    let addedEmployeeRole = [];
                    for (const role of results) {
                        addedEmployeeRole.push(role.id)
                    }

                    return addedEmployeeRole;
                }
            },
            {
                type: 'list',
                message: 'What is the manager id?',
                name: 'manager',
                choices: [1, 3, 5, 7, 9]

            }
        ]).then(function (response) {
            dbConnection.query('INSERT INTO employee SET ?', {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: response.role,
                manager_id: response.manager
            },

                console.log('Employee added successfully'),

                showMenu()
            )
        })
    })
};
function updateRole() {
    dbConnection.query('SELECT * FROM employee', (err, results) => {
        if (err) { throw err };
        inquirer.prompt([
            {
                type: 'list',
                message: 'Choose the employee you would like to update?',
                name: 'name',
                choices: function () {
                    let employeeRole = [];
                    for (const lastName of results) {
                        employeeRole.push(lastName.last_name);
                    }
                    return employeeRole;
                }
            },
            {
                type: 'list',
                message: 'What is the id number you would like to assign to the new role of the selected employee?',
                name: 'roleTitle',
                choices: function () {
                    let roleIdArray = []
                    for (const role of results) {
                        roleIdArray.push(role.role_id);
                    }
                    return roleIdArray;
                }
            },
        ]).then(function (response) {
            let selectedLastName = response.name;
            dbConnection.query('UPDATE employee SET ? WHERE last_name = ?', [
                {
                    role_id: response.roleTitle
                }, 
                selectedLastName
            ],
                console.log('Update successfully completed'),
                showMenu()
            )
        })
    })
};

const RequestingExit = () =>
    inquirer.prompt([
        {
            name: "exiting",
            type: "confirm",
            message: "Are you sure you want to exit the application?",
        },
    ]).then((response) => {
            if (response.exiting) {
                console.log('You have successfully exited the application')
            } else {
                return showMenu();
            }
        });

showMenu()