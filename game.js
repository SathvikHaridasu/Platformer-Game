// Game Engine and Core Classes
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.gameState = 'menu'; // menu, playing, paused, gameOver, levelComplete
        this.currentLevel = 1;
        this.lives = 3;
        this.coins = 0;
        this.selectedSkin = 0;
        this.unlockedSkins = [0]; // Default skin unlocked
        this.completedLevels = [];
        
        this.player = null;
        this.platforms = [];
        this.coinObjects = [];
        this.hazards = [];
        this.movingPlatforms = [];
        this.breakablePlatforms = [];
        this.goal = null;
        
        this.keys = {};
        this.keysPressed = {}; // Track keys that were just pressed
        this.gravity = 0.6;
        this.friction = 0.85;
        
        this.camera = { x: 0, y: 0 };
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.loadGameData();
        this.setupEventListeners();
        this.showMainMenu();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.keysPressed[e.code] = true; // Mark as just pressed
            }
            this.keys[e.code] = true;
            if (e.code === 'Escape' && this.gameState === 'playing') {
                this.pauseGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.keysPressed[e.code] = false;
        });
        
        // Menu button events
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('skinShopBtn').addEventListener('click', () => {
            this.showSkinShop();
        });
        
        document.getElementById('levelSelectBtn').addEventListener('click', () => {
            this.showLevelSelect();
        });
        
        document.getElementById('quitGameBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to quit?')) {
                window.close();
            }
        });
        
        document.getElementById('backToMainBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('backToMainFromLevelBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseGame();
        });
        
        document.getElementById('resumeBtn').addEventListener('click', () => {
            this.resumeGame();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartLevel();
        });
        
        document.getElementById('mainMenuBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('restartGameBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('mainMenuFromGameOverBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            this.nextLevel();
        });
        
        document.getElementById('mainMenuFromCompleteBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Skin shop events
        document.querySelectorAll('.buyBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skinId = parseInt(e.target.dataset.skin);
                const cost = parseInt(e.target.dataset.cost);
                this.buySkin(skinId, cost);
            });
        });
        
        document.querySelectorAll('.equipBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skinId = parseInt(e.target.dataset.skin);
                this.equipSkin(skinId);
            });
        });
        
        // Level select events
        document.querySelectorAll('.playLevelBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const levelId = parseInt(e.target.dataset.level);
                this.playLevel(levelId);
            });
        });
    }
    
    showMainMenu() {
        this.gameState = 'menu';
        this.hideAllMenus();
        document.getElementById('mainMenu').classList.remove('hidden');
    }
    
    showSkinShop() {
        this.hideAllMenus();
        document.getElementById('skinShop').classList.remove('hidden');
        this.updateSkinShop();
    }
    
    showLevelSelect() {
        this.hideAllMenus();
        document.getElementById('levelSelect').classList.remove('hidden');
        this.updateLevelSelect();
    }
    
    hideAllMenus() {
        const menus = ['mainMenu', 'skinShop', 'levelSelect', 'pauseMenu', 'gameOverScreen', 'levelCompleteScreen'];
        menus.forEach(menuId => {
            document.getElementById(menuId).classList.add('hidden');
        });
        document.getElementById('gameHUD').classList.add('hidden');
    }
    
    updateSkinShop() {
        document.getElementById('shopCoins').textContent = this.coins;
        
        // Update skin items
        document.querySelectorAll('.skinItem').forEach(item => {
            const skinId = parseInt(item.dataset.skin);
            const buyBtn = item.querySelector('.buyBtn');
            const equipBtn = item.querySelector('.equipBtn');
            
            if (this.unlockedSkins.includes(skinId)) {
                item.classList.remove('locked');
                if (buyBtn) buyBtn.style.display = 'none';
                if (equipBtn) {
                    equipBtn.style.display = 'block';
                    equipBtn.textContent = this.selectedSkin === skinId ? 'Equipped' : 'Equip';
                }
            } else {
                item.classList.add('locked');
                if (buyBtn) buyBtn.style.display = 'block';
                if (equipBtn) equipBtn.style.display = 'none';
            }
        });
    }
    
    updateLevelSelect() {
        document.querySelectorAll('.levelItem').forEach(item => {
            const levelId = parseInt(item.dataset.level);
            const playBtn = item.querySelector('.playLevelBtn');
            
            if (levelId === 1 || this.completedLevels.includes(levelId - 1)) {
                item.classList.remove('locked');
                playBtn.disabled = false;
                playBtn.textContent = 'Play';
            } else {
                item.classList.add('locked');
                playBtn.disabled = true;
                playBtn.textContent = 'Locked';
            }
        });
    }
    
    buySkin(skinId, cost) {
        if (this.coins >= cost && !this.unlockedSkins.includes(skinId)) {
            this.coins -= cost;
            this.unlockedSkins.push(skinId);
            this.saveGameData();
            this.updateSkinShop();
        }
    }
    
    equipSkin(skinId) {
        if (this.unlockedSkins.includes(skinId)) {
            this.selectedSkin = skinId;
            this.saveGameData();
            this.updateSkinShop();
            if (this.player) {
                this.player.skin = skinId;
            }
        }
    }
    
    startGame() {
        this.currentLevel = 1;
        this.lives = 3;
        this.loadLevel(this.currentLevel);
        this.gameState = 'playing';
        this.hideAllMenus();
        document.getElementById('gameHUD').classList.remove('hidden');
        this.updateHUD();
    }
    
    playLevel(levelId) {
        this.currentLevel = levelId;
        this.lives = 3;
        this.loadLevel(this.currentLevel);
        this.gameState = 'playing';
        this.hideAllMenus();
        document.getElementById('gameHUD').classList.remove('hidden');
        this.updateHUD();
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseMenu').classList.remove('hidden');
        }
    }
    
    resumeGame() {
        this.gameState = 'playing';
        document.getElementById('pauseMenu').classList.add('hidden');
    }
    
    restartLevel() {
        this.lives = 3;
        this.loadLevel(this.currentLevel);
        this.gameState = 'playing';
        document.getElementById('pauseMenu').classList.add('hidden');
        this.updateHUD();
    }
    
    restartGame() {
        this.currentLevel = 1;
        this.lives = 3;
        this.loadLevel(this.currentLevel);
        this.gameState = 'playing';
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.updateHUD();
    }
    
    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel <= 3) {
            this.lives = 3;
            this.loadLevel(this.currentLevel);
            this.gameState = 'playing';
            document.getElementById('levelCompleteScreen').classList.add('hidden');
            this.updateHUD();
        } else {
            this.showMainMenu();
        }
    }
    
    loadLevel(levelNumber) {
        this.platforms = [];
        this.coinObjects = [];
        this.hazards = [];
        this.movingPlatforms = [];
        this.breakablePlatforms = [];
        
        const levelData = this.getLevelData(levelNumber);
        
        // Create player
        this.player = new Player(levelData.playerStart.x, levelData.playerStart.y, this.selectedSkin);
        
        // Create platforms
        levelData.platforms.forEach(platform => {
            this.platforms.push(new Platform(platform.x, platform.y, platform.width, platform.height));
        });
        
        // Create moving platforms
        levelData.movingPlatforms.forEach(platform => {
            this.movingPlatforms.push(new MovingPlatform(platform.x, platform.y, platform.width, platform.height, platform.startX, platform.endX, platform.speed));
        });
        
        // Create breakable platforms
        levelData.breakablePlatforms.forEach(platform => {
            this.breakablePlatforms.push(new BreakablePlatform(platform.x, platform.y, platform.width, platform.height));
        });
        
        // Create coins
        levelData.coins.forEach(coin => {
            this.coinObjects.push(new Coin(coin.x, coin.y));
        });
        
        // Create hazards
        levelData.hazards.forEach(hazard => {
            this.hazards.push(new Hazard(hazard.x, hazard.y, hazard.width, hazard.height));
        });
        
        // Create goal
        this.goal = new Goal(levelData.goal.x, levelData.goal.y);
        
        // Reset camera
        this.camera = { x: 0, y: 0 };
    }
    
    getLevelData(levelNumber) {
        const levels = {
            1: {
                playerStart: { x: 100, y: 500 },
                platforms: [
                    { x: 0, y: 650, width: 200, height: 70 },
                    { x: 300, y: 550, width: 200, height: 70 },
                    { x: 600, y: 450, width: 200, height: 70 },
                    { x: 900, y: 350, width: 200, height: 70 },
                    { x: 1200, y: 250, width: 200, height: 70 }
                ],
                movingPlatforms: [
                    { x: 450, y: 400, width: 150, height: 20, startX: 450, endX: 650, speed: 2 }
                ],
                breakablePlatforms: [
                    { x: 750, y: 300, width: 100, height: 20 }
                ],
                coins: [
                    { x: 350, y: 500 },
                    { x: 650, y: 400 },
                    { x: 950, y: 300 },
                    { x: 1250, y: 200 },
                    { x: 500, y: 350 },
                    { x: 800, y: 250 },
                    { x: 1100, y: 150 }
                ],
                hazards: [
                    { x: 250, y: 630, width: 40, height: 20 },
                    { x: 550, y: 430, width: 40, height: 20 },
                    { x: 850, y: 330, width: 40, height: 20 }
                ],
                goal: { x: 1350, y: 200 }
            },
            2: {
                playerStart: { x: 100, y: 500 },
                platforms: [
                    { x: 0, y: 650, width: 150, height: 70 },
                    { x: 250, y: 500, width: 150, height: 70 },
                    { x: 500, y: 400, width: 150, height: 70 },
                    { x: 750, y: 300, width: 150, height: 70 },
                    { x: 1000, y: 200, width: 150, height: 70 },
                    { x: 1250, y: 100, width: 150, height: 70 }
                ],
                movingPlatforms: [
                    { x: 400, y: 350, width: 120, height: 20, startX: 400, endX: 600, speed: 3 },
                    { x: 900, y: 150, width: 120, height: 20, startX: 900, endX: 1100, speed: 2 }
                ],
                breakablePlatforms: [
                    { x: 650, y: 250, width: 80, height: 20 },
                    { x: 1150, y: 50, width: 80, height: 20 }
                ],
                coins: [
                    { x: 300, y: 450 },
                    { x: 550, y: 350 },
                    { x: 800, y: 250 },
                    { x: 1050, y: 150 },
                    { x: 1300, y: 50 },
                    { x: 450, y: 300 },
                    { x: 700, y: 200 },
                    { x: 950, y: 100 },
                    { x: 1200, y: 0 }
                ],
                hazards: [
                    { x: 200, y: 630, width: 40, height: 20 },
                    { x: 450, y: 480, width: 40, height: 20 },
                    { x: 700, y: 380, width: 40, height: 20 },
                    { x: 950, y: 280, width: 40, height: 20 },
                    { x: 1200, y: 180, width: 40, height: 20 }
                ],
                goal: { x: 1400, y: 50 }
            },
            3: {
                playerStart: { x: 100, y: 500 },
                platforms: [
                    { x: 0, y: 650, width: 120, height: 70 },
                    { x: 200, y: 550, width: 120, height: 70 },
                    { x: 400, y: 450, width: 120, height: 70 },
                    { x: 600, y: 350, width: 120, height: 70 },
                    { x: 800, y: 250, width: 120, height: 70 },
                    { x: 1000, y: 150, width: 120, height: 70 },
                    { x: 1200, y: 50, width: 120, height: 70 }
                ],
                movingPlatforms: [
                    { x: 350, y: 400, width: 100, height: 20, startX: 350, endX: 550, speed: 4 },
                    { x: 750, y: 200, width: 100, height: 20, startX: 750, endX: 950, speed: 3 },
                    { x: 1150, y: 0, width: 100, height: 20, startX: 1150, endX: 1350, speed: 2 }
                ],
                breakablePlatforms: [
                    { x: 550, y: 300, width: 60, height: 20 },
                    { x: 950, y: 100, width: 60, height: 20 },
                    { x: 1350, y: -50, width: 60, height: 20 }
                ],
                coins: [
                    { x: 250, y: 500 },
                    { x: 450, y: 400 },
                    { x: 650, y: 300 },
                    { x: 850, y: 200 },
                    { x: 1050, y: 100 },
                    { x: 1250, y: 0 },
                    { x: 400, y: 350 },
                    { x: 600, y: 250 },
                    { x: 800, y: 150 },
                    { x: 1000, y: 50 },
                    { x: 1200, y: -50 }
                ],
                hazards: [
                    { x: 150, y: 630, width: 40, height: 20 },
                    { x: 350, y: 530, width: 40, height: 20 },
                    { x: 550, y: 430, width: 40, height: 20 },
                    { x: 750, y: 330, width: 40, height: 20 },
                    { x: 950, y: 230, width: 40, height: 20 },
                    { x: 1150, y: 130, width: 40, height: 20 }
                ],
                goal: { x: 1450, y: -50 }
            }
        };
        
        return levels[levelNumber];
    }
    
    updateHUD() {
        document.getElementById('currentLevel').textContent = this.currentLevel;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('gameCoins').textContent = this.coins;
    }
    
    gameLoop() {
        if (this.gameState === 'playing') {
            this.update();
        }
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update player
        if (this.player) {
            this.player.update(this.keys, this.keysPressed, this.platforms, this.movingPlatforms, this.breakablePlatforms, this.gravity, this.friction);
            
            // Clear key press states after processing
            this.keysPressed['ArrowUp'] = false;
            this.keysPressed['KeyW'] = false;
            this.keysPressed['Space'] = false;
            
            // Check if player fell off screen
            if (this.player.y > this.height + 100) {
                this.playerDeath();
            }
            
            // Check coin collection
            this.coinObjects = this.coinObjects.filter(coin => {
                if (this.checkCollision(this.player, coin)) {
                    this.coins += 1;
                    this.updateHUD();
                    this.createCoinParticles(coin.x + coin.width/2, coin.y + coin.height/2);
                    return false;
                }
                return true;
            });
            
            // Check hazard collision
            this.hazards.forEach(hazard => {
                if (this.checkCollision(this.player, hazard)) {
                    this.playerDeath();
                }
            });
            
            // Check goal collision
            if (this.goal && this.checkCollision(this.player, this.goal)) {
                this.levelComplete();
            }
        }
        
        // Update moving platforms
        this.movingPlatforms.forEach(platform => {
            platform.update();
        });
        
        // Update camera to follow player
        if (this.player) {
            this.camera.x = this.player.x - this.width / 2;
            this.camera.y = this.player.y - this.height / 2;
            
            // Clamp camera to level bounds
            this.camera.x = Math.max(0, Math.min(this.camera.x, 1500 - this.width));
            this.camera.y = Math.max(0, Math.min(this.camera.y, 800 - this.height));
        }
    }
    
    render() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#98D8E8');
        gradient.addColorStop(1, '#B0E0E6');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw clouds in background
        this.drawBackgroundElements();
        
        // Save context for camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render game objects
        if (this.gameState === 'playing') {
            // Render platforms
            this.platforms.forEach(platform => platform.render(this.ctx));
            this.movingPlatforms.forEach(platform => platform.render(this.ctx));
            this.breakablePlatforms.forEach(platform => platform.render(this.ctx));
            
            // Render coins
            this.coinObjects.forEach(coin => coin.render(this.ctx));
            
            // Render hazards
            this.hazards.forEach(hazard => hazard.render(this.ctx));
            
            // Render goal
            if (this.goal) this.goal.render(this.ctx);
            
            // Render player
            if (this.player) this.player.render(this.ctx);
        }
        
        // Restore context
        this.ctx.restore();
        
        // Draw particle effects
        this.drawParticleEffects();
    }
    
    drawBackgroundElements() {
        // Draw animated clouds
        const time = Date.now() * 0.001;
        for (let i = 0; i < 5; i++) {
            const x = (time * 20 + i * 300) % (this.width + 200) - 100;
            const y = 50 + i * 80;
            this.drawCloud(x, y, 0.8 + i * 0.1);
        }
    }
    
    drawCloud(x, y, scale) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scale, scale);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
        this.ctx.arc(25, 0, 25, 0, Math.PI * 2);
        this.ctx.arc(-25, 0, 25, 0, Math.PI * 2);
        this.ctx.arc(0, -20, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawParticleEffects() {
        // Draw coin collection particles
        if (this.particles) {
            this.particles.forEach((particle, index) => {
                particle.update();
                particle.render(this.ctx);
                if (particle.life <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    playerDeath() {
        this.lives--;
        this.updateHUD();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Respawn player
            const levelData = this.getLevelData(this.currentLevel);
            this.player.x = levelData.playerStart.x;
            this.player.y = levelData.playerStart.y;
            this.player.velocityX = 0;
            this.player.velocityY = 0;
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    levelComplete() {
        this.gameState = 'levelComplete';
        if (!this.completedLevels.includes(this.currentLevel)) {
            this.completedLevels.push(this.currentLevel);
        }
        this.saveGameData();
        document.getElementById('levelCoinsCollected').textContent = this.coins;
        document.getElementById('levelCompleteScreen').classList.remove('hidden');
    }
    
    saveGameData() {
        const gameData = {
            coins: this.coins,
            unlockedSkins: this.unlockedSkins,
            selectedSkin: this.selectedSkin,
            completedLevels: this.completedLevels
        };
        localStorage.setItem('platformerGameData', JSON.stringify(gameData));
    }
    
    loadGameData() {
        const savedData = localStorage.getItem('platformerGameData');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.coins = gameData.coins || 0;
            this.unlockedSkins = gameData.unlockedSkins || [0];
            this.selectedSkin = gameData.selectedSkin || 0;
            this.completedLevels = gameData.completedLevels || [];
        }
    }
    
    createCoinParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y, '#FFD700'));
        }
    }
}

// Player Class
class Player {
    constructor(x, y, skin = 0) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 6;
        this.jumpPower = 16;
        this.onGround = false;
        this.skin = skin;
        this.direction = 1; // 1 for right, -1 for left
        this.animationFrame = 0;
        this.isMoving = false;
        this.isJumping = false;
    }
    
    update(keys, keysPressed, platforms, movingPlatforms, breakablePlatforms, gravity, friction) {
        // Handle input
        this.isMoving = false;
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.velocityX = -this.speed;
            this.direction = -1;
            this.isMoving = true;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            this.velocityX = this.speed;
            this.direction = 1;
            this.isMoving = true;
        } else {
            this.velocityX *= friction;
        }
        
        // Unlimited jump mechanics - only on key press, not hold
        if (keysPressed['ArrowUp'] || keysPressed['KeyW'] || keysPressed['Space']) {
            this.jump();
        }
        
        // Apply gravity
        this.velocityY += gravity;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Update animation frame
        this.animationFrame += 0.2;
        
        // Check collisions
        this.onGround = false;
        
        // Platform collisions
        [...platforms, ...movingPlatforms, ...breakablePlatforms].forEach(platform => {
            if (this.checkCollision(platform)) {
                this.handleCollision(platform);
            }
        });
        
        // Reset jumping state when on ground
        if (this.onGround) {
            this.isJumping = false;
        }
    }
    
    jump() {
        this.velocityY = -this.jumpPower;
        this.isJumping = true;
        this.onGround = false;
    }
    
    checkCollision(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y;
    }
    
    handleCollision(platform) {
        const overlapX = Math.min(this.x + this.width - platform.x, platform.x + platform.width - this.x);
        const overlapY = Math.min(this.y + this.height - platform.y, platform.y + platform.height - this.y);
        
        if (overlapX < overlapY) {
            // Horizontal collision
            if (this.x < platform.x) {
                this.x = platform.x - this.width;
            } else {
                this.x = platform.x + platform.width;
            }
            this.velocityX = 0;
        } else {
            // Vertical collision
            if (this.y < platform.y) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
            } else {
                this.y = platform.y + platform.height;
                this.velocityY = 0;
                this.onGround = true;
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Add slight bounce animation when moving
        let bounceOffset = 0;
        if (this.isMoving && this.onGround) {
            bounceOffset = Math.sin(this.animationFrame) * 2;
        }
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x + 5, this.y + this.height + 5, this.width - 10, 8);
        
        // Draw player based on skin with gradient
        const colors = [
            ['#ff6b6b', '#ee5a24'],
            ['#4ecdc4', '#44a08d'],
            ['#45b7d1', '#2980b9'],
            ['#96ceb4', '#7fb069']
        ];
        const colorPair = colors[this.skin] || colors[0];
        
        // Create gradient for player
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, colorPair[0]);
        gradient.addColorStop(1, colorPair[1]);
        ctx.fillStyle = gradient;
        
        // Draw player body with rounded corners
        this.roundRect(ctx, this.x, this.y + bounceOffset, this.width, this.height, 8);
        ctx.fill();
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.roundRect(ctx, this.x + 2, this.y + 2 + bounceOffset, this.width - 4, this.height / 3, 6);
        ctx.fill();
        
        // Draw eyes with animation
        ctx.fillStyle = '#000';
        const eyeSize = 6;
        const eyeY = this.y + 15 + bounceOffset;
        const blinkOffset = Math.sin(this.animationFrame * 0.5) > 0.8 ? 2 : 0;
        
        if (this.direction === 1) {
            ctx.fillRect(this.x + 25, eyeY, eyeSize, eyeSize - blinkOffset);
            ctx.fillRect(this.x + 30, eyeY, eyeSize, eyeSize - blinkOffset);
        } else {
            ctx.fillRect(this.x + 5, eyeY, eyeSize, eyeSize - blinkOffset);
            ctx.fillRect(this.x + 10, eyeY, eyeSize, eyeSize - blinkOffset);
        }
        
        // Draw mouth
        if (this.isJumping) {
            // Open mouth when jumping
            ctx.fillRect(this.x + 15, this.y + 35 + bounceOffset, 10, 6);
        } else {
            ctx.fillRect(this.x + 15, this.y + 35 + bounceOffset, 10, 3);
        }
        
        // Draw unlimited jump indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(this.x + this.width + 5, this.y + 10, 4, 4);
        ctx.fillRect(this.x + this.width + 5, this.y + 20, 4, 4);
        ctx.fillRect(this.x + this.width + 5, this.y + 30, 4, 4);
        
        ctx.restore();
    }
    
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

