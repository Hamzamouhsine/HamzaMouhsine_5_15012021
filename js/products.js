//Appel URL + API + fonctions pour afficher le produit
function ajoutContent () {
    let id = new URL(window.location).searchParams.get('id')// on donne la valeur id = id de l'api
    fetch("https://jwdp5.herokuapp.com/api/cameras/"+id)
      .then(response => response.json())
      .then (data => {
        
          article = data
          ajoutHTML()
          ajoutLenses()
          console.log(article);        
      })
  }
  
  //Ajout lentilles pour chaque item renseignée dans l'API
  //A chaque exécution de la boucle, la variable est icrémentée du un (i ++), elle se termine quand il n'a plus d'objets 
  // ajout option dans le html
  function ajoutLenses() {
    for (let i = 0; i < article.lenses.length; i++) {
    document.getElementById("lense_select").innerHTML += `<option value="`+ article.lenses[i] +`">`+ article.lenses[i] +`</option>`
    }
  }
  // Présentation produit HTML
  function ajoutHTML() {
    document.getElementById('focus_produit').innerHTML += 
    `
      <div class="affichage_produit">
        <img class=”image_produit style="width: 90%" src="`+article.imageUrl+`"  alt="appareil `+article.imageUrl+`">
        <h3 class="mt-4">`+article.name+`</h3>
        <p class="description_produit">`+article.description+`</p>
        <p class="prix_produit mt-4 ml-4"><span>`+article.price/100+`€</span></p>
      </div>
    `
  }
  //Ajout produit au panier
function ajoutPanier() {
    let lentilles = document.querySelector('select').value; //Récupère la valeur de l'objectif choisi depuis la balise select
    if (lentilles == "") { //si aucune lentille choisie, affichage message erreur
      alert("Vous devez choisir un objectif");
    } else {
        const panier = JSON.parse(localStorage.getItem("panier")) || [] //On extrait notre json 
        panier.push({ //pour chaque article, on pousse les infos suivantes dans le panier
          image : article.imageUrl,
          name : article.name,
          id :article._id,
          lenses: lense_select.value,
          description : article.description,
          price : article.price/100,
          quantite : 1,
          subTotal : article.price/100*1
        })
        window.localStorage.setItem("panier", JSON.stringify(panier))// stocke les données, convertit la valeur js en chaine json
        //console.log(panier)
        console.log("Le produit a été ajouté au panier");
        popUpPanier()
       
      }
}
//Affichage d'un alert pour confirmer l'ajout au panier
function popUpPanier (){
  if (confirm("Vous avez ajouté un article au panier") == true) {
    usePreference = "Prêts pour de nouveaux clichés ?";
  } else {
    usePreference = "vous n'avez rien ajouté au panier";
  } 
}

ajoutContent();
cartNumber();
