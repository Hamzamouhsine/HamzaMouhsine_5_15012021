const panier = JSON.parse(localStorage.getItem("panier"));//recuperation des donnes stockées dans le local storage

//Condition pour afficher le panier
if (panier) {
    ligneTableau();//s'il y a un produit, afficher cette funtion
  } else {
    tableauVide();// sinon, afficher la funtion sans panier ne formulaire
  }
  //Boucle pour importer données de chaque article panier
function ligneTableau() {
  panier.forEach(function(result, index) {infosHTML(result, index);});
  totalPanier();
  cartNumber();
}
//function Ajout html pour chaque produit importé dans le panier
function infosHTML(result, index) {
  document.getElementById("ajout_panier").innerHTML += `
    <tbody id="products-tablebody">
      <tr id="ligne_tableau">
        <td class="text-center"><img src="`+result.image+`" class= "w-50" alt="appareil `+result.name+`"> <br/> `+result.name+`<br/> Objectif : `+result.lenses+`</td>
        <td class="text-center">
          <button disabled="disabled" onclick="quantiteMoins(`+index+`)" id="bouton_moins`+index+`" class="btn btn-secondary btn-sm">-</button>
          <span id="quantite_nombre`+index+`" class="quantite_produit">`+result.quantite+`</span>
          <button onclick="quantitePlus(`+index+`)" id="bouton_plus`+index+`" class="btn btn-secondary btn-sm">+</button>
        </td>
        <td id="prix_unite`+index+`" class="text-center">`+result.price + " €"+`</td>
        <td id="sous_total`+index+`"class="subtotal text-center">`+result.subTotal + " €"+`</td>
        <td class="text-center"><i id="supp_produit" onclick="annulerArticle()" type="button" class="fas fa-trash-alt" title="Supprimer le produit du panier"></i></td>
      </tr>
    </tbody>`;
}
//function pour calcul et affichage du prix total panier
function totalPanier() {
  let total = 0;
  panier.forEach(function(result, index) {
    total = total + panier[index].price * panier[index].quantite;
    console.log(total);
  });
  document.getElementById("prix_total").textContent = total+"€";
  localStorage.setItem("totalPanier", total);
}
//function pour ne pas faire apparaitre le panier et le formulaire quand il est vide et affichage message
function tableauVide() {
  document.getElementById("panier_vide").innerHTML += `
    <div class="container col-6 text-center border shadow bg-white rounded py-5 my-5">
      <h3 class="mb-4">Votre panier est vide</h3>
      <i class="fas fa-shopping-cart fa-3x"></i>
    </div>`
  ;
  document.getElementById("tableau_panier").style.display = "none";
  document.getElementById("vider_panier").style.display = "none";
  document.getElementById("formulaire").style.display = "none";
  document.getElementById("valid_commande").style.display = "none";
}
//function pour vider le panier et le localStorage
function viderPanier() {
  localStorage.clear();// on le retire du localstorage
  location.reload();//Mise à jour de la page pour affichage de la suppression au client
}
//function pour retirer article du panier -
function annulerArticle(i) {
  panier.splice(i, 1);// on supprime un item du panier avec la methode splice
  localStorage.clear(); // on le retire du localstorage
  // Mise à jour du nouveau panier après suppression de l'article
  localStorage.setItem("panier", JSON.stringify(panier));
  //Mise à jour de la page pour affichage de la suppression au client
  window.location.reload();
}
//function pour ajouter quantite dans le panier +
function quantitePlus(index) {
  let quantite = document.getElementById(`quantite_nombre`+index+``);
  let ajoutQuantite = ++panier[index].quantite; //on ajoute la quantité tapé dans le localstorage
  quantite.textContent = ajoutQuantite; //on met à jour la quantité dans le tableau
  let sousTotal = document.getElementById(`sous_total`+index+``);
  let ajoutTotal = panier[index].price * panier[index].quantite;
  sousTotal.textContent = ``+ajoutTotal+`€`; //on met à jour le sous-total dans le tableau
  localStorage.setItem("panier", JSON.stringify(panier)); // on met à jour le localstorage
  totalPanier(); //on met à jour le total panier
  if (ajoutQuantite > 1) {
    document.getElementById(`bouton_moins`+index+``).removeAttribute("disabled");
  }
}

