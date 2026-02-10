// export type ContentSection = {
//   sectionTitle?: string; // Optional: Useful if you have multiple sections
//   description: string[];
//   keyPoints?: string[];  // Now Optional (?)
//   codeExample?: {        // Now Optional (?)
//     title: string;
//     code: string;
//   };
// };

// export type Topic = {
//   id: string;
//   title: string;
//   contributors: string[];
//   sections?: ContentSection[]; // Changed from 'content' object to 'sections' array
//   subTopics?: Topic[];
// };

// export const topics: Topic[] = [
//   {
//     id: 'intro',
//     title: 'Introduction',
//     contributors: ['LeaderLab'],
//     sections: [
//       {
//         description: [
//           '- A database is an organized collection of data that is stored electronically and can be easily accessed, managed, and updated.',
//           '- Think of a school register: Student name, Roll number, Class, Marks. Instead of writing it on paper, we store it digitally → that’s a database.',
//           '- Relational/SQL Database (RDBMS): Data is stored in tables (rows & columns). Supports ACID properties. Fixed schema. Used in: Banking systems, college systems. Ex: MySQL, PostgreSQL, Oracle',
//           '- NoSQL Database: Data is not stored in tables. Used for big data & fast applications. Ex: MongoDB (Document-based).',
//           '- Hierarchical Database: Data stored in tree structure (parent–child). One parent, many children. Ex: IBM IMS'
//         ],
//         keyPoints: [
//           'Store large amounts of data',
//           'Update, delete or retrieve data quickly',
//           'Keep data secure',
//           'DDL (Data Definition Language): Commands to define database structure - CREATE, ALTER, DROP, TRUNCATE',
//           'DML (Data Manipulation Language): Commands to manipulate data - SELECT, INSERT, UPDATE, DELETE',
//           'DCL (Data Control Language): Commands to control access - GRANT, REVOKE',
//           'TCL (Transaction Control Language): Commands to manage transactions - COMMIT, ROLLBACK, SAVEPOINT'
//         ],
//         codeExample: {
//           title: 'database',
//           code: `-- Create a database
// CREATE DATABASE LeaderLab;

// -- Use a database
// USE LeaderLab;

// -- Show all databases
// SHOW DATABASES;

// -- Drop a database
// DROP DATABASE LeaderLab;
// `
//         }
//       }
//     ],
//     subTopics: [
//       {
//         id: 'tables',
//         title: 'Tables',
//         contributors: ['LeaderLab'],
//         sections: [
//           {
//             description: [
//               '- A table is a structure in a database where data is stored in rows and columns, similar to an Excel sheet',
//               '- Each table has a unique name and consists of columns (fields) and rows (records).',
//               '- Tables are the fundamental structure in relational databases.',
//             ],
//             keyPoints: [
//               'Primary Key: A primary key uniquely identifies each record in a table. It cannot be NULL and cannot have duplicate values.',
//               'Field (Column): A field is a column in a table. It represents one type of data.',
//               'Record (Row): A record is a single row in a table. It contains all fields related to one entity.',
//               'Foreign Key: Links one table to another',
//               'Schema: A schema defines the structure of the database or table. It includes: Table name, Column names, Data types and Constraints (PK, NOT NULL, etc.)'
//             ],
//             codeExample: {
//               title: 'Table Operations',
//               code: `-- Create a table
// CREATE TABLE students (
//     student_id INT PRIMARY KEY AUTO_INCREMENT,
//     first_name VARCHAR(50) NOT NULL,
//     last_name VARCHAR(50) NOT NULL,
//     email VARCHAR(100) UNIQUE,
//     age INT CHECK (age >= 18),
//     enrollment_date DATE DEFAULT CURRENT_DATE
// );

// -- Show table structure
// DESCRIBE students;

// -- Alter table - add column
// ALTER TABLE students 
// ADD COLUMN phone VARCHAR(15);

// -- Alter table - modify column
// ALTER TABLE students 
// MODIFY COLUMN email VARCHAR(150);

// -- Alter table - drop column
// ALTER TABLE students 
// DROP COLUMN phone;

// -- Rename table
// RENAME TABLE students TO learners;

// -- Drop table
// DROP TABLE students;

// -- Truncate table (remove all data)
// TRUNCATE TABLE students;

// -- Primary key
// id INT PRIMARY KEY

// -- Foreign Key
// CREATE TABLE orders (
//     order_id INT PRIMARY KEY,
//     order_date DATE,
//     student_id INT,
//     FOREIGN KEY (student_id) REFERENCES students(id)
// );
// -- student_id is the foreign key and 
// -- students(id) is the referenced primary key
// `
//             }
//           }
//         ]
//       },
//       {
//         id: 'schemas',
//         title: 'Schemas',
//         contributors: ['LeaderLab'],
//         sections: [
//           {
//             description: [
//               '- A schema is a logical container that organizes database objects like tables, views, indexes, and procedures.',
//               '- It defines how data is structured and who can access it.',
//               '- Logical Schema: Describes what data is stored and how it is logically organized. It defines the logical structure of the database. It focuses on tables, fields, relationships, constraints. It is independent of physical storage. It Includes Table names, Column names & data types, Primary keys, foreign keys and Relationships',
//               '- Physical Schema: It describes how data is physically stored on disk/database. Concerned with performance & storage. It Includes File organization, Indexes, Storage location and Data compression',
//               '- View Schema (External Schema): It defines how users see the data. It provides a customized view of the database for users. It shows only the required data, hides the rest. It Improves security & simplicity'
//             ],
//             keyPoints: [
//               'A schema is a blueprint that defines the structure of database objects.',
//               'Organize large databases',
//               'Avoid name conflicts (two tables can have same name in different schemas)',
//               'Manage permissions & security',
//               'Improve clarity and maintenance'
//             ],
//             codeExample: {
//               title: 'schema',
//               code: `-- Creating a schema
// CREATE SCHEMA college;

// -- Create a table inside a schema
// CREATE TABLE college.students (
//     id INT PRIMARY KEY,
//     name VARCHAR(50),
//     age INT
// );
// -- college → schema
// -- students → table


