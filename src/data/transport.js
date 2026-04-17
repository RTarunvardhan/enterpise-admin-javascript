/**
 * TRANSPORT DATASET
 * -----------------------------------
 * INPUT: None
 * OUTPUT: Array<Transport>
 *
 * PURPOSE:
 *  Tracks shipments, vehicles, delivery flow
 */

export const TRANSPORT = Array.from({ length: 400 }, (_, i) => ({
  id: i + 1,
  shipmentId: `SHIP${10000 + i}`,
  orderId: `ORD${50000 + i}`,
  vehicleId: `VEH${i % 50}`,
  driverName: `Driver ${i % 30}`,
  driverContact: `90000${10000 + i}`,
  vehicleType: ["Truck", "Van", "Bike"][i % 3],
  capacity: 1000 + i * 5,
  loadWeight: Math.floor(Math.random() * 1000),
  source: ["Hyderabad", "Bangalore", "Chennai"][i % 3],
  destination: ["Mumbai", "Delhi", "Pune"][i % 3],
  route: `Route ${i % 10}`,
  distanceKm: 50 + i,
  fuelCost: 500 + i * 3,
  estimatedTime: `${5 + (i % 10)} hrs`,
  actualTime: `${6 + (i % 10)} hrs`,
  departureTime: "2026-04-01",
  arrivalTime: "2026-04-02",
  delayStatus: ["On Time", "Delayed"][i % 2],
  delayReason: i % 2 ? "Traffic" : "None",
  shipmentStatus: ["In Transit", "Delivered", "Pending"][i % 3],
  temperature: (20 + Math.random() * 10).toFixed(1),
  fragile: ["Yes", "No"][i % 2],
  insuranceStatus: ["Insured", "Not Insured"][i % 2],
  createdAt: "2026-04-01"
}));