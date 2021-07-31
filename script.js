const MIN_SCREEN_WIDTH_FOR_ANIMATIONS = 550;

const TYPE_LETTER_DURATION = 120;
const HALF_A_SECOND = 500;
const FIVE_SECONDS = 5000;

const INDEX_OF_ANIMATED_ELMN_PARENT = 3;
const CHILD_INDEX_OF_ANIMATED_ELMN = 1;

var elementsToAnimateSecondPage =
    document.querySelectorAll(".animate-second-page");
let firstProjectElement = elementsToAnimateSecondPage[0];

if( window.innerHeight > MIN_SCREEN_WIDTH_FOR_ANIMATIONS ) {
    for( let elmn of elementsToAnimateSecondPage ) {
        elmn.classList.add("hidden");
    }
}

var pageElements = [];
for( let elmnId of ["first-page", "second-page", "third-page"] ) {
    pageElements.push(document.getElementById(elmnId));
}
// Making sure the first page is scrolled into view (for page reloads)
document.getElementById("first-page").scrollIntoView();

function animateSecondPage() {
    for( let element of elementsToAnimateSecondPage ) {
        element.classList.add("fade-in-element");
        element.classList.remove("hidden");
    }
}

let lastKnownScrollPosition = 0;
let ticking = false;
const projectsAreFullyVisible = window.innerHeight * 0.9;

function showProjectsIfInView(scrollPos) {
    console.log(scrollPos);
    let projectPos = firstProjectElement.getBoundingClientRect().top;
    if( projectPos < projectsAreFullyVisible ) {
        animateSecondPage();
    }
}

document.addEventListener("scroll", function(e) {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(function() {
            showProjectsIfInView(lastKnownScrollPosition);
            ticking = false;
        });
        ticking = true;
    }
});

const typewriterEffectCursor = 
    "<span style='margin-left: 2px; position: relative; top: -2px;' \
    aria-hidden='true'>▌</span>";

function typewriterEffect(elmn, message) {
    for (let i = 0; i < message.length; i++) {
        setTimeout( () => {
            elmn.innerHTML =
                message.substring(0, i + 1)
                + typewriterEffectCursor;
        }, (TYPE_LETTER_DURATION * i + TYPE_LETTER_DURATION));
    }
}

// hide the first page info for the commandline effect
document.getElementById("first-page-info").style.opacity = 0;

function hideOneAndShowAnother(elmnIdToHide, elmnIdToShow, delay) {
    let elmnToHide = document.getElementById(elmnIdToHide);
    let elmnToShow = document.getElementById(elmnIdToShow);
    setTimeout( () => {
        elmnToHide.style.opacity = 0;
        elmnToShow.style.opacity = 1;
    }, delay);
}

let areProjectAnimationsBlocked = {
    "first": false,
    "second": false,
    "third": false,
    "fourth": false,
    "fifth": false,
};

for( let number of ["first", "second", "third", "fourth", "fifth"]) {
    let projectElement = document.getElementById(number + "-project");

    let elementToBeAnimated = 
        projectElement
            .childNodes[INDEX_OF_ANIMATED_ELMN_PARENT]
            .childNodes[CHILD_INDEX_OF_ANIMATED_ELMN];

    let message = elementToBeAnimated.innerHTML.trim();

    projectElement.addEventListener("mouseover", () => {
        if( areProjectAnimationsBlocked[number] ) {
            return;
        }
        areProjectAnimationsBlocked[number] = true;
        typewriterEffect(elementToBeAnimated, message); 
        setTimeout(() => {
            areProjectAnimationsBlocked[number] = false; 
        }, message.length * TYPE_LETTER_DURATION + HALF_A_SECOND);
    });
}

document.addEventListener("DOMContentLoaded",
    () => { 
        const prompt_message = "% info fernando";
        const elementToAnimate = document.getElementById("first-page-prompt");
        typewriterEffect(elementToAnimate, "% info fernando"); 
        const delay =
            prompt_message.length * TYPE_LETTER_DURATION + HALF_A_SECOND;
        hideOneAndShowAnother("first-page-prompt",
            "first-page-info",
            delay);

        setTimeout( () => {
            let leftArrow = document.getElementById("arrow-left-side");
            let rightArrow = document.getElementById("arrow-right-side");
            leftArrow.classList.remove("hidden");
            rightArrow.classList.remove("hidden");
            leftArrow.classList.add("animate-left-arrow");
            rightArrow.classList.add("animate-right-arrow");
        }, FIVE_SECONDS);
    });

