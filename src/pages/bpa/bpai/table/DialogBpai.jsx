import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import FilterListIcon from '@mui/icons-material/FilterList';
import Paper from "@mui/material/Paper";
import ColumnsVisible from "./ColumnsVisible";
import FilterTable from "./FilterTable";


function DialogBpai() {

    const ref = useRef(null);
    const [value, setValue] = useState(0);


    return (
        <Box sx={{ pb: 7 }} ref={ref}>
            <CssBaseline />
            {
                value === 0 ?
                    <FilterTable />
                :
                    <ColumnsVisible />
            }
            <Paper
                sx={{ position: "fixed", bottom: 0, left: 0, right: 0, color: "white" }}
                elevation={3}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    className="!bg-default !text-white"
                >
                    <BottomNavigationAction
                        label="FILTRO"
                        icon={<FilterListIcon sx={{ color: "white" }} />}
                        sx={{ color: "white" }}
                        className="font-bold"
                    />
                    <BottomNavigationAction
                        label="COLUNAS"
                        icon={<ViewWeekIcon sx={{ color: "white" }} />}
                        sx={{ color: "white" }}
                        className="font-bold"
                    />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}

export default DialogBpai;
