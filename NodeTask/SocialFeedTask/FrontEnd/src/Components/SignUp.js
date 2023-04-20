import React,{useState} from 'react'
import { Card,CardHeader,Box,Container,TextField,Button,Typography,Link } from '@mui/material';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function SignUp() {
    const [validPassword, setValidPassword] = useState()
    const [firstName,setFirstName] = useState()
    const [lastName,setLastName] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [signUpData,setSignUpData] = useState()
    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let navigate = useNavigate()
    const [open, setOpen] = useState(false);

    // const handleClick = () => {
    //   setOpen(true);
    // };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const checkPasswordValidity = (e) => {
        let password = e.target.value
        // console.log(password);
        if(password.length<6){
            setValidPassword(false)
            console.log("length not good");
        }
        else if(format.test(password)&&(/\d/.test(password))){
            setValidPassword(true)
            console.log("includes symbol&number");
        }
        // else if{(/\d/.test(password))
        //     setValidPassword(true)
        //     console.log("includes number");
        // }
    }

    const SignUpButton = async () => {
        let temp = {
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            
        }
        await axios.post('http://192.168.0.22:5000/sign-up', temp)
        setSignUpData(temp)
        console.log(temp);
        if(validPassword){
            // alert("Account created")
            setOpen(true)
            setTimeout(() => {
                navigate('/login')
              }, 1000);
        }
        else{
            alert("Password must include at least 6 characters,one symbol and number")
        }
        setOpen(true)
            setTimeout(() => {
                navigate('/login')
              }, 1000);
    }

  return (
    <React.Fragment>
        <Container maxWidth="xl" sx={{ bgcolor: '#ccc', display: "flex", justifyContent: "center" }}
            >
                <Card sx={{ maxWidth: "50%", my: 10, textAlign: 'center', overflow: "auto" }}>
                    <Box
                    component="form"
                    sx={{'& > :not(style)': { mx: 4, my: 1 }
                    }}
                    >
                    <br />
                    <Typography sx={{ mt:2,fontSize: 29, textAlign: 'center' }} color="text.secondary" gutterBottom>
                      Sign-up
                    </Typography>
                    <br />
                    <TextField
                    id="name"
                    label="First Name"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, color: "primary" }}
                    onChange={(e)=>setFirstName(e.target.value)}
                    required
                    />
                    <br />
                    <TextField
                    id="name"
                    label="Last Name"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ width: 300, color: "primary" }}
                    onChange={(e)=>setLastName(e.target.value)}
                    required
                    />
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
                    onChange={(e)=>{checkPasswordValidity(e);setPassword(e.target.value)}}
                    required
                    />
                    <br />
                    {/* {validPassword?
                    null
                    :
                    <>
                    <Typography
                    variant="subtitle2" 
                    >
                        Password must include at least one special character and one number
                    </Typography>
                    <br />
                    </>} */}
                    <Button 
                    // type="submit"
                    variant="contained"
                    color="primary"
                    onClick={()=>SignUpButton()}
                    >
                    SignUp
                    </Button>
                    <br />
                    <br />
                    <Typography>Already have an account? <Link href="#" onClick={()=>navigate('/login')}>Login!</Link></Typography>
                    </Box>
                  <Snackbar
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      open={open}
                      autoHideDuration={4000}
                      onClose={handleClose}
                  >
                      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                          Account Created!
                      </Alert>
                  </Snackbar>
                </Card>

        </Container>
    </React.Fragment>
  )
}

export default SignUp