import { FlowerTheme } from '../types';

/**
 * High-fidelity Procedural Lily Bouquet Scanline Engine
 * Faithfully matches the horizontal luminous scanlines & particle graphics
 * from the reference video.
 */

export interface BouquetConfig {
  stemProgress: number;   // 0.0 to 1.0 (growth of stems & leaves)
  bloomProgress: number;  // 0.0 to 1.0 (unfurling of buds into full bloom)
  theme: FlowerTheme;
  renderMode?: 'scanline';
  time: number;
}

interface Point2D {
  x: number;
  y: number;
}

interface FlowerConfig {
  id: string;
  x: number;
  y: number;
  scale: number;
  stemStartX: number;
  stemStartY: number;
  stemCtrlX: number;
  stemCtrlY: number;
  rotation: number;
  bloomDelay: number;
  bloomSpeed: number;
  isBud: boolean;
  type: 'center' | 'left' | 'right' | 'bottom' | 'small' | 'bud';
}

interface LeafConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  ctrlX: number;
  ctrlY: number;
  width: number;
  delay: number;
}

export class ProceduralBouquetRenderer {
  private particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

  // Flowers matching the exact composition in the reference video
  private readonly flowers: FlowerConfig[] = [
    // 1. Center Red/Crimson Lily (Major focal point)
    {
      id: 'center',
      x: 0,
      y: -50,
      scale: 1.05,
      stemStartX: 0,
      stemStartY: 270,
      stemCtrlX: 8,
      stemCtrlY: 110,
      rotation: 0.15,
      bloomDelay: 0.15,
      bloomSpeed: 1.25,
      isBud: false,
      type: 'center'
    },
    // 2. Left Magenta / Wine Lily
    {
      id: 'left',
      x: -105,
      y: -10,
      scale: 0.95,
      stemStartX: -15,
      stemStartY: 270,
      stemCtrlX: -70,
      stemCtrlY: 130,
      rotation: -0.3,
      bloomDelay: 0.25,
      bloomSpeed: 1.2,
      isBud: false,
      type: 'left'
    },
    // 3. Right Silver-White Lily
    {
      id: 'right',
      x: 105,
      y: 5,
      scale: 0.98,
      stemStartX: 15,
      stemStartY: 270,
      stemCtrlX: 75,
      stemCtrlY: 140,
      rotation: 0.35,
      bloomDelay: 0.32,
      bloomSpeed: 1.15,
      isBud: false,
      type: 'right'
    },
    // 4. Lower-Center Peach / Coral Lily
    {
      id: 'bottom',
      x: -8,
      y: 95,
      scale: 0.92,
      stemStartX: 0,
      stemStartY: 270,
      stemCtrlX: -10,
      stemCtrlY: 190,
      rotation: 0.5,
      bloomDelay: 0.42,
      bloomSpeed: 1.1,
      isBud: false,
      type: 'bottom'
    },
    // 5. Lower-Left Golden Lily
    {
      id: 'lower-left',
      x: -125,
      y: 90,
      scale: 0.82,
      stemStartX: -20,
      stemStartY: 270,
      stemCtrlX: -85,
      stemCtrlY: 180,
      rotation: -0.45,
      bloomDelay: 0.5,
      bloomSpeed: 1.0,
      isBud: false,
      type: 'small'
    },
    // 6. Right-Side Accent Lily (partially bloomed)
    {
      id: 'mid-right',
      x: 145,
      y: -40,
      scale: 0.78,
      stemStartX: 22,
      stemStartY: 270,
      stemCtrlX: 95,
      stemCtrlY: 110,
      rotation: 0.6,
      bloomDelay: 0.4,
      bloomSpeed: 1.0,
      isBud: false,
      type: 'center'
    },
    // 7. Top-Center Upright Lily Bud
    {
      id: 'bud-top-center',
      x: 18,
      y: -195,
      scale: 0.7,
      stemStartX: 5,
      stemStartY: 270,
      stemCtrlX: 12,
      stemCtrlY: 30,
      rotation: 0.05,
      bloomDelay: 0.8,
      bloomSpeed: 0.4,
      isBud: true,
      type: 'bud'
    },
    // 8. Top-Left Upright Lily Bud
    {
      id: 'bud-top-left',
      x: -65,
      y: -180,
      scale: 0.72,
      stemStartX: -10,
      stemStartY: 270,
      stemCtrlX: -45,
      stemCtrlY: 40,
      rotation: -0.2,
      bloomDelay: 0.75,
      bloomSpeed: 0.4,
      isBud: true,
      type: 'bud'
    },
    // 9. Top-Right Golden Bud
    {
      id: 'bud-top-right',
      x: 120,
      y: -150,
      scale: 0.75,
      stemStartX: 18,
      stemStartY: 270,
      stemCtrlX: 80,
      stemCtrlY: 60,
      rotation: 0.3,
      bloomDelay: 0.7,
      bloomSpeed: 0.45,
      isBud: true,
      type: 'bud'
    },
    // 10. Far-Left Slender Bud
    {
      id: 'bud-far-left',
      x: -160,
      y: -75,
      scale: 0.65,
      stemStartX: -25,
      stemStartY: 270,
      stemCtrlX: -110,
      stemCtrlY: 90,
      rotation: -0.5,
      bloomDelay: 0.65,
      bloomSpeed: 0.5,
      isBud: true,
      type: 'bud'
    }
  ];

