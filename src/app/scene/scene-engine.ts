import { gsap } from 'gsap';
import { BoxGeometry, BufferAttribute, Color, Euler, Mesh, MeshBasicMaterial, PerspectiveCamera, Quaternion, Scene, Vector3, WebGLRenderer } from 'three';
import { BOX_HEIGHT_RATIO, CUBE_CENTERS_3D, CUBE_COLORS, CUBE_SHADE, ISO_TILT, LOGO_HEIGHT_3D } from './logo-geometry';

/**
 * Motor 3D da abertura: os sete cubos surgem, formam o símbolo e vão para o cabeçalho.
 *
 * É a única animação 3D do site. Quando termina, o motor é descartado e o canvas
 * some: nada fica rodando atrás do conteúdo.
 * Este arquivo é carregado sob demanda, para o Three.js não pesar no primeiro conteúdo.
 */

export interface EngineOptions {
  quality: 'completo' | 'medio';
  onFps?: (fps: number) => void;
}

export interface IntroOptions {
  /** Elemento do símbolo no cabeçalho: destino final dos cubos. */
  target: HTMLElement;
  /** O símbolo 3D chegou ao cabeçalho: hora de mostrar a marca em HTML. */
  onHandoff: () => void;
  onDone: () => void;
}

const FOV = 35;
const CAM_Z = 10;
const HALF_H = Math.tan((FOV * Math.PI) / 360) * CAM_Z; // meia altura visível em z = 0
const WHITE = new Color('#ffffff');
const EIXO_Y = new Vector3(0, 1, 0);

// Tempos da abertura, em segundos (total ≈ 1,6 s).
const ENTRADA_INICIO = 0.05;
const ENTRADA_INTERVALO = 0.06;
const ENTRADA_DURACAO = 0.42;
const VIAGEM_INICIO = 0.85;
const VIAGEM_DURACAO = 0.6;
const ENTREGA = 1.42;

interface Cube {
  mesh: Mesh;
  pos: Vector3;
  quat: Quaternion;
  scale: number;
}

export class SceneEngine {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  private readonly cubeGeo = createCubeGeometry();
  // Um material por cubo: cada um termina na sua cor do degradê da marca.
  private readonly materials = CUBE_COLORS.map(() => new MeshBasicMaterial({ vertexColors: true, color: '#ffffff' }));
  private readonly accents = CUBE_COLORS.map((cor) => new Color(cor.top));
  private readonly cubes: Cube[] = [];

  private readonly isoQuat = new Quaternion().setFromEuler(new Euler(ISO_TILT, Math.PI / 4, 0, 'XYZ'));
  private halfW = HALF_H;
  private width = 1;
  private height = 1;

  private intro: gsap.core.Timeline | null = null;
  private introTint = 0; // 0 = branco, 1 = cor da marca
  private raf = 0;
  private frames = 0;
  private fpsClock = 0;
  private disposed = false;

  private readonly tmpV = new Vector3();
  private readonly tmpQ = new Quaternion();
  private readonly forward = new Vector3(0, 0, -1);
  private readonly camPos = new Vector3(0, 0, CAM_Z);

