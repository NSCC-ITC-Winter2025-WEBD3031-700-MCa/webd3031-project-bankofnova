"use client"; // Ensure this runs only on the client side

import React, { useState } from "react";
import { Box, AppBar, Toolbar, styled, Stack, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Import auth functions
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material"; // Import useMediaQuery

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Subheader = ({ toggleMobileSidebar }: ItemType) => {
  return <SubheaderContent toggleMobileSidebar={toggleMobileSidebar} />;
};

const SubheaderContent = ({ toggleMobileSidebar }: ItemType) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const smUp = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: "white",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  }));

  if (status === "loading") {
    return (
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          <Box>Loading...</Box>
        </ToolbarStyled>
      </AppBarStyled>
    );
  }

  const isSubheaderPage = [
    "/overview",
    "/transactions/transfer/confirm",
    "/accounts/chequing",
    "/accounts/savings",
    "/transactions/transfer",
    "/transactions/deposit",
    "/transactions/movemoney",
  ].includes(pathname);

  return (
    <>


      {/* Subheader component */}
      {isSubheaderPage && (
        <Box sx={{ backgroundColor: "lightgray", padding: "10px 0", textAlign: "center" }}>
          <Typography variant="h6">Subheader Content</Typography>
        </Box>
      )}
    </>
  );
};

Subheader.propTypes = {
  sx: PropTypes.object,
};

export default Subheader;
