document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript Loaded!");

    // ✅ ใช้ Event Delegation ให้รองรับปุ่มที่ถูกโหลดผ่าน AJAX
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart-btn")) {
            const productId = event.target.dataset.productId;
            const quantityField = document.querySelector(`#quantity-${productId}`);
            const quantity = quantityField ? parseInt(quantityField.value, 10) : 1;

            const productNameElement = document.querySelector(`[data-product-name="${productId}"]`);
            const productPriceElement = document.querySelector(`[data-product-price="${productId}"]`);

            if (!productNameElement || !productPriceElement) {
                console.error("❌ ไม่สามารถดึงข้อมูลสินค้าได้");
                return;
            }

            const productName = productNameElement.innerText;
            const productPrice = parseFloat(productPriceElement.innerText);

            console.log("🟢 กำลังเพิ่มสินค้า:", { productId, productName, productPrice, quantity });

            // ✅ ตรวจสอบว่า updateCartTable() มีอยู่หรือไม่
            if (typeof updateCartTable === "function") {
                updateCartTable(productId, productName, productPrice, quantity);
            } else {
                console.error("❌ ไม่พบฟังก์ชัน updateCartTable()!");
            }
        }
    });
});


function updateCartTable(productId, name, price, quantity) {
    console.log("🔄 อัปเดตตารางสินค้า", productId, name, price, quantity);

    const cartBody = document.getElementById("cart-body");
    if (!cartBody) {
        console.error("❌ ไม่พบ `cart-body` ใน HTML!");
        return;
    }

    let existingRow = document.querySelector(`#cart-body tr[data-product-id="${productId}"]`);

    if (existingRow) {
        console.log("🟢 อัปเดตจำนวนสินค้าในตาราง");
        let quantityCell = existingRow.querySelector(".cart-quantity");
        let totalCell = existingRow.querySelector(".cart-total");

        let newQuantity = parseInt(quantityCell.innerText, 10) + quantity;
        quantityCell.innerText = newQuantity;
        totalCell.innerText = (newQuantity * price).toFixed(2);
    } else {
        console.log("🆕 เพิ่มสินค้าใหม่ลงในตาราง");
        let row = document.createElement("tr");
        row.setAttribute("data-product-id", productId);
        row.innerHTML = `
            <td class="border p-2">${productId}</td>
            <td class="border p-2">${name}</td>
            <td class="border p-2">${price.toFixed(2)}</td>
            <td class="border p-2 cart-quantity">${quantity}</td>
            <td class="border p-2 cart-total">${(price * quantity).toFixed(2)}</td>
            <td class="border p-2">
                <button class="remove-item bg-red-500 text-white p-1 rounded">ลบ</button>
            </td>
        `;
        cartBody.appendChild(row);
    }

    addRemoveEvent();
}
