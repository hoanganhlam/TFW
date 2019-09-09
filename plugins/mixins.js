import Vue from 'vue'
import moment from "moment";
Vue.mixin({
    data() {
        return {
            domain: process.env.domain,
            api_domain: process.env.apiDomain,
            moment: moment
        }
    },
    methods: {
        timeSince(date) {
            let seconds = moment().diff(date, 'seconds', false);
            return this.convertTime(seconds)
        },
        convertTime(seconds) {
            var interval = Math.floor(seconds / 31536000);
            if (interval > 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " month";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " day";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hours";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        },
        capitalizeFirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        convertName(user) {
            if (user.firstName || user.lastName) {
                return user.firstName + ' ' + user.lastName
            }
            return user.username
        },
        formatDate(dateStr) {
            return new moment(dateStr, 'YYYY-MM-DD').format('YYYY-MM-DD')
        },
        async getDescription(text) {
            return await this.$axios.$get(`/utilities/description?search=${text}&limit=3&lang=en`)
        }
    }
})
