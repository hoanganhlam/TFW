import Vue from 'vue'
import GSelect from '../components/GenericSelect'
import DItem from '../components/DisplayItem'
import DField from '../components/DisplayField'
import GDate from '../components/Datetime'
import GArray from '../components/Array'
import GTag from '../components/GenericTag'
import GMBrowser from '../components/Media/Browser'
import GMUpload from '../components/Media/Upload'
import GenericObject from '../components/GenericObject'


Vue.component('g-select', GSelect)
Vue.component('d-item', DItem)
Vue.component('d-field', DField)
Vue.component('g-date', GDate)
Vue.component('g-array', GArray)
Vue.component('g-tag', GTag)
Vue.component('g-object', GenericObject)
Vue.component('gm-browser', GMBrowser)
Vue.component('gm-upload', GMUpload)
