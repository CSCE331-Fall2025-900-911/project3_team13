import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function NotAuthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");  // redirect back to login
    }, 10000); // 10 seconds

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 3,
      }}
    >
<Typography variant="h4" sx={{ mb: 2, color: "black" }}>
  Not Authorized
</Typography>
<Typography variant="body1" sx={{ mb: 3, color: "black" }}>
  You do not have permission to access this page.
  <br />
  Redirecting to login…
</Typography>

      <CircularProgress />
    </Box>
  );
}
