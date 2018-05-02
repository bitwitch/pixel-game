document.addEventListener("DOMContentLoaded", function(event) {
    var colorSelector = document.querySelector(".select-color");
    var colorKnob     = document.querySelector(".knob"); 
    var hueKnob       = document.querySelector(".hue"); 
    var hue           = 240;
    var sat           = 100; 
    var light         = 100; 
    var selectingSB   = false; 
    var selectingHue  = false;
    

    colorSelector.addEventListener("mousedown", function (e) {
        console.log("Clicked and selecting:", selectingSB); 

        var rectPos = colorSelector.getBoundingClientRect();
        var rawXPercent = (e.clientX - rectPos.x) / rectPos.width;
        var rawYPercent = (e.clientY - rectPos.y) / rectPos.height;
        colorKnob.style.left = Math.trunc(rectPos.width * rawXPercent) - 5;
        colorKnob.style.top  = Math.trunc(rectPos.height * rawYPercent) - 10;

        selectingSB ? deselect() : select(); 

        selectingSB = !selectingSB; 
    });

    colorSelector.addEventListener("mousemove", function (e) {
        if (selectingSB) {
            var rectPos = colorSelector.getBoundingClientRect();
            var rawXPercent = (e.clientX - rectPos.x) / rectPos.width;
            var rawYPercent = (e.clientY - rectPos.y) / rectPos.height;
            colorKnob.style.left = Math.trunc(rectPos.width * rawXPercent) - 5;
            colorKnob.style.top  = Math.trunc(rectPos.height * rawYPercent) - 10;
        
            light = (1/2 * (1 - rawYPercent) * (2 - rawXPercent)); 
            sat   = ((1 - rawYPercent) * rawXPercent) / ( 1 - Math.abs(2 * light - 1) );
            
            var hsl   = "hsl(" + hue + ", " + sat * 100 + "%," + light * 100 + "%)";
            console.log("hsl: ", hsl);
    
            colorSelector.style.backgroundColor = hsl; 
        }
    });

    // hueKnob.addEventListener("mousedown", function(e) {
    //     console.log("Clicked and selecting:", selectingHue); 

    //     var rectPos = colorSelector.getBoundingClientRect();
    //     var rawXPercent = (e.clientX - rectPos.x) / rectPos.width;
    //     hue = Math.floor(rawXPercent * 360);

    //     hueKnob.style.backgroundColor = "hsl(" + hue + ", 100%, 100%)"; 

    //     selectingHue = !selectingHue;
    // });

    function select () {
        console.log('SELECT');
        colorSelector.style.cursor = "none"; 
    }

    function deselect () {
        console.log("DESELECT");
        colorSelector.style.cursor = "default"; 
    }
});
