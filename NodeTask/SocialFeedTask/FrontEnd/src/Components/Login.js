import React,{useEffect,useState} from 'react'
import { Card,CardHeader,Box,Container,TextField,Button,Typography,Link } from '@mui/material';
import GoogleLogin from 'react-google-login';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { validateDate } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function Login() {
    let navigate = useNavigate()
    // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmY2ZWMxMzEwNTk5MjhhMTFmNGIzNiIsImVtYWlsIjoiYWFhYUBhYS5pbiIsImlhdCI6MTY1MTQ3MDAxNywiZXhwIjoxNjUxNDczNjE3fQ.6YNI9LdbSw3d3_aXxFyRZoVEwu11cvWtOR5XAXJkuiE"
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [errors,setErrors]=useState({email:'',password:''})
    const [token,setToken] = useState()
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
const validate=()=>{
  let flag=false
if(email === ''){
  setErrors((prevState)=> errors={...prevState.error,email:"Enter E"})
}

  if(flag){
    return true
  }else{
    return false
  }
}
    // useEffect(() => {
    //     axios.post('http://192.168.0.22:5000/login',{email:"aaaa@aa.in",password:"ssssss@123"},{headers:{token:token}})
    //     .then((response) => {
    //     // setState(response.data.states)
    //     console.log(response);

    //     // const current_state = state.state_id
    //     // console.log(current_state);
    //  });
    //  },[])

    const Login = async () => {
        let loginData = {
            email : email,
            password : password
        }

        // if(validate()){
          await axios.post('http://192.168.0.22:5000/login',loginData)
          .then((response) => {
              console.log(response);
              setToken(response.data.accessToken);
              localStorage.setItem("token",JSON.stringify(`Bearer ${response.data.accessToken}`));
              localStorage.setItem("userData",JSON.stringify(response.data.user))
            })
            setOpen(true);
        // }
        // 
        //   let temp = localStorage.getItem("token");
        //     if(temp == ""){
        //         console.log("local set");
        //     }
        //     else{
        //         console.log("local not set");
        //     }
        
            setTimeout(() => {
                navigate('/feed')
            }, 1000);
    }

    const responseGoogle = async(res) => {
        // console.log(res.Lu.Bv);
       await axios
          .post("http://localhost:8080/api/auth/google_Login", { email: res.Lu.Bv })
          .then((res) => {
            if (res.data.status !== false) {
              if (res !== "user not found" && res.data.token !== "undefined") {
                console.log(res);
                if(res.data.accessToken){
                  // localStorage.setItem("token", JSON.stringify(res.data.token));
                  localStorage.setItem('token',JSON.stringify(res.data.accessToken))
                  localStorage.setItem('userData',JSON.stringify(res.data.user))
                }
                res.data.token &&
                  localStorage.setItem("id", JSON.stringify(res.data.user._id));
                navigate("/feed");
              }
            } else {
              alert("Gmail Account Not Found");
            }
          });
      };

  return (
    <React.Fragment>
        <Container maxWidth="xl" sx={{ bgcolor: '#ccc', display: "flex", justifyContent: "center" }}
            >
                <Card sx={{ maxWidth: "50%", my: 10, textAlign: 'center', overflow: "auto" }}>
                  <Typography sx={{ mt:2,fontSize: 29, textAlign: 'center' }} color="text.secondary" gutterBottom>
                      Login
                  </Typography>
                  <br />
                    <Box
                    component="form"
                    sx={{'& > :not(style)': { mx: 4, my: 1 }
                    }}
                    >
                    <br />
                    <TextField
                    id="email"
                    type="email"
                    label="Email"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, color: "primary" }}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    />
                    <br />
                    <TextField
                    id="password"
                    type="password"
                    label="Password"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, color: "primary" }}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                    />
                    <br />
                    <Button 
                    // type="submit"
                    variant="contained"
                    color="success"
                    onClick = {()=>Login()}
                    >
                    Login
                    </Button>
                    <br />
                    <GoogleLogin
                        clientId="762736905727-u4gko4aeh379p4g9qt4rh067e2hhdclc.apps.googleusercontent.com"
                        render={renderProps => (
                            <Button variant="contained"
                            onClick={renderProps.onClick} 
                            disabled={renderProps.disabled}>
                            {/* sx={{mb:2}} */}
                                Login with google
                            </Button>
                        )}
                        buttonText="Login"
                        onSuccess={responseGoogle}
                        // onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                    <br />
                    <br />
                    <Typography>Don't have an account? <Link href="#" onClick={()=>navigate('/sign-up')}>Sign up!</Link></Typography>
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
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Login successfull!
                    </Alert>
                </Snackbar>
        </Container>
    </React.Fragment>
  )
}

export default Login