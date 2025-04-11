
let totalAmountFromDjango = 0; // ✅ ตัวแปร global สำหรับเก็บยอดรวม



document.addEventListener("DOMContentLoaded", function () {
  var categorySelect = document.getElementById("categorySelect");

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // ✅ ป้องกันหน้าเว็บรีโหลด

      var categoryId = categorySelect.value; // ✅ ดึงค่าหมวดหมู่ที่เลือก
      var productList = document.getElementById("productList1"); // ✅ พื้นที่แสดงสินค้า

      fetch(`/apps_ecommerceCart/?category=${categoryId}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" }, // ✅ แจ้ง Django ว่าเป็น AJAX Request
      })
        .then((response) => response.text())
        .then((data) => {
          productList.innerHTML = data; // ✅ อัปเดตรายการสินค้าแบบ Real-Time
        })
        .catch((error) => console.error("เกิดข้อผิดพลาด: ", error));
    });
});

// ----------------------------------สำหรีบเคียร์หน้าจอ---------------------------
document
  .getElementById("clearFilterButton")
  .addEventListener("click", function (event) {
    event.preventDefault(); // ป้องกันการรีโหลดหน้า
    var productList = document.getElementById("productList1"); // พื้นที่แสดงสินค้า

    fetch("/apps_ecommerceCart/", {
      method: "GET", // ส่งคำขอ GET ไปยัง URL
      headers: {
        "X-Requested-With": "XMLHttpRequest", // แจ้ง Django ว่าเป็นคำขอ AJAX
      },
    })
      .then((response) => response.text()) // รับข้อมูลเป็น HTML
      .then((data) => {
        productList.innerHTML = data; // อัปเดตรายการสินค้า
      })
      .catch((error) => console.error("เกิดข้อผิดพลาด: ", error));
  });

// ----------------------------------สำหรับการค้นหาข้อมูล---------------------------

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const clearButton = document.getElementById("clearFilterButton");
  const productList = document.getElementById("productList1");

  // ฟังก์ชันส่งคำขอ AJAX เมื่อมีการกรอง
  function fetchProducts() {
    const formData = new FormData(searchForm);
    const urlParams = new URLSearchParams(formData).toString(); // แปลงฟอร์มเป็น query string

    fetch(`/apps_ecommerceCart/?${urlParams}`, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest", // แจ้ง Django ว่าเป็นคำขอ AJAX
      },
    })
      .then((response) => response.text()) // รับข้อมูลเป็น HTML
      .then((data) => {
        productList.innerHTML = data;
        // แสดงผลลัพธ์สินค้า
      })
      .catch((error) => console.error("เกิดข้อผิดพลาด: ", error));
  }

  // เรียกฟังก์ชันเมื่อฟอร์มถูก submit
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // ป้องกันการรีโหลดหน้า
    fetchProducts(); // ส่งคำขอ AJAX
  });

  // ฟังก์ชันสำหรับเคลียร์การกรอง
  clearButton.addEventListener("click", function (event) {
    event.preventDefault(); // ป้องกันการรีโหลดหน้า

    // รีเซ็ตฟอร์ม
    searchForm.reset();

    // ส่งคำขอ AJAX ใหม่ให้แสดงสินค้าทั้งหมด
    fetchProducts();
  });

  // เพิ่ม event listener ให้กับการกรอกข้อมูลในช่องค้นหา
  const searchBarcode = document.getElementById("searchBarcode");
  searchBarcode.addEventListener("input", function () {
    fetchProducts(); // เรียกฟังก์ชันเมื่อมีการกรอกข้อมูลใหม่
  });

  // เรียกฟังก์ชันเริ่มต้นเมื่อโหลดหน้า (เพื่อแสดงสินค้าหลังจากกรองครั้งแรก)
  fetchProducts();
});

const cartItems = [];

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
    const ProductProfitprice = event.target.getAttribute("data-profitprice");

    console.log(
      `📌 ID=${productId}, Name=${productName}, Price=${productPrice}`
    );

    if (!productId || !productName || !productPrice) {
      console.error("❌ ข้อมูลสินค้าผิดพลาด");
      return;
    }

    const cartContainer = document.querySelector("#cart-items");

    // รับค่าจำนวนจาก input ที่อยู่ในสินค้าเดียวกับปุ่มที่ถูกกด
    const parent = event.target.closest("p"); // หรือเปลี่ยนตามโครงสร้างจริง
    const quantityInput =
      parent?.previousElementSibling?.querySelector(".inputText");
    // ✅ เปลี่ยนเป็น parseFloat เพื่อรองรับทศนิยม
    let quantity = quantityInput ? parseFloat(quantityInput.value) : 1;
    if (!quantity || quantity <= 0) quantity = 1;

    const totalPrice = (parseFloat(productPrice) * quantity).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    // ตรวจสอบว่ามีสินค้านี้อยู่แล้วหรือไม่
    let existingProduct = document.querySelector(
      `.cart-item[data-id="${productId}"]`
    );

    if (existingProduct) {
      // ถ้ามีสินค้าอยู่แล้ว ให้เพิ่มจำนวน
      const existingQuantityInput =
        existingProduct.querySelector(".products-quantity");
      const currentQuantity = parseFloat(existingQuantityInput.value) || 0;
      const newQuantity = currentQuantity + quantity;
      existingQuantityInput.value = newQuantity;
      // อัปเดตราคาสินค้ารวม
      const newTotal = (parseFloat(productPrice) * newQuantity).toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

      existingProduct.querySelector(".products-line-price").textContent =
        newTotal;

      // สำหรับการกรองสินค้า
      const index = cartItems.findIndex((item) => item.id === productId);
      if (index !== -1) {
        cartItems[index].quantity += quantity;
        cartItems[index].total =
          parseFloat(productPrice) * cartItems[index].quantity;
      }

      // ✅ อัปเดตแถวในตารางด้านขวา

      // หลังจากอัปเดต existingProduct แล้วให้ใส่

      const allTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
      document.querySelector(
        ".cart-total"
      ).textContent = `${allTotal.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })} บาท`;

      const tableBody = document.querySelector(".table-total");
      const existingRow = tableBody?.querySelector(
        `tr[data-id="${productId}"]`
      );
      if (existingRow) {
        const priceCell = existingRow.querySelector(".product-total-cell");
        const oldTotal = parseFloat(priceCell.getAttribute("data-total")) || 0;
        const newRowTotal = oldTotal + parseFloat(productPrice) * quantity;
        priceCell.setAttribute("data-total", newRowTotal);
        priceCell.textContent = `${newRowTotal.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })} บาท`;
      }
    } else {
      // สำหรับเพิ่มรายการเข้าไปใน array
      cartItems.push({
        id: productId,
        stock: ProductStock,
        name: productName,
        barcode: ProductBarcode,
        Profitprice: ProductProfitprice,
        quantity: quantity,
        unitPrice: parseFloat(productPrice),
        total: parseFloat(productPrice) * quantity,
      });

   
      updateTotal();

      //------------------------------แสดงค่าที่ส่งไปยังserver ------------------------------------------

      console.log("📦 ข้อมูลที่ส่งไปยัง Django:", cartItems); // ตรวจสอบข้อมูลก่อนส่ง

     


      function updateTotal() {
        console.log("📦 ข้อมูลที่ส่งไปยัง Django:", cartItems);
      
        fetch("/apps_ecommerceCart/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ items: cartItems })
        })
          .then(response => response.json())
          .then(data => {
            console.log("📈 Response:", data);
      
            // ✅ เก็บ total จาก Django ไว้ใช้งานภายหลัง
            totalAmountFromDjango = parseFloat(data.total);
      
            // อัปเดตใน DOM ก็ได้เช่นกัน
            const totalElement = document.getElementById("totalDisplay");
            if (totalElement) {
              totalElement.innerText = data.total;
            } else {
              console.warn("⚠️ ไม่พบ element ที่มี id='totalDisplay'");
            }
          })
          .catch(error => {
            console.error("❌ Error calculating total:", error);
          });
      }

      
    

   






      console.log("แสดงรายการ1", cartItems);
      console.log("รับค่า inputText", quantity);

      //--------------------------------------------------------------------------------

      // ------------------------------------------------------------------------------เดี่ยวรับค่าจาก django ง่ายกว่า-------------------------------------------------------------

      /*function updateTotal() {
        const allTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
        const formattedTotal = allTotal.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });

        const cartTotalElement = document.querySelector(".cart-total");
        const totalDueElement = document.getElementById("totalDue");

        if (cartTotalElement) {
          cartTotalElement.textContent = `${formattedTotal} บาท`;
        }

        if (totalDueElement) {
          totalDueElement.textContent = `฿${formattedTotal}`;
        }

        console.log("สำหรับรายการที่แสดงในนี้", formattedTotal);
      }
*/
      // -------------------------------------------------------------------------------ตารางมุมขวาสุด-------------------------------------------------------------
      const tableBody = document.querySelector(".table-total");

      if (tableBody) {
        const totalRow = tableBody.querySelector(".cart-summary-row");
        const newRow = document.createElement("tr");
        newRow.setAttribute("data-id", productId); // ต้องมีด้วย เพื่อให้ค้นหาได้
        newRow.innerHTML = `
                <td class="py-2 text-slate-500 dark:text-zink-200">${productName}</td>
                <td class="py-2 text-slate-500 dark:text-zink-200 product-total-cell" data-total="${
                  parseFloat(productPrice) * quantity
                }">${totalPrice} บาท</td>
              `;

        if (totalRow) {
          tableBody.insertBefore(newRow, totalRow); // ✅ แทรกก่อน totalRow
        } else {
          tableBody.appendChild(newRow);
        }
        // ✅ อัปเดตราคารวมทั้งหมดต้องมีทั้งด้านบนและด้านล่างด้วยกันน่ะเพราะว่า มันจะเรียกการอับเดท
        const allTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
        document.querySelector(
          ".cart-total"
        ).textContent = `${allTotal.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })} บาท`;
      } else {
        console.error("❌ ไม่พบ .table-total ใน DOM");
      }

      console.log("totalProfit", totalPrice);
      console.log("tableBody", tableBody);

      // ---------------------------------------------------------------------------------------------------------------------------------------------------

      // ถ้ายังไม่มีสินค้าในตะกร้า ให้เพิ่มใหม่
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
                                      <input type="number" class="inputText products-quantity ltr:rounded-l-none rtl:rounded-r-none form-input border-slate-200 dark:border-zink-500 bg-white dark:bg-zink-700 text-slate-900 dark:text-zink-100 focus:outline-none focus:border-custom-500" value="${quantity}">

                                    </div>
                                    <button class="remove-btn text-white bg-red-500 border-red-500 btn">ลบ</button>
                                </div>
                            </div>
                            <div class="flex justify-between w-full lg:flex-col lg:col-end-13 lg:col-span-2">
                                <div class="mb-auto ltr:lg:text-right rtl:lg:text-left">
                                    <h6 class="text-16 products-price"><span>${productPrice}</span></h6>
                                </div>
                                <h6 class="mt-auto ltr:lg:text-right rtl:lg:text-left text-16">รวม <span class="products-line-price">${totalPrice}</span></h6>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      cartContainer.insertAdjacentHTML("beforeend", newItem);
    }
  }
});

document.addEventListener("click", function (event) {
  if (event.target.id === "sa-success") {
    Swal.fire({
      title: "คุณได้ทำการเพิ่มรายการแล้ว!",
      text: "รายการถูกเพิ่มแล้ว!",
      icon: "success",
      confirmButtonText: "OK", // ตั้งชื่อปุ่ม OK
      customClass: {
        confirmButton:
          "text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 ltr:mr-1 rtl:ml-1",
      },
      buttonsStyling: false,
      showCloseButton: true, // ถ้าไม่อยากให้มีปุ่ม X ปิด popup ให้ลบอันนี้ออก
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.querySelector("#cart-items");

  cartContainer.addEventListener("click", function (event) {
    const removeButton = event.target.closest(".remove-btn"); // ตรวจสอบปุ่มลบ

    if (removeButton) {
      console.log("🛑 ปุ่มลบถูกคลิก");

      const productCard = removeButton.closest(".card.products");

      if (productCard) {
        const productId = productCard.getAttribute("data-id");
        // แสดงกล่องยืนยันก่อนลบ
        Swal.fire({
          title: "คุณแน่ใจหรือไม่?",
          text: "คุณจะไม่สามารถกู้คืนรายการนี้ได้!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ใช่, ลบออกเลย!",
          cancelButtonText: "ยกเลิก",
          customClass: {
            confirmButton: "text-white btn bg-custom-500 border-custom-500",
            cancelButton: "text-white bg-red-500 border-red-500 btn",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.isConfirmed) {
            // ลบสินค้าเมื่อยืนยัน
            productCard.remove();

            // ลบจาก array ด้วย
            const index = cartItems.findIndex((item) => item.id === productId);
            if (index !== -1) {
              cartItems.splice(index, 1);
             
             
              console.log("🧹 ลบจาก array แล้ว:", cartItems);
            }

            // ลบแถวในตารางด้านขวา
            const tableBody = document.querySelector(".table-total");
            const rowToRemove = tableBody?.querySelector(
              `tr[data-id="${productId}"]`
            );
          

            if (rowToRemove) {
              rowToRemove.remove();
              // ✅ เรียกฟังก์ชัน updateTotal เพื่ออัปเดตยอดรวมและแสดงผล

              console.log("✅ ลบแถวในตารางแล้ว");
            
            }
            
            // อัปเดตราคารวม
            const newTotal = cartItems.reduce(
              (sum, item) => sum + item.total,0);
            document.querySelector(".cart-total").textContent = `${newTotal.toLocaleString("en-US", {minimumFractionDigits: 2,})} บาท`;


                
            function updateTotal() {
                console.log("📦 ข้อมูลที่ส่งไปยัง Django:", cartItems);
              
                fetch("/apps_ecommerceCart/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ items: cartItems })
                })
                  .then(response => response.json())
                  .then(data => {
                    console.log("📈 Response:", data);
              
                    // ✅ เก็บ total จาก Django ไว้ใช้งานภายหลัง
                    totalAmountFromDjango = parseFloat(data.total);
              
                    // อัปเดตใน DOM ก็ได้เช่นกัน
                    const totalElement = document.getElementById("totalDisplay");
                    if (totalElement) {
                      totalElement.innerText = data.total;
                    } else {
                      console.warn("⚠️ ไม่พบ element ที่มี id='totalDisplay'");
                    }
                  })
                  .catch(error => {
                    console.error("❌ Error calculating total:", error);
                  });
              }
      updateTotal();


            // แจ้งเตือน
            Swal.fire({
              title: "ลบสำเร็จ!",
              text: "สินค้าของคุณถูกลบแล้ว.",
              icon: "success",
            });
          }
        });
      }
    }
  });
});

// ------------------------------------------------------------------------------เดี่ยวรับค่าจาก django ง่ายกว่า-------------------------------------------------------------

/*document.addEventListener("DOMContentLoaded", () => {
    const number1 = document.getElementById("keypad-1");

    function numberOne() {
      console.log("แสดงค่าที่ตัวเลขที่ 1");
    }

    if (number1) {
      number1.addEventListener("click", numberOne);
    } else {
      console.log("หา element ไม่เจอ");
    }
  });*/

//่-------------------------------------------------------สำหรับการ เรียก event ในการกดปุ่มกด-----------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("posInput");

  // -----------------------------
  // จัดการ Keypad ตัวเลข
  // -----------------------------
  const keys = document.querySelectorAll("button[id^='keypad-']");
  keys.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.textContent;
      if (key === "C") {
        input.value = "";
      } else {
        input.value += key;
      }
    });
  });

  // -----------------------------
  // จัดการปุ่ม Shortcut เงิน
  // -----------------------------
  const shortcuts = document.querySelectorAll(".quick-bill");
  shortcuts.forEach((button) => {
    button.addEventListener("click", () => {
      const addAmount = parseFloat(button.dataset.value);
      const currentValue = parseFloat(input.value) || 0;
      const newValue = currentValue + addAmount;
      input.value = newValue.toFixed(2);
    });
  });

  // -----------------------------
  // จัดการการพิมพ์จากคีย์บอร์ด
  // -----------------------------
  document.addEventListener("keydown", function (e) {
    const allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    if (allowedKeys.includes(e.key)) {
      handleInput(e.key);
    } else if (e.key === "Backspace") {
      input.value = input.value.slice(0, -1);
    } else if (e.key === "Escape") {
      input.value = "";
    }
  });

  // -----------------------------
  // ฟังก์ชันจัดการ Input ที่เข้ามา
  // -----------------------------
  function handleInput(char) {
    let value = input.value;

    // ไม่ให้เกิน 13 ตัวอักษร
    if (value.length >= 13) return;

    // ถ้าเป็นจุด
    if (char === ".") {
      if (value.includes(".")) return; // มีจุดอยู่แล้ว
      if (value === "") {
        input.value = "0.";
        return;
      }
    }

    // ต่อท้ายตัวเลข/จุด
    input.value += char;
  }
});

//่-------------------------------------------------------สำหรับ event การรับเงิน -----------------------------------------------------

console.log("ค่าจาก dejango5555",totalAmountFromDjango)

document.addEventListener("DOMContentLoaded", function () {
    const recipeButton = document.getElementById("RecipeMony");
  
    if (recipeButton) {
      recipeButton.addEventListener("click", handleReceiveMoney);
    } else {
      console.warn("❗ ไม่พบปุ่มที่มี id='RecipeMony'");
    }
  });
  
  function handleReceiveMoney() {
    const input = document.getElementById("posInput");
    const inputValue = parseFloat(input.value);
  
    if (isNaN(inputValue)) {
      alert("⚠️ ค่าที่ป้อนไม่ถูกต้อง");
      return;
    }
  
    console.log("💰 รับเงิน:", inputValue, " | ยอดจาก Django:", totalAmountFromDjango);
  
    if (inputValue < totalAmountFromDjango) {
      alert("❌ คุณป้อนเงินน้อยกว่ายอดรวม กรุณาตรวจสอบอีกครั้ง");
    } else {
        const change = inputValue - totalAmountFromDjango;

        // ✅ แสดงผลใน DOM
        const receivedDisplay = document.getElementById("received");
        if (receivedDisplay) {
          receivedDisplay.textContent = `฿${inputValue.toFixed(2)}`;



          
        }

        // ✅ อัปเดต DOM: เงินทอน
        const changeDisplay = document.getElementById("change");
         if (changeDisplay) {
            changeDisplay.textContent = `฿${change.toFixed(2)}`;
         }
    
        alert(`✅ รับเงินเรียบร้อยแล้ว!\nเงินทอน: ${change.toFixed(2)} บาท`);
      }
  }
  