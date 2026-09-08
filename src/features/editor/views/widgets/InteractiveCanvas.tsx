import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ZoomIn, RotateCw, Move, Sparkles } from 'lucide-react';

interface InteractiveCanvasProps {
  imageSrc: string;
  isSticker: boolean;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  onTransformChange: (scale: number, rotation: number, offsetX: number, offsetY: number) => void;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  imageSrc,
  isSticker,
  scale,
  rotation,
  offsetX,
  offsetY,
  onTransformChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialOffset, setInitialOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialOffset({ x: offsetX, y: offsetY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    // Scale delta down slightly for fine control
    const nextX = Math.round(initialOffset.x + deltaX * 0.8);
    const nextY = Math.round(initialOffset.y + deltaY * 0.8);
    onTransformChange(scale, rotation, nextX, nextY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignored
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    const nextScale = Math.min(3.0, Math.max(0.4, Number((scale + zoomDelta).toFixed(2))));
    onTransformChange(nextScale, rotation, offsetX, offsetY);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Interactive Drag & Preview Box */}
      <div
        ref={containerRef}
        className="canvas-preview-container"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        title="Drag to reposition, scroll to zoom"
      >
        <div className="canvas-cell-frame">
          {/* Top-Left Date Preview */}
          <div style={{ position: 'absolute', top: 8, left: 10, fontSize: 11, fontWeight: 800, opacity: 0.6 }}>
            PREVIEW
          </div>

          {imageSrc ? (
            <div className="cell-visual-container">
              <div
                className="canvas-sticker-object"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: isSticker ? 'auto' : '100%',
                  height: isSticker ? 'auto' : '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {isSticker ? (
                  <img
                    src={imageSrc}
                    alt="Sticker Preview"
                    style={{
                      maxWidth: '125px',
                      maxHeight: '125px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt=""
                      className="cell-photo-ambient-blur"
                      aria-hidden="true"
                    />
                    <img
                      src={imageSrc}
                      alt="Photo Preview"
                      className="cell-full-photo"
                      style={{
                        pointerEvents: 'none',
                      }}
                    />
                    <div className="cell-photo-overlay" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: '12px',
              }}
            >
              No Sticker Selected
            </div>
          )}
        </div>
      </div>

      {/* Control Sliders: Zoom, Rotate, Reset */}
      <div className="canvas-controls-bar">
        {/* Scale Zoom Slider */}
        <div className="control-item" style={{ flex: 1, minWidth: '140px' }}>
          <ZoomIn size={14} />
          <span style={{ minWidth: '40px' }}>{Math.round(scale * 100)}%</span>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={scale}
            onChange={(e) =>
              onTransformChange(parseFloat(e.target.value), rotation, offsetX, offsetY)
            }
            className="range-slider"
            style={{ flex: 1 }}
          />
        </div>

        {/* 360 Rotation Slider */}
        <div className="control-item" style={{ flex: 1, minWidth: '140px' }}>
          <RotateCw size={14} />
          <span style={{ minWidth: '36px' }}>{rotation}°</span>
          <input
            type="range"
            min="-180"
            max="180"
            step="2"
            value={rotation}
            onChange={(e) =>
              onTransformChange(scale, parseInt(e.target.value, 10), offsetX, offsetY)
            }
            className="range-slider"
            style={{ flex: 1 }}
          />
        </div>

        {/* Reset Offsets */}
        <button
          className="pill-button"
          onClick={() => onTransformChange(1.0, 0, 0, 0)}
          style={{ padding: '4px 10px', fontSize: '11px' }}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
