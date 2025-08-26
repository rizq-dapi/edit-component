let mode = 'none'; // style, text, none
let changes = [];

let element_id = null;
let initial_style = null;
let initial_html = null;

let similar_elements = [];

let initial_html_image = '';


let hover_highlight = null;

let uploadedImageFile = null;

const params = new URLSearchParams(window.location.search);

let editEnabled = false;

function enableEdit() {
    editEnabled = true;
    document.getElementById('tasker-edit-button').style.display = 'none';
    document.getElementById('tasker-done-button').style.display = 'flex';
    document.getElementsByClassName('tasker-bottom-bar')[0].classList.add('tasker-done-button-highlighted');
}

function disableEdit() {
    editEnabled = false;
    document.getElementById('tasker-edit-button').style.display = 'flex';
    document.getElementById('tasker-done-button').style.display = 'none';
    document.getElementsByClassName('tasker-bottom-bar')[0].classList.remove('tasker-done-button-highlighted');
    // remove the hover_highlight
    hover_highlight.style.display = 'none';
    
    discardChanges();
}

function hideBottomBar() {
    document.getElementsByClassName('tasker-bottom-bar')[0].style.display = 'none';
}

// if (!params.get('edit') || params.get('edit') !== 'true') {
// if(!editEnabled) {

// } else {


    // create a div that is fixed right 30px and right 30px and has the following svg inside it
    let pointerSVG = `<svg class="do-not-edit" width="14" height="15" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.904 14.8882C4.95718 15.1271 5.08215 15.3441 5.26214 15.5099C5.44214 15.6758 5.66855 15.7826 5.91101 15.8162C6.15347 15.8497 6.40037 15.8083 6.61862 15.6974C6.83686 15.5866 7.016 15.4117 7.132 15.1962L9.222 12.1032L14.129 17.0102C14.2281 17.1093 14.3457 17.1879 14.4752 17.2415C14.6046 17.2951 14.7434 17.3227 14.8835 17.3227C15.0236 17.3227 15.1624 17.2951 15.2918 17.2415C15.4213 17.1879 15.5389 17.1093 15.638 17.0102L16.685 15.9632C16.7841 15.8641 16.8627 15.7465 16.9163 15.617C16.9699 15.4876 16.9975 15.3488 16.9975 15.2087C16.9975 15.0686 16.9699 14.9298 16.9163 14.8004C16.8627 14.6709 16.7841 14.5533 16.685 14.4542L11.778 9.5472L14.891 7.4572C15.1065 7.34112 15.2814 7.1619 15.3921 6.94359C15.5029 6.72527 15.5442 6.47831 15.5106 6.23584C15.477 5.99336 15.37 5.76697 15.204 5.58704C15.038 5.4071 14.821 5.28224 14.582 5.2292L1 1.3252L4.904 14.8882Z" stroke="#343947" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    // create a div that is fixed right 30px and right 30px and has the following svg inside it
    let bottomBar = document.createElement('div');
    bottomBar.innerHTML = `
    <div id="tasker-edit-button" class="tasker-edit-button do-not-edit" onclick="enableEdit();">
        ${pointerSVG} <span class="do-not-edit">Edit Elements</span>
    </div>
    <div id="tasker-done-button" class="tasker-done-button do-not-edit" onclick="disableEdit();" style="display: none;">
        <span class="do-not-edit">Done editing</span>
    </div> 

    <div class="tasker-close-button do-not-edit" onclick="hideBottomBar();">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
    `;

    // add .do-not-edit
    bottomBar.classList.add('do-not-edit');
    bottomBar.classList.add('tasker-bottom-bar');
    document.body.appendChild(bottomBar);



    // import <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css"/>

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css';
    document.head.appendChild(link);


    // import <script src="https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js"></script>

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js';
    // append to the end of the body
    document.body.appendChild(script);



    document.body.addEventListener('click', function (e) {
        const el = e.target;


        if(!editEnabled) {
            return;
        }


        // if the element is a child of .tasker_container return;
        // if element == element_id return
        if(el.closest('.tasker_container') || el.closest('.clr-picker') || el.closest('.do-not-edit')) {
            return;
        }

        // if(el.closest('#tasker-element-overlay')) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();

            if(!el.id) {
                // create a random id for the element
                el.id = 'tasker-element-' + Math.random().toString(36).substring(2, 15);
                // add the id to the element
                el.id = el.id;
            }
                
            editElement(el.id);
    

        // }

    }, true); // <-- enabling capture phase


    // create a div that is absolute and has a size of 10,10 and is positioned at the top left of the screen and has a class of .hover-highlight
    hover_highlight = document.createElement('div');
    hover_highlight.className = 'hover-highlight';
    hover_highlight.style.position = 'absolute';
    hover_highlight.style.width = '1px';
    hover_highlight.style.height = '1px';
    hover_highlight.style.top = '0';
    hover_highlight.style.left = '0';
    // no pointer events
    hover_highlight.style.pointerEvents = 'none';
    // id should be #tasker-element-overlay
    hover_highlight.id = 'tasker-element-overlay';
    // z-index 100000
    hover_highlight.style.zIndex = '1000';
    // display none
    hover_highlight.style.display = 'none';
    document.body.appendChild(hover_highlight);



    document.body.addEventListener('mouseover', function (e) {

        if(!editEnabled) {
            return;
        }


        // if the element is a child of .tasker_container return;
        if(e.target.closest('.tasker_container') || e.target.closest('.clr-picker') || e.target.closest('.tasker-edit-button') || e.target.closest('.do-not-edit')) {
            // hide the hover_highlight
            hover_highlight.style.display = 'none';
            return;
        }


        if (e.target.id || e.target.className) {
            // if the element does not already have the class hover-highlight, add it
            /* if(!e.target.classList.contains('hover-highlight')) {
                e.target.classList.add('hover-highlight');
            } */

            
            // get the position of the element
            const rect = e.target.getBoundingClientRect();
            // set the position of the hover_highlight to the position of the element
            // handle the scroll of the page
            hover_highlight.style.top = rect.top + window.scrollY + 'px';
            hover_highlight.style.left = rect.left + window.scrollX + 'px';
            // set the width and height of the hover_highlight to the width and height of the element
            hover_highlight.style.width = rect.width + 'px';
            hover_highlight.style.height = rect.height + 'px';
            // show the hover_highlight
            hover_highlight.style.display = 'block';

            // make the radius of the hover_highlight the same as the element
            hover_highlight.style.borderRadius = e.target.style.borderRadius;

            // make the cursor for the body a pointer
            document.body.style.cursor = 'pointer';
            
            
        }
    }, true);

    document.body.addEventListener('mouseout', function (e) {

        if(!editEnabled) {
            return;
        }

        // if the element is a child of .tasker_container return;
        if(e.target.closest('.tasker_container')) {
            return;
        }

        if(element_id && e.target.id === element_id) {
            return;
        }

        // if (e.target.id) {
            // e.target.classList.remove('hover-highlight');

            // check if the mouse is within the target element bounds and take into consideration the scroll of the page

            const rect = e.target.getBoundingClientRect();
            if(e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                hover_highlight.style.display = 'block';
            } else {
                hover_highlight.style.display = 'none';
                // make the cursor for the body a default
                document.body.style.cursor = 'default';
            }
        // }
    }, true);



    





    const style = document.createElement('style');
    style.textContent = `

        #tasker-element-overlay {
            cursor: pointer;
        }

        .tasker-close-button {
            position: absolute;
            right: 16px;
            top: 20px;
            cursor: pointer;
        }

        .tasker-close-button:hover {
            opacity: 0.5;
        }

        .tasker-edit-button {
            font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
            font-size: 14px;
            font-weight: 500;
            color: #343947;
            display: flex;
            align-items: center;
            flex-flow: row;
            gap: 8px;
            background: #dfdfdf;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;
            /* width: 130px; */
            /* text-align: center; */
            border: 1px solid white;
            box-sizing: content-box;
        }

        .tasker-done-button {
            font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
            gap: 8px;
            background: #0049e5;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;
            /* width: 130px; */
            /* text-align: center; */
            border: 1px solid #0049e5;
            box-sizing: content-box;
        }

        .tasker-bottom-bar {
            position: fixed;
            left: 0px;
            bottom: 0px;
            z-index: 10000;
            width: 100%;
            text-align: center;
            display: flex;
            flex-flow: column;
            align-items: center;
            padding-bottom: 16px;
            padding-top: 8px;
            background: linear-gradient(to bottom, transparent, black);
            z-index: 10000;
        }

        .tasker-done-button-highlighted {
            background: linear-gradient(to bottom, transparent, #0049e5) !important;
        }

        .tasker-edit-button:hover {
            background: #c7c7c7;
        }

        .hover-highlight {
            position: relative;
            background-color: rgba(0,73,229, 0.3) !important;
            outline: 0.5px solid blue !important;
            cursor: pointer;
            -webkit-box-shadow:0px 0px 10px 2px rgba(0,73,229,0.69) !important;
            -moz-box-shadow: 0px 0px 10px 2px rgba(0,73,229,0.69) !important;
            box-shadow: 0px 0px 10px 2px rgba(0,73,229,0.69) !important;
            box-sizing: border-box;
        }
        .selected-highlight {
            position: relative;
            outline: 0.5px solid rgba(0,73,229, 1) !important;
            cursor: pointer;
            -webkit-box-shadow:0px 0px 10px 2px rgba(0,73,229,0.69) !important;
            -moz-box-shadow: 0px 0px 10px 2px rgba(0,73,229,0.69) !important;
            box-shadow: 0px 0px 10px 2px rgba(0,73,229,0.69) !important;
            box-sizing: border-box;
        }


        .animating-highlight {
            position: relative;
            outline: 0.5px solid rgba(0, 73, 229, 1);
            cursor: pointer;
            box-sizing: border-box;
        }

        .animating-highlight::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 2px solid rgba(0, 73, 229, 0.5);
            border-radius: 4px;
            pointer-events: none;
            animation: borderGlow 1.5s infinite ease-in-out;
        }

        @keyframes borderGlow {
        0% {
            box-shadow: 0 0 0px 0 rgba(0, 73, 229, 0);
            border-color: rgba(0, 73, 229, 0.2);
        }
        50% {
            box-shadow: 0 0 12px 4px rgba(0, 73, 229, 0.7);
            border-color: rgba(0, 73, 229, 0.7);
        }
        100% {
            box-shadow: 0 0 0px 0 rgba(0, 73, 229, 0);
            border-color: rgba(0, 73, 229, 0.2);
        }
        }
            

        @keyframes shimmer {
            0% {
            background-position: -200% 0;
            }
            100% {
            background-position: 200% 0;
            }
        }

        .shimmer-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
            to right,
            rgba(7, 10, 182, 0) 0%,
            rgba(7, 10, 182, 0.4) 50%,
            rgba(7, 10, 182, 0) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            pointer-events: none;
            z-index: 2;
        }

        .shimmer-wrapper {
            position: relative !important;
        }



        .border-animation {
            background: conic-gradient(from var(--angle), #1F80FF 0%, #1F80FF00 50%, #1F80FF 100%);
            animation: 4s linear 0s infinite normal none running animation-tkatey;
            transition: border-radius 0.3s ease-in-out;
        }




    `;
    document.head.appendChild(style);

// }









function editElement(_element_id) {

    // console.log('FUNCTION editElement', _element_id);


    discardChanges();

    injectHtml();
    positionTaskerContainer(_element_id);


    // make .tasker_container draggable
    const el = document.querySelector('.tasker_container');
    if (!el) return;

    el.style.cursor = 'move'; // show drag cursor

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    el.addEventListener('mousedown', function (e) {
        isDragging = true;
        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none'; // prevent text selection
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        const x = e.clientX - offsetX + window.scrollX;
        const y = e.clientY - offsetY + window.scrollY;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    // on mouse over move the hover_highlight to the position of the element
    el.addEventListener('mouseover', function (e) {
        hover_highlight.style.top = document.getElementById(_element_id).getBoundingClientRect().top + window.scrollY + 'px';
        hover_highlight.style.left = document.getElementById(_element_id).getBoundingClientRect().left + window.scrollX + 'px';
        hover_highlight.style.width = document.getElementById(_element_id).getBoundingClientRect().width + 'px';
        hover_highlight.style.height = document.getElementById(_element_id).getBoundingClientRect().height + 'px';
        hover_highlight.style.borderRadius = document.getElementById(_element_id).style.borderRadius;   
        hover_highlight.style.display = 'block';
    });


    // add class selected-highlight to the element
    // document.getElementById(_element_id).classList.add('selected-highlight');


    // save initial style of the element
    initial_style = document.getElementById(_element_id).style.cssText;
    initial_html = document.getElementById(_element_id).innerHTML;

    element_id = _element_id;
    

    // inject html '<span class="element-style-container"></span>' at the end of the body
    


    // create x, y coordinates where the element .tasker_container is located 16px under the element centered exactly horizontally but also accounting for the begining and end of the screen and it can also adjust to be placed on the top of the element if the element is too close to the bottom of the screen

    



    


    // add click events for the buttons for text align and font size and font bold and font italic
    document.getElementById('element-align-center').addEventListener('click', () => {
        updateStyle('text-align: center;');
        updateTextAlighButtons('center');
    });
    document.getElementById('element-align-left').addEventListener('click', () => {
        updateStyle('text-align: left;');
        updateTextAlighButtons('left');
    });
    document.getElementById('element-align-right').addEventListener('click', () => {
        updateStyle('text-align: right;');
        updateTextAlighButtons('right');
    });
    document.getElementById('element-font-bold').addEventListener('click', () => {
        // updateStyle('font-weight: bold;');
        // if bold is already applied, remove it
        if(document.getElementById(element_id).style.fontWeight === 'bold') {
            // document.getElementById(element_id).style.fontWeight = 'normal';
            updateStyle('font-weight: normal;');
            // remove active class from the button
            document.getElementById('element-font-bold').classList.remove('container-style-inner-button-active');
        } else {
            // document.getElementById(element_id).style.fontWeight = 'bold';
            updateStyle('font-weight: bold;');
            // add active class to the button
            document.getElementById('element-font-bold').classList.add('container-style-inner-button-active');
        }
    });
    document.getElementById('element-font-italic').addEventListener('click', () => {
        // if italic is already applied, remove it
        if(document.getElementById(element_id).style.fontStyle === 'italic') {
            // document.getElementById(element_id).style.fontStyle = 'normal';
            updateStyle('font-style: normal;');
            // remove active class from the button
            document.getElementById('element-font-italic').classList.remove('container-style-inner-button-active');
        } else {
            // document.getElementById(element_id).style.fontStyle = 'italic';
            updateStyle('font-style: italic;');
            // add active class to the button
            document.getElementById('element-font-italic').classList.add('container-style-inner-button-active');
        }
    });
    document.getElementById('element-underline').addEventListener('click', () => {
        // if underline is already applied, remove it
        if(document.getElementById(element_id).style.textDecoration === 'underline') {
            updateStyle('text-decoration: none;');
            // remove active class from the button
            document.getElementById('element-underline').classList.remove('container-style-inner-button-active');
        } else {
            updateStyle('text-decoration: underline;');
            // add active class to the button
            document.getElementById('element-underline').classList.add('container-style-inner-button-active');
        }
    });

    document.getElementById('element-font-size-input').addEventListener('change', (e) => {
        updateStyle('font-size: ' + e.target.value + 'px;');
    });

    document.getElementById('tasker-ai-input').addEventListener('keyup', (e) => {
        if(e.key === 'Enter') {
            // call ai here

            applyChanges();

        }
    });


    // set the value of font size input to the font size of the element. get the size even if it is not set in style
    // get inherited font size if not set in style
    let font_size = document.getElementById(element_id).style.fontSize;
    if(!font_size) {
        font_size = window.getComputedStyle(document.getElementById(element_id)).fontSize;
    }
    document.getElementById('element-font-size-input').value = font_size.replace('px', '');


    // set the text of the element to the text content of the element_id not the innerHTML
    // only the direct text content and not of the children
    let text = [...document.getElementById(element_id).childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('').trim();
    document.getElementById('container-text-inner-item-input').value = text;



    addEventListenersForInputs();



}


function addEventListenersForInputs() {



    // get the color of the element and if you cant find it get the inherited color and set the .clr-field element color to the same color
    let color = document.getElementById(element_id).style.color;
    if(!color) {
        color = window.getComputedStyle(document.getElementById(element_id)).color;
    }
    let bg_color = document.getElementById(element_id).style.backgroundColor;

    // change the bg of input to the color of the color picker
    document.getElementById('element-text-color').style.backgroundColor = color;

    // change the bg of input to the color of the color picker
    document.getElementById('element-text-bg').style.backgroundColor = bg_color;




    document.getElementById('element-text-color').addEventListener('click', (e) => {
        e.preventDefault();

        Coloris({
            themeMode: 'dark',
            el: '#element-text-color',
            alpha: false,
            defaultColor: color,
            closeButton: true,
            onChange: (color) => {
                updateStyle('color: ' + color + ';');
            }
        });

        
    });

    
    document.getElementById('element-text-bg').addEventListener('click', (e) => {
        e.preventDefault();

        Coloris({
            themeMode: 'dark',
            el: '#element-text-bg',
            alpha: false,
            defaultColor: '#000000',
            closeButton: true,
            onChange: (color) => {
                updateStyle('background-color: ' + color + ';');
            }
        });

    });


    document.getElementById('tasker-ai-input').addEventListener('keyup', (e) => {
        updateAIText(e.target.value);
    });
    document.getElementById('tasker-ai-input').addEventListener('change', (e) => {
        updateAIText(e.target.value);
    });


    // on change of the input, update the text of the element updateText(text) on change and on key up
    document.getElementById('container-text-inner-item-input').addEventListener('keyup', (e) => {
        updateText(e.target.value);
    });
    document.getElementById('container-text-inner-item-input').addEventListener('change', (e) => {
        updateText(e.target.value);
    });


    // margin x
    document.getElementById('container-numbers-margin-x').addEventListener('change', (e) => {
        updateMarginX(e.target.value);
    });
    document.getElementById('container-numbers-margin-x').addEventListener('keyup', (e) => {
        updateMarginX(e.target.value);
    });

    // margin y
    document.getElementById('container-numbers-margin-y').addEventListener('change', (e) => {
        updateMarginY(e.target.value);
    });
    document.getElementById('container-numbers-margin-y').addEventListener('keyup', (e) => {
        updateMarginY(e.target.value);
    });

    // padding x
    document.getElementById('container-numbers-padding-x').addEventListener('change', (e) => {
        updatePaddingX(e.target.value);
    });
    document.getElementById('container-numbers-padding-x').addEventListener('keyup', (e) => {
        updatePaddingX(e.target.value);
    });

    // padding y
    document.getElementById('container-numbers-padding-y').addEventListener('change', (e) => {
        updatePaddingY(e.target.value);
    });
    document.getElementById('container-numbers-padding-y').addEventListener('keyup', (e) => {
        updatePaddingY(e.target.value);
    });

    // radius
    document.getElementById('container-numbers-radius').addEventListener('change', (e) => {
        updateRadius(e.target.value);
    });
    document.getElementById('container-numbers-radius').addEventListener('keyup', (e) => {
        updateRadius(e.target.value);
    });


    // image width
    document.getElementById('tasker-image-preview-width').addEventListener('change', (e) => {
        updateImageWidth(e.target.value);
    });
    document.getElementById('tasker-image-preview-width').addEventListener('keyup', (e) => {
        updateImageWidth(e.target.value);
    });

    // image height
    document.getElementById('tasker-image-preview-height').addEventListener('change', (e) => {
        updateImageHeight(e.target.value);
    });
    document.getElementById('tasker-image-preview-height').addEventListener('keyup', (e) => {
        updateImageHeight(e.target.value);
    });
    
}

function updateMarginX(value) {
    // if just a number or empty, add px
    if(!value || !isNaN(value)) {
        value = value + 'px';
    }
    updateStyle('margin-left: ' + value);
    updateStyle('margin-right: ' + value);
}

function updateMarginY(value) {
    // if just a number or empty, add px
    if(!value || !isNaN(value)) {
        value = value + 'px';
    }
    updateStyle('margin-top: ' + value);
    updateStyle('margin-bottom: ' + value);
}

function updatePaddingX(value) {
    // if just a number or empty, add px
    if(!value || !isNaN(value)) {
        value = value + 'px';
    }
    updateStyle('padding-left: ' + value);
    updateStyle('padding-right: ' + value);
}

function updatePaddingY(value) {
    // if just a number or empty, add px
    if(!value || !isNaN(value)) {
        value = value + 'px';
    }
    updateStyle('padding-top: ' + value);
    updateStyle('padding-bottom: ' + value);
}

function updateRadius(value) {
    // if just a number or empty, add px
    if(!value || !isNaN(value)) {
        value = value + 'px';
    }
    updateStyle('border-radius: ' + value);
}

function updateImageWidth(value) {
    // if just a number or empty, add px
    if(!value || !isNaN(value)) {
        value = value + 'px';
    }
    // get the image element
    let img = document.getElementById(element_id).querySelector('#tasker-image-preview-replace');
    if(img) {
        img.style.width = value;
    }
}

function updateImageHeight(value) {
    // if just a number or empty, add px
    if(!value || !isNaN(value)) {
        value = value + 'px';
    }
    // get the image element
    let img = document.getElementById(element_id).querySelector('#tasker-image-preview-replace');
    if(img) {
        img.style.height = value;
    }
}






function updateImage(type) {
    // console.log('FUNCTION updateImage', type);

    let image_url = document.getElementById('tasker-image-preview').src;


    // remove only the direct child of the element that is called tasker-image-preview-replace it ONLY if it exists as a child of the element
    if(document.getElementById(element_id).querySelector('#tasker-image-preview-replace')) {
        document.getElementById(element_id).querySelector('#tasker-image-preview-replace').remove();
    }


    if(type === 'background') {

        document.getElementById(element_id).innerHTML = initial_html_image;

        // #container-image-preview-background should be bold and white and #container-image-preview-replace should be grayed out and normal
        document.getElementById('container-image-preview-background').style.fontWeight = 'bold';
        document.getElementById('container-image-preview-background').style.color = 'white';
        document.getElementById('container-image-preview-replace').style.fontWeight = 'normal';
        document.getElementById('container-image-preview-replace').style.color = 'gray';

        // hide #tasker-image-preview-width and #tasker-image-preview-height
        document.getElementById('tasker-image-preview-width').style.display = 'none';
        document.getElementById('tasker-image-preview-height').style.display = 'none';

        // get image url from input
        updateStyle('background-image: url(' + image_url + '); background-size: cover; background-position: center;');
        

        // for similar elements
        for(let i = 0; i < similar_elements.length; i++) {
            // remove only the direct child of the element that is called tasker-image-preview-replace it ONLY if it exists as a child of the element
            if(similar_elements[i].querySelector('#tasker-image-preview-replace')) {
                similar_elements[i].querySelector('#tasker-image-preview-replace').remove();
            }
            similar_elements[i].style.backgroundImage = 'url(' + image_url + ')';
            similar_elements[i].style.backgroundSize = 'cover';
            similar_elements[i].style.backgroundPosition = 'center';
        }

    } else if(type === 'replace') {
        // #container-image-preview-background should be bold and white and #container-image-preview-replace should be grayed out and normal
        document.getElementById('container-image-preview-background').style.fontWeight = 'normal';
        document.getElementById('container-image-preview-background').style.color = 'gray';
        document.getElementById('container-image-preview-replace').style.fontWeight = 'bold';
        document.getElementById('container-image-preview-replace').style.color = 'white';

        // show #tasker-image-preview-width and #tasker-image-preview-height
        document.getElementById('tasker-image-preview-width').style.display = 'block';
        document.getElementById('tasker-image-preview-height').style.display = 'block';


        document.getElementById(element_id).innerHTML = '';

        // remove bg
        document.getElementById(element_id).style.backgroundImage = 'none';
        // for similar elements
        for(let i = 0; i < similar_elements.length; i++) {
            similar_elements[i].style.backgroundImage = 'none';
        }

        updateStyle('background-image: none;');
        // add an image element to the element
        let img = document.createElement('img');
        img.id = 'tasker-image-preview-replace';
        img.src = image_url;
        document.getElementById(element_id).appendChild(img);

        // i want the image to not change the size of the parent, and not change the aspect ratio. just fill up whatever space is available
        img.style.objectFit = 'contain';
        img.style.width = '100%';
        img.style.height = '100%';
        

        // update width input to 100% tasker-image-preview-width
        document.getElementById('tasker-image-preview-width').value = '100%';
        // update height input to 100% tasker-image-preview-height
        document.getElementById('tasker-image-preview-height').value = '100%';

    }
}





function triggerImageUpload() {
  // Create the input element if it doesn't already exist
  let input = document.getElementById('image-upload-input');

  // console.log('input', input);

  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.id = 'image-upload-input';
    input.classList.add('do-not-edit');
    input.style.display = 'none';

    input.addEventListener('change', function (event) {
        const file = event.target.files[0];

        // console.log('file', file);

        if (file) {
            uploadedImageFile = file;

            const reader = new FileReader();
            reader.onload = function (e) {
                document.querySelector('.container-image-preview').style.display = 'block';
                const imgEl = document.getElementById('tasker-image-preview');
                if (imgEl) {
                    imgEl.src = e.target.result;

                    initial_html_image = document.getElementById(element_id).innerHTML;
                    
                    // if element_id is an element with an src, then change the src. otherwise just change the bg
                    // if(document.getElementById(element_id).src) {
                    //     document.getElementById(element_id).src = e.target.result;
                    //     updateStyle('src: ' + e.target.result + ';');
                    // } else {
                        // updateStyle('background-image: url(' + e.target.result + ') !important; background-size: cover; background-position: center;');
                        updateImage('background');
                    // }

                } else {
                    console.warn('Element with ID "image-preview" not found.');
                }

                
            };
            reader.readAsDataURL(file);
        }

        // remove the input
        document.getElementById('image-upload-input').remove();

    });

    document.body.appendChild(input);
  }

  input.click();
}




function updateAIText(text) {
    // console.log('FUNCTION updateAIText', text);

    let ai_prompt = document.getElementById('tasker-ai-input').value;
    if(!ai_prompt || ai_prompt === '') {
        return;
    }

    document.querySelector('.container-approve-inner-approve').style.opacity = '1';
}

function updateText(text) {
    // console.log('FUNCTION updateText', text);

    document.getElementById(element_id).innerHTML = text;
    pushChange("text: " + text);
}

function updateTextAlighButtons(align) {
    // console.log('FUNCTION updateTextAlighButtons', align);

    document.getElementById('element-align-center').classList.remove('container-style-inner-button-active');
    document.getElementById('element-align-left').classList.remove('container-style-inner-button-active');
    document.getElementById('element-align-right').classList.remove('container-style-inner-button-active');

    if(align === 'center') {
        document.getElementById('element-align-center').classList.add('container-style-inner-button-active');
    } else if(align === 'left') {
        document.getElementById('element-align-left').classList.add('container-style-inner-button-active');
    } else if(align === 'right') {
        document.getElementById('element-align-right').classList.add('container-style-inner-button-active');
    }
}


function updateStyle(style) {
    // console.log('FUNCTION updateStyle', style);
    
    // document.getElementById(element_id).style = style;
    // add the style without removing the existing styles
    document.getElementById(element_id).style.cssText += style;

    // update style of similar elements
    for(let i = 0; i < similar_elements.length; i++) {
        similar_elements[i].style.cssText += style;
    }
    
    pushChange(style);
}


function pushChange(change) {
    // console.log('FUNCTION pushChange', change);
    
    // the change is in this format: text-align: center;
    // check if the first part before : is available in changes array, if so replace it with the new change
    let change_type = change.split(':')[0];
    let change_value = change.split(':')[1];

    let found = false;
    for(let i = 0; i < changes.length; i++) {
        if(changes[i].split(':')[0] === change_type) {
            changes[i] = change;
            found = true;
            return;
        }
    }

    if(!found) {
        changes.push(change);
    }

    if(changes.length > 0) {
        document.querySelector('.container-approve-inner-approve').style.opacity = '1';
    } else {
        document.querySelector('.container-approve-inner-approve').style.opacity = '0.5';
    }
}

function positionTaskerContainer(id) {
    const anchorEl  = document.getElementById(id);
    const container = document.querySelector('.tasker_container');
    if (!anchorEl || !container) return;
  
    const spacing = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
  
    // Reset any previous constraints before measuring
    Object.assign(container.style, {
      maxWidth: '', maxHeight: '', overflow: '', position: 'absolute'
    });
  
    const a = anchorEl.getBoundingClientRect();
    let   c = container.getBoundingClientRect();
  
    // 1) Constrain size so it can always fit
    const maxW = vw - spacing * 2;
    const maxH = vh - spacing * 2;
    if (c.width  > maxW)  container.style.maxWidth  = `${maxW}px`;
    if (c.height > maxH) { 
      container.style.maxHeight = `${maxH}px`;
      container.style.overflow  = 'auto';
    }
    c = container.getBoundingClientRect(); // re-measure
  
    // Helper to clamp
    const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
  
    // 2) Choose a preferred spot (below/above), otherwise fallback
    const spaceBelow = vh - a.bottom - spacing;
    const spaceAbove = a.top - spacing;
    let top;
  
    if (spaceBelow >= c.height || spaceBelow >= spaceAbove) {
      // Prefer below
      top = a.bottom + spacing;
    } else {
      // Prefer above
      top = a.top - c.height - spacing;
    }
  
    // Horizontal center by default
    let left = a.left + (a.width - c.width) / 2;
  
    // 3) If the anchor is bigger than the viewport, just center the container
    const anchorTooBig = (a.width >= vw || a.height >= vh);
    if (anchorTooBig) {
      top  = (vh - c.height) / 2;
      left = (vw - c.width)  / 2;
    }
  
    // 4) Final clamps to keep it 100% on screen
    top  = clamp(top,  spacing, vh - c.height - spacing);
    left = clamp(left, spacing, vw - c.width  - spacing);
  
    // Apply with scroll offsets
    container.style.left = `${left + window.scrollX}px`;
    container.style.top  = `${top  + window.scrollY}px`;
}
  









function injectHtml() {

    // console.log('FUNCTION injectHtml');



    let css = `
    
    <style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }




    body {

    }
    .tasker_container {
        display: flex;
        padding: 16px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 8px;
        border: 1px solid var(--Stroke, #404049);
        background: var(--Tertiary-Background, #121216);
        position: absolute;
        left: 10px;
        top: 10px;
        font-family: var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");
        z-index: 1000000;
    }
    .container-inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
    }
    .container-inner-top {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--Secondary-Font, #A1A1AA);
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
    }
    .container-inner-bottom {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    }
    .container-inner-bottom-input {
        position: relative; 
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }
    .container-inner-bottom-input input {
        border-radius: 4px;
        border: 1px solid var(--gradientStroke, #1F80FF);
        background: var(--Secondary-Background, #18181B);
        width: 100%;
        height: 32px;
        padding-left: 8px;
        color: white;
        padding-right: 32px;
    }
    .container-inner-bottom-input-submit {
        position: absolute;
        right: 0px;
        bottom: 5px;
        padding: 4px 12px;
        cursor: pointer;
    }
    .container-inner-bottom-input-submit:hover {
        opacity: 0.8;
    }

    .container-inner-bottom-button {
        padding: 5px;
        border-radius: 4px;
        background: var(--Secondary-Background, #1e1e23);
        text-align: center;
        width: 28px;
        cursor: pointer;
    }
    .container-inner-bottom-button:hover {
        opacity: 0.8;
    }

    .container-inner-bottom-buttons {
        display: flex;
        align-items: center;
        gap: 8px;
    }




    .container-inner-ai {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        width: 100%;
    }



    .container-options {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        width: 100%;
    }



    .container-style {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    .container-style-inner {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .container-style-inner-button {
        cursor: pointer;
        padding: 4px 4px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container-style-inner-button:hover {
        opacity: 0.8;
    }
    .container-style-inner-button-fontsize input {
        border-radius: 2px;
        border: 0.5px solid var(--Stroke, #404049);

        border-radius: 2px;
        border: 0.5px solid var(--Stroke, #404049);
        background: none;
        text-align: center;
        width: 30px;
        height: 24px;
        padding: 0px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
        color: white;
    }
    .container-style-inner-button-active {
        background: var(--Secondary-Background, #2b2b33);
    }





    .container-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    .container-text-inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        width: 100%;
    }

    .container-text-inner-item {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 8px;
    }
    .container-text-inner-item-submit {
        position: absolute;
        right: 0px;
        top: 5px;
        padding: 4px 12px;
        cursor: pointer;
    }

    .container-text-inner-item input {
        border-radius: 4px;
        border: 1px solid var(--gradientStroke, #2a2b2d);
        background: var(--Secondary-Background, #18181B);
        width: 100%;
        height: 32px;
        padding-left: 8px;
        color: white;
        padding-right: 32px;
    }

    .container-text-inner-item-title {
        font-size: 14px;
        color: #A1A1AA;
    }

    .text-container {

    }


    .container-approve {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
        opacity: 1;
    }
    .container-approve-inner {
        display: flex;
        flex-direction: row;
        gap: 4px;
        font-size: 14px;
    }
    .container-approve-inner-approve {
        background: #10B981;
        padding: 8px 8px;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        opacity: 0.5;
    }
    .container-approve-inner-approve:hover {
        background: #009966;
    }
    .container-approve-inner-discard {
        background: #343635;
        padding: 8px 8px;
        border-radius: 8px;
        color: white;
        cursor: pointer;
    }
    .container-approve-inner-discard:hover {
        background: #121216;
    }
    
    
    .element-color {
        width: 20px;
        height: 20px;
        background: none;
        border: none;
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding: 0;
        margin: 0;
        border: 1px solid var(--gradientStroke, #2a2b2d);
        box-sizing: border-box;
    }

    .clr-field button {
        width: 20px;
        height: 20px;
        /* border-radius: 2px; */
        border: 1px solid #555454;
    }


    .element-color-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
    }

    .element-bg {
        width: 20px;
        height: 20px;
        background: none;
        border: none;
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding: 0;
        margin: 0;
        border: 1px solid var(--gradientStroke, #2a2b2d);
        box-sizing: border-box;
    }

    .element-bg-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
    }

    .element-bg-image {
        cursor: pointer;
    }

    .element-bg-image:hover {
        opacity: 0.8;
    }

    .element-delete {
        cursor: pointer;
    }

    .element-delete:hover {
        opacity: 0.8;
    }

    .tasker_close {
        position: absolute;
        top: 4px;
        right: 4px;
        cursor: pointer;
        padding: 8px;
    }

    .tasker_close:hover {
        opacity: 0.8;
    }


    #tasker-image-preview {
        width: 461px;
        border: 1px dashed gray;
        padding: 8px;
        border-radius: 8px;
        box-sizing: border-box;
        margin-top: 16px;
    }

    .container-image-preview-buttons {
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: row;
        gap: 8px;
        margin-bottom: 8px;
    }
    .container-image-preview-buttons button {
        background: #343635;
        padding: 8px 8px;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        border: none;
        width: 100%;
    }

    .container-image-preview-buttons button:hover {
        opacity: 0.8;
    }

    .container-numbers {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
    .container-numbers-inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 13px;
    }
    .container-numbers-inner-item {
        display: flex;
        flex-direction: row;
        gap: 2px;
        align-items: center;
        justify-content: center;
    }
    .container-numbers-inner-item-title {
        font-size: 12px;
        color: #A1A1AA;
        margin-right: 8px;
    }
    .container-numbers-inner-item input {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        border: 1px solid var(--gradientStroke, #2a2b2d);
        background: var(--Secondary-Background, #18181B);
        color: white;

    }

    .container-image-preview-buttons input {
        width: 42px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        border: 1px solid var(--gradientStroke, #2a2b2d);
        background: var(--Secondary-Background, #18181B);
        color: white;
        padding: 2px;
    }
    
    .container-approve-inner-divider {
        width: 1px;
        height: 32px;
        background: #2a2b2d;
        margin: 0px 8px;
    }

    #container-image-preview-background {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    }

    #container-image-preview-replace {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        margin-left:-6px;
    }


    #tasker-ai-input {
        width: 100%;
        background: #18181b;
        border-radius: 4px;
        border: 1px solid var(--gradientStroke, #1F80FF);
        padding: 8px;
        color: white;
    }

    </style>
    `;
    // inject css at the end of the head
    document.head.insertAdjacentHTML('beforeend', css);






    // inject html '<span class="element-style-container"></span>' at the end of the body

    let html = `


    <div class="tasker_container">
        <div class="tasker_close" onclick="discardChanges();">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3L3 9M3 3L9 9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>    
        </div>
        <div class="container-inner">

            <div class="container-inner-ai">
                <div class="container-inner-top">
                    <span>Ask AI to change anything</span>
                    <svg width="20" height="20" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.79476 5.21129C5.25487 6.23682 6.07566 7.05761 7.10118 7.51772C6.07566 7.97783 5.25487 8.79862 4.79476 9.82414C4.33464 8.79862 3.51386 7.97783 2.48833 7.51772C3.51386 7.05761 4.33464 6.23682 4.79476 5.21129ZM4.79476 3.047C4.81682 3.64003 4.71627 4.23124 4.49941 4.78363C4.28254 5.33603 3.95402 5.83773 3.53439 6.25736C3.11477 6.67698 2.61306 7.0055 2.06067 7.22237C1.50827 7.43924 0.917067 7.53978 0.324036 7.51772C0.917067 7.49566 1.50827 7.5962 2.06067 7.81307C2.61306 8.02993 3.11477 8.35846 3.53439 8.77808C3.95402 9.19771 4.28254 9.69941 4.49941 10.2518C4.71627 10.8042 4.81682 11.3954 4.79476 11.9884C4.77269 11.3954 4.87324 10.8042 5.0901 10.2518C5.30697 9.69941 5.63549 9.19771 6.05512 8.77808C6.47474 8.35845 6.97645 8.02993 7.52884 7.81307C8.08124 7.5962 8.67244 7.49565 9.26548 7.51772C8.67244 7.53978 8.08124 7.43924 7.52884 7.22237C6.97645 7.00551 6.47474 6.67698 6.05512 6.25736C5.63549 5.83773 5.30697 5.33603 5.0901 4.78363C4.87324 4.23123 4.77269 3.64003 4.79476 3.047Z" fill="url(#paint0_linear_7177_1865)"/>
                        <path d="M9.33516 2.59506C9.53193 2.89759 9.7899 3.15555 10.0924 3.35233C9.78989 3.5491 9.53193 3.80706 9.33516 4.10959C9.13839 3.80706 8.88042 3.5491 8.57789 3.35233C8.88042 3.15555 9.13839 2.89759 9.33516 2.59506ZM9.33516 1.01155C9.34671 1.32205 9.29407 1.63159 9.18052 1.92082C9.06698 2.21004 8.89497 2.47272 8.67526 2.69243C8.45555 2.91213 8.19287 3.08414 7.90365 3.19769C7.61443 3.31124 7.30488 3.36388 6.99438 3.35233C7.30488 3.34077 7.61443 3.39342 7.90365 3.50696C8.19287 3.62051 8.45555 3.79252 8.67526 4.01222C8.89497 4.23193 9.06698 4.49461 9.18052 4.78384C9.29407 5.07306 9.34671 5.3826 9.33516 5.6931C9.32361 5.3826 9.37625 5.07306 9.4898 4.78384C9.60334 4.49461 9.77535 4.23193 9.99506 4.01223C10.2148 3.79252 10.4774 3.62051 10.7667 3.50696C11.0559 3.39342 11.3654 3.34077 11.6759 3.35233C11.3654 3.36388 11.0559 3.31123 10.7667 3.19769C10.4774 3.08414 10.2148 2.91213 9.99506 2.69243C9.77535 2.47272 9.60334 2.21004 9.4898 1.92081C9.37625 1.63159 9.32361 1.32205 9.33516 1.01155Z" fill="url(#paint1_linear_7177_1865)"/>
                        <defs>
                        <linearGradient id="paint0_linear_7177_1865" x1="4.30298" y1="3.047" x2="8.90691" y2="7.96773" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#1F80FF"/>
                        <stop offset="1" stop-color="#1F80FF" stop-opacity="0.25"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_7177_1865" x1="9.07767" y1="1.01155" x2="11.4882" y2="3.58794" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#1F80FF"/>
                        <stop offset="1" stop-color="#1F80FF" stop-opacity="0.25"/>
                        </linearGradient>
                        </defs>
                    </svg>                    
                </div>
                <div class="container-inner-bottom">
                    <div class="container-inner-bottom-input">
                        <textarea id="tasker-ai-input" placeholder="Ask Tasker AI for a change within this element" rows="4"></textarea>
                        <div class="container-inner-bottom-input-submit" onclick="applyChanges();">
                            <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5.49999L6.71789 9.3036C6.27201 10.0468 5.47855 10.5 4.62346 10.5L0 10.5L2.99993 5.50001L0 0.5L4.62346 0.5C5.47855 0.5 6.27201 0.953247 6.71789 1.69639L9 5.49999Z" fill="white"/>
                            </svg>                            
                        </div>
                    </div>


                </div>

            </div>



            <div class="container-options">
                <div class="container-style">
                    <div class="container-style-inner">
                        <div id="element-align-left" class="container-style-inner-button">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.16669 4.5H13.8333M3.16669 8.5H9.83335M3.16669 12.5H12.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                        
                        </div>
                        <div id="element-align-center" class="container-style-inner-button">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.16669 4.5H13.8333M5.83335 8.5H11.1667M4.50002 12.5H12.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>    
                        </div>
                        <div id="element-align-right" class="container-style-inner-button">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.16669 4.5H13.8333M7.16669 8.5H13.8333M4.50002 12.5H13.8333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                        
                        </div>
                        <div id="element-font-size" class="container-style-inner-button container-style-inner-button-fontsize">
                            <input type="number" id="element-font-size-input" placeholder="16" />
                        </div>
                        <div id="element-font-bold" class="container-style-inner-button">
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.16669 8.50001C8.78553 8.50001 9.37902 8.25418 9.8166 7.81659C10.2542 7.37901 10.5 6.78552 10.5 6.16668C10.5 5.54784 10.2542 4.95435 9.8166 4.51676C9.37902 4.07918 8.78553 3.83334 8.16669 3.83334H4.16669V8.50001M8.16669 8.50001H4.16669M8.16669 8.50001H8.83335C9.45219 8.50001 10.0457 8.74584 10.4833 9.18343C10.9209 9.62101 11.1667 10.2145 11.1667 10.8333C11.1667 11.4522 10.9209 12.0457 10.4833 12.4833C10.0457 12.9208 9.45219 13.1667 8.83335 13.1667H4.16669V8.50001" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                        
                        </div>
                        <div id="element-font-italic" class="container-style-inner-button">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.83335 3.83334H11.8334M5.16669 13.1667H9.16669M9.83335 3.83334L7.16669 13.1667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                        
                        </div>
                        <!-- underline -->
                        <div id="element-underline" class="container-style-inner-button">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.50002 3.83334V7.16668C5.50002 8.05073 5.85121 8.89858 6.47633 9.5237C7.10145 10.1488 7.9493 10.5 8.83335 10.5C9.71741 10.5 10.5653 10.1488 11.1904 9.5237C11.8155 8.89858 12.1667 8.05073 12.1667 7.16668V3.83334M4.16669 13.1667H13.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                           
                        </div>
                        <div class="element-color-container">
                            <svg width="18" height="18" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.33335 10.5V5.83334C6.33335 5.30291 6.54407 4.7942 6.91914 4.41913C7.29421 4.04406 7.80292 3.83334 8.33335 3.83334C8.86379 3.83334 9.37249 4.04406 9.74757 4.41913C10.1226 4.7942 10.3334 5.30291 10.3334 5.83334V10.5M6.33335 7.83334H10.3334M3.66669 13.1667H13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>    
                            <input id="element-text-color" class="element-color" type="text" data-coloris>
                        </div>

                        <div class="element-bg-container">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.8787 2.82799C11.6447 3.59466 11.0241 5.45799 9.4914 6.99133C7.95873 8.52399 6.09473 9.14533 5.32807 8.37866M10.8787 2.82799C10.1121 2.06133 8.24873 2.68333 6.71607 4.21599C5.18273 5.74866 4.56206 7.61266 5.32807 8.37866M10.8787 2.82799C11.1197 3.0689 11.3289 3.33952 11.5014 3.63333C13.0527 6.21866 13.9514 7.75133 14.1994 8.22999C14.5714 8.94866 14.1494 9.73333 13.1914 10.6913C12.2334 11.6493 11.4487 12.0707 10.7301 11.6993L6.1334 9.00133C5.84006 8.82933 5.5694 8.61999 5.32807 8.37866M3.66673 11.1667L4.6434 12.2587C4.81768 12.446 4.93437 12.6796 4.97953 12.9314C5.0247 13.1833 4.99644 13.4428 4.89813 13.6791C4.79981 13.9153 4.6356 14.1183 4.42508 14.2637C4.21456 14.4092 3.96664 14.491 3.71089 14.4994C3.45515 14.5078 3.20239 14.4424 2.98279 14.3111C2.76318 14.1798 2.586 13.988 2.4724 13.7587C2.3588 13.5294 2.31358 13.2723 2.34213 13.018C2.37067 12.7637 2.47179 12.523 2.6334 12.3247L3.66673 11.1667Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input id="element-text-bg" class="element-bg" type="text" data-coloris>
                        </div>
                        
                        <div class="element-bg-image" onclick="triggerImageUpload();">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.3333 5.83333H10.3399M2.33325 11.1667L5.66659 7.83333C6.28525 7.238 7.04792 7.238 7.66659 7.83333L10.9999 11.1667M9.66659 9.83333L10.3333 9.16666C10.9519 8.57133 11.7146 8.57133 12.3333 9.16666L14.3333 11.1667M2.33325 4.5C2.33325 3.96957 2.54397 3.46086 2.91904 3.08579C3.29411 2.71071 3.80282 2.5 4.33325 2.5H12.3333C12.8637 2.5 13.3724 2.71071 13.7475 3.08579C14.1225 3.46086 14.3333 3.96957 14.3333 4.5V12.5C14.3333 13.0304 14.1225 13.5391 13.7475 13.9142C13.3724 14.2893 12.8637 14.5 12.3333 14.5H4.33325C3.80282 14.5 3.29411 14.2893 2.91904 13.9142C2.54397 13.5391 2.33325 13.0304 2.33325 12.5V4.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>

                        <div class="element-delete" onclick="deleteElement();">
                            <svg width="17" height="17" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.16669 5.54167H15.8334M7.91669 8.70833V13.4583M11.0834 8.70833V13.4583M3.95835 5.54167L4.75002 15.0417C4.75002 15.4616 4.91684 15.8643 5.21377 16.1613C5.5107 16.4582 5.91343 16.625 6.33335 16.625H12.6667C13.0866 16.625 13.4893 16.4582 13.7863 16.1613C14.0832 15.8643 14.25 15.4616 14.25 15.0417L15.0417 5.54167M7.12502 5.54167V3.16667C7.12502 2.9567 7.20843 2.75534 7.35689 2.60687C7.50536 2.45841 7.70672 2.375 7.91669 2.375H11.0834C11.2933 2.375 11.4947 2.45841 11.6431 2.60687C11.7916 2.75534 11.875 2.9567 11.875 3.16667V5.54167" stroke="#F43F5E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                            
                        </div>

                    </div>
                </div>

                <div class="container-text">
                    <div class="container-text-inner">
                        <div class="container-text-inner-item">
                            <span class="container-text-inner-item-title">Text</span>
                            <input id="container-text-inner-item-input" type="text" placeholder="Update the text" />
                        </div>
                    </div>
                </div>

                <div class="container-numbers">
                    <div class="container-numbers-inner">
                        <div class="container-numbers-inner-item">
                            <span class="container-numbers-inner-item-title">Margin</span>
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 13L17.5 10.5M17.5 10.5L15 8M17.5 10.5H12.5M5 8L2.5 10.5M2.5 10.5L5 13M2.5 10.5H7.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input id="container-numbers-margin-x" type="text" placeholder="0" />
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15.5L10 18M10 18L12.5 15.5M10 18V13M12.5 5.5L10 3M10 3L7.5 5.5M10 3V8" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input id="container-numbers-margin-y" type="text" placeholder="0" />
                        </div>
                        <div class="container-numbers-inner-item">
                            <span class="container-numbers-inner-item-title">Padding</span>
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 13L17.5 10.5M17.5 10.5L15 8M17.5 10.5H12.5M5 8L2.5 10.5M2.5 10.5L5 13M2.5 10.5H7.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input id="container-numbers-padding-x" type="text" placeholder="0" />
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15.5L10 18M10 18L12.5 15.5M10 18V13M12.5 5.5L10 3M10 3L7.5 5.5M10 3V8" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input id="container-numbers-padding-y" type="text" placeholder="0" />
                        </div>
                        <div class="container-numbers-inner-item">
                            <span class="container-numbers-inner-item-title">Radius</span>
                            <input id="container-numbers-radius" type="text" placeholder="0" />
                        </div>
                    </div>
                </div>


                <div class="container-image-preview" style="display: none;">
                    <img id="tasker-image-preview" src="" alt="Image Preview" />
                    <div class="container-image-preview-buttons">
                        <button style="font-weight: bold" id="container-image-preview-background" onclick="updateImage('background');" class="container-image-preview-remove">
                            Background
                        </button>
                        <button style="color: gray;" id="container-image-preview-replace" onclick="updateImage('replace')" class="container-image-preview-remove">
                            Insert image
                        </button>
                        <input type="text" id="tasker-image-preview-width" placeholder="Width" style="display: none;" />
                        <input type="text" id="tasker-image-preview-height" placeholder="Height" style="display: none;" />
                    </div>
                </div>
            </div>


            <div class="container-approve">
                <div class="container-approve-inner">
                    <div onclick="selectSimilarElements();" class="container-approve-inner-discard" style="display:none;">
                        <span>Select similar elements</span>
                    </div>
                    <div class="container-approve-inner-divider"></div>
                    <div onclick="discardChanges();" class="container-approve-inner-discard">
                        <span>Discard</span>
                    </div>
                    <div onclick="applyChanges();" class="container-approve-inner-approve">
                        <span>Apply</span>
                    </div>
                </div>
            </div>
        </div>

    </div>




    `;

    // Use insertAdjacentHTML instead of innerHTML += to avoid losing event listeners
    document.body.insertAdjacentHTML('beforeend', html);



}























// editElement('test');








function discardChanges() {

    // console.log('FUNCTION discardChanges');

    changes = [];
    if(document.getElementById(element_id)) {
        document.getElementById(element_id).style.cssText = initial_style;
        document.getElementById(element_id).innerHTML = initial_html;
        
        // delete tasker_container
        document.querySelector('.tasker_container').remove();

        // remove class selected-highlight from the element
        // document.getElementById(element_id).classList.remove('selected-highlight');
        element_id = null;

        // clear similar_elements
        if(similar_elements.length > 0) {
            for(let i = 0; i < similar_elements.length; i++) {
                similar_elements[i].classList.remove('selected-highlight');
                similar_elements[i].style.cssText = initial_style;
            }
            similar_elements = [];
        }
    }
}



function loadingChanges() {
    // console.log('FUNCTION loadingChanges');

    // apply shimmer effect to the background of element_id

    document.getElementById(element_id).classList.add('shimmer-wrapper');
    document.getElementById(element_id).classList.add('shimmer-effect');

    // add class animating-highlight to the element
    document.getElementById(element_id).classList.add('animating-highlight');

    // add class shimmer-wrapper to similar_elements
    // update style of similar elements
    for(let i = 0; i < similar_elements.length; i++) {
        similar_elements[i].classList.add('shimmer-wrapper');
        similar_elements[i].classList.add('shimmer-effect');
        similar_elements[i].classList.add('animating-highlight');
    }
    
    
}


function selectSimilarElements() {
    // console.log('FUNCTION selectSimilarElements');

    // get class of element_id (without selected-highlight)
    let class_name = document.getElementById(element_id).className.replace('selected-highlight', '');
    // console.log('class_name', class_name);

    // get all elements with the same class
    let elements = document.getElementsByClassName(class_name);
    // console.log('elements', elements);

    // add class selected-highlight to all elements
    for(let i = 0; i < elements.length; i++) {
        elements[i].classList.add('selected-highlight');
        similar_elements.push(elements[i]);

        // update style of element
        // get style of element_id and apply it to the element
        let style = document.getElementById(element_id).style.cssText;
        elements[i].style.cssText = style;
    }

}








function applyChanges() {

    // console.log('FUNCTION applyChanges');

    loadingChanges();


    
    let old_element_id = element_id;

    if(document.getElementById(element_id)) {

        let ai_prompt = document.getElementById('tasker-ai-input').value;
        
        // delete tasker_container
        document.querySelector('.tasker_container').remove();

        // // remove class selected-highlight from the element
        // document.getElementById(element_id).classList.remove('selected-highlight');

        // // remove class selected-highlight from similar_elements
        for(let i = 0; i < similar_elements.length; i++) {
            similar_elements[i].classList.remove('selected-highlight');
        }


        

        let _similar_elements = similar_elements;
        let _element_id = element_id;

        similar_elements = [];
        element_id = null;

        // check if there is any image doms within the children of the element
        if(document.getElementById(_element_id).querySelector('#tasker-image-preview-replace')) {

            let width = document.getElementById(_element_id).value;
            let height = document.getElementById(_element_id).value;


            if(!isNaN(width)) {
                width = width + 'px';
            }

            if(!isNaN(height)) {
                height = height + 'px';
            }
        }

        const el = document.getElementById(_element_id);

        // console.log('element html', el.outerHTML);

        const styleChangesStr = changes.length ? changes.join(', ') : undefined;
        const editRequestStr = (ai_prompt && ai_prompt.trim() !== '') ? ai_prompt : (styleChangesStr || '');

        const requestBody = {
            taskUUID: window.TASK_UUID || '',
            elementHtml: el.outerHTML,
            styleChanges: styleChangesStr,
            editRequest: editRequestStr,
            pageUrl: window.location.href,
            pagePath: window.location.pathname,
            elementId: _element_id
        };

        if (document.getElementById(_element_id).querySelector('#tasker-image-preview-replace')) {
            try {
                const replaceImg = document.getElementById(_element_id).querySelector('#tasker-image-preview-replace');
                const widthVal = (document.getElementById('tasker-image-preview-width') && document.getElementById('tasker-image-preview-width').value) || '100%';
                const heightVal = (document.getElementById('tasker-image-preview-height') && document.getElementById('tasker-image-preview-height').value) || '100%';
                requestBody.image = {
                    value: replaceImg ? replaceImg.src : '',
                    width: String(widthVal),
                    height: String(heightVal)
                };
            } catch (e) {
                // console.warn('applyChanges: failed to attach image payload', e);
            }
        }

        // console.log('editData', requestBody);

        const baseUrl = window.EDIT_BASE_URL || 'http://localhost:8080';

        fetch(baseUrl + '/websites/edit-element', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (window.EDIT_TOKEN || '')
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(function(text) { throw buildHttpError(response.status, text); });
            }
            return response.json();
        })
        .then((data) => {
            try {
                if (data && data.historyUUID) {
                    const targetWindow = (window.parent && window.parent !== window) ? window.parent : window;
                    targetWindow.postMessage({ historyUUID: data.historyUUID }, '*');
                }
            } catch (e) {
                // console.warn('postMessage(historyUUID) failed', e);
            }
            // Keep highlighting active and poll for job status until completion/failure
            if (data && data.jobUUID) {
                pollJobStatus(data.jobUUID, _element_id, _similar_elements, baseUrl, (window.EDIT_TOKEN || ''));
            } else {
                // If no jobUUID is returned, complete immediately
                changesComplete(_element_id, _similar_elements);
            }
        })
        .catch(err => {
            console.error('Edit request failed:', err);
            maybePostDailyLimitExceeded(err);
            changesComplete(_element_id, _similar_elements);
        });

        changes = [];

    }

}   


function deleteElement() {
    // Remove currently selected element and clean up overlays/state
    // console.log('FUNCTION deleteElement');

    if (!element_id) return;

    // Remove the primary element from the DOM
    const el = document.getElementById(element_id);
    const elementHtmlSnapshot = el ? el.outerHTML : '';
    const capturedElementId = element_id;
    if (el) {
        el.remove();
    }

    (function sendDelete() {
        try {
            const _elementId = capturedElementId;
            const TASK_UUID = window.TASK_UUID || '';
            const EDIT_TOKEN = window.EDIT_TOKEN || '';
            const EDIT_BASE_URL = window.EDIT_BASE_URL || 'http://localhost:8080';

            if (!TASK_UUID || !_elementId || !EDIT_TOKEN) {
                console.warn('deleteElement: missing credentials or element id, skipping backend delete');
                return;
            }

            const editData = {
                taskUUID: TASK_UUID,
                elementHtml: elementHtmlSnapshot,
                pageUrl: window.location.href,
                pagePath: window.location.pathname,
                elementId: _elementId,
                deleteElement: true
            };

            fetch(EDIT_BASE_URL + '/websites/edit-element', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + EDIT_TOKEN
                },
                body: JSON.stringify(editData)
            })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(function(t) { throw buildHttpError(res.status, t); });
                }
                return res.json();
            })
            .then((data) => {
                try {
                    if (data && data.historyUUID) {
                        const targetWindow = (window.parent && window.parent !== window) ? window.parent : window;
                        targetWindow.postMessage({ historyUUID: data.historyUUID }, '*');
                    }
                } catch (e) {
                    // console.warn('postMessage(historyUUID) failed', e);
                }
                // console.log('deleteElement: backend deletion recorded');
            })
            .catch(err => {
                // console.error('deleteElement: backend deletion failed', err);
                maybePostDailyLimitExceeded(err);
            });
        } catch (err) {
            // console.error('deleteElement: unexpected error', err);
        }
    })();

    // Remove highlight classes from similar elements (if any were selected)
    for (let i = 0; i < similar_elements.length; i++) {
        if (similar_elements[i]) {
            similar_elements[i].classList.remove('selected-highlight');
        }
    }
    similar_elements = [];

    // Remove the tasker overlay, if it exists
    const tasker = document.querySelector('.tasker_container');
    if (tasker) tasker.remove();

    // Reset global state
    element_id = null;
    changes = [];
}

function changesComplete(_element_id, _similar_elements) {
    // console.log('FUNCTION changesComplete');

    // remove shimmer effect from the element
    document.getElementById(_element_id).classList.remove('shimmer-wrapper');
    document.getElementById(_element_id).classList.remove('shimmer-effect');

    // update style of similar elements
    for(let i = 0; i < _similar_elements.length; i++) {
        _similar_elements[i].classList.remove('shimmer-wrapper');
        _similar_elements[i].classList.remove('shimmer-effect');
    }

    // remove class selected-highlight from the element
    document.getElementById(_element_id).classList.remove('animating-highlight');

    // remove class selected-highlight from similar_elements
    for(let i = 0; i < _similar_elements.length; i++) {
        _similar_elements[i].classList.remove('animating-highlight');
    }

}

// Poll job status until completed or failed; keep highlights while polling
function pollJobStatus(jobUUID, _element_id, _similar_elements, baseUrl, authToken) {
    const intervalMs = 5000;
    const url = baseUrl + '/websites/job-status?jobUUID=' + encodeURIComponent(jobUUID);
    const headers = { 'Authorization': 'Bearer ' + (authToken || '') };

    function poll() {
        fetch(url, { method: 'GET', headers })
            .then(function(res) {
                if (!res.ok) {
                    return res.text().then(function(t) { throw new Error('HTTP ' + res.status + ': ' + t); });
                }
                return res.json();
            })
            .then(function(data) {
                var status = data && data.status;
                if (status === 'completed' || status === 'failed') {
                    changesComplete(_element_id, _similar_elements);
                } else {
                    setTimeout(poll, intervalMs);
                }
            })
            .catch(function() {
                // On transient errors, continue polling
                setTimeout(poll, intervalMs);
            });
    }

    poll();
}

// Build a structured error object for failed fetch responses
function buildHttpError(statusCode, responseText) {
    var error = new Error('HTTP ' + statusCode);
    error.httpStatus = statusCode;
    try {
        error.httpBody = responseText ? JSON.parse(responseText) : null;
        console.log('buildHttpError: error.httpBody', error.httpBody);
    } catch (_e) {
        error.httpBody = responseText || null;
        console.log('buildHttpError: error.httpBody', error.httpBody);
    }
    return error;
}

// If the error indicates the daily edit limit was exceeded, post a message upward
function maybePostDailyLimitExceeded(err) {
    try {
        var status = err && (err.httpStatus || err.status || null);
        var body = err && (err.httpBody || null);
        var messageStr = '';
        var codeStr = '';

        if (body && typeof body === 'object') {
            messageStr = typeof body.message === 'string' ? body.message : '';
            codeStr = typeof body.code === 'string' ? body.code : '';
        } else if (typeof body === 'string') {
            messageStr = body;
        } else if (err && typeof err.message === 'string') {
            messageStr = err.message;
        }

        var isDailyLimit = (messageStr && messageStr.toLowerCase().indexOf('daily limit exceeded') !== -1);
        if (!isDailyLimit) return;

        var targetWindow = (window.parent && window.parent !== window) ? window.parent : window;
        targetWindow.postMessage({
            type: 'editError',
            error: 'DAILY_LIMIT_EXCEEDED',
            message: messageStr || 'Website edit daily limit exceeded.',
            code: codeStr || 'BAD_REQUEST',
            status: status || 400
        }, '*');
        console.log('maybePostDailyLimitExceeded: message posted');
    } catch (_e) {
        console.log('maybePostDailyLimitExceeded: error', _e);
        // swallow
    }
}