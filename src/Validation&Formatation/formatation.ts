// import { Dayjs } from 'dayjs';

export function unformatCPF(cpf: string) {
    cpf = cpf.replace(/[\s.-]*/igm, '');
    
    return cpf;
}

export function unformatCode(code: string) {
    code = code.replace(/[\s.-]*/igm, '');
    
    return code;
}

export function formatMonth(month: number) {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Verifica se o número do mês está dentro do intervalo válido (1 a 12)
    if (month >= 1 && month <= 12) {
        return meses[month - 1];
    } else {
        return "Mês inválido";
    }
}

export function maskCPF(cpf: string) {

    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  
    return cpf;
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function unformatDate(date: string) {
    return date.split("-")[2] + date.split("-")[1] + date.split("-")[0]
}

export function maskCEP(cep: string) {
    if(cep.trim().length == 0 ) {
        return "(Em Branco)"
    }
    // Remove qualquer caractere não numérico
    const cepApenasNumeros = cep.replace(/\D/g, '');
  
    // Adiciona os separadores no CEP
    const cepFormatado = cepApenasNumeros.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  
    return cepFormatado;
}

export function formatDate(date: Date) {

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "-" + (month < 10 ? "0" + month : month) + "-01";
}

export function formatDateString(date: string, showDay: boolean) {
    
    let day = date.substring(8, 10);
    let month = date.substring(5, 7);
    let year = date.substring(0, 4);

    return (showDay ? day + "-" : "") + month + "-" + year;
}

export function formatDateStringFull(date: string) {
    
    let day = date.substring(6, 8);
    let month = date.substring(4, 6);
    let year = date.substring(0, 4);

    return (day + "/" + month + "/" + year);
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


export function formatCode3(players: string) {

    players = players.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

    return players;
}

export function formatNameMonth(monthNumber: number) {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return monthNames[monthNumber - 1];
};


export function formatarDataHora(date: string) {

    let hour = date.substring(11, 13);
    let minute = date.substring(14, 16);

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

export function getDateTime() {
    const date = new Date().toLocaleString();

    return (date.substring(6, 10) + "-" + date.substring(3, 5) + "-" + date.substring(0, 2)+"T"+date.substring(11, 19));
}