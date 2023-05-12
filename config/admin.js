module.exports = middleware => {
    return ( request, response, next) => {
        if(request.user.admin) {
            middleware(request, response, next)
        } else {
            response.status(401).send('Usuário não é administrador.')
        }
    }
}