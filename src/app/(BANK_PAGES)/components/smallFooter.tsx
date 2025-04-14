import React from "react";
import { Box, useTheme } from "@mui/material";
import { styled } from "@mui/system";

// Define a custom interface for ContentBox props
interface ContentBoxProps {
  footerHeight: number; // Accept footerHeight prop
}

// Styled component for the footer
const FooterBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  textAlign: "center",
}));

// ContentBox does not need minHeight anymore, but adds flexGrow to push footer down
const ContentBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "footerHeight", // Prevent `footerHeight` from being passed to the DOM
})<ContentBoxProps>(({ footerHeight }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1, // This will allow the content area to grow and push the footer down
  marginBottom: footerHeight, // Ensure space for footer at the bottom
}));

const Footersmall = () => {
  const theme = useTheme();
  const footerHeight = 60; // Approximate footer height (can be adjusted as per your footer's height)

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#cdcdcd",
        flexDirection: "column",
      }}
    >
      {/* Only pass the footerHeight prop to ContentBox */}
      <ContentBox footerHeight={footerHeight}>
        {/* Your main content goes here */}
        <Box>
          {/* Main page content */}
        </Box>
      </ContentBox>
    </Box>
  );
};

export default Footersmall;
