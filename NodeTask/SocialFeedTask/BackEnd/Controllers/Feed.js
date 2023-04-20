const Feed = require('../Models/Feed')

 
//------------------------------FOR GETTING ALL FEEDS--------------------------------
exports.getAllFeeds = async (req, resp, next) => {
    const feeds = await Feed.find();
    resp.status(200).json(feeds);
}


//---------------------------------FOR POSTING FEED ------------------------------
exports.postFeed = async(req,resp,next) =>
{
    
    const newFeed = new Feed({
                                photo:req.file.path , 
                                caption:req.body.caption , 
                                like:req.body.like , 
                            })
    newFeed.createdBy = req.user._id

    try {
        const feed = await newFeed.save();
        resp.status(200).json(feed);
    } catch (error) {
        error.status = 400;
        next(error);
    }
  
}

// -----------------------------------FOR PUTTING COMMENTS -----------------------------
exports.putComments = async(req,resp,next) =>
{
    try
    {
        const feed = await Feed.findById(req.params.feedId)
        if(feed)
        {
            if(req.body.userId && req.body.comment)
            {
                await feed.updateOne({ $push: { comments: {userId :req.body.userId , comment:req.body.comment}}})
                resp.status(200).json({message:"The comment has been added"})
            }
            else
            {
                resp.status(401).json({message:"user Id and comment cannot be null"})
            }
        }
        else
        {
            resp.status(401).json({message:"post does not found"})
        }
    } catch (err) {
        resp.status(500).json({message:err.message})
    }
}

//-----------------------------------FOR PUTTING LIKES---------------------------------
exports.putLikes = async(req,resp,next) =>
{
    try 
    {
        const feed = await Feed.findById(req.params.feedId)
        if(feed)
        {
            if(req.body.userId)
            {
                if (!feed.likes.includes(req.body.userId)) 
                {
                    await feed.updateOne({ $push: { likes: req.body.userId } })
                    resp.status(200).json({message:"The post has been liked"})
                } 
                else 
                {
                    await feed.updateOne({ $pull: { likes: req.body.userId } })
                    resp.status(200).json({message:"The post has been disliked"})
                }
            }
            else
            {
                resp.status(401).json({message:"userId can not be null"})
            }
        }
        else
        {
            resp.status(401).json({message:"post does not found"})
        }
    } catch (err) {
        resp.status(500).json({message:err.message})
        console.log("hi2")
      }
}

//------------------------------------FOR PAGINAION---------------------------------
exports.getFeeds = async(req,resp,next) =>
{
    const {page,limit} = req.query
    const mysort = {createdOn:-1}
    try
    {
        const feeds = await Feed.find().sort(mysort).limit(limit*1).skip((page-1)*limit)
        resp.status(200).json({total:feeds.length,feeds})
    } catch (err) {
        resp.status(500).json({message:err.message})
       
    }
}

