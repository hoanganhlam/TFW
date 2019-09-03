export default app => (
    {
        async list(query) {
            return app.$axios.$get(`/jobs/`, query)
        },
        async post(body, $snackbar) {
            return await app.$axios.$post(`/jobs/`, body).then(res => {
                if ($snackbar) {
                    $snackbar.open({
                        duration: 5000,
                        message: 'Tạo công việc thành công',
                        type: 'is-success',
                        position: 'is-bottom-left',
                        actionText: 'Undo',
                    })
                }
            })
        },
        async get(id, query) {
            return app.$axios.$get(`/jobs/${id}/`, query)
        },
        async update(id, body, $snackbar) {
            console.log(app);
            return app.$axios.$put(`/jobs/${id}/`, body).then(res => {
                if ($snackbar) {
                    $snackbar.open({
                        duration: 5000,
                        message: 'Cập nhập công việc thành công',
                        type: 'is-success',
                        position: 'is-bottom-left',
                        actionText: 'Undo',
                    })
                }
            })
        },
        async delete(id, $snackbar) {
            return app.$axios.$delete(`/jobs/${id}/`).then(res => {
                if ($snackbar) {
                    $snackbar.open({
                        duration: 5000,
                        message: 'Xóa công việc thành công',
                        type: 'is-success',
                        position: 'is-bottom-left',
                        actionText: 'Undo',
                    })
                }
            })
        }
    }
)
