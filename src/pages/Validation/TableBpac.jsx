import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import Tooltip from '@mui/material/Tooltip';


const bpacValidation = [
    {
        key: 'cnes',
        name: 'Código CNES'
    },
    {
        key: 'cmp',
        name: 'Competência'
    },
    {
        key: 'cbo',
        name: 'Código CBO'
    },
    {
        key: 'pa',
        name: 'Procedimento Ambulatorial (PA)'
    },
    {
        key: 'idade',
        name: 'Idade'
    },
    {
        key: 'qt',
        name: 'Quantidade de procedimentos'
    },
    {
        key: 'org',
        name: 'Origem das informações'
    }
]


function TableBpac({ bpa, setBpa, api }) {

    return (
        <div className='mt-10'>
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
            </Toolbar>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                bpacValidation.map((bpac, index) => (
                                    <TableCell
                                        key={index}
                                        align={'center'}
                                        padding={'normal'}
                                        className="p-4"
                                    >
                                        <Tooltip title={bpac.name} placement="top">
                                            <p className="uppercase font-bold text-default">
                                                {bpac.key}
                                            </p>
                                        </Tooltip>
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {
                                Object.keys(bpa).map((name, index) => (
                                <TableCell key={index} align="center" className="truncate">
                                    <Switch
                                        checked={bpa[name]}
                                        color="success"
                                        onClick={() => {
                                            setBpa(prevBpacValidation => ({...prevBpacValidation, [name]: !bpa[name]}))
                                        }}
                                    />
                                </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default TableBpac;
