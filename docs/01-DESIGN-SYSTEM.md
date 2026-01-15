# Design System Specification

## Overview
Visual design guidelines and brand identity for Minesweeper Moki.

---

## Color Palette

### CSS Variables
```css
:root {
  /* Primary */
  --color-background: #FFD753;    /* Main background - warm golden yellow */
  
  /* Accents */
  --color-purple: #8F68FC;        /* UI elements, highlights */
  --color-pink: #FF66CC;          /* Interactive elements, hover states */
  --color-teal: #1ABF9E;          /* Success states, positive feedback */
  --color-blue: #2673E8;          /* Information, links */
  
  /* Neutrals */
  --color-white: #FFFFFF;         /* Tile faces, text on dark */
  --color-black: #000000;         /* Text, borders, shadows */
}
```

### Color Usage Guide

| Context | Color | Hex |
|---------|-------|-----|
| Page background | Golden Yellow | `#FFD753` |
| Unrevealed tile | Purple | `#8F68FC` |
| Tile hover | Pink | `#FF66CC` |
| Flagged tile accent | Pink | `#FF66CC` |
| Win state / Success | Teal | `#1ABF9E` |
| Timer / Counter display | Blue | `#2673E8` |
| Revealed tile background | White | `#FFFFFF` |
| Text / Numbers | Black | `#000000` |

---

## Typography

### Font Stack
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
| Element | Size | Weight |
|---------|------|--------|
| Timer/Counter | 24px | Bold (700) |
| Tile Numbers | 16px | Bold (700) |
| Popup Title | 24px | Bold (700) |
| Popup Body | 16px | Regular (400) |
| Button Text | 14px | Semi-bold (600) |

---

## Spacing & Layout

### Border Radius
| Element | Radius |
|---------|--------|
| Tiles | 6px |
| Game container | 12px |
| Moki button | 50% (circle) |
| Modal popup | 16px |
| Buttons | 8px |

### Shadows
```css
/* Tile shadow (unrevealed) */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

/* Container shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

/* Modal shadow */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
```

### Padding
| Element | Padding |
|---------|---------|
| Game container | 16px |
| Tiles | 0 (content centered) |
| Header bar | 12px |
| Modal | 32px |
| Buttons | 12px 24px |

---

## Number Colors (Minesweeper Standard)

```css
.number-1 { color: #2673E8; }  /* Blue */
.number-2 { color: #1ABF9E; }  /* Teal */
.number-3 { color: #FF66CC; }  /* Pink */
.number-4 { color: #8F68FC; }  /* Purple */
.number-5 { color: #B22222; }  /* Dark Red */
.number-6 { color: #008B8B; }  /* Dark Cyan */
.number-7 { color: #000000; }  /* Black */
.number-8 { color: #808080; }  /* Gray */
```

---

## Implementation Checklist

- [ ] Define CSS custom properties (variables)
- [ ] Set up typography system
- [ ] Configure border-radius values
- [ ] Implement shadow utilities
- [ ] Create number color classes
- [ ] Test color contrast for accessibility





