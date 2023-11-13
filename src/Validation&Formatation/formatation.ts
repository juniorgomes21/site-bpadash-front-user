// import { Dayjs } from 'dayjs';

export function unformatCPF(cpf: string) {
    cpf = cpf.replace(/[\s.-]*/igm, '');
    
    return cpf;
}

export function unformatCode(code: string) {
    code = code.replace(/[\s.-]*/igm, '');
    
    return code;
}

export function maskCPF(cpf: string) {

    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  
    return cpf;
}

export function maskName(name: string) {

    name = name.replace(/[^a-zA-Z\s]/g, "");
  
    return name;
}

export function maskCode(code: string) {
    code = code.replace(/\D/g, "");
    code = code.replace(/(\d{3})(\d)/, "$1-$2");;
  
    return code;
}

export function maskMoney(money: Number) {

    let moneyFormatted = money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

    return moneyFormatted;
}

export function maskBitSorte(bitSorte: Number) {

    let moneyFormatted = "B$ " + bitSorte;

    return moneyFormatted;
}


export function formatQuantPlayers(players: string) {

    players = players.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

    return players;
}

export function formatDate(coupon: string) {
    return coupon.substring(5, 7) + "/" + coupon.substring(0, 4);
}

export function formatarDataHora(date: string) {

    // let hora = data[3];
    // let min = data[4];

    // if(hora < 9) hora = '0' + hora;

    // if ( hora <= 12 ) {
    //     return (hora + ':' + min + ' AM')
    // }

    let hour = date.substring(11, 13);
    let minute = date.substring(14, 16);

    // return (hour + ':' + minute + ' PM')
    return (hour + ':' + minute)

}

export function extractDate(date: string) {
    
    const dateStr = date.split("T")[0];
    const [year, month, day] = dateStr.split("-");

    const dateFormat = day + '/' + month + '/' + year;

    return dateFormat;
}

export function formatDateAndHours(date: string) {
    let day = date.substring(8, 10);
    let moth = date.substring(5, 7);
    let year = date.substring(0, 4);
    let hour = date.substring(11, 13);
    let minute = date.substring(14, 16);

    return (day + '/' + moth + '/' + year + ' ' + hour + ':' + minute);
}

export function maskCell(num: string) {
        
    num = num.replace(/\D/g,'');
    num = num.replace(/(\d{2})(\d)/,"($1) $2");
    num = num.replace(/(\d)(\d{4})$/,"$1-$2");

    return num;

    // return "(" + num.substring(0, 2) + ") " + num.substring(2, 3) + " " + num.substring(3, 7) + "-" + num.substring(7, 11);
}

export function unformatCell(num: string) {
    
    num = num.replace(/[^\w\s]/gi, '');
    num = num.replace(/\s+/g, '');

    return num;
}

export function formatProtocol(protocol: string) {

    // protocol = protocol.replace(/(\d{3})(\d)/, "$1.$2");
    // protocol = protocol.replace(/(\d{3})(\d)/, "$1.$2");
    // protocol = protocol.replace(/(\d{3})(\d)/, "$1-$2");
    const regex = /(\d{1,3})(?=(\d{3})+(?!\d))/g;

    return protocol.replace(regex, "$1.");
}

export function getDateTime() {
    const date = new Date().toLocaleString();

    // "(" + num.substring(6, 9) + ") " + num.substring(2, 3) + " " + num.substring(3, 7) + "-" + num.substring(7, 11)

    return (date.substring(6, 10) + "-" + date.substring(3, 5) + "-" + date.substring(0, 2)+"T"+date.substring(11, 19));
    
}