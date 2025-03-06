

// ✅ ค้นหา element ที่ใช้แสดงข้อมูลสินค้า
const productContainer = document.getElementById("product-container");
const productContainer1 = document.getElementById("product-container1");
const inputBtn1 = document.querySelector(".add-to-cart-btn");

if (!productContainer || !productContainer1) {
    console.error(
        "❌ ไม่พบ element productContainer หรือ productContainer1 ใน HTML"
    );
}


// ✅ โหลดข้อมูลสินค้าจาก API
fetch("http://127.0.0.1:8080/blog/list/")
    .then((response) => response.json())
    .then((data) => {
        blogArray = data; // กำหนดค่าให้ตัวแปร
        console.log("✅ API Data Loaded:", blogArray);
    })
    .catch((error) => console.error("❌ Error fetching data:", error));

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-btn")) {
        const productId = event.target.dataset.productId;

        // ✅ ตรวจสอบว่า API โหลดเสร็จแล้วหรือยัง
        if (blogArray.length === 0) {
            console.warn("⚠️ blogArray ยังไม่ได้โหลดข้อมูลจาก API");
            return;
        }

        const product = blogArray.find((item) => item.id == productId);

        if (!product) {
            console.error("❌ ไม่พบสินค้า ID:", productId);
            return;
        }

        console.log("✅ เพิ่มสินค้า AJAX:", product.name);

        // ✅ หาค่า `<input>` ที่เกี่ยวข้องกับสินค้าที่ถูกกด
        const inputField = document.getElementById(`quantity-${productId}`);

        if (!inputField) {
            console.error(`❌ ไม่พบ input field id="quantity-${productId}"`);
            return;
        }

        let addedQuantity = parseFloat(inputField.value, 10) || 1; // ถ้าไม่มีค่ากำหนดให้เป็น 1

        if (addedQuantity < 1) {
            console.warn("⚠️ จำนวนสินค้าต้องมากกว่า 0");
            return;
        }

        // ✅ คำนวณราคา
        let totalProfit = product.profitprice * addedQuantity;
        let totalPrice = product.price * addedQuantity;

        // ✅ ตรวจสอบว่ามีสินค้าอยู่ใน stockAdjustments หรือไม่
        let existingProduct = stockAdjustments.find(
            (item) => item.product === product.name
        );

        if (existingProduct) {
            existingProduct.quantity += addedQuantity;
            existingProduct.totalProfit += totalProfit;
            existingProduct.TotalPrice += totalPrice;
        } else {
            stockAdjustments.push({
                product: product.name,
                quantity: Number(addedQuantity),
                totalProfit: Number(totalProfit),
                TotalPrice: Number(totalPrice),
            });
        }

        localStorage.setItem("stockAdjustments", JSON.stringify(stockAdjustments));
        // ✅ ส่ง Event ไปให้ script.js
        document.dispatchEvent(
            new CustomEvent("updateStock", { detail: stockAdjustments })
        );
        console.log("📦 stockAdjustments ปัจจุบัน:", stockAdjustments);

        // ✅ อัปเดตตารางสินค้า
        updateCartTable(product, addedQuantity);
        updateTotalAmount(); // คำนวณยอดรวมใหม่

        // ✅ อัปเดตภาพสินค้า
        if (productContainer) {
            productContainer.innerHTML = product.image
                ? `<div class="img2"><img src="${product.image}" alt="${product.name}" /></div>`
                : `<div class="img2">ไม่มีรูปภาพ</div>`;
        }

        if (productContainer1) {
            productContainer1.innerHTML = `
                  <h6>
                      - สินค้าใน stock: ${product.stock} pcs <br />
                      - ชื่อสินค้า: ${product.name} <br />
                      - ราคา: ${product.price} บาท <br />
                  </h6>`;
        }

        // ✅ รีเซ็ตค่าแสดงผล
        const calculatorDisplay = document.getElementById("calculatorDisplay");
        if (calculatorDisplay) {
            calculatorDisplay.textContent = "0";
        } else {
            console.error("❌ ไม่พบ element calculatorDisplay ใน HTML");
        }

        selectedItem = "";
    }
});