// --- MOON-BUGGY code
const frameRateInMiliseconds = 110;
const canvasHeight = 10;
const canvasContainer = document.getElementById("ascii-canvas-container");
const forSizingChars = document.getElementById("char-sizing");
const charWidth = forSizingChars.scrollWidth;
const holes = 
    [ 
        20,
        21,
        66,
        67,
        99,
        100,
        101,
        102,
        103,
        104,
        142,
        143,
        144,
        181,
        182,
        183,
        184,
        218,
        219,
        220,
        252,
        253,
        285,
        286,
        287,
        288,
        302,
        303,
        304,
        305,
        306,
        341,
        342,
        371,
        372,
        392,
        393,
        394
    ];
const courseWidth = 400;
const END_OF_JUMPING_ANIMATION = 11;
const HORIZONTAL_LINE = 2;

let scrollIntervalId = null;
let numberForWheelState = 0;
let isCarOnGround = true;
let jumpState = 0;
let holeIndexIter = 0;
let next = holes[holeIndexIter];
let asciiCanvas = [];
let windowWidth = window.innerWidth;
let numberOfChars = Math.floor(windowWidth / charWidth);
let indexForScroll = (numberOfChars + 1) % courseWidth;

function drawCanvas(isRemovePrevious) {
    if( isRemovePrevious ) {
        let toRemove = document.getElementById("ascii-canvas");
        toRemove.remove();
    }

    let asciiCanvasString = "<div class=;canvas-lines; id=;ascii-canvas;>";
    for( let j = 0; j < canvasHeight; j++) {
        let row = `<span class="asciiRow">${asciiCanvas[j].join("")}</span>`;
        asciiCanvasString = asciiCanvasString + row;
    }
    asciiCanvasString = asciiCanvasString + "</div>";

    canvasContainer.insertAdjacentHTML("beforeend", asciiCanvasString);
}

function initCanvasMatrix(shouldRemovePreviousCanvas) {
    for( let j = 0; j < canvasHeight; j++) {
        let row = [];
        for(let i = 0; i < numberOfChars; i++) {
            row.push("&nbsp;");
        }
        asciiCanvas.push(row);
    }
    drawCanvas(shouldRemovePreviousCanvas);
}

function drawFloor() {
    for( let i = 1; i <= numberOfChars; i++) {
        asciiCanvas[canvasHeight - 1][numberOfChars - i] = "#";
        const penultimateRow = canvasHeight - 2;

        if( next === (i % courseWidth) ) {
            asciiCanvas[penultimateRow][numberOfChars - i] = "&nbsp;";
            holeIndexIter = (holeIndexIter + 1) % holes.length;
            next = holes[holeIndexIter];
        }
        else {
            asciiCanvas[penultimateRow][numberOfChars - i] = "#";
        }
    }
}

function drawCar() {
    /*
       Omm
    (|)-(|)
    */
    asciiCanvas[canvasHeight - 3][numberOfChars - 3] = ")";
    asciiCanvas[canvasHeight - 3][numberOfChars - 4] = "|";
    asciiCanvas[canvasHeight - 3][numberOfChars - 5] = "(";
    asciiCanvas[canvasHeight - 3][numberOfChars - 6] = "-";
    asciiCanvas[canvasHeight - 3][numberOfChars - 7] = ")";
    asciiCanvas[canvasHeight - 3][numberOfChars - 8] = "|";
    asciiCanvas[canvasHeight - 3][numberOfChars - 9] = "(";

    asciiCanvas[canvasHeight - 4][numberOfChars - 4] = "m";
    asciiCanvas[canvasHeight - 4][numberOfChars - 5] = "m";
    asciiCanvas[canvasHeight - 4][numberOfChars - 6] = "O";
}

function drawJumpAnimation1() {
    /*
       OMM
    (U)-(U)
    */
    asciiCanvas[canvasHeight - 3][numberOfChars - 3] = ")";
    asciiCanvas[canvasHeight - 3][numberOfChars - 4] = "U";
    asciiCanvas[canvasHeight - 3][numberOfChars - 5] = "(";
    asciiCanvas[canvasHeight - 3][numberOfChars - 6] = "-";
    asciiCanvas[canvasHeight - 3][numberOfChars - 7] = ")";
    asciiCanvas[canvasHeight - 3][numberOfChars - 8] = "U";
    asciiCanvas[canvasHeight - 3][numberOfChars - 9] = "(";

    asciiCanvas[canvasHeight - 4][numberOfChars - 4] = "M";
    asciiCanvas[canvasHeight - 4][numberOfChars - 5] = "M";
    asciiCanvas[canvasHeight - 4][numberOfChars - 6] = "O";
}

