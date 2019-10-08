import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
//require('dotenv').config({ path: '../' })

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api_address: '172.27.200.24',
    api_port: 3000,
    articles: {},

  },

    getters: {
    api_address: (state) => {
      return `http://${state.api_address}:${state.api_port}`
    },
  
     },
  mutations: {
      setArticle(state, {id, article}){
        //console.log('set article in state')
        Vue.set(state.articles, id, article)
      }
  },
  actions: {
   
    fetchArticle({state, commit}, {id}){
      //console.log('🔋 fetch article ', id)
      //Fetch article
      // Need to resolve an Object Containing id, number, name, serial
      
      //Get article from database Wrapped in a promise
      return new Promise((resolve)=> {
        axios.get(`http://${state.api_address}:${state.api_port}/article?id=${id}`,
        {
          headers: {"x-access-token": localStorage.getItem("token")}
          })
        .then((response)=>{
          //console.log(response)
          commit('setArticle', {response})
          resolve(state.articles[id])
        })
      })      
    },
    fetchArticles({dispatch}, {ids}) {
      ids = Array.isArray(ids) ? ids : Object.keys(ids);
      return Promise.all(ids.map(id => dispatch('fetchArticle', {id})))
      
      
      //
      // return new Promise((resolve) => {
      //   axios.get(`http://${state.api_address}:${state.api_port}/articles`, 
      //   {
      //     headers: {"x-access-token": localStorage.getItem("token")}
      //     })
      //   .then((response)=>{
      //     console.log(response)
      //               resolve(response)
      //   })
      // })
      
    },
    fetchAllArticles({commit}){
      //console.log('🎲, fetchAllArticles')
      return new Promise((resolve) => {
        axios.get(`http://${this.state.api_address}:${this.state.api_port}/articles`, 
        {
          headers: {"x-access-token": localStorage.getItem("token")}
          })
        .then((response)=>{
          const artObject = JSON.parse(response.data)
          Object.keys(artObject).forEach(artId => {
            const article = artObject[artId]
            //console.log('ForEach article before commit',article)
            commit('setArticle', {id: artId, article: article})
          })
          //console.log(JSON.parse(response.data))
                    resolve(Object.values(this.state.articles))
        })
      })
    },
    checkIfArticleExist({state}, {gtin, serial ,table}){
      //console.log('🚦 check article ', gtin, serial, table)
      //Check article
      // Need to resolve an Object Containing id, number, name, serial
      
      //Get article from database Wrapped in a promise
      return new Promise((resolve)=> {
        axios.get(`http://${state.api_address}:${state.api_port}/articlebyserial?gtin=${gtin}?serial=${serial}?table=${table}`,
        {
          headers: {"x-access-token": localStorage.getItem("token")}
          })
        .then((response)=>{
          //console.log(response)
          
          resolve(response)
        })
      })      
    },
  },
  
})