// Platform Classes
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    render(ctx) {
        // Create gradient for platform
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(1, '#654321');
        ctx.fillStyle = gradient;
        
        // Draw platform with rounded corners
        this.roundRect(ctx, this.x, this.y, this.width, this.height, 5);
        ctx.fill();
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.roundRect(ctx, this.x + 2, this.y + 2, this.width - 4, this.height / 2, 3);
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        this.roundRect(ctx, this.x, this.y, this.width, this.height, 5);
        ctx.stroke();
    }
    
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

class MovingPlatform extends Platform {
    constructor(x, y, width, height, startX, endX, speed) {
        super(x, y, width, height);
        this.startX = startX;
        this.endX = endX;
        this.speed = speed;
        this.direction = 1;
    }
    
    update() {
        this.x += this.speed * this.direction;
        
        if (this.x >= this.endX) {
            this.direction = -1;
        } else if (this.x <= this.startX) {
            this.direction = 1;
        }
    }
    
    render(ctx) {
        // Create gradient for moving platform
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#FF6347');
        gradient.addColorStop(1, '#8B0000');
        ctx.fillStyle = gradient;
        
        // Draw platform with rounded corners
        this.roundRect(ctx, this.x, this.y, this.width, this.height, 5);
        ctx.fill();
        
        // Add moving indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < this.width; i += 15) {
            ctx.fillRect(this.x + i, this.y + 5, 8, 2);
        }
        
