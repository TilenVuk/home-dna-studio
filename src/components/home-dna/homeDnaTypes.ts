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
  | "placeholder";

export type ProjectStage = "new-build" | "complete-renovation" | "partial-renovation";
export type PropertyType = "house" | "apartment" | "holiday-home";
export type ChildrenAnswer = "none" | "planning" | "yes";
export type PetKey = "dog" | "cat" | "other" | "none";

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

export interface HomeDnaState {
  currentScreen: DiscoveryScreen;
  selectedRooms: RoomKey[];
  home: HomeContextState;
  style: StyleState;
  lifestyle: Record<string, unknown>;
  rooms: Record<string, unknown>;
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
  lifestyle: {},
  rooms: {},
  investment: {},
  contact: {},
};
