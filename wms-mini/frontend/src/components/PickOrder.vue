<template>
    <div>
         <div class="container">
                
                <div class="row">
                    <div class="col-md-12">
                        <h3>Enter order number</h3>
                        <form @submit.prevent="onSubmit">
                            <div class="form-group">
                                <input type="text" required class="form-control" placeholder="Scan order number" v-model="order.number" v-on:keyup.stop.prevent.self.enter="setFocus('add')">
                            </div>
                            <!-- <div class="form-group">
                                <label for="">Invoice price:</label><span>${{ invoice.total_price }}</span>
                            </div> -->
                        </form>
                    </div>
                </div>
          
        </div>
        <hr/>
        <h3> Articles </h3>
        <div class="form-group">
            <label for="">Add Article:</label>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#transactionModal" id="add">
                +
            </button>
            <!-- Modal -->
                <div class="modal fade" id="transactionModal" role="dialog">
                    <div class="modal-dialog modal-sm">
                    
                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Scan product code</h5>
                        <button type="button" class="close" data-dismiss="modal"> &times;</button>
                        </div>

                        <div class="modal-body">
                        <div class="form-group">
                            <label for="">Article number:</label>
                            <input type="text" id="txn_article_modal" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="">Serial</label>
                            <input type="numeric" id="txn_serial_modal" class="form-control">
                        </div>
                    </div>

                        <div class="modal-footer">
                        <div class="form-group">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Discard transaction</button>
                            <button type="button" class="btn btn-primary" @click="saveTransaction()">Save transaction</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                    </div>
                    
                    </div>
                </div>
            
           
            <div class="col-md-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Article number</th>
                            <th scope="col">Article name</th>
                            <th scope="col">Serial</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="txn in articles">
                            <tr :key="txn.id">
                                <th>{{ txn.id }}</th>
                                <th>{{ txn.number }}</th>
                                <th>{{ txn.name }}</th>
                                <th>{{ txn.serial }}</th>
                                <td><button type="button" class="btn btn-danger" @click="deleteTransaction(txn.id)">X</button></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" @click.prevent="onSubmit">Create order</button>
                {{ loading }}
                {{ status }}
            </div>
        </div>
    
    </div>
</template>


<script>
import axios from 'axios';
import {mapActions} from 'vuex';

export default {
    name: 'PickOrder',
    // props: {
    //     user: {
    //         type: Object,

    //     }
    // },
    data(){
        return {
            order: {
            number: "12345",
            user: JSON.parse(localStorage.getItem('user')).payload['user'].name
        },
        articles: [
        {
                id: 1,
                number: 11111, 
                name: 'Roasted hazelnut',
                serial: 'RS1123444'},
        
        ],
        nextTxnId: 2,
        loading:'',
        status:'',
        }
        
    },
    computed: {
        api_address(){
            return this.$store.getters.api_address
        },
        
    },
    methods: {
        ...mapActions(['fetchAllArticles']),
        setFocus(arg){
            console.log("Running setFocus..", arg)
            let addButton = document.getElementById("add");
            if (arg==='add'){
                addButton.focus();
            }
        },
        saveTransaction(){
            //Check if product code is scanned
            //append data to the arrays
            let article = document.getElementById("txn_article_modal").value;
            let serial = document.getElementById("txn_serial_modal").value;

            console.log(article, serial)
            
            // get the article name as a proof that article exists in sql
            let art = Object.values(this.$store.state.articles).find(x => x.artikelnr===article)
           // var foo = art.find(x => x.artikelnr===article)
            console.log('art:',art.artikelbenämning)

            // add article object to articles array
            if (article.length != 0 && serial > 0){
                
                this.articles.push({
                    
                    id: this.nextTxnId,
                    number: article,
                    serial: serial,
                    name: art.artikelbenämning
                })
                
                this.nextTxnId++
                //this.calcTotal();
                //Empty user input 
                document.getElementById("txn_article_modal").value="";
                document.getElementById("txn_serial_modal").value ="";
            } 
        },
        deleteTransaction(){
            //create a new array without the passed item 
            let newList = this.articles.filter((el)=>{
               return el.id !== this.id;     
            })
            this.nextTxnId--
            this.articles = newList;
            //calcTotal();
        },
        // calcTotal(){
            
        //     let total=0;
        //     this.articles.forEach(element => {
        //         total += parseInt(element.price);
        //     })
        //     this.order.total_price = total;
        // },
        onSubmit(){


            console.log(JSON.parse(localStorage.getItem('user')).payload['user'].Id)

            if (this.articles.length > 0) {
                this.loading="Creating pick order, please wait..";
            }else {
                this.loading="Please add som articles..";
            }

            const formData = new FormData();
            //format the request
            let txn_articles=[];
            let txn_serials=[];
            let txn_names=[];

            this.articles.forEach(element => {
                txn_articles.push(element.article)
                txn_serials.push(element.serial)
                txn_names.push(element.name)
            })

            console.log(txn_articles)

            formData.append("order", this.order.number)
            formData.append("articles", JSON.stringify(this.articles))
            // formData.append("serials", txn_serials)
            // formData.append("")
            formData.append("user", JSON.stringify(JSON.parse(localStorage.getItem('user')).payload['user']))
            this.loading="Saving order, please wait..";
           // Post to server
            axios.post(`${this.api_address}/packlista`, formData,
            {
            headers: {"x-access-token": localStorage.getItem("token")}
            }
            ).then(res => {
                //Post at status message
                this.loading ="";
                if (res.status == true){
                    this.status = res.data.message;
                } else {
                    this.status = res.data.message;
                }
            })
        },

    },
    created(){
        //Fetch articles from SQL
        console.log("We are in the created lifecycle hook")
        this.fetchAllArticles()
        console.log(this.$store.state.articles)

    }    

}
</script>

<style>
    h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #426cb9;
}
.tab-pane {
  margin-top: 20px;
}
#transactionModal{
    width: 50%;
}

</style>
