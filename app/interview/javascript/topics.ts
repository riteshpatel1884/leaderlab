
// Topic Data Structure
export interface CodeExample {
  title: string;
  code: string;
}

export interface Question {
  id: string;
  question: string;
  answer: CodeExample;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  questions: Question[];
  subTopics?: Topic[];
}

export const topics: Topic[] = [
  {
    id: 'basics',
    title: 'JavaScript Basics',
    icon: '📚',
    questions: [
      {
        id: 'basics-1',
        question: 'What are the different data types in JavaScript?',
        difficulty: 'easy',
        answer: {
          title: 'JavaScript Data Types',
          code: `// Primitive Types
let str = "Hello";           // String
let num = 42;                // Number
let bool = true;             // Boolean
let nothing = null;          // Null
let notDefined = undefined;  // Undefined
let sym = Symbol('id');      // Symbol
let big = 9007199254740991n; // BigInt

// Reference Type
let obj = { name: "John" };  // Object
let arr = [1, 2, 3];         // Array
let func = function() {};    // Function

// Type checking
console.log(typeof str);     // "string"
console.log(typeof num);     // "number"
console.log(typeof bool);    // "boolean"
console.log(typeof obj);     // "object"
console.log(Array.isArray(arr)); // true`
        }
      },
      {
        id: 'basics-2',
        question: 'Explain the difference between let, const, and var',
        difficulty: 'easy',
        answer: {
          title: 'Variable Declarations',
          code: `// var - function scoped, hoisted, can be redeclared
function varExample() {
  var x = 1;
  if (true) {
    var x = 2;  // Same variable!
    console.log(x);  // 2
  }
  console.log(x);    // 2
}

// let - block scoped, not hoisted, cannot be redeclared
function letExample() {
  let y = 1;
  if (true) {
    let y = 2;  // Different variable
    console.log(y);  // 2
  }
  console.log(y);    // 1
}

// const - block scoped, must be initialized, cannot be reassigned
const PI = 3.14159;
// PI = 3.14;  // Error!

// But object properties can be modified
const user = { name: "John" };
user.name = "Jane";  // This is fine
user.age = 30;       // This is fine`
        }
      }
    ],
    subTopics: []
  },
  {
    id: 'functions',
    title: 'Functions & Scope',
    icon: '⚡',
    questions: [
      {
        id: 'functions-1',
        question: 'What is a closure in JavaScript?',
        difficulty: 'medium',
        answer: {
          title: 'Closures Explained',
          code: `// A closure is a function that has access to variables
// in its outer (enclosing) lexical scope, even after
// the outer function has returned

function createCounter() {
  let count = 0;  // Private variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1

// Practical example: Event handlers
function setupClickHandler(buttonId) {
  const button = document.getElementById(buttonId);
  let clickCount = 0;
  
  button.addEventListener('click', function() {
    clickCount++;
    console.log(\`Clicked \${clickCount} times\`);
  });
}`
        }
      },
      {
        id: 'functions-2',
        question: 'Explain the difference between function declaration and function expression',
        difficulty: 'easy',
        answer: {
          title: 'Function Types',
          code: `// Function Declaration - Hoisted
// Can be called before definition
greet("John");  // Works!

function greet(name) {
  return \`Hello, \${name}!\`;
}

// Function Expression - Not Hoisted
// Cannot be called before definition
// sayHi("John");  // Error!

const sayHi = function(name) {
  return \`Hi, \${name}!\`;
};

sayHi("John");  // Works!

// Arrow Function Expression
const welcome = (name) => \`Welcome, \${name}!\`;

// Named Function Expression
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(factorial(5));  // 120`
        }
      },
      {
        id: 'functions-3',
        question: 'What is the "this" keyword and how does it work?',
        difficulty: 'hard',
        answer: {
          title: 'Understanding "this"',
          code: `// "this" refers to the object that is executing 
// the current function

// 1. Method Call - this = object
const person = {
  name: "John",
  greet: function() {
    console.log(\`Hello, I'm \${this.name}\`);
  }
};
person.greet();  // "Hello, I'm John"

// 2. Regular Function - this = global object (or undefined in strict mode)
function showThis() {
  console.log(this);
}
showThis();  // Window or undefined

// 3. Arrow Functions - this = lexical this (from outer scope)
const obj = {
  name: "Alice",
  regularFunc: function() {
    console.log(this.name);  // "Alice"
    
    const arrowFunc = () => {
      console.log(this.name);  // "Alice" (inherits from regularFunc)
    };
    arrowFunc();
  }
};

// 4. Constructor Function - this = new object
function User(name) {
  this.name = name;
  this.greet = function() {
    console.log(\`Hi, I'm \${this.name}\`);
  };
}
const user = new User("Bob");
user.greet();  // "Hi, I'm Bob"

// 5. Explicit Binding - call, apply, bind
function introduce(greeting) {
  console.log(\`\${greeting}, I'm \${this.name}\`);
}
const mike = { name: "Mike" };
introduce.call(mike, "Hello");     // "Hello, I'm Mike"
introduce.apply(mike, ["Hey"]);    // "Hey, I'm Mike"
const boundFunc = introduce.bind(mike);
boundFunc("Hi");                   // "Hi, I'm Mike"`
        }
      }
    ],
    subTopics: []
  },
  {
    id: 'async',
    title: 'Asynchronous JavaScript',
    icon: '⏱️',
    questions: [
      {
        id: 'async-1',
        question: 'Explain Promises and how they work',
        difficulty: 'medium',
        answer: {
          title: 'Promises in JavaScript',
          code: `// A Promise is an object representing the eventual 
// completion or failure of an asynchronous operation

// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  
  setTimeout(() => {
    if (success) {
      resolve("Operation successful!");
    } else {
      reject("Operation failed!");
    }
  }, 1000);
});

// Consuming a Promise
myPromise
  .then(result => {
    console.log(result);  // "Operation successful!"
    return "Next step";
  })
  .then(result => {
    console.log(result);  // "Next step"
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log("Promise settled");
  });

// Practical example: Fetch API
function getUserData(userId) {
  return fetch(\`https://api.example.com/users/\${userId}\`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log("User data:", data);
      return data;
    })
    .catch(error => {
      console.error("Error fetching user:", error);
    });
}

// Promise.all - Wait for all promises
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve('done'), 100));
const promise3 = fetch('/api/data');

Promise.all([promise1, promise2, promise3])
  .then(values => {
    console.log(values);  // [3, 'done', Response]
  });`
        }
      },
      {
        id: 'async-2',
        question: 'What is async/await and how does it differ from Promises?',
        difficulty: 'medium',
        answer: {
          title: 'Async/Await Syntax',
          code: `// async/await is syntactic sugar over Promises
// Makes asynchronous code look synchronous

// With Promises
function fetchUserDataPromise(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => response.json())
    .then(user => {
      return fetch(\`/api/posts/\${user.id}\`);
    })
    .then(response => response.json())
    .then(posts => {
      console.log(posts);
      return posts;
    })
    .catch(error => {
      console.error(error);
    });
}

// With async/await
async function fetchUserDataAsync(userId) {
  try {
    const userResponse = await fetch(\`/api/users/\${userId}\`);
    const user = await userResponse.json();
    
    const postsResponse = await fetch(\`/api/posts/\${user.id}\`);
    const posts = await postsResponse.json();
    
    console.log(posts);
    return posts;
  } catch (error) {
    console.error(error);
  }
}

// Multiple async operations
async function getAllData() {
  try {
    // Sequential (slow)
    const user = await fetchUser();
    const posts = await fetchPosts();
    const comments = await fetchComments();
    
    // Parallel (fast)
    const [user2, posts2, comments2] = await Promise.all([
      fetchUser(),
      fetchPosts(),
      fetchComments()
    ]);
    
    return { user2, posts2, comments2 };
  } catch (error) {
    console.error("Error:", error);
  }
}

// Error handling
async function robustFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;  // Re-throw if needed
  }
}`
        }
      }
    ],
    subTopics: []
  },
  {
    id: 'arrays',
    title: 'Arrays & Methods',
    icon: '🔢',
    questions: [
      {
        id: 'arrays-1',
        question: 'Explain map(), filter(), and reduce() methods',
        difficulty: 'medium',
        answer: {
          title: 'Array Methods',
          code: `const numbers = [1, 2, 3, 4, 5];

// map() - Transform each element
const doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

const users = [
  { name: "John", age: 25 },
  { name: "Jane", age: 30 },
  { name: "Bob", age: 35 }
];
const names = users.map(user => user.name);
console.log(names);  // ["John", "Jane", "Bob"]

// filter() - Select elements that match condition
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens);  // [2, 4]

const adults = users.filter(user => user.age >= 30);
console.log(adults);  // [{ name: "Jane", age: 30 }, { name: "Bob", age: 35 }]

// reduce() - Accumulate values into single result
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum);  // 15

const totalAge = users.reduce((acc, user) => acc + user.age, 0);
console.log(totalAge);  // 90

// Complex reduce example: Group by property
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
];

const grouped = items.reduce((acc, item) => {
  const category = item.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(item.name);
  return acc;
}, {});

console.log(grouped);
// { fruit: ['apple', 'banana'], vegetable: ['carrot'] }

// Chaining methods
const result = numbers
  .filter(num => num > 2)
  .map(num => num * 3)
  .reduce((acc, num) => acc + num, 0);
console.log(result);  // 36`
        }
      }
    ],
    subTopics: []
  },
  {
    id: 'dom',
    title: 'DOM Manipulation',
    icon: '🌳',
    questions: [
      {
        id: 'dom-1',
        question: 'How do you select and manipulate DOM elements?',
        difficulty: 'easy',
        answer: {
          title: 'DOM Selection & Manipulation',
          code: `// Selecting elements
const byId = document.getElementById('myId');
const byClass = document.getElementsByClassName('myClass');
const byTag = document.getElementsByTagName('div');
const querySelector = document.querySelector('.myClass');
const querySelectorAll = document.querySelectorAll('.myClass');

// Creating elements
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello World';
newDiv.className = 'my-class';
newDiv.id = 'my-id';

// Setting attributes
newDiv.setAttribute('data-value', '123');
newDiv.style.color = 'blue';
newDiv.style.fontSize = '16px';

// Adding to DOM
document.body.appendChild(newDiv);
const parent = document.getElementById('parent');
parent.insertBefore(newDiv, parent.firstChild);

// Modifying content
const element = document.querySelector('#myElement');
element.textContent = 'New text';  // Text only
element.innerHTML = '<strong>Bold text</strong>';  // HTML

// Modifying classes
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('selected');
element.classList.contains('active');  // true/false

// Event listeners
const button = document.querySelector('button');
button.addEventListener('click', (event) => {
  console.log('Button clicked!');
  event.preventDefault();
  event.stopPropagation();
});

// Removing elements
const toRemove = document.querySelector('.remove-me');
toRemove.remove();  // Modern way
// toRemove.parentNode.removeChild(toRemove);  // Old way

// Traversing the DOM
const child = element.firstElementChild;
const parent2 = element.parentElement;
const next = element.nextElementSibling;
const prev = element.previousElementSibling;
const children = element.children;  // HTMLCollection`
        }
      }
    ],
    subTopics: []
  },
  {
    id: 'oop',
    title: 'Object-Oriented Programming',
    icon: '🏛️',
    questions: [
      {
        id: 'oop-1',
        question: 'Explain prototypal inheritance in JavaScript',
        difficulty: 'hard',
        answer: {
          title: 'Prototypal Inheritance',
          code: `// Every object has a prototype (__proto__)
// When you access a property, JS looks up the prototype chain

// Constructor function
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(\`\${this.name} is eating\`);
};

function Dog(name, breed) {
  Animal.call(this, name);  // Call parent constructor
  this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(\`\${this.name} says woof!\`);
};

const dog = new Dog('Max', 'Golden Retriever');
dog.eat();   // "Max is eating" (inherited)
dog.bark();  // "Max says woof!"

// Modern ES6 Classes (syntactic sugar)
class AnimalES6 {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(\`\${this.name} is eating\`);
  }
}

class DogES6 extends AnimalES6 {
  constructor(name, breed) {
    super(name);  // Call parent constructor
    this.breed = breed;
  }
  
  bark() {
    console.log(\`\${this.name} says woof!\`);
  }
  
  // Override parent method
  eat() {
    super.eat();  // Call parent method
    console.log('Yum yum!');
  }
}

const dogES6 = new DogES6('Buddy', 'Labrador');
dogES6.eat();   // "Buddy is eating" + "Yum yum!"
dogES6.bark();  // "Buddy says woof!"

// Prototype chain
console.log(dogES6.__proto__ === DogES6.prototype);        // true
console.log(DogES6.prototype.__proto__ === AnimalES6.prototype);  // true
console.log(AnimalES6.prototype.__proto__ === Object.prototype);  // true`
        }
      }
    ],
    subTopics: []
  }
];