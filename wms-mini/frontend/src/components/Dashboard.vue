<template>
    <div class="container-fluid" style="padding: 0px;">
        <Header v-bind:user="user"/>
        <template v-if="this.isactive==='pick'">
            <PickOrder/>
        </template>
         <template v-else>
            <Articles/>
        </template>
    </div>
</template>

<script>
import Header from './Header'
import PickOrder from '@/components/PickOrder'
import Articles from '@/components/Articles'
//import ViewInvoices from './ViewInvoices'

export default {
    components:{
        Header,
        PickOrder,
        Articles
        // ViewInvoices
    },
    name: 'Dashboard',
    data(){
        return{
            isactive: 'pick',
            title: "WMS Mini App",
            user: null
        }
    },
    mounted(){
        this.user = JSON.parse(localStorage.getItem('user')).payload.user;
        //console.log(this.user)
    }
}
</script>