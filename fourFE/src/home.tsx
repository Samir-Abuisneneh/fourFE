import { Typography, Button, Link, Grid } from '@mui/material';
import { GameTitle, HeroSectionTitleContainer, HomePageWrapper } from './components';
import HeroImage from "./assets/hero-section-image.svg"
import './App.css'

const Home = () => {

  return (
    <>
      <HomePageWrapper>
        <Grid style={{ width: '50%' }} container spacing={2} columns={16}>
          <Grid item xs={8}>
            <HeroSectionTitleContainer>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to <GameTitle variant='h2' color="primary.main"> Four</GameTitle> Game
              </Typography>
              <Typography color={'grey'} variant="h5" paragraph>
                Start playing and have fun
              </Typography>
              <div>
                <Link href="/login">
                  <Button variant="contained" color="primary" size="large" style={{ marginRight: '16px' }}>
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outlined" color="primary" size="large">
                    Register
                  </Button>
                </Link>
              </div>
            </HeroSectionTitleContainer>
          </Grid>
          <Grid item xs={8}>
            <img src={HeroImage} height={400} />
          </Grid>
        </Grid>
        <div className="custom-shape-divider-bottom-1707520781">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </HomePageWrapper>
    </>
  )
}

export default Home
