# CardioVision UI Redesign Plan

## Context
The current CardioVision app has a dark neon/glassmorphism aesthetic with animated gradients, simulated YOLOv8 backend, and inconsistent micro-interactions. The user wants a premium Apple + Tesla-inspired dashboard with: clean flat colors (no gradients), real API integration, interactive Predict page, smooth spring-based animations, and refined typography/spacing.

---

## Part 1: Design System

### Color Palette (Flat, Muted)
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#FAFAFA` | Page background |
| Surface | `#FFFFFF` | Cards |
| Gray | `#F5F5F7` | Section backgrounds |
| Text Primary | `#1D1D1F` | Headings, body |
| Text Secondary | `#6E6E73` | Subtitles, captions |
| Text Tertiary | `#86868B` | Placeholders |
| Border | `#D2D2D7` | Dividers, card borders |
| Accent | `#0071E3` | Primary actions, links |
| Success | `#34C759` | Mild severity |
| Warning | `#FF9500` | Moderate severity |
| Danger | `#FF3B30` | Severe severity |

### Typography
- Font: Inter (already in use)
- Hero H1: 600 weight, 48px, tracking -0.02em
- Section H2: 600 weight, 32px
- Card H3: 500 weight, 20px
- Body: 400 weight, 16px, line-height 1.5
- Caption: 400 weight, 14px

### Motion
- Page transitions: `spring(1, 100, 10)`, 300ms
- Card hover: `spring(1, 200, 20)` scale 1.01
- Button press: `spring(1, 300, 30)` scale 0.97
- Stagger delay: 50-75ms per item
- Confidence bar: 800ms easeOut fill animation

---

## Part 2: Files & Order of Changes

### Step 1: `tailwind.config.js`
- Replace `medical` and `neon` color scales with flat `apple` palette
- Add `apple` shadow utilities (card, elevated, modal)
- Remove custom `glow`, `slide-up`, `fade-in` animations (keep `pulse-slow`)

### Step 2: `src/styles/index.css`
- Remove: `animated-bg`, `glass-card`, `glass-card-hover`, `neon-glow`, `neon-border`, `gradient-text`, `gradientShift`, `pulse-glow`, `shimmer`, `float`, `float-rotate`, `breathe-glow`, `btn-primary` (gradient version), dark scrollbar, severity badges (neon versions)
- Replace body background with `#FAFAFA`
- Add severity pill badges (flat colors)
- Add page-enter animation (simple opacity + translateY)

### Step 3: `components/Layout.jsx`
- Remove `animated-bg` class
- Add `AnimatePresence` page transitions with `motion.div` wrapper
- Change background to `bg-apple-bg`

### Step 4: `components/Navbar.jsx`
- Remove `glass-card` and `gradient-text neon-glow`
- Solid white background, 1px bottom border
- Replace emoji icons with plain text nav items
- Replace `layoutId` active pill with 2px bottom border in accent blue
- Change hover from neon glow to subtle `bg-apple-gray` + `text-apple-text`
- Mobile menu: white background, clean list

### Step 5: `components/Footer.jsx`
- Solid white background, 1px top border
- Plain dark text, no gradient text
- Social icons: subtle gray circles → accent blue on hover

### Step 6: `backend/main.py`
- Import `YOLO` from `ultralytics`
- Add global `_model` variable with lazy-loading `get_model()` function
- Replace `simulate_yolo_detection()` with `run_yolo_inference()` that runs real YOLOv8
- Keep `generate_segmentation_mask` and `generate_gradcam_heatmap` (already implemented)
- Use `asyncio.to_thread()` for async inference

### Step 7: `pages/Home.jsx`
- Hero: white background, no animated blobs, plain dark text
- Stats cards: white background, 1px border, flat text (no gradient-text)
- Feature cards: white bg, 1px border, icon in `#F5F5F7` circle (no gradient bg)
- Hover: subtle shadow increase + scale 1.01 (spring), NOT neon border glow
- CTA: `#F5F5F7` background, no glassmorphism

### Step 8: `pages/Predict.jsx`
**Major redesign — most interactive page:**
- Upload zone: dashed `#D2D2D7` border, `#F5F5F7` on drag-over, `#0071E3` border
- Upload icon in `#86868B`
- Clean white image preview card with 1px border
- **Processing stages**: "Uploading..." → "Analyzing..." → "Complete" with checkmarks/spinners
- Confidence bar: solid `#0071E3` fill, 4px height, animates 0→value over 800ms
- Severity badges: flat pill style (green/amber/red backgrounds)
- Toggle buttons: clean pill toggle (white bg, 1px border)
- Metrics grid: white cards with 1px border
- Results stagger in with 50ms delays
- Add "Try Another" button after results
- XAI section: clean white cards, no glassmorphism

### Step 9: `pages/ModelComparison.jsx`
- White cards, 1px border
- Charts: `#0071E3` for primary bars, `#86868B` for secondary (no gradient fills)
- Best model indicator: small blue pill badge
- Toggle between Detection/Segmentation: clean pill toggle

### Step 10: `pages/Results.jsx`
- White page background
- Image cards: white bg, 1px border, subtle scale(1.02) on hover
- Failure case cards: 1px border with `#FF3B30` at 20% opacity
- Stats: icon in `#0071E3`, number in `#1D1D1F`

### Step 11: `pages/Research.jsx`
- White sections with `#FFFFFF` cards
- Section icons: `#0071E3` icon on `#F5F5F7` circle (no gradient)
- Body text `#1D1D1F`, line-height 1.7

### Step 12: `pages/About.jsx`
- Clean white sections
- Technology badges: white bg, 1px border, subtle hover
- Timeline: vertical line in `#D2D2D7`, dots in `#0071E3`
- Team cards: white bg, circular avatar with `#F5F5F7` background

### Step 13: `utils/api.js`
- No structural changes needed — interface is already correct

---

## Part 3: Backend Real API Integration

### Key Change in `main.py`
Replace `simulate_yolo_detection` with actual YOLOv8:

```python
from ultralytics import YOLO

_model = None

def get_model():
    global _model
    if _model is None:
        _model = YOLO('yolov8m.pt')  # or custom trained model
    return _model

def run_yolo_inference(image: Image.Image) -> dict:
    img_array = np.array(image)
    results = get_model()(img_array, conf=0.25, iou=0.45, verbose=False)
    # Parse boxes, confidence, estimate stenosis %
    ...
```

Use `asyncio.to_thread()` in the `/predict` endpoint to avoid blocking.

---

## Part 4: Verification

1. Start backend: `cd stenosis-detection/backend && python main.py`
2. Start frontend: `cd stenosis-detection/frontend && npm run dev`
3. Navigate to Predict page, upload an angiography image
4. Verify: real YOLOv8 inference runs, results display with spring animations
5. Navigate all pages, verify Apple + Tesla aesthetic — flat colors, no gradients, smooth transitions
6. Check mobile responsiveness of Navbar
