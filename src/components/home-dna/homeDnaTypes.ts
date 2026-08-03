export type RoomKey =
  | "complete-home"
  | "kitchen"
  | "wardrobe"
  | "living-room"
  | "entry-hall"
  | "utility-room"
  | "bathroom"
  | "home-office";

export type DiscoveryScreen = "welcome" | "rooms" | "placeholder";

export interface HomeDnaState {
  currentScreen: DiscoveryScreen;
  selectedRooms: RoomKey[];
  home: Record<string, unknown>;
  style: Record<string, unknown>;
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

export const initialHomeDnaState: HomeDnaState = {
  currentScreen: "welcome",
  selectedRooms: [],
  home: {},
  style: {},
  lifestyle: {},
  rooms: {},
  investment: {},
  contact: {},
};