// -- Logical schema
// Students(id, name, age)
// Courses(course_id, course_name)
// Students.course_id → Courses.course_id


// -- Physical Schema
// Students table stored in file students.db
// Index on Students(id)


// -- View Schema
// CREATE VIEW student_view AS
// SELECT name, age FROM students;
// `
//             }
//           }
//         ]
//       },
//       {
//         id: 'curd',
//         title: 'CRUD Operations',
//         contributors: ['LeaderLab'],
//         sections: [
//           {
//             description: [
//               '- CRUD stands for the four basic operations performed on data in a database: Create, Read, Update, Delete',
//             ],
//             keyPoints: [
//               'Create: Used to add new data into a table.',
//               'Read: Used to retrieve data from a table.',
//               'Update: Used to modify existing data.',
//               'Delete: Used to remove data from a table.',
//             ],
//             codeExample: {
//               title: 'curd',
//               code: `-- Create (INSERT)
// INSERT INTO students (id, name, age)
// VALUES (1, 'Ritesh', 20);


// -- Read (SELECT)
// SELECT * FROM students;


// -- Update (UPDATE)
// UPDATE students
// SET age = 21
// WHERE id = 1;


// -- Delete (DELETE)
// DELETE FROM students WHERE id = 1;
// `
//             }
//           }
//         ]
//       },
//       {
//         id: 'data-types',
//         title: 'Data Types',
//         contributors: ['LeaderLab'],
//         sections: [
//           {
//             description: [
//               '- Data types define the type of data that can be stored in a column.',
//               '- Different database systems may have slightly different data types.'
//             ],
//             keyPoints: [
//               'Numeric: INT, BIGINT, SMALLINT, DECIMAL, FLOAT, DOUBLE',
//               'String: CHAR, VARCHAR, TEXT, BLOB',
//               'Date/Time: DATE, TIME, DATETIME, TIMESTAMP, YEAR',
//               'Boolean: BOOLEAN (stored as TINYINT in MySQL)',
//               'Others: ENUM, SET, JSON (in MySQL 5.7+)'
//             ],
//           },
//           {
//             description: [
//               'Numeric Data Types: ',
//               '- Used to store numbers.',
//               '- Ex: SMALLINT(2 bytes), INT(4 bytes), BIGINT(8 bytes), FLOAT, DOUBLE, DECIMAL(p,s), Serial(Auto increment integer)'
//             ],
//             codeExample: {
//               title: 'numeric',
//               code: `-- SMALLINT
// age SMALLINT

// -- INT
// student_id INT

// -- BIGINT
// phone_number BIGINT

// -- FLOAT
// temperature FLOAT

// -- DOUBLE
// pi_value DOUBLE

// -- DECIMAL(p, s)
// salary DECIMAL(10,2)

// -- SERIAL (Auto Increment Integer)
// id SERIAL PRIMARY KEY
// `
//             }
//           },
//           {
//             description: [
//               'Character Data Types: ',
//               '- to store text data such as letters, numbers (as text), and symbols.',
//             ],
//             codeExample: {
//               title: 'character',
//               code: `CREATE TABLE users (
// name VARCHAR(50),
// country_code CHAR(2),
// bio TEXT

// -- For CHAR(5), if it stores only 3 characters like '123',
// -- the remaining 2 characters are filled with vacant spaces,
// -- so it is stored as 123_ _.

// -- But in the case of VARCHAR(5), it stores only the characters
// -- that are assigned, without adding any extra spaces.
// -- Example: VARCHAR(5) stores 123 exactly.

// -- TEXT is used to stores large text data. 
// -- Used for long descriptions, posts, comments
// );

// `
//             }
//           },
//           {
//             description: [
//               'Boolean Data Types: ',
//               '- Boolean data types are used to store true/false values.',
//             ],
//             codeExample: {
//               title: 'boolean',
//               code: `CREATE TABLE users (
//   id INT,
//   is_active BOOLEAN
// );

// `
//             }
//           },
//           {
//             description: [
//               'Date Data Types: ',
//               '- Date data types are used to store date and time values such as a date, time, or both together.',
//             ],
//             codeExample: {
//               title: 'date',
//               code: `-- DATE: Stores only date. Format: YYYY-MM-DD
// birth_date DATE;     -- 2026-01-15

// -- TIME: Stores only time. Format: HH:MM:SS
// login_time TIME;       -- 14:30:45

// -- DATETIME: Stores date + time. No timezone support
// created_at DATETIME;   -- 2026-01-15 14:30:45

// -- TIMESTAMP: Stores date + time. Timezone-aware (DB dependent)
// updated_at TIMESTAMP;  -- 2026-01-15 10:30:00

// `
//             }
//           },
//         ]
//       },
//       {
//         id: 'constraints',
//         title: 'Constraints',
//         contributors: ['LeaderLab'],
//         sections: [
//           {
//             description: [
//               '- Constraints are rules enforced on data columns to maintain data integrity and accuracy.',
//               '- They prevent invalid data from being entered into the database.',
//               '- Constraints can be defined at column level or table level.'
//             ],
//             keyPoints: [
//               'NOT NULL: Column cannot have NULL values',
//               'UNIQUE: All values in column must be different',
//               'PRIMARY KEY: Uniquely identifies each row (NOT NULL + UNIQUE)',
//               'FOREIGN KEY: Refers to the Primary Key of another table. It is used to create a relationship between tables and maintain data integrity.',
//               'CHECK: It ensures values satisfy a specific condition',
//               'DEFAULT: Sets default value if none provided'
//             ],
//             codeExample: {
//               title: 'constraints',
//               code: `-- Parent Table
// CREATE TABLE departments (
//   dept_id INT PRIMARY KEY,
//   dept_name VARCHAR(50) UNIQUE NOT NULL
// );

// -- Child Table
// CREATE TABLE employees (
//   emp_id INT PRIMARY KEY,                  -- PRIMARY KEY
//   email VARCHAR(100) UNIQUE,               -- UNIQUE
//   name VARCHAR(50) NOT NULL,               -- NOT NULL
//   age INT CHECK (age >= 18),               -- CHECK
//   salary DECIMAL(10,2) DEFAULT 30000,      -- DEFAULT
//   dept_id INT,                             -- FOREIGN KEY
//   is_active BOOLEAN DEFAULT TRUE,          -- BOOLEAN + DEFAULT

