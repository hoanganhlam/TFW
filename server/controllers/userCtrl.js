const {UserModel} = require('core-model');
const {responseJSON, responseError} = require('./response');
const {getBody} = require('./request');
const passport = require('passport');
const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


exports.list = async (req, res) => {
    const pageSize = Number.parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.search || ''
    const page = req.query.page || 1;
    const ordering = req.query.ordering || 'popular';
    const regex = new RegExp(escapeRegex(searchQuery), 'gi');
    let query = {$or: [{firstName: regex}, {lastName: regex}, {username: regex}]}
    let aggregate = [
        {
            $lookup: {from: 'File', localField: 'avatar', foreignField: '_id', as: 'avatar'}
        },
        {
            $match: query
        },
        {
            $project: {'hash': 0, 'salt': 0, 'email': 0}
        },
    ]
    if (ordering === 'newest') {
        aggregate.push({$sort: {createdAt: -1}})
    } else {
        aggregate.push({$sort: {createdAt: 1}})
    }
    try {
        const results = await UserModel.aggregate(aggregate)
        const display = await UserModel.aggregate(aggregate)
            .skip((pageSize * page) - pageSize)
            .limit(pageSize)
        res.json({
            results: display,
            currentPage: page,
            numPage: Math.ceil(results.length / pageSize),
            total: results.length
        });
    } catch (err) {
        return next(err)
    }
};

exports.create = (req, res) => {
    let data = getBody(req, ['bio', 'username', 'password', 'firstName', 'lastName', 'email', 'avatar']);
    return UserModel.findOne({email: data.email})
        .then(user => {
            if (user) {
                return responseError(res, 'User has been existed', {messageCode: 'user_existed'}, 405);
            } else {
                let newUser = new UserModel()
                newUser.username = data.username;
                newUser.email = data.email;
                newUser.setPassword(data.password);
                newUser.save()
            }
        })
        .then(created => {
            return responseJSON(res, 'Create user successfully', created);
        })
        .catch(error => {
            let message = error && error.message ? error.message : 'Error when create user';
            return responseError(res, message, {messageCode: 'error_create_user'});
        });
};

exports.retrieve = (req, res) => {
    return res.json(req.instance)
};

exports.update = (req, res) => {
    let data = getBody(req, ['firstName', 'lastName', 'avatar', 'bio']);
    for (let field of Object.keys(data)) {
        if (typeof data[field] !== 'undefined') {
            req.instance[field] = data[field];
        }
    }
    req.instance.save().then(function (instance) {
        return res.json(instance);
    }).catch(error => {
        let message = error && error.message ? error.message : 'Error';
        return responseError(res, message, {messageCode: 'error_get_all_user'});
    });
};

exports.delete = (req, res) => {
    return req.instance.remove().then(function () {
        return res.sendStatus(204);
    });
};

exports.me = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).populate({path: 'avatar', model: 'File'}).catch(next)
    if (!user) {
        return res.sendStatus(401);
    }
    return res.json(user);
};

