class ArrayBoom extends Phaser.Scene {
    constructor() {
        super("arrayBoom");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.my.sprite.enemyBullet = [];
        this.maxBullets = 10;           // Don't create more than this many bullets


        this.myLives = 3;       // record a score as a class variable
        this.myScore = 0;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "duck_yellow.png");
        this.load.image("bullets", "icon_duck.png");

        this.load.image("normalEnemy", "target_red3.png");
        this.load.image("enemyBullets", "crosshair_red_small.png");

        // For animation
        //this.load.image("whitePuff00", "whitePuff00.png");
        //this.load.image("whitePuff01", "whitePuff01.png");
        //this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles
        //this.load.audio("dadada", "jingles_NES13.ogg");
    }

    create() {
        let my = this.my;

        my.sprite.player = this.add.sprite(game.config.width/8, game.config.height - 80, "player");
        my.sprite.player.setScale(1);

        my.sprite.normalEnemy = this.add.sprite(game.config.width - 100, 80, "normalEnemy");
        my.sprite.normalEnemy.setScale(0.25);
        my.sprite.normalEnemy.scorePoints = 25;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                //{ key: "whitePuff00" },
                //{ key: "whitePuff01" },
                //{ key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.up = this.input.keyboard.addKey("w");
        this.down = this.input.keyboard.addKey("s");
        //this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        // Enemy fires bullets every 2 seconds
        this.time.addEvent({
            delay: 2000,
            callback: this.enemyFire,
            callbackScope: this,
            loop: true
        });

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Array Boom.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

        // Put score on screen
        my.text.score = this.add.bitmapText(550, 0, "rocketSquare", "Score " + this.myScore);

        // put lives on screen
        my.text.lives = this.add.bitmapText(640, 570, "rocketSquare", "Lives " + this.myLives);


        // Put title on screen
        this.add.text(10, 5, "Ducks Revenge", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

    }

    update() {
        let my = this.my;

        // Moving left
        if (this.up.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.y > (my.sprite.player.displayHeight/2)) {
                my.sprite.player.y -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.down.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.player.y < (game.config.height - (my.sprite.player.displayHeight/2))) {
                my.sprite.player.y += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/6), "bullets")
                );
            }
        }

        

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.x - bullet.displayWidth/2 < config.width);

        // Check for collision with the normalEnemy
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.normalEnemy, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.normalEnemy.x, my.sprite.normalEnemy.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.x = 1000;
                my.sprite.normalEnemy.visible = false;
                my.sprite.normalEnemy.y = -100;
                // Update score
                this.myScore += my.sprite.normalEnemy.scorePoints;
                this.updateScore();
                // Play sound
                // this.sound.play("dadada", {
                //     volume: 1   // Can adjust volume using this, goes from 0 to 1
                // });
                // Have new normalEnemy appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.normalEnemy.visible = true;
                    this.my.sprite.normalEnemy.y = Math.random() * config.height - 100;
                }, this);

            }
        }

        // Check for collision with the player
        for (let enemyBullet of my.sprite.enemyBullet) {
            if (this.collides(my.sprite.player, enemyBullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                enemyBullet.x = -1000;

                //my.sprite.player.visible = false;
                //my.sprite.player.y = -100;
                // Update score
                this.myLives -= 1;
                this.myScore -= 10;
                this.updateScore();
                // Play sound
                // this.sound.play("dadada", {
                //     volume: 1   // Can adjust volume using this, goes from 0 to 1
                // });


            }
        }


        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.x += this.bulletSpeed;
        }

        // Make all of the enemy bullets move
        for (let enemyBullet of my.sprite.enemyBullet) {
            enemyBullet.x -= this.bulletSpeed;
        }

        // if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
        //     this.scene.start("fixedArrayBullet");
        // }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    // Enemy fires bullets
    enemyFire() {
        let my = this.my;
        my.sprite.enemyBullet.push(this.add.sprite(
            my.sprite.normalEnemy.x, my.sprite.normalEnemy.y, "enemyBullets")
        );
    }

    // Call the Enemy fire method every 2 seconds

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
        my.text.lives.setText("Lives " + this.myLives);
        if (this.myLives == 0) {
            this.scene.start("gameOver");
        }
    }

    //reset all game variables
    resetGame() {
        this.myLives = 3;
        this.myScore = 0;
    }

}
         