const Chef = require('../models/admin/Chef')
const Recipe = require('../models/admin/Recipe')


module.exports = {

  index(req, res) {
    return res.redirect('/home')
  },

  about(req, res) {
    return res.render('foodfy/about')
  },

  async home(req, res) {
    try {
      let recipes = await Recipe.findAll()

      async function getImage(recipeId) {
        let results = await Recipe.files(recipeId)

        return results[0]
      }

      const recipesPromise = recipes.map(async recipe => {

        recipe.file = await getImage(recipe.id)

        return recipe
      }).filter((recipe, index) => index > 5 ? false : true)

      const recipesList = await Promise.all(recipesPromise)

      return res.render('foodfy/home', {
        recipes: recipesList
      })
    } catch (err) {
      console.error(err)
    }
  },

  async recipe(req, res) {
    try {
      const recipeId = req.params.id

      let recipe = await Recipe.findOne(recipeId)

      if (!recipe) return res.send('Recipe not found!')

      let files = await Recipe.files(recipeId)

      recipe = {
        ...recipe,
        files
      }

      return res.render('foodfy/recipe', {
        recipe
      })
    } catch (err) {
      console.error(err)
    }
  },

  async recipes(req, res) {
    try {
      let { filter, } = req.query

      if (filter) {
        let searchResults = await Recipe.findBy(filter)

        async function getImage(recipeId) {
          let results = await Recipe.files(recipeId)

          return results[0]
        }

        const recipesPromise = searchResults.map(async recipe => {

          recipe.file = await getImage(recipe.id)

          return recipe
        })

        const recipesList = await Promise.all(recipesPromise)

        return res.render('foodfy/search', {
          recipes: recipesList,
          filter
        })
        
      } else {
        let recipes = await Recipe.findAll()

        async function getImage(recipeId) {
          let results = await Recipe.files(recipeId)

          return results[0]
        }

        const recipesPromise = recipes.map(async recipe => {

          recipe.file = await getImage(recipe.id)

          return recipe
        })

        const recipesList = await Promise.all(recipesPromise)

        return res.render('foodfy/recipes', {
          recipes: recipesList,
        })
      }
    } catch (err) {
      console.error(err)
    }
  },

  async chefs(req, res) {
    try {
      let chefs = await Chef.findAll()

      async function getImage(chefId) {
        let results = await Chef.files(chefId)

        return results[0]
      }

      const chefsPromise = chefs.map(async chef => {

        chef.file = await getImage(chef.id)

        return chef
      })

      const chefsList = await Promise.all(chefsPromise)


      return res.render('foodfy/chefs', {
        chefs: chefsList,
      })
    } catch (err) {
      console.error(err)
    }
  },

  async chef(req, res) {
    try {
      const chefId = req.params.id

      let chef = await Chef.findOne(chefId)

      if (!chef) return res.send('Chef not found!')

      const chefRecipes = await Chef.findChefRecipes(chefId)

      async function getImage(recipeId) {
        let results = await Recipe.files(recipeId)

        return results[0]
      }

      const recipesPromise = chefRecipes.map(async recipe => {
        recipe.file = await getImage(recipe.id)

        return recipe
      })

      const recipesList = await Promise.all(recipesPromise)

      const file = await Chef.files(chefId)

      chef = {
        ...chef,
        file: file[0],
      }      

      return res.render('foodfy/chef', {
        chef,
        recipes: recipesList
      })
    } catch (err) {
      console.error(err)
    }
  },
}