//   FOREIGN KEY (dept_id)
//   REFERENCES departments(dept_id)
//   ON DELETE CASCADE
// );

// `
//             }
//           }
//         ]
//       },
// //       {
// //         id: 'select',
// //         title: 'SELECT Statement',
// //         contributors: ['LeaderLab'],
// //         sections: [
// //           {
// //             description: [
// //               '- SELECT is used to retrieve data from one or more tables.',
// //               '- It is the most commonly used SQL command.',
// //               '- SELECT can filter, sort, and aggregate data.'
// //             ],
// //             keyPoints: [
// //               'SELECT *: Retrieves all columns',
// //               'SELECT column1, column2: Retrieves specific columns',
// //               'WHERE: Filters rows based on conditions',
// //               'ORDER BY: Sorts results',
// //               'LIMIT: Restricts number of rows returned',
// //               'DISTINCT: Removes duplicate values'
// //             ],
// //             codeExample: {
// //               title: 'SELECT Examples',
// //               code: `-- Select all columns
// // SELECT * FROM students;

// // -- Select specific columns
// // SELECT first_name, last_name, age FROM students;

// // -- Select with WHERE clause
// // SELECT * FROM students WHERE age > 20;

// // -- Multiple conditions
// // SELECT * FROM students 
// // WHERE age > 20 AND city = 'New York';

// // -- Using OR
// // SELECT * FROM students 
// // WHERE age < 18 OR age > 65;

// // -- Using IN
// // SELECT * FROM students 
// // WHERE city IN ('New York', 'London', 'Paris');

// // -- Using BETWEEN
// // SELECT * FROM students 
// // WHERE age BETWEEN 18 AND 25;

// // -- Using LIKE (pattern matching)
// // SELECT * FROM students 
// // WHERE first_name LIKE 'A%';  -- Starts with A

// // SELECT * FROM students 
// // WHERE email LIKE '%@gmail.com';  -- Ends with @gmail.com

// // -- Using IS NULL
// // SELECT * FROM students WHERE phone IS NULL;

// // -- DISTINCT values
// // SELECT DISTINCT city FROM students;

// // -- ORDER BY (ascending by default)
// // SELECT * FROM students ORDER BY age;

// // -- ORDER BY descending
// // SELECT * FROM students ORDER BY age DESC;

// // -- Multiple columns
// // SELECT * FROM students ORDER BY age DESC, first_name ASC;

// // -- LIMIT results
// // SELECT * FROM students LIMIT 10;

// // -- LIMIT with OFFSET
// // SELECT * FROM students LIMIT 10 OFFSET 20;
// // `
// //             }
// //           }
// //         ]
// //       },
// //       {
// //         id: 'insert',
// //         title: 'INSERT Statement',
// //         contributors: ['LeaderLab'],
// //         sections: [
// //           {
// //             description: [
// //               '- INSERT is used to add new rows to a table.',
// //               '- You can insert single or multiple rows at once.',
// //               '- Column names can be specified or omitted if inserting all columns in order.'
// //             ],
// //             keyPoints: [
// //               'INSERT INTO: Basic syntax for inserting data',
// //               'VALUES: Specifies the values to insert',
// //               'Multiple rows: Insert several rows in one statement',
// //               'Column specification: Can specify which columns to insert into'
// //             ],
// //             codeExample: {
// //               title: 'INSERT Examples',
// //               code: `-- Insert all columns (in order)
// // INSERT INTO students 
// // VALUES (1, 'John', 'Doe', 'john@email.com', 22);

// // -- Insert specific columns
// // INSERT INTO students (first_name, last_name, email) 
// // VALUES ('Jane', 'Smith', 'jane@email.com');

// // -- Insert multiple rows
// // INSERT INTO students (first_name, last_name, email, age) 
// // VALUES 
// //     ('Alice', 'Johnson', 'alice@email.com', 20),
// //     ('Bob', 'Williams', 'bob@email.com', 21),
// //     ('Charlie', 'Brown', 'charlie@email.com', 23);

// // -- Insert from another table
// // INSERT INTO students_backup 
// // SELECT * FROM students WHERE age > 20;

// // -- Insert with subquery
// // INSERT INTO honor_students (student_id, name)
// // SELECT student_id, CONCAT(first_name, ' ', last_name)
// // FROM students 
// // WHERE gpa > 3.5;
// // `
// //             }
// //           }
// //         ]
// //       },
// //       {
// //         id: 'update',
// //         title: 'UPDATE Statement',
// //         contributors: ['LeaderLab'],
// //         sections: [
// //           {
// //             description: [
// //               '- UPDATE is used to modify existing records in a table.',
// //               '- Always use WHERE clause to specify which rows to update.',
// //               '- Without WHERE, all rows will be updated!'
// //             ],
// //             keyPoints: [
// //               'SET: Specifies which columns to update and their new values',
// //               'WHERE: Filters which rows to update (IMPORTANT!)',
// //               'Multiple columns: Can update several columns at once',
// //               'Subquery: Can use subquery to set values'
// //             ],
// //             codeExample: {
// //               title: 'UPDATE Examples',
// //               code: `-- Update single column
// // UPDATE students 
// // SET age = 23 
// // WHERE student_id = 1;

// // -- Update multiple columns
// // UPDATE students 
// // SET age = 24, email = 'newemail@email.com' 
// // WHERE student_id = 1;

// // -- Update multiple rows
// // UPDATE students 
// // SET status = 'Graduate' 
// // WHERE graduation_year = 2024;

// // -- Update with calculation
// // UPDATE products 
// // SET price = price * 1.1 
// // WHERE category = 'Electronics';

// // -- Update using subquery
// // UPDATE students 
// // SET scholarship = 'Yes'
// // WHERE gpa > (SELECT AVG(gpa) FROM students);

