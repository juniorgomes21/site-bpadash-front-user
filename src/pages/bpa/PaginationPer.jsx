import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Pagination from '@mui/material/Pagination';

function PaginationPer({ page, size, setPage, setSize, totalElements, totalPage }) {


    function handleChangeSize(event) {
        setSize(event.target.value);
    }
    
    function handleChangePage(_event, value) {
        setPage(value);
    }

    return (
        <div className="flex justify-center py-4">
            <div className="max-sm:flex-col flex justify-between items-center w-[98%]">
                <div className="w-32 max-sm:mb-6">
                    <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Elementos</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={size}
                        label="Elementos"
                        onChange={handleChangeSize}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        {/* <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={200}>200</MenuItem> */}
                    </Select>
                    </FormControl>
                </div>
                <Pagination size="small" count={totalPage} page={page == 0 ? 1 : page} onChange={handleChangePage} color="primary" />
                <div className="max-sm:mt-6">
                    <p>Total de elementos: {totalElements}</p>
                </div>
            </div>
        </div>
    )
}

export default PaginationPer;