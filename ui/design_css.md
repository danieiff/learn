### Text On Image
text-shadow: 0 1px 2px rgba(0, 0, 0, .25)

backkground: liner-gradient(to bottom,
  rgba(0, 0, 0, 0),
  rgba(0, 0, 0, 0) 60%,
  rgba(0, 0, 0, .8)
);

- Text-in-a-box method

### Common Brand
1. Clean Simple
フォントgeometric_san-serif,grotesque, 色の明度明るい 僅かにborder-rounding 僅かに影
2. Formal Fancy
serif,freight_text grayscale+gold stark_flat_shape
3. Friendly Casual
rounded quirky_sans Proxima_Round bright_playful_color soft_friendly_shape
4. Techie Authoritative
squared-off_sans-serifs Carbon,DIN cool_colors,neon_gradients crisp,angular_shapes

Text-heavy / Interaction-heavy
reading     scanning
            10px
16px        12px
18px        16px
20px+       ++

### Table
- Lighten or remove repeating elements to reduce clutter
Repetitive lines deemphasized, repetitive actions(tooltips) are hidden in "more" menu
- X::Colored text on white / O::Dark colorized text on a light colored background

text-align: right;
font-variant-numeric: tabular-nums;

- Rarely present data
- Consolidate similar columns

### Color
Choose a palette and add a new layer (exp: one color with 50% opacity) on top in a blend mode like Soft Light or Overlay
Using HSB: Base indigo, variantions(lighter darker)
Background, Editable controls: white gray
Gradient: Choose middle colors

### Opacity
Disable Object: 50-60%, make cursor default (not clickable cursor)

### Shadow
Closer Objects are more distinct / fuzzier

### Text
12~16+px: secondary text 14px, paragraph text 16px
Make numbers big and bold, with a smaller, lighter uppercase label
Color Contrast Ratio (See AA Guidelines)
50-75characters in a line
Spacing between paragraphs, lines

### Dark mode
1. Invert text, icons colors
2. Darken (not invert) backgrounds, change lightness with the Z-axis floor
3. Darken shadow
4. Brighten theme (or accents) colors

### Alignments
Put texts into Shapes

### Search and Filter
Use both inside a screen
No results → Typo? Too many filters applied? Message varies contexts
Before Search: (Anticipation) Show recent conditions, popular pages, how to search

### Tooltips
- Focus
box-shadow: 0px 0px 0px 4px rgba(88, 86, 214, 0.25);
box-shadow: 0px 0px 0px 1px white, 0px 0px 0px 4px rgba(0, 103, 205, 0.4);
Inverse colors

### Form
Avoid dropdown asap
Input text 16px at least
