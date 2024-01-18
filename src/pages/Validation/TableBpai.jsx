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




const bpaiValidation = [
    {
        key: 'cnes',
        name: 'Código CNES'
    },
    {
        key: 'cmp',
        name: 'Competência'
    },
    {
        key: 'cnsmed',
        name: 'Número do CNS do Profissional com dígito verificador válido'
    },
    {
        key: 'cbo',
        name: 'Código CBO'
    },
    {
        key: 'dtaten',
        name: 'Data de atendimento'
    },
    {
        key: 'pa',
        name: 'Procedimento Ambulatorial (PA)'
    },
    {
        key: 'cnspac',
        name: 'CNS do paciente com dígito verificador válido'
    },
    {
        key: 'sexo',
        name: 'Sexo do paciente'
    },
    {
        key: 'ibge',
        name: 'Código IBGE do município de residência'
    },
    {
        key: 'cid',
        name: 'CID-10'
    },
    {
        key: 'idade',
        name: 'Idade (0 a 130 anos) '
    },
    {
        key: 'qt',
        name: 'Quantidade de procedimentos produzidos'
    },
    {
        key: 'caten',
        name: 'Caracter de atendimento'
    },
    {
        key: 'naut',
        name: 'Numero da Autorização do estabelecimento'
    },
    {
        key: 'org',
        name: 'Origem das informações'
    },
    {
        key: 'nmpac',
        name: 'Nome completo do paciente'
    },
    {
        key: 'dtnasc',
        name: 'Data de nascimento do paciente'
    },
    {
        key: 'raca',
        name: 'Raça/Cor do paciente'
    },
    {
        key: 'etnia',
        name: 'Etnia do paciente'
    },
    {
        key: 'nac',
        name: 'Nacionalidade do paciente'
    },
    {
        key: 'srv',
        name: 'Código do Serviço'
    },
    {
        key: 'clf',
        name: 'Código da Classificação'
    },
    {
        key: 'equipeSeq',
        name: 'Código da Sequencia da Equipe'
    },
    {
        key: 'equipeArea',
        name: 'Código da Area da Equipe'
    },
    {
        key: 'cnpj',
        name: 'Código do CNPJ'
    },
    {
        key: 'cepPcnte',
        name: 'Código CEP paciente'
    },
    {
        key: 'logradPcnte',
        name: 'Código logradouro paciente'
    },
    {
        key: 'endPcnte',
        name: 'Endereço do paciente'
    },
    {
        key: 'complPcnte',
        name: 'Complemento do endereço do paciente'
    },
    {
        key: 'numPcnte',
        name: 'Número do endereço do paciente'
    },
    {
        key: 'bairroPcnte',
        name: 'Bairro do endereço do paciente'
    },
    {
        key: 'ddtelPcnte',
        name: 'Telefone do paciente'
    },
    {
        key: 'emailPcnte',
        name: 'E-mail do paciente'
    },
    {
        key: 'ine',
        name: 'Indentificação nacional de equipes'
    }
]


function TableBpai({ obj, setObj }) {

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
                    BPA-I
                </Typography>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                bpaiValidation.map((bpac, index) => (
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
                                Object.keys(obj).map((name, index) => (
                                <TableCell key={index} align="center" className="truncate">
                                    <Switch
                                        checked={obj[name]}
                                        color="success"
                                        onClick={() => {
                                            setObj(prevBpacValidation => ({...prevBpacValidation, [name]: !obj[name]}))
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

export default TableBpai;
