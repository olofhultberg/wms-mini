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
                            <input type="text" id="txn_name_modal" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="">Serial</label>
                            <input type="numeric" id="txn_price_modal" class="form-control">
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
                            <th scope="col">Serial</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="txn in articles">
                            <tr :key="txn.id">
                                <th>{{ txn.id }}</th>
                                <th>{{ txn.article }}</th>
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
            number: "",
            user: JSON.parse(localStorage.getItem('user')).payload['user'].name
        },
        articles: [],
        nextTxnId: 1,
        loading:'',
        status:'',
        }
        
    },

    methods: {
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
            let article = document.getElementById("txn_name_modal").value;
            let serial = document.getElementById("txn_price_modal").value;

            if (article.length != 0 && serial > 0){
                this.articles.push({
                    id: this.nextTxnId,
                    article,
                    serial
                })
                this.nextTxnId++
                //this.calcTotal();
                //Empty user input 
                document.getElementById("txn_name_modal").value="";
                document.getElementById("txn_price_modal").value ="";
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

            if (this.articles.length > 0) {
                this.loading="Creating pick order, please wait..";
            }else {
                this.loading="Please add som articles..";
            }

            const formData = new FormData();
            //format the request
            let txn_articles=[];
            let txn_serials=[];
            this.articles.forEach(element => {
                txn_articles.push(element.article)
                txn_serials.push(element.serial)
            })

            formData.append("order", this.order.number)
            formData.append("articles", txn_articles)
            formData.append("serials", txn_serials)
            formData.append("user_id", JSON.parse(localStorage.getItem('user')).payload['user'].id);
            this.loading="Saving order, please wait..";
           // Post to server
            axios.post("http://localhost:3000/packlista", formData,
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
        }
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
