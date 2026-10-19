function notImplemented() {
  throw new Error('Корзина ещё не реализована. Сначала прочитайте тесты.');
}

function createProductWithQuantity(product, quantity) {
  return {
    ...product,
    quantity,
  };
}

function createProductFinder(productId) {
  return function findProductById(cartProduct) {
    return cartProduct.id === productId;
  };
}

function createQuantityUpdater(productId, quantity) {
  return function updateProductQuantity(cartProduct) {
    if (cartProduct.id === productId) {
      return createProductWithQuantity(cartProduct, quantity);
    }

    return cartProduct;
  };
}

function createQuantityIncreaser(productId, quantity) {
  return function increaseProductQuantity(cartProduct) {
    if (cartProduct.id === productId) {
      const updatedQuantity = cartProduct.quantity + quantity;

      return createProductWithQuantity(cartProduct, updatedQuantity);
    }

    return cartProduct;
  };
}

function addToCart(cart, product, quantity) {
  if (quantity <= 0 || quantity > product.stock) {
    throw new RangeError('Количество товара вне допустимого диапазона');
  }

  const findProduct = createProductFinder(product.id);
  const existingProduct = cart.find(findProduct);

  if (existingProduct) {
    const updateProduct = createQuantityIncreaser(product.id, quantity);

    return cart.map(updateProduct);
  }

  const productInCart = createProductWithQuantity(product, quantity);
  const updatedCart = [...cart, productInCart];

  return updatedCart;
}

function changeQuantity(cart, productId, quantity) {
  const findProduct = createProductFinder(productId);
  const existingProduct = cart.find(findProduct);

  if (existingProduct && (quantity <= 0 || quantity > existingProduct.stock)) {
    throw new RangeError('Количество товара вне допустимого диапазона');
  }

  const updateCartProduct = createQuantityUpdater(productId, quantity);

  return cart.map(updateCartProduct);
}

function createProductRemover(productId) {
  return function keepOtherProduct(cartProduct) {
    return cartProduct.id !== productId;
  };
}

function removeFromCart(cart, productId) {
  const filterCallback = createProductRemover(productId);
  const updatedCart = cart.filter(filterCallback);

  return updatedCart;
}

function addCartProductPrice(subtotal, cartProduct) {
  return subtotal + cartProduct.price * cartProduct.quantity;
}

function calculateCartSubtotal(cart) {
  const subtotal = cart.reduce(addCartProductPrice, 0);

  return subtotal;
}

function createOrderTotal(subtotal, discount, delivery) {
  return {
    subtotal,
    discount,
    delivery,
    total: subtotal - discount + delivery,
  };
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);
  const discount = promoCode === 'SAVE10' && subtotal >= 20000
    ? subtotal * 0.1
    : 0;
  const delivery = subtotal >= 50000 ? 0 : 30000;
  const orderTotal = createOrderTotal(subtotal, discount, delivery);

  return orderTotal;
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
