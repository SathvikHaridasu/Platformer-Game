# 2D Platformer Game

A complete 2D platformer game built with HTML5 Canvas and JavaScript, featuring progressive levels, coin collection, unlockable character skins, and persistent save data.

## 🎮 Features

### Core Gameplay
- **3 Progressive Levels**: Tutorial, Intermediate, and Advanced difficulty
- **Smooth Physics**: Realistic gravity, jumping, and collision detection
- **Multiple Platform Types**:
  - Solid platforms for basic movement
  - Moving platforms with horizontal motion
  - Breakable platforms that disappear when stepped on
- **Hazards**: Spikes that cause player death
- **Goal System**: Reach the flag to complete each level

### Character System
- **4 Unique Character Skins**:
  - Default (Red) - Available from start
  - Ninja (Teal) - Unlock for 50 coins
  - Robot (Blue) - Unlock for 100 coins
  - Wizard (Green) - Unlock for 200 coins
- **Visual Feedback**: Different colors and animations for each skin

### Economy & Progression
- **Coin Collection**: Collect coins throughout levels to unlock skins
- **Persistent Save System**: Progress, coins, and unlocked skins saved locally
- **Level Progression**: Complete levels to unlock subsequent ones

### User Interface
- **Modern Menu System**: Beautiful gradient backgrounds and smooth transitions
- **Skin Shop**: Preview and purchase character skins
- **Level Select**: Choose from completed levels
- **In-Game HUD**: Display level, lives, and coin count
- **Pause System**: Pause game and access various options

## 🎯 Game Controls

### Movement
- **Left/Right**: Arrow Keys or A/D
- **Jump**: Up Arrow, W, or Spacebar
- **Pause**: Escape key

### Menu Navigation
- **Mouse**: Click buttons to navigate menus
- **Keyboard**: Use arrow keys and Enter for menu selection

## 🚀 How to Run

1. **Download/Clone** the repository
2. **Open** `index.html` in a modern web browser
3. **Start Playing** - No installation required!

### Browser Requirements
- Modern browser with HTML5 Canvas support
- JavaScript enabled
- Local storage support (for save data)

## 📁 File Structure

```
Platformer-Game/
├── index.html          # Main HTML file with game structure
├── styles.css          # CSS styling for UI and menus
├── game.js             # Complete game engine and logic
└── README.md           # This documentation file
```

## 🎨 Game Design

### Level Progression
1. **Level 1 (Tutorial)**: Basic movement and jumping mechanics
   - 15-20 coins available
   - Simple platform layouts
   - Introduction to hazards

2. **Level 2 (Intermediate)**: More complex challenges
   - 20-25 coins available
   - Moving platforms
   - Breakable platforms
   - Increased hazard density

3. **Level 3 (Advanced)**: Master-level difficulty
   - 25-30 coins available
   - All mechanics combined
   - Precise timing required
   - Complex platform sequences

### Technical Implementation
- **60 FPS Target**: Smooth gameplay experience
- **Responsive Design**: Scales to different screen sizes
- **Local Storage**: JSON-based save system
- **Modular Architecture**: Clean, maintainable code structure

## 🏆 Success Metrics

### Core Functionality ✅
- [x] Player can complete all 3 levels
- [x] Coins can be collected and spent
- [x] At least 2 skins can be unlocked through normal gameplay
- [x] Game saves progress between sessions
- [x] No game-breaking bugs or crashes

### User Experience ✅
- [x] Intuitive controls and responsive movement
- [x] Clear visual feedback for interactions
- [x] Smooth transitions between menus and gameplay
- [x] Satisfying coin collection and skin unlock experience

## 🔧 Customization

### Adding New Levels
1. Modify the `getLevelData()` method in `game.js`
2. Add new level configuration with platforms, coins, and hazards
3. Update level progression logic

### Adding New Skins
1. Add skin preview styling in `styles.css`
2. Update skin colors in the `Player.render()` method
3. Add skin to the unlock system

### Modifying Game Physics
- Adjust `gravity` and `friction` values in the Game constructor
- Modify player `speed` and `jumpPower` in the Player class

## 🎵 Future Enhancements

- [ ] Background music and sound effects
- [ ] Additional levels and worlds
- [ ] Power-ups and special abilities
- [ ] Leaderboards and time trials
- [ ] Mobile touch controls
- [ ] Achievement system
- [ ] Cloud save synchronization
- [ ] Multiplayer racing mode

## 🐛 Known Issues

- None currently identified

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the game!

---

**Enjoy playing the 2D Platformer Game!** 🎮✨ 