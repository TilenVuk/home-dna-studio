export type RoomKey =
  | "complete-home"
  | "kitchen"
  | "wardrobe"
  | "living-room"
  | "entry-hall"
  | "utility-room"
  | "bathroom"
  | "home-office";

/** Screen keys are plain strings — the flow is built declaratively in discoveryFlow.ts. */
export type DiscoveryScreen = string;

export type ProjectStage = "new-build" | "complete-renovation" | "partial-renovation";
export type PropertyType = "house" | "apartment" | "holiday-home";
export type ChildrenAnswer = "none" | "planning" | "yes";
export type PetKey = "dog" | "cat" | "other" | "none";

export type Priority = "low" | "medium" | "high";

export interface HomeContextState {
  projectStage?: ProjectStage;
  propertyType?: PropertyType;
  floorArea?: number;
  householdSize?: number;
  householdSizePlus?: boolean;
  children?: ChildrenAnswer;
  childrenCount?: number;
  pets: string[];
}

export interface StyleState {
  selectedStyles: string[];
  atmosphere: string[];
  colourDirection?: string;
  inspirationUrl?: string;
}

export interface LifestyleState {
  priorities: string[];
  currentChallenges: string[];
  challengeNote?: string;
  futureNeeds: string[];
}

export interface KitchenState {
  layout?: "linear" | "l-shape" | "u-shape" | "with-island";
  wallA?: number;
  wallB?: number;
  wallC?: number;
  islandLength?: number;
  islandWidth?: number;
  worktop?: "classic-laminate" | "premium-laminate" | "quartz" | "natural-stone";
  ledLength?: number;
  glassFrontLength?: number;
  pantry?: boolean;
  pantryType?: "none" | "pull-out" | "walk-in";
  tallUnits?: number;
  tallUnitsPlus?: boolean;
  hasLed?: boolean;
  hasGlassFronts?: boolean;
}

export interface WardrobeState {
  storageTypes: string[];
  hangingPriority?: Priority;
  foldedPriority?: Priority;
  shoePairs?: string;
  width?: number;
  height?: number;
  depth?: number;
  depthPlus?: boolean;
  doorType?: "hinged" | "sliding" | "open";
  led?: boolean;
  mirror?: boolean;
}

export interface LivingRoomState {
  wallWidth?: number;
  tvSize?: string;
  storagePriority?: Priority;
  displayPriority?: Priority;
  books?: string;
  cableManagement?: boolean;
  led?: boolean;
}

export interface EntryHallState {
  width?: number;
  shoePairs?: string;
  jackets?: string;
  longCoats?: boolean;
  bags?: string;
  umbrellaStorage?: boolean;
  bench?: boolean;
  mirror?: boolean;
}

export interface UtilityRoomState {
  width?: number;
  washingMachine?: boolean;
  dryer?: boolean;
  stackedAppliances?: boolean;
  cleaningStorage?: boolean;
  ironingBoard?: boolean;
  vacuumStorage?: boolean;
  pantryStorage?: boolean;
}

export interface BathroomState {
  width?: number;
  singleOrDoubleSink?: "single" | "double";
  tallStorage?: boolean;
  laundryStorage?: boolean;
  mirrorCabinet?: boolean;
  cleaningStorage?: boolean;
}

export interface HomeOfficeState {
  users?: 1 | 2;
  deskWidth?: number;
  monitors?: string;
  printerStorage?: boolean;
  documentStorage?: boolean;
  books?: boolean;
  cableManagement?: boolean;
}

export interface RoomsState {
  kitchen?: KitchenState;
  wardrobe?: WardrobeState;
  livingRoom?: LivingRoomState;
  entryHall?: EntryHallState;
  utilityRoom?: UtilityRoomState;
  bathroom?: BathroomState;
  homeOffice?: HomeOfficeState;
}

export type ExecutionLevel = "basic" | "premium" | "signature";

export interface RoomEstimate {
  room: RoomKey;
  label: string;
  amount: number;
}

export interface EstimatedInvestment {
  min: number;
  max: number;
  total: number;
}

export interface InvestmentState {
  level: ExecutionLevel;
  estimatedInvestment?: EstimatedInvestment;
  roomBreakdown?: RoomEstimate[];
}

export interface ContactState {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

export interface HomeDnaState {
  currentScreen: DiscoveryScreen;
  selectedRooms: RoomKey[];
  home: HomeContextState;
  style: StyleState;
  lifestyle: LifestyleState;
  rooms: RoomsState;
  investment: InvestmentState;
  contact: ContactState;
}

export interface RoomOption {
  key: RoomKey;
  title: string;
  description: string;
  image: string;
}

export interface VisualOption<T extends string = string> {
  value: T;
  title: string;
  description?: string;
  image: string;
}

export const initialHomeDnaState: HomeDnaState = {
  currentScreen: "welcome",
  selectedRooms: [],
  home: { pets: [] },
  style: { selectedStyles: [], atmosphere: [] },
  lifestyle: {
    priorities: [],
    currentChallenges: [],
    futureNeeds: [],
  },
  rooms: {},
  investment: {},
  contact: { name: "", email: "", phone: "", consent: false },
};
