var express = require('express');
var router = express.Router();
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostModel = require('../models/Posts');
var PostError = require('../helpers/error/PostError');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/images/upload");
    },
    filename: function(req, file, cb){
        let fileExtension = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExtension}`);
    }
});

var uploader = multer({storage: storage});

router.post('/createPost', uploader.single("uploadImage"),(req, res, next ) => {
    let fileUploaded = req.file.path;
    let thumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + thumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
        return PostModel.create(
            title, 
            description, 
            fileUploaded, 
            destinationOfThumbnail, 
            fk_userId,
        );
    })
    .then((postWasCreated) => {
        if(postWasCreated){
            req.flash('success', 'Post was created successfully');
            req.session.save( err => {
                res.redirect('/');
              })
        }else{
            throw new PostError('Post could not be created', '/postImage', 200);
        }
    })
    .catch((err) => {
        if(err instanceof PostError){
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirecUrl());
        }else{
            next(err);
        }
    })
});

router.get('/search', async (req, res, next) => {
    try{
        let searchTerm = req.query.search;
        if(!searchTerm){
            res.send({
                message: "No search term given",
                results: []
            });
        }else{
            let results = await PostModel.search(searchTerm);
            if(results.length){
                res.send({
                message: `${results.length} results found`,
                results: results,
                });
            }else{
                let results = await PostModel.getNRecentPosts(8);
                res.send({
                    message: "No results were found for your search. But here are the most recent posts",
                    results: results,
                });
            }
        }
    } catch (err){
        next(err);
    }
});
   
module.exports = router;