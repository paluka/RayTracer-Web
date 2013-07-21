function makeStruct(names2) {
    var names = names2.split(' '),
        count = names.length;

    function constructor() {
        var i;

        for (i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
        }
    }
    return constructor;
}

var Point = makeStruct("x y z"),
    Vector = makeStruct("x y z"),
    Color = makeStruct("red green blue"),
    Material = makeStruct("reflection power dRed dGreen dBlue spec"),
    Ray = makeStruct("x y z dirx diry dirz"),
    Sphere = makeStruct("x y z size"),
    Plane = makeStruct("x y z nx ny nz"),
    Model = makeStruct("object mat type"),
    Light = makeStruct("x y z red green blue"),


    light1,
    light2,
    minSize,
    maxSize,
    l1Pos,
    l2Pos,
    includeSpec = false,
    t,
    canvas,
    minRefl,
    width,
    height,
    models,
    processor,
    numLights = 2,
    red,
    green,
    blue,
    shadows;

function startRayTracing() {
    
    models = [];
    getVariables();


    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    var ctx = canvas.getContext("2d"),
        imgData = ctx.getImageData(0, 0, width, height),
        numSpheres = parseInt(document.getElementById("numSpheres").value),

        x = canvas.height / 10,
        y = canvas.height / 10,
        box = 0,
        numPlanes = 1,
        numObjects = numSpheres + numPlanes;


    createSpheres(x, y, box, numSpheres);
    createPlanes();





    y = 0;
    var imgIndex = 0,
        busy = false,
        interval = 5;


    processor = setInterval(function () {
                
        if (!busy) {
            busy = true;


            for (x = 0; x < imgData.width; ++x) {
                rayTrace(models, x, y);

                imgData.data[imgIndex] = Math.min(red * 255.0, 255.0);
                imgData.data[(imgIndex + 1)] = Math.min(green * 255.0, 255.0);
                imgData.data[(imgIndex + 2)] = Math.min(blue * 255.0, 255.0);
                imgData.data[(imgIndex + 3)] = 255;
                imgIndex = imgIndex + 4;
            }

            ctx.putImageData(imgData, 0, 0);

            if (++y == imgData.height) {

                clearInterval(processor);
            }

            busy = false;
        }
    }, interval);

}

function restartRayTracing() {
    clearInterval(processor);
    startRayTracing();
}

function getVariables() {

    canvas = document.getElementById("canvas1");
    width = parseInt(document.getElementById("width").value);
    height = parseInt(document.getElementById("height").value);

    var boundarySize = canvas.height / 12,
        boundarySpec = 0.50;

    if (document.getElementById("randMinRefl").checked) {
        minRefl = Math.random() * (1.00 - 0.10) + 0.10;
    } else {
        minRefl = parseFloat(document.getElementById("minRefl").value);
    }



    if (document.getElementById("randSphereMin").checked) {
        minSize = Math.random() * boundarySize;
    } else {
        minSize = parseInt(document.getElementById("minSpheres").value);
    }

    if (document.getElementById("randSphereMax").checked) {
        maxSize = Math.random() * (canvas.height / 3 - boundarySize) + boundarySize;
    } else {
        maxSize = parseInt(document.getElementById("maxSpheres").value);
    }



    if (document.getElementById("includeSpec").checked) {
        includeSpec = true;
    } else {
        includeSpec = false;
    }
    
    if (document.getElementById("includeShadows").checked) {
        shadows = true;
    } else {
        shadows = false;
    }

    if (document.getElementById("randL1Pos").checked) {
        l1Pos = new Vector(Math.random() * 3000 - 1500, Math.random() * 3000 - 1500, Math.random() * 3000 - 1500);
    } else {
        l1Pos = new Vector(parseInt(document.getElementById("l1X").value), parseInt(document.getElementById("l1Y").value), parseInt(document.getElementById("l1Z").value));
    }

    if (document.getElementById("randL2Pos").checked) {
        l2Pos = new Vector(Math.random() * 3000 - 1500, Math.random() * 3000 - 1500, Math.random() * 3000 - 1500);
    } else {
        l2Pos = new Vector(parseInt(document.getElementById("l2X").value), parseInt(document.getElementById("l2Y").value), parseInt(document.getElementById("l2Z").value));
    }

    if (document.getElementById("randL1").checked) {
        light1 = new Light(l1Pos.x, l1Pos.y, l1Pos.z, Math.random(), Math.random(), Math.random());
    } else {
        light1 = new Light(l1Pos.x, l1Pos.y, l1Pos.z, parseFloat(document.getElementById("l1R").value), parseFloat(document.getElementById("l1G").value), parseFloat(document.getElementById("l1B").value));
    }

    if (document.getElementById("randL2").checked) {
        light2 = new Light(l2Pos.x, l2Pos.y, l2Pos.z, Math.random(), Math.random(), Math.random());
    } else {
        light2 = new Light(l2Pos.x, l2Pos.y, l2Pos.z, parseFloat(document.getElementById("l2R").value), parseFloat(document.getElementById("l2G").value), parseFloat(document.getElementById("l2B").value));
    }

    if (width > 900) {
        width = 900;
    }
    if (height > 400) {
        height = 400;
    }

}

