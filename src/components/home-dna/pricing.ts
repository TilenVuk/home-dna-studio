import type {
  EstimatedInvestment,
  ExecutionLevel,
  HomeDnaState,
  RoomEstimate,
  RoomKey,
  RoomsState,
  WardrobeState,
  LivingRoomState,
  EntryHallState,
  BathroomState,
  UtilityRoomState,
  BedroomState,
  ChildrenRoomState,
  KitchenState,
} from "./homeDnaTypes";
import { hasRoom } from "./screenDef";

/** All dimensions in the discovery state are stored in centimetres. */
const cmToM = (cm?: number) => (cm && cm > 0 ? cm / 100 : undefined);

const LED_PER_M = 60;
const GLASS_PER_M = 150;
const MIRROR = 150;
const MIRROR_CABINET = 250;
const BENCH = 250;
const ISLAND_PER_M2 = 600;
const UPHOLSTERED_HEADBOARD = 500;
const DISPLAY_BOARD = 180;

const kitchenBase: Record<ExecutionLevel, number> = {
  basic: 1500,
  premium: 2000,
  signature: 2500,
};

const wardrobeBase: Record<ExecutionLevel, number> = {
  basic: 900,
  premium: 1300,
  signature: 1700,
};

const bedroomBase: Record<ExecutionLevel, number> = {
  basic: 900,
  premium: 1250,
  signature: 1650,
};

const childrenRoomBase: Record<ExecutionLevel, number> = {
  basic: 850,
  premium: 1150,
  signature: 1500,
};

const worktopSurcharge = {
  "classic-laminate": 0,
  "premium-laminate": 150,
  quartz: 400,
  "natural-stone": 0, // price on request — not calculated
} as const;

const layoutCoefficient = {
  linear: 1.0,
  "l-shape": 1.05,
  "u-shape": 1.1,
  "with-island": 1.15,
} as const;

const doorCoefficient = {
  hinged: 1.0,
  sliding: 1.08,
  open: 0.95,
} as const;

export const defaultLengths = {
  kitchen: 4.0,
  wardrobe: 3.0,
  livingRoom: 3.0,
  entryHall: 2.0,
  bathroom: 2.0,
  utilityRoom: 2.0,
  bedroom: 3.5,
  childrenRoom: 3.0,
};

/**
 * Total kitchen run along walls, in centimetres.
 * The island is deliberately excluded because LED and glass quantities follow
 * only the selected wall-mounted kitchen length.
 */
export function kitchenWallLengthCm(kitchen: KitchenState): number {
  const layout = kitchen.layout ?? "linear";
  const walls =
    layout === "linear"
      ? [kitchen.wallA]
      : layout === "l-shape"
        ? [kitchen.wallA, kitchen.wallB]
        : layout === "u-shape"
          ? [kitchen.wallA, kitchen.wallB, kitchen.wallC]
          : [kitchen.wallA, kitchen.wallB];
  const measuredLength = walls.reduce<number>((total, wall) => total + (wall && wall > 0 ? wall : 0), 0);

  return measuredLength > 0 ? measuredLength : defaultLengths.kitchen * 100;
}

const roomLabels: Record<RoomKey, string> = {
  "complete-home": "Celoten dom",
  kitchen: "Kuhinja",
  wardrobe: "Garderoba",
  "living-room": "Dnevna soba",
  "entry-hall": "Predsoba",
  "utility-room": "Gospodinjski prostor",
  bathroom: "Kopalnica",
  bedroom: "Spalnica",
  "children-room": "Otroške sobe",
};

function kitchenPrice(rooms: RoomsState, level: ExecutionLevel): number {
  const k: KitchenState = rooms.kitchen ?? {};
  const layout = k.layout ?? "linear";
  const length = kitchenWallLengthCm(k) / 100;

  let total = length * kitchenBase[level] * layoutCoefficient[layout];

  if (layout === "with-island") {
    const il = cmToM(k.islandLength) ?? 2.4;
    const iw = cmToM(k.islandWidth) ?? 1.0;
    total += il * iw * ISLAND_PER_M2;
  }

  if (k.worktop) total += length * worktopSurcharge[k.worktop];
  if (k.hasLed) total += length * LED_PER_M;
  if (k.hasGlassFronts) total += length * GLASS_PER_M;

  return total;
}

