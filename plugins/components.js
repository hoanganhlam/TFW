import Vue from 'vue'
import GSelect from '../components/GenericSelect'
import DItem from '../components/DisplayItem'
import DField from '../components/DisplayField'
import GDate from '../components/Datetime'
import GArray from '../components/Array'
import GMBrowser from '../components/Media/Browser'
import GMUpload from '../components/Media/Upload'
import GenericObject from '../components/GenericObject'
import ScriptForm from '../components/Script/Form'
import ScriptJob from '../components/Script/Job'
import ScriptBoard from '../components/Script/Board'
import ObjectBuilder from '../components/ObjectBuilder'
import FieldBuilder from '../components/FieldBuilder'
import QueryBuilder from '../components/QueryBuilder'
import OptionBuilder from '../components/OptionBuilder'
import CrawlerForm from '../components/Crawler/Form'

Vue.component('g-select', GSelect)
Vue.component('d-item', DItem)
Vue.component('d-field', DField)
Vue.component('g-date', GDate)
Vue.component('g-array', GArray)
Vue.component('g-object', GenericObject)
Vue.component('gm-browser', GMBrowser)
Vue.component('gm-upload', GMUpload)
Vue.component('s-form', ScriptForm)
Vue.component('s-job', ScriptJob)
Vue.component('s-board', ScriptBoard)
Vue.component('o-build', ObjectBuilder)
Vue.component('f-build', FieldBuilder)
Vue.component('q-build', QueryBuilder)
Vue.component('ot-build', OptionBuilder)
Vue.component('c-form', CrawlerForm)
