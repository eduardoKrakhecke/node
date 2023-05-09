const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validator

    const ecryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)

    }

    const save = async (request, response) => {
        const user = { ... request.body }
        if(request.params.id) user.id = request.params.id

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'Email não informado')
            existsOrError(user.password, 'Senha inválida')
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDb = await app.db('users').where({email: user.email}).first()
            if(!user.id) {
                notExistsOrError(userFromDb, 'Usuário já cadastrado')
            }
        } catch (msg) {
            response.status(400).send(msg)
        }

        user.password = ecryptPassword(request.body.password)
        delete user.confirmPassword

        if(user.id) {
          app.db('users').update(user).where({id: user.id})
              .then(_=> response.status(204).send())
              .catch(error =>  response.status(500).send(error))
        } else {
            app.db('users').insert(user)
                .then(_ => response.status(204).send())
                .catch(error => response.status(500).send(error))
        }
    }

    const get = (request, response ) => {
        app.db('users').select('id', 'name', 'email', 'admin')
            .then(users=> response.json(users))
            .catch(error => response.status(500).send(error))
    }

    return { save, get }
}