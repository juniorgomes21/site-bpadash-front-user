import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TaskIcon from '@mui/icons-material/Task';
import NavigationIcon from '@mui/icons-material/Navigation';
import { Link } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import DialogActions from "@mui/material/DialogActions";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { blue } from '@mui/material/colors';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const skeleton = [
    {
        name: "BPA",
        url: "bpa"
    },
    {
        name: "FPO",
        url: "fpo"
    },
    {
        name: "PROF",
        url: "professionals"
    },
]

const contacts = [
    {
        "call": "plabpadash@gmail.com"
    },
    {
        "call": "(91) 9 8251-0975"
    }
];

const keys = [
	"sizeByteBpa",
	"sizeByteFpo",
	"sizeByteProfe"
];

function TableManager({ data }) {

    const [open, setOpen] = useState(false);


    return (
        <>
            <div className="flex flex-col w-10/12">
                <Toolbar
                    sx={{
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 }
                    }}
                    className="w-full bg-[#2a3042] text-white"
                >
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        GERENCIAMENTO
                    </Typography>
                    <div className='hover:mb-4'>
                        <Tooltip title="Mais armazenamento" placement='top' onClick={() => setOpen(true)}>
                            <IconButton>
                                <AddCircleIcon sx={{ color: "#fff" }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center" >
                                    <p className="uppercase font-bold text-[#2a3042]">
                                        Arquivo
                                    </p>
                                </TableCell>
                                <TableCell align="center">
                                    <p className="uppercase font-bold text-[#2a3042]">
                                        Armazenamento usado
                                    </p>
                                </TableCell>
                                <TableCell align="center">
                                    <p className="uppercase font-bold text-[#2a3042]">
                                        Total Bytes
                                    </p>
                                </TableCell>
                                <TableCell align="center">
                                    <p className="uppercase font-bold text-[#2a3042]">
                                        Linha do tempo
                                    </p>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.percents.map((percent, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row" className="flex justify-center">
                                        <div className="flex justify-center">
                                            <TaskIcon sx={{ color: "#0fdb08", fontSize: 35 }} />
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">{skeleton[index].name}</TableCell>
                                    <TableCell className="flex justify-center">
                                        <div className={`flex justify-center items-center p-2 ${ percent > 70.0 ? "bg-red-500" : "bg-green-400"} rounded-xl`}>
                                            <p className="text-white">
                                                {percent} %
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex justify-center">
                                        <div className={`flex justify-center items-center`}>
                                            <p className="text-black">
                                                {data[keys[index]]}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link to={`/timeline/${skeleton[index].url}`}>
                                            <Button
                                                variant="contained"
                                                endIcon={
                                                    <NavigationIcon fontSize="small" />
                                                }
                                            >
                                                IR
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>Entre em contato</DialogTitle>
                <List sx={{ pt: 0 }}>
                    {contacts.map((contact, index) => (
                        <ListItem disableGutters key={index} className="p-3">
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                        {
                                            index == 0 ?
                                                <EmailIcon />
                                            :
                                                <WhatsAppIcon />
                                        }
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={contact.call} />
                        </ListItem>
                    ))}
                    <ListItem disableGutters className="p-3">
                        <ListItemAvatar>
                            <Avatar>
                                <QueryBuilderIcon sx={{ color: "#406af5" }}/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Horário de atendimento 8h - 18h" />
                    </ListItem>
                </List>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setOpen(false)}
                    >
                        FECHAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TableManager;
