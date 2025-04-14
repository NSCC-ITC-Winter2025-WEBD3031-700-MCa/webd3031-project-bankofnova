
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Alert,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  IconButton,
  Collapse
} from "@mui/material";
import { IconListCheck, IconMail, IconUser } from "@tabler/icons-react";




const InfoPage = () => {
  const features = [
    { icon: <IconListCheck size={24} />, title: "Advanced API", description: "Powerful and flexible API integration" },
    { icon: <IconListCheck size={24} />, title: "Data Security", description: "Enterprise-grade security protocols" },
    { icon: <IconListCheck size={24} />, title: "Cloud Storage", description: "Unlimited secure cloud storage" },
    { icon: <IconListCheck size={24} />, title: "Performance", description: "Optimized for maximum efficiency" }
  ];

  const docLinks = [
    { icon: <IconListCheck size={24} />, text: "API Documentation", url: "#" },
    { icon: <IconListCheck size={24} />, text: "Code Examples", url: "#" },
    { icon: <IconListCheck size={24} />, text: "Community Hub", url: "#" },
    { icon: <IconListCheck size={24} />, text: "Latest Updates", url: "#" }
  ];


  return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h2" component="h1" gutterBottom>
              Enterprise Solutions
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Scale your business with our professional-grade tools and services
            </Typography>

            <Grid container spacing={3} mb={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        {feature.icon}
                        <Typography variant="h6" ml={1}>
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                </Grid>
              ))}
            </Grid>

            <Alert
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
            </Alert>

    
          </Grid>

          <Grid item xs={12} md={4}>
          </Grid>
        </Grid>
      </Container>
  );
};

export default InfoPage;
