import FactRepository from './fact'
import UserRepository from './user'
import TaxonomyRepository from './taxonomy'

export default function (app, inject) {
    const api = {
        fact: FactRepository(app),
        user: UserRepository(app),
        taxonomy: TaxonomyRepository(app)
    }
    inject('api', api)
}
