const express = require('express');
const router = express.Router();


const authorController = require("../controllers/authorController")
const blogscontroller = require("../controllers/blogsController")
const commonMW = require('../middlewares/comonMW')


router.post('/authors', authorController.createAuthor)

router.post('/login', authorController.loginUser)

router.post('/blogs', commonMW.authenticate, blogscontroller.createBlogs)

router.get('/blog', commonMW.authenticate, blogscontroller.allDeletedBlogs)//checking purposes(extra api)

router.get('/blogs', commonMW.authenticate, blogscontroller.FilterBlogs)

router.put("/blogs/:blogId", commonMW.authorisation, blogscontroller.updateBlog)

router.delete('/blog/:blogId', commonMW.authorisation, blogscontroller.isDeletedByParam)

router.delete("/blogs", commonMW.authorisation, blogscontroller.deleteBlogsQuery)


module.exports = router;
