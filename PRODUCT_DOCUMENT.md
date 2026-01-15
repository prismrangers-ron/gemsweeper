# Minesweeper Moki - Product Document

---

## 📋 Overview

**Minesweeper Moki** is a web-based minesweeper game with a unique twist on the classic design. The game features custom imagery and a modern, clean aesthetic. Players are thrown directly into the action with no menus, tutorials, or difficulty selection—just pure, challenging gameplay.

---

## 🎨 Brand Identity

### Color Palette

| Color Code | Usage |
|------------|-------|
| `#FFD753` | **Main Background Color** - Warm golden yellow |
| `#8F68FC` | Accent Purple - UI elements, highlights |
| `#FF66CC` | Accent Pink - Interactive elements |
| `#1ABF9E` | Accent Teal - Success states, positive feedback |
| `#2673E8` | Accent Blue - Information, links |
| `#FFFFFF` | White - Text, tile faces |
| `#000000` | Black - Text, borders, shadows |

### Visual Assets

Located in `/assets/`:

| File | Description |
|------|-------------|
| `moki.png` | Main mascot image - Displayed during active gameplay (replaces classic smiley) |
| `dead.png` | Game over state - Displayed when player hits a mine |
| `butthole.png` | Mine icon - Replaces traditional bomb imagery |

---

## 🎮 Game Specifications

### Difficulty

- **Fixed Difficulty**: Expert/Hardest level only
- **Grid Size**: 30 rows × 16 columns (480 tiles total)
- **Mine Count**: 99 mines
- **No difficulty selection menu**

### Core Mechanics

The game follows standard Minesweeper rules:

1. **Left-click** on a tile to reveal it
2. **Right-click** on a tile to place/remove a flag
3. **Numbered tiles** indicate how many mines are adjacent (1-8)
4. **Empty tiles** auto-reveal adjacent safe tiles (cascade effect)
5. **Win condition**: Reveal all non-mine tiles
6. **Lose condition**: Click on a mine

### What's NOT Included

- ❌ Difficulty selection menu
- ❌ Main menu / start screen
- ❌ How-to-play instructions
- ❌ Autoplay / auto-solve features
- ❌ Site header or branding text
- ❌ "Moki Minesweeper" title display

---

## 🖥️ User Interface Design

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ┌─────────────────┐                      │
│     [Mine Count]   │   moki.png      │   [Timer]            │
│        🚩 99       │   (clickable)   │   ⏱️ 000             │
│                    └─────────────────┘                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │                                                      │   │
│  │                                                      │   │
│  │              16 × 30 GAME GRID                       │   │
│  │              (480 tiles total)                       │   │
│  │                                                      │   │
│  │                                                      │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Background: #FFD753
```

### Design Elements

| Element | Style |
|---------|-------|
| **Tiles** | Rounded corners, modern flat design |
| **Borders** | Subtle shadows, no harsh 3D bevels |
| **Typography** | Clean, modern sans-serif |
| **Spacing** | Generous padding, breathable layout |
| **Grid** | Centered on screen |

### Tile States

| State | Appearance |
|-------|------------|
| **Unrevealed** | Solid color with subtle shadow, rounded corners |
| **Revealed (empty)** | Lighter/flat appearance |
| **Revealed (number)** | Number displayed with distinct colors per digit |
| **Flagged** | Flag icon visible |
| **Mine (on loss)** | `butthole.png` displayed |

### Moki Status Indicator

The center-top position features the Moki mascot:

| Game State | Image Displayed | Behavior |
|------------|-----------------|----------|
| **Playing** | `moki.png` | Default state |
| **Lost** | `dead.png` | Triggered when mine is clicked |
| **Won** | `moki.png` | Remains normal |
| **Click to Reset** | Any state | Clicking Moki restarts the game |

---

## 🏆 Win Condition & Popup

When a player successfully reveals all non-mine tiles, a popup modal appears:

### Win Popup Content

```
┌──────────────────────────────────────────┐
│                                          │
│     🎉 Congratulations on beating        │
│           the game!                      │
│                                          │
│     Here is your clue:                   │
│                                          │
│     "Luck stretches wide from end        │
│      to end,                             │
│      Where seven colors gently bend."   │
│                                          │
│              [ OK / Close ]              │
│                                          │
└──────────────────────────────────────────┘
```

### Popup Design

- Modern modal overlay with backdrop blur
- Rounded corners matching overall design
- Brand colors applied to buttons/accents
- Dismissible via button or clicking outside

---

## 🔧 Technical Requirements

### Platform

- **Type**: Single-page web application
- **Technologies**: HTML5, CSS3, JavaScript (vanilla or framework)
- **Responsive**: Desktop-optimized (16×30 grid requires adequate screen width)

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance

- Instant load (no splash screen)
- Smooth tile reveal animations
- Minimal dependencies

---

## 📁 Project Structure

```
Moki Minesweeper/
├── assets/
│   ├── moki.png          # Mascot - normal state
│   ├── dead.png          # Mascot - game over state
│   └── butthole.png      # Mine icon
├── index.html            # Main game page
├── styles.css            # Styling
├── game.js               # Game logic
└── PRODUCT_DOCUMENT.md   # This document
```

---

## 🚀 User Flow

```
User opens URL
       │
       ▼
┌──────────────────┐
│  Game board      │
│  immediately     │
│  visible         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Player clicks   │
│  first tile      │
│  (timer starts)  │
└────────┬─────────┘
         │
         ├─────────────────────────────┐
         │                             │
         ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│  Clicks mine     │         │  Clears all      │
│  → dead.png      │         │  safe tiles      │
│  → Game Over     │         │  → WIN POPUP     │
└────────┬─────────┘         └────────┬─────────┘
         │                             │
         ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│  Click Moki to   │         │  Show clue       │
│  restart         │         │  message         │
└──────────────────┘         └──────────────────┘
```

---

## 📝 Summary

Minesweeper Moki is a streamlined, no-frills minesweeper experience that:

- ✅ Drops players directly into expert-level gameplay
- ✅ Features custom Moki branding and imagery
- ✅ Uses modern, rounded UI with vibrant brand colors
- ✅ Contains a hidden clue for winners as a reward
- ✅ Maintains clean aesthetics with no unnecessary text or navigation

---

*Document Version: 1.0*
*Last Updated: January 10, 2026*





