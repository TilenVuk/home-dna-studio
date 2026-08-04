import type { ContactState, DiscoveryScreen, HomeDnaState, RoomKey, RoomsState, VisualOption } from "./homeDnaTypes";
import { yesNoOptions } from "./discoveryData";

export type ScreenDef =
  | { kind: "welcome"; key: DiscoveryScreen }
  | {
      kind: "editorial";
      key: DiscoveryScreen;
      eyebrow: string;
      headline: string;
      body: string;
      cta: string;
      image: string;
      prominentEyebrow?: boolean;
    }
  | {
      kind: "choice";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      options: { value: string; label: string; description?: string }[];
      value: string | undefined;
      apply: (state: HomeDnaState, value: string) => HomeDnaState;
    }
  | {
      kind: "visual";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      columns?: "two" | "three";
      options: VisualOption[];
      value: string | undefined;
      apply: (state: HomeDnaState, value: string) => HomeDnaState;
    }
  | {
      kind: "number";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      unit: string;
      min: number;
      max: number;
      presets?: number[];
      skippable?: boolean;
      value: number | undefined;
      apply: (state: HomeDnaState, value: number) => HomeDnaState;
    }
  | {
      kind: "multi";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      options: string[];
      max?: number;
      exclusive?: string;
      limitNotice?: string;
      selected: string[];
      apply: (state: HomeDnaState, values: string[]) => HomeDnaState;
    }
  | {
      kind: "note";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      value: string | undefined;
      apply: (state: HomeDnaState, value: string) => HomeDnaState;
    }
  | {
      kind: "rooms";
      key: DiscoveryScreen;
      selected: RoomKey[];
      apply: (state: HomeDnaState, rooms: RoomKey[]) => HomeDnaState;
    }
  | {
      kind: "styles";
      key: DiscoveryScreen;
      selected: string[];
      apply: (state: HomeDnaState, styles: string[]) => HomeDnaState;
    }
  | {
      kind: "link";
      key: DiscoveryScreen;
      value: string | undefined;
      apply: (state: HomeDnaState, url?: string) => HomeDnaState;
    }
  | {
      kind: "contact";
      key: DiscoveryScreen;
      value: ContactState;
      apply: (state: HomeDnaState, contact: ContactState) => HomeDnaState;
    }
  | { kind: "success"; key: DiscoveryScreen };

export function setRoom<K extends keyof RoomsState>(
  state: HomeDnaState,
  key: K,
  patch: Partial<NonNullable<RoomsState[K]>>,
): HomeDnaState {
  return {
    ...state,
    rooms: {
      ...state.rooms,
      [key]: { ...(state.rooms[key] ?? {}), ...patch },
    } as RoomsState,
  };
}

export function boolChoice(
  key: DiscoveryScreen,
  headline: string,
  value: boolean | undefined,
  apply: (state: HomeDnaState, value: boolean) => HomeDnaState,
  support?: string,
): ScreenDef {
  return {
    kind: "choice",
    key,
    headline,
    ...(support ? { support } : {}),
    options: yesNoOptions,
    value: value === undefined ? undefined : value ? "yes" : "no",
    apply: (s, v) => apply(s, v === "yes"),
  };
}

export const priorityLevels = [
  { value: "low", label: "Manjši del" },
  { value: "medium", label: "Približno polovica" },
  { value: "high", label: "Večina omare" },
];

export function hasRoom(state: HomeDnaState, room: RoomKey): boolean {
  if (room === "children-room" && !state.home.childrenCount) return false;
  return state.selectedRooms.includes("complete-home") || state.selectedRooms.includes(room);
}

export function pruneRooms(state: HomeDnaState): HomeDnaState {
  const rooms: RoomsState = {};
  if (hasRoom(state, "kitchen") && state.rooms.kitchen) rooms.kitchen = state.rooms.kitchen;
  if (hasRoom(state, "wardrobe") && state.rooms.wardrobe) rooms.wardrobe = state.rooms.wardrobe;
  if (hasRoom(state, "living-room") && state.rooms.livingRoom) rooms.livingRoom = state.rooms.livingRoom;
  if (hasRoom(state, "entry-hall") && state.rooms.entryHall) rooms.entryHall = state.rooms.entryHall;
  if (hasRoom(state, "utility-room") && state.rooms.utilityRoom) rooms.utilityRoom = state.rooms.utilityRoom;
  if (hasRoom(state, "bathroom") && state.rooms.bathroom) rooms.bathroom = state.rooms.bathroom;
  if (hasRoom(state, "bedroom") && state.rooms.bedroom) rooms.bedroom = state.rooms.bedroom;
  if (hasRoom(state, "children-room") && state.rooms.childrenRoom) rooms.childrenRoom = state.rooms.childrenRoom;
  return { ...state, rooms };
}
