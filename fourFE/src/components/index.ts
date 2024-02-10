import { Box, Button, Container, Typography, styled } from "@mui/material";

const FormBox = styled(Box)({
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  width: 500,
  minWidth: 500
})

const HeroSectionTitleContainer = styled(Container)({
  textAlign: 'left',
})

const FormPageContainer = styled(Box)({
  display: 'flex',
  placeItems: 'center',
  minWidth: 320,
  justifyContent: 'center',
  minHeight: '100vh'
})

const HomePageWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
  alignItems: 'center',
})

const GameTitle = styled(Typography)({
  fontWeight: 'bold',
  display: 'inline',
  variant: 'h2'
})

const NavBarItem = styled(Button)({
  '&:hover': {
    color: 'unset',
  }
})

export { FormBox, HeroSectionTitleContainer, FormPageContainer, HomePageWrapper, GameTitle, NavBarItem }