function drawJumpAnimation2() {

    // erase previous drawing
    asciiCanvas[canvasHeight - 3][numberOfChars - 3] = "&nbsp;";
    asciiCanvas[canvasHeight - 3][numberOfChars - 4] = "&nbsp;";
    asciiCanvas[canvasHeight - 3][numberOfChars - 5] = "&nbsp;";
    asciiCanvas[canvasHeight - 3][numberOfChars - 6] = "&nbsp;";
    asciiCanvas[canvasHeight - 3][numberOfChars - 7] = "&nbsp;";
    asciiCanvas[canvasHeight - 3][numberOfChars - 8] = "&nbsp;";
    asciiCanvas[canvasHeight - 3][numberOfChars - 9] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 4] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 5] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 6] = "&nbsp;";

    /*
       OMm
    (|)-(|)

    */
    asciiCanvas[canvasHeight - 4][numberOfChars - 3] = ")";
    asciiCanvas[canvasHeight - 4][numberOfChars - 4] = "|";
    asciiCanvas[canvasHeight - 4][numberOfChars - 5] = "(";
    asciiCanvas[canvasHeight - 4][numberOfChars - 6] = "-";
    asciiCanvas[canvasHeight - 4][numberOfChars - 7] = ")";
    asciiCanvas[canvasHeight - 4][numberOfChars - 8] = "|";
    asciiCanvas[canvasHeight - 4][numberOfChars - 9] = "(";

    asciiCanvas[canvasHeight - 5][numberOfChars - 4] = "m";
    asciiCanvas[canvasHeight - 5][numberOfChars - 5] = "M";
    asciiCanvas[canvasHeight - 5][numberOfChars - 6] = "O";
}

function drawJumpAnimation3() {

    // erase previous sprite
    asciiCanvas[canvasHeight - 4][numberOfChars - 3] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 4] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 5] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 6] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 7] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 8] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 9] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 4] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 5] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 6] = "&nbsp;";

    /*
       OMm
    (\)-(\)


    */
    asciiCanvas[canvasHeight - 5][numberOfChars - 3] = ")";
    asciiCanvas[canvasHeight - 5][numberOfChars - 4] = "\\";
    asciiCanvas[canvasHeight - 5][numberOfChars - 5] = "(";
    asciiCanvas[canvasHeight - 5][numberOfChars - 6] = "-";
    asciiCanvas[canvasHeight - 5][numberOfChars - 7] = ")";
    asciiCanvas[canvasHeight - 5][numberOfChars - 8] = "\\";
    asciiCanvas[canvasHeight - 5][numberOfChars - 9] = "(";

    asciiCanvas[canvasHeight - 6][numberOfChars - 4] = "m";
    asciiCanvas[canvasHeight - 6][numberOfChars - 5] = "M";
    asciiCanvas[canvasHeight - 6][numberOfChars - 6] = "O";
}

function drawJumpAnimation4() {

    // erase previous drawing
    asciiCanvas[canvasHeight - 5][numberOfChars - 3] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 4] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 5] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 6] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 7] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 8] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 9] = "&nbsp;";
    asciiCanvas[canvasHeight - 6][numberOfChars - 4] = "&nbsp;";
    asciiCanvas[canvasHeight - 6][numberOfChars - 5] = "&nbsp;";
    asciiCanvas[canvasHeight - 6][numberOfChars - 6] = "&nbsp;";

    /*
       OMm
    (\)-(\)


    */
    asciiCanvas[canvasHeight - 4][numberOfChars - 3] = ")";
    asciiCanvas[canvasHeight - 4][numberOfChars - 4] = "|";
    asciiCanvas[canvasHeight - 4][numberOfChars - 5] = "(";
    asciiCanvas[canvasHeight - 4][numberOfChars - 6] = "-";
    asciiCanvas[canvasHeight - 4][numberOfChars - 7] = ")";
    asciiCanvas[canvasHeight - 4][numberOfChars - 8] = "|";
    asciiCanvas[canvasHeight - 4][numberOfChars - 9] = "(";

    asciiCanvas[canvasHeight - 5][numberOfChars - 4] = "m";
    asciiCanvas[canvasHeight - 5][numberOfChars - 5] = "M";
    asciiCanvas[canvasHeight - 5][numberOfChars - 6] = "O";
}