//function pour retirer quantite dans le panier -
function quantiteMoins(index) {
  let quantite = document.getElementById(`quantite_nombre`+index+``);
  let retraitQuantite = --panier[index].quantite; //on décrémente la quantité dans le localstorage
  quantite.textContent = retraitQuantite; //on met à jour la quantité dans le tableau
  let sousTotal = document.getElementById(`sous_total`+index+``);
  let ajoutTotal = panier[index].price * panier[index].quantite;
  sousTotal.textContent = ``+ajoutTotal+`€`; //on met à jour le sous-total dans le tableau
  localStorage.setItem("panier", JSON.stringify(panier)); // on met à jour le localstorage
  totalPanier(); //on met à jour le total panier
  if (retraitQuantite <= 1) {
    document.getElementById(`bouton_moins`+index+``).setAttribute("disabled", "disabled");
  }
}

// FORMULAIRE + REQUETE POST

//Evenement pour vérifier le champ mail en enlevant le focus
document.querySelector("#mail").addEventListener("blur", function() {
  const mail = document.querySelector("#mail").value;
  const regexEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; //Utilisation de regex pour valider le champ de saisie
  if (!regexEmail.test(mail)) {
    document.querySelector("#erreur_mail").textContent =
      "Adresse email non valide";
  }
});


//Evenement pour effacer le formulaire
  document.querySelector("#rafraichir").addEventListener("click", function() {
  document.querySelector("#erreur_mail").textContent = "";
  document.querySelector("#erreur_code").textContent = "";
});

//Evenement pour valider le formulaire et envoyer la requete POST
document.querySelector("#formulaire").addEventListener("submit", function(event){
  event.preventDefault();
  let input = document.getElementsByTagName("input");

  for (let i = 0; i < input.length; i++) { //boucle pour vérifier si chaque champ a été renseigné
    if (input[i].value == "") { //si un des champs est vide, envoi d'un message erreur 
      alert("Oups!","Formulaire non valide ! Merci de renseigner correctement le formulaire","warning")
      return false;
    }
  }
  requestPost()
  confirmCommand()
  localStorage.clear()
  totalPanier()
});

//function pour créer la requete POST avec numero commande et les infos contacts
function requestPost() {
  const idTableau = panier.map(function (product) {return product.id;});
  let order = {
    contact: {
      firstName: document.querySelector("#firstname").value.trim(),
      lastName: document.querySelector("#name").value.trim(),
      address: document.querySelector("#adress").value.trim(),
      city: document.querySelector("#city").value.trim(),
      email: document.querySelector("#mail").value.trim(),
    },
    products: idTableau,
  };
  console.log(order);
  console.log("commende valid");

  const request = new Request( // On crée notre requête POST vers API en lui passant en paramétres les données a envoyer
    "https://jwdp5.herokuapp.com/api/cameras/order",
    {
      method: "POST",
      body: JSON.stringify(order),
      headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      }),
    }
  );

  fetch(request)
    .then((response) => response.json())
    .then((response) => { //on récupère la réponse de l'API pour obtenir numéro de commande
      let numCommand = response.orderId;
      //console.log(numCommand)
      localStorage.setItem("idCommand", JSON.stringify(numCommand)); // on met à jour le localstorage avec numero de commande
      localStorage.setItem("infosOrder",JSON.stringify(order)); // on met à jour le localstorage avec infos de commande
    });
}
//FUNCTION POUR ALERT (CONFIRMATION DE COMMANDE)
function confirmCommand() {
  sweetAlert("Votre commande a bien été validée, vous allez être redirigé", "", "success");
  setTimeout(function() {window.location = 'confirmation.html'; }, 3000);
}
