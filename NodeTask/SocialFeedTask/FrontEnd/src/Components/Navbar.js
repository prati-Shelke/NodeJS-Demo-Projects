import React,{useState,useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link, Navigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import {TextField} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import image2 from './cr7.jpeg'
import { Logout } from '@mui/icons-material';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const Navbar = () => {

    // const [userName,setUserName] = useState()
    const [userId, setUserId] = useState()
    const [CurrentUser,setCurrentUser] = useState(JSON.parse(localStorage.getItem('userData')))
    const [profilePicture, setProfilePicture] = useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null)

    const show = Boolean(anchorEl)
    const handleClick = (event) => 
    {
      setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => 
    {
      setAnchorEl(null);
    }

    let navigate = useNavigate()


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [currentPassword, setCurrentPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [openSnackBar, setOpenSnackBar] = useState(false);

    // const handleClick = () => {
      // setOpen(true);
    // };
  
    const handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenSnackBar(false);
    };

    const [token, setToken] = useState()

    // useEffect(() => {
    //     let temp = localStorage.getItem("token");
    //     setToken(temp)

    //     let temp1 = JSON.parse(localStorage.getItem("userData"))
    //     if(temp1.profilePicture)
    //     {
    //         setProfilePicture(temp1.profilePicture)
    //     }
    //     else
    //     {
            
    //         let firstName = temp1.firstname
    //         let lastName = temp1?temp1.lastname:""
    //         setUserName(firstName+lastName)
    //     }
    //     setUserId(temp1._id)
       
    // },[])
    // console.log(userName)

    const changePassword = async() => {
        let url = `http://192.168.0.22:5000/change-password/${userId}`
        let response = await axios.put(url, {password:currentPassword,newPassword:confirmPassword,userId:userId},{
            headers: {Authorization:JSON.parse(token)}
            })
            setOpen(false)
    }

    const Logout = () => {
        localStorage.clear()
        navigate('/login')
    }
    
   

    return (
        <AppBar position="fixed" sx={{ bgcolor: "light-blue", mb:4 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link to="/"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, textDecoration: "none" }}
                        >
                            AM Social Feed
                        </Typography>
                    </Link>
                    <Stack direction="row" spacing={2} >
                        {/* {profilePicture?
                        <Avatar 
                        height="50"
                        sx={{ml:158}}
                        alt="Profile Picture" 
                        src={profilePicture && ""}
                        onClick={handleClick}
                        />:
                            <Avatar
                            sx={{bgcolor:deepOrange[500],ml:158}}
                            aria-controls={show ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={show ? 'true' : undefined}
                            onClick={handleClick}
                            >
                    
                        </Avatar>} */}
                        <div style={{display:"flex"}}>
                            <Avatar
                                size="large"
                                sx={{bgcolor:deepOrange[500],ml:98}}
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleClick}
                                color="inherit"
                                src={`http://192.168.0.22:5000/${CurrentUser.profilePicture}`}
                            >
                            </Avatar>
                            <a style={{margin:'10px 10px'}}>{CurrentUser.firstName}{' '}{CurrentUser.lastName}</a>
                        </div>
                    </Stack>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={show}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={()=>navigate('/edit-profile')}>Edit Profile</MenuItem>
                        <MenuItem onClick={handleOpen}>Change Password</MenuItem>
                        <MenuItem onClick={()=>Logout()}>Logout</MenuItem>
                    </Menu>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                    <Box sx={style}>
                        <TextField
                        id="currentpassword"
                        type="password"
                        label="Current Password"
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mb:2, width: 300, color: "primary" }}
                        onChange={(e)=>setCurrentPassword(e.target.value)}
                        required
                        />
                        <br />
                        <TextField
                        id="newpassword"
                        type="password"
                        label="New Password"
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mb:2,width: 300, color: "primary" }}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        required
                        />
                        <br />
                        <TextField
                        id="confirmpassword"
                        type="password"
                        label="Confirm Password"
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mb:2,width: 300, color: "primary" }}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        required
                        />
                        <br />
                    <Button
                    // type="submit"
                    variant="contained"
                    color="success"
                    onClick = {()=>changePassword()}
                    >
                    Submit
                    </Button>
                    </Box>
                    </Modal>
                    {/* <Box sx={{ justifyContent: 'flex-end', flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        {pages.map((page) => (

                            <Button
                                key={page.text}
                                sx={{ my: 2, color: 'white', display: 'block', textDecoration: "none" }}
                            >
                                <Link to={`${page.path}`} key={`${page.path}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "white"
                                    }}

                                >
                                    {page.text}
                                </Link>
                            </Button>

                        ))}
                    </Box> */}
                </Toolbar>
                <Snackbar 
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                open={open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackBar}
                >
                    <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
                        Password updated
                    </Alert>
                </Snackbar>
            </Container>
        </AppBar>
    );
};
export default Navbar;
