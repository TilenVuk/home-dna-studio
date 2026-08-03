import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { VisualChoiceCard } from "./VisualChoiceCard";
import { completeHomeKey, individualRoomKeys, roomOptions } from "./homeDnaData";
import type { RoomKey } from "./homeDnaTypes";

export function RoomSelection({
  selectedRooms,
  onChange,
  onBack,
  onNext,
}: {
  selectedRooms: RoomKey[];
  onChange: (rooms: RoomKey[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
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

  return (
    <div>
      <h1 className="display-lg max-w-[18ch]">Katere prostore želite urediti?</h1>
      <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
        Izberite en prostor, več prostorov ali celoten dom. Discovery bomo samodejno prilagodili
        obsegu vašega projekta.
      </p>

      <div
        role="group"
        aria-label="Izbira prostorov"
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {roomOptions.map((room) => (
          <VisualChoiceCard
            key={room.key}
            image={room.image}
            title={room.title}
            description={room.description}
            multiSelect
            selected={selectedRooms.includes(room.key)}
            onSelect={() => toggle(room.key)}
          />
        ))}
      </div>

      <DiscoveryNavigation
        onBack={onBack}
        onNext={onNext}
        showNext={selectedRooms.length > 0}
        nextDisabled={selectedRooms.length === 0}
      />
    </div>
  );
}
