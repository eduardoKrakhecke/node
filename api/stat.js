module.exports = app => {

    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    const defaultStat = {
        users: 0,
        categories: 0,
        articles: 0,
    }

    const get = (request, response) => {
        Stat.findOne({}, {}, {sort: {'createdAt': -1}})
            .then(stat => {
                response.json(stat || defaultStat)
            })
            .catch(error => response.json(error))
    }

    return { Stat, get }
}