var red = 0, green = 0, blue = 0;
var hit = 0;

function makeStruct(names) {
    var names = names.split(' ');
    var count = names.length;
    
    function constructor() {
        for (var i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
        }
    }
    return constructor;
}

var point = makeStruct("x y z");
var vector = makeStruct("x y z");
var color = makeStruct("red green blue");
var material = makeStruct("reflection power dRed dGreen dBlue spec");
var ray = makeStruct("x y z dirx diry dirz");
var sphere = makeStruct("x y z size");
var plane = makeStruct("x y z nx ny nz");
var model = makeStruct("object mat type");
var light = makeStruct("x y z red green blue");


var light1;
var light2;
var minSize;
var maxSize;
var l1Pos;
var l2Pos;
var includeSpec = false;
var t;
var running = false;

function startJS(){
    if(!running){
        running = true;
        var canvas=document.getElementById("canvas1");
        var minRefl;
        var width = document.getElementById("width").value;
        var height = document.getElementById("height").value;

        if(document.getElementById("randMinRefl").checked){
            minRefl = Math.random() * (1.00 - 0.10) + 0.10;
        } else {
            minRefl = document.getElementById("minRefl").value;
        }

        var boundarySize = canvas.height/12;

        if(document.getElementById("randSphereMin").checked){
            minSize = Math.random() * boundarySize;
        } else {
            minSize = document.getElementById("minSpheres").value;
        } 

        if(document.getElementById("randSphereMax").checked){
            maxSize = Math.random() * (canvas.height/3 - boundarySize) + boundarySize;
        } else {
            maxSize = document.getElementById("maxSpheres").value;
        } 

        var boundarySpec = 0.50;

        if(document.getElementById("includeSpec").checked){
            includeSpec = true;
        } 

        if(document.getElementById("randL1Pos").checked){
            l1Pos = new vector(Math.random() * 3000 - 1500, Math.random() * 3000 - 1500, Math.random() * 3000 - 1500);
        } else {
            l1Pos = new vector(document.getElementById("l1X").value, document.getElementById("l1Y").value, document.getElementById("l1Z").value);
        } 

        if(document.getElementById("randL2Pos").checked){
            l2Pos = new vector(Math.random() * 3000 - 1500, Math.random() * 3000 - 1500, Math.random() * 3000 - 1500);
        } else {
            l2Pos = new vector(document.getElementById("l2X").value, document.getElementById("l2Y").value, document.getElementById("l2Z").value);
        } 

        if(document.getElementById("randL1").checked){
            light1 = new light(l1Pos.x, l1Pos.y, l1Pos.z, Math.random(), Math.random(), Math.random());
        } else {
            light1 = new light(l1Pos.x, l1Pos.y, l1Pos.z, document.getElementById("l1R").value, document.getElementById("l1G").value, document.getElementById("l1B").value);
        } 

        if(document.getElementById("randL2").checked){
            light2 = new light(l2Pos.x, l2Pos.y, l2Pos.z, Math.random(), Math.random(), Math.random());
        } else {
            light2 = new light(l2Pos.x, l2Pos.y, l2Pos.z, document.getElementById("l2R").value, document.getElementById("l2G").value, document.getElementById("l2B").value);
        } 

        if(width > 900){
            width = 900;
        } 
        if (height > 400){
            height = 400;
        }
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        var ctx = canvas.getContext("2d");
        var imgData = ctx.getImageData(0, 0, width, height);
        var numObjects = document.getElementById("numSpheres").value; //Math.random() * 6 + 5;
        var models = new Array();
        var x = canvas.height/10;
        var y = canvas.height/10;
        var box = 0;


        for(var i = 0; i < numObjects; ++i){
            var radius = Math.random() * (maxSize - minSize) + minSize;
            box = Math.random() * (maxSize - maxSize*0.9) + maxSize*0.9;
            
            
            if(x + radius/2 > canvas.width){
                x = box;
                y = y + 2*box;
            }

            if(y + radius/3 > canvas.height){
                y = box;
                maxSize = canvas.height/16;
            }
            
            var z = Math.random() * 100 - 100;
            var refl;
            
            do {
                refl = Math.random()
            } while(refl < minRefl);
            
            var mat = new material(refl, 60, Math.random(), Math.random(), Math.random(), 1.0);
            
            var sph = new sphere(x, y, z, radius);
            models[i] = new model(sph, mat, "sphere");
            
            x = x + 2*box;
            
        }

        if(document.getElementById("includePlane").checked){
            var mat = new material(document.getElementById("planeRefl").value, 60, Math.random(), Math.random(), Math.random(), 0);
            var pl;
            
            if(document.getElementById("randPPos").checked){
                pl = new plane(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, (Math.random() * (1000 - 500) + 500), document.getElementById("pnX").value, document.getElementById("pnY").value, document.getElementById("pnZ").value);
            } else {
                pl = new plane(document.getElementById("pX").value, document.getElementById("pY").value, document.getElementById("pZ").value, document.getElementById("pnX").value, document.getElementById("pnY").value, document.getElementById("pnZ").value);
            }
            
            models[numObjects] = new model(pl, mat, "plane");
        }



        var imgIndex = 0;
        y = 0;
        var busy = false;
        var interval = 5;


        var processor = setInterval(function(){

            if(!busy){
                busy = true;
                

                for (x = 0; x < imgData.width; ++x) {
                    rayTrace(models, numObjects, x, y);

                    imgData.data[imgIndex] = Math.min(red*255.0,255.0);
                    imgData.data[(imgIndex + 1)] = Math.min(green*255.0,255.0);
                    imgData.data[(imgIndex + 2)] = Math.min(blue*255.0,255.0);
                    imgData.data[(imgIndex + 3)] = 255;
                    imgIndex = imgIndex + 4;
                }
                
                ctx.putImageData(imgData, 0, 0);
                
                if(++y == imgData.height){
                
                    clearInterval(processor);
                    running = false;
                }
                
                busy = false;
            }
        }, interval);

        
        
    }
}

