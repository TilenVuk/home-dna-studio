export type RoomKey =
  | "complete-home"
  | "kitchen"
  | "wardrobe"
  | "living-room"
  | "entry-hall"
  | "utility-room"
  | "bathroom"
  | "home-office";

export type DiscoveryScreen =
  // Sprint 1 + 2
  | "welcome"
  | "rooms"
  | "project-stage"
  | "property-type"
  | "home-size"
  | "household-size"
  | "children"
  | "children-count"
  | "pets"
  | "style-intro"
  | "style-selection"
  | "atmosphere"
  | "colour-direction"
  | "inspiration"
  // Sprint 3 — lifestyle
  | "lifestyle-intro"
  | "priorities"
  | "challenges"
  | "challenges-other"
  | "cooking"
  | "work-from-home"
  | "hosting"
  | "hobbies"
  | "future-needs"
  | "rooms-intro"
  // Sprint 3 — kitchen
  | "kitchen-intro"
  | "kitchen-layout"
  | "kitchen-wall-a"
  | "kitchen-wall-b"
  | "kitchen-wall-c"
  | "kitchen-island-length"
  | "kitchen-island-width"
  | "kitchen-worktop"
  | "kitchen-tall-units"
  | "kitchen-pantry"
  | "kitchen-led"
  | "kitchen-led-length"
  | "kitchen-glass"
  | "kitchen-glass-length"
  // Sprint 3 — wardrobe
  | "wardrobe-intro"
  | "wardrobe-storage-types"
  | "wardrobe-hanging"
  | "wardrobe-folded"
  | "wardrobe-shoes"
  | "wardrobe-width"
  | "wardrobe-height"
  | "wardrobe-depth"
  | "wardrobe-doors"
  | "wardrobe-led"
  | "wardrobe-mirror"
  // Sprint 3 — living room
  | "living-intro"
  | "living-wall-width"
  | "living-tv"
  | "living-storage"
  | "living-display"
  | "living-books"
  | "living-cables"
  | "living-led"
  // Sprint 3 — entry hall
  | "entry-intro"
  | "entry-width"
  | "entry-shoes"
  | "entry-jackets"
  | "entry-long-coats"
  | "entry-bags"
  | "entry-umbrella"
  | "entry-bench"
  | "entry-mirror"
  // Sprint 3 — utility
  | "utility-intro"
  | "utility-width"
  | "utility-washing"
  | "utility-dryer"
  | "utility-stacked"
  | "utility-cleaning"
  | "utility-ironing"
  | "utility-vacuum"
  | "utility-pantry"
  // Sprint 3 — bathroom
  | "bathroom-intro"
  | "bathroom-width"
  | "bathroom-sink"
  | "bathroom-tall"
  | "bathroom-laundry"
  | "bathroom-mirror-cabinet"
  | "bathroom-cleaning"
  // Sprint 3 — home office
  | "office-intro"
  | "office-users"
  | "office-desk-width"
  | "office-desk-custom"
  | "office-monitors"
  | "office-printer"
  | "office-documents"
  | "office-books"
  | "office-cables"
  // Sprint 4 transition
  | "sprint4-placeholder";

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
  pets?: PetKey[];
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
  cookingFrequency?: "rarely" | "weekly" | "daily";
  workFromHome?: "never" | "sometimes" | "frequently";
  hostingFrequency?: "rarely" | "occasionally" | "often";
  hobbies: string[];
  futureNeeds: string[];
  additionalNotes?: string;
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

export interface HomeDnaState {
  currentScreen: DiscoveryScreen;
  selectedRooms: RoomKey[];
  home: HomeContextState;
  style: StyleState;
  lifestyle: LifestyleState;
  rooms: RoomsState;
  investment: Record<string, unknown>;
  contact: Record<string, unknown>;
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
  home: {},
  style: { selectedStyles: [], atmosphere: [] },
  lifestyle: {
    priorities: [],
    currentChallenges: [],
    hobbies: [],
    futureNeeds: [],
  },
  rooms: {},
  investment: {},
  contact: {},
};