  // Long arching lily foliage at the base
  private readonly leaves: LeafConfig[] = [
    { startX: -5, startY: 260, endX: -165, endY: 215, ctrlX: -95, ctrlY: 265, width: 22, delay: 0.08 },
    { startX: 5, startY: 260, endX: 175, endY: 220, ctrlX: 105, ctrlY: 270, width: 22, delay: 0.1 },
    { startX: -15, startY: 265, endX: -205, endY: 245, ctrlX: -115, ctrlY: 290, width: 24, delay: 0.12 },
    { startX: 15, startY: 265, endX: 210, endY: 250, ctrlX: 125, ctrlY: 295, width: 24, delay: 0.14 },
    { startX: -8, startY: 240, endX: -125, endY: 160, ctrlX: -80, ctrlY: 210, width: 18, delay: 0.18 },
    { startX: 8, startY: 240, endX: 130, endY: 165, ctrlX: 85, ctrlY: 215, width: 18, delay: 0.2 },
    { startX: 0, startY: 270, endX: -75, endY: 230, ctrlX: -35, ctrlY: 275, width: 16, delay: 0.05 },
    { startX: 2, startY: 270, endX: 80, endY: 235, ctrlX: 40, ctrlY: 275, width: 16, delay: 0.06 },
    { startX: -10, startY: 200, endX: -145, endY: 120, ctrlX: -90, ctrlY: 160, width: 15, delay: 0.24 },
    { startX: 12, startY: 195, endX: 150, endY: 125, ctrlX: 95, ctrlY: 155, width: 15, delay: 0.26 }
  ];

  constructor() {
    this.initDustParticles(80);
  }

