//function pour afficher le nombre de produits panier dans le menu nav
function cartNumber() {
    const panier = JSON.parse(localStorage.getItem("panier"));//on recupere le localstorage de Panier
  
    if (panier) {
      let inCart = 0;//le panier par de zero
      panier.forEach(() => {
        inCart = inCart + 1;//ajoute 1 element on clicent sur panier
      });
      localStorage.setItem("inCart", inCart);
      document.getElementById("cart_number").textContent = inCart;
    }
  }
 