function createSpheres(x, y, box, numSpheres) {
    var i;
    for (i = 0; i < numSpheres; ++i) {
        var radius = Math.random() * (maxSize - minSize) + minSize;
        box = Math.random() * (maxSize - maxSize * 0.9) + maxSize * 0.9;


        if (x + radius / 2 > canvas.width) {
            x = box;
            y = y + 2 * box;
        }

        if (y + radius / 3 > canvas.height) {
            y = box;
            maxSize = canvas.height / 16;
        }

        var z = Math.random() * 100 - 100;
        var refl;

        do {
            refl = Math.random()
        } while (refl < minRefl);

        var mat = new Material(refl, 60, Math.random(), Math.random(), Math.random(), 1.0);

        var sph = new Sphere(x, y, z, radius);
        models[i] = new Model(sph, mat, "sphere");

        x = x + 2 * box;

    }
}

function createPlanes() {
    if (document.getElementById("includePlane").checked) {
        var mat = new Material(parseFloat(document.getElementById("planeRefl").value), 60, Math.random(), Math.random(), Math.random(), 0),
            pl,
            index = models.length;

        if (document.getElementById("randPPos").checked) {
            pl = new Plane(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, (Math.random() * (1000 - 500) + 500), parseFloat(document.getElementById("pnX").value), parseFloat(document.getElementById("pnY").value), parseFloat(document.getElementById("pnZ").value));
        } else {
            pl = new Plane(parseInt(document.getElementById("pX").value), parseInt(document.getElementById("pY").value), parseInt(document.getElementById("pZ").value), parseFloat(document.getElementById("pnX").value), parseFloat(document.getElementById("pnY").value), parseFloat(document.getElementById("pnZ").value));
        }


        models[index] = new Model(pl, mat, "plane");
    }
}

