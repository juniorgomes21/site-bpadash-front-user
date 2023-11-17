
export function isValidCPF(cpf) {
    
    cpf = cpf.replace(/[\s.-]*/igm, '');
    var soma = 0;
    var resto = null;

    if (typeof cpf !== "string") {
        return false;
    }
    
    if ( !cpf || cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999") {
        return false
    }
    

    for (var i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11))  resto = 0

        if (resto != parseInt(cpf.substring(9, 10)) ) false
    }

    soma = 0

    for (var i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
    }

    resto = (soma * 10) % 11

    if ((resto == 10) || (resto == 11))  resto = 0

    if (resto != parseInt(cpf.substring(10, 11) ) ) return false

    return true;
}

export function isValidName(name) {
    const regexEspecial = /[^a-zA-Z 0-9]+/g;
    const regexNum = /[0-9]/

    if(regexEspecial.test(name)) {

        return false;
    } else if(regexNum.test(name)) {

        return false;
    } else if(name === ""){

        return false;
    } else if(name.length < 6){

        return false;
    } else {

        return true;
    }
}

export function isValidCodeCollaborator(code) {
    if(code === ""){
        return false;
    } else if(code.length < 4){
        return false;
    } else {
        return true;
    }
}

export function isValidCodeEmail(code) {
    if(Number.isInteger(code) && code.toString().length == 6) {
        return true
    }
    
    return false;
}

export function isValidEmail(email) {
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;

    if(emailRegex.test(email)) {

        return true;
    } else {

        return false;
    }
}

export function isValidCell(num) {
    num = num.replace(/[^\w\s]/gi, '');
    num = num.replace(/\s+/g, '');

    const cellRegex = /^[0-9]+$/;

    if(num.length == 11) {
        if(cellRegex.test(num)) {
            return true
        }
    } else {
        return false;
    }
}

export function isValidPassword(password) {
    
    return password.length >= 8;
}

export function isValidProfessional(professional) {
    const erros = [];
    const name = professional.name.trim();
    const cns = professional.cns.trim();
    const cbo = professional.cbo.trim();

    if(name == '' || name.length < 3) {
        const obj = {
            field: "name",
            message: name.length < 3 ? "Caracteres insuficientes" : "O Nome é obrigatório"
        }
        erros.push(obj);
    }
    
    if(cns == '' || cns.length < 14) {
        const obj = {
            field: "cns",
            message: cns.length < 14 ? "Caracteres insuficientes" : "O CNS é obrigatório"
        }
        erros.push(obj);

    }
    
    if(cbo == '' || cbo.length < 6) {
        const obj = {
            field: "cbo",
            message: cbo.length < 6 ? "Caracteres insuficientes" : "O CBO é obrigatório"
        }
        erros.push(obj);
    }

    return erros;
}