  constructor(
    canvas: HTMLCanvasElement,
    private readonly options: EngineOptions,
  ) {
    const completo = options.quality === 'completo';
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: completo, powerPreference: 'high-performance' });
    // Limita a densidade de pixels para preservar desempenho.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, completo ? 2 : 1.5));
    this.camera.position.copy(this.camPos);

    for (let i = 0; i < 7; i++) {
      const mesh = new Mesh(this.cubeGeo, this.materials[i]);
      mesh.scale.setScalar(0);
      this.scene.add(mesh);
      this.cubes.push({ mesh, pos: new Vector3(), quat: this.isoQuat.clone(), scale: 0 });
    }

    this.resize();
    window.addEventListener('resize', this.resize);
    this.raf = requestAnimationFrame(this.frame);
  }

  // ── Abertura das sete caixinhas ────────────────────────────
  playIntro({ target, onHandoff, onDone }: IntroOptions): void {
    this.introTint = 0;
    this.applyTint();

    // Tamanho do símbolo no centro: pequeno e discreto.
    const centerPx = Math.min(132, Math.max(92, this.height * 0.14));
    const sCenter = this.pxToWorld(centerPx) / LOGO_HEIGHT_3D;

    const state = { move: 0 };
    const appear = this.cubes.map(() => ({ k: 0 }));
    // Ordem de entrada: do centro para fora.
    const order = [3, 0, 2, 5, 6, 4, 1];

    const place = () => {
      const rect = target.getBoundingClientRect();
      const header = this.screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const sHeader = this.pxToWorld(rect.height) / LOGO_HEIGHT_3D;
      const cx = header.x * state.move;
      const cy = header.y * state.move;
      const s = sCenter + (sHeader - sCenter) * state.move;

      this.cubes.forEach((cube, i) => {
        const k = appear[i].k;
        const [lx, ly] = CUBE_CENTERS_3D[i];
        // Cada cubo vem de um ponto um pouco mais afastado e mais ao fundo.
        const spread = 1 + (1 - k) * 1.4;
        cube.pos.set(cx + lx * s * spread, cy + ly * s * spread - (1 - k) * 0.25, -(1 - k) * 3);
        cube.scale = s * easeOutBack(k);
        this.lookQuat(cube.pos, cube.quat).multiply(this.isoQuat);
        if (k < 1) {
          this.tmpQ.setFromAxisAngle(EIXO_Y, (1 - k) * 1.3);
          cube.quat.multiply(this.tmpQ);
        }
      });
    };

    let handed = false;
    const tl = gsap.timeline({
      onUpdate: place,
      onComplete: () => {
        this.intro = null;
        onDone();
      },
    });
    // Os cubos surgem em sequência rápida e formam o símbolo.
    order.forEach((index, n) => {
      tl.to(appear[index], { k: 1, duration: ENTRADA_DURACAO, ease: 'power3.out' }, ENTRADA_INICIO + n * ENTRADA_INTERVALO);
    });
    // O símbolo vai para o cabeçalho e passa de branco para a cor da marca.
    tl.to(state, { move: 1, duration: VIAGEM_DURACAO, ease: 'power3.inOut' }, VIAGEM_INICIO);
    tl.to(this, { introTint: 1, duration: VIAGEM_DURACAO * 0.8, ease: 'power1.inOut', onUpdate: () => this.applyTint() }, VIAGEM_INICIO + 0.05);
    // A marca em HTML assume o lugar.
    tl.call(
      () => {
        if (!handed) {
          handed = true;
          onHandoff();
        }
      },
      undefined,
      ENTREGA,
    );
    tl.to({}, { duration: 0.18 });

    place();
    this.intro = tl;
  }

  /** Pular a abertura (clique ou tecla). */
  skipIntro(): void {
    this.intro?.progress(1);
  }

  private applyTint(): void {
    this.materials.forEach((material, i) => material.color.copy(WHITE).lerp(this.accents[i], this.introTint));
  }

  // ── Laço de renderização ───────────────────────────────────
  private readonly frame = (now: number): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);

    for (const cube of this.cubes) {
      cube.mesh.position.copy(cube.pos);
      cube.mesh.quaternion.copy(cube.quat);
      cube.mesh.scale.setScalar(cube.scale);
    }
    this.renderer.render(this.scene, this.camera);

    if (this.options.onFps) {
      this.frames++;
      if (now - this.fpsClock >= 500) {
        this.options.onFps(Math.round((this.frames * 1000) / (now - this.fpsClock)));
        this.frames = 0;
        this.fpsClock = now;
      }
    }
  };

  // ── Utilidades ─────────────────────────────────────────────
  /** Rotação que faz o cubo parecer igual ao do centro da tela, mesmo fora do eixo da câmera. */
  private lookQuat(position: Vector3, out: Quaternion): Quaternion {
    this.tmpV.copy(position).sub(this.camPos).normalize();
    return out.setFromUnitVectors(this.forward, this.tmpV);
  }

  private pxToWorld(px: number): number {
    return (px / this.height) * 2 * HALF_H;
  }

  private screenToWorld(x: number, y: number): { x: number; y: number } {
    return {
      x: ((x / this.width) * 2 - 1) * this.halfW,
      y: -((y / this.height) * 2 - 1) * HALF_H,
    };
  }

  private readonly resize = (): void => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.halfW = HALF_H * (this.width / this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
  };

  /** Libera a memória da GPU e os ouvintes de eventos. */
  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.intro?.kill();
    window.removeEventListener('resize', this.resize);
    this.cubeGeo.dispose();
    this.materials.forEach((material) => material.dispose());
    this.renderer.dispose();
  }
}

/** Cubo com o sombreamento chapado do símbolo: topo claro, esquerda média, direita escura. */
function createCubeGeometry(): BoxGeometry {
  const geo = new BoxGeometry(1, BOX_HEIGHT_RATIO, 1);
  // Ordem das faces do BoxGeometry: +x, -x, +y, -y, +z, -z (4 vértices cada).
  // Com o giro de 45°, as faces visíveis são +y (topo), -x (esquerda) e +z (direita).
  const shade = [0.7, CUBE_SHADE.left, CUBE_SHADE.top, 0.58, CUBE_SHADE.right, 0.7];
  const colors = new Float32Array(24 * 3);
  shade.forEach((value, face) => {
    for (let v = 0; v < 4; v++) colors.fill(value, (face * 4 + v) * 3, (face * 4 + v) * 3 + 3);
  });
  geo.setAttribute('color', new BufferAttribute(colors, 3));
  return geo;
}

const easeOutBack = (k: number): number => {
  const c = 1.4;
  return k >= 1 ? 1 : 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2;
};
