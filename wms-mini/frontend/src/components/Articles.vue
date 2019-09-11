<template>
  <div>
      <div class="col-md-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Article number</th>
                            <th scope="col">Article name</th>
                            <th scope="col">GTIN</th>
                            <th scope="col">Label-layout</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="article in articles">
                            <tr :key="article.Id">
                                <th>{{ article.Id }}</th>
                                <th>{{ article.artikelnr }}</th>
                                <th>{{ article.artikelbenämning }}</th>
                                <th>{{ article.eannr }}</th>
                                <th>{{ article.layout_etikett }}</th>
                                <td><button type="button" class="btn btn-danger" @click="findArticle">Find</button></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';


export default {
    
    name: 'Articles',
    computed: {
        articles(){
            return this.$store.state.articles;
        },
        articleHasLayout(){
            if (article.layout_etikett){
                return 'yes'
            }else {
                return 'no'
            }
        },
        api_address(){
            return this.$store.getters.api_address
        }
    },
    methods: {
        ...mapActions(['fetchAllArticles'])
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

</style>template