<template>
<div >
    <nav class="navbar navbar-light bg-light" >
        <template v-if="user != null">
            <SideNav v-bind:name="user.name" v-bind:department="user.department" />
        </template>    
        <span class="navbar-brand mb-0 h1">{{ title }}</span>
       <p>Beta version powered with Vue.js 🔥</p>
    </nav>
       
        </div>
</template>

<script>
import SideNav from './SideNav'
export default {
    name: "Header",
    props: ["user"],
    components: {
        SideNav
    },
    data(){
        return {
            title: "Grafokett WMS ver.1a",
        }
    }
}
</script>