


    document.addEventListener("DOMContentLoaded", function() {
      var categorySelect = document.getElementById("categorySelect");
  
      document.getElementById("searchForm").addEventListener("submit", function(event) {
          event.preventDefault(); // ✅ ป้องกันหน้าเว็บรีโหลด
  
          var categoryId = categorySelect.value; // ✅ ดึงค่าหมวดหมู่ที่เลือก
          var productList = document.getElementById("productList1"); // ✅ พื้นที่แสดงสินค้า
  
          fetch(`/apps_ecommerceCart/?category=${categoryId}`, {
              headers: { "X-Requested-With": "XMLHttpRequest" } // ✅ แจ้ง Django ว่าเป็น AJAX Request
          })
          .then(response => response.text()) 
          .then(data => {
              productList.innerHTML = data; // ✅ อัปเดตรายการสินค้าแบบ Real-Time
          })
          .catch(error => console.error("เกิดข้อผิดพลาด: ", error));
      });
  });
  

// ----------------------------------สำหรีบเคียร์หน้าจอ---------------------------
  document.getElementById("clearFilterButton").addEventListener("click", function(event) {
    event.preventDefault();  // ป้องกันการรีโหลดหน้า
    var productList = document.getElementById("productList1");  // พื้นที่แสดงสินค้า

    fetch('/apps_ecommerceCart/', {
        method: 'GET',  // ส่งคำขอ GET ไปยัง URL
        headers: {
            'X-Requested-With': 'XMLHttpRequest'  // แจ้ง Django ว่าเป็นคำขอ AJAX
        }
    })
    .then(response => response.text())  // รับข้อมูลเป็น HTML
    .then(data => {
        productList.innerHTML = data;  // อัปเดตรายการสินค้า
    })
    .catch(error => console.error("เกิดข้อผิดพลาด: ", error));
});


// ----------------------------------สำหรับการค้นหาข้อมูล---------------------------

