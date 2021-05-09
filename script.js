const SCROLL_DURATION = 1500;

const MIN_SCREEN_WIDTH_FOR_ANIMATIONS = 550;

const FIRST_PAGE = 1;
const SECOND_PAGE = 2;
const THIRD_PAGE = 3;

const FIRST_ELMN = 0;
const SECOND_ELMN = 1;
const THIRD_ELMN = 2;

const SCROLL_UP = 0;
const SCROLL_DOWN = 0;

const TYPE_LETTER_DURATION = 120;
const HALF_A_SECOND = 500;
const ONE_SECOND = 1000;

let isScrollDisabled = false;

var elementsToAnimateSecondPage =
    document.querySelectorAll(".animate-second-page");
var elementsToAnimateThirdPage =
    document.querySelectorAll(".animate-third-page");

if( window.innerHeight > MIN_SCREEN_WIDTH_FOR_ANIMATIONS ) {
    for( let elmn of elementsToAnimateSecondPage ) {
        elmn.classList.add("hidden");
    }
    for( let elmn of elementsToAnimateThirdPage ) {
        elmn.classList.add("hidden");
    }
}

var scrollDownKeys = ["ArrowDown", " "];
var scrollUpKeys = ["ArrowUp"];

var currentPageViewIsOn = FIRST_PAGE;
var isPageTransitioning = false; 

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

function animateThirdPage() {
    let windowHeight = window.innerHeight;

    for( let i = 0; i < elementsToAnimateThirdPage.length; i++ ) {
        let element = elementsToAnimateThirdPage[i];
        let positionFromTop =
            elementsToAnimateThirdPage[i].getBoundingClientRect().top;

        if( positionFromTop - windowHeight <= 0 ) {
            element.classList.add("fade-in-element");
            element.classList.remove("hidden");
        }
    }
}

function scrollToPage(pageElementIndex, pageIndex) {
    pageElements[pageElementIndex].scrollIntoView();
    currentPageViewIsOn = pageIndex;
}

function isScrollDownKey(keyName) {
    for( let downKey of scrollDownKeys ) {
        if( keyName == downKey ) {
            return true;
        }
    }
    return false;
}

function isScrollUpKey(keyName) {
    for( let upKey of scrollUpKeys ) {
        if( keyName == upKey ) {
            return true;
        }
    }
    return false;
}

function transitionBetweenPages(scrollEvent) {
    // Block transitioning for a bit and do the animation 
    // for elments appearing on screen when in view
    if( isPageTransitioning === true ) {
        return;
    }
    isPageTransitioning = true;
    setTimeout(() => {
        isPageTransitioning = false; 
    }, SCROLL_DURATION);

    // actual transitioning between pages 
    if( currentPageViewIsOn === FIRST_PAGE ) {
        if( scrollEvent.deltaY > SCROLL_DOWN ) {
            scrollToPage(SECOND_ELMN, SECOND_PAGE);
            animateSecondPage(); 
        }
        else if( scrollEvent.type === "keydown" ) {
            if( isScrollDownKey(scrollEvent.key) ) {
                scrollToPage(SECOND_ELMN, SECOND_PAGE);
                animateSecondPage(); 
            }
        }
    }
    else if( currentPageViewIsOn === SECOND_PAGE ) {
        if( scrollEvent.deltaY < SCROLL_UP ) {
            scrollToPage(FIRST_ELMN, FIRST_PAGE);
        }
        else if( scrollEvent.deltaY > SCROLL_DOWN ) {
            scrollToPage(THIRD_ELMN, THIRD_PAGE);
            animateThirdPage(); 
        }
        else if( scrollEvent.type === "keydown" ) {
            if( isScrollUpKey(scrollEvent.key) ) {
                scrollToPage(FIRST_ELMN, FIRST_PAGE);
            }
            else if( isScrollDownKey(scrollEvent.key) ) {
                scrollToPage(THIRD_ELMN, THIRD_PAGE);
                animateThirdPage(); 
            }
        }
    }
    else /* currentViewIsOnThirdPage */ {
        if( scrollEvent.deltaY < SCROLL_UP ) {
            scrollToPage(SECOND_ELMN, SECOND_PAGE);
        }
        else if( scrollEvent.type === "keydown" ) {
            if( isScrollUpKey(scrollEvent.key) ) {
                scrollToPage(SECOND_ELMN, SECOND_PAGE);
            }
        }
    }
}

