function getRequest(){

const fetchPromise = fetch("https://jwdp5.herokuapp.com/api/cameras");
const inputJS = document.getElementById("produits");

fetchPromise.then(response => {//la promesse
  return response.json(); // le résultat sous format json
})
.then((data => {
  data.forEach((item)  => { //pour chaque item récupéré de l'API, on crée une constante name, price_id etc..
    const { name, price, _id, description, imageUrl } = item;
            //affiche ces informations sur HTML
            inputJS.innerHTML +=`
            <div class="container col-md-6 col-lg-4">
               <div class="affichage_produit mt-4 card bg-white">
                  <img class=”card-img-top” src="`+ imageUrl + `"  alt="appareil `+ name +`">
                  <div class="card-body text-center">
                     <h3 class="card-title">`+ name +`</h3>
                     <span>`+ price/100 +`€</span></p>
                     <div class="text-center mt-4" ><a id="bouton" type="button" class="btn btn-secondary text-white" onclick="window.location.href = 'products.html?id=${_id}'">En savoir plus</a></div>
                  </div>
               </div>
            </div>`
   })
}))

}
getRequest();
cartNumber();

