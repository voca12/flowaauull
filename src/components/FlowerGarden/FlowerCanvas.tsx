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
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    // Handle high DPI crisp canvas
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const TOTAL_STEM_DURATION = 3.5; // Stems grow in 3.5 seconds
    const TOTAL_BLOOM_DURATION = 5.0; // Flowers bloom from t=2.8 to t=7.8

    const renderLoop = (timestamp: number) => {
      if (!isMounted) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        growthTimeRef.current += deltaSec * speedMultiplier;
      }

      const elapsed = growthTimeRef.current;

      // Calculate progress values:
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

      // Call procedural bouquet renderer
      rendererRef.current?.render(ctx, logicalWidth, logicalHeight, {
        stemProgress,
        bloomProgress,
        theme,
        renderMode: 'scanline',
        time: timestamp
      });

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, speedMultiplier, theme, hasCompleted, onAnimationComplete]);

  // Click canvas for interactive chime sparkle
  const handleCanvasClick = () => {
    audioEngine.playBloomSparkleSound();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-pointer transition-opacity duration-500"
        style={{
          touchAction: 'none'
        }}
        title="Click to spark blossoms ✨"
      />
    </div>
  );
};
