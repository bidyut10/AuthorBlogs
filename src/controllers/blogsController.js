const mongoose = require("mongoose");
const blogsModel = require("../models/blogsModel");
const authorModel = require("../models/authorModel");

const createBlogs = async function (req, res) {
  try {
//edge Cases for createblogs according to Blog model and as per our requirements
//if body is empty
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide your Blog details in body" })
    };

//checking required feilds
    if (!data.authorId)
      {return res.status(400).send({ status: false, msg: "AuthorID is required" });}

    if (!data.title)
     {return res.status(400).send({ msg: 'Title is required' }) };

    if (!data.body)
     {return res.status(400).send({ msg: 'Body is required' }) };

    if (!data.category)
     {return res.status(400).send({ msg: 'Category is required' }) };

    if (!data.subcategory)
     {return res.status(400).send({ msg: 'Subcategory is required' }) };

    if (!data.tags) { return res.status(400).send({ msg: 'Tags is required' }) };

//checking alphabet
    if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.title))) {
      return res.status(400).send({ status: false, msg: "Title should be in alphabat type" })
    };
    if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.body))) {
      return res.status(400).send({ status: false, msg: "Body should be in alphabat type" })
    };

//authorid is exist or not
  let checkauthorId = await authorModel.findById({_id: data.authorId} )
    if (!checkauthorId) 
    { return res.status(400).send({ status: false, msg: "AthorId does'nt exist" }) };

//After the passing all the edge cases now author can created his own new blogs

    let blogCreated = await blogsModel.create(data);
    {return res.status(201).send({data:blogCreated})}

  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};


    const FilterBlogs = async function (req, res) {
      try {

        if (req.query.authorId)  {
          let authorId1 = req.query.authorId
          let authorIdCheck = await authorModel.findById({ _id: authorId1})
          if (!authorIdCheck) {return res.status(404).send({ status: false, msg: "AuthorId is not exist" })}
          let blogData = await blogsModel.find({ authorId: authorIdCheck, isPublished: true, isDeleted: false })
          if (blogData.length == 0) { return res.status(404).send({ status: false, msg: "No such Blogs are found for this authorId" })}
          else { return res.status(200).send({ data: blogData })}
        }
        else if (req.query.tags) {
          let tags = req.query.tags
          let tagsCheck = await blogsModel.find({ tags: tags, isPublished: true, isDeleted: false })
          //if there is no tag found in database than it gives a blank array thats why i check that arrays length

          if (tagsCheck.length == 0) { return res.status(404).send({ status: false, msg: "No such similar blogs are find by the tag" }) }
          else { return res.status(200).send({ data: tagsCheck }) }
        } 
        else if (req.query.category){
          let category = req.query.category
          let categoryCheck = await blogsModel.find({ category: category, isPublished: true, isDeleted: false })
          if (categoryCheck.length == 0) { return res.status(404).send({ status: false, msg: "No such similar blogs are find by the category" }) }
          else { return res.status(200).send({ data: categoryCheck }) };

        } else if (req.query.subcategory) {
          
        let subcategory = req.query.subcategory
        let subcategoryCheck = await blogsModel.find({ subcategory: subcategory, isPublished: true, isDeleted: false })
        if (subcategoryCheck.length == 0) { return res.status(404).send({ status: false, msg: "No such similar blogs are find by the subcategory" }) } 
        else { return res.status(200).send({ data: subcategoryCheck }) };
        } else{
          return res.status(400).send({status:false,msg:"Please provide the details in query params which you want to see"})
        }
  } catch (err) {
   return res.status(500).send({ msg: "Error", error: err.message });
  }
};

//this api not listed in project , for checking purposes i just created this.
const allDeletedBlogs = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication  
    let blogs = await blogsModel.find({ isPublished: false, isDeleted: true })
    if (blogs.length == 0) { return res.status(404).send({ status: false, msg: "No Blogs are found" }); }
    else { return res.send({ data: blogs }) };
  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

const updateBlog = async function (req, res) {
  try {

//if body is empty
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(404).send({ status: false, msg: "Please provide which feild you want to update" })
    };

 //checking required feilds(but i comment out all this just bcz if this code runs than author cant update any individual feild at a time. so for now as per my project requirement i dont need that code to check that validation)

//checking blogId exist or not and also blogId is given or not by user
    let blogId = req.params.blogId;

    let idCheck = await blogsModel.findById({ _id: blogId })
    if (!idCheck) {return res.status(404).send({ status: false, Msg:"BlogId is not exist"})}

    let isDeletedCheck = await blogsModel.findOne({ _id: blogId, isDeleted: true })
    if (isDeletedCheck) { return res.status(404).send({ status: false, Msg: "Blog is already deleted" })};

    //after checking all the edge cases than the author can update his blogs

    let updateData = await blogsModel.findByIdAndUpdate({ _id: blogId }, { $set: { title: data.title, body: data.body, tags: data.tags, subcategory: data.subcategory, isPublished: true, publishAt: new Date() } },{ new: true });

    let finaldata={
      blogId:blogId,
      title:updateData.title,
      body:updateData.body,
      authorId:updateData.authorId,
      tags:updateData.tags,
      category:updateData.category,
      subcategory:updateData.subcategory,
      ispublished:updateData.isPublished,
      publishAt:updateData.publishAt
    }

    {return res.status(200).send({ data: finaldata })}; 

  } catch (err) {
   return res.status(500).send({ error: err.message });
  }
};

