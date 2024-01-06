import React from "react";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom"
import EditIcon from '@mui/icons-material/Edit';


function HeaderTable({ name, table, identifier }) {

    // const identifierAsyn = localStorage.getItem("@identifierBPAI");

    // useEffect(() => {
    //   if(identifierAsyn == undefined || identifierAsyn == null) {
    //     setIdentifierBPAIAsyncStorage(identifier);
    //   }
    // }, []);

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
            {name}
          </Typography>
          <Link to={`/file/edit/${table}`}>
            <IconButton>
              <EditIcon color="primary"/>
            </IconButton>
          </Link>
      </Toolbar>
    );
}

export default HeaderTable;