  private initDustParticles(count: number) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 700,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.25 - Math.random() * 0.45,
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6
      });
    }
  }

  /**
   * Main render execution
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: BouquetConfig
  ) {
    const { stemProgress, bloomProgress, theme, time } = config;

    // 1. Deep solid black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    const centerX = width / 2;
    // Scale dynamically to fit canvas nicely on desktop and mobile
    const baseScale = Math.min(width / 440, height / 700, 1.12);
    const centerY = height * 0.54;

    ctx.translate(centerX, centerY);
    ctx.scale(baseScale, baseScale);

    // 2. Ambient drifting dust particles
    this.renderDust(ctx, theme, time, stemProgress);

    // 3. Stems growing upward
    if (stemProgress > 0.01) {
      this.renderStems(ctx, config);
    }

    // 4. Base & foliage leaves
    if (stemProgress > 0.1) {
      this.renderLeaves(ctx, config);
    }

    // 5. Buds & Lily Flowers
    if (stemProgress > 0.25) {
      this.renderFlowers(ctx, config);
    }

    ctx.restore();
  }

  private renderDust(
    ctx: CanvasRenderingContext2D,
    theme: FlowerTheme,
    time: number,
    activeAmount: number
  ) {
    if (activeAmount < 0.15) return;
    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx + Math.sin(time * 0.002 + i) * 0.15;
      p.y += p.vy;

      if (p.y < -380) {
        p.y = 320;
        p.x = (Math.random() - 0.5) * 500;
      }

      const dustColor = theme.palette.dust[i % theme.palette.dust.length];
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.003 + i * 2);
      ctx.fillStyle = dustColor;
      ctx.globalAlpha = p.alpha * pulse * Math.min(1, activeAmount * 1.5);
      ctx.fillRect(p.x, p.y, p.size * 1.6, 1.2);
    }
    ctx.restore();
  }

  private renderStems(ctx: CanvasRenderingContext2D, config: BouquetConfig) {
    const { stemProgress, theme } = config;
    ctx.save();

    for (const f of this.flowers) {
      const growth = Math.min(1, Math.max(0, (stemProgress - 0.03) / 0.65));
      if (growth <= 0) continue;

      const steps = Math.floor(120 * growth);
      const stemColors = theme.palette.stems;

      for (let s = 0; s < steps; s++) {
        const t = s / 120;
        const invT = 1 - t;
        const curX = invT * invT * f.stemStartX + 2 * invT * t * f.stemCtrlX + t * t * f.x;
        const curY = invT * invT * f.stemStartY + 2 * invT * t * f.stemCtrlY + t * t * f.y;

        const sw = Math.max(2.8, (1 - t * 0.4) * 6.0);
        const colIdx = Math.floor(t * stemColors.length) % stemColors.length;

        ctx.fillStyle = stemColors[colIdx];
        ctx.globalAlpha = 0.95;

        if (s % 2 === 0) {
          ctx.fillRect(curX - sw / 2, curY, sw, 1.4);

          // Climbing node dashes
          if (s % 4 === 0) {
            ctx.fillStyle = '#a7e8bd';
            ctx.fillRect(curX - 0.8, curY, 1.6, 1.4);
          }
        }
      }
    }
    ctx.restore();
  }

  private renderLeaves(ctx: CanvasRenderingContext2D, config: BouquetConfig) {
    const { stemProgress, theme } = config;
    ctx.save();

    for (const leaf of this.leaves) {
      const leafGrowth = Math.min(1, Math.max(0, (stemProgress - leaf.delay) / 0.5));
      if (leafGrowth <= 0) continue;

      const steps = Math.floor(70 * leafGrowth);
      const leafColors = theme.palette.leaves;

      for (let s = 0; s < steps; s++) {
        const t = s / 70;
        const invT = 1 - t;
        const curX = invT * invT * leaf.startX + 2 * invT * t * leaf.ctrlX + t * t * leaf.endX;
        const curY = invT * invT * leaf.startY + 2 * invT * t * leaf.ctrlY + t * t * leaf.endY;

        const taper = Math.sin(t * Math.PI);
        const w = leaf.width * taper * leafGrowth;

        if (s % 2 === 0 && w > 0.5) {
          const colIdx = Math.floor(t * leafColors.length) % leafColors.length;
          ctx.fillStyle = leafColors[colIdx];
          ctx.globalAlpha = 0.9;
          ctx.fillRect(curX - w / 2, curY, w, 1.4);

          // Midrib vein
          ctx.fillStyle = '#b7e4c7';
          ctx.fillRect(curX - 0.7, curY, 1.4, 1.4);
        }
      }
    }
    ctx.restore();
  }

  private renderFlowers(ctx: CanvasRenderingContext2D, config: BouquetConfig) {
    const { bloomProgress, theme, time } = config;

    for (const f of this.flowers) {
      let localBloom = 0;
      if (bloomProgress >= f.bloomDelay) {
        localBloom = Math.min(1, (bloomProgress - f.bloomDelay) * f.bloomSpeed);
      }

      ctx.save();
      // Gentle natural breathing / sway
      const swayX = Math.sin(time * 0.0015 + f.x * 0.04) * 1.5;
      const swayY = Math.cos(time * 0.0018 + f.y * 0.04) * 1.0;
      const fx = f.x + swayX;
      const fy = f.y + swayY;

      if (f.isBud || localBloom <= 0.05) {
        // Render as tight oval bud
        this.renderBud(ctx, fx, fy, f.scale, theme, localBloom);
      } else {
        // Render as scanline lily
        this.renderLily(ctx, fx, fy, f, theme, localBloom);
      }

      ctx.restore();
    }
  }

  private renderBud(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    scale: number,
    theme: FlowerTheme,
    bloom: number
  ) {
    const colors = theme.palette.buds;
    const budH = 56 * scale;
    const budW = 28 * scale * (1 + bloom * 0.3);
    const numRows = Math.floor(budH / 2.0);

    for (let r = -numRows / 2; r <= numRows / 2; r++) {
      const yRel = r * 2.0;
      const normY = (yRel + budH / 2) / budH;
      const contour = Math.sin(normY * Math.PI) * Math.pow(1.0 - normY * 0.35, 0.7);
      const rw = budW * contour;

      if (rw > 1) {
        const sy = by + yRel;
        const colIdx = normY < 0.6 ? 0 : 1;
        ctx.fillStyle = colors[colIdx % colors.length];
        ctx.globalAlpha = 0.92;

        ctx.fillRect(bx - rw / 2, sy, rw / 2 - 1, 1.4);
        ctx.fillRect(bx + 1, sy, rw / 2 - 1, 1.4);

        if (normY > 0.8) {
          ctx.fillStyle = theme.palette.stems[1];
          ctx.fillRect(bx - rw / 2, sy, rw, 1.4);
        }
      }
    }
  }

  /**
   * Scanline Lily Blossom
   */
  private renderLily(
    ctx: CanvasRenderingContext2D,
    fx: number,
    fy: number,
    f: FlowerConfig,
    theme: FlowerTheme,
    bloom: number
  ) {
    let colors: string[];
    switch (f.type) {
      case 'center':
        colors = theme.palette.centerLily;
        break;
      case 'left':
        colors = theme.palette.leftLily;
        break;
      case 'right':
        colors = theme.palette.rightLily;
        break;
      case 'bottom':
        colors = theme.palette.bottomLily;
        break;
      default:
        colors = theme.palette.smallLily;
    }

    // 6 petals: outer 3, inner 3
    const petalOrder = [0, 2, 4, 1, 3, 5];

    for (const pi of petalOrder) {
      const isInner = pi % 2 === 1;
      const baseAng = -Math.PI / 2 + pi * (Math.PI / 3) + (isInner ? 0.06 : 0) + f.rotation;

      // When bloom is starting, petals are tight & short; as bloom advances, they fan out
      const plen = (isInner ? 85 : 98) * f.scale * (0.35 + bloom * 0.65);
      const pwidth = (isInner ? 44 : 52) * f.scale * (0.2 + bloom * 0.8);

      const poly = this.getPetalPolygon(fx, fy, baseAng, plen, pwidth);
      this.fillPolygonScanlines(ctx, poly, colors, fx, fy, 2.0);
    }

    // Radiating Stamens with Glowing Anthers
    if (bloom > 0.25) {
      this.renderStamens(ctx, fx, fy, f.scale, f.rotation, theme.palette.anthers, bloom);
    }
  }

  private getPetalPolygon(
    fx: number,
    fy: number,
    baseAng: number,
    plen: number,
    pwidth: number
  ): Point2D[] {
    const pts: Point2D[] = [];
    const N = 25;
    const cosA = Math.cos(baseAng);
    const sinA = Math.sin(baseAng);
    const nx = -sinA;
    const ny = cosA;

    // Right edge
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const wf = t < 0.45
        ? Math.pow(Math.sin((t / 0.45) * (Math.PI / 2)), 0.85)
        : Math.pow(Math.cos(((t - 0.45) / 0.55) * (Math.PI / 2)), 0.9);
      const dist = t * plen;
      const wCurr = (pwidth * wf) / 2;
      pts.push({
        x: fx + dist * cosA + wCurr * nx,
        y: fy + dist * sinA + wCurr * ny
      });
    }

    // Left edge
    for (let i = N; i >= 0; i--) {
      const t = i / N;
      const wf = t < 0.45
        ? Math.pow(Math.sin((t / 0.45) * (Math.PI / 2)), 0.85)
        : Math.pow(Math.cos(((t - 0.45) / 0.55) * (Math.PI / 2)), 0.9);
      const dist = t * plen;
      const wCurr = (pwidth * wf) / 2;
      pts.push({
        x: fx + dist * cosA - wCurr * nx,
        y: fy + dist * sinA - wCurr * ny
      });
    }

    return pts;
  }

  /**
   * Horizontal scanline polygon rasterizer
   */
  private fillPolygonScanlines(
    ctx: CanvasRenderingContext2D,
    pts: Point2D[],
    colors: string[],
    fx: number,
    fy: number,
    yStep = 2.0
  ) {
    if (pts.length < 3) return;

    let ymin = 1e9;
    let ymax = -1e9;
    for (let i = 0; i < pts.length; i++) {
      if (pts[i].y < ymin) ymin = pts[i].y;
      if (pts[i].y > ymax) ymax = pts[i].y;
    }

    const numPts = pts.length;
    let currY = Math.ceil(ymin);

    while (currY <= ymax) {
      const nodes: number[] = [];
      let j = numPts - 1;
      for (let i = 0; i < numPts; i++) {
        const p1 = pts[i];
        const p2 = pts[j];
        if ((p1.y < currY && p2.y >= currY) || (p2.y < currY && p1.y >= currY)) {
          const nodeX = p1.x + ((currY - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
          nodes.push(nodeX);
        }
        j = i;
      }

      nodes.sort((a, b) => a - b);

      for (let k = 0; k < nodes.length; k += 2) {
        if (k + 1 < nodes.length) {
          const x1 = nodes[k];
          const x2 = nodes[k + 1];
          if (x2 - x1 >= 0.5) {
            const midX = (x1 + x2) / 2;
            const dist = Math.hypot(midX - fx, currY - fy);
            const t = Math.min(1, Math.max(0, dist / 110));
            const cIdx = Math.min(colors.length - 1, Math.floor(t * colors.length));
            const col = colors[cIdx];

            ctx.fillStyle = col;
            ctx.globalAlpha = 0.94;
            ctx.fillRect(x1, currY, x2 - x1, 1.4);

            // Stippled ASCII-style highlight down the midrib
            if (Math.floor(currY) % 4 === 0) {
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = 0.55;
              ctx.fillRect(midX - 1, currY, 2, 1.4);
            }
          }
        }
      }
      currY += yStep;
    }
  }

  private renderStamens(
    ctx: CanvasRenderingContext2D,
    fx: number,
    fy: number,
    scale: number,
    rot: number,
    antherColor: string,
    bloom: number
  ) {
    ctx.save();
    const stamenCount = 6;
    const len = 30 * scale * bloom;

    for (let si = 0; si < stamenCount; si++) {
      const sang = si * (Math.PI / 3) + 0.3 + rot;
      const stipX = fx + Math.cos(sang) * len;
      const stipY = fy + Math.sin(sang) * len;

      ctx.strokeStyle = '#b7e4c7';
      ctx.lineWidth = 1.3;
      ctx.globalAlpha = 0.85;

      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(stipX, stipY);
      ctx.stroke();

      // Horizontal glowing pollen anther
      ctx.fillStyle = antherColor;
      ctx.globalAlpha = 0.95;
      ctx.fillRect(stipX - 4.5, stipY - 1.2, 9, 2.4);

      // Bright white stippled core
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.8;
      ctx.fillRect(stipX - 1.2, stipY - 0.6, 2.4, 1.2);
    }

    ctx.restore();
  }
}