exports.login = (req, res, next) => {
    let data = getBody(req, ['email', 'password']);
    if (!data.email) {
        return res.status(422).json({errors: {email: "can't be blank"}});
    }

    if (!data.password) {
        return res.status(422).json({errors: {password: "can't be blank"}});
    }
    passport.authenticate('local', {session: false}, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            user.token = user.generateJWT();
            return res.json(user.toAuthJSON());
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
}


exports.fakerr = async (req, res, next) => {
    let firstName = [
        'Adam',
        'Adrian',
        'Alan',
        'Alexander',
        'Andrew',
        'Anthony',
        'Austin',
        'Benjamin',
        'Blake',
        'Boris',
        'Brandon',
        'Brian',
        'Cameron',
        'Carl',
        'Charles',
        'Christian',
        'Christopher',
        'Colin',
        'Connor',
        'Dan',
        'David',
        'Dominic',
        'Dylan',
        'Edward',
        'Eric',
        'Evan',
        'Frank',
        'Gavin',
        'Gordon',
        'Harry',
        'Ian',
        'Isaac',
        'Jack',
        'Jacob',
        'Jake',
        'James',
        'Jason',
        'Joe',
        'John',
        'Jonathan',
        'Joseph',
        'Joshua',
        'Julian',
        'Justin',
        'Keith',
        'Kevin',
        'Leonard',
        'Liam',
        'Lucas',
        'Luke',
        'Matt',
        'Max',
        'Michael',
        'Nathan',
        'Neil',
        'Nicholas',
        'Oliver',
        'Owen',
        'Paul',
        'Peter',
        'Phil',
        'Piers',
        'Richard',
        'Robert',
        'Ryan',
        'Sam',
        'Sean',
        'Sebastian',
        'Simon',
        'Stephen',
        'Steven',
        'Stewart',
        'Thomas',
        'Tim',
        'Trevor',
        'Victor',
        'Warren',
        'William'
    ]
    let lastName = [
        'Abraham',
        'Allan',
        'Alsop',
        'Anderson',
        'Arnold',
        'Avery',
        'Bailey',
        'Baker',
        'Ball',
        'Bell',
        'Berry',
        'Black',
        'Blake',
        'Bond',
        'Bower',
        'Brown',
        'Buckland',
        'Burgess',
        'Butler',
        'Cameron',
        'Campbell',
        'Carr',
        'Chapman',
        'Churchill',
        'Clark',
        'Clarkson',
        'Coleman',
        'Cornish',
        'Davidson',
        'Davies',
        'Dickens',
        'Dowd',
        'Duncan',
        'Dyer',
        'Edmunds',
        'Ellison',
        'Ferguson',
        'Fisher',
        'Forsyth',
        'Fraser',
        'Gibson',
        'Gill',
        'Glover',
        'Graham',
        'Grant',
        'Gray',
        'Greene',
        'Hamilton',
        'Hardacre',
        'Harris',
        'Hart',
        'Hemmings',
        'Henderson',
        'Hill',
        'Hodges',
        'Howard',
        'Hudson',
        'Hughes',
        'Hunter',
        'Ince',
        'Jackson',
        'James',
        'Johnston',
        'Jones',
        'Kelly',
        'Kerr',
        'King',
        'Knox',
        'Lambert',
        'Langdon',
        'Lawrence',
        'Lee',
        'Lewis',
        'Lyman',
        'MacDonald',
        'Mackay',
        'Mackenzie',
        'MacLeod',
        'Manning',
        'Marshall',
        'Martin',
        'Mathis',
        'May',
        'McDonald',
        'McLean',
        'McGrath',
        'Metcalfe',
        'Miller',
        'Mills',
        'Mitchell',
        'Morgan',
        'Morrison',
        'Murray',
        'Nash',
        'Newman',
        'Nolan',
        'North',
        'Ogden',
        'Oliver',
        'Paige',
        'Parr',
        'Parsons',
        'Paterson',
        'Payne',
        'Peake',
        'Peters',
        'Piper',
        'Poole',
        'Powell',
        'Pullman',
        'Quinn',
        'Rampling',
        'Randall',
        'Rees',
        'Reid',
        'Roberts',
        'Robertson',
        'Ross',
        'Russell',
        'Rutherford',
        'Sanderson',
        'Scott',
        'Sharp',
        'Short',
        'Simpson',
        'Skinner',
        'Slater',
        'Smith',
        'Springer',
        'Stewart',
        'Sutherland',
        'Taylor',
        'Terry',
        'Thomson',
        'Tucker',
        'Turner',
        'Underwood',
        'Vance',
        'Vaughan',
        'Walker',
        'Wallace',
        'Walsh',
        'Watson',
        'Welch',
        'White',
        'Wilkins',
        'Wilson',
        'Wright',
        'Young'
    ]
    let users = []
    firstName.forEach(x => {
        lastName.forEach(y => {
            users.push({
                firstName: x,
                lastName: y,
                username: (x + y).toLowerCase(),
                password: 'Hoanganhlam@no99',
                isFiend: true,
                email: (x + y).toLowerCase() + '@yahoo.com'
            })
        })
    })
    for (let i = 0; i < 1000; i++) {
        let check = await UserModel.findOne({username: users[i].username})
        if (!check) {
            let newUser = new UserModel()
            newUser.username = users[i].username;
            newUser.firstName = users[i].firstName;
            newUser.lastName = users[i].lastName;
            newUser.email = users[i].email;
            newUser.setPassword(users[i].password);
            newUser.save()
        }
    }
    return res.json({msg: "OK"})
}