// // -- ⚠️ WARNING: Update without WHERE updates ALL rows
// // UPDATE students SET age = 20;  -- All students now age 20!
// // `
// //             }
// //           }
// //         ]
// //       },
// //       {
// //         id: 'delete',
// //         title: 'DELETE Statement',
// //         contributors: ['LeaderLab'],
// //         sections: [
// //           {
// //             description: [
// //               '- DELETE is used to remove rows from a table.',
// //               '- Always use WHERE clause to specify which rows to delete.',
// //               '- Without WHERE, all rows will be deleted!'
// //             ],
// //             keyPoints: [
// //               'DELETE FROM: Basic syntax for deleting rows',
// //               'WHERE: Specifies which rows to delete (IMPORTANT!)',
// //               'TRUNCATE: Faster way to delete all rows',
// //               'Cannot undo: DELETE is permanent unless in a transaction'
// //             ],
// //             codeExample: {
// //               title: 'DELETE Examples',
// //               code: `-- Delete specific row
// // DELETE FROM students 
// // WHERE student_id = 1;

// // -- Delete multiple rows
// // DELETE FROM students 
// // WHERE age < 18;

// // -- Delete with multiple conditions
// // DELETE FROM students 
// // WHERE status = 'Inactive' AND last_login < '2023-01-01';

// // -- Delete using subquery
// // DELETE FROM students
// // WHERE student_id IN (
// //     SELECT student_id 
// //     FROM enrollments 
// //     WHERE course_count = 0
// // );

// // -- ⚠️ WARNING: Delete without WHERE deletes ALL rows
// // DELETE FROM students;  -- All students deleted!

// // -- TRUNCATE - faster way to delete all rows
// // TRUNCATE TABLE students;  -- Resets auto_increment

// // -- Safe delete with transaction
// // BEGIN TRANSACTION;
// // DELETE FROM students WHERE student_id = 5;
// // -- Check if correct, then
// // COMMIT;
// // -- Or undo with
// // ROLLBACK;
// // `
// //             }
// //           }
// //         ]
// //       }
//     ]
//   },
//    {
//     id: 'miniproject',
//     title: 'Mini Project 1',
//     contributors: ['LeaderLab'],
//     sections: [
//       {
//         description: [
//           ''
//         ],
//       }
//     ],
//     subTopics: [
//       {
//         id: 'miniproject1',
//         title: 'Mini Project 1',
//         contributors: ['LeaderLab'],
//         sections: [
//           {
//             description: [
//               '- Design a database table for Flipkart to store product details.',
//               '- The table should store information such as product ID, name, SKU code, price, stock quantity, availability status, category, date added, and last updated timestamp.',
//               '- Apply appropriate SQL constraints like PRIMARY KEY, UNIQUE, NOT NULL, CHECK, DEFAULT, and BOOLEAN.',
//               '- Also insert sample product records into the table.'
//             ],

//             codeExample: {
//               title: 'flipkart',
//               code: `-- Create a table
// CREATE TABLE products (
//   product_id SERIAL PRIMARY KEY,
//   name VARCHAR(100) NOT NULL,
//   sku_code CHAR(8) UNIQUE NOT NULL CHECK (LENGTH(sku_code) = 8)
//   -- check will ensure that the sku_code should be of 8 characters.
//   price NUMERIC(10,2) DEFAULT 0 CHECK (price >= 0),
//   stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
//   is_available BOOLEAN DEFAULT TRUE,
//   category TEXT NOT NULL,
//   added_on DATE DEFAULT CURRENT_DATE,
//   last_update TIMESTAMP DEFAULT NOW()
// );

// -- INSERT INTO
// INSERT INTO products 
// (name, sku_code, price, stock_quantity, is_available, category)
// VALUES
// ('Wireless Mouse', 'WM123456', 699.99, 50, TRUE, 'Electronics'),
// ('Bluetooth Speaker', 'BS234567', 1499.00, 30, TRUE, 'Electronics'),
// ('Laptop Stand', 'LS345678', 799.50, 20, TRUE, 'Accessories'),
// ('USB-C Hub', 'UC456789', 1299.99, 15, TRUE, 'Accessories'),
// ('Notebook', 'NB567890', 99.99, 100, TRUE, 'Stationery'),
// ('Pen Set', 'PS678901', 199.00, 200, TRUE, 'Stationery'),
// ('Coffee Mug', 'CM789012', 299.00, 75, TRUE, 'Home & Kitchen'),
// ('LED Desk Lamp', 'DL890123', 899.00, 40, TRUE, 'Home & Kitchen'),
// ('Yoga Mat', 'YM901234', 499.00, 25, TRUE, 'Fitness'),
// ('Water Bottle', 'WB012345', 349.00, 60, TRUE, 'Fitness');

// -- To display all info
// SELECT * 
// FROM products;

// +------------+--------------------+----------+--------+---------------+--------------+--------------+------------+---------------------+
// | product_id | name               | sku_code | price  | stock_quantity| is_available | category     | added_on   | last_update         |
// +------------+--------------------+----------+--------+---------------+--------------+--------------+------------+---------------------+
// | 1          | Wireless Mouse     | WM123456 | 699.99 | 50            | TRUE         | Electronics  | 2026-01-15 | 2026-01-15 10:30:00 |
// | 2          | Bluetooth Speaker  | BS234567 |1499.00 | 30            | TRUE         | Electronics  | 2026-01-15 | 2026-01-15 10:30:00 |
// | 3          | Laptop Stand       | LS345678 | 799.50 | 20            | TRUE         | Accessories  | 2026-01-15 | 2026-01-15 10:30:00 |
// | 4          | USB-C Hub          | UC456789 |1299.99 | 15            | TRUE         | Accessories  | 2026-01-15 | 2026-01-15 10:30:00 |
// | 5          | Notebook           | NB567890 |  99.99 |100            | TRUE         | Stationery   | 2026-01-15 | 2026-01-15 10:30:00 |
// | 6          | Pen Set            | PS678901 | 199.00 |200            | TRUE         | Stationery   | 2026-01-15 | 2026-01-15 10:30:00 |
// | 7          | Coffee Mug         | CM789012 | 299.00 | 75            | TRUE         | Home & Kitchen|2026-01-15 | 2026-01-15 10:30:00 |
// | 8          | LED Desk Lamp      | DL890123 | 899.00 | 40            | TRUE         | Home & Kitchen|2026-01-15 | 2026-01-15 10:30:00 |
// | 9          | Yoga Mat           | YM901234 | 499.00 | 25            | TRUE         | Fitness      | 2026-01-15 | 2026-01-15 10:30:00 |
// | 10         | Water Bottle       | WB012345 | 349.00 | 60            | TRUE         | Fitness      | 2026-01-15 | 2026-01-15 10:30:00 |
// +------------+--------------------+----------+--------+---------------+--------------+--------------+------------+---------------------+

