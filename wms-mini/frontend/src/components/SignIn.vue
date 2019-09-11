<template>

<div>
    <Header/>
    <div class="container">
        <ul class="nav nav-pills nav-fill mb-3" id="pills-tab" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" id="pills-login-tab" data-toggle="pill" href="#pills-login" role="tab" aria-controls="pills-upload" aria-selected="true">Log in</a>
            </li>
             <!-- <li class="nav-item">
                <a class="nav-link" id="pills-register-tab" data-toggle="pill" href="#pills-register" role="tab" aria-controls="pills-upload" aria-selected="false">Register</a>
            </li> -->
        </ul>
    </div>
    <div class="tab-content" id="pills-tabContent">
    <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
        <div class="row">
            <div class="col-md-12">
                <form @submit.prevent="login">
                    <div class="form-group">
                        <label for="">Email:</label>
                        <input type="email" required class="form-control" placeholder="eg john.doe@email.io" v-model="model.email">
                    </div>
                    <div class="form-group">
                        <label for="">Password:</label>
                        <input type="password" required class="form-control" placeholder="Enter password" v-model="model.password">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary">Login</button>
                        {{ loading }}
                        {{ status }}
                    </div>
                </form>
            </div>
        </div>
    </div>
      <!-- <div class="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="pills-register-tab">
        <div class="row">
            <div class="col-md-12">
                <form @submit.prevent="register">
                    <div class="form-group">
                        <label for="">Name:</label>
                        <input type="text" required class="form-control" placeholder="eg John Doe" v-model="model.name">
                    </div>
                    <div class="form-group">
                        <label for="">Email:</label>
                        <input type="email" required class="form-control" placeholder="eg john.doe@email.io" v-model="model.email">
                    </div>
                    <div class="form-group">
                        <label for="">Company name:</label>
                        <input type="text" required class="form-control" placeholder="eg Doe Inc." v-model="model.company_name">
                    </div>
                    <div class="form-group">
                        <label for="">Password:</label>
                        <input type="password" required class="form-control" placeholder="Enter password" v-model="model.password">
                    </div>
                    <div class="form-group">
                        <label for="">Confirm password:</label>
                        <input type="password" required class="form-control" placeholder="Confirm password" v-model="model.c_password">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary">Register</button>
                        {{ loading }}
                        {{ status }}
                    </div>
                </form>

            </div>
        </div> -->
    </div>
  </div> 

</template>

<script>
import Header from './Header'
import axios from 'axios'

export default {
    name: "SignIn",
    components: {
        Header
    },
    computed: {
        api_address(){
            return this.$store.getters.api_address
        }
    },
    data(){
        return {
            model: {
            name: "",
            email: "clinton@whitehouse.com",
            password: "oldladygonebad",
            c_password: "",
            company_name: ""
            },
        loading: "",
        status: ""    
        };
        
    },
    methods:{
        validate(){
            console.log(this.model.password, this.model.c_password)
            if (this.model.password != this.model.c_password){
                return false;
            }
            return true
        },
        register(){
            const formdata = new FormData();
            let valid = this.validate();
            if (valid){
                formdata.append("name", this.model.name)
                formdata.append("email", this.model.email)
                formdata.append("company_name", this.model.company_name)
                formdata.append("password", this.model.password)

                this.loading = "Registering, please wait.."
                //post to server
                axios.post(`${this.api_address}/register`, formdata).then(res => {
                    //Post a status message
                    this.loading = "";
                    if (res.data.status === true){
                        //store the user token and user data in local storage
                        localStorage.setItem('token', res.data.token)
                        localStorage.setItem('user', JSON.stringify(res.data.user))
                        //Send the user to next route
                        console.log(res.data.params.user)
                        this.$router.push({
                            name: "Dashboard",
                        });
                    } else {
                        this.status.message = res.data.message;
                    }
                });
           } else {
               alert("Passwords does not match!")
           }
        },
        login(){
            const formData = new FormData();
            formData.append("email", this.model.email)
            formData.append("password", this.model.password)
            this.loading = "Signing in.."
            //Post to server
            axios.post(`${this.api_address}/login`,formData).then(res => {
                //Post status?
                res.setItem
                this.loading = ""
                if (res.data.status === true){
                    //Send the user to next route
                    console.log(res.data)
                //store the user token and user data in local storage
                            localStorage.setItem('token', res.data.token)
                            localStorage.setItem('user', JSON.stringify(res.data))
                    this.$router.push({
                        name: 'Dashboard'
                    })
                } else {
                    this.status = res.data.message;
            }
        })
    }
    },
    
}
</script>

<style>
    .container{
        width: 75%;
    }
</style>
