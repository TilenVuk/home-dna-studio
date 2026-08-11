import { lazy, Suspense } from "react";
import { ChoiceScreen } from "./ChoiceScreen";
import { ContactScreen } from "./ContactScreen";
import { EditorialScreen } from "./EditorialScreen";
import { HomeDnaWelcome } from "./HomeDnaWelcome";
import { InspirationLink } from "./InspirationLink";
import { MultiSelectScreen } from "./MultiSelectScreen";
import { NoteScreen } from "./NoteScreen";
import { NumberScreen } from "./NumberScreen";
import { RoomSelection } from "./RoomSelection";
import { SingleVisualChoiceScreen } from "./SingleVisualChoiceScreen";
import { StyleSelection } from "./StyleSelection";
import { pruneRooms, type ScreenDef } from "./screenDef";
import type { HomeDnaState, RoomKey } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";

const SuccessScreen = lazy(() =>
  import("./SuccessScreen").then((module) => ({ default: module.SuccessScreen })),
);

export function ScreenDefRenderer({
  def,
  state,
  locale,
  onUpdate,
  onAdvance,
  onBack,
}: {
  def: ScreenDef;
  state: HomeDnaState;
  locale: Locale;
  onUpdate: (mutate: (state: HomeDnaState) => HomeDnaState) => void;
  onAdvance: (mutate?: (state: HomeDnaState) => HomeDnaState) => void;
  onBack: () => void;
}) {
  switch (def.kind) {
    case "welcome":
      return <HomeDnaWelcome locale={locale} onStart={() => onAdvance()} />;
    case "editorial":
      return <EditorialScreen screenKey={def.key} eyebrow={def.eyebrow} headline={def.headline} body={def.body} cta={def.cta} image={def.image} prominentEyebrow={def.prominentEyebrow} onContinue={() => onAdvance()} onBack={onBack} />;
    case "choice":
      return <ChoiceScreen screenKey={def.key} headline={def.headline} support={def.support} options={def.options} value={def.value} onChoose={(value) => onAdvance((s) => def.apply(s, value))} onBack={onBack} />;
    case "visual":
      return <SingleVisualChoiceScreen screenKey={def.key} headline={def.headline} {...(def.support ? { support: def.support } : {})} {...(def.columns ? { columns: def.columns } : {})} options={def.options} {...(def.value ? { value: def.value } : {})} onChoose={(value) => onAdvance((s) => def.apply(s, value))} onBack={onBack} />;
    case "number":
      return <NumberScreen screenKey={def.key} headline={def.headline} {...(def.support ? { support: def.support } : {})} unit={def.unit} min={def.min} max={def.max} {...(def.presets ? { presets: def.presets } : {})} {...(def.skippable ? { allowSkip: true, onSkip: () => onAdvance() } : {})} value={def.value} onSubmit={(value) => onAdvance((s) => def.apply(s, value))} onBack={onBack} />;
    case "multi":
      return <MultiSelectScreen screenKey={def.key} headline={def.headline} {...(def.support ? { support: def.support } : {})} options={def.options} {...(def.max ? { max: def.max } : {})} {...(def.exclusive ? { exclusive: def.exclusive } : {})} {...(def.limitNotice ? { limitNotice: def.limitNotice } : {})} selected={def.selected} onChange={(values) => onUpdate((s) => def.apply(s, values))} onNext={() => onAdvance()} onBack={onBack} />;
    case "note":
      return <NoteScreen screenKey={def.key} headline={def.headline} {...(def.support ? { support: def.support } : {})} value={def.value} onSubmit={(value) => onAdvance((s) => def.apply(s, value))} onBack={onBack} />;
    case "rooms":
      return <RoomSelection selectedRooms={def.selected} {...(state.home.childrenCount ? { childrenCount: state.home.childrenCount } : {})} {...(state.home.childrenCountPlus ? { childrenCountPlus: true } : {})} onChange={(rooms: RoomKey[]) => onUpdate((s) => def.apply(s, rooms))} onNext={() => onAdvance((s) => pruneRooms(s))} onBack={onBack} />;
    case "styles":
      return <StyleSelection selected={def.selected} onChange={(styles) => onUpdate((s) => def.apply(s, styles))} onNext={() => onAdvance()} onBack={onBack} />;
    case "link":
      return <InspirationLink {...(def.value ? { value: def.value } : {})} onSubmit={(url) => onAdvance((s) => def.apply(s, url))} onBack={onBack} />;
    case "contact":
      return <ContactScreen value={def.value} locale={locale} onSubmit={(contact) => onAdvance((s) => def.apply(s, contact))} onBack={onBack} />;
    case "success":
      return <Suspense fallback={null}><SuccessScreen state={state} locale={locale} onBack={onBack} {...(state.contact.name ? { name: state.contact.name } : {})} /></Suspense>;
    default:
      return null;
  }
}
