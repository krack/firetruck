var CreateGameScene = function (engine) {
    // create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);

    // target the camera to scene origin
   // camera.setTarget(BABYLON.Vector3.Zero());
    camera.keysUp = [90]; // Touche Z
    camera.keysDown = [83]; // Touche S
    camera.keysLeft = [81]; // Touche Q
    camera.keysRight = [68]; // Touche D;


    // create a basic light, aiming 0,1,0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);



     var createFireTruck = function(scene){
         var fireTruck = BABYLON.Mesh.CreateBox('fireTruck', 10, scene, true);
        var materialFireTruck=new BABYLON.StandardMaterial("textureFireTruck", scene);
        fireTruck.material = materialFireTruck;
        materialFireTruck.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);

        return fireTruck;
    }

    var createEnvironment=function(scene){

          // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        var ground = BABYLON.Mesh.CreateGround('ground1', 1000, 1000, 2, scene);
        var materialGround=new BABYLON.StandardMaterial("groundMaterial", scene);
        materialGround.diffuseTexture = new BABYLON.Texture("images/textures/ground.jpg", scene);
        ground.material = materialGround;


        var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
      //  skybox.infiniteDistance = true;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/textures/skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    }


    var addMove=function(fireTruck, camera){
         //KEYS
        var turnLeft = false;
        var turnRight = false;

        var accelerate = false; 
        var breaking = false;
        window.addEventListener("keydown", function (evt) {

            if (!scene)
                return;

            //console.log(evt.keyCode);

            if (evt.keyCode == 32) {

            }


            //Key LEFT
            if (evt.keyCode == 37) {
                turnLeft = true;
                turnRight = false;

            }

            //Key RIGHT
            if (evt.keyCode == 39) {
                turnLeft = false;
                turnRight = true;
            }

            //Key UP
            if (evt.keyCode == 38) {
                accelerate = true;
                breaking = false;

            }

            //Key BACK
            if (evt.keyCode == 40) {
                breaking = true;
                accelerate = false;
            }

        });

        window.addEventListener("keyup", function (evt) {

            if (evt.keyCode == 37 || evt.keyCode == 39) {
                turnLeft = false;
                turnRight = false;
            }

            if (evt.keyCode == 38 || evt.keyCode == 40) {
                accelerate = false;
                breaking = false;
            }
        });



        //ANIMATION
        var speed = 0;
        scene.registerBeforeRender(function () {

            if (scene.isReady()) {
                
                camera.target = fireTruck.position;

                //SPEED
                if (accelerate && speed < 0.5) {
                    speed += 0.02;
                } else if (speed > 0 && breaking) {
                    speed -= 0.03;
                } else if (speed > 0 && !breaking) {
                    speed -= 0.01;
                }
                else if (Math.round(speed) == 0){
                    speed = 0;
                }

                //ROTATION
                //no turn if no speed
                if (speed > 0) {
                    if (turnLeft) {
                        fireTruck.rotation.y -= 0.03;
                    } else if (turnRight) {
                        fireTruck.rotation.y += 0.03;
                    } else {
                    }
                }
                
                /*for (var i = 0; i < allTires.length; i++) {
                    allTires[i].rotation.x -= speed;
                }*/



                //Test Collisions
              /*  if (border1.intersectsMesh(boundingBox, false) || border2.intersectsMesh(boundingBox, false)) {
                    speed = -speed;
                    
                }*/

                //POSITION
                fireTruck.position.z -= Math.cos(fireTruck.rotation.y) * speed;
                fireTruck.position.x -= Math.sin(fireTruck.rotation.y) * speed;

               /* boundingBox.position = fireTruck.position;
                boundingBox.rotation = fireTruck.rotation;*/

            }

        });

        var gunshot = new BABYLON.Sound("gunshot", "sounds/siren.mp3", scene, null, { loop: true, autoplay: false });

     
        var startedSiren = false;
        window.addEventListener("keydown", function (evt) {
            // Press space key to fire
            if (evt.keyCode === 32 && !startedSiren) {
                gunshot.play();
                startedSiren = true;
            }
        })

        window.addEventListener("keyup", function (evt) {
            // Press space key to fire
            if (evt.keyCode === 32) {
                gunshot.stop();
                startedSiren = false;
            }
        })
    }
    createEnvironment(scene);

    var fireTruck = createFireTruck(scene);
    addMove(fireTruck, camera)

    // move the sphere upward 1/2 of its height
    fireTruck.position.y = 1;

    // return the created scene
    return scene;


   
    
};