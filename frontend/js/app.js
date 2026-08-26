const BASE_URL = "http://localhost:5000";

window.addEventListener("load", () => {
  loadCakes();
  loadBasket();
  loadNotifications();
  restoreRatingCake();
});

// Safe Fetch With Timeout

function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timer);
  });
}

// Add New Cake

async function addCake() {
  try {
    const name = document.getElementById("newCakeName").value.trim();

    const description = document
      .getElementById("newCakeDescription")
      .value.trim();

    const category = document.getElementById("newCakeCategory").value.trim();

    const priceValue = document.getElementById("newCakePrice").value;

    const availability =
      document.getElementById("newCakeAvailability").value === "true";

    // Basic validation

    if (!name || !description || !category || !priceValue) {
      alert("Please fill all cake details.");

      return;
    }

    const price = Number(priceValue);

    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price greater than 0.");

      return;
    }

    const response = await fetchWithTimeout(`${BASE_URL}/catalog/cakes`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        description,
        category,
        price,
        availability,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Cake added successfully.");

      // Clear form

      document.getElementById("newCakeName").value = "";

      document.getElementById("newCakeDescription").value = "";

      document.getElementById("newCakeCategory").value = "";

      document.getElementById("newCakePrice").value = "";

      // Refresh cakes automatically

      await loadCakes();
    } else {
      alert(result.message || "Unable to add cake.");
    }
  } catch (error) {
    console.error("Add Cake Error:", error);

    if (error.name === "AbortError") {
      alert("Catalog Service is taking too long to respond.");
    } else {
      alert("Unable to add cake.");
    }
  }
}

// Load All Cakes