function rayTrace(m, numObjects, x, y){
    red = 0;
    green = 0;
    blue = 0;
    var coef = 1.0;
    var level = 0;
    
    var viewRay = new ray( Math.round(x), Math.round(y),  -1000.0, 0.0, 0.0, 1.0);

    do {
        // Looking for the closest intersection
        t = 2000.0;
        var currentModel = -1;

        for (var i = 0; i < m.length; ++i){
            hit = 0;
            hitObject(viewRay, m[i]);
            
            if (hit == 1){
                currentModel = i;

            }
        }

        if (currentModel == -1){
            break;
        }
        
        var mat = m[currentModel].mat;
        
        // Intersection Ray
        var newStart = new point(viewRay.x + t * viewRay.dirx, viewRay.y + t * viewRay.diry, viewRay.z + t * viewRay.dirz);

        var n;
        
        if(m[currentModel].type == "sphere"){
            // Normal vector at the point of intersection of sphere
            n = new vector(newStart.x - m[currentModel].object.x, newStart.y - m[currentModel].object.y, newStart.z - m[currentModel].object.z);
            var temp = n.x * n.x + n.y * n.y + n.z * n.z;
            if (temp == 0.0){
                break;
            }

            temp = 1.0 / Math.sqrt(temp);
            n = new vector(temp * n.x, temp * n.y, temp * n.z);
        } else if(m[currentModel].type == "plane"){
            n = new vector(m[currentModel].object.nx, m[currentModel].object.ny, m[currentModel].object.nz);
        }

        // Numbers of lights (2)
        for (var j = 0; j < 2; ++j) {
            var currentLight;
            if(j == 0){
                currentLight = light1
            } else {
                currentLight = light2;
            }


            var dist = new vector(currentLight.x - newStart.x, currentLight.y - newStart.y, currentLight.z - newStart.z);
            
            if ((n.x * dist.x + n.y * dist.y + n.z * dist.z) <= 0.0){
                continue;
            }
            
            t = Math.sqrt(dist.x * dist.x + dist.y * dist.y + dist.z * dist.z);
            
            if ( t <= 0.0){
                continue;
            }

            var lightRay = new ray(newStart.x, newStart.y, newStart.z, (1/t) * dist.x, (1/t) * dist.y, (1/t) * dist.z);
            
            // In shadow?
            var inShadow = false;
            for (var i = 0; i < numObjects; ++i) {
                if (hitSphere(lightRay, m[i])) {
                    inShadow = true;
                    break;
                }
            }
            
            if (!inShadow) {
            
                
                
                // lambert
                var lambert = (lightRay.dirx * n.x + lightRay.diry * n.y + lightRay.dirz * n.z ) * coef;
                red += lambert * currentLight.red * mat.dRed;
                green += lambert * currentLight.green * mat.dGreen;
                blue += lambert * currentLight.blue * mat.dBlue;
                
                
                // Blinn-Phong
                if(includeSpec){
                    var phongDir = new vector(lightRay.dirx - viewRay.dirx, lightRay.diry - viewRay.diry, lightRay.dirz - viewRay.dirz);
                    var dblPhongDir = Math.sqrt(phongDir.x * phongDir.x + phongDir.y * phongDir.y + phongDir.z * phongDir.z);
                    
                    if(dblPhongDir != 0.0){
                    
                        var temp = 1.0/dblPhongDir;
                        phongDir = new vector(temp * phongDir.x, temp * phongDir.y, temp * phongDir.z);
                        var phongRatio = Math.max(phongDir.x * n.x + phongDir.y * n.y + phongDir.z * n.z, 0.0);

                        var powerCoef = Math.pow(phongRatio, mat.power) * coef;

                        phongRatio = mat.spec * powerCoef + mat.spec * powerCoef + mat.spec * powerCoef;
                        
                        red += phongRatio * currentLight.red;
                        green += phongRatio * currentLight.green;
                        blue += phongRatio * currentLight.blue;
                       
                    }
                }
                
            }
        }

        // Next reflection
        coef *= mat.reflection;
        var reflection = 2.0 * (viewRay.dirx * n.x + viewRay.diry * n.y + viewRay.dirz * n.z);
        viewRay = new ray(newStart.x, newStart.y, newStart.z, (viewRay.dirx - reflection * n.x), (viewRay.diry - reflection * n.y), (viewRay.dirz - reflection * n.z));

        level++;

    }
    while ((coef > 0.0) && (level < 10));



}

