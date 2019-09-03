import Vue from 'vue'
import moment from "moment";

Vue.mixin({
    data() {
        return {
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
            if (user.first_name || user.last_name) {
                return user.first_name + ' ' + user.last_name
            }
            return user.username
        },
        formatDate(dateStr) {
            return moment(dateStr).format('YYYY-MM-DD | h:mm A')
        },
        slugify(text) {
            return text ? text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '') : null            // Trim - from end of text
        },
        uniqueID() {
            function chr4() {
                return Math.random().toString(16).slice(-4);
            }

            return chr4() + chr4() +
                '_' + chr4() +
                '_' + chr4() +
                '_' + chr4();
        },
        async crawl(flag, id, campaign_id) {
            return await this.$axios.$post('/run/', {
                id: id,
                campaign_id: campaign_id,
                isTest: flag
            })
        },
    }
})
