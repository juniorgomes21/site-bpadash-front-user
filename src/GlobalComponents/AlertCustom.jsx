import Alert from '@mui/material/Alert';

function AlertCustom({ type, msg }) {

    return (
        <div className="flex justify-center w-full">
            <Alert variant="outlined" severity={type}>
                {msg}
            </Alert>
        </div>
    )
}

export default AlertCustom;