"use client";
import { Card } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import AuthRegister from "../../../authentication/auth/AuthRegister";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function Register2() {
  const { data: session, status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status === "authenticated") {
      router.push("/overview");
    }

  }, [session, status, router]);


  return (
  <PageContainer title="Register" description="this is Register page">
    <Card
      elevation={0}
      sx={{
        p: 2,
        zIndex: 1,
        width: "100%",
        marginTop: '45px',
        marginBottom: '35px',
        // Adding responsive styles for different breakpoints
        "@media (max-width:600px)": {
          p: 0, // Less padding for small screens (phones)
          marginBottom: '25px',
        },
        "@media (max-width:960px)": {
          p: 0, // Adjust padding for medium-sized screens (tablets)
        },
        "@media (min-width:960px)": {
          width: "90%", // Keep the card width at 80% for medium to larger screens
          marginLeft: "auto",
          marginRight: "auto",
        },
        "@media (max-width:1044px)": {
          p: 0, // Adjust padding for medium-sized screens (tablets)
        },
      }}
    >
      <AuthRegister />
    </Card>
  </PageContainer>
);
};
