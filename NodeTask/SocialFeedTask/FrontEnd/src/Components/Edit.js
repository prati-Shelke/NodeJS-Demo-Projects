import React,{useState,useEffect} from 'react'
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography, TextField, Card, CardHeader,TextareaAutosize,Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Navbar from './Navbar';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {useNavigate} from 'react-router-dom'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function Edit() {
    const [value, setValue] = useState();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [userInfo, setuserInfo] = useState({
        file:[],
        filepreview:null,
    });
    const [currentUserData, setCurrentUserData] = useState()
    const [token, setToken] = useState()
    const [open, setOpen] = useState(false);

    // const handleClick = () => {
      // setOpen(true);
    // };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    let navigate = useNavigate()


    useEffect(() => {
    let temp = JSON.parse(localStorage.getItem("userData"))
    // console.log(temp.firstname);
    setCurrentUserData(temp)
    let temp1 = localStorage.getItem("token");
    setToken(temp1)
    }, [])
  

    useEffect((event) => {
        if (selectedImage) {
          setImageUrl(URL.createObjectURL(selectedImage));
        }
        setuserInfo({
          ...userInfo,
          file:selectedImage,
          filepreview:imageUrl,
        });
      }, [selectedImage]);

    const handleName = (name) => {
        setCurrentUserData({...currentUserData,firstname:name})
        // setCurrentUserData({...currentUserData,profilePicture:}
    }

    const handleBio = (bio) => {
        setCurrentUserData({...currentUserData,bio:bio})
    }

    const handleEmail = (email) => {
        setCurrentUserData({...currentUserData,email:email})
    }

    const handleBirthDate = (date) => {
        date.split('T',[0])
        setCurrentUserData({...currentUserData,dob:date})
    }

    const handleMobile = (number) => {
        setCurrentUserData({...currentUserData,mobileNumber:number})
    }

    const handleGender = (gender) => {
        setCurrentUserData({...currentUserData,gender:gender})
    }

    const editProfile = async () => {
        const formdata = new FormData();
        formdata.append('image', userInfo.file);
        formdata.append('firstname', currentUserData.firstname )
        formdata.append('lastname', currentUserData.lastname )
        formdata.append('userId', currentUserData._id )
        formdata.append('isAdmin', true )
        formdata.append('gender', currentUserData.gender)
        formdata.append('dob', currentUserData.dob )
        formdata.append('email',currentUserData.email)

        let url = `http://localhost:8080/api/users/${currentUserData._id}`
        let response = await axios.put(url, formdata,{
        headers: {Authorization:JSON.parse(token)}
        })

        localStorage.setItem("userData",JSON.stringify(response.data.user1))
        setOpen(true)
        setTimeout(() => {
            navigate('/feed')
        }, 1000);
        // console.log(response);
        // console.log(formdata)
        // console.log(url);
        // console.log(currentUserData.birthDate);
        // console.log(currentUserData._id );
        // console.log(token);
    }

    console.log(userInfo.file);
    console.log(currentUserData)
    return (
        <React.Fragment>
            <Navbar />
            <Container maxWidth="xl" sx={{ bgcolor: '#ccc',display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <Card sx={{ maxWidth: "50%", my: 10, textAlign: 'center', overflow: "auto" }}>
                    <Box
                        component="form"
                        sx={{mx:4,my:1}}
                    >
                        <br />
                        <Typography sx={{ fontSize: 29, textAlign: 'center' }} color="text.secondary" gutterBottom>
                            Edit Profile
                        </Typography>
                        <br />
                        <input
                            accept="image/*"
                            type="file"
                            id="select-image"
                            style={{ display: 'none' }}
                            onChange={e =>setSelectedImage(e.target.files[0])}
                        />
                        <label htmlFor="select-image">
                            <Button
                            variant="outlined" 
                            color="primary" 
                            component="span"
                            sx={{mb:2}}
                            >
                                Add/Update Profile Picture 
                            </Button>
                        </label>
                        {imageUrl && selectedImage && (
                            <Box mt={2} textAlign="center">
                                <div>Profile Picture Preview:</div>
                                <img src={imageUrl} alt={selectedImage.name} height="150px" />
                            </Box>
                        )}
                        <br />
                        {/* <TextField
                            id="outlined-basic"
                            label="Name"
                            variant="outlined"                           
                            required
                        /> */}
                        <TextField
                        id="outlined-helperText"
                        // label="Name"
                        value={currentUserData !== undefined?currentUserData.firstname:null}
                        onChange={(e)=>handleName(e.target.value)}
                        sx={{mb:2}}
                        required
                        />
                        {/* </TextField> */}
                        <br />
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Enter Bio"
                            style={{ bgcolor: '#b3e5fc', width: 240, marginBottom: "15px" }}
                            onChange={(e)=>handleBio(e.target.value)}
                        />
                        <br />
                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                                onChange={(e)=>handleGender(e.target.value)}
                                required
                            >
                                <Box sx={{ display: 'flex' }}>
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </Box>
                            </RadioGroup>
                        </FormControl>
                        <br />
                        <TextField
                            id="date"
                            label="Date of Birth"
                            type="date"
                            defaultValue="2017-05-24"
                            sx={{ width: 220, mb: 2 }}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={(e)=>handleBirthDate(e.target.value)}
                        />
                        <br />
                        <TextField
                        id="outlined-basic" 
                        // label="Email" 
                        value={currentUserData !== undefined?currentUserData.email:null}
                        variant="outlined"
                        sx={{ mb: 2 }}
                        onChange={(e)=>handleEmail(e.target.value)}
                        required
                        />
                        <br />
                        <TextField
                        id="outlined-basic"
                        label="Mobile"
                        variant="outlined"
                        onChange={(e)=>handleMobile(e.target.value)}
                        sx={{ mb: 2 }} 
                        />
                    </Box>
                    <Button 
                    variant="contained"
                    sx={{mb:3}}
                    onClick={()=>editProfile()}
                    >
                    Submit
                    </Button>
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
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Profile edited
                    </Alert>
                </Snackbar>
            </Container>
        </React.Fragment>
    )
}

export default Edit