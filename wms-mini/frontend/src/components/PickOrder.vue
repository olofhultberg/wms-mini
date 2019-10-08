<template>
    <div>
         <div class="container">
                
                <div class="row">
                    <div class="input-group">
                        <h3>Enter order number</h3>
                        <form @submit.prevent>
                            <div class="form-group">
                                <input type="text" required class="form-control" placeholder="Scan order number" v-model="order.number" @keyup.enter="setFocusInput" autofocus>
                            </div>
                            <!-- <div class="form-group">
                                <label for="">Invoice price:</label><span>${{ invoice.total_price }}</span>
                            </div> -->
                        </form>
                    </div>
                </div>
          
        </div>
        <hr/>
        <h3> Scan product barcode </h3>
        <div class="form-group">
            <!-- <label for="">Add Article:</label>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#transactionModal" id="1" ref="1" @click="firstFocus()">
                +
            </button> -->
        <div class="input-group">
            <div class="form-group">
                <label for="">Article number:</label>
                <input v-focus type="text" id="inp_data" class="form-control" ref="inputdata" @blur="splitinput">
            </div>
            <div class="form-group">
                <label for="">Serial</label>
                <input type="numeric" id="inp_serial" class="form-control">
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-secondary" @click="emptyInputs()">Discard transaction</button>
                <button type="button" class="btn btn-primary" @click="saveTransaction()">Save transaction</button>
                <!-- <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button> -->
            </div>
        </div>
   
            <div class="col-md-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Article number</th>
                            <th scope="col">Article name</th>
                            <th scope="col">GTIN</th>
                            <th scope="col">Serial</th>
                            <th scope="col">Exist</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="txn in articles">
                            <tr :key="txn.id">
                                <th>{{ txn.id }}</th>
                                <th>{{ txn.number }}</th>
                                <th>{{ txn.name }}</th>
                                <th>{{ txn.eannr }}</th>
                                <th>{{ txn.serial }}</th>
                                <th v-if="txn.exist">🔴</th>
                                <th v-else>🍏</th>
                                <td><button type="button" class="btn" @click="changeValue(txn.id)">🔁</button></td>
                                <td><button type="button" class="btn btn-danger" @click="deleteTransaction(txn.eannr)">X</button></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" @click.prevent="onSubmit" >Create order</button>
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
        
        noOfFocusableControls: 2,
        articles: [
        // {
        //         id: 0,
        //         number: 0, 
        //         name: '',
        //         serial: '',
        //         gtin:'',
        //         exist: false}
        
        ],
        gtin:'',
        serial:'',
        nextTxnId: 1,
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
        submit: function (msg, e) {
            e.stopPropagation()
        },
        ...mapActions(['fetchAllArticles']),
        
       
    
        setFocusInput(){
            console.log('focusing..')
            this.$nextTick(function(){
                this.$refs.inputdata.focus()
            })
        },

        emptyInputs(){
           document.getElementById("inp_data").value = '';
            document.getElementById("inp_serial").value = '';
             this.setFocusInput()
       },
       splitinput(){
           console.log('splitting..')
           let input = document.getElementById("inp_data").value;
           console.log(input)
           if (input.length>14){
            this.gtin = input.substring(3,15).padStart(13,'0')
            this.serial = input.substring(18).padStart(6,'0')
            console.log('GTIN:', this.gtin)
            console.log('SN:', this.serial)
            document.getElementById("inp_data").value = this.gtin;
            document.getElementById("inp_serial").value = this.serial;
             this.saveTransaction()
           }
           
       },
        saveTransaction(){
            //Check if product code is scanned
            //let input = document.getElementById("inp_data").value;
            //let article = document.getElementById("inp_data").value;
            let serial = ''
            let gtin = document.getElementById("inp_data").value;
          
                //if (input.length > 10){
                    //gtin = document.getElementById("inp_data").value;
                    //article=document.getElementById("inp_data").value;
                // }else{
                //     article = document.getElementById("inp_data").value;
                // }
           
                
                serial = document.getElementById("inp_serial").value;
           
            //TODO:
            //1. Check to make sure the gtin and serial is not registered before
            // -----------------------------
            //1a. In this session
             let session_serial = Object.values(this.articles).find(x => x.serial===serial)
             let session_gtin = Object.values(this.articles).find(x => x.eannr===gtin)
             let session = false
             if (session_serial && session_gtin){
                 console.log(serial, " already exists in this session")
                 this.loading=`Serial ${serial} already exists in this session`
                 session = true
             }else {
                 console.log(serial, " NOT exist in this session")
                 this.loading=``
                 session = false
            }


            console.log(
                'Session: ', session,
                'Session_serial: ',session_serial,
                'Serial: ',serial,
                'Session_gtin: ',session_gtin, 
                'GTIN: ',gtin, 
            )

            //1b. In the database  
            // get the article name as a proof that article exists in sql
            let art = Object.values(this.$store.state.articles).find(x => x.eannr===gtin)

            this.checkArticle(gtin, serial)
                                   
            // If gtin is falsy get article by articlenumber instead?
            console.log('GTIN',gtin)
            console.log('ARTICLE',art.artikelnr)
            console.log('SERIAL',serial)
            
            console.log('art object:',art)

            // add article object to articles array
            if (art.artikelnr.length != 0 && serial > 0 && !session){
                
                this.articles.push({
                    id: this.nextTxnId,
                    number: art.artikelnr,
                    eannr: gtin,
                    serial: serial,
                    name: art.artikelbenämning,
                    exists: false
                })
                
                this.nextTxnId++
                //this.calcTotal();
                //Empty user input 
                document.getElementById("inp_data").value="";
                document.getElementById("inp_serial").value ="";
                this.setFocusInput()
            } 

            

        },
        checkArticle(gtin, serial){
            //  axios.get(`http://${this.api_address}/articlebyserial/?gtin=${gtin}?serial=${serial}?table=${table}`
            axios.get(`${this.api_address}/articlebyserial?gtin=${gtin}&serial=${serial}&table=packlista`,
            {
            headers: {"x-access-token": localStorage.getItem("token")}
            }
            ).then(res => {
               const artObject = JSON.parse(res.data)
               //const arts = Object.keys(artObject)
               console.log(artObject.length)
               // this.loading ="";
                if (artObject.length === 0){
                   // this.setTransaction(gtin)
                    console.log("Does NOT exist in packlista", '⭐️')   
                }else {
                    //this.setTransaction(gtin)
                    
                   // this.changeValue(gtin, serial, true)    
                    console.log("already exist in packlista", '🙉')
                }
              
            }).then(()=> {
                console.log('GTIN (apicall)',gtin)
                //this.changeValue(this.gtin,true)    
                 //this.setTransaction(this.gtin)
            })
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
        changeValue(gtin) {
           console.log('set exists to true so the icon becomes red in the list', gtin)
        },

        // setTransaction(gtin){
        //     //create a new array without the passed item 
        //     let i = this.articles.indexOf(gtin)
        //    // this.articles[i].exists = true
        //     //calcTotal();
        // },
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
        //console.log(this.$store.state.articles)
       
        

    }    

}
</script>

<style>

.input-group {
    display: inline-block;
    justify-content: center;

}
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


</style>
