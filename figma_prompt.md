# FuelWatch Admin - Ultra-Detailed Figma Specification

## 1. Global Design System

### 1.1 Color Palette
**Neutral / Greyscale**
- **Primary Text**: `#1D1D1F` (Almost Black - Use for Headers, Main Data)
- **Secondary Text**: `#515154` (Dark Grey - Use for Subheaders, Labels)
- **Tertiary Text**: `#86868B` (Medium Grey - Use for Meta data, captions)
- **Borders/Lines**: `#E5E7EB` (Tailwind `gray-200`) or `rgba(255, 255, 255, 0.5)` (Glass borders)
- **Background Main**: `linear-gradient(to bottom, #FFFFFF 0%, #F5F5F7 100%)`
- **Background Dark**: `#0F172A` (Slate 900 - Mobile Check-in background)

**Brand Accents**
- **Black**: `#000000` (Primary Action Buttons, Active Tab Pill)
- **White**: `#FFFFFF` (Card Backgrounds, Text on dark backgrounds)

**Semantic Gradients (Status & Visuals)**
- **Blue (Primary Brand)**: `from-blue-500 (#3B82F6)` to `to-blue-600 (#2563EB)`
- **Emerald (Good/Growth)**: `from-emerald-500 (#10B981)` to `to-teal-500 (#14B8A6)`
- **Amber (Warning/Morning)**: `from-amber-400 (#FBBF24)` to `to-orange-500 (#F97316)`
- **Rose (Critical/Afternoon)**: `from-rose-500 (#F43F5E)` to `to-red-600 (#DC2626)`
- **Indigo (Evening/Magic)**: `from-indigo-500 (#6366F1)` to `to-purple-600 (#9333EA)`

### 1.2 Typography
**Font Family**: `Inter`, `SF Pro Display`, or `Roboto` (Sans-serif).
**Scale** (Tailwind approximations):
- **Display XL**: `72px` (Hero Titles) - *Font Weight: 900 (Black)*
- **Display L**: `48px` (Section Headers) - *Font Weight: 300 (Light)*
- **H1**: `36px` - *Font Weight: 600 (SemiBold)*
- **H2**: `30px` - *Font Weight: 300 (Light)*
- **H3**: `24px` - *Font Weight: 500 (Medium)*
- **Body**: `16px` - *Font Weight: 400 (Regular)*
- **Small**: `14px` - *Font Weight: 500 (Medium)*
- **Caption**: `12px` - *Font Weight: 600 (SemiBold/Uppercase)*

### 1.3 Effects & styles
**Glassmorphism (The "Premium" Look)**
- **Card Background**: `rgba(255, 255, 255, 0.75)`
- **Background Blur**: `backdrop-filter: blur(40px)` (Tailwind `backdrop-blur-2xl`)
- **Border**: `1px solid rgba(255, 255, 255, 0.5)`
- **Inner Ring**: `1px solid rgba(255, 255, 255, 0.5)` (Inset shadow or double border)
- **Shadow**: `0px 25px 50px -12px rgba(0, 0, 0, 0.25)` (`shadow-2xl`)

**Corner Radii**
- **Cards**: `24px` (`rounded-3xl`)
- **Inner Elements / Buttons**: `16px` (`rounded-2xl`) or `999px` (`rounded-full` for pills)

---

## 2. Component Specifications

### 2.1 Buttons
**Primary Button (Black)**
- **Size**: Height 56px (`py-4`).
- **Color**: Black (`#000000`).
- **Text**: White, Medium Weight, 16px.
- **Icon**: Left aligned, 20px size.
- **Effect**: "Shine" animation (white streak moving across) - In Figma, use a masked white gradient layer at 20% opacity.

**Secondary/Tab Button (Pill)**
- **Size**: Height 60px (`py-5`).
- **Shape**: Full Pill (`rounded-full`).
- **State - Active**: Background Black, Text White.
- **State - Inactive**: Background Transparent, Text `#1D1D1F`.
- **Hover**: Text scales up slightly or background slightly darker.

### 2.2 Navigation Bar
- **Type**: Floating, Fixed Top.
- **Height**: 80px (`h-20`).
- **Background**: `rgba(255, 255, 255, 0.7)` + Blur 40px.
- **Border**: Bottom `1px solid rgba(255,255,255, 0.5)`.
- **Logo**:
    - Icon: 40x40px rounded square (`rounded-xl`), Gradient Black to Gray-800. White "F" text inside.
    - Text: "FuelWatch Admin" (24px, Light Weight, Tracking tight).
- **Right Actions**:
    - Links: "Mobile Check-In", "Register Employee" (14px, Grey `#515154`, Icon + Text).
    - User Profile: "Welcome, **Name**" (Grey + Black Gradient Text).
    - Logout: Small Black Pill Button (Height 40px, Text 14px).

### 2.3 Cards (The Building Blocks)
**Standard Dashboard Card**
- **Padding**: 32px or 40px (`p-8` or `p-10`).
- **Background**: Glass White (`bg-white/75`).
- **Decorations**:
    - **"Orbs"**: Large (300px+) circles with `Layer Blur: 100px`.
        - Colors: Blue/Cyan for general, Purple/Pink for AI, Orange/Amber for alerts.
        - Opacity: 20-30%.
        - *Placement*: Usually top-right or top-left corners, behind content.

---

## 3. Page-By-Page Design Details

