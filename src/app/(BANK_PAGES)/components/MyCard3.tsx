'use client';

import { IconListCheck, IconMail, IconUser } from "@tabler/icons-react";
import { Container, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Button, Grid } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { useMediaQuery, useTheme } from "@mui/material";



const MyCard3 = () => {
   const theme = useTheme();
      const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
      const xlUp = useMediaQuery(theme.breakpoints.up("xl"));
  const features = [
    { title: "Advanced API", description: "Powerful and flexible API integration" },
    { title: "Data Security", description: "Enterprise-grade security protocols" },
    { title: "Cloud Storage", description: "Unlimited secure cloud storage" },
    { title: "Performance", description: "Optimized for maximum efficiency" }
  ];


  return (
    <>
    

<Grid
  container
  xs={12}
  md={12}
  p={0}
  m={0}
  sx={{
    borderRadius: '16px',
    marginTop: "20px",
    height: '240px',
    display: 'flex', // Ensure it's a flex container
    justifyContent: 'center', // Centers horizontally
    alignItems: 'center', // Centers vertically
    maxWidth: xlUp ? '94% !important' : '100% !important',
    marginLeft: 'auto',
    marginRight: 'auto', // Center the grid
    backgroundColor: theme.palette.primary.light, // Set background color to white
    textAlign: 'center'
  }}
>   
<List>
                        <Typography variant="h1" fontWeight="600" fontSize="28px" color="text.primary">
            

          Open a Savings Account with Bank of Nova
                      </Typography>
          
                      <Typography variant="h5" color="text.secondary"  fontSize="18px" paragraph>
          
          Sign up to bank with us and open a Savings Account online or in our app in a few clicks.
                       </Typography>
                       </List>
       {/*   <List>

           
             {["Lorem ipsum dolor sit amet consectetur adipisicing elit.",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",]
            .map((feature) => (
              <ListItem key={feature}>
                <ListItemIcon>
                  <CheckBoxIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))} 
          </List> */}

    </Grid>



            {/* <Alert
              severity="info"
              variant="outlined"
              sx={{ mb: 4 }}
              action={
                <Button color="info" size="small">
                  Learn More
                </Button>
              }
            >
              Unlock advanced features and dedicated support with our Enterprise Plan
            </Alert> */}



         </>
  );
};

export default MyCard3;
