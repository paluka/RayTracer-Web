<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
<meta itemprop="name" content="Erik Paluka - Ray Tracer">
<meta itemprop="description" content="Erik specializes in human-computer interaction and is currently working on his master's degree in computer science at the University of Ontario Institute of Technology.">
<meta itemprop="image" content="http://www.erikpaluka.com/images/erik.jpg">
<link REL="SHORTCUT ICON" HREF="http://www.erikpaluka.com/images/taz.ico">
      <title>Erik Paluka - Ray Tracer</title>
      <link rel="stylesheet" href="../../style.css" type="text/css" media="screen" />
          <script type="text/javascript" src="raytracer.js"></script>
  
  <script>
    function changeDisabled(target){
    
        if(target.id == "randSphereMin"){
            if(document.getElementById(target.id).checked){
                document.getElementById("minSpheres").disabled = true;   
            } else {
                document.getElementById("minSpheres").disabled = false;
            }
        }
        
        if(target.id == "randSphereMax"){
            if(document.getElementById(target.id).checked){
                document.getElementById("maxSpheres").disabled = true;   
            } else {
                document.getElementById("maxSpheres").disabled = false;
            }
        }
        
        if(target.id == "randMinRefl"){
            if(document.getElementById(target.id).checked){
                document.getElementById("minRefl").disabled = true;   
            } else {
                document.getElementById("minRefl").disabled = false;
            }
        }
        
        if(target.id == "randL1"){
            if(document.getElementById(target.id).checked){
                document.getElementById("l1R").disabled = true;
                document.getElementById("l1G").disabled = true;
                document.getElementById("l1B").disabled = true;                
            } else {
                document.getElementById("l1R").disabled = false;
                document.getElementById("l1G").disabled = false;
                document.getElementById("l1B").disabled = false;
            }
        }
        
        if(target.id == "randL2"){
            if(document.getElementById(target.id).checked){
                document.getElementById("l2R").disabled = true;
                document.getElementById("l2G").disabled = true;
                document.getElementById("l2B").disabled = true;                
            } else {
                document.getElementById("l2R").disabled = false;
                document.getElementById("l2G").disabled = false;
                document.getElementById("l2B").disabled = false;
            }
        }
        
        if(target.id == "randL1Pos"){
            if(document.getElementById(target.id).checked){
                document.getElementById("l1X").disabled = true;
                document.getElementById("l1Y").disabled = true;
                document.getElementById("l1Z").disabled = true;                
            } else {
                document.getElementById("l1X").disabled = false;
                document.getElementById("l1Y").disabled = false;
                document.getElementById("l1Z").disabled = false;
            }
        }
        
        if(target.id == "randL2Pos"){
            if(document.getElementById(target.id).checked){
                document.getElementById("l2X").disabled = true;
                document.getElementById("l2Y").disabled = true;
                document.getElementById("l2Z").disabled = true;                
            } else {
                document.getElementById("l2X").disabled = false;
                document.getElementById("l2Y").disabled = false;
                document.getElementById("l2Z").disabled = false;
            }
        }
        
        if(target.id == "randPPos"){
            if(document.getElementById(target.id).checked){
                document.getElementById("pX").disabled = true;
                document.getElementById("pY").disabled = true;
                document.getElementById("pZ").disabled = true;                
            } else {
                document.getElementById("pX").disabled = false;
                document.getElementById("pY").disabled = false;
                document.getElementById("pZ").disabled = false;
            }
        }
    }
  
  </script>

  <style>
    input {
        max-width:30px;
        height: 17.5px;
    }
    
    #inputsContainer {
        float: left;
        margin-left: 15px;
        width: 300px;
        text-align: left;
    }
    
    .checkBox {
        height: 19px;
    }   
    
  </style>
  </head>
  <body onload="startRayTracing();" >
    <div class="container">
  
        <?php include('../../includes/header.php'); ?>
  
        <div style="height: 150px"></div>           
        <div>
            <div style="width:900px; margin-top:40px;">
                <div id="raytracer" style="text-align: center">
                    <br />
                    <h3>Ray Tracing using JavaScript<br>
                    Supports Spheres and Planes<br>
                    Computes the Lambertian Reflection & Blinn-Phong Reflection</h3>
                    
                    <p>Change the settings and click the button to render the scene again</p>
                    <br />
                    <canvas id="canvas1" style="border: dotted;" align="center" width="400px" height="400"></canvas>
                    <br/><br />
                    <div>
                        <div style="height:400px;">
                        <div style="float:left; text-align:left;line-height:27px; font-size:16px;">
                            Number of Spheres (min: 1 - max:20):<br/>
                            Minimum Radius of the Spheres (min: 1 - max: 200):<br>
                            Maximum Radius of the Spheres (min: 1 - max: 200):<br>
                            Width of the Canvas (min: 100px - max: 900px):<br/>
                            Height of the Canvas (min: 100px - max: 400px):<br/>
                            Minimum Sphere Reflection Ratio (min: 0.10 - max: 1.00):<br/>
                            Light 1 Colour (R, G, B - min: 0.00 - max: 1.00):<br/>
                            Light 2 Colour (R, G, B - min: 0.00 - max: 1.00):<br/>
                            Light 1 Position (X, Y, Z):<br>
                            Light 2 Position (X, Y, Z):<br>
                            Include Specular Reflection:<br>
                            Include Shadows:<br>
                            Include Plane:<br>
                            Plane Position (X, Y, Z):<br>
                            Plane Normal (nX, nY, nZ - min: -1.00 - max: 1.00):<br>
                            Plane Reflection Ratio (min: 0.10 - max: 1.00):
                        </div>
                        
                            <div id="inputsContainer">
                                <input id="numSpheres" value="12">
                                <div>
                                    <input id="minSpheres" value="30" disabled> Random
                                    <input onchange="changeDisabled(event.target);" type="checkbox" id="randSphereMin" checked>
                                </div>
                                <div>
                                    <input id="maxSpheres" value="100" disabled> Random
                                    <input onchange="changeDisabled(event.target);" type="checkbox" id="randSphereMax" checked>
                                </div>
                                <input id="width" value="400" ><br>
                                <input id="height" value="400" >
                                <div>
                                    <input id="minRefl" value="0.55" > Random
                                    <input onchange="changeDisabled(event.target);" type="checkbox" id="randMinRefl">
                                </div>
                                <div>
                                    <input id="l1R" value="0.75" >
                                    <input id="l1G" value="0.65" >
                                    <input id="l1B" value="0.80" > Random
                                    <input onchange="changeDisabled(event.target);" type="checkbox" id="randL1">
                                </div>
                                <div>
                                    <input id="l2R" value="0.75" >
                                    <input id="l2G" value="0.85" >
                                    <input id="l2B" value="0.90" > Random
                                    <input onchange="changeDisabled(event.target);" type="checkbox" id="randL2">
                                </div>
                                <div>
                                    <input id="l1X" value="-500" >
                                    <input id="l1Y" value="400" >
                                    <input id="l1Z" value="-300" > Random
                                    <input onchange="changeDisabled(event.target);" type="checkbox" id="randL1Pos">
                                </div>
                                <div>
                                    <input id="l2X" value="200" >
                                    <input id="l2Y" value="-150" >
                                    <input id="l2Z" value="100" > Random
                                    <input onchange="changeDisabled(event.target);" type="checkbox" id="randL2Pos">
                                </div>
                                <input class="checkBox" type="checkbox" id="includeSpec" checked><br>
                                <input class="checkBox" type="checkbox" id="includeShadows"><br>
                                <input class="checkBox" type="checkbox" id="includePlane" checked>
                                <div>
                                    <input id="pX" value="200" >
                                    <input id="pY" value="-150" >
                                    <input id="pZ" value="400" > Random
                                    <input onchange="changeDisabled(event.target);" type="checkbox" id="randPPos">
                                </div>
                                <div>
                                    <input id="pnX" value="0" >
                                    <input id="pnY" value="-1.0" >
                                    <input id="pnZ" value="-1.0" >
                                </div>
                                <input id="planeRefl" value="0.55">
                            </div>
                           </div>
                            <a onclick="restartRayTracing();"><div class="button" style="float:right;" >Click here to Ray Trace</div></a>
                        
                        <div style="padding-top:100px">Resources: <br />
                            <a href="http://www.cc.gatech.edu/~phlosoft/photon/" target="_blank">1</a>,
                            <a href="http://www.cs.unc.edu/~rademach/xroads-RT/RTarticle.html" target="_blank">2</a>,
                            <a href="http://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf" target="_blank">3</a>,
                            <a href="http://web.cs.wpi.edu/~gogo/courses/cs543/slides/cs543_23_RayTracing_4.pdf" target="_blank">4</a>,
                            <a href="http://www.codermind.com/articles/Raytracer-in-C++-Part-I-First-rays.html" target="_blank">5</a>,
                            <a href="http://www.ccs.neu.edu/home/fell/CSU540/programs/RayTracingFormulas.htm" target="_blank">6</a>,
                            <a href="http://wiki.cgsociety.org/index.php/Ray_Sphere_Intersection" target="_blank">7</a>,
                            <a href="http://www.flipcode.com/archives/Raytracing_Topics_Techniques-Part_1_Introduction.shtml" target="_blank">8</a>,
                            <a href="http://fuzzyphoton.tripod.com/rtalgo.htm" target="_blank">9</a>,
                            <a href="http://www.cs.uiuc.edu/class/fa05/cs418/archive/spring2005/notes/16-RayTracing.pdf" target="_blank">10</a>
                        </div>
                    </div>

                </div>
        
              
            </div>
        </div>
          
        <?php include('../../includes/footer.php'); ?>
      </div>

    </body>
      
 </html>