### 3.1 Login Page
- **Background**: Dark Gradient (`#111827` to `#000000`).
- **Animated Background**:
    - Orb 1: Emerald/Teal, Top-Left, Blur 100px, Opacity 30%.
    - Orb 2: Purple/Pink, Bottom-Right, Blur 100px, Opacity 20%.
- **Central Card**:
    - Width: ~450px.
    - Background: `rgba(255, 255, 255, 0.8)` (High opacity glass).
    - **Header**:
        - Icon: 96px x 96px (`w-24`), Black Gradient, Rounded 24px. White Fuel Icon inside.
        - Title: "FuelWatch Admin" (48px, Light).
    - **Inputs**:
        - Height: 60px.
        - Background: `rgba(255, 255, 255, 0.7)`.
        - Border: 1px solid `rgba(255, 255, 255, 0.6)`.
        - Icons: Mail/Lock (Left aligned, Color `#86868B`).

### 3.2 Dashboard - Hero Section
- **Overview Card (Left)**:
    - **Dimensions**: ~2/3 width of container. Height ~400px.
    - **Content**:
        - Title: "Dashboard Overview" (`72px`, Black).
        - Subtext: "Welcome back..." (`24px`, Grey `#515154`).
        - Background: Clean glass, barely visible gradient overlay.
- **QR Card (Right)**:
    - **Dimensions**: ~1/3 width. Matches height of Overview.
    - **Content**:
        - Inner Panel: White, `rounded-2xl`, Shadow Inner. Contains QR Code image.
        - Labels: "Daily Staff Check-in" (14px, Bold), Date Pill (Grey background `#F2F2F7`).

### 3.3 Dashboard - Tab: Live Stocks
- **Layout**: Grid of 4 columns.
- **Fuel Card**:
    - **Height**: ~400px.
    - **Header**:
        - Fuel Type (e.g., "DIESEL") - 30px, Light.
        - Capacity ("13,500L") - 18px, Grey.
        - Percentage Badge (Top Right): Gradient Pill (e.g., Red for low).
    - **Main Stat**:
        - "5,240" (60px sized numbers, Thin/Light weight).
        - "L" (Unit, smaller 24px).
    - **Visual Bar**:
        - Track: Height 12px, `bg-white/60`, Full width.
        - Fill: Gradient (matches status color), Rounded ends. `width` based on %.

### 3.4 Dashboard - Tab: Employee Details
- **Stats Row**:
    - 2 Cards (Active Now, Total Staff).
    - Icons: Rounded square background (Blue/Green), White Icon inside.
    - Layout: Icon Left, Text Right.
- **Employee Card (Grid View)**:
    - **Padding**: 24px.
    - **Avatar**: 56px square (`w-14`), Rounded 12px, Blue-100 background, Blue Text.
    - **Status Badge**: Pill, e.g., "Morning Shift" (Amber background `bg-amber-100`, Amber text).
    - **Details**:
        - Name (20px, SemiBold).
        - Role/Email (14px, Grey).
        - Check-in Time (Bottom Left, Icon + Text).

### 3.5 Dashboard - Tab: AI Predictions
- **Chart Section**:
    - **Container**: Large glass card (`p-8`).
    - **Chart Style**:
        - Line/Stroke: Blue `#3B82F6`, Width 4px.
        - Fill: Gradient from Blue (90% opacity) to Transparent (0%).
        - Grid: Dashed, very light grey (#94A3B8, 10% opacity).
        - X-Axis Labels: Days (Mon, Tue, Wed...) - Grey `#64748B`.
- **Staffing Recommendation Card**:
    - **Theme**: "Magic/AI" - Purple gradients.
    - **Background Orb**: Top-left corner, Purple/Indigo blur.
    - **Big Number**: "12" (Employees) - 96px (`text-8xl`), Thin.
    - **Confidence Badge**: Purple Gradient Pill, "High Confidence".
    - **Analysis Text**: Small paragraph, grey text, listed bullet points with blue dots.

### 3.6 Mobile Check-In (Web App)
- **Theme**: Dark Mode.
- **Background**: Slate 900 (`#0F172A`).
- **Pattern**: Subtle grid overlay (10% opacity white lines).
- **Header**:
    - Top Bar: Gradient Slate-900 to 800.
    - Icon: White Fuel Icon in white square.
- **Main Actions**:
    - **Scan Button**: Dark Gradient (Slate 900), Full width, Height 64px.
    - **Manual Button**: White Button, Border Slate-300.
- **Info Bar**:
    - Light grey strip (`bg-slate-50`) showing Time (Large) and Location ID.

---

## 4. Iconography
- **Set**: `Lucide React` (Clean, rounded line icons).
- **Stroke Width**: 2px (Regular), 1.5px (Thin for large display icons).
- **Common Icons**: `Fuel`, `Users`, `Activity` (Pulse), `QrCode`, `LogOut`, `Calendar`.

## 5. Prototype Interactions
1.  **Hover State (Cards)**:
    - **Transform**: Move up 8px (`y: -8px`).
    - **Shadow**: Increase blur to 50px, decrease opacity.
    - **Border**: Brighten slightly.
2.  **Tab Switching**:
    - Use "Smart Animate" in Figma.
    - Content fades out (`opacity: 0`) and moves down (`y: 20px`) -> New content fades in and moves up.
3.  **Loading States**:
    - Spinning circle segment (Create a stroked circle, delete 25%, rotate).
    - Gradient: Emerald to Teal.
