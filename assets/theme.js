/* Antoinette Atelier — cart drawer + quick add (Shopify AJAX cart API) */
(function () {
  "use strict";

  var drawer = document.querySelector("[data-cart-drawer]");
  var overlay = document.querySelector("[data-cart-overlay]");

  function openCart() { document.body.classList.add("cart-open"); }
  function closeCart() { document.body.classList.remove("cart-open"); }

  document.addEventListener("click", function (event) {
    var opener = event.target.closest("[data-cart-open]");
    if (opener) { event.preventDefault(); openCart(); return; }
    if (event.target.closest("[data-cart-close]") || event.target === overlay) {
      closeCart();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeCart();
  });

  function money(cents) {
    var formatted = (cents / 100).toFixed(2);
    return (window.Shopify && Shopify.currency && Shopify.currency.active === "EUR"
      ? "€" + formatted
      : "$" + formatted);
  }

  function renderCart(cart) {
    if (!drawer) return;
    var itemsWrap = drawer.querySelector("[data-cart-items]");
    var subtotalEl = drawer.querySelector("[data-cart-subtotal]");
    var bubbles = document.querySelectorAll("[data-cart-count]");

    bubbles.forEach(function (b) {
      b.textContent = cart.item_count;
      b.style.display = cart.item_count > 0 ? "" : "none";
    });

    if (!itemsWrap) return;

    if (!cart.items.length) {
      itemsWrap.innerHTML =
        '<div class="cart-drawer__empty"><h3>Your cart is empty</h3><p>Discover original artworks and prints in the collection.</p></div>';
    } else {
      itemsWrap.innerHTML = cart.items
        .map(function (item) {
          var img = item.image
            ? '<img class="cart-line__image" src="' + item.image + '&width=152" alt="">'
            : '<div class="cart-line__image"></div>';
          return (
            '<div class="cart-line" data-line-key="' + item.key + '">' +
            img +
            '<div>' +
            '<p class="cart-line__title">' + item.product_title + "</p>" +
            (item.variant_title && item.variant_title !== "Default Title"
              ? '<p class="cart-line__variant">' + item.variant_title + "</p>"
              : "") +
            '<div class="cart-line__qty">' +
            '<button type="button" data-qty-change="-1" aria-label="Decrease">−</button>' +
            "<span>" + item.quantity + "</span>" +
            '<button type="button" data-qty-change="1" aria-label="Increase">+</button>' +
            "</div>" +
            '<button type="button" class="cart-line__remove" data-remove>Remove</button>' +
            "</div>" +
            '<div class="cart-line__price">' + money(item.final_line_price) + "</div>" +
            "</div>"
          );
        })
        .join("");
    }

    if (subtotalEl) subtotalEl.textContent = money(cart.total_price);
  }

  function refreshCart() {
    return fetch("/cart.js")
      .then(function (r) { return r.json(); })
      .then(renderCart);
  }

  function changeLine(key, quantity) {
    return fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: key, quantity: quantity }),
    })
      .then(function (r) { return r.json(); })
      .then(renderCart);
  }

  if (drawer) {
    drawer.addEventListener("click", function (event) {
      var line = event.target.closest("[data-line-key]");
      if (!line) return;
      var key = line.getAttribute("data-line-key");
      var qtyEl = line.querySelector(".cart-line__qty span");
      var qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;

      if (event.target.closest("[data-remove]")) {
        changeLine(key, 0);
      } else if (event.target.closest("[data-qty-change]")) {
        var delta = parseInt(event.target.closest("[data-qty-change]").getAttribute("data-qty-change"), 10);
        changeLine(key, Math.max(0, qty + delta));
      }
    });
  }

  /* Quick add + product form AJAX submit */
  document.addEventListener("submit", function (event) {
    var form = event.target.closest("[data-ajax-add]");
    if (!form) return;
    event.preventDefault();
    var button = form.querySelector("[type=submit]");
    if (button) button.disabled = true;
    var data = new FormData(form);
    fetch("/cart/add.js", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (e) { throw e; });
        return r.json();
      })
      .then(function () { return refreshCart(); })
      .then(openCart)
      .catch(function () { form.submit(); })
      .finally(function () { if (button) button.disabled = false; });
  });

  document.addEventListener("click", function (event) {
    var quickAdd = event.target.closest("[data-quick-add]");
    if (!quickAdd) return;
    event.preventDefault();
    var variantId = quickAdd.getAttribute("data-quick-add");
    if (!variantId || quickAdd.disabled) return;
    quickAdd.disabled = true;
    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] }),
    })
      .then(function (r) { if (!r.ok) throw new Error("add failed"); return r.json(); })
      .then(function () { return refreshCart(); })
      .then(openCart)
      .catch(function () {})
      .finally(function () { quickAdd.disabled = false; });
  });

  /* Keep drawer in sync on page load */
  if (drawer) refreshCart();
})();

/* Product page: variant price + gallery thumbnails */
(function () {
  document.addEventListener("change", function (e) {
    var sel = e.target.closest("[data-variant-select]"); if (!sel) return;
    var opt = sel.options[sel.selectedIndex], form = sel.closest("form");
    var price = document.querySelector("[data-price]"); if (price) price.textContent = opt.getAttribute("data-price");
    var btn = form && form.querySelector("[type=submit][data-add]");
    if (btn) { var ok = opt.getAttribute("data-available") === "true"; btn.disabled = !ok; btn.textContent = ok ? btn.getAttribute("data-add") : btn.getAttribute("data-sold"); }
    var u = new URL(location.href); u.searchParams.set("variant", sel.value); history.replaceState(null, "", u);
  });
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".product-main__thumbs img"); if (!t) return;
    var main = document.querySelector("[data-main-image] img"); if (main && t.dataset.full) { main.src = t.dataset.full; main.removeAttribute("srcset"); }
    t.parentNode.querySelectorAll("img").forEach(function (i) { i.classList.toggle("is-active", i === t); });
  });
})();
