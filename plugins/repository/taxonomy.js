export default app => (
    {
        async list(query) {
            return await app.$axios.$get(`/taxonomies/`, {params: query})
        },
        async post(body) {
            return await app.$axios.$post(`/taxonomies/`, body)
        },
        async get(id, query) {
            return await app.$axios.$get(`/taxonomies/${id}/`, {params: query})
        },
        async update(id, body) {
            return await app.$axios.$put(`/taxonomies/${id}/`, body)
        },
        async delete(id) {
            return await app.$axios.$delete(`/taxonomies/${id}/`)
        }
    }
)
