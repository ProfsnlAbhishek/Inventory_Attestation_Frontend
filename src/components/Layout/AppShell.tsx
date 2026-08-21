import { Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const headerFooterStyle = {
  textAlign: "center",
  height: 50,
};

const mainStyle = {
  padding: "8px 16px",
  cursor: "pointer"
};

const Item = styled(Paper)(() => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function AppShell() {

  const navigate = useNavigate();


  return (
    <Grid container spacing={2} sx={{ backgroundColor: "#F3F6F9" }}>
      <Grid size={12}>
        <Item sx={headerFooterStyle}>
          <Typography variant="h5" sx={mainStyle} onClick={()=> navigate("/") }>
            INVENTORY ATTESTATION
          </Typography>
        </Item>
      </Grid>

      <Grid size ={12} >
        <Box sx={{alignItems:"center", mb:2, gap: 2, p:2, backgroundColor:"white", width: "100%" }}>
          <Outlet /> 
        </Box>
      </Grid>
    </Grid>
  );
}