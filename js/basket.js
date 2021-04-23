const panier = JSON.parse(localStorage.getItem("panier"));

//Condition pour afficher le panier
if (panier) {
    ligneTableau();
  } else {
    tableauVide();
  }
