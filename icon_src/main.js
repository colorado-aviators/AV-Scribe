function exportToSVG(id, filename) {
    filename = filename ? filename : `${id}.svg`;

    let svg = document.getElementById(id);
    let style = document.getElementById("styles");
    svg.appendChild(style);

    let image = new Image()
    let svgData = new XMLSerializer().serializeToString(svg)
    let svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))
    let svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

    let download = document.createElement('a');
    download.href = svgDataUrl;
    download.download = filename;
    download.click();
    download.remove();
}

function exportToPNG(id, w, h, filename) {
    // unclear why, but you must manually execute this function twice in order for it to work!
    filename = filename ? filename : `${id}.png`;
    let orig = document.getElementById(id);
    backgroundColor = window.getComputedStyle(orig.parentElement).backgroundColor;
    tmp = orig.cloneNode(true);
    let style = document.getElementById("styles").cloneNode(true);
    tmp.style.backgroundColor = backgroundColor
    tmp.appendChild(style);

    let image = new Image()
    let svgData = new XMLSerializer().serializeToString(tmp)
    let svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))
    let svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`
    image.src = svgDataUrl

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)

    context.drawImage(image, 0, 0, w, h)
    let dataUrl = canvas.toDataURL('image/png');

    let download = document.createElement('a');
    download.href = dataUrl;
    download.download = filename;
    download.click();
    download.remove();

    context.clearRect(0, 0, w, h);
}

function get_headset() {
    let headset = document.createElementNS("http://www.w3.org/2000/svg", "g")
    headset.setAttribute("stroke-width", "0");

    let headBand = document.createElementNS("http://www.w3.org/2000/svg", "path")
    d = `
        M -.35 -.23
        A .35 .27 0 0 1 .35 -.23
        L .33 -.13
        A .33 .27 0 0 0 -.33 -.13
    `
    headBand.setAttribute("d", d)
    headset.appendChild(headBand)

    let leftCan = document.createElementNS("http://www.w3.org/2000/svg", "path")
    d = `
        M -.33 -.21
        A .3 .24 0 0 0 -.33 .21
        A .18 .3 0 0 0 -.33 -.21
    `
    leftCan.setAttribute("d", d)
    headset.appendChild(leftCan)

    let rightCan = document.createElementNS("http://www.w3.org/2000/svg", "path")
    d = `
        M .33 -.21
        A .3 .24 0 0 1 .33 .21
        A .18 .3 0 0 1 .33 -.21
    `
    rightCan.setAttribute("d", d)
    headset.appendChild(rightCan)

    let micArm = document.createElementNS("http://www.w3.org/2000/svg", "path")
    d = `
        M .33 .21
        A .3 .3 0 0 1 0 .42
        L .03 .36
        A .3 .3 0 0 0 .33 .21
    `
    micArm.setAttribute("d", d)
    headset.appendChild(micArm)

    let micCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    micCircle.setAttribute("r", ".06");
    micCircle.setAttribute("cy", ".39");
    headset.appendChild(micCircle)

    return headset;
}

function draw_headset() {
    const svg = document.getElementById("headset");
    headset = get_headset();
    headset.setAttribute("transform", "scale(.9)");
    headset.setAttribute("fill", "black");

    let micCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    micCircle.setAttribute("r", ".5");
    micCircle.setAttribute("cy", "0");
    micCircle.setAttribute("fill", "white")

    svg.appendChild(micCircle);
    svg.appendChild(headset);
}

function draw_lockup() {
    const svg = document.getElementById("lockup");

    headset = get_headset();
    headset.setAttribute("transform", "scale(.5) translate(-.5 .04)")
    svg.appendChild(headset);

    let avText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    avText.innerHTML = "AV";
    avText.setAttribute("class", "contrast")
    avText.setAttribute("x", -.25)
    avText.setAttribute("y", .04)
    avText.style.font = ".20px proxima nova"
    avText.style.dominantBaseline = "middle";
    avText.style.textAnchor = "middle";

    svg.appendChild(avText);

    let scribeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    scribeText.innerHTML = "Scribe";
    scribeText.setAttribute("class", "contrast")
    scribeText.setAttribute("x", .025)
    scribeText.setAttribute("y", .04)
    scribeText.style.font = ".20px proxima nova"
    scribeText.style.dominantBaseline = "middle";
    scribeText.style.textAnchor = "left";
    svg.appendChild(scribeText);
}

function drawPieSlice(settings) {
    let d = "";

    const firstCircumferenceX = settings.centreX + settings.radius * Math.cos(settings.startAngleRadians);
    const firstCircumferenceY = settings.centreY + settings.radius * Math.sin(settings.startAngleRadians);
    const secondCircumferenceX = settings.centreX + settings.radius * Math.cos(settings.startAngleRadians + settings.sweepAngleRadians);
    const secondCircumferenceY = settings.centreY + settings.radius * Math.sin(settings.startAngleRadians + settings.sweepAngleRadians);

    // move to centre
    d += "M" + settings.centreX + "," + settings.centreY + " ";
    // line to first edge
    d += "L" + firstCircumferenceX + "," + firstCircumferenceY + " ";
    // arc
    // Radius X, Radius Y, X Axis Rotation, Large Arc Flag, Sweep Flag, End X, End Y
    d += "A" + settings.radius + "," + settings.radius + " 0 0,1 " + secondCircumferenceX + "," + secondCircumferenceY + " ";
    // close path
    d += "Z";

    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");

    arc.setAttributeNS(null, "d", d);
    arc.setAttributeNS(null, "fill", settings.fillColour);

    return arc;
}


function draw_logo() {
    const svg = document.getElementById("logo");
    let defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
    svg.appendChild(defs);

    let wakeGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
    wakeGradient.id = "wakeGradient";
    wakeGradient.setAttribute("cx", 0);
    wakeGradient.setAttribute("cy", -.4);
    wakeGradient.setAttribute("r", .8);
    wakeGradient.setAttribute("fx", 0);
    wakeGradient.setAttribute("fy", -.15);
    wakeGradient.setAttribute("gradientUnits", "userSpaceOnUse");
    wakeGradient.innerHTML = `
      <stop offset="25%" stop-color="rgba(0,100,150,0)" />
      <stop offset="50%" stop-color="rgba(0,100,150,1)" />
    `
    defs.appendChild(wakeGradient);

    let propellerWake = document.createElementNS("http://www.w3.org/2000/svg", "path")
    d = `
        M -.40 0
        A .40 .40 0 0 1 0 -.40
        L 0 0
    `
    propellerWake.setAttribute("d", d);
    propellerWake.setAttribute('fill', 'url(#wakeGradient)');

    svg.appendChild(propellerWake);
    let tmp = propellerWake.cloneNode(true);
    tmp.setAttribute("transform", "rotate(180)")
    svg.appendChild(tmp)

    let bladeGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
    bladeGradient.id = "bladeGradient";
    bladeGradient.setAttribute("gradientTransform", "rotate(90)");
    bladeGradient.innerHTML = `
        <stop offset="0%" stop-color="white" stop-opacity="1.0" />
        <stop offset="100%" stop-color="rgba(50,50,50)" stop-opacity="1.0" />
    `
    defs.appendChild(bladeGradient);

    let propellerBlade = document.createElementNS("http://www.w3.org/2000/svg", "path")
    d = `
            M -.40 .0
            A .20 .02 0 0 0 0 0
            A .20 .02 0 0 0 -.40 0
    `
    propellerBlade.setAttribute("d", d);
    propellerBlade.setAttribute('fill', 'url(#bladeGradient)');

    svg.appendChild(propellerBlade);

    tmp = propellerBlade.cloneNode(true);
    tmp.setAttribute("transform", "rotate(180)")
    svg.appendChild(tmp)

    let n = 30;
    const spinner = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (i=-n; i<n; i++) {
        let gs = 255.0 / n * Math.abs(i);
        let arc = drawPieSlice({ element: spinner, centreX: 0, centreY: 0, startAngleRadians: Math.PI * (.25 + i / n), sweepAngleRadians: Math.PI / n, radius:.05, fillColour: `rgb(${gs},${gs},${gs})` } );
        spinner.append(arc);
    }

    let filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.id = "spinner-filter"
    let blur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    blur.setAttribute("in", "SourceGraphic");
    blur.setAttribute("stdDeviation", .002);
    filter.appendChild(blur)

    let mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.id = "spinner-mask"
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("fill", "white");
    circle.setAttribute("r", .05);
    mask.appendChild(circle)

    defs.appendChild(filter);
    defs.appendChild(mask);

    spinner.setAttributeNS(null, "mask", "url(#spinner-mask)");
    spinner.setAttributeNS(null, "filter", "url(#spinner-filter)");
    svg.appendChild(spinner);

    headset = get_headset();
    headset.setAttribute("transform", "scale(.3) translate(.3 -.6)")
    svg.appendChild(headset);

    let avText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    avText.innerHTML = "AV";
    avText.setAttribute("x", .09)
    avText.setAttribute("y", -.166)
    avText.setAttribute("class", "contrast")
    avText.style.font = ".12px proxima nova"
    avText.style.dominantBaseline = "middle";
    avText.style.textAnchor = "middle";
    svg.appendChild(avText);

    let scribeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    scribeText.innerHTML = "Scribe";
    scribeText.setAttribute("x", -.3)
    scribeText.setAttribute("y", .2)
    scribeText.setAttribute("class", "contrast")
    scribeText.style.font = ".16px proxima nova"
    scribeText.style.dominantBaseline = "middle";
    scribeText.style.textAnchor = "left";
    svg.appendChild(scribeText);
}

function exportLogo() {
    let id = "logo";
    exportToSVG(id);
    let size;
    size = 180;
    exportToPNG(id, size, size, `apple-touch-icon-${size}-${size}.png`);
    size = 512;
    exportToPNG(id, size, size, `google-touch-icon-${size}-${size}.png`);
}

function exportHeadset() {
    let id = "headset";
    exportToSVG(id);
    exportToSVG(id, "favicon.svg");
}

function exportLockup() {
    let id = "lockup";
    exportToSVG(id);
    exportToPNG(id, 640, 320);
}