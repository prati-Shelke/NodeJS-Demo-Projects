import React,{ useState, useEffect } from 'react';
import { Card,CardHeader,styled,CardMedia,IconButton,red,FavoriteIcon,ShareIcon,ExpandMoreIcon,MoreVertIcon,CardContent,CardActions,Collapse,Avatar,Box,Container,TextField,Button,Typography,Link } from '@mui/material';
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function UploadFeed(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [caption,setCaption] = useState()
  const [isSucces, setSuccess] = useState(null);
  const [token, setToken] = useState()
  const [userId, setUserId] = useState()
  const [userInfo, setuserInfo] = useState({
    file:[],
    filepreview:null,
   });
   const [open, setOpen] = useState(false);

   const handleClick = () => {
    setOpen(true);
   };
 
   const handleClose = (event, reason) => {
     if (reason === 'clickaway') {
       return;
     }
     setOpen(false);
   };

   const {setNewPostUploaded} = props.post
  
  useEffect((event) => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
    setuserInfo({
      ...userInfo,
      file:selectedImage,
      filepreview:imageUrl,
    });
  }, [selectedImage,caption]);

  useEffect(() => {
    let temp1 = localStorage.getItem("token");
    setToken(temp1)
    let temp2 = JSON.parse(localStorage.getItem("userData"))
    setUserId(temp2._id)
    // console.log(temp2);
  }, [])
  

  const Post = () => {
    // console.log(token);
    // console.log(userInfo.file);
    const formdata = new FormData();
    formdata.append('photo', userInfo.file);
    formdata.append('desc',caption)
    formdata.append('userId',userId)

    axios.post("http://localhost:8080/api/posts", formdata,{
        headers: {Authorization:JSON.parse(token)}
    })
    .then(res => { // then print response status  
      console.warn(res);
      if(res.data.success === 1){
        setSuccess("Image upload successfully");
      }
      setNewPostUploaded(prev=>!prev)
    })
    setSelectedImage(null)
    setImageUrl(null)
    setuserInfo({file:[],
      filepreview:null})
    setCaption('')
    setOpen(true)
    // console.log(selectedImage);
    // console.log(imageUrl);
    // console.log(caption);
    console.log(formdata);
  }
  return (
    <>
    <React.Fragment>
        <Container maxWidth="xl" sx={{bgcolor: '#ccc', display: "flex", justifyContent: "center" }}
            >
            <Card sx={{ width: 745, mt: 10, textAlign: 'center', overflow: "auto" }}>
            <Box
            component="form"
            sx={{width: 745}}
            >
            <br />
            <Typography sx={{ mt:2,fontSize: 29, textAlign: 'center' }} color="text.secondary" gutterBottom>
              New Post
            </Typography>
            <br />
            <input
              accept="image/*"
              type="file"
              id="select-image"
              style={{ display: 'none' }}
              onChange={e => setSelectedImage(e.target.files[0])}
            />
            <label htmlFor="select-image">
              <Button variant="outlined" color="primary" component="span">
                Img
              </Button>
            </label>
            {imageUrl && selectedImage && (
              <Box mt={2} textAlign="center">
                <div>Post Preview:</div>
                <img src={imageUrl} alt={selectedImage.name} height="150px" />
              </Box>
            )}
            <TextField
            id="name"
            label="Write a Caption.."
            color="primary"
            variant="outlined"
            size="small"
            sx={{ ml:2,width: 300, color: "primary" }}
            value={caption}
            onChange={(e)=>setCaption(e.target.value)}
            required
            />
            <br />
            <Button 
            variant="contained"
            color="primary"
            component="span"
            onClick={()=>Post()}
            sx={{my:2}}
            >
            Post
            </Button>
            </Box>
            </Card>
            <Snackbar 
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              open={open} 
              autoHideDuration={6000} 
              onClose={handleClose}
              >
              <Alert onClose={handleClose} severity="info" sx={{ mt:4,width: '100%' }}>
                  New Post Added
              </Alert>
            </Snackbar>
        </Container>
    </React.Fragment>
    </>
  );
};

export default UploadFeed;