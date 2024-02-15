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
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
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
        id: 'hdr',
        label: 'CBO',
    },
    {
        id: 'mvm',
        label: 'Ocorrências',
    },
    {
        id: 'lin',
        label: 'Porcentagem',
    }
];

function MetricsCbo(props) {

    document.title = "Métricas CBO";

    const { dates } = useContext(AuthContext);
    const { month, year, getFormattedDate } = useContext(DatePickerContext);

    const [cboList, setCboList] = useState([]);
    const [cboFilter, setCboFilter] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [textSearch, setTextSearch] = useState("");

    useEffect(() => {
        getPercent();
    }, [month, year, ]);

    async function getPercent() {
        setLoading(true);
        try {
            const response = await api.get(`/metrics/cbo/${getFormattedDate()}`);

            const arrayM = response.data;
            setCboList(arrayM);
    
            let sumTotal = arrayM.reduce((sum, item) => sum + item.occurrences, 0);
            setTotal(sumTotal);

            const array = arrayM.slice(0, 3).map(obj => obj.percent);
            const num = 100 - array.reduce((sum, percent) => sum + percent, 0);
    
            array.push(num);
            setCboFilter(arrayM);

        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    function handleInputChange(value) {
        if(value.length > 0) {
            setCboFilter(cboFilter.filter(item => item.cbo.includes(value)));
        } else {
            setCboFilter(cboList);
        }
    }
    
    return (
        <>
            <div className="page-content">
                <Breadcrumbs title={props.t("Contagem por CBO")} breadcrumbItem={props.t("Contagem")} />
                <Container fluid>
                    {
                        dates.length > 0 ?
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
                                        CBO
                                    </Typography>
                                    <>
                                        <div className='bg-white p-1 rounded-md'>
                                            <TextField
                                                id="outlined-basic"
                                                label=""
                                                value={textSearch}
                                                placeholder='CBO'
                                                variant="outlined"
                                                size='small'
                                                onChange={ e  => {
                                                    const value = e.target.value;
                                                    if(!isNaN(Number(value)) && value.length <= 6) {
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
                                                        cboFilter.map((cbo, index) => (
                                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell align="center">{cbo.cbo}</TableCell>
                                                                <TableCell align="center">{cbo.occurrences}</TableCell>
                                                                <TableCell align="center">
                                                                    <p className='text-blue-600 font-bold'>
                                                                        {cbo.percent == 0 ? "1" : cbo.percent} % 
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
                                msg="Você não possuí nenhum arquivo BPA"
                            />
                    }
                </Container>
            </div>

        </>
    )
}

MetricsCbo.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(MetricsCbo);
