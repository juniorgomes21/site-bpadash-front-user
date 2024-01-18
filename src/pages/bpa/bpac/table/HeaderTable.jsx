import React from "react";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';


function HeaderTable() {
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 }
        }}
        className="bg-[#2a3042] text-white"
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          BPA-C
        </Typography>
        <Link to="/file/edit/bpac" className="has-arrow">
          <IconButton>
            <EditIcon color="primary"/>
          </IconButton>
        </Link>
      </Toolbar>
    );
}

export default HeaderTable;