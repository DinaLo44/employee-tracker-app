const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const fs = require('fs');
const dbConnection = require('./db/connection');

// class dataBase {
//     constructor(dbConnection) {
//         this.dbConnection = dbConnection;
//     }
// }

function showMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What action would you like to execute?',
            choices: ['View all departments', 'View all roles', 'View all employees',
                'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
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
            default:
                console.log('Exit')

        }
    })
};

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

//Missing job titles, departments? , and managers the employees report to
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
            (err, results) => {
                if (err) {
                    throw err
                } else {
                    console.table(results)
                }
                showMenu()
            })
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the role title you would like to add?',
            name: 'role'
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
                title: response.role,
                salary: response.salary,
                department_id: response.departmentId
            },
            (err, results) => {
                if (err) { throw err }
                else {
                    console.table(results)
                }
                showMenu()
            })
    });

}
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
                type: 'rawlist',
                message: 'What is the role id for this employee?',
                name: 'role',
                choices: function () {
                    let addedEmployee = [];
                    for (let i = 0; results.length; i++) {
                        addedEmployee.push(results[i].title)
                    }
                    return addedEmployee;
                }
            },
            {
                type: 'number',
                message: 'What is the manager id?',
                name: 'manager',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (response) {
            dbConnection.query('INSERT INTO employee SET ?', {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: response.role,
                manager_id: response.manager
            }
            )
            console.log("Employee information added successfully")
               
            showMenu()
    })
})}
 // (err, results) => {
                //     if (err) { throw err }
                //     else {
                //         console.table(results)
                //     }
                //     showMenu()
                // }



// function updateRole(updatedRole) {
//     dbConnection.query('UPDATE role SET role_id = ? WHERE id = ?', (err, results) => {
//         if (err) { throw err }
//         else {
//             console.table(results)
//         }
//         showMenu()
//     })
// };

showMenu()