// -- product_id will be automatically assigned because we have used the SERIAL constraint.
// -- If we manually provide a product_id (for example, 1) and then insert another product
// -- without providing a product_id, it will not automatically continue with 2.
// -- This can cause an error because the SERIAL sequence may become out of sync.
// -- By default, SERIAL starts from 1 and increments automatically.
// -- so don't provide any manual value for product_id. 
// `
//             }
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: 'clause',
//     title: 'Clause',
//     contributors: ['LeaderLab'],
//     sections: [
//       {
//         description: [
//           ''
//         ],
//         keyPoints: [
//           ''
//         ],
//         codeExample: {
//           title: 'database',
//           code: `
// `
//         }
//       }
//     ],
//     subTopics: [
//       {
//         id: '',
//         title: '',
//         contributors: ['LeaderLab'],
//         sections: [
//           {
//             description: [
             
//             ],
//             keyPoints: [
//               ''
//             ],
//             codeExample: {
//               title: '',
//               code: `

// `
//             }
//           }
//         ]
//       },

//     ]
//   },
//    {
//     id: '',
//     title: '',
//     contributors: ['LeaderLab'],
//     sections: [
//       {
//         description: [
//           ''
//         ],
//         keyPoints: [
//           ''
//         ],
//         codeExample: {
//           title: 'database',
//           code: `
// `
//         }
//       }
//     ],
//     subTopics: [
//       {
//         id: '',
//         title: '',
//         contributors: ['LeaderLab'],
//         sections: [
//           {
//             description: [
             
//             ],
//             keyPoints: [
//               ''
//             ],
//             codeExample: {
//               title: '',
//               code: `

// `
//             }
//           }
//         ]
//       },

//     ]
//   },
// ];





export type ContentSection = {
  sectionTitle?: string;
  description: string[];
  keyPoints?: string[];
  codeExample?: {
    title: string;
    code: string;
  };
};

// --- PRACTICE TYPES ---

// Type 1: Simple Question(s) -> Answer
export type SimplePractice = {
  id: string;
  type: 'simple'; 
  questions: string[];
  answer: {
    title: string;
    code: string;
  };
};

// Type 2: Scenario Based (Mac Window Context -> Questions -> Answer)
export type ScenarioPractice = {
  id: string;
  type: 'scenario';
  title: string;          
  context: {              
    title: string;        
    code: string;
  };
  questions: string[];    
  answer: {               
    title: string;
    code: string;
  };
};

export type PracticeItem = SimplePractice | ScenarioPractice;

export type PracticeSection = {
  title?: string;
  items: PracticeItem[];
};

export type Topic = {
  id: string;
  title: string;
  contributors: string[];
  sections?: ContentSection[];
  practice?: PracticeSection[]; 
  subTopics?: Topic[];
};