function hitObject(ray, model){
    if(model.type == "sphere"){
        hitSphere(ray, model);
    } else if(model.type == "plane"){
        hitPlane(ray, model);
    }
}

// Intersection of a ray and a plane
function hitPlane(ray, model){
    var normal = new vector(model.object.nx, model.object.ny, model.object.nz);
    var denom = ray.dirx * normal.x + ray.diry * normal.y + ray.dirz * normal.z;
    
    if(denom == 0.0){
        hit = 0;
        return;
    }
    
    
    
    var t0 =  ((model.object.x - ray.x)*normal.x + (model.object.y - ray.y)*normal.y + (model.object.z - ray.z)*normal.z)/(ray.dirx*normal.x + ray.diry*normal.y + ray.dirz*normal.z);
    
    if ((t0 > 0.1) && (t0 < t)){
        t = t0;
        hit = 1;
    }
}

// Intersection of a ray and a sphere
function hitSphere(ray, s){
    
    
    var dist = new vector(s.object.x - ray.x, s.object.y - ray.y, s.object.z - ray.z);
    var B = ray.dirx * dist.x + ray.diry * dist.y + ray.dirz * dist.z;
    var D = B*B - (dist.x * dist.x + dist.y * dist.y + dist.z * dist.z) + s.object.size * s.object.size;
    
    if (D < 0.0){
        hit =  0;

    }
    
    var t0 = B - Math.sqrt(D);
    var t1 = B + Math.sqrt(D);
    
    
    if ((t0 > 0.1) && (t0 < t)){
        t = t0;
        hit = 1;
    }
    
    if ((t1 > 0.1) && (t1 < t)){
        t = t1;
        hit = 1;
    }

}


