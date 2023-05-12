module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validator

    const save = (request, response) => {
        const category = {...request.body}
        if(request.params.id) category.id = request.params.id

        try {
            existsOrError(category.name, 'Nome não informado')
        } catch (e) {
            return response.status(400).send(e)
        }

        if(category.id) {
           app.db('categories').update(category).where({id: category.id})
               .then(_=> response.status(204).send())
               .catch(err => response.status(500).send(err))
        } else {
            app.db('categories').insert(category)
                .then(_=> response.status(204).send())
                .catch(err => response.status(500).send(err))
        }
    }

    const remove = async (request, response) => {
        try {
            existsOrError(request.params.id, 'Código da categoria não informado')
            const subcatagory = await app.db('categories').where({parentId: request.params.id})

            notExistsOrError(subcatagory, 'Categorias possui subcategoria')

            const articles = await app.db('articles').where({categoryId: request.params.id})
            notExistsOrError(articles, 'Categoria possui artigos')

            const rowsDeleted = await app.db('categories').where({id: request.params.id}).del()
            existsOrError(rowsDeleted, 'Categoria não foi encontrada')

            response.status(204).send()

        } catch (e) {
            return response.status(400).send(e)
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            let parent = categories.filter(parent => parent.id === parentId)
            return parent.length? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while (parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return {...category, path}
        })

        categoriesWithPath.sort((a,b) => {
            if( a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })
        return categoriesWithPath
    }

    const get = (request, response) => {
        app.db('categories')
            .then(categories => response.json(withPath(categories)))
            .catch(err => response.status(400).send(err))
    }

    const getById = (request, response) => {
        app.db('categories').where({id: request.params.id}).first()
            .then(category => response.json(category))
            .catch(err => response.status(400).send(err))
    }

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (request, response) => {
        app.db('categories')
            .then(categories => response.json(toTree(withPath(categories))))
            .catch(err => response.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }

}