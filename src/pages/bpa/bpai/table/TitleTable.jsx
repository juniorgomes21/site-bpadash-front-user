import React from "react";
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

const names = [
  'ident',
  'cnes',
  'cmp',
  'cnsmed',
  'cbo',
  'dtaten',
  'flh',
  'seq',
  'pa',
  'cnspac',
  'sexo',
  'ibge',
  'cid',
  'idade',
  'qt',
  'caten',
  'naut',
  'org',
  'nmpac',
  'dtnasc',
  'raca',
  'etnia',
  'nac',
  'srv',
  'clf',
  'equipe_Seq',
  'equipe_Area',
  'cnpj',
  'cep_Pcnte',
  'lograd_Pcnte',
  'end_Pcnte',
  'compl_Pcnte',
  'num_Pcnte',
  'bairro_Pcnte',
  'ddtel_Pcnte',
  'email_Pcnte',
  'ine',
  'fim'
];

function TitleTable() {
  
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
                  <p className="uppercase font-bold text-default">
                    {name}
                  </p>
              </TableCell>
            ))}
        </TableRow>
      </TableHead>
    );
}

export default TitleTable;