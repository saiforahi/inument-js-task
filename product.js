window.addEventListener("load", handleProductScrapping());

async function postProductData(data) {
    try {
        const url = "http://localhost:5000/api/post-product"; // dummy endpoint
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Network response error: " + response.statusText);
        }

        const jsonResponse = await response.json();
        console.log("Success:", jsonResponse);
        return jsonResponse;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function handleProductScrapping() {
    const CURRENCY_MAP = {
        "$": "USD",
        "€": "EUR",
        "৳": "BDT",
    };
    const productInfo = {};
    try {
        // extracting product name
        const productNameEl = document.querySelector(
            "span[data-automation='product-title']"
        );
        if (productNameEl) {
            productInfo["name"] = productNameEl.innerHTML;
        }

        // extracting product sku number
        const productSkuEl = document.querySelector(
            "p[data-automation='product-part-number'] span"
        );
        if (productSkuEl) {
            productInfo["sku"] = productSkuEl.innerHTML;
        }

        // extracting product price and currency
        const productPriceEl = document.querySelector(
            "div[data-automation='price-text-container'] h3"
        );
        if (productPriceEl) {
            const priceTextContent = productPriceEl.innerHTML;
            productInfo["price"] = {
                currency: CURRENCY_MAP[String(priceTextContent).charAt(0)],
                value: String(priceTextContent).slice(1, priceTextContent.length),
                text_content: priceTextContent,
            };
        }
    } catch (err) {
        console.log("Extraction Err", err);
    } finally {
        console.log("product", productInfo);
        if (Object.keys(productInfo).length > 0 && productInfo["sku"]) {
            //checking product object has data or not also checking sku's existence since it is the unique property
            const postProductResponse = await postProductData(productInfo); // calling product data post function
            console.log("product added", postProductResponse);
        }
    }
}
