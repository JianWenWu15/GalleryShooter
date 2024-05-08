class movement extends Phaser.Scene {
    constructor() {
        super("movementScene");

        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        // Create variables to hold constant values for sprite locations
        this.bodyX = 400;
        this.bodyY = 450;

        let pencil;

        

    }

    preload() {
        this.load.setPath("./assets/");
        // body
        this.load.image("Player", "character_squareGreen.png");
        

        this.load.image("Pencil", "item_pencil.png");

        // update instruction text
        document.getElementById('description').innerHTML = '<h2>movement.js</h2>'
    }
    
    
    create() {
        // update instruction text
        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "Player");

        // Create A key
        this.akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        // Create D key
        this.dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);  
        
        // Create Space key
        this.spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spacekey.on('down', (key, event) => {
            if (!this.pencil) {
                this.pencil = this.add.sprite(my.sprite.body.x, my.sprite.body.y, "Pencil");
            
            }
            
        });
        

        

        



    }

    update() {
        let my = this.my;   // create an alias to this.my for readability

        //Event Input: Move Left

        this.akey.on('down', (key, event) =>  {
            for (let monsterParts in my.sprite) {
                // make sure the player doesn't move off the screen
                if (my.sprite[monsterParts].x > 0) {
                    my.sprite[monsterParts].x -= 1;
                }
                
            }
        });

        //Event Input: Move Right
        this.dkey.on('down', (key, event) =>  {
            for (let monsterParts in my.sprite) {
                // make sure the player doesn't move off the screen
                if (my.sprite[monsterParts].x < 800) {
                    my.sprite[monsterParts].x += 1;
                }
                
            }
        });

        // Event Input: Space Key Emit Pencil
        if (this.pencil) {
            this.pencil.y -= 5;
            if (this.pencil.y < 0) {
                this.pencil.destroy();
                this.pencil = null;
            }
        }
       
        
        

       

        



    }

}