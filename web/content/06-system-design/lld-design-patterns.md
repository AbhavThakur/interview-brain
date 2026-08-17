---
title: Low-Level Design (LLD) & GoF Design Patterns Playbook
category: lld-design-patterns
difficulty: Mid / Senior
tags: [lld, design-patterns, solid, ood, machine-coding, clean-code]
---

# Low-Level Design (LLD) & GoF Design Patterns Playbook

## The 3 Pillars of Low-Level Design
In LLD and Machine Coding rounds (60–90 mins), interviewers evaluate:
1. **Object-Oriented Modeling:** Clean classes, interfaces, and decoupling.
2. **SOLID Principles:** Extensibility without modifying existing code (Open/Closed).
3. **Design Pattern Application:** Choosing the right Gang of Four (GoF) pattern for real-world requirements.

---

## 1. Top Design Patterns for Machine Coding Rounds

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GOF DESIGN PATTERNS                             │
├───────────────────┬──────────────────────┬─────────────────────────────┤
│   CREATIONAL      │      STRUCTURAL      │         BEHAVIORAL          │
├───────────────────┼──────────────────────┼─────────────────────────────┤
│ • Factory / Method│ • Adapter (Wrapper)  │ • Strategy (Interchangeable)│
│ • Singleton       │ • Decorator          │ • Observer (Pub/Sub)        │
│ • Builder         │ • Facade (Simplified)│ • State (Finite State Mach) │
└───────────────────┴──────────────────────┴─────────────────────────────┘
```

### A. Strategy Pattern (Interchangeable Algorithms)
* **When to use:** When you have multiple algorithms for a single task (e.g. Payment Gateways: Stripe, PayPal, Razorpay; or Shipping Calculators: FedEx, UPS, DHL).
* **Code Implementation:**

```typescript
// 1. Strategy Interface
interface PaymentStrategy {
  pay(amount: number): Promise<boolean>;
}

// 2. Concrete Strategies
class StripePayment implements PaymentStrategy {
  async pay(amount: number): Promise<boolean> {
    console.log(`Paid $${amount} via Stripe`);
    return true;
  }
}

class PayPalPayment implements PaymentStrategy {
  async pay(amount: number): Promise<boolean> {
    console.log(`Paid $${amount} via PayPal`);
    return true;
  }
}

// 3. Context
class CheckoutService {
  constructor(private paymentStrategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy) {
    this.paymentStrategy = strategy;
  }

  async processOrder(amount: number) {
    return this.paymentStrategy.pay(amount);
  }
}
```

---

### B. Observer Pattern (Event Pub/Sub & Reactive UI)
* **When to use:** When a change in one object requires notifying multiple subscriber objects (e.g. Stock Ticker, Notification System, Redux Store).

```typescript
interface Observer<T> {
  update(data: T): void;
}

class EventEmitter<T> {
  private observers: Set<Observer<T>> = new Set();

  subscribe(observer: Observer<T>) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  notify(data: T) {
    this.observers.forEach(obs => obs.update(data));
  }
}
```

---

### C. Decorator Pattern (Dynamic Behavior Augmentation)
* **When to use:** Adding features without inheritance (e.g. Logging, Caching, Retry wrappers, Express/Redux middleware).

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(msg: string) { console.log(msg); }
}

class TimestampDecorator implements Logger {
  constructor(private wrapped: Logger) {}
  log(msg: string) {
    this.wrapped.log(`[${new Date().toISOString()}] ${msg}`);
  }
}
```

---

## 2. SOLID Principles in Machine Coding

| Principle | Meaning | Violation Example | Clean LLD Solution |
| :--- | :--- | :--- | :--- |
| **Single Responsibility (S)** | A class should have only one reason to change. | `UserService` handles DB queries, sends emails, and generates invoices. | Split into `UserRepository`, `EmailNotifier`, `InvoiceGenerator`. |
| **Open / Closed (O)** | Open for extension, closed for modification. | Using giant `switch (type)` blocks to calculate discounts. | Use **Strategy Pattern** with polymorphic interfaces. |
| **Liskov Substitution (L)** | Subclasses must be substitutable for base class without breaking. | `Square extends Rectangle` breaking width/height setters. | Use composition or distinct `Shape` interfaces. |
| **Interface Segregation (I)** | Clients should not depend on interfaces they do not use. | Fat `Worker` interface with `code()`, `design()`, `manage()`. | Split into `Coder`, `Designer`, `Manager`. |
| **Dependency Inversion (D)** | High-level modules should depend on abstractions, not concretes. | Directly instantiating `new MySQLConnection()` inside controllers. | Inject interface `IDatabaseConnection` via constructor. |
