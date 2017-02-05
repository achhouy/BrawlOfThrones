window.onload = function () {
    document.getElementById("gameWorld").focus();
};

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight,
        locX, locY,
        this.frameWidth * scaleBy,
        this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 350, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    Entity.prototype.draw.call(this);
}

function Unicorn(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/ryu.png"), 0, 0, 150, 150, 0.1, 10, true, false);
    this.walkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ryu.png"), 0, 1 * 150, 150, 150, 0.1, 10, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ryu.png"), 0, 2 * 150, 150, 150, 0.05, 12, false, false);
    this.punchAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ryu.png"), 0, 3 * 150, 150, 150, 0.05, 5, false, false);
    this.kickAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ryu.png"), 0, 4 * 150, 150, 150, 0.05, 8, false, false);
    this.fallAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ryu.png"), 0, 5 * 150, 150, 150, 0.05, 12, false, false);
    this.walking = false;
    this.jumping = false;
    this.falling = false;
    this.punching = false;
    this.kicking = false;
    this.radius = 100;
    this.ground = 240;
    Entity.call(this, game, 550, 240);
}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {
    if (this.game.walk) this.walking = true; else this.walking = false;
    if (this.game.left) { this.left = true; this.right = false; } else { this.left = false; this.right = true };
    if (this.game.space) this.jumping = true;
    if (this.game.punch) this.punching = true;
    if (this.game.kick) this.kicking = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 150;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }

    if (this.falling) {
        if (this.fallAnimation.isDone()) {
            this.fallAnimation.elapsedTime = 0;
            this.falling = false;
        }
        var fallDistance = this.fallAnimation.elapsedTime / this.fallAnimation.totalTime;
        var totalHeight = -150;

        if (fallDistance > 0.5)
            fallDistance = 1 - fallDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (fallDistance * fallDistance - fallDistance));
        this.y = this.ground - height;
    }

    if (this.punching) {
        if (this.punchAnimation.isDone()) {
            this.punchAnimation.elapsedTime = 0;
            this.punching = false;
        }
    }

    if (this.kicking) {
        if (this.kickAnimation.isDone()) {
            this.kickAnimation.elapsedTime = 0;
            this.kicking = false;
        }
    }

    if (this.walking && this.right) {
        // if (this.walkAnimation.isDone()) {
        //     this.walkAnimation.elapsedTime = 0;
        //     this.walking = false;
        // }

        // var rightDistance = this.walkAnimation.elapsedTime / this.walkAnimation.totalTime;
        // var totalRight = 20;

        // if (rightDistance > 0.5)
        //     rightDistance = 1 - rightDistance;

        // var right = totalRight * (-1 * (rightDistance * rightDistance - rightDistance));
        this.x += 2;
        if (this.x > 660) {
            this.falling = true;
        }
    }

    if (this.walking && this.left) {
        // if (this.walkAnimation.isDone()) {
        //     this.walkAnimation.elapsedTime = 0;
        //     this.walking = false;
        // }

        // var leftDistance = this.walkAnimation.elapsedTime / this.walkAnimation.totalTime;
        // var totalLeft = 20;

        // if (leftDistance > 0.5)
        //     leftDistance = 1 - leftDistance;

        // var left = totalLeft * (-1 * (leftDistance * leftDistance - leftDistance));
        this.x -= 2;
        if (this.x < 125) {
            console.log(this.x);
            this.falling = true;
        }
    }
    
    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.punching) {
        this.punchAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.kicking) {
        this.kickAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.walking) {
        this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.falling) {
        this.fallAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/ryu.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var unicorn = new Unicorn(gameEngine);

    //gameEngine.addEntity(bg);
    gameEngine.addEntity(unicorn);

    gameEngine.init(ctx);
    gameEngine.start();
});