function drawJumpAnimation5() {

    // erase previous drawing
    asciiCanvas[canvasHeight - 4][numberOfChars - 3] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 4] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 5] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 6] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 7] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 8] = "&nbsp;";
    asciiCanvas[canvasHeight - 4][numberOfChars - 9] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 4] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 5] = "&nbsp;";
    asciiCanvas[canvasHeight - 5][numberOfChars - 6] = "&nbsp;";

    /*
       Omm
    (-)_(-)
    */
    asciiCanvas[canvasHeight - 3][numberOfChars - 3] = ")";
    asciiCanvas[canvasHeight - 3][numberOfChars - 4] = "-";
    asciiCanvas[canvasHeight - 3][numberOfChars - 5] = "(";
    asciiCanvas[canvasHeight - 3][numberOfChars - 6] = "_";
    asciiCanvas[canvasHeight - 3][numberOfChars - 7] = ")";
    asciiCanvas[canvasHeight - 3][numberOfChars - 8] = "-";
    asciiCanvas[canvasHeight - 3][numberOfChars - 9] = "(";

    asciiCanvas[canvasHeight - 4][numberOfChars - 4] = "m";
    asciiCanvas[canvasHeight - 4][numberOfChars - 5] = "m";
    asciiCanvas[canvasHeight - 4][numberOfChars - 6] = "O";
}

function jumpAnimation() {
    if( jumpState == 0 ) {
        drawJumpAnimation1();
    }
    else if( jumpState == 1 || jumpState == 2 ) {
        drawJumpAnimation2();
    }
    else if( jumpState == 3 ||
             jumpState == 4 ||
             jumpState == 5 ||
             jumpState == 6) 
    {
        drawJumpAnimation3();
    }
    else if( jumpState == 7 || jumpState == 8 ) {
        drawJumpAnimation4();
    }
    else if( jumpState == 9 ) {
        drawJumpAnimation5();
    }
    jumpState++;

    if ( jumpState >= END_OF_JUMPING_ANIMATION ) {
        drawCar();
        isCarOnGround = true;
        jumpState = 0;
        numberForWheelState = HORIZONTAL_LINE;
    }
}

function spinWheels() {
    const wheelYPosition = canvasHeight - 3;
    const leftWheelXPosition = numberOfChars - 8;
    const rightWheelXPosition = numberOfChars - 4;
    const numberOfStates = 4;

    if( numberForWheelState === 0 ) {
        asciiCanvas[wheelYPosition][rightWheelXPosition] = "|";
        asciiCanvas[wheelYPosition][leftWheelXPosition] = "|";
    }
    else if ( numberForWheelState === 1 ) {
        asciiCanvas[wheelYPosition][rightWheelXPosition] = "\\";
        asciiCanvas[wheelYPosition][leftWheelXPosition] = "\\";
    }
    else if ( numberForWheelState === 2 ) {
        asciiCanvas[wheelYPosition][rightWheelXPosition] = "-";
        asciiCanvas[wheelYPosition][leftWheelXPosition] = "-";
    }
    else {
        asciiCanvas[wheelYPosition][rightWheelXPosition] = "/";
        asciiCanvas[wheelYPosition][leftWheelXPosition] = "/";
    }
    // numberForWheelState++ modulo number of states
    numberForWheelState = (numberForWheelState + 1) % numberOfStates;
}

function scroll() {
    if( isCarOnGround ) {
        spinWheels();
    }
    else { // Car is jumping
        jumpAnimation();
    }

    let isCrater = (next === (indexForScroll % courseWidth));

    if( isCrater ) {
        holeIndexIter = (holeIndexIter + 1) % holes.length;
        next = holes[holeIndexIter];
    }
    const penultimateRow = canvasHeight - 2;
    const cellInFrontOfCar = numberOfChars - 11;

    for( let i = 0; i < numberOfChars; i++) {
        let tempIsCrater = (asciiCanvas[penultimateRow][i] !== "#");
        if( isCrater ) {
            asciiCanvas[penultimateRow][i] = "&nbsp;";
        }
        else {
            asciiCanvas[penultimateRow][i] = "#";
        }
        isCrater = tempIsCrater;
    }
    indexForScroll = (indexForScroll + 1) % courseWidth; 

    // jump if next to crater
    if( asciiCanvas[penultimateRow][cellInFrontOfCar] !== "#" ) {
        isCarOnGround = false;
    }

    drawCanvas(true);
}

