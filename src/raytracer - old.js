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
var sphere = makeStruct("pos size");
var model = makeStruct("x y z size mat");
var light = makeStruct("x y z red green blue");


var light1;
var light2;
var minSize;
var maxSize;
var l1Pos;
var l2Pos;
var specMin;
var specMax;
var t;

function startJS(){
    var canvas=document.getElementById("canvas1");
    var minRefl;
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    
    if(document.getElementById("randMinRefl").checked){
        minRefl = Math.random() * (1.00 - 0.10) + 0.10;
    } else {
        minRefl = document.getElementById("minRefl").value;
    }
    
    var boundarySize = canvas.height/10;
    
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
    
    if(document.getElementById("randSpecMin").checked){
        specMin = Math.random() * boundarySpec;
    } else {
        specMin = document.getElementById("specMin").value;
    } 
    
    if(document.getElementById("randSpecMax").checked){
        specMax = Math.random() * (1.00 - boundarySpec) + boundarySpec;
    } else {
        specMax = document.getElementById("specMax").value;
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
        
        var mat = new material(refl, 60, Math.random(), Math.random(), Math.random(), Math.random() * (specMax - specMin) + specMin);
        models[i] = new model(x, y, z, radius, mat);
        
        x = x + 2*box;
        
    }
    
    var i = 0;
    for (y = 0; y < imgData.height; ++y) {
        for (x = 0; x < imgData.width; ++x) {
            rayTrace(models, numObjects, x, y);

            imgData.data[i]= Math.min(red*255.0,255.0);
            imgData.data[i+1]= Math.min(green*255.0,255.0);
            imgData.data[i+2]= Math.min(blue*255.0,255.0);
            imgData.data[i+3]= 255;
            i = i + 4;
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
}

function rayTrace(m, num, x, y){
    red = 0;
    green = 0;
    blue = 0;
    var coef = 1.0;
    var level = 0;
    
    var viewRay = new ray( Math.round(x), Math.round(y),  -1000.0, 0.0, 0.0, 1.0);

    do {
        // Looking for the closest intersection
        t = 2000.0;
        var currentSphere = -1;

        for (var i = 0; i < num; ++i){
            hitSphere(viewRay, m[i]);
            
            if (hit == 1){
                currentSphere = i;

            }
        }

        if (currentSphere == -1){
            break;
        }
        
        var mat = m[currentSphere].mat;
        
        // Intersection Ray
        var newStart = new point(viewRay.x + t * viewRay.dirx, viewRay.y + t * viewRay.diry, viewRay.z + t * viewRay.dirz);


        // Normal vector at the point of intersection of sphere
        var n = new vector(newStart.x - m[currentSphere].x, newStart.y - m[currentSphere].y, newStart.z - m[currentSphere].z);
        var temp = n.x * n.x + n.y * n.y + n.z * n.z;
        if (temp == 0.0){
            break;
        }

        temp = 1.0 / Math.sqrt(temp);
        n = new vector(temp * n.x, temp * n.y, temp * n.z);


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
            for (var i = 0; i < num; ++i) {
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

        // Next reflection
        coef *= mat.reflection;
        var reflection = 2.0 * (viewRay.dirx * n.x + viewRay.diry * n.y + viewRay.dirz * n.z);
        viewRay = new ray(newStart.x, newStart.y, newStart.z, (viewRay.dirx - reflection * n.x), (viewRay.diry - reflection * n.y), (viewRay.dirz - reflection * n.z));

        level++;

    }
    while ((coef > 0.0) && (level < 50));



}

// Intersection of a ray and a sphere
function hitSphere(ray, s){
    
    
    var dist = new vector(s.x - ray.x, s.y - ray.y, s.z - ray.z);
    var B = ray.dirx * dist.x + ray.diry * dist.y + ray.dirz * dist.z;
    var D = B*B - (dist.x * dist.x + dist.y * dist.y + dist.z * dist.z) + s.size * s.size;
    if (D < 0.0){
        hit =  0;

    }
    var t0 = B - Math.sqrt(D);
    var t1 = B + Math.sqrt(D);
    hit = 0;
    if ((t0 > 0.1) && (t0 < t))
    {
        t = t0;
        hit = 1;
    }
    if ((t1 > 0.1) && (t1 < t))
    {
        t = t1;
        hit = 1;
    }

}


