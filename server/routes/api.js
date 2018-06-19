const router = require('express').Router()
const models = require('../models')

const isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) return next()
	res.redirect('/')
}

// Retrieves a summary list of notebooks in json format
router.get('/notebook', (req, res) => {
	models.Notebook.findAll().then(notebooks => {
    if (notebooks && Object.keys(notebooks).length > 0)
			res.json({ success: true, notebooks })
		else
			res.status(400).json({ success: false, error: "No notebooks found" })
	}).catch((err) => res.status(400).json({ success: false, error: err }))
})

// Create a new notebook (requires user to be authenticated)
router.post('/notebook', isAuthenticated, (req, res) => {
	const { title, content } = req.body
	const owner = req.user.dataValues.id
	models.Notebook
 		.build({ title, content, owner })
		.save()
		.then((notebook) => res.json({ id: notebook.id, success: true }))
		.catch((err) => res.status(400).json({ success: false, error: err }))
})

// Retrieves the notebook's content
router.get('/notebook/:id', (req, res) => {
	models.Notebook.findOne({where: {id: req.params.id}}).then(notebook => {
    if (notebook && Object.keys(notebook).length > 0)
			res.json({ success: true, notebook })
		else
			res.status(400).json({ success: false, error: "Notebook doesn't exist" })
	}).catch((err) => res.status(400).json({ success: false, error: err }))
})

// Updates the notebook's content
router.put('/notebook/:id', isAuthenticated, (req, res) => {
	const { title, content} = req.body
	models.Notebook
		.findOne({where: {id: req.params.id}})
	  .then(notebook => {
	    if (notebook) {
	      notebook.update({
	        title,
					content,
	      })
	    }
		}).then(() => res.json({success: true}))
		.catch(err => res.status(400).json({ success: false, error: err }))
})

// Retrieves metadata associated with a user
router.get('/user/:id', (req, res) => {
	let ownNotebooks = []
	let userDetails
	models.User
		.findOne({ where: { id: req.params.id } })
		.then(user => {
			if (user) {
				userDetails = user.dataValues
				delete userDetails.accessToken
				models.Notebook
					.findAll({where: {owner: req.params.id}})
					.then(notebooks => {
					if (notebooks && Object.keys(notebooks).length > 0) {
						ownNotebooks = notebooks
					}
					res.json({...userDetails, ownNotebooks})
					})
			} else {
				res.status(400).json({success: false, error: "Requested user doesn't exist"})
			}
		}).catch(err => res.status(400).json({ success: false, error: err }))
})

module.exports = router