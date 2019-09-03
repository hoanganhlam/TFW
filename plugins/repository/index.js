import JobRepository from './job'

export default function (app, inject) {
    const api = {
        JOB: JobRepository(app),
    }
    inject('api', api)
}