async function loadCakes() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/catalog/cakes`);

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Unable to load cakes.");

      return;
    }

    displayCakes(result.data);
  } catch (error) {
    console.error("Load Cakes Error:", error);

    const cakeContainer = document.getElementById("cakeContainer");

    if (cakeContainer) {
      cakeContainer.innerHTML = `
                <div class="empty-message">

                    <h3>
                        Unable to load cakes.
                    </h3>

                    <p>
                        Please check whether the Catalog Service is running.
                    </p>

                </div>
            `;
    }
  }
}

// Display Cakes

function displayCakes(cakes) {
  const cakeContainer = document.getElementById("cakeContainer");

  cakeContainer.innerHTML = "";

  if (!cakes || cakes.length === 0) {
    cakeContainer.innerHTML = `
      <div class="empty-message">
        <div class="empty-icon">🍰</div>
        <h3>No cakes found</h3>
        <p>Try another search or add a new delicious cake.</p>
      </div>
    `;

    return;
  }

  cakes.forEach((cake) => {
    const cakeCard = document.createElement("div");

    cakeCard.className = "cake-card";

    const availabilityText = cake.availability ? "Available" : "Not Available";

    cakeCard.innerHTML = `
      <div class="cake-card-top">

        <div class="cake-icon">
          🍰
        </div>

        <span class="cake-category">
          ${escapeHtml(cake.category)}
        </span>

      </div>

      <div class="cake-content">

        <h3>
          ${escapeHtml(cake.name)}
        </h3>

        <p class="cake-description">
          ${escapeHtml(cake.description)}
        </p>

        <div class="cake-price">
          ₹${Number(cake.price).toFixed(2)}
        </div>

        <div class="cake-availability">
          <span class="status-dot ${
            cake.availability ? "available" : "unavailable"
          }"></span>

          <span>
            ${availabilityText}
          </span>
        </div>

      </div>
    `;

    // Cake Actions

    const actionContainer = document.createElement("div");

    actionContainer.className = "cake-actions";

    // Add To Basket
    if (cake.availability) {
      const addButton = document.createElement("button");

      addButton.className = "add-basket-button";

      addButton.innerHTML = `
        <span>🛒</span>
        Add To Basket
      `;

      addButton.onclick = () => {
        addToBasket(cake.id, cake.name, Number(cake.price));
      };

      actionContainer.appendChild(addButton);
    } else {
      const unavailableButton = document.createElement("button");

      unavailableButton.className = "add-basket-button unavailable-button";

      unavailableButton.textContent = "Not Available";

      unavailableButton.disabled = true;

      actionContainer.appendChild(unavailableButton);
    }

    // Delete Cake
    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-button";

    deleteButton.innerHTML = `
      <span>🗑️</span>
      Delete Cake
    `;

    deleteButton.onclick = () => {
      deleteCake(cake.id, cake.name);
    };

    actionContainer.appendChild(deleteButton);

    cakeCard.appendChild(actionContainer);

    cakeContainer.appendChild(cakeCard);
  });
}

// Delete Cake
async function deleteCake(id, name) {
  const confirmed = confirm(`Are you sure you want to delete "${name}"?`);

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/catalog/cakes/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      alert("Cake deleted successfully.");

      // Refresh the cake list automatically

      await loadCakes();
    } else {
      alert(result.message || "Unable to delete cake.");
    }
  } catch (error) {
    console.error("Delete Cake Error:", error);

    if (error.name === "AbortError") {
      alert("Catalog Service is taking too long to respond.");
    } else {
      alert("Unable to connect to Catalog Service.");
    }
  }
}

// Search / Filter Cakes

async function filterCakes() {
  const name = document.getElementById("cakeName").value.trim();

  const category = document.getElementById("cakeCategory").value.trim();

  const minPrice = document.getElementById("minPrice").value;

  const maxPrice = document.getElementById("maxPrice").value;

  // Validate price values

  if (minPrice && Number(minPrice) < 0) {
    alert("Minimum price cannot be negative.");

    return;
  }

  if (maxPrice && Number(maxPrice) < 0) {
    alert("Maximum price cannot be negative.");

    return;
  }

  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    alert("Minimum price cannot be greater than maximum price.");

    return;
  }

  const params = new URLSearchParams();

  if (name) {
    params.append("name", name);
  }

  if (category) {
    params.append("category", category);
  }

  if (minPrice) {
    params.append("minPrice", minPrice);
  }

  if (maxPrice) {
    params.append("maxPrice", maxPrice);
  }

  try {
    const query = params.toString();

    const url = query
      ? `${BASE_URL}/catalog/cakes?${query}`
      : `${BASE_URL}/catalog/cakes`;

    const response = await fetchWithTimeout(url);

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Unable to search cakes.");

      return;
    }

    displayCakes(result.data);
  } catch (error) {
    console.error("Search Error:", error);

    if (error.name === "AbortError") {
      alert("Catalog Service is taking too long to respond.");
    } else {
      alert("Unable to search cakes.");
    }
  }
}

// Clear Search

async function clearSearch() {
  document.getElementById("cakeName").value = "";

  document.getElementById("cakeCategory").value = "";

  document.getElementById("minPrice").value = "";

  document.getElementById("maxPrice").value = "";

  // Show all cakes again

  await loadCakes();
}

// Add To Basket

async function addToBasket(id, name, price) {
  try {
    // Safety validation

    if (!id || !name || isNaN(Number(price)) || Number(price) <= 0) {
      alert("Unable to add this cake to basket.");

      return;
    }

    const response = await fetchWithTimeout(`${BASE_URL}/orders/basket`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        cakeId: id,
        cakeName: name,
        price: Number(price),
        quantity: 1,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Cake added to basket successfully.");

      await loadBasket();
    } else {
      alert(result.message || "Unable to add cake to basket.");
    }
  } catch (error) {
    console.error("Add Basket Error:", error);

    if (error.name === "AbortError") {
      alert("Order Service is taking too long to respond.");
    } else {
      alert("Unable to connect to Order Service.");
    }
  }
}

// Load Basket

async function loadBasket() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/orders/basket`);

    const result = await response.json();

    const basketBody = document.getElementById("basketBody");

    const grandTotal = document.getElementById("grandTotal");

    if (!response.ok || !result.success) {
      basketBody.innerHTML = `
                <tr>

                    <td colspan="5">
                        Unable to load basket.
                    </td>

                </tr>
            `;

      grandTotal.innerHTML = "Grand Total : ₹0";

      return;
    }

    basketBody.innerHTML = "";

    let total = 0;
    let itemCount = 0;

    if (!result.data || result.data.length === 0) {
      basketBody.innerHTML = `
        <tr>
            <td colspan="5">
                Basket is Empty
            </td>
        </tr>
    `;

      grandTotal.innerHTML = "Grand Total : ₹0";

      const basketItemCount = document.getElementById("basketItemCount");

      if (basketItemCount) {
        basketItemCount.textContent = "0";
      }

      return;
    }

    result.data.forEach((item) => {
      const itemPrice = Number(item.price);

      const itemTotal = Number(item.totalPrice);

      total += itemTotal;
      itemCount += Number(item.quantity);

      basketBody.innerHTML += `

                <tr>

                    <td>
                        ${escapeHtml(item.cakeName)}
                    </td>


                    <td>
                        ₹${itemPrice.toFixed(2)}
                    </td>


                    <td>

                        <div class="quantity-controls">

                            <button
                                onclick="decreaseQuantity(
                                    ${item.id},
                                    ${item.quantity}
                                )"
                                ${item.quantity <= 1 ? "disabled" : ""}
                            >
                                -
                            </button>


                            <span>
                                ${item.quantity}
                            </span>


                            <button
                                onclick="increaseQuantity(
                                    ${item.id},
                                    ${item.quantity}
                                )"
                            >
                                +
                            </button>

                        </div>

                    </td>


                    <td>
                        ₹${itemTotal.toFixed(2)}
                    </td>


                    <td>

                        <button
                            onclick="deleteBasket(
                                ${item.id}
                            )"
                        >
                            Remove
                        </button>

                    </td>

                </tr>
            `;
    });

    grandTotal.innerHTML = `Grand Total : ₹${total.toFixed(2)}`;
    const basketItemCount = document.getElementById("basketItemCount");

    if (basketItemCount) {
      basketItemCount.textContent = itemCount;
    }
  } catch (error) {
    console.error("Load Basket Error:", error);

    document.getElementById("basketBody").innerHTML = `
            <tr>

                <td colspan="5">
                    Unable to load basket.
                </td>

            </tr>
        `;

    document.getElementById("grandTotal").innerHTML = "Grand Total : ₹0";
    grandTotal.innerHTML = "₹0.00";

    const basketItemCount = document.getElementById("basketItemCount");

    if (basketItemCount) {
      basketItemCount.textContent = "0";
    }
  }
}

