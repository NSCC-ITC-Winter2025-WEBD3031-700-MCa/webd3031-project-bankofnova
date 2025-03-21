'use client';
import { Paper, Box, Typography, Grid, CardContent } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import DashboardCard2 from '@/app/(DashboardLayout)/components/shared/noElevateCard';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

const Shadow = () => {
  return (
    <PageContainer title="Homepage" description="this is Homepage">

      {/* <DashboardCard title="Shadow">
        <Grid container spacing={2}>
          {[lightTheme, darkTheme].map((theme, index) => (
            <Grid item xs={6} key={index}>
              <ThemeProvider theme={theme}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    display: 'grid',
                    gridTemplateColumns: { md: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((elevation) => (
                    <Item key={elevation} elevation={elevation}>
                      {`elevation=${elevation}`}
                    </Item>
                  ))}
                </Box>
              </ThemeProvider>
            </Grid>
          ))}
        </Grid>
      </DashboardCard> */}

<DashboardCard2 title="TEST">
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
    <Box>
      <BlankCard>
        <CardContent>
          <Typography variant="h1">11111111</Typography>
          <Typography variant="body1" color="textSecondary">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis quibusdam maiores officia explicabo. Quis voluptatibus eius neque molestiae magni sapiente ipsam ab optio placeat fugit nobis totam, mollitia in obcaecati!
          </Typography>
        </CardContent>
      </BlankCard>
      </Box>
      <Box sx={{ mt: 2 }}>
      <BlankCard>
      <CardContent>
          <Typography variant="h1">Additional Card 1</Typography>
          <Typography variant="body1" color="textSecondary">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, earum?
          </Typography>
        </CardContent>
      </BlankCard>
      </Box>
    </Grid>
    <Grid item xs={12} sm={6}>
    <Box>
      <BlankCard>
        <CardContent>
          <Typography variant="h1">yyyyyyyyy</Typography>
          <Typography variant="body1" color="textSecondary">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis quibusdam maiores officia explicabo. Quis voluptatibus eius neque molestiae magni sapiente ipsam ab optio placeat fugit nobis totam, mollitia in obcaecati!
          </Typography>
        </CardContent>
      </BlankCard>
      </Box>
      <Box sx={{ mt: 2 }}>
      <BlankCard>
      <CardContent>
          <Typography variant="h1">Additional Card 2</Typography>
          <Typography variant="body1" color="textSecondary">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod, error!
          </Typography>
        </CardContent>
      </BlankCard>
      </Box>
    </Grid>
  </Grid>
</DashboardCard2>

<DashboardCard2 title="TEST">
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
    <Box>
      <BlankCard>
        <CardContent>
          <Typography variant="h1">11111111</Typography>
          <Typography variant="body1" color="textSecondary">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis quibusdam maiores officia explicabo. Quis voluptatibus eius neque molestiae magni sapiente ipsam ab optio placeat fugit nobis totam, mollitia in obcaecati!
          </Typography>
        </CardContent>
      </BlankCard>
      </Box>
      <BlankCard>
      <CardContent>
          <Typography variant="h1">Additional Card 1</Typography>
          <Typography variant="body1" color="textSecondary">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, earum?
          </Typography>
        </CardContent>
      </BlankCard>
    </Grid>
    <Grid item xs={12} sm={6}>
      <BlankCard>
        <CardContent>
          <Typography variant="h1">yyyyyyyyy</Typography>
          <Typography variant="body1" color="textSecondary">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis quibusdam maiores officia explicabo. Quis voluptatibus eius neque molestiae magni sapiente ipsam ab optio placeat fugit nobis totam, mollitia in obcaecati!
          </Typography>
        </CardContent>
      </BlankCard>
      <BlankCard>
      <CardContent>
          <Typography variant="h1">Additional Card 2</Typography>
          <Typography variant="body1" color="textSecondary">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod, error!
          </Typography>
        </CardContent>
      </BlankCard>
    </Grid>
  </Grid>
</DashboardCard2>
 
{/* <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard title="Default Text">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h1">h1. Heading</Typography>
                    <Typography variant="body1" color="textSecondary">
                      font size: 30 | line-height: 45 | font weight: 500
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h2">h2. Heading</Typography>
                    <Typography variant="body1" color="textSecondary">
                      font size: 24 | line-height: 36 | font weight: 500
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h3">h3. Heading</Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 21 | line-height: 31.5 | font weight: 500
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h4">h4. Heading</Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 18 | line-height: 27 | font weight: 500
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5">h5. Heading</Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 16 | line-height: 24 | font weight: 500
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h6">h6. Heading</Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 14 | line-height: 21 | font weight: 500
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="subtitle1">
                      subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                      tenetur
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 16 | line-height: 28 | font weight: 400
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="subtitle2">
                      subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                      tenetur
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 14 | line-height: 21 | font weight: 400
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="body1">
                      body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 16 | line-height: 24 | font weight: 400
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="body2">
                      body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 14 | line-height: 20 | font weight: 400
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="caption">
                      caption. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                      tenetur
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 12 | line-height: 19 | font weight: 400
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="overline">
                      overline. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                      tenetur
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      font size: 12 | line-height: 31 | font weight: 400
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
            </Grid>

          </DashboardCard>
        </Grid>
        <Grid item sm={12}>
          <DashboardCard title="Default Text">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" color="textprimary">
                      Text Primary
                    </Typography>

                    <Typography variant="body1" color="textprimary">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" color="textSecondary">
                      Text Secondary
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.info.main }}>
                      Text Info
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.info.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.primary.main }}>
                      Text Primary
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.primary.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.warning.main }}>
                      Text Warning
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.warning.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.error.main }}>
                      Text Error
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.error.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.success.main }}>
                      Text Success
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.success.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid > */}

    </PageContainer>
  );
};

export default Shadow;
