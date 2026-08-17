---
title: Machine Coding & LLD 5-Step Execution Framework
category: lld-framework
difficulty: Mid / Senior
tags: [lld, machine-coding, ood, parking-lot, splitwise, clean-code]
---

# Machine Coding & LLD 5-Step Execution Framework

## The 90-Minute Time Management Strategy
Machine coding rounds test your ability to convert ambiguous business requirements into production-ready, clean, object-oriented code with test cases in 90 minutes.

```
00m ───────────────── 15m ───────────────── 35m ───────────────── 75m ────────── 90m
 Requirements &       Entity Modeling      Core Interfaces       Execution &     Edge Cases &
 Scope Clarification  & Class Diagram      & Business Logic      Test Cases      Refactoring
```

---

## 1. The 5-Step Formula

### Step 1: Clarify Scope & Define Entities (First 15 mins)
* Identify core **Actors** and **Resources** (e.g. For Parking Lot: `Vehicle`, `ParkingSpot`, `ParkingLot`, `Ticket`, `PaymentGateway`).
* State all assumptions explicitly (e.g. "We will support 3 vehicle types: Motorcycle, Car, Truck; single entrance/exit gate for MVP").

### Step 2: Define Enums & Value Types
```typescript
export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  TRUCK = 'TRUCK'
}

export enum SpotStatus {
  EMPTY = 'EMPTY',
  OCCUPIED = 'OCCUPIED'
}
```

### Step 3: Design Interfaces & Decouple Responsibilities (SOLID)
* Never write business logic directly inside entity POJOs.
* Create decoupled **Strategy Services** (e.g. `FeeCalculationStrategy`, `SpotAssignmentStrategy`).

```typescript
export interface FeeCalculationStrategy {
  calculateFee(durationInMinutes: number, vehicleType: VehicleType): number;
}

export class HourlyFeeStrategy implements FeeCalculationStrategy {
  calculateFee(durationInMinutes: number, vehicleType: VehicleType): number {
    const hours = Math.ceil(durationInMinutes / 60);
    const rate = vehicleType === VehicleType.TRUCK ? 30 : vehicleType === VehicleType.CAR ? 20 : 10;
    return hours * rate;
  }
}
```

### Step 4: Write Core Domain Models
```typescript
export class ParkingSpot {
  constructor(
    public readonly id: string,
    public readonly type: VehicleType,
    public status: SpotStatus = SpotStatus.EMPTY
  ) {}

  isAvailable(): boolean {
    return this.status === SpotStatus.EMPTY;
  }
}
```

### Step 5: Implement Driver / Facade & Verify with Test Cases
```typescript
export class ParkingLotController {
  private spots: Map<string, ParkingSpot> = new Map();

  constructor(private feeStrategy: FeeCalculationStrategy) {}

  parkVehicle(vehicle: { id: string; type: VehicleType }) {
    // Locate spot, assign ticket, mark occupied
  }

  unparkVehicle(ticketId: string) {
    // Calculate fee using feeStrategy, release spot, return bill
  }
}
```

---

## 2. Top 5 Classic Machine Coding Interview Problems

1. **In-Memory Cache (LRU/LFU):** Doubly linked list + Hash Map with TTL support.
2. **Parking Lot System:** Dynamic spot allocation, multi-level support, payment calculation strategy.
3. **Splitwise Expense Sharing:** User balances, percentage/equal splits, transaction simplification graph.
4. **Snake and Ladder Board Game:** Dice strategy, board generation, player queue round-robin.
5. **Rate Limiter (In-Memory Token Bucket):** Concurrency/thread-safety, refill intervals.
