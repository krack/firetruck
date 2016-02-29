var scene;

var Babylon = function () {
    this.canvas = document.getElementById("renderCanvas");

    // Check support
    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {

        // Babylon
        var engine = new BABYLON.Engine(canvas, true);

        var newScene;
        // Loading the scene we want
        newScene = CreateGameScene(engine);

        //Validating
        newScene.activeCamera.attachControl(canvas);
        scene = newScene;

        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
            if (scene)
                scene.render();
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }
};