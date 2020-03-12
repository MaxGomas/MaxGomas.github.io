function start(){
    

    window.addEventListener("keydown", function(e) {
        if(document.activeElement!=document.getElementById("gameCanvas"));
        document.getElementById("gameCanvas").focus();
        window.removeEventListener("keydown", this);
    });

    var canvas = document.getElementById("gameCanvas");
    var engine = new BABYLON.Engine(canvas, true); 
    var posGround = 0;
    var sphere;
    var obstacleGround = new Array(); 
    var tabPlatform = new Array();
    var textureGround = "https://www.babylonjs-playground.com/textures/grass.jpg";
    var scene;
    var time = 0; // seconds
    var score = 0;
    var BLUE = new BABYLON.Color3(0.76,0.98,0.97);
    var YELLOW = new BABYLON.Color3(0.99, 0.99, 0.59);
    var RED = new BABYLON.Color3(0.99, 0.41, 0.39);
    var GREEN = new BABYLON.Color3(0.46, 0.86, 0.46);
    openFullscreen();
    

    function sameColor(ground, sphere){
        return (ground.couleur === sphere.couleur);
    }

    function distanceEucl(x1, y1, x2, y2){
        return (Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2)));
    }

    function intersectGround(object, sphere){

//        console.log((sphere.material.diffuseColor===ground.material.diffuseColor))

        if(object.id.includes("cercle")){
            //console.log(distanceEucl(sphere.x, sphere.z, object._absolutePosition.x, object._absolutePosition.z))
            if(!sameColor(sphere, object) && distanceEucl(sphere.position.x, sphere.position.z, object._absolutePosition.x, object._absolutePosition.z)<30){
                return true;
            }else{
                return false;
            }
        }else if(object.id.includes("ball")){
            if(!sameColor(sphere, object) && distanceEucl(sphere.position.x, sphere.position.z, object.position.x, object.position.z)<30){
                return true;
            }else{
                return false;
            }
        }else if(!sameColor(sphere, object) && sphere.position.z > object.position.z+object._minZ && sphere.position.z < object.position.z+object._maxZ 
           && 
           sphere.position.x > object.position.x+object._minX && sphere.position.x < object.position.x+object._maxX
        ){
            return true;
        }else{
            return false;
        }
    }

    function openFullscreen() {
        let elem = canvas;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen();
        }
        canvas.focus();
      }


    function createGround(x){
        let tab = new Array();

        let ground = BABYLON.Mesh.CreateGround("ground", 200, 200, 1, scene, false);
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        //groundMaterial.diffuseTexture = new BABYLON.Texture(textureGround, scene);
        
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        ground.position = new BABYLON.Vector3(0,0,posGround);
        posGround += 200;

        tab.push(ground);
        
        tabPlatform.push(tab);

    }

    function createChangeColorGround(scene, sphereMat){
        //Ground avant
        let tab = new Array();

        x = posGround;
        let ground = BABYLON.Mesh.CreateGround("ground", 200, 75, 1, scene, false);
        let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        //groundMaterial.diffuseTexture = new BABYLON.Texture(textureGround, scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        ground.position = new BABYLON.Vector3(0,0,(x-25)-(75/2));
        
        //change color back
        let gChangeColor = BABYLON.Mesh.CreateGround("gChangeColor", 50, 50, 1, scene, false);
        let gMaterialChangeColor = new BABYLON.StandardMaterial("gMaterialChangeColor", scene);
        gMaterialChangeColor.diffuseColor = BABYLON.Color3.White();
        gChangeColor.material = gMaterialChangeColor;
        //gChangeColor.position = new BABYLON.Vector3(0,400, -2000);
        //Ground changement
        gChangeColor.position = new BABYLON.Vector3(0,0,x);
        gChangeColor.physicsImpostor = new BABYLON.PhysicsImpostor(gChangeColor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);	
        
        //Ground après
        let ground2 = BABYLON.Mesh.CreateGround("ground", 200, 75, 1, scene, false);
        let groundMaterial2 = new BABYLON.StandardMaterial("ground", scene);
        //groundMaterial2.diffuseTexture = new BABYLON.Texture(textureGround, scene);
        groundMaterial2.specularColor = BABYLON.Color3.Black();
        ground2.material = groundMaterial;
        ground2.physicsImpostor = new BABYLON.PhysicsImpostor(ground2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        ground2.position = new BABYLON.Vector3(0,0,(x+25)+(75/2));
        posGround+=200;

        scene.onBeforeRenderObservable.add(()=>{
            if(sphere.position.z > gChangeColor.position.z -25 && sphere.position.z < gChangeColor.position.z +25 ){
                let rand = Math.random();
                if(rand < 1/4){
                    sphereMat.diffuseColor = RED;
                    sphere.couleur = "RED";
                }
                else if(rand >= 1/4 && rand < 2/4){
                    sphereMat.diffuseColor = YELLOW;
                    sphere.couleur = "YELLOW";
                }
                else if(rand >= 2/4 && rand < 3/4) {
                    sphereMat.diffuseColor = BLUE;
                    sphere.couleur = "BLUE";
                }
                else {
                    sphereMat.diffuseColor = GREEN;
                    sphere.couleur = "GREEN";
                }
            }
        })

        tab.push(ground);
        tab.push(gChangeColor);
        tab.push(ground2);

        tabPlatform.push(tab);
    }


    function obstacleGroundColor(){ 
        let tab = new Array();

        x = posGround;
        //Red 
        let ground1 = BABYLON.Mesh.CreateGround("ground1", 50, 200, 1, scene, false);
        ground1.couleur = "RED";
        let ground1Material = new BABYLON.StandardMaterial("ground1", scene);
        ground1Material.specularColor = BABYLON.Color3.Black();
        ground1Material.diffuseColor = RED;
        ground1.material = ground1Material;
        ground1.physicsImpostor = new BABYLON.PhysicsImpostor(ground1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        ground1.position = new BABYLON.Vector3(-75,0,x);
        
        //On push notre obstacle dans le tableau d'obstacle
        obstacleGround.push(ground1);
        
        //Green
        let ground2 = BABYLON.Mesh.CreateGround("ground2", 50, 200, 1, scene, false);
        ground2.couleur = "GREEN";
        let ground2Material = new BABYLON.StandardMaterial("ground2", scene);
        ground2Material.specularColor = BABYLON.Color3.Black();
        ground2Material.diffuseColor = GREEN;
        ground2.material = ground2Material;
        ground2.physicsImpostor = new BABYLON.PhysicsImpostor(ground2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        ground2.position = new BABYLON.Vector3(-25,0,x);
        //Idem
        obstacleGround.push(ground2);

        //Blue
        let ground3 = BABYLON.Mesh.CreateGround("ground3", 50, 200, 1, scene, false);
        ground3.couleur = "BLUE";
        let ground3Material = new BABYLON.StandardMaterial("ground3", scene);
        ground3Material.specularColor = BABYLON.Color3.Black();
        ground3Material.diffuseColor = BLUE;
        ground3.material = ground3Material;
        ground3.physicsImpostor = new BABYLON.PhysicsImpostor(ground3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        ground3.position = new BABYLON.Vector3(25,0,x);
        //Idem
        obstacleGround.push(ground3);
    
        //Yellow
        let ground4 = BABYLON.Mesh.CreateGround("ground4", 50, 200, 1, scene, false);
        ground4.couleur = "YELLOW";
        let ground4Material = new BABYLON.StandardMaterial("ground4", scene);
        ground4Material.specularColor = BABYLON.Color3.Black();
        ground4Material.diffuseColor = YELLOW;
        ground4.material = ground4Material;
        ground4.physicsImpostor = new BABYLON.PhysicsImpostor(ground4, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        ground4.position = new BABYLON.Vector3(75,0,x);
        //Idem
        obstacleGround.push(ground4);

        posGround+=200;

        tab.push(ground1);
        tab.push(ground2);
        tab.push(ground3);
        tab.push(ground4);


        tabPlatform.push(tab);
        
    }

    function obstacleBallColor(scene){
        let tab = new Array();

        x = posGround;

        let groundBall = BABYLON.Mesh.CreateGround("groundBall",200, 200, 1, scene, false);
        let groundMaterial = new BABYLON.StandardMaterial("groundBall", scene);
        //groundMaterial.diffuseTexture = new BABYLON.Texture(textureGround, scene);
        groundBall.material = groundMaterial;
        groundBall.material = groundMaterial;
        groundBall.position = new BABYLON.Vector3(0,0,x);
        ball = BABYLON.Mesh.CreateSphere("ball", 16, 26, scene);
        let ballMat = new BABYLON.StandardMaterial("ground", scene);
        let rand = Math.random();
        if(rand < 1/4){
            //ballMat.diffuseColor = BABYLON.Color3.Red();
            ball.couleur= "RED";
            ballMat.diffuseColor = RED;
        }
        else if(rand >= 1/4 && rand < 2/4){
            //ballMat.diffuseColor = BABYLON.Color3.Yellow();
            ball.couleur= "YELLOW";
            ballMat.diffuseColor = YELLOW;
        }
        else if(rand >= 2/4 && rand < 3/4) {
            //ballMat.diffuseColor = BABYLON.Color3.Blue();
            ball.couleur= "BLUE";
            ballMat.diffuseColor = BLUE;
        }
        else {
            //ballMat.diffuseColor = BABYLON.Color3.Green();
            ball.couleur= "GREEN";
            ballMat.diffuseColor = GREEN;
        }
        ball.material = ballMat;
        ball.position.y = 16;
        ball.position.z = x;

        ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 40, restitution: 0.9, friction: 0.05 }, scene);

        obstacleGround.push(ball);

        let pos = 0;
        scene.registerBeforeRender(function () {
            pos +=0.09;
            var sign = Math.cos(pos)/Math.abs(Math.cos(pos));
            ball.position.x += 5 * sign ;
        });
        
        groundBall.physicsImpostor = new BABYLON.PhysicsImpostor(groundBall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        posGround+=200;

        tab.push(groundBall);
        tab.push(ball);

        tabPlatform.push(tab);
        
    }

    function moveBoxObstacle(scene){
        let tab = new Array();

        x = posGround;

        let ground2Box = BABYLON.Mesh.CreateGround("ground2Box",200, 200, 1, scene, false);
        ground2Box.position = new BABYLON.Vector3(0,0,x);
        let groundMaterial = new BABYLON.StandardMaterial("groundBox", scene);
        //groundMaterial.diffuseTexture = new BABYLON.Texture(textureGround, scene);
        ground2Box.material = groundMaterial;
        let box = BABYLON.MeshBuilder.CreateBox("Box",{height: 80, width: 60, depth: 10} ,scene);
        let box2 = BABYLON.MeshBuilder.CreateBox("Box2",{height: 80, width: 60, depth: 10} ,scene);
        box.position.y += 40;
        box.position.z = x-50;
        box2.position.y += 40;
        box2.position.z = x+40;

       
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 400, restitution: 0.9, friction: 0.05 }, scene);
        box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 400, restitution: 0.9, friction: 0.05 }, scene);

        let a = 0;
        scene.registerBeforeRender(function () {
            a +=0.0065;
            let sign = Math.cos(a)/Math.abs(Math.cos(a));
            box.position.x += 0.3 * sign ;
            box2.position.x -= 0.3 *sign;
        });

        ground2Box.physicsImpostor = new BABYLON.PhysicsImpostor(ground2Box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        posGround+=200;

        tab.push(ground2Box);
        tab.push(box);
        tab.push(box2);

        tabPlatform.push(tab);
    }

    function obstacleBar(scene){
        let tab = new Array();

        x = posGround;

        let groundBar = BABYLON.Mesh.CreateGround("groundBar",200, 200, 1, scene, false);
        groundBar.position = new BABYLON.Vector3(0,0,x);
        let groundMaterial = new BABYLON.StandardMaterial("groundBox", scene);
        //groundMaterial.diffuseTexture = new BABYLON.Texture(textureGround, scene);
        groundBar.material = groundMaterial;
        let bar = BABYLON.MeshBuilder.CreateBox("bar",{height: 30, width: 60, depth: 15} ,scene);
        let bar2 = BABYLON.MeshBuilder.CreateBox("bar",{height: 30, width: 60, depth: 15} ,scene);

        BABYLON.Animation.CreateAndStartAnimation('boxscale', bar, 'scaling.x', 30, 120, 1.0, 1.5);  
        BABYLON.Animation.CreateAndStartAnimation('boxscale', bar2, 'scaling.x', 30, 120, 1.0, 1.5);        
      
        bar.position.y = 40;
        bar.position.z = x;
        bar.position.x = 55;
        

        bar2.position.y = 40;
        bar2.position.z = x;
        bar2.position.x = -55;

        bar.physicsImpostor = new BABYLON.PhysicsImpostor(bar, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 900, restitution: 0.9, friction: 0.05 }, scene);
        bar2.physicsImpostor = new BABYLON.PhysicsImpostor(bar2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 900, restitution: 0.9, friction: 0.05 }, scene);

        groundBar.physicsImpostor = new BABYLON.PhysicsImpostor(groundBar, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        posGround+=200;
        
        tab.push(groundBar);
        tab.push(bar);
        tab.push(bar2);

        tabPlatform.push(tab);

    }


    function labyrinthe(){
        
        let tab = new Array();
        x = posGround;

        let groundBox = BABYLON.Mesh.CreateGround("groundBox",200, 200, 1, scene, false);
        let groundMaterial = new BABYLON.StandardMaterial("groundBox", scene);
        //groundMaterial.diffuseTexture = new BABYLON.Texture(textureGround, scene);
        groundBox.material = groundMaterial;
        groundBox.position = new BABYLON.Vector3(0,0,x);
        let box = BABYLON.MeshBuilder.CreateBox("Box",{height: 30, width: 100, depth: 15} ,scene);
        let box2 = BABYLON.MeshBuilder.CreateBox("Box2",{height: 30, width: 100, depth: 15} ,scene);
        let box3 = BABYLON.MeshBuilder.CreateBox("Box3",{height: 30, width: 100, depth: 15} ,scene);

        box.position.y = 15;
        box.position.z = x-60;
        box.position.x = 50;
        
        box2.position.y = 15;
        box2.position.z = x;
        box2.position.x = -50;
        
        box3.position.y = 15;
        box3.position.z = x+60;
        box3.position.x = 50;

    
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 200, restitution: 0.9, friction: 0.05 }, scene);
        box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 200, restitution: 0.9, friction: 0.05 }, scene);
        box3.physicsImpostor = new BABYLON.PhysicsImpostor(box3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 200, restitution: 0.9, friction: 0.05 }, scene);

        groundBox.physicsImpostor = new BABYLON.PhysicsImpostor(groundBox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        posGround+=200;

        tab.push(groundBox);
        tab.push(box);
        tab.push(box2);
        tab.push(box3);

        tabPlatform.push(tab);
    }

    function moveGroundObstacle(scene){
        let tab = new Array();

        x = posGround;
        
        let cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 5000, 65, 65, 60, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        cylinder.position = new BABYLON.Vector3(0,0,x);
        cylinder.physicsImpostor = new BABYLON.PhysicsImpostor(cylinder, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);


        let disc = BABYLON.MeshBuilder.CreateDisc("cercle", {tessellation: 50, radius : 30}, scene);
        disc.physicsImpostor = new BABYLON.PhysicsImpostor(disc, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        disc.position = new BABYLON.Vector3(0,0,x);
        disc.rotate(BABYLON.Axis.X, Math.PI/2 , BABYLON.Space.WORLD);

        let disc2 = BABYLON.MeshBuilder.CreateDisc("cercle2", {tessellation: 50, radius : 35}, scene);
        disc2.position = new BABYLON.Vector3(0,65,0);
        let gDisc2Material = new BABYLON.StandardMaterial("ground2", scene);
        gDisc2Material.specularColor = BABYLON.Color3.Black();
        gDisc2Material.diffuseColor = BLUE;
        disc2.material = gDisc2Material;
        disc2.physicsImpostor = new BABYLON.PhysicsImpostor(disc2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        
        disc2.parent = disc;

        obstacleGround.push(disc2);
    
        let disc3 = BABYLON.MeshBuilder.CreateDisc("cercle3", {tessellation: 50, radius : 35}, scene);
        disc3.position = new BABYLON.Vector3(0,-65,0);
        let gDisc3Material = new BABYLON.StandardMaterial("ground3", scene);
        gDisc3Material.specularColor = BABYLON.Color3.Black();
        gDisc3Material.diffuseColor = RED;
        disc3.material = gDisc3Material;
        disc3.physicsImpostor = new BABYLON.PhysicsImpostor(disc3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        
        disc3.parent = disc;
        obstacleGround.push(disc3);
        
        let disc4 = BABYLON.MeshBuilder.CreateDisc("cercle4", {tessellation: 50, radius : 35}, scene);
        disc4.position = new BABYLON.Vector3(65,0,0);
        let gDisc4Material = new BABYLON.StandardMaterial("ground4", scene);
        gDisc4Material.specularColor = BABYLON.Color3.Black();
        gDisc4Material.diffuseColor = YELLOW;
        disc4.material = gDisc4Material;
        disc4.physicsImpostor = new BABYLON.PhysicsImpostor(disc4, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        
        disc4.parent = disc;
        obstacleGround.push(disc4);
    
        let disc5 = BABYLON.MeshBuilder.CreateDisc("cercle5", {tessellation: 50, radius : 35}, scene);
        disc5.position = new BABYLON.Vector3(-65,0,0);
        let gDisc5Material = new BABYLON.StandardMaterial("ground5", scene);
        gDisc5Material.specularColor = BABYLON.Color3.Black();
        gDisc5Material.diffuseColor = GREEN;
        disc5.material = gDisc5Material;
        disc5.physicsImpostor = new BABYLON.PhysicsImpostor(disc5, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
        
        disc5.parent = disc;

        obstacleGround.push(disc5);
    
        let a = 0;
        scene.registerBeforeRender(function () {
            disc.rotate(BABYLON.Axis.Z, Math.PI / 250, BABYLON.Space.LOCAL);
        });

        posGround += 200;

        tab.push(cylinder);
        tab.push(disc);
        tab.push(disc2);
        tab.push(disc3);
        tab.push(disc4);
        tab.push(disc5);

        tabPlatform.push(tab);

    }

    function decalerGround(tabObj){
        for(let i=0; i<tabObj.length;i++){
            let x = tabObj[i].position.x;
            let y = tabObj[i].position.y;
            let z = tabObj[i].position.z;
            tabObj[i].position = new BABYLON.Vector3(x,y,posGround+z);
        }
        //posGround += 200;
    }


    function meurt(){
        time = 0; //reset timer
        score = 0; 
        sphere.physicsImpostor.setAngularVelocity( BABYLON.Vector3.Zero() ); //stop ball mouvment
        sphere.physicsImpostor.setLinearVelocity( BABYLON.Vector3.Zero() );  
        sphere.position.x = 0; // reset ball to origin
        sphere.position.y = 30;
        sphere.position.y = 30;
        sphere.position.z = 0;
    }

    

    let createScene = function () {
        scene = new BABYLON.Scene(engine);
        let camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.setPosition(new BABYLON.Vector3(0, 200, -400));
        camera.attachControl(canvas, true);
        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = (Math.PI / 2) * 0.99;
        camera.lowerRadiusLimit = 150;
        
        // Enable Physics
        let g = new BABYLON.Vector3(0, -400, 0);
        let dt = 0.5;
        let physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(g, physicsPlugin);

        //music
        var musicF = new BABYLON.Sound("musicF", "music/musicFond.mp3", scene, function(){musicF.play()}, {loop : true, autoplay : true});

        // //change color back
        // let gChangeColor = BABYLON.Mesh.CreateGround("gChangeColor", 50, 50, 1, scene, false);
        // let gMaterialChangeColor = new BABYLON.StandardMaterial("gMaterialChangeColor", scene);
        // gMaterialChangeColor.diffuseColor = BABYLON.Color3.White();
        // gChangeColor.material = gMaterialChangeColor;
        // gChangeColor.position = new BABYLON.Vector3(0,400, -2000);
        
        

        //scene.clearColor = new BABYLON.Color3(0, 0, 0);

        //light
        let light2 = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, 0), scene);
        let light1 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 1), scene);
        //let light1 = new BABYLON.DirectionalLight("Hemilight", new BABYLON.Vector3(0, -1, 0), scene);

        light1.intensity = 0.5;
        light1.specularColor = BABYLON.Color3.White();
        light1.diffuse = BABYLON.Color3.White();
        light1.state = "off";

        light2.intensity = 0.5;
        light2.specularColor = BABYLON.Color3.White();
        light2.diffuse = BABYLON.Color3.White();
        light2.state = "off";
         // Sphere
        
        //sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 26, scene);
         sphere = BABYLON.MeshBuilder.CreateIcoSphere("ico", {radius: 13, radiusY: 13, subdivisions: 2}, scene);
         sphere.couleur = "YELLOW";
         let sphereMat = new BABYLON.StandardMaterial("ground", scene);
         //sphereMat.specularColor = BABYLON.Color3.White();
         sphereMat.diffuseColor = YELLOW;
         //sphereMat.emissiveColor = YELLOW;
         sphere.material = sphereMat;
         sphere.position.y +=30;
 
         camera.target = sphere;
         camera.radius = 200;
 
         light2.parent = camera;
	

        //let shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);

        //SkyBox
        
        let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000.0}, scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("http://www.babylonjs-playground.com/textures/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        

        
        // Ground
        createGround();

        //Ground suivant
        createGround();

        //moveGroundObstacle(scene);

        
        createChangeColorGround(scene, sphereMat);

        createGround();

        obstacleBar(scene);

        createGround();

        obstacleBallColor(scene);

        createGround();

        labyrinthe();

        createGround();

        obstacleGroundColor();

       // createGround();

     

       // createGround();

        moveBoxObstacle(scene);

        // obstacleGroundColor();

        // createGround();

       

        // Keyboard events
        let inputMap ={};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {								
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));


        // Game/Render loop
        scene.onBeforeRenderObservable.add(()=>{
        

            if(inputMap["z"]){
                sphere.position.z+=3;
                sphere.rotate(BABYLON.Axis.X, Math.PI/15 , BABYLON.Space.WORLD);
                ancScore = score;
                score = sphere.position.z / 200;
                score = Math.trunc(score);
                textBlock2.text = new String(score);
                if(ancScore!=score){
                    console.log("changement de plateforem");
                    let min = 0;
                    for(var i = 1; i < tabPlatform.length ; i++){
                        if(tabPlatform[i][0]._absolutePosition.z < tabPlatform[min][0]._absolutePosition.z){
                            min = i;
                        }
                    }
                    console.log("min : "+min);
                    decalerGround(tabPlatform[min]);

                }
            } 
            if(inputMap["q"]){
                sphere.position.x-=3
                sphere.rotate(BABYLON.Axis.Z, Math.PI/15 , BABYLON.Space.WORLD);
            } 
            if(inputMap["s"]){
                sphere.position.z-=3
                sphere.rotate(BABYLON.Axis.X, -(Math.PI/15) , BABYLON.Space.WORLD);
            } 
            if(inputMap["d"]){
                sphere.position.x+=3
                sphere.rotate(BABYLON.Axis.Z, -(Math.PI/15) , BABYLON.Space.WORLD);
            } 
            if(sphere.position.y <= -200){
                meurt();
            }
            sphere.physicsImpostor.setAngularVelocity( BABYLON.Vector3.Zero() );
            //sphere.physicsImpostor.setLinearVelocity( BABYLON.Vector3.Zero() );  

            
        });

        scene.onBeforeRenderObservable.add(()=>{
            for(i in obstacleGround){
                if (intersectGround(obstacleGround[i], sphere)) {
                    console.log("PERDU");
                    meurt();
                }else{
                    //console.log("OK");
                }
            }
        });

        //Change Ball Color on platform
        // scene.onBeforeRenderObservable.add(()=>{
        //     if(sphere.position.z > gChangeColor.position.z -25 && sphere.position.z < gChangeColor.position.z +25 ){
        //         let rand = Math.random();
        //         if(rand < 1/4){
        //             sphereMat.diffuseColor = RED;
        //             sphere.couleur = "RED";
        //         }
        //         else if(rand >= 1/4 && rand < 2/4){
        //             sphereMat.diffuseColor = YELLOW;
        //             sphere.couleur = "YELLOW";
        //         }
        //         else if(rand >= 2/4 && rand < 3/4) {
        //             sphereMat.diffuseColor = BLUE;
        //             sphere.couleur = "BLUE";
        //         }
        //         else {
        //             sphereMat.diffuseColor = GREEN;
        //             sphere.couleur = "GREEN";
        //         }
        //     }
        // })

    // Create Impostors

    //ground2.physicsImpostor = new BABYLON.PhysicsImpostor(ground2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);
    //ground3.physicsImpostor = new BABYLON.PhysicsImpostor(ground3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9, friction: 0.05 }, scene);	


    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 0.9, friction: 0.05 }, scene);

    // GUI
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    
    let textBlock = new BABYLON.GUI.TextBlock("text", new String(time));
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.paddingTop = "33px";
    textBlock.paddingRight = "50px";

    let rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = 0.1;
    rect1.height = "40px";
    rect1.cornerRadius = 20;
    rect1.color = "Blue";
    rect1.thickness = 4;
    rect1.background = "grey";
    rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rect1.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
    rect1.top = "20px";
    rect1.left = "20px";
    advancedTexture.addControl(rect1);    


    advancedTexture.addControl(textBlock);

    let handle = window.setInterval(() => {
        time++;
        textBlock.text = new String(time)

    }, 1000);

    let advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    let textBlock2 = new BABYLON.GUI.TextBlock("text", new String(score));
    textBlock2.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    textBlock2.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock2.paddingTop = "93px";
    textBlock2.paddingRight = "50px";

    let rect2 = new BABYLON.GUI.Rectangle();
    rect2.width = 0.1;
    rect2.height = "40px";
    rect2.cornerRadius = 20;
    rect2.color = "Blue";
    rect2.thickness = 4;
    rect2.background = "grey";
    rect2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rect2.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
    rect2.top = "80px";
    rect2.left = "20px";
    advancedTexture2.addControl(rect2);    

    advancedTexture2.addControl(textBlock2);

	

    return scene;
    }

        /******* End of the create scene function ******/    
        scene = createScene(); //Call the createScene function
        

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
                scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () { 
                engine.resize();
        });
}