import UploadImg from "../../assets/images/svg/nuvemUpx.gif";
import LinearProgress from '@mui/material/LinearProgress';

function DivLoadingSvg({ name }) {

    return (
        <div className="flex flex-col justify-center w-full">
            <div className="flex justify-center text-base">
                <p>
                    Aguarde enquanto salvamos seu arquivo {name} ...
                </p>
            </div>
            <div className="flex justify-center">
                <img src={UploadImg} alt="..." />
            </div>
            <LinearProgress />
        </div>
    )
}

export default DivLoadingSvg;