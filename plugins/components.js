import Vue from 'vue'
import FactCard from '../components/fact/Card'
import UserCard from '../components/user/Card'
import ListFact from '../components/fact/List'
import PopularFact from '../components/fact/Popular'
import ListTopic from '../components/topic/List'
import Pagination from '../components/Pagination'

Vue.component('c-fact', FactCard)
Vue.component('u-fact', UserCard)
Vue.component('l-fact', ListFact)
Vue.component('p-fact', PopularFact)
Vue.component('l-topic', ListTopic)
Vue.component('f-pagination', Pagination)
