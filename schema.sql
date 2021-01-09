-- Drops the employee_db if it already exists --
DROP DATABASE IF EXISTS employee_db;

-- Created the DB "employee_db" 
CREATE DATABASE employee_db;

-- Use the DB employee_db; for all the rest of the script
USE employee_db;

-- Created the table "department"
CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);


-- Created the table "role"

CREATE TABLE roles (
  id int AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL, 
  department_id INT NOT NULL, 
  PRIMARY KEY(id)
);

-- Created the table "employee"

CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY(id)
);


-- moved to seed.sql
-- INSERT INTO department (name)
-- VALUES ("engineering"), ("legal"), ("finance"), ("sales");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("sales lead", 100000, 4), ("salesperson", 80000, 4), ("lead engineer", 150000, 1), ("software engineer", 120000, 1), 
-- ("accountant", 125000, 3), ("lawyer", 190000, 2), ("lead attorney", 250000, 2); 

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("John", "Doe", 1, NULL), ("Jane", "Doe", 1, NULL); 

-- SELECT * FROM department;

-- SELECT * FROM roles; 

-- SELECT * FROM employee; 