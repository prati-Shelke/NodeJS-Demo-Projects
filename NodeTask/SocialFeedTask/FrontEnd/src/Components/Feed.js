import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  styled,
  CardMedia,
  IconButton,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { red } from "@mui/material/colors";
import axios from "axios";
import Navbar from "./Navbar";
import UploadFeed from "./UploadFeed";
// import image1 from './398086.jpg'
// import image2 from './cr7.jpeg'
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Feed() {
  const [expanded, setExpanded] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [userId, setUserId] = useState();
  const [postId, setPostId] = useState();
  const [likes, setLikes] = useState();
  const [comment, setComment] = useState("");
  const [newPostUploaded, setNewPostUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState();
  const [next, setNext] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [CurrentUser,setCurrentUser] = useState(JSON.parse(localStorage.getItem('userData')))
  let token = localStorage.getItem("token");
  let [AllUser,setAllUser] = useState([])
  
  

  useEffect(() => {

    const fetchData = async() =>
    {
      let response = await axios.get(`http://192.168.0.22:5000/getAllUser`)
      setAllUser(response.data)
    }
    fetchData()
  },[])


  useEffect(() => {
    // setTimeout(() => {
    axios
      .get("http://192.168.0.22:5000/getFeeds?page=1&limit=6", {
        headers: { Authorization: JSON.parse(token) },
      })
      .then((response) => {
        // console.log(response)
        setAllPosts(response.data.feeds);
        // setNext(response.data.next.page)
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
    axios
      .get("http://192.168.0.22:5000/getAllFeeds", {
        headers: { Authorization: JSON.parse(token) },
      })
      .then((response) => {
        // console.log(response)
        setTotalPosts(response.data.length);
      });
    // }, 5000);
    let temp = JSON.parse(localStorage.getItem("userData"));
    // console.log("temp");
    setUserId(temp._id);
  }, [newPostUploaded, likes, comment]);
  // console.log(allPosts)

  const handleExpandClick = () => {
    setExpanded((expanded) => !expanded);
  };

  const handleLikes = async (id) => {
   
    let url = `http://192.168.0.22:5000/likes/${id}`;
    await axios.put(url, { userId: userId });
    setLikes("");
  };
  const handleComment = async (id) => {
    let url = `http://192.168.0.22:5000/comments/${id}`;
    let commentData = { userId: userId, comment: comment };
    await axios.put(url, commentData);
    setComment("");
  };

  const fetchData = async () => {
    const result = await axios.get(
      `http://192.168.0.22:5000/getFeeds?page=${next}&limit=2`,
      { headers: { Authorization: JSON.parse(token) } }
    );
    // .then((response) => {
    // console.log(response)
    // setAllPosts([...allPosts,response.data.results]);
    // setNext(response.data.next.page)
    // setTimeout(() =>{
    //   setLoading(false)
    // },2000)
    // } )
    return result.data.results;
  };
  const fetchData1 = async () => {
    // const data = await fetchData();
    // //  console.log(data)
    // setTimeout(() => {
    //   setAllPosts([...allPosts, ...data]);
    // }, 2000);
    // if (data.length === 0 || data.length < 2) {
    //   setHasMore(false);
    // }
    // setNext(next + 1);
  };

  return (
    <React.Fragment>
      <Navbar />
      <UploadFeed post={{ setNewPostUploaded }} />
      <Container
        maxWidth="xl"
        sx={{
          bgcolor: "#ccc",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <InfiniteScroll
          dataLength={allPosts.length} //This is important field to render the next data
          next={fetchData1}
          hasMore={hasMore}
          loader={
            <Skeleton
              sx={{ height: 550 }}
              animation="wave"
              variant="rectangular"
            />
          }
          endMessage={
            <a style={{ textAlign: "center" }}>
              <b>You have seen all posts</b>
            </a>
          }
        >
          {allPosts
            ? allPosts.map((post, index) => (
                <Card sx={{ mt: 3, maxWidth: 745 }} key={post._id}>
                  {loading ? (
                    <Skeleton
                      sx={{ height: 550 }}
                      animation="wave"
                      variant="rectangular"
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="550"
                      image={`http://192.168.0.22:5000/${post.photo}`}
                      alt="Paella dish"
                      name="photo"
                    />
                  )}

                  <CardContent>
                    {loading ? (
                      <Skeleton animation="wave" variant="body1" />
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: 20 }}
                      >
                        {post.caption}
                        {/* {post._id} */}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions disableSpacing>
                    {loading ? (
                      <Skeleton
                        animation="wave"
                        variant="h3"
                        sx={{ width: 750 }}
                      />
                    ) : (
                      <>
                        <IconButton aria-label="add to favorites">
                          <FavoriteIcon
                            onClick={() => {
                              handleLikes(post._id);
                              setLikes(post.likes.length);
                            }}
                            sx={
                              post.likes.includes(userId)
                                ? { color: "red" }
                                : { color: "" }
                            }
                          />
                        </IconButton>
                        {post.likes.length > 0 ? (
                          <Typography sx={{ mr: 2 }}>
                            {post.likes.length}
                          </Typography>
                        ) : null}
                        <TextField
                          id="email"
                          label="Write a comment"
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ mr: 3, width: 500, color: "primary" }}
                          onChange={(e) => setComment(e.target.value)}
                          // required
                        ></TextField>
                        <Button
                          variant="outlined"
                          color="primary"
                          component="span"
                          onClick={() => handleComment(post._id)}
                        >
                          Comment
                        </Button>
                        <ExpandMore
                          expand={expanded}
                          onClick={() => handleExpandClick()}
                          aria-expanded={expanded}
                          aria-label="show more"
                        >
                          <ExpandMoreIcon />
                        </ExpandMore>
                      </>
                    )}
                  </CardActions>

                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>Comments:</Typography>
                      <br />
                      <Typography>
                        {post.comments.map((comment) => (
                          AllUser.length && AllUser.map((user)=>
                          user._id === comment.userId &&
                          (<div  style={{display:'flex'}}>
                            <Avatar src={`http://192.168.0.22:5000/${user.photo}` && ""}/> 
                            <a style={{margin:"10px 10px",fontWeight:'bold'}}> {user.firstName } {user.lastName} : </a>
                            <a style={{margin:"10px 10px"}}> {comment.comment}</a>
                            <br/>
                          </div>) 
                        )))}
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              ))
            : null}
        </InfiniteScroll>
      </Container>
    </React.Fragment>
  );
}

export default Feed;
