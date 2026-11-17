import { playersCopy } from "../copy";

type PhotoZoomSliderProps = {
  zoom: number;
  onZoom: (zoom: number) => void;
};

export function PhotoZoomSlider({ zoom, onZoom }: PhotoZoomSliderProps): React.JSX.Element {
  return (
    <label className="flex flex-col gap-1 text-xs font-bold tracking-wider text-muted uppercase">
      {playersCopy.photo.zoom}
      <input
        type="range"
        min={1}
        max={3}
        step={0.05}
        value={zoom}
        onChange={(event) => onZoom(Number(event.target.value))}
      />
    </label>
  );
}