// Code to prevent all scrolling
// courtesy of gblazex on
// https://stackoverflow.com/a/4770179

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1};

function preventDefaultAndDoCustom(e) {
    console.log("ping");
    e.preventDefault();
    transitionBetweenPages(e);
}

function preventDefaultForScrollKeys(e) {
    if( keys[e.keyCode] ) {
        console.log("ping");
        preventDefaultAndDoCustom(e);
        transitionBetweenPages(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding events
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, "passive", {
        get: function () { supportsPassive = true; }
    }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

function disableScroll() {
    console.log("peng");
    window.addEventListener(
        "DOMMouseScroll",
        preventDefaultAndDoCustom, 
        false); // older FF
    window.addEventListener(
        wheelEvent, 
        preventDefaultAndDoCustom, 
        wheelOpt); // modern desktop
    window.addEventListener(
        "touchmove", 
        preventDefaultAndDoCustom, 
        wheelOpt); // mobile
    window.addEventListener(
        "keydown", 
        preventDefaultForScrollKeys, 
        false);
}

function enableScroll() {
    window.removeEventListener("DOMMouseScroll",
        preventDefaultAndDoCustom,
        false);
    window.removeEventListener(wheelEvent,
        preventDefaultAndDoCustom, 
        wheelOpt);
    window.removeEventListener("touchmove", 
        preventDefaultAndDoCustom,
        wheelOpt);
    window.removeEventListener("keydown", 
        preventDefaultForScrollKeys, 
        false);
}

document.getElementById("second-page-link")
    .addEventListener("click",
        (e) => {
            if( ! (e.metaKey || e.ctrlKey) ) {
                currentPageViewIsOn = SECOND_PAGE;
                animateSecondPage(); 
            }
        });

document.getElementById("third-page-link")
    .addEventListener("click",
        (e) => {
            if( ! (e.metaKey || e.ctrlKey) ) {
                currentPageViewIsOn = THIRD_PAGE;
                animateSecondPage(); 
                animateThirdPage(); 
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

if( window.innerWidth > MIN_SCREEN_WIDTH_FOR_ANIMATIONS ) {
    disableScroll();
    isScrollDisabled = true;
}
else {
    for( let elmn of elementsToAnimateSecondPage ) {
        elmn.classList.remove("hidden");
    }
    for( let elmn of elementsToAnimateThirdPage ) {
        elmn.classList.remove("hidden");
    }
}

window.onresize = () => {
    if( window.innerWidth <= MIN_SCREEN_WIDTH_FOR_ANIMATIONS
        && isScrollDisabled ) 
    {
        enableScroll();
        isScrollDisabled = false;
    }
    else if( window.innerWidth > MIN_SCREEN_WIDTH_FOR_ANIMATIONS
             && (! isScrollDisabled) )
    {
        disableScroll();
        scrollToPage(FIRST_ELMN, FIRST_PAGE);
    }
};

let areProjectAnimationsBlocked = {
    "first": false,
    "second": false,
    "third": false,
    "fourth": false,
    "fifth": false,
};

for( let number of ["first", "second", "third", "fourth", "fifth"]) {
    let projectElement = document.getElementById(number + "-project");
    let elementToBeAnimated = projectElement.childNodes[3].childNodes[1];
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

function handleOpenOnNewTab() {
    if (document.visibilityState === "visible") {
        setTimeout( () => {
            if( window.scrollY > 100 
                && window.scrollY <= (window.innerHeight + 50) ) {
                scrollToPage(SECOND_ELMN, SECOND_PAGE);
                animateSecondPage(); 
            }
            else if( window.scrollY > (window.innerHeight + 100) ) {
                scrollToPage(THIRD_ELMN, THIRD_PAGE);
                animateSecondPage(); 
            }
            document.removeEventListener("visibilitychange", handleOpenOnNewTab);
        }, ONE_SECOND);
    }
}

document.addEventListener("visibilitychange", handleOpenOnNewTab);

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
    });
