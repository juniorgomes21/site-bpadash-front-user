import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";


function TitleTable({ names, tablesVisibleStorage }) {

    return (
        <TableHead>
            <TableRow>
                {names.map(
                    (name, index) =>
                        tablesVisibleStorage[index][name] && (
                            <TableCell
                                key={index}
                                align={"center"}
                                padding={"normal"}
                                className="p-4"
                            >
                                <p className="uppercase font-bold text-default">
                                    {name}
                                </p>
                            </TableCell>
                        )
                )}
            </TableRow>
        </TableHead>
    );
}

export default TitleTable;
