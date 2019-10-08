<template>
    <div>
        <span style="font-size:30px; cursor:pointer" v-on:click="openNav" id="menu-icon">&#9776;</span>
        <div id="leftsidenav" class="sidenav">
            <p style="font-size:20px; color: green; cursor:pointer" @click="closeNav"><em>Close</em></p>
            <p><em>Dep: {{ department }}</em></p>
            <h4>User: {{ name }}</h4>
            <p class="clickable" @click="setActive('pick')">Pick order</p>
            <p class="clickable" @click="setActive('view')">View article(s)</p>
            <br/>
            <p class="clickable" @click="logout">Log out</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "SideNav",
    props: ["name","department"],
    methods: {
        setActive(option){
            this.$parent.$parent.isactive = option;
        },
        openNav(){
            document.getElementById("leftsidenav").style.width ="100%";
        }, 
        closeNav(){
            
            document.getElementById("leftsidenav").style.width ="0%";
        },
        logout(){
          console.log('logging out:', this.name)
          localStorage.removeItem('user')
          this.$router.push({
                name: "SignIn",
           });
        }
    }
}
</script>

<style>

#menu-icon{
  text-align: left;
  display: block;
}

.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  background-color: #fafafa;
  color: #818181;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  text-align: left;
}
.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}
.sidenav a:hover {
  color: #f1f1f1;
}
.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}
@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
  .sidenav a {
    font-size: 18px;
  }
  .clickable {
  cursor: pointer;
}
}
.clickable {
  cursor: pointer;
}
</style>