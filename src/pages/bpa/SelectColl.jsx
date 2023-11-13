import React, { useEffect, useState } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



function SelectColl({ names, handleClick }) {

    return (
        <div>
            <FormControl sx={{ width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Colunas Visíveis</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple={true}
                    value={["Colunas Visíveis"]}
                    label="Colunas Visíveis"
                    MenuProps={MenuProps}
                >
                    <MenuItem value={"Colunas Visíveis"}>
                        Colunas Visíveis
                    </MenuItem>
                    {names.map((name) => (
                        <MenuItem key={name} value={name} onClick={() => {handleClick(name)}}>
                            <Checkbox checked={names.includes(name)} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}

export default SelectColl;