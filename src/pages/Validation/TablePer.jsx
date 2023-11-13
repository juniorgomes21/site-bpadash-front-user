import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FilterListIcon from '@mui/icons-material/FilterList';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';


function TablePer({ bpa, setBpa, api }) {

    return (
        <div>
            <div className="flex justify-end w-full mt-5 -mb-1">
                <div
                    // onClick={() => setEditActive(!editActive)}
                    className="bg-default p-2 rounded-t-lg cursor-pointer relative"
                >
                    <div className="">
                        <LoadingButton
                            color="success"
                            variant="contained"
                            onClick={api}
                        >
                            SALVAR
                        </LoadingButton>
                    </div>
                </div>
            </div>
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
                    BPA-I
                </Typography>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {Object.keys(bpa).map((name, index) => (
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

export default TablePer;
