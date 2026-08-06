export type RoomKey =
  | "complete-home"
  | "kitchen"
  | "wardrobe"
  | "living-room"
  | "entry-hall"
  | "utility-room"
  | "bathroom"
  | "bedroom"
  | "children-room";

/** Screen keys are plain strings — the flow is built declaratively in discoveryFlow.ts. */
export type DiscoveryScreen = string;

export type ProjectStage = "new-build" | "complete-renovation" | "partial-renovation";
export type PropertyType = "house" | "apartment" | "holiday-home";
export type ChildrenAnswer = "none" | "planning" | "yes";
export type PetKey = "dog" | "cat" | "other" | "none";

export type Priority = "low" | "medium" | "high";
export type CookingFrequency = "rarely" | "weekly" | "daily";
export type WorkFromHomeFrequency = "never" | "sometimes" | "frequently";
export type HostingFrequency = "rarely" | "occasionally" | "often";

export interface HomeContextState {
  projectStage?: ProjectStage;
  propertyType?: PropertyType;
  floorArea?: number;
  householdSize?: number;
  householdSizePlus?: boolean;
  children?: ChildrenAnswer;
  childrenCount?: number;
  childrenCountPlus?: boolean;
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
  cookingFrequency?: CookingFrequency;
  workFromHomeFrequency?: WorkFromHomeFrequency;
  hostingFrequency?: HostingFrequency;
  hobbies: string[];
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
  islandSeats?: string;
  appliances?: string[];
  worktop?: "classic-laminate" | "premium-laminate" | "quartz" | "natural-stone";
  ledLength?: number;
  glassFrontLength?: number;
  pantry?: boolean;
  pantryType?: "none" | "pull-out" | "walk-in";
  hasLed?: boolean;
  hasGlassFronts?: boolean;
}

export interface WardrobeState {
  users?: string;
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
  users?: string;
  width?: number;
  singleOrDoubleSink?: "single" | "double";
  tallStorage?: boolean;
  laundryStorage?: boolean;
  mirrorCabinet?: boolean;
  cleaningStorage?: boolean;
}

export interface BedroomState {
  furnitureWidth?: number;
  wardrobe?: boolean;
  bedFrame?: boolean;
  bedsideTables?: boolean;
  dressingTable?: boolean;
  tvWall?: boolean;
  bedWidth?: "140" | "160" | "180" | "200";
  led?: boolean;
  mirror?: boolean;
  upholsteredHeadboard?: boolean;
}

export interface ChildrenRoomState {
  ageGroups?: string[];
  furnitureWidth?: number;
  wardrobe?: boolean;
  bedWithStorage?: boolean;
  desk?: boolean;
  openStorage?: boolean;
  adaptableFurniture?: boolean;
  led?: boolean;
  displayBoard?: boolean;
}

export interface RoomsState {
  kitchen?: KitchenState;
  wardrobe?: WardrobeState;
  livingRoom?: LivingRoomState;
  entryHall?: EntryHallState;
  utilityRoom?: UtilityRoomState;
  bathroom?: BathroomState;
  bedroom?: BedroomState;
  childrenRoom?: ChildrenRoomState;
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
  turnstileToken: string;
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

export type ReportImageId =
  | "hero-interior"
  | "lifestyle-intro"
  | "lifestyle-people"
  | "style-intro"
  | "detail-material"
  | "property-house"
  | "property-apartment"
  | "property-holiday"
  | "stage-new-build"
  | "stage-full-renovation"
  | "stage-partial-renovation"
  | "style-warm-modern"
  | "style-minimal"
  | "style-scandinavian"
  | "style-japandi"
  | "style-natural"
  | "style-classic"
  | "style-dark"
  | "style-rustic"
  | "colour-light"
  | "colour-earthy"
  | "colour-neutral"
  | "colour-dark"
  | "project-kitchen"
  | "project-wardrobe"
  | "project-living"
  | "project-entry"
  | "project-utility"
  | "project-bathroom"
  | "project-bedroom"
  | "project-child-room"
  | "kitchen-layout-linear"
  | "kitchen-layout-l"
  | "kitchen-layout-u"
  | "kitchen-layout-island"
  | "worktop-laminate"
  | "worktop-premium-laminate"
  | "worktop-quartz"
  | "worktop-stone"
  | "wardrobe-hinged"
  | "wardrobe-sliding"
  | "wardrobe-open"
  | "investment-essential"
  | "investment-considered"
  | "investment-signature"
  | "report-kitchen-social"
  | "report-wardrobe-organised"
  | "report-living-family"
  | "report-entry-family"
  | "report-utility-organised"
  | "report-bathroom-calm"
  | "report-bedroom-calm"
  | "report-child-room-flexible";

export interface ReportImageChoice {
  id: ReportImageId;
  label: string;
}

export interface ReportImageCandidates {
  cover: ReportImageChoice[];
  lifestyle: ReportImageChoice[];
  style: ReportImageChoice[];
  rooms: Array<{
    key: RoomKey;
    label: string;
    images: ReportImageChoice[];
  }>;
}

export interface HomeDnaReportImages {
  coverImageId: ReportImageId;
  lifestyleImageId: ReportImageId;
  styleImageIds: ReportImageId[];
}

export interface HomeDnaReportRoom {
  key: RoomKey;
  label: string;
  text: string;
  imageId: ReportImageId;
}

export interface HomeDnaReportData {
  intro: string;
  lifestyle: string;
  style: string;
  why: string;
  images: HomeDnaReportImages;
  rooms: HomeDnaReportRoom[];
  investment: string;
  nextSteps: Array<{ title: string; text: string }>;
  closing: string;
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
  badge?: string;
  image: string;
}

export const initialHomeDnaState: HomeDnaState = {
  currentScreen: "welcome",
  selectedRooms: [],
  home: { pets: [] },
  style: { selectedStyles: [], atmosphere: [] },
  lifestyle: {
    priorities: [],
    hobbies: [],
    currentChallenges: [],
    futureNeeds: [],
  },
  rooms: {},
  investment: { level: "premium" },
  contact: { name: "", email: "", phone: "", consent: false, turnstileToken: "" },
};
