let cart = [];

function atualizarCarrinho() {
  const lista = document.getElementById('cart-list');
  const totalEl = document.getElementById('total-value');
  const checkoutTotal = document.getElementById('total-checkout');
  const totalFinal = document.getElementById('total-final');

  lista.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += parseFloat(item.price);
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerText = `${item.name} - R$ ${item.price}`;
    lista.appendChild(li);
  });

  totalEl.innerText = total.toFixed(2);
  checkoutTotal.innerText = total.toFixed(2);
  totalFinal.innerText = (total + 10).toFixed(2); // + frete
}

function adicionarAoCarrinho(product) {
  cart.push(product);
  atualizarCarrinho();
  const modalCarrinho = new bootstrap.Modal(document.getElementById('modalCarrinho'));
  modalCarrinho.show();
}

function showDetails(productId) {
  fetch('dados.json')
    .then(res => res.json())
    .then(data => {
      const product = data.find(p => p.id === productId);
      const modalBody = document.getElementById('modalDetalhesBody');
      modalBody.innerHTML = `
        <img src="${product.image}" class="img-fluid mb-2">
        <h5>${product.name}</h5>
        <p>${product.description}</p>
        <p><strong>Preço:</strong> R$ ${product.price}</p>
        <button class="btn btn-dark w-100" data-bs-dismiss="modal" onclick='adicionarAoCarrinho(${JSON.stringify(product)})'>Comprar</button>
      `;
    });
}

fetch('dados.json')
  .then(response => response.json())
  .then(data => {
    const productList = document.getElementById('product-list');
    data.forEach(product => {
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-md-4 col-lg-3';
      col.innerHTML = `
        <div class="card p-3 h-100 d-flex flex-column">
          <img src="${product.image}" class="card-img-top" style="height: 300px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">R$ ${product.price}</p>
            <button class="btn btn-outline-dark w-100 mt-auto" data-bs-toggle="modal" data-bs-target="#modalDetalhes" onclick="showDetails('${product.id}')">Ver detalhes</button>
          </div>
        </div>
      `;
      productList.appendChild(col);
    });
  });

document.getElementById('cep').addEventListener('blur', () => {
  const cep = document.getElementById('cep').value.replace(/\D/g, '');
  if (cep.length !== 8) {
    alert('CEP inválido.');
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }

      document.getElementById('endereco').value = data.logradouro || '';
      document.getElementById('cidade').value = data.localidade || '';
      document.getElementById('estado').value = data.uf || '';
    })
    .catch(() => alert('Erro ao buscar o CEP.'));
});

document.querySelector('#modalCheckout .btn-success').addEventListener('click', () => {
  const dados = {
    cep: document.getElementById('cep').value,
    numero: document.getElementById('numero').value,
    complemento: document.getElementById('complemento').value,
    endereco: document.getElementById('endereco').value,
    cidade: document.getElementById('cidade').value,
    estado: document.getElementById('estado').value,
    cartao: document.getElementById('cartao').value,
    validade: document.getElementById('validade').value,
    cvv: document.getElementById('cvv').value,
    produtos: cart,
    total: parseFloat(document.getElementById('total-final').innerText)
  };

  console.log('Dados do cliente:', JSON.stringify(dados));
  alert('Pagamento processado.');
});