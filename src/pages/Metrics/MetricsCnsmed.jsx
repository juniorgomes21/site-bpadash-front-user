import React, { useState, useEffect, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import api from '../../services/api';
import loadingSvg from "../../assets/images/svg/loading.svg";
import { maskPa, maskMoney, maskPointThree } from "../../Validation&Formatation/formatation";
import SnackBarContext from "../../contexts/managerService";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import AuthContext from '../../contexts/Auth';
import { Link } from "react-router-dom";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddHomeIcon from '@mui/icons-material/AddHome';
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DatePickerContext from "../../contexts/DateGlobalBpa";
import { withTranslation } from "react-i18next";
import AlertCustom from '../../GlobalComponents/AlertCustom';

const headCells = [
    {
        id: 'name',
        label: 'Médico(a)',
    },
    {
        id: 'hdr',
        label: 'CNSMED',
    },
    {
        id: 'mvm',
        label: 'Atendimentos',
    },
    {
        id: 'lin',
        label: 'Porcentagem',
    }
];

function MetricsCnsmed(props) {

    document.title = "Métricas PA";

    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [cnsmedList, setCnsmedList] = useState([]);
    const [cnsmedListFilter, setCnsmedListFilter] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [textSearch, setTextSearch] = useState("");
    const [existProf, setExistProf] = useState(true);


    useEffect(() => {
        apiExistFpo();
    }, [month, year, existProf]);

    async function apiExistFpo() {
        setLoading(true);
        try {
            const response = await api.get(`/user/exist/prof`);
            
            if(response.data) {
                getPercent();
            }
            setExistProf(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    async function getPercent() {
        setLoading(true);
        try {
            const response = await api.get(`/metrics/cnsmed/${getFormattedDate()}`);

            const arrayM = response.data;
            setCnsmedList(arrayM);
    
            let sumTotal = arrayM.reduce((sum, item) => sum + item.occurrences, 0);
            setTotal(sumTotal);

            const array = arrayM.slice(0, 3).map(obj => obj.percent);
            const num = 100 - array.reduce((sum, percent) => sum + percent, 0);
    
            array.push(num);
            setCnsmedListFilter(arrayM);

        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    function handleInputChange(value) {
        if(value.length > 0) {
            setCnsmedListFilter(cnsmedListFilter.filter(item => item.pa.includes(value)));
        } else {
            setCnsmedListFilter(cnsmedList);
        }
    }
    
    return (
        <>
            <div className="page-content">
                <Breadcrumbs title={props.t("Atendimento por CNSMED")} breadcrumbItem={props.t("Atendimento")} />
                <Container fluid>
                    {
                        existProf ?
                            <div className='w-full'>
                                <div className="flex justify-end w-full my-4">
                                    <p className='font-bold text-sm'>
                                        TOTAL DE PROCEDIMENTOS: {total}
                                    </p>
                                </div>
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
                                        CNSMED
                                    </Typography>
                                    <>
                                        <div className='bg-white p-1 rounded-md'>
                                            <TextField
                                                id="outlined-basic"
                                                label=""
                                                value={textSearch}
                                                placeholder='CNSMED'
                                                variant="outlined"
                                                size='small'
                                                onChange={ e  => {
                                                    const value = e.target.value;
                                                    if(!isNaN(Number(value)) && value.length <= 15) {
                                                        setTextSearch(value);
                                                        handleInputChange(value)
                                                    };
                                                }}
                                            />
                                        </div>
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
                                            !loading &&
                                                <TableBody>
                                                    {
                                                        cnsmedListFilter.map((cnsmed, index) => (
                                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell align="left">{cnsmed.name}</TableCell>
                                                                <TableCell align="center">{maskPointThree(cnsmed.cnsmed)}</TableCell>
                                                                <TableCell align="center">{cnsmed.occurrences}</TableCell>
                                                                <TableCell align="center">
                                                                    <p className='text-blue-600 font-bold'>
                                                                        {cnsmed.percent == 0 ? "1" : cnsmed.percent} %
                                                                    </p>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                        }
                                    </Table>
                                    {
                                        loading &&
                                        <div className='flex justify-center my-2'>
                                            <img src={loadingSvg} alt="loading..." width={50} />
                                        </div>
                                    }
                                </TableContainer>
                            </div>
                        :
                            <AlertCustom
                                type="info"
                                msg="Você não possuí nenhum arquivo de profissionais"
                            />
                    }
                </Container>
            </div>

        </>
    )
}

MetricsCnsmed.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(MetricsCnsmed);
