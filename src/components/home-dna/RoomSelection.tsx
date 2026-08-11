import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { VisualChoiceCard } from "./VisualChoiceCard";
import {
  availableIndividualRoomKeys,
  availableRoomOptions,
  childrenRoomKey,
  completeHomeKey,
} from "./homeDnaData";
import { uiText } from "./homeDnaUiI18n";
import type { RoomKey } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";

export function RoomSelection({
  selectedRooms,
  onChange,
  onBack,
  onNext,
  childrenCount,
  childrenCountPlus,
  locale = "sl",
}: {
  selectedRooms: RoomKey[];
  onChange: (rooms: RoomKey[]) => void;
  onBack: () => void;
  onNext: () => void;
  childrenCount?: number;
  childrenCountPlus?: boolean;
  locale?: Locale;
}) {
  const individualRoomKeys = availableIndividualRoomKeys(childrenCount);
  const roomOptions = availableRoomOptions(childrenCount);
  const copy =
    locale === "hr"
      ? {
          headline: "Koje prostore želite urediti?",
          support:
            "Odaberite jedan prostor, više prostora ili cijeli dom. Discovery ćemo automatski prilagoditi opsegu vašeg projekta.",
          aria: "Odabir prostora",
        }
      : locale === "en"
        ? {
            headline: "Which spaces would you like to design?",
            support:
              "Choose one room, several rooms or the whole home. Discovery will automatically adapt to your project scope.",
            aria: "Room selection",
          }
        : {
            headline: "Katere prostore želite urediti?",
            support:
              "Izberite en prostor, več prostorov ali celoten dom. Discovery bomo samodejno prilagodili obsegu vašega projekta.",
            aria: "Izbira prostorov",
          };

  const toggle = (key: RoomKey) => {
    const isSelected = selectedRooms.includes(key);
    if (key === completeHomeKey) {
      onChange(isSelected ? [] : [completeHomeKey, ...individualRoomKeys]);
      return;
    }
    const nextIndividual = isSelected
      ? selectedRooms.filter((r) => r !== key && r !== completeHomeKey)
      : [...selectedRooms.filter((r) => r !== completeHomeKey), key];
    const individualsOnly = nextIndividual.filter((r) => r !== completeHomeKey);
    const allSelected = individualRoomKeys.every((r) => individualsOnly.includes(r));
    onChange(allSelected ? [completeHomeKey, ...individualRoomKeys] : individualsOnly);
  };

  const childrenDescription = (quantity: string) =>
    locale === "hr"
      ? `Odabir znači ${quantity} ${childrenCount === 1 ? "dječju sobu" : "dječje sobe"}; procjena investicije automatski se množi brojem djece.`
      : locale === "en"
        ? `This selection represents ${quantity} ${childrenCount === 1 ? "children's room" : "children's rooms"}; the investment estimate is automatically multiplied by the number of children.`
        : `Izbor pomeni ${quantity} ${childrenCount === 1 ? "otroško sobo" : "otroške sobe"}; ocena investicije se samodejno pomnoži s številom otrok.`;

  return (
    <div>
      <h1 className="display-lg max-w-[18ch]">{copy.headline}</h1>
      <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
        {copy.support}
      </p>
      <div
        role="group"
        aria-label={copy.aria}
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {roomOptions.map((room) => {
          const isChildrenRoom = room.key === childrenRoomKey;
          const quantity = childrenCount ? `${childrenCount}${childrenCountPlus ? "+" : ""}` : "";
          const title = uiText(locale, room.title) ?? room.title;
          return (
            <VisualChoiceCard
              key={room.key}
              image={room.image}
              title={isChildrenRoom && quantity ? `${title} (${quantity})` : title}
              description={
                isChildrenRoom && quantity
                  ? childrenDescription(quantity)
                  : (uiText(locale, room.description) ?? room.description)
              }
              multiSelect
              selected={selectedRooms.includes(room.key)}
              onSelect={() => toggle(room.key)}
            />
          );
        })}
      </div>
      <DiscoveryNavigation
        locale={locale}
        onBack={onBack}
        onNext={onNext}
        showNext={selectedRooms.length > 0}
        nextDisabled={selectedRooms.length === 0}
      />
    </div>
  );
}
