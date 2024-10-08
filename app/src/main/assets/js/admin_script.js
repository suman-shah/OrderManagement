import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";
import { itemNames } from "./item_price.js";
import { itemPrices } from "./item_price.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcUrYx_eLswtcKPBpgJVyPWdyveDZLSyk",
  authDomain: "resturant-order-1d2b3.firebaseapp.com",
  databaseURL: "https://resturant-order-1d2b3-default-rtdb.firebaseio.com",
  projectId: "resturant-order-1d2b3",
  storageBucket: "resturant-order-1d2b3.appspot.com",
  messagingSenderId: "971852262554",
  appId: "1:971852262554:web:fefe99d0997f56f79e0323",
  measurementId: "G-4TS2JLW1BY",
};

document.addEventListener("DOMContentLoaded", () => {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const db = getFirestore(app);

  document
    .getElementById("chefStatusButton")
    .addEventListener("click", function () {
      // Call the createButtons function
      createButtons();

      // Remove display: none to show the containers
      document.getElementById("buttonsContainer").style.display = "";
      document.getElementById("ordersContainer").style.display = "";
    });

  document
    .getElementById("orderHistoryButton")
    .addEventListener("click", function () {
      document.getElementById("buttonsContainer").style.display = "none";
      document.getElementById("ordersContainer").style.display = "none";
      displayOrderHistory();
    });

  const collectionSelect = document.getElementById("collectionSelect");
  const dataDisplay = document.getElementById("dataDisplay");

  // Function to populate the select options with collection paths
  async function displayOrderHistory() {
    try {
      // Get all collections in the Firestore database
      const collectionsSnapshot = await getDocs(collection(db, "orders"));
      if (collectionsSnapshot.empty) {
        console.log("No documents in 'orders' collection.");
        return;
      }
      collectionsSnapshot.forEach((doc) => {
        // Create an option element for each collection
        const option = document.createElement("option");
        option.value = doc.id; // Set the collection path as the option value
        option.text = doc.id; // Set the collection path as the option text
        collectionSelect.add(option);
      });
    } catch (error) {
      console.error("Error getting collections: ", error);
    }
  }

  // Function to fetch and display data from the selected collection
  async function displayCollectionData() {
    const selectedCollectionPath = collectionSelect.value;

    try {
      const collectionRef = collection(db, `orders/${selectedCollectionPath}`);
      const querySnapshot = await getDocs(collectionRef);

      // Clear previous data display
      dataDisplay.innerHTML = "";

      // Display data for each document in the collection
      querySnapshot.forEach((doc) => {
        const documentData = doc.data();
        const documentId = doc.id;

        // Create a div to display document data
        const documentDiv = document.createElement("div");
        documentDiv.innerHTML = `
            <h3>Document ID: ${documentId}</h3>
            <pre>${JSON.stringify(documentData, null, 2)}</pre>
          `;
        dataDisplay.appendChild(documentDiv);
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }

  // Event listener for the select element
  collectionSelect.addEventListener("change", displayCollectionData);
  // Fetch all orders for Table-6 on 2024-08-11
  // async function displayOrderHistory() {
  //   console.log("Inside displayOrderHistory");
  //   const ordersContainer = document.getElementById("ordersHistoryContainer");

  //   // Clear existing content
  //   ordersContainer.innerHTML = "";

  // const docRef = doc(
  //   db,
  //   "orders/data_20240811/Table-6/Table-6_20240811_231703"
  // ); // Replace 'user123' with your document ID
  // console.log("Document path: ", docRef.path);

  //   try {
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       console.log("Document data:", docSnap.data());

  //       const orderData = docSnap.data();

  //       // Create a new div element to hold the order information
  //       const orderDiv = document.createElement("div");
  //       orderDiv.classList.add("order-item");

  //       // Populate the div with order data
  //       orderDiv.innerHTML = `
  //         <p>Order ID: ${docRef.id}</p>
  //         <p>Customer Name: ${orderData.custName}</p>
  //         <p>Total Amount: $${orderData.totalAmount}</p>
  //       `;

  //       // Append the order div to the container
  //       ordersContainer.appendChild(orderDiv);
  //     } else {
  //       console.log("No such document!");
  //     }
  //   } catch (error) {
  //     console.error("Error getting document:", error);
  //   }
  // }

  async function createButtons() {
    const buttonsContainer = document.getElementById("buttonsContainer");
    buttonsContainer.innerHTML = "";

    // const dbRef = ref(database);
    // const snapshot = await get(child(dbRef, "orders/"));
    // let orders = snapshot.val();

    for (let i = 1; i <= 10; i++) {
      // let tableKey = "Table-" + i;
      const button = document.createElement("button");
      button.textContent = "Table " + i;
      button.setAttribute("data-table-no", "Table-" + i);
      button.classList.add("table-btn");

      // if (orders) {
      //   if (!(orders[tableKey].toBilling === true)) {
      //     // Disable the button if the table is not closed
      //     button.classList.add("disabled-btn");
      //     button.disabled = true;
      //   }
      // } else {
      //   alert("Cannot fetch Order ID, Contact Developer");
      // }

      button.onclick = function () {
        const allButtons = document.querySelectorAll(".table-btn");
        allButtons.forEach((btn) => btn.classList.remove("active-btn"));
        // Add active class to the clicked button
        button.classList.add("active-btn");
        fetchOrders(button);
      };
      buttonsContainer.appendChild(button);
    }
  }

  async function fetchOrders(button) {
    try {
      const orderId = button.getAttribute("data-table-no");
      // console.log("Inside orderID if:", tableID);
      if (orderId) {
        // console.log("Inside orderID if:", orderId);
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "orders/" + orderId));
        let order = snapshot.val();
        if (order) {
          // console.log("Inside orders if:", orders);
          // const to_billing_var = order["toBilling"];
          // console.log("to_billing", to_billing_var);
          // if (to_billing_var != "true") {
          //   alert("Table not cleared yet! Please wait");
          //   location.reload(); // Reload the page
          //   return;
          // } else if (to_billing_var == "true") {
          displayBillDetails(order, orderId, button);
          // }
          //  else {
          //   alert("This should not show. Please contact Developer!!");
          // }
        } else {
          order = null;
          displayBillDetails(order, orderId, button);
        }
      } else {
        alert("Cannot fetch Order ID, Contact Developer");
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  }

  function displayBillDetails(order, orderId, button) {
    let billAmount = 0;
    const tableID = orderId.toLowerCase();
    const orderDetails = order["orderDetail"];
    var tableOneData = orderDetails[tableID]; // Accessing only the "Table-1" element
    console.log("tableOneData details:\n", tableOneData);

    if (tableOneData) {
      // Check if the data is a string and parse it if necessary
      if (typeof tableOneData === "string") {
        console.log(
          "Inside typeof tableOneData === string\n\ntableOneData:\n:",
          tableOneData
        );
        tableOneData = JSON.parse(tableOneData);
      }
    }
    console.log("Table-1 data:", tableOneData); // Log the fetched data
    // Clear any existing content in the display area
    const displayArea = document.getElementById("ordersContainer");
    displayArea.innerHTML = ""; // Clear previous data

    if (!order) {
      displayArea.innerHTML = "<p>No orders found for this table.</p>";
      return;
    }

    // Display order details
    const { custName, tableClosed, timeStamp, waiterName, toBilling } = order;
    // Display customer and order details
    const h2Element = document.createElement("h2");
    h2Element.id = "orderIDHeader";
    h2Element.textContent = `Order Details for : ${orderId}`;
    const orderDetailsContainer = document.createElement("div");
    orderDetailsContainer.classList.add("orderDetailsContainer");
    displayArea.appendChild(h2Element);
    orderDetailsContainer.innerHTML += `<p>Customer Name: ${custName}</p>`;
    orderDetailsContainer.innerHTML += `<p>Table Closed: ${tableClosed}</p>`;
    orderDetailsContainer.innerHTML += `<p>Time Stamp: ${timeStamp}</p>`;
    // displayArea.innerHTML += `<p>To Billing: ${toBilling}</p>`;
    orderDetailsContainer.innerHTML += `<p>Waiter Name: ${waiterName}</p>`;
    displayArea.appendChild(orderDetailsContainer);

    // Create a table element
    const table = document.createElement("table");

    // Create the table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = [
      "Item Name",
      "Quantity",
      "Note",
      "Dine In",
      "Rate",
      "Price",
    ];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement("tbody");
    let pairCounter = 0; // Add this line

    tableOneData.forEach((item) => {
      // console.log("pairCounter vefore: " + pairCounter);
      const rowClass = pairCounter % 2 === 1 ? "second-pair" : "first-pair"; // Modified line
      // console.log("pairCounter after: " + pairCounter);
      const row = document.createElement("tr");
      row.className = rowClass; // Add this line

      const itemNameCell = document.createElement("td");
      itemNameCell.textContent = item.itemName;
      row.appendChild(itemNameCell);

      const quantityCell = document.createElement("td");
      quantityCell.textContent = item.quantity;
      row.appendChild(quantityCell);

      const noteCell = document.createElement("td");
      noteCell.textContent = item.note;
      row.appendChild(noteCell);

      const dineInCell = document.createElement("td");
      dineInCell.textContent = item.dineIn;
      row.appendChild(dineInCell);

      const rateCell = document.createElement("td");
      rateCell.textContent = item.rate; //itemPrices[item.itemName] || 0;
      row.appendChild(rateCell);

      // Calculate the price and create a cell for it
      // Get the price from itemPrices based on item name
      const price = itemPrices[item.itemName] || 0; // Default to 0 if item not found
      const totalPrice = price * parseInt(item.quantity, 10); // Calculate total price

      billAmount += totalPrice;

      const priceCell = document.createElement("td");
      priceCell.textContent = `NRs. ${totalPrice.toFixed(2)}`; // Display price in fixed-point notation
      row.appendChild(priceCell);

      const toChefStatusChange = document.createElement("button");
      toChefStatusChange.id = "showPopupButton";
      toChefStatusChange.textContent = "Change Chef status to default";
      toChefStatusChange.classList.add("form-btn");
      toChefStatusChange.type = "button";
      toChefStatusChange.addEventListener("click", function () {
        showPopup(function () {
          toChefStatusChangeFn(orderId, item); // Call toBillingData if user clicks Yes
        });
      });

      const tobillingStatusChange = document.createElement("button");
      // console.log("toBilling value : " + toBilling);
      if (toBilling === false) {
        // console.log("Inside if toBilling value : " + toBilling);
        tobillingStatusChange.classList.add("disabled-btn");
        tobillingStatusChange.disabled = true;
      }
      tobillingStatusChange.id = "showPopupButton";
      tobillingStatusChange.textContent = "Billing Status to False";
      tobillingStatusChange.classList.add("form-btn");
      tobillingStatusChange.type = "button";
      tobillingStatusChange.addEventListener("click", function () {
        showPopup(function () {
          toBillingStatusChangeFn(button); // Call toBillingData if user clicks Yes
        });
      });

      row.appendChild(toChefStatusChange);
      row.appendChild(tobillingStatusChange);

      tbody.appendChild(row);
      table.appendChild(tbody);

      // Append the table to the container
      displayArea.appendChild(table);
    });
  }

  async function toBillingStatusChangeFn(button) {
    const to_billing_var = false;
    const orderId = button.getAttribute("data-table-no");
    const data = { toBilling: JSON.stringify(to_billing_var, null, 2) };
    console.log("Data:" + data);

    try {
      //   const orderId = document.getElementById("tableSelect").value;
      if (orderId) {
        const reference = ref(database, "orders/" + orderId);
        await update(reference, data);
        alert("Bill Generated. Plz visit cashier");
        location.reload(); // Reload the page
      } else {
        alert("Cannot fetch Order ID, Contact Developer");
      }
    } catch (error) {
      console.error("Error writing data to Firebase:", error);
      alert("Error submitting orders. Please try again.");
    }
  }

  async function toChefStatusChangeFn(orderId, item) {
    const chefStatus = 100;
    const tableID = orderId.toLowerCase();

    try {
      if (orderId) {
        // Reference to the order details
        const orderRef = ref(
          database,
          `orders/${orderId}/orderDetail/${tableID}`
        );
        const snapshot = await get(orderRef);

        if (snapshot.exists()) {
          const orderDetails = snapshot.val();

          // Locate the index of the item you want to update
          const itemIndex = orderDetails.findIndex(
            (orderItem) =>
              orderItem.itemName === item.itemName &&
              orderItem.note === item.note &&
              orderItem.quantity === item.quantity
          );

          if (itemIndex !== -1) {
            // Update the chefStatus of the specific item
            const updates = {};
            updates[`${itemIndex}/chefStatus`] = chefStatus; // Update chefStatus for the specific index

            await update(orderRef, updates);
            alert("Order status updated successfully!");
          } else {
            console.log("Item not found for update.");
          }
        } else {
          alert("No order details found.");
        }
      } else {
        alert("Cannot fetch Order ID, Contact Developer");
      }
    } catch (error) {
      console.error("Error writing data to Firebase:", error);
      alert("Error updating order status. Please try again.");
    }
  }

  function showPopup(callback) {
    // Show overlay and popup
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";

    // Yes button action
    document.getElementById("yesBtn").onclick = function () {
      callback(); // Call the passed function
      hidePopup(); // Hide the popup after clicking Yes
    };

    // No button action
    document.getElementById("noBtn").onclick = function () {
      hidePopup(); // Just hide the popup on No
    };
  }

  function hidePopup() {
    // Hide overlay and popup
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
  }
});
