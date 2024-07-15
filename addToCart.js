window.addEventListener("load", handleDummyCarousel());

function newRecommendedItems() {
    return [
        {
            "url": "https://www.myer.com.au/p/converse-chuck-taylor-all-star-hi-sneaker-826545340-1",
            "name": "Pajama",
            "price": "$130.00",
            "image": "https://myer-media.com.au/wcsstore/MyerCatalogAssetStore/images/40/205/3815/7/8/114311350/114311350_1_720x928.jpg",
            "sku": "12345678",
            "brand": "Brand Name"
        },
        {
            "url": "https://www.myer.com.au/p/vans-filmore-hi-suede-canvas-sneaker-in-black-white-987288580--1",
            "name": "Ultimatum Zip Through Jacket in Black",
            "price": "$130.00",
            "image": "https://myer-media.com.au/wcsstore/MyerCatalogAssetStore/images/40/205/3815/7/8/987288580/987288580_1_1_720x928.jpg",
            "sku": "155478160",
            "brand": "Nena & Pasadena"
        },
        {
            "url": "https://www.myer.com.au/p/vans-filmore-hi-suede-canvas-sneaker-in-black-white-987288580--1",
            "name": "Filmore Hi Suede Canvas Sneaker in Black/White",
            "price": "$110.00",
            "image": "https://myer-media.com.au/wcsstore/MyerCatalogAssetStore/images/40/205/3815/7/8/987288580/987288580_1_1_720x928.jpg",
            "sku": "116757640",
            "brand": "Vans"
        }
    ]
}

function customStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .custom-add-to-bag-btn{
            -webkit-font-smoothing: antialiased;
            --swiper-theme-color: #007aff;
            visibility: visible;
            margin-top: 2px;
            position: relative;
            overflow: hidden;
            padding: 0px;
            border-radius: 0px;
            cursor: pointer;
            box-sizing: border-box;
            text-decoration: none;
            display: inline-block;
            width: 100%;
            height: 30px;
            color: rgb(255, 255, 255);
            background: rgb(252, 87, 50);
            border: 1px solid rgb(252, 87, 50);
            font-family: "Poppins Bold" !important;
            font-size: 11px;
            letter-spacing: 0.3em;
            font-weight: normal;
            text-transform: uppercase;
            outline: none;
            box-shadow: rgba(31, 31, 31, 0.2) 0px 2px 8px;
        }
    `;
    return style;
}

function addToBagBtnClickHandler(event) {
    /*
    This function is responsible for extract product info and process for adding to cart
    */
    console.log('add to bag btn pressed', event.target);
    const nameEl=event.target.parentNode.querySelector('span.dy-recommendation__product-name');
    if(nameEl){
        alert(`Item needs to add to bag: ${nameEl.innerText}`);
    }
}

function generateDynamicHTML() {
    const productCardsHTML = newRecommendedItems().map((item, idx) => `
        <div class="dy-recommendation__product swiper-slide-active" data-dy-sku="${item.sku}" style="width: 217.5px; margin-right: 20px;">
            <a href="${item.url}" >
                <div class="dy-recommendation__product-image-container">
                    <img class="dy-recommendation__product-image" data-src="${item.image}" src="${item.image}">
                </div>
                <div class="dy-recommendation__product-details">
                    <div class="dy-recommendation__product-name-container">
                        <span class="dy-recommendation__product-brand">${item.brand}</span>
                        <span class="dy-recommendation__product-name">${item.name}</span>
                    </div>
                
                    <div class="dy-recommendation__product-price-container">
                        <span class="dy-recommendation__product-price dy-recommendation__product-sale-price">${item.price}</span>
                    </div>
                </div>
            </a>
        </div>
    `).join('');

    const sliderHTML = `
        <div class="dy-recommendations__slider dy-recommendations__slider-initialized dy-recommendations__slider-horizontal dy-recommendations__slider-free-mode">
            <div class="dy-recommendations__slider-wrapper" style="transform: translate3d(0px, 0px, 0px);">
                ${productCardsHTML}
            </div>
            <span class="dy-recommendations__slider-aria-notification" aria-live="assertive" aria-atomic="true"></span>
        </div>
    `;

    return sliderHTML;
}

function constructAddToCartBtn(parentNode) {
    const button = document.createElement("button");
    button.innerText = "Add To Bag";
    button.setAttribute("id", `add-to-cart-btn-${parentNode.getAttribute('data-dy-sku')}`);
    button.setAttribute("type", "button");
    button.classList.add('custom-add-to-bag-btn');

    // add click event handler
    button.addEventListener('click', function (event) { addToBagBtnClickHandler(event) });
    // Add hover effect using JavaScript
    button.addEventListener('mouseover', function () {
        button.style.backgroundColor = '#555';
    });
    button.addEventListener('mouseout', function () {
        button.style.backgroundColor = 'rgb(252, 87, 50)';
    });
    return button;
}


function buildNewRecommendationSection() {
    try {
        const recomContainer = document.getElementById("product-recommendations");

        // cloning first child , adding a class to it and appending to main container
        const clonedShadowRootFirstChild = recomContainer.shadowRoot.firstChild.cloneNode(true);
        clonedShadowRootFirstChild.classList.add('cloned');

        // pushing css
        clonedShadowRootFirstChild.appendChild(customStyles());
        recomContainer.shadowRoot.appendChild(clonedShadowRootFirstChild);

        // adding add to bag buttons to cards
        const parentCarousels = clonedShadowRootFirstChild.querySelectorAll("div div.dy-recommendations__content-container");
        parentCarousels.forEach((carousel, idx) => {
            const slider = carousel.querySelector('div.dy-recommendations__slider-container');
            slider.innerHTML = generateDynamicHTML();
            const carouselItems = carousel.querySelectorAll("div.dy-recommendation__product");
            carouselItems.forEach((item, idx) => {
                item.appendChild(constructAddToCartBtn(item));
            });
        });
    }
    catch (err) {
        console.log('Err:', err);
    }
    finally {

    }
}

function handleDummyCarousel() {
    const recomContainer = document.getElementById("product-recommendations");
    // Defining the callback function for the Intersection Observer
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Element is visible!');
                // Executing business function here
                buildNewRecommendationSection();
                //stopping observing the element
                observer.unobserve(entry.target);
            }
        });
    };

    // Creating an Intersection Observer instance
    const observer = new IntersectionObserver(callback, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger the callback when 50% of the target is visible
    });
    observer.observe(recomContainer);
}