function wardrobePrice(rooms: RoomsState, level: ExecutionLevel): number {
  const w: WardrobeState = rooms.wardrobe ?? { storageTypes: [] };
  const length = cmToM(w.width) ?? defaultLengths.wardrobe;
  let total = length * wardrobeBase[level] * doorCoefficient[w.doorType ?? "hinged"];
  if (w.led) total += length * LED_PER_M;
  if (w.mirror) total += MIRROR;
  return total;
}

function livingRoomPrice(rooms: RoomsState): number {
  const l: LivingRoomState = rooms.livingRoom ?? {};
  const length = cmToM(l.wallWidth) ?? defaultLengths.livingRoom;
  let total = length * 800;
  if (l.led) total += length * LED_PER_M;
  return total;
}

function entryHallPrice(rooms: RoomsState): number {
  const e: EntryHallState = rooms.entryHall ?? {};
  const length = cmToM(e.width) ?? defaultLengths.entryHall;
  let total = length * 900;
  if (e.bench) total += BENCH;
  if (e.mirror) total += MIRROR;
  return total;
}

function bathroomPrice(rooms: RoomsState): number {
  const b: BathroomState = rooms.bathroom ?? {};
  const length = cmToM(b.width) ?? defaultLengths.bathroom;
  let total = length * 1200;
  if (b.mirrorCabinet) total += MIRROR_CABINET;
  return total;
}

function utilityPrice(rooms: RoomsState): number {
  const u: UtilityRoomState = rooms.utilityRoom ?? {};
  return (cmToM(u.width) ?? defaultLengths.utilityRoom) * 900;
}

function bedroomPrice(rooms: RoomsState, level: ExecutionLevel): number {
  const b: BedroomState = rooms.bedroom ?? {};
  const length = cmToM(b.furnitureWidth) ?? defaultLengths.bedroom;
  let total = length * bedroomBase[level];
  if (b.led) total += length * LED_PER_M;
  if (b.mirror) total += MIRROR;
  if (b.upholsteredHeadboard) total += UPHOLSTERED_HEADBOARD;
  return total;
}

/** Cena ene otroške sobe; število sob se upošteva v calculateInvestment. */
function childrenRoomUnitPrice(rooms: RoomsState, level: ExecutionLevel): number {
  const c: ChildrenRoomState = rooms.childrenRoom ?? {};
  const length = cmToM(c.furnitureWidth) ?? defaultLengths.childrenRoom;
  let total = length * childrenRoomBase[level];
  if (c.led) total += length * LED_PER_M;
  if (c.displayBoard) total += DISPLAY_BOARD;
  return total;
}

const calculators: { room: RoomKey; calc: (rooms: RoomsState, level: ExecutionLevel) => number }[] = [
  { room: "kitchen", calc: kitchenPrice },
  { room: "wardrobe", calc: wardrobePrice },
  { room: "living-room", calc: livingRoomPrice },
  { room: "entry-hall", calc: entryHallPrice },
  { room: "utility-room", calc: utilityPrice },
  { room: "bathroom", calc: bathroomPrice },
  { room: "bedroom", calc: bedroomPrice },
  { room: "children-room", calc: childrenRoomUnitPrice },
];

const round500 = (n: number) => Math.round(n / 500) * 500;

export interface PricingResult {
  roomBreakdown: RoomEstimate[];
  estimatedInvestment: EstimatedInvestment;
}

export function calculateInvestment(state: HomeDnaState): PricingResult {
  const level = state.investment.level ?? "premium";

  const roomBreakdown: RoomEstimate[] = calculators
    .filter(({ room }) => hasRoom(state, room))
    .map(({ room, calc }) => {
      const quantity = room === "children-room" ? Math.max(1, state.home.childrenCount ?? 1) : 1;
      const quantityLabel = `${quantity}${room === "children-room" && state.home.childrenCountPlus ? "+" : ""}`;
      return {
        room,
        label: room === "children-room" ? `${roomLabels[room]} (${quantityLabel})` : roomLabels[room],
        amount: Math.round(calc(state.rooms, level) * quantity),
      };
    });

  const total = roomBreakdown.reduce((sum, r) => sum + r.amount, 0);

  return {
    roomBreakdown,
    estimatedInvestment: {
      total: Math.round(total),
      min: round500(total * 0.9),
      max: round500(total * 1.1),
    },
  };
}

export function formatEuro(value: number): string {
  return `${value.toLocaleString("sl-SI").replace(/\u00a0/g, ".")} €`;
}
