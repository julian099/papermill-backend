const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const Design = require('../models/Design')
const path = require('path')

// GET- get all designs ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Design.find().populate('user', '_id firstName lastName')
    .then(designs => {
      if(designs == null){
        return res.status(404).json({
          message: "No designs found"
        })
      }
      res.json(designs)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting designs"
      })
    })  
})

// POST - create new design --------------------------------------
router.post('/', (req, res) => {
    // validate 
    if(Object.keys(req.body).length === 0){   
      return res.status(400).send({message: "Design content can't be empty"})
    }
    // validate - check if image file exist
    if(!req.files || !req.files.image){
      return res.status(400).send({message: "Image can't be empty"})
    }
  
    console.log('req.body = ', req.body)
  
    // image file must exist, upload, then create new design
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
      // create new design
      let newDesign = new Design({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        user: req.body.user,
        image: uniqueFilename,
        gender: req.body.gender,
        length: req.body.length
      })
    
      newDesign.save()
      .then(design => {        
        // success!  
        // return 201 status with design object
        return res.status(201).json(design)
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send({
          message: "Problem creating design",
          error: err
        })
      })
    })
  })




// export
module.exports = router