export const topics: Topic[] = [
  {
    id: 'intro',
    title: 'Introduction',
    contributors: ['LeaderLab'],
    sections: [
      {
        description: [
          '- A database is an organized collection of data that is stored electronically and can be easily accessed, managed, and updated.',
          '- Think of a school register: Student name, Roll number, Class, Marks. Instead of writing it on paper, we store it digitally → that’s a database.',
          '- Relational/SQL Database (RDBMS): Data is stored in tables (rows & columns). Supports ACID properties. Fixed schema. Used in: Banking systems, college systems. Ex: MySQL, PostgreSQL, Oracle',
          '- NoSQL Database: Data is not stored in tables. Used for big data & fast applications. Ex: MongoDB (Document-based).',
          '- Hierarchical Database: Data stored in tree structure (parent–child). One parent, many children. Ex: IBM IMS'
        ],
        keyPoints: [
          'Store large amounts of data',
          'Update, delete or retrieve data quickly',
          'Keep data secure',
          'DDL (Data Definition Language): Commands to define database structure - CREATE, ALTER, DROP, TRUNCATE',
          'DML (Data Manipulation Language): Commands to manipulate data - SELECT, INSERT, UPDATE, DELETE',
          'DCL (Data Control Language): Commands to control access - GRANT, REVOKE',
          'TCL (Transaction Control Language): Commands to manage transactions - COMMIT, ROLLBACK, SAVEPOINT'
        ],
        codeExample: {
          title: 'database',
          code: `-- Create a database
CREATE DATABASE LeaderLab;

-- Use a database
USE LeaderLab;

-- Show all databases
SHOW DATABASES;

-- Drop a database
DROP DATABASE LeaderLab;
`
        }
      }
    ],
    practice: [
      {
        title: "Database Fundamentals",
        items: [
          {
            id: 'p-intro-1',
            type: 'simple',
            questions: [
              "Write a query to create a database named 'SchoolDB'.",
              "How would you initialize a new database environment?"
            ],
            answer: {
              title: "Create DB",
              code: "CREATE DATABASE SchoolDB;"
            }
          },
          {
            id: 'p-intro-scenario',
            type: 'scenario',
            title: "Employee Data Analysis",
            context: {
              title: "schema.sql",
              code: `CREATE TABLE Employee (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  salary DECIMAL(10, 2)
);

-- Sample Data
INSERT INTO Employee VALUES
  (1, 'John Doe', 85000),
  (2, 'Jane Smith', 90000),
  (3, 'Bob Johnson', 75000);`
            },
            questions: [
              "1. Write a query to retrieve the name of the employee with the highest salary.",
              "2. Calculate the average salary of all employees.",
              "3. List all employees who earn more than 80,000.",
              "4. Count the total number of employees.",
              "5. Write a query to delete the record of 'Bob Johnson'."
            ],
            answer: {
              title: "solutions.sql",
              code: `-- 1. Highest Salary
SELECT name FROM Employee ORDER BY salary DESC LIMIT 1;

-- 2. Average Salary
SELECT AVG(salary) FROM Employee;

-- 3. High Earners
SELECT * FROM Employee WHERE salary > 80000;

-- 4. Count Employees
SELECT COUNT(*) FROM Employee;

-- 5. Delete Bob
DELETE FROM Employee WHERE name = 'Bob Johnson';`
            }
          }
        ]
      }
    ],
    subTopics: [
      {
        id: 'tables',
        title: 'Tables',
        contributors: ['LeaderLab'],
        sections: [
          {
            description: [
              '- A table is a structure in a database where data is stored in rows and columns, similar to an Excel sheet',
              '- Each table has a unique name and consists of columns (fields) and rows (records).',
              '- Tables are the fundamental structure in relational databases.',
            ],
            keyPoints: [
              'Primary Key: A primary key uniquely identifies each record in a table. It cannot be NULL and cannot have duplicate values.',
              'Field (Column): A field is a column in a table. It represents one type of data.',
              'Record (Row): A record is a single row in a table. It contains all fields related to one entity.',
              'Foreign Key: Links one table to another',
              'Schema: A schema defines the structure of the database or table. It includes: Table name, Column names, Data types and Constraints (PK, NOT NULL, etc.)'
            ],
            codeExample: {
              title: 'Table Operations',
              code: `-- Create a table
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT CHECK (age >= 18),
    enrollment_date DATE DEFAULT CURRENT_DATE
);

-- Show table structure
DESCRIBE students;

-- Alter table - add column
ALTER TABLE students 
ADD COLUMN phone VARCHAR(15);

-- Alter table - modify column
ALTER TABLE students 
MODIFY COLUMN email VARCHAR(150);

-- Alter table - drop column
ALTER TABLE students 
DROP COLUMN phone;

-- Rename table
RENAME TABLE students TO learners;

-- Drop table
DROP TABLE students;

-- Truncate table (remove all data)
TRUNCATE TABLE students;

-- Primary key
id INT PRIMARY KEY

-- Foreign Key
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    order_date DATE,
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);
-- student_id is the foreign key and 
-- students(id) is the referenced primary key
`
            }
          }
        ],
        practice: [
          {
            title: "Table Operations",
            items: [
              {
                id: 'p-table-1',
                type: 'simple',
                questions: [
                  "Write a query to create a table named 'Courses' with columns: course_id (INT, PK), course_name (VARCHAR), and credits (INT)."
                ],
                answer: {
                  title: "Create Table",
                  code: `CREATE TABLE Courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100),
    credits INT
);`
                }
              },
              {
                id: 'p-table-2',
                type: 'simple',
                questions: [
                  "Write a query to add a column 'department' (VARCHAR) to the 'Courses' table."
                ],
                answer: {
                  title: "Alter Table",
                  code: "ALTER TABLE Courses ADD COLUMN department VARCHAR(50);"
                }
              }
            ]
          }
        ]
      },
      {
        id: 'schemas',
        title: 'Schemas',
        contributors: ['LeaderLab'],
        sections: [
          {
            description: [
              '- A schema is a logical container that organizes database objects like tables, views, indexes, and procedures.',
              '- It defines how data is structured and who can access it.',
              '- Logical Schema: Describes what data is stored and how it is logically organized. It defines the logical structure of the database. It focuses on tables, fields, relationships, constraints. It is independent of physical storage. It Includes Table names, Column names & data types, Primary keys, foreign keys and Relationships',
              '- Physical Schema: It describes how data is physically stored on disk/database. Concerned with performance & storage. It Includes File organization, Indexes, Storage location and Data compression',
              '- View Schema (External Schema): It defines how users see the data. It provides a customized view of the database for users. It shows only the required data, hides the rest. It Improves security & simplicity'
            ],
            keyPoints: [
              'A schema is a blueprint that defines the structure of database objects.',
              'Organize large databases',
              'Avoid name conflicts (two tables can have same name in different schemas)',
              'Manage permissions & security',
              'Improve clarity and maintenance'
            ],
            codeExample: {
              title: 'schema',
              code: `-- Creating a schema
CREATE SCHEMA college;

-- Create a table inside a schema
CREATE TABLE college.students (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT
);
-- college → schema
-- students → table


-- Logical schema
Students(id, name, age)
Courses(course_id, course_name)
Students.course_id → Courses.course_id


-- Physical Schema
Students table stored in file students.db
Index on Students(id)


-- View Schema
CREATE VIEW student_view AS
SELECT name, age FROM students;
`
            }
          }
        ],
        practice: [
          {
            title: "Schema Management",
            items: [
              {
                id: 'p-schema-1',
                type: 'simple',
                questions: [
                  "Write a query to create a schema named 'HR'.",
                  "How do you define a logical namespace for HR related tables?"
                ],
                answer: {
                  title: "Create Schema",
                  code: `CREATE SCHEMA HR;
// If you want to be safe (avoid errors if it already exists)
                  CREATE SCHEMA IF NOT EXISTS HR;

                  `
                }
              },
              {
                id: 'p-schema-2',
                type: 'simple',
                questions: [
                  "Write a query to create a table 'Employees' inside the 'HR' schema.",
                  "Create a table that explicitly belongs to the HR schema."
                ],
                answer: {
                  title: "Table in Schema",
                  code: `CREATE TABLE HR.Employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(50)
);`
                }
              }
            ]
          }
        ]
      },
      {
        id: 'curd',
        title: 'CRUD Operations',
        contributors: ['LeaderLab'],
        sections: [
          {
            description: [
              '- CRUD stands for the four basic operations performed on data in a database: Create, Read, Update, Delete',
            ],
            keyPoints: [
              'Create: Used to add new data into a table.',
              'Read: Used to retrieve data from a table.',
              'Update: Used to modify existing data.',
              'Delete: Used to remove data from a table.',
            ],
            codeExample: {
              title: 'curd',
              code: `-- Create (INSERT)
INSERT INTO students (id, name, age)
VALUES (1, 'Ritesh', 20);


-- Read (SELECT)
SELECT * FROM students;


-- Update (UPDATE)
UPDATE students
SET age = 21
WHERE id = 1;


-- Delete (DELETE)
DELETE FROM students WHERE id = 1;
`
            }
          }
        ],
        practice: [
          {
            title: "Data Manipulation",
            items: [
              {
                id: 'p-crud-1',
                type: 'simple',
                questions: [
                  "Write a query to insert a student named 'Alice' (age 22) into the 'students' table.",
                  "Add a new record: ID 101, Name 'Alice', Age 22."
                ],
                answer: {
                  title: "Insert Data",
                  code: "INSERT INTO students (id, name, age) VALUES (101, 'Alice', 22);"
                }
              },
              {
                id: 'p-crud-2',
                type: 'simple',
                questions: [
                  "Write a query to update the age of student with ID 101 to 23.",
                  "Alice had a birthday. Update her age in the database."
                ],
                answer: {
                  title: "Update Data",
                  code: "UPDATE students SET age = 23 WHERE id = 101;"
                }
              },
              {
                id: 'p-crud-3',
                type: 'simple',
                questions: [
                  "Write a query to delete all students younger than 18.",
                  "Remove under-aged students from the table."
                ],
                answer: {
                  title: "Delete Data",
                  code: "DELETE FROM students WHERE age < 18;"
                }
              }
            ]
          }
        ]
      },
      {
        id: 'data-types',
        title: 'Data Types',
        contributors: ['LeaderLab'],
        sections: [
          {
            description: [
              '- Data types define the type of data that can be stored in a column.',
              '- Different database systems may have slightly different data types.'
            ],
            keyPoints: [
              'Numeric: INT, BIGINT, SMALLINT, DECIMAL, FLOAT, DOUBLE',
              'String: CHAR, VARCHAR, TEXT, BLOB',
              'Date/Time: DATE, TIME, DATETIME, TIMESTAMP, YEAR',
              'Boolean: BOOLEAN (stored as TINYINT in MySQL)',
              'Others: ENUM, SET, JSON (in MySQL 5.7+)'
            ],
          },
          {
            description: [
              'Numeric Data Types: ',
              '- Used to store numbers.',
              '- Ex: SMALLINT(2 bytes), INT(4 bytes), BIGINT(8 bytes), FLOAT, DOUBLE, DECIMAL(p,s), Serial(Auto increment integer)'
            ],
            codeExample: {
              title: 'numeric',
              code: `-- SMALLINT
age SMALLINT

-- INT
student_id INT

-- BIGINT
phone_number BIGINT

-- FLOAT
temperature FLOAT

-- DOUBLE
pi_value DOUBLE

-- DECIMAL(p, s)
salary DECIMAL(10,2)

-- SERIAL (Auto Increment Integer)
id SERIAL PRIMARY KEY
`
            }
          },
          {
            description: [
              'Character Data Types: ',
              '- to store text data such as letters, numbers (as text), and symbols.',
            ],
            codeExample: {
              title: 'character',
              code: `CREATE TABLE users (
name VARCHAR(50),
country_code CHAR(2),
bio TEXT

-- For CHAR(5), if it stores only 3 characters like '123',
-- the remaining 2 characters are filled with vacant spaces,
-- so it is stored as 123_ _.

-- But in the case of VARCHAR(5), it stores only the characters
-- that are assigned, without adding any extra spaces.
-- Example: VARCHAR(5) stores 123 exactly.

-- TEXT is used to stores large text data. 
-- Used for long descriptions, posts, comments
);

`
            }
          },
          {
            description: [
              'Boolean Data Types: ',
              '- Boolean data types are used to store true/false values.',
            ],
            codeExample: {
              title: 'boolean',
              code: `CREATE TABLE users (
  id INT,
  is_active BOOLEAN
);

`
            }
          },
          {
            description: [
              'Date Data Types: ',
              '- Date data types are used to store date and time values such as a date, time, or both together.',
            ],
            codeExample: {
              title: 'date',
              code: `-- DATE: Stores only date. Format: YYYY-MM-DD
birth_date DATE;     -- 2026-01-15

-- TIME: Stores only time. Format: HH:MM:SS
login_time TIME;       -- 14:30:45

-- DATETIME: Stores date + time. No timezone support
created_at DATETIME;   -- 2026-01-15 14:30:45

-- TIMESTAMP: Stores date + time. Timezone-aware (DB dependent)
updated_at TIMESTAMP;  -- 2026-01-15 10:30:00

`
            }
          },
        ],
        practice: [
          {
            title: "Choosing Data Types",
            items: [
              {
                id: 'p-dtypes-1',
                type: 'simple',
                questions: [
                  "Create a table 'Products' with a 'price' column suitable for currency (exact precision required).",
                  "Which data type is best for storing financial values?"
                ],
                answer: {
                  title: "Decimal Type",
                  code: `CREATE TABLE Products (
    id INT,
    price DECIMAL(10, 2)
);`
                }
              },
              {
                id: 'p-dtypes-2',
                type: 'simple',
                questions: [
                  "Create a table 'Events' that stores both the date and exact time.",
                  "Which data type handles YYYY-MM-DD HH:MM:SS format?"
                ],
                answer: {
                  title: "DateTime",
                  code: `CREATE TABLE Events (
    event_name VARCHAR(50),
    occurred_at DATETIME
);`
                }
              }
            ]
          }
        ]
      },
      {
        id: 'constraints',
        title: 'Constraints',
        contributors: ['LeaderLab'],
        sections: [
          {
            description: [
              '- Constraints are rules enforced on data columns to maintain data integrity and accuracy.',
              '- They prevent invalid data from being entered into the database.',
              '- Constraints can be defined at column level or table level.'
            ],
            keyPoints: [
              'NOT NULL: Column cannot have NULL values',
              'UNIQUE: All values in column must be different',
              'PRIMARY KEY: Uniquely identifies each row (NOT NULL + UNIQUE)',
              'FOREIGN KEY: Refers to the Primary Key of another table. It is used to create a relationship between tables and maintain data integrity.',
              'CHECK: It ensures values satisfy a specific condition',
              'DEFAULT: Sets default value if none provided'
            ],
            codeExample: {
              title: 'constraints',
              code: `-- Parent Table
CREATE TABLE departments (
  dept_id INT PRIMARY KEY,
  dept_name VARCHAR(50) UNIQUE NOT NULL
);

-- Child Table
CREATE TABLE employees (
  emp_id INT PRIMARY KEY,                  -- PRIMARY KEY
  email VARCHAR(100) UNIQUE,               -- UNIQUE
  name VARCHAR(50) NOT NULL,               -- NOT NULL
  age INT CHECK (age >= 18),               -- CHECK
  salary DECIMAL(10,2) DEFAULT 30000,      -- DEFAULT
  dept_id INT,                             -- FOREIGN KEY
  is_active BOOLEAN DEFAULT TRUE,          -- BOOLEAN + DEFAULT

  FOREIGN KEY (dept_id)
  REFERENCES departments(dept_id)
  ON DELETE CASCADE
);

`
            }
          }
        ],
        practice: [
          {
            title: "Data Integrity",
            items: [
              {
                id: 'p-const-1',
                type: 'simple',
                questions: [
                  "Create a 'Users' table where 'email' must be unique and cannot be NULL.",
                  "How to ensure no duplicate emails in the Users table?"
                ],
                answer: {
                  title: "Unique & Not Null",
                  code: `CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL
);`
                }
              },
              {
                id: 'p-const-2',
                type: 'simple',
                questions: [
                  "Create a table 'Voters' where age must be 18 or older.",
                  "Write a constraint to restrict age values to 18+."
                ],
                answer: {
                  title: "Check Constraint",
                  code: `CREATE TABLE Voters (
    voter_id INT PRIMARY KEY,
    age INT CHECK (age >= 18)
);`
                }
              }
            ]
          }
        ]
      },
    ]
  },
  {
    id: 'miniproject',
    title: 'Mini Project 1',
    contributors: ['LeaderLab'],
    sections: [
      {
        description: [
          ''
        ],
      }
    ],
    subTopics: [
      {
        id: 'miniproject1',
        title: 'Flipkart Database',
        contributors: ['LeaderLab'],
        sections: [
          {
            description: [
              '- Design a database table for Flipkart to store product details.',
              '- The table should store information such as product ID, name, SKU code, price, stock quantity, availability status, category, date added, and last updated timestamp.',
              '- Apply appropriate SQL constraints like PRIMARY KEY, UNIQUE, NOT NULL, CHECK, DEFAULT, and BOOLEAN.',
              '- Also insert sample product records into the table.'
            ],
            codeExample: {
              title: 'flipkart',
              code: `-- Create a table
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sku_code CHAR(8) UNIQUE NOT NULL CHECK (LENGTH(sku_code) = 8)
  -- check will ensure that the sku_code should be of 8 characters.
  price NUMERIC(10,2) DEFAULT 0 CHECK (price >= 0),
  stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
  is_available BOOLEAN DEFAULT TRUE,
  category TEXT NOT NULL,
  added_on DATE DEFAULT CURRENT_DATE,
  last_update TIMESTAMP DEFAULT NOW()
);

-- INSERT INTO
INSERT INTO products 
(name, sku_code, price, stock_quantity, is_available, category)
VALUES
('Wireless Mouse', 'WM123456', 699.99, 50, TRUE, 'Electronics'),
('Bluetooth Speaker', 'BS234567', 1499.00, 30, TRUE, 'Electronics'),
('Laptop Stand', 'LS345678', 799.50, 20, TRUE, 'Accessories'),
('USB-C Hub', 'UC456789', 1299.99, 15, TRUE, 'Accessories'),
('Notebook', 'NB567890', 99.99, 100, TRUE, 'Stationery'),
('Pen Set', 'PS678901', 199.00, 200, TRUE, 'Stationery'),
('Coffee Mug', 'CM789012', 299.00, 75, TRUE, 'Home & Kitchen'),
('LED Desk Lamp', 'DL890123', 899.00, 40, TRUE, 'Home & Kitchen'),
('Yoga Mat', 'YM901234', 499.00, 25, TRUE, 'Fitness'),
('Water Bottle', 'WB012345', 349.00, 60, TRUE, 'Fitness');

-- To display all info
SELECT * 
FROM products;

-- NOTE: product_id is SERIAL (auto-increment), so we don't insert it manually.
`
            }
          }
        ]
      }
    ]
  },
  {
    id: 'final-practice',
    title: 'Final Practice Arena',
    contributors: ['LeaderLab'],
    sections: [
      {
        description: [
          'Welcome to the Final Practice Arena. Here you can test your knowledge on all the topics covered so far.',
          'Try to solve these mixed questions without looking at the notes!'
        ],
      }
    ],
    practice: [
      {
        title: "Comprehensive Review",
        items: [
          {
            id: 'p-final-1',
            type: 'scenario',
            title: "Student Database Scenario",
            context: {
              title: "schema.sql",
              code: `CREATE TABLE Students (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  marks INT
);

INSERT INTO Students VALUES
(1, 'Amit', 85),
(2, 'Neha', 92),
(3, 'Rahul', 78),
(4, 'Priya', 88);`
            },
            questions: [
              "1. Select the names of students who scored more than 80 marks.",
              "2. Find the student with the maximum marks.",
              "3. Count how many students have marks between 80 and 90.",
              "4. Update Rahul's marks to 82."
            ],
            answer: {
              title: "Solutions",
              code: `-- 1. > 80
SELECT name FROM Students WHERE marks > 80;

-- 2. Max Marks
SELECT * FROM Students ORDER BY marks DESC LIMIT 1;

-- 3. Range 80-90
SELECT COUNT(*) FROM Students WHERE marks BETWEEN 80 AND 90;

-- 4. Update
UPDATE Students SET marks = 82 WHERE name = 'Rahul';`
            }
          }
        ]
      }
    ]
  }
];