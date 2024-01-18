import React, {useState, useEffect, useContext} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import api from '../../../services/api';
import loadingSvg from "../../../assets/images/svg/loading.svg";
import SnackBarContext from "../../../contexts/managerService";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import AuthContext from '../../../contexts/Auth';
import DateGlobalBpaContext from '../../../contexts/DateGlobalBpa';
import { Link } from "react-router-dom";

const headCells = [
    {
      id: 'hdr',
      label: 'hdr',
    },
    {
      id: 'mvm',
      label: 'mvm',
    },
    {
      id: 'lin',
      label: 'lin',
    },
    {
      id: 'flh',
      label: 'flh',
    },
    {
      id: 'smtVrf',
      label: 'smtVrf',
    },
    {
      id: 'rsp',
      label: 'rsp',
    },
    {
      id: 'sgl',
      label: 'sgl',
    },
    {
      id: 'cgccpf',
      label: 'cgccpf',
    },
    {
      id: 'dst',
      label: 'dst',
    },
    {
      id: 'dstIn',
      label: 'dstIn',
    },
    {
      id: 'versao',
      label: 'versao',
    },
    {
      id: 'fim',
      label: 'fim',
    },
];

export default function TitleBpa({ identifier, setBpa, setLoadingBpa }) {

  const { getDates } = useContext(AuthContext);
  const { openSnackBarFun } = useContext(SnackBarContext);
  const { getFormatedDate } = useContext(DateGlobalBpaContext);
  const [titleBpa, setTitleBpa] = useState({});
  const [loading, setLoading] = useState(true);
  const [countRules, setCountrules] = useState(0);
  const [open, setOpen] = useState({ "edit": false, "rules": false, "delete": false });

  useEffect(() => {
    apiGetTitle();
  }, []);

  async function apiGetTitle() {
    try {
      const response = await api.get(`/title/get/${identifier}`);
      setTitleBpa(response.data);
      setCountrules(response.data.countRules);
    } catch(e) {
      console.log("Erro: ", e);
    }
    setLoading(false);
  }

  async function apiDeleteBPA() {
    setLoadingBpa(true);
    try {
      await api.post(`/bpa/delete/${identifier}`);
      getDates();
      setBpa({});
      openSnackBarFun(false, "BPA apagado com sucesso!");
    } catch(e) {
      console.log(e.response);
      openSnackBarFun();
    }
    setLoadingBpa(false);
  }

  async function apiExecuteRules() {
    try {
      const countB = await api.post("/treatment/deleteperpa/execute/0", { "dateBpa": getFormatedDate() });
      const countA = await api.post("/treatment/replacement/pa/execute/0", { "dateBpa": getFormatedDate() });
      const countC = await api.post("/treatment/replacement/pa/cbo/execute/0", { "dateBpa": getFormatedDate() });
      openSnackBarFun(false, `Todas regras executadas, ${countA.data + countB.data + countC.data} linhas alteradas`);

    } catch(e) {
      console.log(e);
      openSnackBarFun();
    }
  }

  function hasOnlyWhitEspace(str) {
    if(/^\s*$/.test(str)) {
      return "Em branco"
    }
  
    return str;
  }

  function handleClickOpen(key) {
    if(key === "rules") {
      if(countRules == 0) {
        openSnackBarFun(true, "Crie novas regras para executar essa ação!")
      } else {
        setOpen({...open, [key]: true});
      }
    } else {
      setOpen({...open, [key]: true});
    }
  }

  function handleClickClose() {
    setOpen({ "edit": false, "rules": false, "delete": false });
  }

  return (
    <div className='w-full'>
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
                CABEÇALHO
            </Typography>
            <>
                <Link to="/file/edit/title" className="has-arrow">
                  <Tooltip title="Editar" >
                      <IconButton>
                          <EditIcon color="primary"/>
                      </IconButton>
                  </Tooltip>
                </Link>
                <Tooltip title="Executar regras" onClick={() => handleClickOpen("rules")}>
                    <IconButton>
                      <DomainVerificationIcon className='text-green-400'/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Apagar" onClick={() => handleClickOpen("delete")}>
                    <IconButton>
                        <DeleteIcon color="error"/>
                    </IconButton>
                </Tooltip>
            </>
        </Toolbar>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                      {
                          headCells.map((head, index) => (
                              <TableCell key={index} align='center' className="p-4">
                                  <p className="uppercase font-bold text-[#2a3042]">
                                      {head.label}
                                  </p>
                              </TableCell>
                          ))
                      }
                  </TableRow>
                </TableHead>
                    {
                      !(identifier == '') && !loading &&
                      <TableBody>
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.hdr)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.mvm)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.lin)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.flh)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.smtVrf)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.rsp)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.sgl)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.cgccpf)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.dst)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.dstIn)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.versao)}</TableCell>
                          <TableCell align="center">{hasOnlyWhitEspace(titleBpa.fim)}</TableCell>
                        </TableRow>
                      </TableBody>
                    }
            </Table>
            {
              identifier == '' || loading &&
                <div className='flex justify-center my-2'>
                  <img src={loadingSvg} alt="loading..." width={50}/>
                </div>
            }
        </TableContainer>
        <Dialog
          open={open.rules}
          onClose={() => handleClickOpen("rules")}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
              Executar {countRules} regras?
          </DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Essa ação executará todas as regras registradas na sua conta nesse BPA.
              </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleClickClose}
            >
              FECHAR
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                apiExecuteRules();
                handleClickClose();
              }}
            >
              EXECUTAR
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={open.delete}
          onClose={() => handleClickOpen("delete")}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
              Tem a certeza?
          </DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Essa ação apagará permanentemente o arquivo BPA
              </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleClickClose}
            >
              FECHAR
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                apiDeleteBPA();
                handleClickClose();
              }}
            >
              APAGAR
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}