function updateCartTable(product, quantity) {
    console.log("🔍 ตรวจสอบค่า product:", product); // เพิ่มบรรทัดนี้
    if (!product) {
        console.error("❌ Error: ไม่พบข้อมูลสินค้า!");
        return;
    }

    const cartBody = document.getElementById("itemTableBody");
    let existingRow = document.querySelector(`#itemTableBody tr[data-product-id="${product.id}"]`);

    if (existingRow) {
        console.log("🟢 อัปเดตจำนวนสินค้าในตาราง");
        let quantityCell = existingRow.querySelector(".cart-quantity");
        let totalCell = existingRow.querySelector(".cart-total");

        let newQuantity = parseFloat(quantityCell.innerText, 10) + quantity;
        quantityCell.innerText = newQuantity.toFixed(2);
        totalCell.innerText = (newQuantity * product.price).toFixed(2);
    } else {
        console.log("🆕 เพิ่มสินค้าใหม่ลงในตาราง");
        let row = document.createElement("tr");
        row.setAttribute("data-product-id", product.id);
        let price = parseFloat(product.price) || 0;
        row.innerHTML = `
              <td class="1border p-2">${product.id}</td>
              <td class="1border p-2">${product.barcode || "ไม่มีข้อมูล"}</td>
              <td class="1border p-2">${product.name}</td>
              <td class="1border p-2">Kg/pcs</td>
              <td class="1border p-2 cart-quantity">${parseFloat(quantity).toFixed(2)}</td>
              <td class="1border p-2">${product.stock}</td>
              <td class="1border p-2 cart-total">${(price * quantity).toFixed(2)}</td>
              <td class="1border p-2">
                  <button type="button" class="btn btn-danger remove-item">ลบข้อมูล</button>
              </td>
          `;
        cartBody.appendChild(row);
    }

    addRemoveEvent();
}



// ✅ ฟังก์ชันคำนวณยอดรวม
function updateTotalAmount() {
    let totalAmount = stockAdjustments.reduce(
        (sum, item) => sum + item.TotalPrice,
        0
    );
    document.getElementById(
        "totalAmount"
    ).innerText = `${totalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} บาท`;
}

// ✅ ฟังก์ชันลบสินค้าออกจากตาราง
function addRemoveEvent() {
    document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", function () {
            let row = this.closest("tr");
            let productId = row.getAttribute("data-product-id");
            let productName = row.querySelector("td:nth-child(3)").innerText;

            stockAdjustments = stockAdjustments.filter(
                (item) => item.product !== productName
            );

            row.remove();
            updateTotalAmount(); // คำนวณยอดรวมใหม่
        });
    });
}

// ------------------------------------------------------------------------สำหรับการแอด update Stock-------------------------------------



window.stockAdjustments = [];
let stockAdjustments = []; // เก็บสินค้าที่เพิ่มเข้าไปในตะกร้า
let blogArray = []; // เก็บข้อมูลสินค้าจาก API
const inputBtn3 = document.querySelector(".custom-button4"); // สำหรับปุ่มรับเงิน


// ✅ ส่ง stockAdjustments ไปให้ script.js
document.dispatchEvent(new CustomEvent("updateStock", { detail: stockAdjustments }));
console.log("📤 ส่ง stockAdjustments จาก ajax.js:", stockAdjustments);
console.log("📤 ส่งข้อมูล stockAdjustments:", stockAdjustments);



document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-btn")) {
        const productId = event.target.dataset.productId;

        if (blogArray.length === 0) {
            console.warn("⚠️ API ยังไม่โหลดข้อมูล");
            return;
        }

        const product = blogArray.find(item => item.id == productId);
        if (!product) {
            console.error("❌ ไม่พบสินค้า ID:", productId);
            return;
        }

        console.log("✅ เพิ่มสินค้ารายการ:", product.name);

        let existingProduct = stockAdjustments.find(item => item.product === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            stockAdjustments.push({
                product: product.name,
                quantity: 1,
                totalPrice: product.price
            });
        }

        console.log("📦 stockAdjustments ใน ajax.js:", stockAdjustments);

        // ✅ ส่ง Event ไปให้ script.js
        document.dispatchEvent(new CustomEvent("updateStock", { detail: stockAdjustments }));
    }
});


//********************************************************************* */





// ✅ โหลดข้อมูลสินค้าจาก API
fetch("http://127.0.0.1:8080/blog/list/")
    .then((response) => response.json())
    .then((data) => {
        blogArray = data;
        console.log("✅ API Data Loaded:", blogArray);
    })
    .catch((error) => console.error("❌ Error fetching data:", error));

// ✅ ฟังก์ชันดึงค่า CSRF Token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}








