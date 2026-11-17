"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

import { clampCoverOffset, coverScale, type CoverCropView } from "../domain/cover-crop";

const VIEWPORT = 280;

type DragStart = { x: number; y: number; ox: number; oy: number };

/** Crop math and drag live together so the square stays filled while zooming. */
// eslint-disable-next-line max-lines-per-function -- one crop session; splitting loses the shared drag ref
export function usePhotoCropSession(source: Blob) {
  const previewUrl = useMemo(() => URL.createObjectURL(source), [source]);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<DragStart | null>(null);

  useEffect(() => () => URL.revokeObjectURL(previewUrl), [previewUrl]);

  const view: CoverCropView = {
    imageWidth: size.width,
    imageHeight: size.height,
    viewport: VIEWPORT,
    zoom,
    offsetX: offset.x,
    offsetY: offset.y,
  };
  const clamped = clampCoverOffset(view);
  const scale = coverScale({ ...view, ...clamped });

  return {
    previewUrl,
    viewport: VIEWPORT,
    width: size.width * scale,
    height: size.height * scale,
    left: (VIEWPORT - size.width * scale) / 2 + clamped.offsetX,
    top: (VIEWPORT - size.height * scale) / 2 + clamped.offsetY,
    zoom,
    cropView: {
      viewport: VIEWPORT,
      zoom,
      offsetX: clamped.offsetX,
      offsetY: clamped.offsetY,
    },
    onImageLoad: (width: number, height: number) => setSize({ width, height }),
    onZoom: (nextZoom: number) => {
      setZoom(nextZoom);
      const next = clampCoverOffset({ ...view, zoom: nextZoom });
      setOffset({ x: next.offsetX, y: next.offsetY });
    },
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = {
        x: event.clientX,
        y: event.clientY,
        ox: clamped.offsetX,
        oy: clamped.offsetY,
      };
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (!drag.current) return;
      const next = clampCoverOffset({
        ...view,
        offsetX: drag.current.ox + (event.clientX - drag.current.x),
        offsetY: drag.current.oy + (event.clientY - drag.current.y),
      });
      setOffset({ x: next.offsetX, y: next.offsetY });
    },
    onPointerUp: () => {
      drag.current = null;
    },
  };
}
