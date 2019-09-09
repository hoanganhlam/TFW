export default app => (
    {
        async list(query) {
            return await app.$axios.$get(`/users/`, query)
        },
        async post(body) {
            return await app.$axios.$post(`/users/`, body)
        },
        async get(id, query) {
            return await app.$axios.$get(`/users/${id}/`, query)
        },
        async update(id, body) {
            return await app.$axios.$put(`/users/${id}/`, body)
        },
        async delete(id) {
            return await app.$axios.$delete(`/users/${id}/`)
        }
    }
)
