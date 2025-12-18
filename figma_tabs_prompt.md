# Figma Prompts: Employee & Prediction Tabs

## 1. Employee Details Tab
> **Goal**: Create a "Workforce Management" view that feels like a premium HR dashboard.
> **Key Visuals**: Clean lists, colorful status badges, and a "Live Active" grid.

### Layout Specs
1.  **Header Section**
    - **Title**: "Workforce Management" (48px, Light).
    - **Stats Cards** (Row of 2):
        - Style: Wide cards, `height: 100px`.
        - **Card 1 (Active)**: Blue icon background, "Active Now" label, Large Number "8".
        - **Card 2 (Total)**: Emerald icon background, "Total Staff" label, Large Number "24".

2.  **Controls Toolbar**
    - **Container**: White rounded bar (`rounded-2xl`).
    - **Left - View Toggle**: Segmented Control style.
        - "Live Active" (Selected): White background, Shadow, Black text.
        - "All Employees": Transparent background, Grey text.
    - **Right - Search**:
        - Input field with Search Icon.
        - Style: Light grey background (`#F9FAFB`), No border, Rounded corners.

3.  **Active Employees Grid (Main View)**
    - **Grid**: 2 or 3 columns based on width.
    - **Card Style**: Glassmorphism (`bg-white/75`), `rounded-3xl`, `p-6`.
    - **Content**:
        - **Top**: Avatar (56px rounded square, colored bg) + Name (Bold) + Role (Grey).
        - **Top Right**: Shift Badge (Pill shape, e.g., "Morning" in Amber).
        - **Bottom Grid**:
            - Check-in Time: "08:30 AM" (Icon: Clock).
            - Status: "Active" (Green dot + Text).

4.  **All Employees List (Alternative View)**
    - **Style**: Modern Data Table.
    - **Header Row**: Grey text, Uppercase, Small font (`12px`).
    - **Rows**: White background, Border bottom `1px solid #F3F4F6`.
    - **Columns**: Employee (Avatar+Name), Role (Badge), Status (Active/Inactive), Contact (Email), Actions (View Button).
    - **Hover**: Row highlights light grey on hover.

### Design Hints
- Use **Amber/Orange** accents for Morning shift cards.
- Use **Rose/Red** accents for Afternoon shift cards.
- Use **Indigo/Purple** accents for Evening shift cards.
- **Avatar**: Use 1-2 letter initials if no image (e.g., "JD" in a blue square).

---

## 2. AI Predictions Tab
> **Goal**: Create a futuristic "Control Center" for AI insights.
> **Key Visuals**: Deep blue charts, purple "magic" gradients, and glowing confidence indicators.

### Layout Specs
1.  **Header Section**
    - **Title**: "AI Demand Intelligence" (48px, Light).
    - **Stats Cards** (Row of 2):
        - **Card 1**: "Tomorrow's Demand" (Blue Theme). Large breakdown number.
        - **Card 2**: "Weekly Trend" (Green or Red Theme). Percentage with arrow (+15%).

2.  **Main Content Area (Split 2:1)**
    - **Left: Forecast Chart (66% Width)**
        - **Container**: Large glass card (`p-8`).
        - **Chart**: Area Chart.
            - **Line**: Bright Blue (`#3B82F6`), 4px width, smooth curve.
            - **Fill**: Gradient Blue to Transparent.
            - **Dots**: White circles with Blue border on data points.
            - **Tooltip**: Glass hover floater showing "Predicted: 5,200L".
            - **Axes**: Minimal grey labels, no vertical grid lines.

    - **Right: Staffing Recommendations (33% Width)**
        - **Theme**: "AI Magic" (Purple/Violet).
        - **Container**: Glass card with subtle purple gradient background.
        - **Visuals**:
            - **Icon**: Brain or Sparkles icon in purple square.
            - **Big Number**: "8" (Employees needed) - Size `96px`, Thin font.
            - **Confidence Pill**: "High Confidence" (Purple gradient background, White text).
        - **Reasoning Box**:
            - "Why?": Small text explaining the prediction (e.g., "High weekend traffic expected").
            - Style: Slightly darker/lighter background block within the card to separate it.

### Design Hints
- **Gradients**: Use a "Glow" effect behind the Staffing Card (Purple blur).
- **Chart**: Make it look "alive". The line should look neon/bright against the white glass.
- **Typography**: Use VERY large, thin fonts for the main numbers (e.g., predicted liters, staff count).
