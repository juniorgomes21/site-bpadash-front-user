import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import api from "../../../../services/api";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import LoadingButton from "@mui/lab/LoadingButton";
import SnackBarContext from "../../../../contexts/managerService";
import loadingSvg from "../../../../assets/images/svg/loading.svg";
import { formatMonth } from "../../../../Validation&Formatation/formatation";
import DateGlobalBpaContext from "../../../../contexts/DateGlobalBpa";
import Tooltip from '@mui/material/Tooltip';
import AlertCustom from "../../../../GlobalComponents/AlertCustom";


const names = [
    'hdr',
    'mvm',
    'lin',
    'flh',
    'smtVrf',
    'rsp',
    'sgl',
    'cgccpf',
    'dst',
    'dstIn',
    'versao',
    'fim'
];

const headCells = [
    {
      id: 'hdr',
      label: 'hdr',
      name: 'Indicador de início do cabeçalho'
    },
    {
      id: 'mvm',
      label: 'mvm',
      name: 'Ano e mês de Processamento da produção'
    },
    {
      id: 'lin',
      label: 'lin',
      name: 'Número de linhas do BPA gravadas'
    },
    {
      id: 'flh',
      label: 'flh',
      name: 'Quantidades de folhas de BPA gravadas'
    },
    {
      id: 'smtVrf',
      label: 'smtVrf',
      name: 'Campo de control'
    },
    {
      id: 'rsp',
      label: 'rsp',
      name: 'Nome do órgão de origem responsável pela informação'
    },
    {
      id: 'sgl',
      label: 'sgl',
      name: 'Sigla do órgão de origem responsável pela digitação'
    },
    {
      id: 'cgccpf',
      label: 'cgccpf',
      name: 'CGC/CPF do prestador ou do órgão público responsável pela informação, conforme cadastro na Receita Federal'
    },
    {
      id: 'dst',
      label: 'dst',
      name: 'Nome do órgão de saúde destino do arquivo'
    },
    {
      id: 'dstIn',
      label: 'dstIn',
      name: 'Indicador do órgão destino'
    },
    {
      id: 'versao',
      label: 'versao',
      name: 'Versão do sistema, informação livre, pode conter qualquer letra e número'
    },
    {
      id: 'fim',
      label: 'fim',
      name: 'Correspondente aos caracteres CR - CHR(13) + LF - CHR(10), do padrão ASCII (.TXT), indicando fim do cabeçalho'
    },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Title(props) {

    document.title="Editar Título";

    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { openSnackBarFun } = useContext(SnackBarContext);
    const { month, year } = useContext(DateGlobalBpaContext);
    const [titleBpa, setTitleBpa] = useState({});
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    
    useEffect(() => {
        apiGetTitle();
    }, [month, year]);

    async function apiGetTitle() {
        setLoading(true);
        try {
          const response = await api.get(`/title/get/${month}/${year}`);
          setTitleBpa(response.data);
        } catch(e) {
          console.log("Erro: ", e);
        }
        setLoading(false);
    }

    async function apiEditTitle() {
        setLoading(true);
        try {
          const response = await api.post(`/title/edit/${titleBpa.id}/${employee.key}`, titleBpa);
          setTitleBpa(response.data);
          handleClose();
          openSnackBarFun(false, "Título editado");
        } catch(e) {
          setErrorMessages(e.response.data);
        }
        setLoading(false);
    }

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setTitleBpa({...titleBpa, [name]: value});
    }

    function hasOnlyWhitEspace(str) {
        if(/^\s*$/.test(str)) {
          return "Em branco"
        }
      
        return str;
    }

    function handleOpenEdit() {
        setOpenEdit(true);
    }
    
    function handleClose() {
        setOpenEdit(false);
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {
                        Object.keys(titleBpa).length == 0 ?
                        <div className="flex justify-center">
                                <AlertCustom
                                    msg={`Nenhum BPA encontrado no período ${formatMonth(month)} de ${year}`}
                                    type="info"
                                />
                            </div>
                        :
                        <>
                            <Breadcrumbs title={props.t("Título BPA")} breadcrumbItem={props.t("Título BPA")} />
                            <TableContainer component={Paper} className="mt-5">
                                <Table sx={{ minWidth: 1200 }} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                padding="normal"
                                                className="p-2 sticky left-0 bg-default"
                                            >
                                            
                                            </TableCell>
                                            {
                                                headCells.map((head, index) => (
                                                    <TableCell key={index} align='center' className="p-4 bg-default">
                                                        <Tooltip title={head.name} placement="top">
                                                            <p className="uppercase font-bold text-white cursor-pointer">
                                                                {head.label}
                                                            </p>
                                                        </Tooltip>
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>
                                        {
                                            !loading &&
                                                <TableBody>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell align="center" className="sticky left-0 bg-default w-[4.5rem]">
                                                            <IconButton onClick={ e => {
                                                                    handleOpenEdit();
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <EditIcon className="text-white"/>
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell align="center" className="truncate p-3">{hasOnlyWhitEspace(titleBpa.hdr)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.mvm)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.lin)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.flh)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.smtVrf)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.rsp)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.sgl)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.cgccpf)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.dst)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.dstIn)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.versao)}</TableCell>
                                                        <TableCell align="center" className="truncate">{hasOnlyWhitEspace(titleBpa.fim)}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                        }
                                </Table>
                                {
                                    loading &&
                                        <div className='flex justify-center my-2'>
                                            <img src={loadingSvg} alt="loading..." width={50}/>
                                        </div>
                                }
                            </TableContainer>
                        </>
                    }
                </Container>
            </div>
            <Dialog
                fullScreen
                open={openEdit}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar position="fixed" sx={{ background: "#2a3042" }}>
                <Toolbar>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={handleClose}
                    >
                    fechar
                    </Button>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    </Typography>
                    <LoadingButton
                        variant="contained"
                        autoFocus
                        loading={loading}
                        color="success"
                        onClick={apiEditTitle}
                    >
                        salvar
                    </LoadingButton>
                </Toolbar>
                </AppBar>
                <div className="flex justify-center">
                    <div className="w-[96%] m-16 mb-10">
                        {
                            names.map((fieldName) => {
                                const error = errorMessages.find(error => error.field === fieldName);
                                const message = error ? error.message : '';

                                return (
                                    <div key={fieldName}>
                                        <TextField
                                            fullWidth
                                            error={error ? true : false}
                                            id={fieldName}
                                            name={fieldName}
                                            label={fieldName}
                                            variant="outlined"
                                            value={titleBpa[fieldName]}
                                            helperText={message}
                                            onChange={ e => {
                                                if (e.target.value.length <= 50) {
                                                    handleChangeInput(e)
                                                }
                                            }}
                                            className="mt-4"
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Dialog>
        </>
    );
};

Title.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Title);