function rayTrace(m, x, y) {
    red = 0;
    green = 0;
    blue = 0;
    var coef = 1.0,
        level = 0,
        viewRay = new Ray(Math.round(x), Math.round(y), -1000.0, 0.0, 0.0, 1.0);

    do {
        // Looking for the closest intersection
        t = 2000.0;
        var currentModel = -1,
            i;
        
        for (i = 0; i < m.length; ++i) {
            if (hitObject(viewRay, m[i])) {
                currentModel = i;
            }
        }

        if (currentModel == -1) {
            break;
        }

        var mat = m[currentModel].mat,
            n,
            // Intersection Ray
            newStart = new Point(viewRay.x + t * viewRay.dirx, viewRay.y + t * viewRay.diry, viewRay.z + t * viewRay.dirz);

          

        if (m[currentModel].type == "sphere") {
            // Normal vector at the point of intersection of sphere
            n = new Vector(newStart.x - m[currentModel].object.x, newStart.y - m[currentModel].object.y, newStart.z - m[currentModel].object.z);
            
            var temp = n.x * n.x + n.y * n.y + n.z * n.z;
            
            if (temp == 0.0) {
                break;
            }

            temp = 1.0 / Math.sqrt(temp);
            n = new Vector(temp * n.x, temp * n.y, temp * n.z);
        } else if (m[currentModel].type == "plane") {
            n = new Vector(m[currentModel].object.nx, m[currentModel].object.ny, m[currentModel].object.nz);
        }

        var j;
        
        for (j = 0; j < numLights; ++j) {
            var currentLight;
            if (j == 0) {
                currentLight = light1;
            } else {
                currentLight = light2;
            }


            var dist = new Vector(currentLight.x - newStart.x, currentLight.y - newStart.y, currentLight.z - newStart.z);

            if ((n.x * dist.x + n.y * dist.y + n.z * dist.z) <= 0.0) {
                continue;
            }

            t = Math.sqrt(dist.x * dist.x + dist.y * dist.y + dist.z * dist.z);

            if (t <= 0.0) {
                continue;
            }

            var lightRay = new Ray(newStart.x, newStart.y, newStart.z, (1 / t) * dist.x, (1 / t) * dist.y, (1 / t) * dist.z);

            // In shadow?
            var inShadow = false,
                i;
            
            if (shadows) {
                for (i = 0; i < m.length; ++i) {
    
                    if (hitObject(lightRay, m[i])) {
                        inShadow = true;
                        break;
                    }
                }
            }

            if (!inShadow) {

                // lambert
                var lambert = (lightRay.dirx * n.x + lightRay.diry * n.y + lightRay.dirz * n.z) * coef;
                red += lambert * currentLight.red * mat.dRed;
                green += lambert * currentLight.green * mat.dGreen;
                blue += lambert * currentLight.blue * mat.dBlue;


                // Blinn-Phong
                if (includeSpec) {
                    var phongDir = new Vector(lightRay.dirx - viewRay.dirx, lightRay.diry - viewRay.diry, lightRay.dirz - viewRay.dirz);
                    var dblPhongDir = Math.sqrt(phongDir.x * phongDir.x + phongDir.y * phongDir.y + phongDir.z * phongDir.z);

                    if (dblPhongDir != 0.0) {

                        var temp = 1.0 / dblPhongDir;
                        phongDir = new Vector(temp * phongDir.x, temp * phongDir.y, temp * phongDir.z);
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
        viewRay = new Ray(newStart.x, newStart.y, newStart.z, (viewRay.dirx - reflection * n.x), (viewRay.diry - reflection * n.y), (viewRay.dirz - reflection * n.z));

        level++;

    }
    while ((coef > 0.0) && (level < 10));



}

function hitObject(ray, model) {
    if (model.type == "sphere") {
        return hitSphere(ray, model);
    } else if (model.type == "plane") {
        return hitPlane(ray, model);
    }
    return false;    
}

// Intersection of a ray and a plane

function hitPlane(ray, model) {
    var normal = new Vector(model.object.nx, model.object.ny, model.object.nz);
    var denom = ray.dirx * normal.x + ray.diry * normal.y + ray.dirz * normal.z;

    if (denom == 0.0) {
        return false;
    }


    var t0 = ((model.object.x - ray.x) * normal.x + (model.object.y - ray.y) * normal.y + (model.object.z - ray.z) * normal.z) / denom;

    
    if ((t0 > 0.1) && (t0 < t)) {
        t = t0;
        //alert(t0 + ' ' + t2);
        return true;
    }
    
    return false;
}

// Intersection of a ray and a sphere

function hitSphere(ray, s) {


    var dist = new Vector(s.object.x - ray.x, s.object.y - ray.y, s.object.z - ray.z);
    var B = ray.dirx * dist.x + ray.diry * dist.y + ray.dirz * dist.z;
    var D = B * B - (dist.x * dist.x + dist.y * dist.y + dist.z * dist.z) + s.object.size * s.object.size;

    if (D < 0.0) {
        return false;
    }

    var t0 = B - Math.sqrt(D);
    var t1 = B + Math.sqrt(D);


    if ((t0 > 0.1) && (t0 < t)) {
        t = t0;
        return true;
    }

    if ((t1 > 0.1) && (t1 < t)) {
        t = t1;
        return true;
    }

    return false;
}