initCanvasMatrix(false);
drawFloor();
drawCar();
drawCanvas(true);
scrollIntervalId = setInterval(scroll, frameRateInMiliseconds); 
// --- END of MOON-BUGGY code

// --- START cloud animation code
const cloudCanvasHeight = 10;
const cloudCanvasContainer = document.getElementById("cloud-canvas-container");
const sunOffset = 8;
const cloudNames = ["cloud1", "cloud2", "cloud3", "cloud4"];
const cloudNameIndex = 0;
const cloudOffsetIndex = 1;
const windowResizeTime = 500;
const cloudDrawingFrameRate = 440;

let cloudIsScrolling = true;
let cloudScrollIntervalId = null;
let cloudAsciiCanvas = [];
let cloudsBeingDrawn = [["cloud1", numberOfChars - 65]];

function resetCloudCanvasMatrix() {
    for( let j = 0; j < cloudCanvasHeight; j++) {
        for(let i = 0; i < numberOfChars; i++) {
            cloudAsciiCanvas[j][i] = "&nbsp;";
        }
    }
}

function drawClouds(isRemovePrevious) {
    if( isRemovePrevious ) {
        let canvasToRemove = document.getElementById("cloud-ascii-canvas");
        canvasToRemove.remove();
    }

    let asciiCloudsCanvasString =
        "<div class='canvas-lines' id='cloud-ascii-canvas'>";
    for( let j = 0; j < cloudCanvasHeight; j++) {
        let row = 
            `<span class="asciiRow">${cloudAsciiCanvas[j].join("")}</span>`;
        asciiCloudsCanvasString = asciiCloudsCanvasString + row;
    }
    asciiCloudsCanvasString = asciiCloudsCanvasString + "</div>";
    cloudCanvasContainer.insertAdjacentHTML(
        "beforeend", 
        asciiCloudsCanvasString
    );
    resetCloudCanvasMatrix();
}

function initCloudsMatrix(shouldRemovePreviousCanvas) {
    for( let j = 0; j < cloudCanvasHeight; j++) {
        let row = [];
        for(let i = 0; i < numberOfChars; i++) {
            row.push("&nbsp;");
        }
        cloudAsciiCanvas.push(row);
    }
    drawClouds(shouldRemovePreviousCanvas);
}

const cloudWidth = 26;
const cloudHeight = 9;

/*  Cloud1                         
 *                            
 *                  .-,         
 *             _ .-(```),     
 *        .--,(`(````)```)   
 *    _.-(````````````````, 
 *   (_____________________)
 *                          
 *                          
 */                         
const cloud1Drawing = `\
                          \
               .-,        \
          _ .-(\`\`\`),      \
     .--,(\`(\`\`\`\`)\`\`\`)     \
 _.-(\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`,    \
(_____________________)   \
                          \
                          \
                          \
