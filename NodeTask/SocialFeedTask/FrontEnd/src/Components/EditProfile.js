import React from 'react'

function EditProfile() {
    return (
        <Grid>
          <Header />
        <Paper elevation={10}
        style={paperStyle}
        >
          <Grid align="center"  >
                   <Avatar
                    // size="large"
                    // aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    // color="inherit"
                    src={ image.filepreview&& image.filepreview}
                  />
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem  onClick={() => handleRemoveProfile()}>remove Profile Picture</MenuItem>
                    <MenuItem> change Profile Picture</MenuItem>
                    <MenuItem> <input type="file"  name="Change Profile Picture" onChange={(e) => {
                          handleIMG(e);
                        }}></input></MenuItem>
                  </Menu>
          <h2>Edit Profile</h2>
          </Grid>
          <TextField
            style={{width:'470px',marginTop: "20px"}}
            label="name"
            // error={erName}
            placeholder="Enter  name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextareaAutosize
            style={{width:'470px',marginTop: "20px", height:'45px', borderRadius: '5px'}}
            label="Bio"
            // error={erName}
            placeholder="Enter Bio"
            variant="outlined"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
            <InputLabel  style={{marginTop: "20px"}} id="demo-row-radio-buttons-group-label">
              Gender
            </InputLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              value={gender}
              name="radio-buttons-group"
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
            </RadioGroup>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Birth Date"
                value={DOB}
                onChange={(newValue) => {
                  setDOB(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          <TextField
            style={{width:'470px',marginTop: "20px"}}
            label="email"
             error={err.email}
            placeholder="Enter email address"
            variant="outlined"
            value={email}
            onChange={(e) => {setEmail(e.target.value);isValidmail(e.target.value)}}
            required
          />
           <TextField
              label="Mobile Number"
              style={{ width: '470px' ,marginTop: "20px"}}
              variant="outlined"
              error={err.mobNo}
              placeholder="Enter Mobile Number"
              value={mobNumber}
              onChange={(e) => {setMobNumber(e.target.value);isValidMobNumber(e.target.value)}}
            />
          <Button
            color="primary"
            onClick={() => {
              handleSubmit();
            }}
            variant="contained"
            style={btnstyle}
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              navigate('/feed');
            }}
            color='error'
            variant="contained"
            // style={btnstyle1}
          >
            Cancel
          </Button>
        </Paper>
        <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackSeverity} sx={{ width: '100%' }}>
              {snackMsg}
            </Alert>
          </Snackbar>
      </Grid>
      )
}

export default EditProfile