        // Add border
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2;
        this.roundRect(ctx, this.x, this.y, this.width, this.height, 5);
        ctx.stroke();
    }
}

class BreakablePlatform extends Platform {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.broken = false;
    }
    
    render(ctx) {
        if (!this.broken) {
            ctx.fillStyle = '#DAA520';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = '#B8860B';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

// Collectible and Hazard Classes
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.animationFrame = 0;
    }
    
    render(ctx) {
        this.animationFrame += 0.15;
        const scale = 1 + Math.sin(this.animationFrame) * 0.15;
        const rotation = this.animationFrame * 0.5;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(scale, scale);
        ctx.rotate(rotation);
        
        // Create gradient for coin
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.7, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Add shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-3, -3, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Add coin symbol
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(-1.5, -6, 3, 12);
        ctx.fillRect(-6, -1.5, 12, 3);
        
        // Add glow effect
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

class Hazard {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    render(ctx) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw spikes
        ctx.fillStyle = '#8B0000';
        for (let i = 0; i < this.width; i += 10) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y + this.height);
            ctx.lineTo(this.x + i + 5, this.y);
            ctx.lineTo(this.x + i + 10, this.y + this.height);
            ctx.fill();
        }
    }
}

class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.animationFrame = 0;
    }
    
    render(ctx) {
        this.animationFrame += 0.05;
        
        // Draw flag
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw flag pole
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 15, this.y - 20, 10, 80);
        
        // Draw flag
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x + 25, this.y - 15, 30, 20);
        
        // Animated sparkles
        ctx.fillStyle = '#FFFF00';
        for (let i = 0; i < 5; i++) {
            const sparkleX = this.x + Math.sin(this.animationFrame + i) * 30;
            const sparkleY = this.y + Math.cos(this.animationFrame + i) * 30;
            ctx.fillRect(sparkleX, sparkleY, 3, 3);
        }
    }
}

// Particle class for visual effects
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.color = color;
        this.life = 1.0;
        this.decay = 0.02;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.life -= this.decay;
        this.size *= 0.98;
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
}); 