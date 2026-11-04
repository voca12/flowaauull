import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ProceduralBouquetRenderer } from '../../utils/proceduralBouquet';
import { FlowerTheme } from '../../types';
import { audioEngine } from '../../utils/audioSynth';

interface FlowerCanvasProps {
  theme: FlowerTheme;
  isPlaying: boolean;
  onAnimationComplete?: () => void;
  speedMultiplier?: number;
  onResetRef?: React.MutableRefObject<(() => void) | null>;
  onReplayRef?: React.MutableRefObject<(() => void) | null>;
}

export const FlowerCanvas: React.FC<FlowerCanvasProps> = ({
  theme,
  isPlaying,
  onAnimationComplete,
  speedMultiplier = 1.0,
  onResetRef,
  onReplayRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<ProceduralBouquetRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Growth animation timelines:
  // Growth time in seconds
  const growthTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Initialize renderer once
  if (!rendererRef.current) {
    rendererRef.current = new ProceduralBouquetRenderer();
  }

  // Reset animation to 0
  const resetAnimation = useCallback(() => {
    growthTimeRef.current = 0;
    setHasCompleted(false);
  }, []);

  // Replay animation
  const replayAnimation = useCallback(() => {
    growthTimeRef.current = 0;
    setHasCompleted(false);
    audioEngine.playClickSound();
  }, []);

  // Bind ref hooks for parent controls
  useEffect(() => {
    if (onResetRef) onResetRef.current = resetAnimation;
    if (onReplayRef) onReplayRef.current = replayAnimation;
  }, [onResetRef, onReplayRef, resetAnimation, replayAnimation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      if (w > 0 && h > 0) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    const TOTAL_STEM_DURATION = 3.5; // Stems grow in 3.5 seconds
    const TOTAL_BLOOM_DURATION = 5.0; // Flowers bloom from t=2.2 to t=7.2

    const renderLoop = (timestamp: number) => {
      if (!isMounted) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        growthTimeRef.current += deltaSec * speedMultiplier;
      }

      const elapsed = growthTimeRef.current;

      // Stem growth from 0.0 to 1.0 between t=0 and t=3.5
      const stemProgress = Math.min(1.0, elapsed / TOTAL_STEM_DURATION);

      // Bloom growth from 0.0 to 1.0 between t=2.2 and t=7.2
      const bloomProgress = Math.max(0.0, Math.min(1.0, (elapsed - 2.2) / TOTAL_BLOOM_DURATION));

      // Trigger sparkle sound and completion callback when bouquet reaches full bloom
      if (bloomProgress >= 1.0 && !hasCompleted) {
        setHasCompleted(true);
        audioEngine.playBloomSparkleSound();
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }

      // Logical dimensions for rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;

      if (logicalWidth > 0 && logicalHeight > 0) {
        rendererRef.current?.render(ctx, logicalWidth, logicalHeight, {
          stemProgress,
          bloomProgress,
          theme,
          renderMode: 'scanline',
          time: timestamp
        });
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
    };
  }, [isPlaying, speedMultiplier, theme, hasCompleted, onAnimationComplete]);

  // Click canvas for interactive chime sparkle
  const handleCanvasClick = () => {
    audioEngine.playBloomSparkleSound();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black select-none"
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-pointer"
        style={{
          touchAction: 'none'
        }}
        title="Click to spark blossoms ✨"
      />
    </div>
  );
};
