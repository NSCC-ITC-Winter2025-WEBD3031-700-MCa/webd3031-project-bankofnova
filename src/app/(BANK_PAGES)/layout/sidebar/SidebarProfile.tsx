import { Box, Button, Link, Typography } from "@mui/material";
import { useSession, signOut } from "next-auth/react";

export const SidebarProfile = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest";

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        p: 3,
        height: '120px',
        // bgcolor: 'success.light',
        // borderBottom: '2px solid green',
        marginTop: '65px',
      }}
    >
      {session ? (
        <Box>
          <Typography variant="h5" fontSize="16px" mb={1}>
            {userName}.
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => signOut()}
            aria-label="logout"
            size="small"
            sx={{
              // borderRadius: 'none !important'
              marginTop: '5px',
              boxShadow: 'none',
            }}
          >
                         <Typography
              variant="h6"
              fontSize={14}
              fontWeight="400"
                sx={{
                  // color: 'white'
                  // marginLeft: "10px",
                }}
              >
            Log Out
            </Typography>

          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" fontSize="16px" mb={1}>
            Not signed up?
          </Typography>
          <Button
            color="primary"
            target="_blank"
            disableElevation
            component={Link}
            href="/register"
            variant="contained"
            aria-label="signup"
            size="small"
          >
            Sign Up
          </Button>
        </Box>
      )}
    </Box>
  );
};
