import React from "react";
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

const names = [
  'ident',
  'cnes',
  'cmp',
  'cbo',
  'flh',
  'seq',
  'pa',
  'idade',
  'qt',
  'org',
  'fim',
];

function EnhancedTableHead() {

return (
    <TableHead>
      <TableRow>
          {names.map((name, index) => (
          <TableCell
              key={index}
              align={'center'}
              padding={'normal'}
              className="p-4"
          >
              <p className="uppercase font-bold text-[#2a3042]">
                {name}
              </p>
          </TableCell>
          ))}
      </TableRow>
    </TableHead>
);
}

export default EnhancedTableHead;