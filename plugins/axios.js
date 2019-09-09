export default function ({ $axios, app, redirect }) {
    $axios.onResponseError(err => {
        const code = parseInt(err.response && err.response.status);

        let originalRequest = err.config;
        if (code == 401) {
            app.$auth.logout()
            originalRequest.__isRetryRequest = true;
            app.$cookies.removeAll()
            redirect('/')
        }
    });
}