// Increase Quantity

async function increaseQuantity(id, currentQuantity) {
  const newQuantity = Number(currentQuantity) + 1;

  await updateBasketQuantity(id, newQuantity);
}

// Decrease Quantity

async function decreaseQuantity(id, currentQuantity) {
  const newQuantity = Number(currentQuantity) - 1;

  if (newQuantity < 1) {
    return;
  }

  await updateBasketQuantity(id, newQuantity);
}

// Update Basket Quantity

async function updateBasketQuantity(id, quantity) {
  try {
    if (quantity < 1) {
      return;
    }

    const response = await fetchWithTimeout(`${BASE_URL}/orders/basket/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        quantity: quantity,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      await loadBasket();
    } else {
      alert(result.message || "Unable to update quantity.");
    }
  } catch (error) {
    console.error("Update Quantity Error:", error);

    if (error.name === "AbortError") {
      alert("Order Service is taking too long to respond.");
    } else {
      alert("Unable to update basket.");
    }
  }
}

// Remove Basket Item

async function deleteBasket(id) {
  const confirmRemove = confirm(
    "Are you sure you want to remove this cake from the basket?",
  );

  if (!confirmRemove) {
    return;
  }

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/orders/basket/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      await loadBasket();
    } else {
      alert(result.message || "Unable to remove item.");
    }
  } catch (error) {
    console.error("Remove Basket Error:", error);

    if (error.name === "AbortError") {
      alert("Order Service is taking too long to respond.");
    } else {
      alert("Unable to remove item.");
    }
  }
}

// Checkout
async function checkout() {
  try {
    const customerName = document.getElementById("customerName").value.trim();

    const customerEmail = document.getElementById("customerEmail").value.trim();

    const deliveryAddress = document
      .getElementById("deliveryAddress")
      .value.trim();

    if (!customerName) {
      alert("Please enter your name.");
      return;
    }

    if (!customerEmail) {
      alert("Please enter your email address.");
      return;
    }

    if (!deliveryAddress) {
      alert("Please enter your delivery address.");
      return;
    }

    // Check basket before checkout
    const basketResponse = await fetchWithTimeout(`${BASE_URL}/orders/basket`);

    const basketResult = await basketResponse.json();

    if (
      !basketResult.success ||
      !basketResult.data ||
      basketResult.data.length === 0
    ) {
      alert("Your basket is empty.");
      return;
    }

    const response = await fetchWithTimeout(`${BASE_URL}/orders/checkout`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        customerName,
        customerEmail,
        deliveryAddress,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || "Order placed successfully.");

      await loadBasket();
      await loadNotifications();

      document.getElementById("customerName").value = "";
      document.getElementById("customerEmail").value = "";
      document.getElementById("deliveryAddress").value = "";
    } else {
      alert(result.message || "Unable to complete checkout.");
    }
  } catch (error) {
    console.error("Checkout Error:", error);

    if (error.name === "AbortError") {
      alert("Order Service is taking too long to respond.");
    } else {
      alert("Unable to complete checkout.");
    }
  }
}

// Submit Rating

async function submitRating() {
  try {
    const cakeId = document.getElementById("ratingCakeId").value;

    localStorage.setItem("cakeRatingId", cakeId);

    const userName = document.getElementById("userName").value.trim();

    const rating = document.getElementById("rating").value;

    const review = document.getElementById("review").value.trim();

    if (!cakeId || !userName || !rating) {
      alert("Please fill Cake ID, Name and Rating.");

      return;
    }

    if (Number(cakeId) <= 0) {
      alert("Please enter a valid Cake ID.");

      return;
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      alert("Rating must be between 1 and 5.");

      return;
    }

    const response = await fetchWithTimeout(`${BASE_URL}/ratings`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        cakeId: Number(cakeId),
        userName: userName,
        rating: Number(rating),
        review: review,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Rating submitted successfully.");

      await loadAverageRating();

      await loadRatings();

      document.getElementById("userName").value = "";

      document.getElementById("rating").value = "";

      document.getElementById("review").value = "";
    } else {
      alert(result.message || "Unable to submit rating.");
    }
  } catch (error) {
    console.error("Rating Error:", error);

    if (error.name === "AbortError") {
      alert("Rating Service is taking too long to respond.");
    } else {
      alert("Unable to submit rating.");
    }
  }
}

// Load Average Rating

async function loadAverageRating() {
  const button = document.querySelector(
    'button[onclick="loadAverageRating()"]',
  );

  const averageRating = document.getElementById("averageRating");

  try {
    const cakeId = document.getElementById("ratingCakeId").value.trim();

    // Validate Cake ID

    if (!cakeId) {
      alert("Please enter Cake ID.");

      return;
    }

    if (Number(cakeId) <= 0) {
      alert("Please enter a valid Cake ID.");

      return;
    }

    // Show clear loading feedback

    if (button) {
      button.disabled = true;

      button.textContent = "Loading...";
    }

    if (averageRating) {
      averageRating.innerHTML = "⭐ Loading average rating...";
    }

    const response = await fetchWithTimeout(
      `${BASE_URL}/ratings/${cakeId}/average`,
      {
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to load rating.");
    }

    // Safely read average rating

    const average =
      result.data && result.data.averageRating !== undefined
        ? result.data.averageRating
        : 0;

    // Display result clearly

    if (averageRating) {
      averageRating.innerHTML = `⭐ Average Rating : ${average}`;
    }

    // Refresh customer reviews

    await loadRatings();
  } catch (error) {
    console.error("Average Rating Error:", error);

    if (averageRating) {
      averageRating.innerHTML = "⚠️ Unable to load average rating.";
    }

    if (error.name === "AbortError") {
      alert("Rating Service is taking too long to respond.");
    } else {
      alert(error.message || "Unable to load average rating.");
    }
  } finally {
    // Restore button

    if (button) {
      button.disabled = false;

      button.textContent = "Average Rating";
    }
  }
}

// =====================================================
// Load Ratings and Reviews
// =====================================================

async function loadRatings() {
  try {
    const cakeId = document.getElementById("ratingCakeId").value;

    if (!cakeId) {
      return;
    }

    const response = await fetchWithTimeout(`${BASE_URL}/ratings/${cakeId}`);

    const result = await response.json();

    const container = document.getElementById("ratingList");

    container.innerHTML = "";

    if (!response.ok || !result.data || result.data.length === 0) {
      container.innerHTML = "<p>No ratings or reviews found.</p>";

      return;
    }

    result.data.forEach((rating) => {
      container.innerHTML += `

    <div class="rating-card">

      <div class="rating-card-header">

        <div>
          <h4>
            ${escapeHtml(rating.userName)}
          </h4>

          <div class="rating-stars">
            ⭐ ${rating.rating}/5
          </div>
        </div>

        <button
          class="rating-delete-button"
          onclick="deleteRating(${rating.id})"
          title="Delete review"
          aria-label="Delete review">
          🗑️
        </button>

      </div>

      <p class="rating-review">
        ${escapeHtml(rating.review || "No review provided.")}
      </p>

    </div>

  `;
    });
  } catch (error) {
    console.error("Load Ratings Error:", error);
  }
}
// =====================================================
// Delete Rating
// =====================================================

async function deleteRating(id) {
  const confirmed = confirm("Are you sure you want to delete this review?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/ratings/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Review deleted successfully.");

      await loadAverageRating();
      await loadRatings();
    } else {
      alert(result.message || "Unable to delete review.");
    }
  } catch (error) {
    console.error("Delete Rating Error:", error);

    if (error.name === "AbortError") {
      alert("Rating Service is taking too long to respond.");
    } else {
      alert("Unable to delete review.");
    }
  }
}
// Restore Selected Rating Cake

function restoreRatingCake() {
  const savedCakeId = localStorage.getItem("cakeRatingId");

  if (!savedCakeId) {
    return;
  }

  const cakeIdInput = document.getElementById("ratingCakeId");

  if (!cakeIdInput) {
    return;
  }

  cakeIdInput.value = savedCakeId;

  loadAverageRating();
}

// Load Notifications

async function loadNotifications() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/notifications`);

    const result = await response.json();

    const container = document.getElementById("notificationContainer");

    const notificationCount = document.getElementById("notificationCount");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    // Update notification count
    const count =
      result.data && Array.isArray(result.data) ? result.data.length : 0;

    if (notificationCount) {
      notificationCount.textContent = `${count} notification${count === 1 ? "" : "s"}`;
    }

    // Handle error
    if (!response.ok || !result.data) {
      container.innerHTML = `
                <div class="notification-empty">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Notifications unavailable
                    </h3>

                    <p>
                        Please try refreshing the notifications.
                    </p>

                </div>
            `;

      return;
    }

    // Empty notification state
    if (result.data.length === 0) {
      container.innerHTML = `
                <div class="notification-empty">

                    <div class="empty-icon">
                        🔔
                    </div>

                    <h3>
                        You're all caught up!
                    </h3>

                    <p>
                        No notifications to show right now.
                    </p>

                </div>
            `;

      return;
    }

    // Display notifications
    result.data.forEach((notification) => {
      const notificationCard = document.createElement("div");

      notificationCard.className = "notification-card";

      notificationCard.innerHTML = `

                <div class="notification-icon">
                    🔔
                </div>

                <div class="notification-content">

                    <div class="notification-header">

                        <div>

                            <span class="notification-title">
                                Order Confirmed
                            </span>

                            <h4>
                                ${escapeHtml(notification.customerName)}
                            </h4>

                        </div>

                        <button
                            class="notification-delete"
                            onclick="deleteNotification(${notification.id})"
                            title="Delete notification"
                            aria-label="Delete notification">
                            🗑️
                        </button>

                    </div>

                    <p class="notification-message">
                        ${escapeHtml(notification.message)}
                    </p>

                    <span class="notification-status">
                        ✓ Notification sent successfully
                    </span>

                </div>
            `;

      container.appendChild(notificationCard);
    });
  } catch (error) {
    console.error("Notifications Error:", error);

    const container = document.getElementById("notificationContainer");

    const notificationCount = document.getElementById("notificationCount");

    if (notificationCount) {
      notificationCount.textContent = "0 notifications";
    }

    if (container) {
      container.innerHTML = `
                <div class="notification-empty">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Notifications unavailable
                    </h3>

                    <p>
                        Please check whether the
                        Notification Service is running.
                    </p>

                </div>
            `;
    }
  }
}

// =====================================================
// Delete Notification
// =====================================================

async function deleteNotification(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this notification?",
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/notifications/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Notification deleted successfully.");
      await loadNotifications();
    } else {
      alert(result.message || "Unable to delete notification.");
    }
  } catch (error) {
    console.error("Delete Notification Error:", error);

    if (error.name === "AbortError") {
      alert("Notification Service is taking too long to respond.");
    } else {
      alert("Unable to delete notification.");
    }
  }
}
// Escape HTML
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}

// Backward-Compatible Helper
function escapeForHtml(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
