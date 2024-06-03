//const { JSON } = require("sequelize");

function setCarritoVacio() {
    cartRows.innerHTML = cartRows.innerHTML = `
    <tr>     
        <td colspan="5"><div class="alert alert-warning my-2 text-center">No tienes products en el carrito</div></td>
    </tr>            
    `;
}

function vaciarCarrito() {
    localStorage.removeItem("carrito")
}

function calcularTotal(products) {
    return products.reduce(
        (acum, product) => (acum += product.cost * product.quantity),
        0
    );
}

function updateSubtotal() {
    const subtotalElement = document.querySelector('.totalSubAmount');
    subtotalElement.textContent = `$ ${calcularTotal(products).toFixed(2)}`;
}

let cartRows = document.querySelector('.cartRows')

let products = [];

if (localStorage.carrito) {
    let carrito = JSON.parse(localStorage.carrito)
    console.log(carrito);
    carrito.forEach((item, index) => {
        fetch(`/api/detalle/${item.id}`)
            .then(res => res.json())
            .then(product => {
                if (product) {
                    cartRows.innerHTML +=
                        `
                <tr id="row${index}">
                    <th scope="row">${index + 1}</th>
                    <td>${product.title}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td>$ ${product.cost}</td>
                    <td class="text-center">$ ${parseFloat(
                            product.cost * item.quantity,
                            2
                        ).toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick=removeItem(${index})><i class="fas fa-trash"></i></button></td>
                </tr>            
                `;
                    products.push({
                        productId: product.id,
                        title: product.title,
                        quantity: item.quantity,
                        cost: product.cost,
                        subtotal: item.quantity * product.cost,
                        
                    })
                } else {
                    //si no esta el producto en bd lo borro en localStorage
                    carrito.splice(index, 1)
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                }

            }).then(() => {
                updateSubtotal();
            })
            .then(() => {
                document.querySelector('.totalAmount').innerText = `$ ${calcularTotal(products)}`
            })
    })
}

let checkoutCart = document.querySelector('#checkoutCart')

checkoutCart.onsubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const formData = {
        detallePedidos: products,
        date_sale: currentDate,
        total: calcularTotal(products),
    }

    fetch('/api/checkout', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
        .then(r => r.json())
        .then((res) => {
            if (res.ok) {
                vaciarCarrito()
                location.href =`/productos/pedido/${res.order.id}`
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