const isDeletedByParam = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication and authorization
    let blogId = req.params.blogId; 

//blogId match or not
    let check2 = await blogsModel.findById({ _id: blogId })
    if (!check2) { return res.status(404).send({ status: false, Msg: "BlogId does'nt match" }) }

//blogId is deleted or not
    let check = await blogsModel.findOne({ _id: blogId, isDeleted: true })
    if (check) {return res.status(404).send({ status: false, Msg: "Blog is already deleted" })};

 //after checking all this validation author can delete his blogs 
    let updateData = await blogsModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true,isPublished:false,deletedAt: new Date() } }, { new: true }); 
    let finaldata={
      blogId:blogId,
      isDeleted:updateData.isDeleted,
      deletedAt:updateData.deletedAt
    }
    {return res.status(200).send({ data: finaldata })};

  } catch (err) {
     return res.status(500).send({ error: err.message });
  }
};

const deleteBlogsQuery = async function (req, res) {
  try {
    //Possible edge cases and the rest is checked by authentication and authorization
    let data = req.query;

    //after checking all this validation author can delete his blogs 
    if(data.authorId){
    const checkAuthorId = await authorModel.findById({ _id: data.authorId  })
     if(!checkAuthorId) return res.status(404).send({status:false,msg:"AuthorId is not correct"});

    let authorData = await blogsModel.find({ authorId:checkAuthorId, isDeleted:false ,isPublished:true }) 
      if (authorData.length == 0) { return res.status(404).send({ status: false, msg:"Nothing to delete,all blogs are already deleted for this authorId"})};

    let updateData = await blogsModel.updateMany({ authorId: checkAuthorId, isDeleted: false, isPublished: true }, { $set: { isDeleted: true, isPublished: false, isDeletedAt: new Date() } }, { new: true });
    {return res.status(200).send({status:true,msg:"All Blogs deleted successfully for this authorId"})}

    } else if(data.tags){
      let tagsData = await blogsModel.find({ tags:data.tags , isDeleted: false, isPublished: true })
      if (tagsData.length == 0) { return res.status(404).send({ status: false, msg: "Nothing to delete,all blogs are already deleted for this particular tag" }) };

      let tData = await blogsModel.updateMany({ tags:data.tags , isDeleted: false, isPublished: true }, { $set: { isDeleted: true, isPublished: false, isDeletedAt: new Date() } }, { new: true });
      { return res.status(200).send({ status: true, msg: "All Blogs deleted successfully for this particular tag" }) }

    } 
    else if (data.category) {
      let catData = await blogsModel.find({ category: data.category, isDeleted: false, isPublished: true })
      if (catData.length == 0) { return res.status(404).send({ status: false, msg: "Nothing to delete,all blogs are already deleted for this category" }) };

      let cData = await blogsModel.updateMany({ category: data.category, isDeleted: false, isPublished: true }, { $set: { isDeleted: true, isPublished: false, isDeletedAt: new Date() } }, { new: true });
      { return res.status(200).send({ status: true, msg: "All Blogs deleted successfully for this category" }) }
    }
    else if (data.subcategory) {
      let subcatData = await blogsModel.find({ subcategory: data.subcategory, isDeleted: false, isPublished: true })
      if (subcatData.length == 0) { return res.status(404).send({ status: false, msg: "Nothing to delete,all blogs are already deleted for this subcategory" }) };

      let sData = await blogsModel.updateMany({ subcategory: data.subcategory, isDeleted: false, isPublished: true }, { $set: { isDeleted: true, isPublished: false, isDeletedAt: new Date() } }, { new: true });
      { return res.status(200).send({ status: true, msg: "All Blogs deleted successfully for this subcategory" }) }
    
    }else {
      return res.status(404).send({ status: false, msg: "Please provide the details in query params which you want to delete" })
    }

  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.createBlogs = createBlogs;
module.exports.allDeletedBlogs = allDeletedBlogs;
module.exports.updateBlog = updateBlog;
module.exports.isDeletedByParam = isDeletedByParam;
module.exports.deleteBlogsQuery = deleteBlogsQuery;
module.exports.FilterBlogs=FilterBlogs