import { ChoiceScreen } from "./ChoiceScreen";
import { EditorialScreen } from "./EditorialScreen";
import { MultiSelectScreen } from "./MultiSelectScreen";
import { NoteScreen } from "./NoteScreen";
import { NumberScreen } from "./NumberScreen";
import { SingleVisualChoiceScreen } from "./SingleVisualChoiceScreen";
import type { ScreenDef } from "./sprint3Flow";
import type { HomeDnaState } from "./homeDnaTypes";

export function ScreenDefRenderer({
  def,
  onUpdate,
  onAdvance,
  onBack,
}: {
  def: ScreenDef;
  onUpdate: (mutate: (state: HomeDnaState) => HomeDnaState) => void;
  onAdvance: (mutate?: (state: HomeDnaState) => HomeDnaState) => void;
  onBack: () => void;
}) {
  switch (def.kind) {
    case "editorial":
      return (
        <EditorialScreen
          screenKey={def.key}
          eyebrow={def.eyebrow}
          headline={def.headline}
          body={def.body}
          cta={def.cta}
          image={def.image}
          onContinue={() => onAdvance()}
          onBack={onBack}
        />
      );

    case "choice":
      return (
        <ChoiceScreen
          screenKey={def.key}
          headline={def.headline}
          support={def.support}
          options={def.options}
          value={def.value}
          onChoose={(value) => onAdvance((s) => def.apply(s, value))}
          onBack={onBack}
        />
      );

    case "visual":
      return (
        <SingleVisualChoiceScreen
          screenKey={def.key}
          headline={def.headline}
          {...(def.support ? { support: def.support } : {})}
          {...(def.columns ? { columns: def.columns } : {})}
          options={def.options}
          {...(def.value ? { value: def.value } : {})}
          onChoose={(value) => onAdvance((s) => def.apply(s, value))}
          onBack={onBack}
        />
      );

    case "number":
      return (
        <NumberScreen
          screenKey={def.key}
          headline={def.headline}
          {...(def.support ? { support: def.support } : {})}
          unit={def.unit}
          min={def.min}
          max={def.max}
          {...(def.presets ? { presets: def.presets } : {})}
          {...(def.skippable ? { allowSkip: true, onSkip: () => onAdvance() } : {})}
          value={def.value}
          onSubmit={(value) => onAdvance((s) => def.apply(s, value))}
          onBack={onBack}
        />
      );

    case "multi":
      return (
        <MultiSelectScreen
          screenKey={def.key}
          headline={def.headline}
          {...(def.support ? { support: def.support } : {})}
          options={def.options}
          {...(def.max ? { max: def.max } : {})}
          {...(def.exclusive ? { exclusive: def.exclusive } : {})}
          {...(def.limitNotice ? { limitNotice: def.limitNotice } : {})}
          selected={def.selected}
          onChange={(values) => onUpdate((s) => def.apply(s, values))}
          onNext={() => onAdvance()}
          onBack={onBack}
        />
      );

    case "note":
      return (
        <NoteScreen
          screenKey={def.key}
          headline={def.headline}
          {...(def.support ? { support: def.support } : {})}
          value={def.value}
          onSubmit={(value) => onAdvance((s) => def.apply(s, value))}
          onBack={onBack}
        />
      );

    default:
      return null;
  }
}
