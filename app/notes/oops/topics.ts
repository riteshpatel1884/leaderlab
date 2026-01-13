// topics.ts

export type Topic = {
  id: string;
  title: string;
  contributors: string[];
  content?: {
    description: string[]; 
    keyPoints: string[];
    codeExample?: {
      title: string;
      code: string;
    };
  };
  subTopics?: Topic[];
};

// 2. Update the Data
export const topics: Topic[] = [
  {
    id: 'intro',
    title: 'Introduction',
    contributors: ['LeaderLab'],
    content: {
      // Split the text into separate strings for each line/point
      description: [
        '- OOPs (Object-Oriented Programming System) in Java is a programming approach where software is designed around objects rather than functions or logic alone.',
        '- Java is a pure object-oriented language (almost everything is an object).',
        '- OOPs helps make code reusable, modular, secure, and easy to maintain.'
      ],
      keyPoints: [
        'Encapsulation: Binding data and methods together and hiding internal details. Achieved using private variables and public methods.',
        'Inheritance: One class inherits properties of another class. Uses extends keyword.',
        'Polymorphism: One method behaves differently in different situations.',
        'Abstraction: Hiding implementation details and showing only essential features. Achieved using abstract classes and interfaces.'
      ],
      codeExample: {
        title: 'Basic Structure',
        code: `
// Encapsulation
    class Student {
    private int marks;

    public void setMarks(int m) {
        marks = m;
    }

    public int getMarks() {
        return marks;
      }
    } 


// Inheritance
    class Animal {
    void eat() {
        System.out.println("Eating");
      }
    }

    class Dog extends Animal {
      void bark() {
        System.out.println("Barking");
      }
    }


// Polymorphism
    class MathOps {
      int add(int a, int b) {
        return a + b;
      }

    int add(int a, int b, int c) {
        return a + b + c;
      }
    }


// Abstraction(Abstract Class)
    abstract class Vehicle {
       abstract void start();
    }

// Abstraction(Interface)
    interface Payment {
      void pay();
    }

        `
      }
    },
    subTopics: [
      {
        id: 'class',
        title: 'Classes',
        contributors: ['LeaderLab'],
        content: {
          description: [
            '- A class in Java is a blueprint or template used to create objects (a particular data structure).',
            '- It defines what an object will have (data) and what it can do (behavior).',
            '- A class itself does not take memory until an object is created from it.'
          ],
          keyPoints: [
            'A class is a user-defined data type that contains variables and methods.',
          ],
          codeExample: {
            title: 'Class',
            code: `class Student {
    int id;
    String name;

    void study() {
        System.out.println("Student is studying");
    }
}
// id, name → data members
// study() → member function
// Student → class
`
          }
        }
      },
      {
        id: 'objects',
        title: 'Objects',
        contributors: ['LeaderLab'],
        content: {
          description: [
            '- An object in Java is a real-world entity created from a class.',
            '- It represents a physical or logical thing that has state, behavior, and identity.',
            '- Objects are instances of a class and occupy memory.'
          ],
          keyPoints: [
            'An object is an instance of a class that contains actual values.',
            'State: Data stored in the object Example: id = 101, name  "Ritesh"',
            'Behavior: Actions performed by the object. Example: study()',
            'Identity: Unique reference of the object. Example: s1',
            'Class → Mobile Phone. Objects → iPhone, Samsung, OnePlus'
           
          ],
          codeExample: {
            title: 'objects',
            code: `class Student {
    int id;
    String name;

    void study() {
        System.out.println("Student is studying");
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student(); // object creation
        s1.id = 101;
        s1.name = "Ritesh";

        s1.study();
    }
}

// Student → Class
// s1 → Object
// id, name → State()
// study() → Behavior
// Student() → constructor
`
          }
        }
      },
      {
        id: 'instance',
        title: 'Instance',
        contributors: ['LeaderLab'],
        content: {
          description: [
            '- An instance is a single, real object created from a class.',
            '- It represents one specific occurrence of a class in memory.',
            '- In simple words: Instance = Object'
          ],
          keyPoints: [
            'An instance is an individual object created from a class.',
            'Created using the new keyword',
            'Stored in heap memory',
            'Has its own state, behavior, and identity',
            'Multiple instances can be created from one class'
           
          ],
          codeExample: {
            title: 'instance',
            code: `class Student {
    int id;
    String name;
}

Student s1 = new Student();
Student s2 = new Student();
// Student → Class
// s1, s2 → Instances (Objects)
// Each instance has its own memory and values.
`
          }
        }
      },
      {
        id: 'examples',
        title: 'Examples',
        contributors: ['LeaderLab'],
        content: {
          description: [
            ''
          ],
          keyPoints: [
            'A short example for better understanding',
          ],
          codeExample: {
            title: 'example',
            code: `class Student {
    int id;
    String name;
    float marks;
}

public class Main {
    public static void main(String[] args) {
        Student Ritesh = new Student();
        System.out.println(Ritesh);       //Student@2a139a55  Random value
        System.out.println(Ritesh.id);    // 0
        System.out.println(Ritesh.name);  // null
        System.out.println(Ritesh.marks); // 0.0

        //1. This is the Java’s default behavior when an object is created but values are not initialized.

        //2. Initialize Values
        Ritesh.name = "Ritesh";
        Ritesh.id = 192;
        Ritesh.marks = 89;

        System.out.println(Ritesh.id);      // 192
        System.out.println(Ritesh.name);    // Ritesh
        System.out.println(Ritesh.marks);   // 89.0

        
        //3. If default values are given then
        class Student {
          int id = 192;
          String name;
          float marks;
        }
        Ritesh.name = "Ritesh";
        Ritesh.id = 233;
        Ritesh.marks = 89;

        System.out.println(Ritesh.id);      // 233 
        // If an instance variable is assigned a new value after object creation, the default value is replaced by the newly assigned value.
        System.out.println(Ritesh.name);    // Ritesh   
        System.out.println(Ritesh.marks);   // 89.0

      }
}

`
          }
        }
      },
      {
        id: 'constructor',
        title: 'Constructor',
        contributors: ['LeaderLab'],
        content: {
          description: [
            '- A constructor is a special block of code that is used to initialize an object.',
            '- It is automatically called when an object is created using the new keyword.'
           
          ],
          keyPoints: [
            'Same name as the class',
            'No return type (not even void)',
            'Called automatically during object creation',
            'Used to initialize instance variables',
            'Executes only once per object'
          ],
          codeExample: {
            title: 'constructor',
            code: `class Student {
    int id=192;
    String name;
    float marks;
    
    Student(){
        // Constructor
    }
}


class Student {
    int id;
    String name;
    float marks;
    
    Student(){
        this.id = 192;
        this.name = "Ritesh";
        this.marks = 89;

        // this keyword is referring to the object Ritesh.

        // this.id = 192;
        // this.name = Ritesh;
        // this.marks = 89;   These 3 lines is exactly the same as writing:

        // Ritesh.id = 192;
        // Ritesh.name = Ritesh;
        // Ritesh.marks = 89;

        // But we cannot use Ritesh inside the class, so Java provides this keyword to refer it.
    }
}

public class Main {
    public static void main(String[] args) {
        Student Ritesh = new Student();
      
        System.out.println(Ritesh.id);    // 192
        System.out.println(Ritesh.name);  // Ritesh
        System.out.println(Ritesh.marks); // 89.0
    }
}


// Example 1:
class Student {
    int id;
    String name;
    float marks;
    
    Student(){
        this.id = 192;
        this.name = "Ritesh";
        this.marks = 89;
    }
    void greeting(){
        System.out.println("Hi, Welcome " + this.name);
    }
}

public class Main {
    public static void main(String[] args) {
      Student Ritesh = new Student();
      
       Ritesh.greeting(); 
      //  Ritesh.greeting() calls the greeting() method, and inside that method, this.name refers to Ritesh.name

      1️⃣ Ritesh.greeting() is called
      2️⃣ greeting() method executes
      3️⃣ Inside greeting(), this refers to Ritesh
      4️⃣ So this.name → Ritesh.name
      5️⃣ Output
    }
}         


// Example 2:
class Student {
    int id;
    String name;
    float marks;
    
    Student(int std_id, String std_name, float std_marks){
        this.id = std_id;
        this.name = std_name;
        this.marks = std_marks;

        // The this keyword refers to the current object's instance variable.
        // It is used here to distinguish between the instance variables (id, name, marks) 
        // and the constructor parameters (std_id, std_name, std_marks) that have similar names.
        // Without this, Java would not know we are referring to the object's variable rather than the parameter.
    }
}

public class Main {
    public static void main(String[] args) {
        Student Ritesh = new Student(192, "Ritesh", 90);
        
        System.out.println(Ritesh.id);    // 192
        System.out.println(Ritesh.name);  // Ritesh
        System.out.println(Ritesh.marks); //  90.0
    }
}


// Calling a constructor from another constructor
class Student {
    int id;
    String name;
    float marks;
    
    // constructor 1
    Student(int std_id, String std_name, float std_marks){
        this.id = std_id;
        this.name = std_name;
        this.marks = std_marks;
}
    // constructor 2   
    Student(){
    this (192, "Ritesh", 89);  // this is referring to the above Student constructor
    }
   
}

public class Main {
    public static void main(String[] args) {
        Student Ritesh = new Student();
        
        System.out.println(Ritesh.id);    // 192
        System.out.println(Ritesh.name);  // Ritesh
        System.out.println(Ritesh.marks); //  89.0
    }
}
`
          },
          
        }
      },
      {
        id: 'final_keyword',
        title: 'Final Keyword',
        contributors: ['LeaderLab'],
        content: {
          description: [
            '- The final keyword in Java is used to restrict variables, methods, and classes from being modified, overridden, or inherited.',
          ],
          keyPoints: [
            'final Variable: Value cannot be changed once assigned.',
            'final Method: Method cannot be overridden by subclasses.',
            'final Class: Class cannot be inherited.'
           
          ],
          codeExample: {
            title: 'final',
            code: `// final Variable
final int MAX = 100;
MAX = 200; // ❌ Error
 

// final Method
class Parent {
    final void show() {
        System.out.println("Hello");
    }
}
class Child extends Parent {
    void show() { } // ❌ Error
}


// final Class
final class Vehicle { }

class Car extends Vehicle { } // ❌ Error

`
          }
        }
      },
    ]
  },
  {
    id: 'principles',
    title: 'OOP Principles',
    contributors: ['LeaderLab'],
    subTopics: [
      
    ]
  }
];