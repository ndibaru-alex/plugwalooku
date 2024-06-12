// contentful

var client = contentful.createClient({
  space: 'hi9vv1vkgku9',
  accessToken: 'nzZ2gRLHqE7XNxYFSRc7tK3wRVsvfGF1Xz6JFribIvc',
});

// declaring varables 

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn= document.querySelector('.close-cart');
const clearCartBtn= document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverley= document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotals = document.querySelector('.cart-total');
const cartContent= document.querySelector('.cart-content');
const productsDOM= document.querySelector('.products-center');



// cart 
let cart = [];

// cart buttons
let buttonDOM =[];




//cart divs

let cartDivs = [];


class Products {

    async getProducts(){
        try{
            
            let contentful = await client.getEntries(
             {
                content_type:'plugwalooku'
             }   
            );

            let products= contentful.items;
            
            products= products.map(item =>{
                const {title,price} =item.fields;
                const{id} = item.sys;
                const image =item.fields.image.fields.file.url;

                return {title,price,id,image};

            })
            return products;
           
        }
        catch(error){
            console.log(error);

        }
    }
}

class UI{

    displayProducts(products){

        let result = "";


        products.forEach( product =>{
            result+=`
             <article class="product">
          <div class="img-container btn-div">
            <img class="product-img" src=${product.image} alt="product" />
            <button class="bag-btn bbtn" data-id=${product.id}>
              <i class="fas fa-shopping-cart">add to bag</i>
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4><span>Ksh</span>${product.price}</h4>
        </article>
            
            `
        })

        productsDOM.innerHTML=result        
    }


    getBagButtons(){
        const buttons= [...document.querySelectorAll(".bag-btn")];
        buttonDOM =buttons;

        buttons.forEach( button =>{
            let id= button.dataset.id;

            let inCart = cart.find(item => item.id === id);
            if(inCart ){

                //  cart=Storage.getCart();
                
                // this.addMinus(id) 
                 button.innerText= "inCart";
                button.disabled= true;

 
            }
           
            button.addEventListener('click', (event)=>{
               if(event.target.classList.contains('bag-btn')){

                event.target.innerText='InCart';

                event.target.disabled =true;

             
              

              //get products from products

              let cartItem ={...Storage.getProduct(id),amount:1};
              
              //add to cart array
              cart =[...cart,cartItem];
              
              //save cart in local storage

              Storage.saveCart(cart);

              //set up cart values

              this.setCartValues(cart);

              //add cart item

              this.addCartItem(cartItem);

             
               }

        //        else if(event.target.classList.contains('fa-plus')){
        //         let addAmount= event.target;
        //         let id = addAmount.dataset.id;

        //   let tempItem = cart.find(item => item.id===id);
        //   tempItem.amount=tempItem.amount + 1;
        //   Storage.saveCart(cart);
        //   this.setCartValues(cart);
        //   addAmount.nextElementSibling.innerText=tempItem.amount;

        //        }
             

               

              
             
            })
        });
    }

    inCartDom(){
        
        let result ="";

       
        
        cart.forEach(item =>{

            result= ` <i class="fas fa-plus" data-id=${item.id}  ></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-minus" data-id=${item.id}></i>`
        });

        

        return result;

        



    

    }

    


    setCartValues(cart){
        let tempTotal=0;
        let itemsTotal=0;

        cart.map(item =>{
            tempTotal+=item.price * item.amount;
            itemsTotal+=item.amount;
        })

        cartTotals.innerHTML = parseFloat(tempTotal.toFixed(2));
        cartItems.innerHTML = itemsTotal;

    }

    addCartItem(item){
        const div= document.createElement('div');
        div.classList.add('cart-item');

        div.innerHTML=`
         <img src=${item.image} alt="" />

            <div>
              <h4>${item.title}</h4>
              <h5>${item.price}</h5>
              <span class="remove-item delete" data-id=${item.id} >remove</span>
            </div>
            <div>
              <i class="fas fa-plus" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-minus" data-id=${item.id}></i>
            </div>
        `

        cartContent.append(div);
    }

     showCart(){
      cartOverley.classList.add('transparetBcg');
      cartDOM.classList.add('showcart');
      
    }


    setUpApp(){
      cart = Storage.getCart();
      this.setCartValues(cart);
      this.populataCart(cart);      
      cartBtn.addEventListener('click', this.showCart);
      closeCartBtn.addEventListener('click', this.hideCart);



    }

    populataCart(cart){
         cart=Storage.getCart();
        cart.forEach(item => this.addCartItem(item));
    }

    hideCart(){
        cartOverley.classList.remove("transparetBcg");
        cartDOM.classList.remove("showcart");
    }

   
    cartLogic(){

        clearCartBtn.addEventListener('click', ()=>{
            this.clearCart();
        });

        cartContent.addEventListener('click', event=>{
            if(event.target.classList.contains('remove-item')){
               
                let removeItem =event.target;
                let id = removeItem.dataset.id;

                cartContent.removeChild(removeItem.parentElement.parentElement)

                this.removeId(id);                

            }
            else if(event.target.classList.contains("fa-plus")){
                let addAmount = event.target;
                let id =addAmount.dataset.id;

                let tempItem = cart.find(item => item.id===id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText=tempItem.amount;

            }

            else if(event.target.classList.contains("fa-minus")){

                let reduceAmount = event.target;

                let id = reduceAmount.dataset.id;

                let tempItem = cart.find(item => item.id === id);
                tempItem.amount= tempItem.amount -1 ;

                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    reduceAmount.previousElementSibling.innerText=tempItem.amount;

                }
                else{
                    cartContent.removeChild(reduceAmount.parentElement.parentElement);
                    this.removeId(id);
                }

                

            }
        })

}


    clearCart(){

        let cartItems = cart.map(item => item.id);

        cartItems.forEach(id=> this.removeId(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
        
   
    }

    removeId(id){

        cart= cart.filter(item => item.id !==id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button= this.getSingleButton(id);
        button.disabled=false;
        button.innerHTML=`<i class="fas fa-shopping-cart">add to cart</i>`


    }
     
    getSingleButton(id){
        return buttonDOM.find(button =>button.dataset.id === id);
    }



}

class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));

        return products.find(product => product.id === id);
    }

    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }


    static getCart(){
      return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}


document.addEventListener("DOMContentLoaded", ()=>{

    const ui= new UI();
    const products = new Products();

    //set up app

    ui.setUpApp();
   

    
    products.getProducts().then(products =>{
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then( () =>{
        ui.getBagButtons();
        ui.cartLogic();
    }
    )
})