`;

/* Cloud2
 *           .--,     
 *      _.-,(````)    
 *  __,((`````(```)._ 
 * (_________________)
 *                    
 *                    
 */                   
const cloud2Drawing = `\
                          \
                          \
          .--,            \
     _.-,(\`\`\`\`)           \
 __,((\`\`\`\`\`(\`\`\`)._        \
(_________________)       \
                          \
                          \
                          \
`;

/*  Cloud3                 
 *       _-.         
 *     - ```),-._    
 *  __(```)`````)),_ 
 * (________________)
 */
const cloud3Drawing = `\
                          \
                          \
                          \
                          \
      _-.                 \
    - \`\`\`),-._            \
 __(\`\`\`)\`\`\`\`\`)),_         \
(________________)        \
                          \
`;

/* cloud4
 *          ,-.              
 *        ,(``'-. _          
 *      ,(``(````)`),--.     
 *  _.-(````````````````)-._ 
 * (________________________)
 *                           
 *                           
 *                          
 */
const cloud4Drawing = `\
         ,-.              \
       ,(\`\`'-. _          \
     ,(\`\`(\`\`\`\`)\`),--.     \
 _.-(\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`)-._ \
(________________________)\
                          \
                          \
                          \
                          \
`;

/* sun
 *                           
 *      ....                 
 *   ..      ..              
 * ..   ,--.   ..            
 * .   (    )   .            
 * ..   `--'   ..            
 *   ..      ..              
 *      ....                 
 *                           
 */
const sunDrawing = `\
                          \
     ....                 \
  ..      ..              \
..   ,--.   ..            \
.   (    )   .            \
..   \`--'   ..            \
  ..      ..              \
     ....                 \
                          \
`;

function drawSkyThings( drawingSelection, horizontalOffset ) {
    let drawingTemplate = null;
    if( drawingSelection === "cloud1" ) {
        drawingTemplate = cloud1Drawing;
    }
    else if( drawingSelection === "cloud2" ) {
        drawingTemplate = cloud2Drawing;
    }
    else if( drawingSelection === "cloud3" ) {
        drawingTemplate = cloud3Drawing;
    }
    else if( drawingSelection === "cloud4" ) {
        drawingTemplate = cloud4Drawing;
    }
    else if( drawingSelection === "sun" ) {
        drawingTemplate = sunDrawing;
    }
    else {
        return 1;
    }

    for( let j = 0; j < cloudHeight; j++ ) {
        for( let i = 0; i < cloudWidth; i++ ) {
            if( (i + horizontalOffset) < 0 ) {
                continue;
            }
            if( (i + horizontalOffset) >= numberOfChars ) {
                continue;
            }
            if( drawingTemplate[i + (j * cloudWidth)] == " " ) {
                continue;
            }
            cloudAsciiCanvas[j][i + horizontalOffset] =
                drawingTemplate[i + (j * cloudWidth)];
        }
    }
}

function cloudScroll() {
    // Draw a cloud randomly every 50 cells, on average.
    if( Math.floor(Math.random() * 50) == 0 ) {
        
        let cloudNameTempIndex =
            Math.round(Math.random() * (cloudNames.length - 1));
        cloudsBeingDrawn.push( [ cloudNames[cloudNameTempIndex], -25 ] );
    }
    drawSkyThings("sun", numberOfChars - cloudWidth + sunOffset);
    for( let i = cloudsBeingDrawn.length - 1; i >= 0 ; i-- ) {
        let iter = cloudsBeingDrawn[i];
        if( iter[1] >= numberOfChars ) {
            if( cloudsBeingDrawn.length == 0 ) {
                continue;
            }
            cloudsBeingDrawn.splice(i, 1);
            continue;
        }
        drawSkyThings(iter[cloudNameIndex], iter[cloudOffsetIndex]);
        iter[cloudOffsetIndex] = iter[cloudOffsetIndex] + 1;
    }
    drawClouds(true);
}

initCloudsMatrix(false);
drawClouds(true);
cloudScrollIntervalId = setInterval(cloudScroll, cloudDrawingFrameRate); 

// --- END cloud animation code
// --- Tooltip
const tooltipVerticalOffset = -28;
const tooltipHorizontalOffset = 25;
let isEmailTooltipVisible = false;
let isPhoneTooltipVisible = false;
let emailTooltip = document.getElementById("email-tooltip");
let phoneTooltip = document.getElementById("phone-tooltip");

let emailLink = document.getElementById("email-link");
let phoneLink = document.getElementById("phone-link");

function getTooltipVerticalPosition(
    tooltipId,
    clickedElementRect 
) {
    const emailTooltipOffset = tooltipVerticalOffset + 15;
    const phoneTooltipOffset = tooltipVerticalOffset - 20;
    const screenTooSmallUseAlt = 780;

    if( window.innerWidth < screenTooSmallUseAlt ) { 
        if( tooltipId == "email-tooltip" ) {
            return clickedElementRect.top 
                + emailTooltipOffset
                + window.scrollY;
        }
        return clickedElementRect.top 
            + phoneTooltipOffset
            + window.scrollY;
    }
    return clickedElementRect.top + tooltipVerticalOffset + window.scrollY;
}

function getTooltipHorizontalPosition(
    tooltipId, 
    clickedElementRect, 
    tooltipRect
) {
    const screenTooSmallUseAlt = 780;
    if( window.innerWidth < screenTooSmallUseAlt ) { 
        console.log("screen too small");
        let tooltipHalfWidth = tooltipRect.width / 2;
        let clickedElementCenter =
            clickedElementRect.left + (clickedElementRect.width / 2);
        return (clickedElementCenter - tooltipHalfWidth) + "px";
    }
    if( tooltipId == "email-tooltip" ) {
        return (clickedElementRect.right + tooltipHorizontalOffset) + "px";
    }
    return (clickedElementRect.left - tooltipRect.width) + "px";
}

function toggleTooltip(e, tooltipElement, clickedElement, isTooltipVisible) {
    let tooltipRect = tooltipElement.getBoundingClientRect();
    let clickedElementRect = clickedElement.getBoundingClientRect();
    if( isTooltipVisible ) {
        tooltipElement.style.left = "-1000px"; // hide the element offscreen
    }
    else {
        let newHorizontalPosition = 
            getTooltipHorizontalPosition(
                tooltipElement.id,
                clickedElementRect,
                tooltipRect
            );
        tooltipElement.style.left = newHorizontalPosition;
        let newTopPos = 
            getTooltipVerticalPosition(tooltipElement.id, clickedElementRect);

        tooltipElement.style.top = newTopPos + "px";
    }
    tooltipElement.classList.toggle("hidden-tooltip");
    if(tooltipElement.id == "email-tooltip" ) {
        isEmailTooltipVisible = !isEmailTooltipVisible;
    }
    else {
        isPhoneTooltipVisible = !isPhoneTooltipVisible;
    }
}

emailLink.onclick = (e) => {
    toggleTooltip(e, emailTooltip, emailLink, isEmailTooltipVisible);
};
phoneLink.onclick = (e) => { 
    toggleTooltip(e, phoneTooltip, phoneLink, isPhoneTooltipVisible);
};

let closeEmailTooltip = document.getElementById("close-email-tooltip");
let closePhoneTooltip = document.getElementById("close-phone-tooltip");

closeEmailTooltip.onclick = (e) => {
    toggleTooltip(e, emailTooltip, emailLink, isEmailTooltipVisible);
};

closePhoneTooltip.onclick = (e) => {
    toggleTooltip(e, phoneTooltip, phoneLink, isPhoneTooltipVisible);
};

// --- END tooltip

window.onresize = function() {
    if( isEmailTooltipVisible ) {
        toggleTooltip(null, emailTooltip, emailLink, isEmailTooltipVisible);
    }
    if( isPhoneTooltipVisible ) {
        toggleTooltip(null, phoneTooltip, phoneLink, isPhoneTooltipVisible);
    }
    if( cloudIsScrolling ) {
        // ascii sky drawing
        clearInterval(cloudScrollIntervalId);
        let cloudToRemove = document.getElementById("cloud-ascii-canvas");
        cloudToRemove.remove();
        cloudIsScrolling = false;
        let cloudAsciiCanvasString = 
            `<div class="canvas-lines" id="cloud-ascii-canvas">
                 <span class="asciiRow">
                 </span>
            </div>`;

        cloudCanvasContainer.insertAdjacentHTML(
            "beforeend",
            cloudAsciiCanvasString
        );

        // moon-buggy resizing message
        clearInterval(scrollIntervalId);
        let toRemove = document.getElementById("ascii-canvas");
        toRemove.remove();
        let asciiCanvasString = 
            `<div class="canvas-lines" id="ascii-canvas">
                 <span class="asciiRow">
                  Animation of Jochen Voss' Moon Buggy by Fernando Zegada
                 </span>
            </div>`;
        canvasContainer.insertAdjacentHTML("beforeend", asciiCanvasString);
    }
    if( this.resizeTimeout ) {
        clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(function() {
        // ascii sky drawing
        cloudIsScrolling = true;
        windowWidth = window.innerWidth;
        numberOfChars = Math.floor(windowWidth / charWidth);

        cloudAsciiCanvas = [];
        initCloudsMatrix(true);
        drawClouds(true);
        cloudScrollIntervalId = 
            setInterval(cloudScroll, cloudDrawingFrameRate); 

        // earth-buggy drawing
        numberForWheelState = 0;
        isCarOnGround = true;
        jumpState = 0;
        holeIndexIter = 0;
        next = holes[holeIndexIter];
        windowWidth = window.innerWidth;
        numberOfChars = Math.floor(windowWidth / charWidth);
        indexForScroll = (numberOfChars + 1) % courseWidth;

        asciiCanvas = [];
        initCanvasMatrix(true);
        drawFloor();
        drawCar();
        drawCanvas(true);
        scrollIntervalId = setInterval(scroll, frameRateInMiliseconds); 

    }, windowResizeTime);
};
