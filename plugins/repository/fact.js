export default app => (
    {
        async list(query) {
            return await app.$axios.$get(`/facts/`, {params: query})
        },
        async post(body) {
            return await app.$axios.$post(`/facts/`, body)
        },
        async get(id, query) {
            return app.$axios.$get(`/facts/${id}/`, query)
        },
        async update(id, body) {
            return await app.$axios.$put(`/facts/${id}/`, body)
        },
        async delete(id) {
            return await app.$axios.$delete(`/facts/${id}/`)
        },
        async comment(id, body) {
            return await app.$axios.$post(`/facts/${id}/comment/`, body)
        }
    }
)