document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById("searchForm");
    const clearButton = document.getElementById("clearFilterButton");
    const productList = document.getElementById("productList1");

    // ฟังก์ชันส่งคำขอ AJAX เมื่อมีการกรอง
    function fetchProducts() {
        const formData = new FormData(searchForm);
        const urlParams = new URLSearchParams(formData).toString(); // แปลงฟอร์มเป็น query string

        fetch(`/apps_ecommerceCart/?${urlParams}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'  // แจ้ง Django ว่าเป็นคำขอ AJAX
            }
        })
        .then(response => response.text()) // รับข้อมูลเป็น HTML
        .then(data => {
            productList.innerHTML = data;
            // แสดงผลลัพธ์สินค้า
        })
        .catch(error => console.error("เกิดข้อผิดพลาด: ", error));
    }

    // เรียกฟังก์ชันเมื่อฟอร์มถูก submit
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();  // ป้องกันการรีโหลดหน้า
        fetchProducts();  // ส่งคำขอ AJAX
    });

    // ฟังก์ชันสำหรับเคลียร์การกรอง
    clearButton.addEventListener("click", function(event) {
        event.preventDefault();  // ป้องกันการรีโหลดหน้า

        // รีเซ็ตฟอร์ม
        searchForm.reset();

        // ส่งคำขอ AJAX ใหม่ให้แสดงสินค้าทั้งหมด
        fetchProducts();
    });



    // เพิ่ม event listener ให้กับการกรอกข้อมูลในช่องค้นหา
    const searchBarcode = document.getElementById('searchBarcode');
    searchBarcode.addEventListener('input', function() {
        fetchProducts(); // เรียกฟังก์ชันเมื่อมีการกรอกข้อมูลใหม่
    });


    // เรียกฟังก์ชันเริ่มต้นเมื่อโหลดหน้า (เพื่อแสดงสินค้าหลังจากกรองครั้งแรก)
    fetchProducts();
});





document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart")) {
        console.log("🎯 ปุ่มเพิ่มสินค้า ถูกกดแล้ว!");

        // ดึงค่าจาก data-attributes
        const productId = event.target.getAttribute("data-id");
        const productName = event.target.getAttribute("data-name");
        const productPrice = event.target.getAttribute("data-price");
        const productImage = event.target.getAttribute("data-image");
        const ProductStock = event.target.getAttribute("data-stock");
        const ProductBarcode = event.target.getAttribute("data-barcode");

        console.log(`📌 ID=${productId}, Name=${productName}, Price=${productPrice}`);

        if (!productId || !productName || !productPrice) {
            console.error("❌ ข้อมูลสินค้าผิดพลาด");
            return;
        }

        // ตรวจสอบว่ามีสินค้านี้อยู่แล้วหรือไม่
        let existingProduct = document.querySelector(`.cart-item[data-id="${productId}"]`);
        
        if (existingProduct) {
            // ถ้ามีอยู่แล้วให้เพิ่มจำนวน
            let quantityInput = existingProduct.querySelector(".products-quantity");
            quantityInput.value = parseInt(quantityInput.value) + 1;

            // อัปเดตราคาสินค้ารวม
            let linePriceElement = existingProduct.querySelector(".products-line-price");
            linePriceElement.textContent = (parseFloat(quantityInput.value) * parseFloat(productPrice)).toFixed(2);
        } else {
            // เพิ่มสินค้าใหม่ลงในตะกร้า
            const cartContainer = document.querySelector("#cart-items"); 
            const newItem = `
                <div class="card products cart-item" data-id="${productId}">
                    <div class="card-body">
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
                            <div class="p-4 rounded-md lg:col-span-2 bg-slate-100 dark:bg-zink-600">
                                <img src="${productImage}" alt="">
                            </div>
                            <div class="flex flex-col lg:col-span-4">
                                <div>
                                    <h5 class="mb-1 text-16"><a href="#">${productName}</a></h5>
                                    <p class="mb-2 text-slate-500 dark:text-zink-200"><a href="#!">ID ${productId}</a></p>
                                    <p class="mb-1 text-slate-500 dark:text-zink-200">ราคา: <span class="text-slate-800 dark:text-zink-50">${productPrice}</span></p>
                                    <p class="mb-1 text-slate-500 dark:text-zink-200">Stock: <span class="text-slate-800 dark:text-zink-50">${ProductStock}</span></p>
                                    <p class="mb-3 text-slate-500 dark:text-zink-200">Barcode: <span class="text-slate-800 dark:text-zink-50">${ProductBarcode}</span></p>
                                </div>
                                <div class="flex items-center gap-2 mt-auto">
                                    <div class="flex items-center">
                                                <span class="inline-block px-3 py-2 border ltr:border-r-0 rtl:border-l-0 border-slate-200 dark:border-zink-500 ltr:rounded-l-md rtl:rounded-r-md">PCS/Kg</span>
                                                <input type="number" id="inputText" class="ltr:rounded-l-none rtl:rounded-r-none form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="00.00">
                                    </div>
                                        
                                                    <button class="remove-btn text-white bg-red-500 border-red-500 btn">
                                                                 ลบ
                                                                    </button>




                                </div>
                            </div>
                            <div class="flex justify-between w-full lg:flex-col lg:col-end-13 lg:col-span-2">
                                <div class="mb-auto ltr:lg:text-right rtl:lg:text-left">
                                    <h6 class="text-16 products-price"><span>${productPrice}</span></h6>
                                </div>
                                <h6 class="mt-auto ltr:lg:text-right rtl:lg:text-left text-16">รวม <span class="products-line-price">${productPrice}</span></h6>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartContainer.insertAdjacentHTML("beforeend", newItem);
        }
    }
});

// ฟังก์ชันลบสินค้า
document.querySelector("#cart-items").addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const productCard = event.target.closest(".cart-item");
        if (productCard) {
            productCard.remove();
        }
    }
});




document.addEventListener("click", function (event) {
    if (event.target.id === "sa-success") { 
        Swal.fire({
            title: 'คุณได้ทำการเพิ่มรายการแล้ว!',
            text: 'รายการถูกเพิ่มแล้ว!',
            icon: 'success',
            confirmButtonText: 'OK', // ตั้งชื่อปุ่ม OK
            customClass: {
                confirmButton: 'text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 ltr:mr-1 rtl:ml-1',
            },
            buttonsStyling: false,
            showCloseButton: true // ถ้าไม่อยากให้มีปุ่ม X ปิด popup ให้ลบอันนี้ออก
        });
    }
});





document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.querySelector("#cart-items");
    
    cartContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            console.log("🛑 ปุ่มลบถูกคลิก");
            const productCard = event.target.closest(".card.products");
            
            if (productCard) {
                Swal.fire({
                    title: "คุณแน่ใจหรือไม่?",
                    text: "คุณจะไม่สามารถกู้คืนรายการนี้ได้!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "ใช่, ลบออกเลย!",
                    cancelButtonText: "ยกเลิก",
                    customClass: {
                        confirmButton: 'text-white btn bg-custom-500 border-custom-500',
                        cancelButton: 'text-white bg-red-500 border-red-500 btn'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("🛑 ลบสินค้าออกจากตะกร้า");
                        productCard.remove();
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "สินค้าของคุณถูกลบแล้ว.",
                            icon: "success"
                        });
                    }
                });
            }
        }
    });
});








