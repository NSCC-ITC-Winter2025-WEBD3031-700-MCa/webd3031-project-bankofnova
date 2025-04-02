"use client";
import { styled, Container, Box } from "@mui/material";
import React, { useState } from "react";
import Header from "./layout/header/Header";
import Sidebar from "./layout/sidebar/Sidebar";
import Footer from "./footer/Footer"
import { usePathname } from "next/navigation";
import Footersmall from "./footer2/smallFooter"
import BankCardRow from "./components/blocks/BankCardRow";
import Subheader from "./subheader/subheader"; // Import your Subheader component

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const showFooter = ["/", "/login"].includes(pathname);
  const showHomeCard = "/".includes(pathname);
  const showFootersmall = ["/accounts/chequing", "/overview", "/accounts/savings"].includes(pathname);



    // Define pages where subheader should appear
    const isSubheaderPage = [
      "/overview",
      "/transactions/transfer/confirm",
      "/accounts/chequing",
      "/accounts/savings",
      "/transactions/transfer",
      "/transactions/deposit",
      "/transactions/movemoney",
    ].includes(pathname);

  // Function to toggle the mobile sidebar
  const onMobileSidebarToggle = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <MainWrapper className="mainwrapper">
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        onMobileSidebarToggle={onMobileSidebarToggle} // Passing the toggle function here
      />
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper">
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        <Header toggleMobileSidebar={onMobileSidebarToggle} />
              {/* Conditionally render Subheader */}
      {/* {isSubheaderPage && <Subheader toggleMobileSidebar={onMobileSidebarToggle} />} */}
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "1200px",
          }}
        >
          {/* ------------------------------------------- */}
          {/* Page Route */}
          {/* ------------------------------------------- */}
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>

        {showHomeCard && <BankCardRow />}
        {showFooter && <Footer />}
        {/* {showFootersmall && <Footersmall />} */}
      </PageWrapper>
    </MainWrapper>
  );
}
