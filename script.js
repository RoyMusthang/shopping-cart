const carrinho = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const addStorage = () => {
  localStorage.setItem('cart', carrinho.innerHTML);
};

const getStorage = () => {
  if (!carrinho.innerHTML) {
    carrinho.innerHTML = localStorage.getItem('cart');
  }
};

function cartItemClickListener(event) {
  event.target.remove();
  addStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  carrinho.appendChild(li);
  return li;
}

const getItemPromise = async (id) => {
  try {
    const itemUrl = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await itemUrl.json();
    createCartItemElement(data);
    addStorage();
  } catch (error) {
    alert(error);
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    getItemPromise(event.target.parentElement.firstElementChild.innerText);
  });
  return section;
}

const clearCart = () => {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    const list = document.querySelectorAll('.cart__item');
    list.forEach((item) => item.parentNode.removeChild(item));
    addStorage();
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addItems = (items) => {
  items.forEach((item) => {
    const itemHTML = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemHTML);
  });
};

const getProductPromise = async (product) => {
  try {
  const promise = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
  const data = await promise.json();
  const result = data.results;
  addItems(result);
  console.log(result);
} catch (erro) {
  console.log(erro);
}
};

const fetchProductPromise = async () => {
  try {
    await getProductPromise('computador');
  } catch (error) {
  console.log(error);
  }
};

carrinho.addEventListener('click', cartItemClickListener);

window.onload = () => {
  fetchProductPromise();
  getStorage();
  clearCart();
};