export interface OopQuestion {
  id: number;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  language: "Java" | "Python" | "C++" | "Any";
  hints?: string[];
  correctAnswer?: string; // New field for the model answer
}

export const oopQuestions: OopQuestion[] = [
  {
    id: 1,
    title: "Design a Bank Account System",
    topic: "Encapsulation",
    difficulty: "Easy",
    description: "Design a BankAccount class with proper encapsulation. Include private fields for account number, balance, and account holder name. Implement methods for deposit, withdraw, and getBalance. Ensure that the balance cannot be directly modified from outside the class.",
    language: "Java",
    hints: [
      "Use private access modifiers for sensitive data",
      "Provide public getter/setter methods with validation",
      "Consider what operations should be allowed on a bank account"
    ],
    correctAnswer: `### Interview Ready Answer
**Key Concept:** Encapsulation ensures data integrity by hiding internal state and requiring interaction through defined methods.

\`\`\`java
public class BankAccount {
    // 1. Private fields (Data Hiding)
    private String accountNumber;
    private double balance;
    private String holderName;

    public BankAccount(String accNum, String name, double initialBalance) {
        this.accountNumber = accNum;
        this.holderName = name;
        if(initialBalance >= 0) {
            this.balance = initialBalance;
        }
    }

    // 2. Public Interface (Controlled Access)
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: " + amount);
        } else {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount);
        } else {
            throw new IllegalArgumentException("Invalid withdraw amount");
        }
    }

    // Getter (Read-only access)
    public double getBalance() {
        return balance;
    }
}
\`\`\`
**Why this works:** Direct access to \`balance\` is blocked. You cannot accidentally set the balance to -1000. Validations in \`deposit\` and \`withdraw\` ensure the object remains in a valid state.`
  },
  {
    id: 2,
    title: "Animal Hierarchy",
    topic: "Inheritance",
    difficulty: "Easy",
    description: "Create a class hierarchy for animals. Design a base Animal class with common properties (name, age) and methods (makeSound, eat). Then create derived classes for Dog, Cat, and Bird that inherit from Animal and override the makeSound method appropriately.",
    language: "Java",
    hints: [
      "Think about what properties ALL animals share",
      "Each animal makes a different sound",
      "Use method overriding for specialized behavior"
    ],
    correctAnswer: `### Interview Ready Answer
**Key Concept:** Inheritance promotes code reuse (extends), while Method Overriding (Runtime Polymorphism) allows specific behaviors for subclasses.

\`\`\`java
// Base Class
class Animal {
    protected String name; // Accessible to subclasses

    public Animal(String name) {
        this.name = name;
    }

    public void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

// Derived Class 1
class Dog extends Animal {
    public Dog(String name) { super(name); }

    @Override
    public void makeSound() {
        System.out.println(name + " says: Woof!");
    }
}

// Derived Class 2
class Cat extends Animal {
    public Cat(String name) { super(name); }

    @Override
    public void makeSound() {
        System.out.println(name + " says: Meow!");
    }
}
\`\`\`
**Explanation:** By extending \`Animal\`, the \`Dog\` and \`Cat\` classes automatically gain the \`name\` field. We override \`makeSound\` so that when we call it on a generic Animal variable holding a Dog object, the specific Dog sound is played.`
  },
  {
    id: 3,
    title: "Shape Area Calculator",
    topic: "Polymorphism",
    difficulty: "Medium",
    description: "Design a system using polymorphism to calculate areas of different shapes. Create an abstract Shape class with an abstract method calculateArea(). Implement concrete classes: Circle, Rectangle, and Triangle. Write a method that takes a list of Shape objects and returns the total area.",
    language: "Java",
    hints: [
      "Use abstract classes or interfaces",
      "Each shape has a different area formula",
      "Polymorphism allows treating all shapes uniformly"
    ],
    correctAnswer: `### Interview Ready Answer
**Key Concept:** Abstraction allows us to define a contract (\`calculateArea\`) that all children must fulfill, enabling us to write generic code that works for any shape.

\`\`\`java
// Abstract Base Class
abstract class Shape {
    abstract double calculateArea();
}

class Circle extends Shape {
    private double radius;
    public Circle(double r) { this.radius = r; }

    @Override
    double calculateArea() { return Math.PI * radius * radius; }
}

class Rectangle extends Shape {
    private double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }

    @Override
    double calculateArea() { return w * h; }
}

// Client Code
public class AreaCalculator {
    public double getTotalArea(List<Shape> shapes) {
        double total = 0;
        // Polymorphism in action: 
        // We don't care if it's a circle or rectangle
        for (Shape s : shapes) {
            total += s.calculateArea();
        }
        return total;
    }
}
\`\`\`
**Why this matters:** If we add a new shape (e.g., \`Triangle\`) later, the \`getTotalArea\` method doesn't need to change at all. This is the **Open-Closed Principle**.`
  },
  // ... rest of your questions
];