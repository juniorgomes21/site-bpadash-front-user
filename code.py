@app.route('/upload_xml', methods=['GET', 'POST'])
def upload_xml():
    # Processamento do arquivo
    dbase = sqlite3.connect("//10.0.0.59/Faturamento/FPO.db")
    cursor_obj = dbase.cursor()

    cursor_obj.execute('''
        CREATE TABLE IF NOT EXISTS profissionais (
            prof_id TEXT PRIMARY KEY,
            cpf_prof TEXT,
            pispasep TEXT,
            nome_prof TEXT,
            nome_mae TEXT,
            data_nasc TEXT,
            cod_mun TEXT,
            sexo TEXT,
            num_livro TEXT,
            num_folha TEXT,
            num_termo TEXT,
            codorgemis TEXT,
            data_emiss TEXT,
            num_ident TEXT,
            sigla_est TEXT,
            dtemiident TEXT,
            data_entra TEXT,
            ctps_numer TEXT,
            serie TEXT,
            sigestctps TEXT,
            dtemisctps TEXT,
            logradouro TEXT,
            numero TEXT,
            complement TEXT,
            bairrodist TEXT,
            cod_cep TEXT,
            sigla_uf TEXT,
            codescolar TEXT,
            cod_certid TEXT,
            ind_nacio TEXT,
            nome_carto TEXT,
            cod_banco TEXT,
            nome_pais TEXT,
            num_agenc TEXT,
            conta_cc TEXT,
            cod_cns TEXT,
            d_tercsih TEXT,
            status TEXT,
            statusmov TEXT,
            data_atu TEXT,
            usuario TEXT,
            cd_raca TEXT,
            telefone TEXT,
            nome_pai TEXT,
            cd_tp_logr TEXT,
            portaria TEXT,
            dt_natur TEXT,
            cd_pais TEXT,
            cod_cbo TEXT, 
            ind_vinc,cghoraoutr TEXT, 
            cghoraamb,conselhoid TEXT, 
            n_registro TEXT, 
            vinculo_sus TEXT, 
            usuario_vinculo TEXT, 
            cghorahosp TEXT
        )
    ''')

    if request.method == 'POST':
        file = request.files.get('file')

        if not file or file.filename == '':
            # Se o arquivo não for fornecido ou não for um arquivo de texto válido, redirecione
            return redirect(request.url)

        # Deleta os dados existentes
        cursor_obj.execute("DELETE FROM profissionais")
        dbase.commit()

        # Processa as linhas do arquivo XML
        tree = ET.parse(file)

        # Conexão com o banco SQLite
        conn = sqlite3.connect(caminho)
        cursor = conn.cursor()

        # Criação da tabela

        # Iteração sobre os elementos do XML e inserção no banco SQLite
        for profissional_elem in tree.findall('.//DADOS_PROFISSIONAIS'):
            prof_id = profissional_elem.get('PROF_ID')
            cpf_prof = profissional_elem.get('CPF_PROF')
            pispasep = profissional_elem.get('PISPASEP')
            nome_prof = profissional_elem.get('NOME_PROF')
            nome_mae = profissional_elem.get('NOME_MAE')
            data_nasc = profissional_elem.get('DATA_NASC')
            cod_mun = profissional_elem.get('COD_MUN')
            sexo = profissional_elem.get('SEXO')
            num_livro = profissional_elem.get('NUM_LIVRO')
            num_folha = profissional_elem.get('NUM_FOLHA')
            num_termo = profissional_elem.get('NUM_TERMO')
            codorgemis = profissional_elem.get('CODORGEMIS')
            data_emiss = profissional_elem.get('DATA_EMISS')
            num_ident = profissional_elem.get('NUM_IDENT')
            sigla_est = profissional_elem.get('SIGLA_EST')
            dtemiident = profissional_elem.get('DTEMIIDENT')
            data_entra = profissional_elem.get('DATA_ENTRA')
            ctps_numer = profissional_elem.get('CTPS_NUMER')
            serie = profissional_elem.get('SERIE')
            sigestctps = profissional_elem.get('SIGESTCTPS')
            dtemisctps = profissional_elem.get('DTEMISCTPS')
            logradouro = profissional_elem.get('LOGRADOURO')
            numero = profissional_elem.get('NUMERO')
            complement = profissional_elem.get('COMPLEMENT')
            bairrodist = profissional_elem.get('BAIRRODIST')
            cod_cep = profissional_elem.get('COD_CEP')
            sigla_uf = profissional_elem.get('SIGLA_UF')
            codescolar = profissional_elem.get('CODESCOLAR')
            cod_certid = profissional_elem.get('COD_CERTID')
            ind_nacio = profissional_elem.get('IND_NACIO')
            nome_carto = profissional_elem.get('NOME_CARTO')
            cod_banco = profissional_elem.get('COD_BANCO')
            nome_pais = profissional_elem.get('NOME_PAIS')
            num_agenc = profissional_elem.get('NUM_AGENC')
            conta_cc = profissional_elem.get('CONTA_CC')
            cod_cns = profissional_elem.get('COD_CNS')
            d_tercsih = profissional_elem.get('D_TERCSIH')
            status = profissional_elem.get('STATUS')
            statusmov = profissional_elem.get('STATUSMOV')
            data_atu = profissional_elem.get('DATA_ATU')
            usuario = profissional_elem.get('USUARIO')
            cd_raca = profissional_elem.get('CD_RACA')
            telefone = profissional_elem.get('TELEFONE')
            nome_pai = profissional_elem.get('NOME_PAI')
            cd_tp_logr = profissional_elem.get('CD_TP_LOGR')
            portaria = profissional_elem.get('PORTARIA')
            dt_natur = profissional_elem.get('DT_NATUR')
            cd_pais = profissional_elem.get('CD_PAIS')

            data = (
                prof_id, cpf_prof, pispasep, nome_prof, nome_mae, data_nasc, cod_mun, sexo, num_livro,
                num_folha, num_termo, codorgemis, data_emiss, num_ident, sigla_est, dtemiident, data_entra,
                ctps_numer, serie, sigestctps, dtemisctps, logradouro, numero, complement, bairrodist, cod_cep,
                sigla_uf, codescolar, cod_certid, ind_nacio, nome_carto, cod_banco, nome_pais, num_agenc, conta_cc,
                cod_cns, d_tercsih, status, statusmov, data_atu, usuario, cd_raca, telefone, nome_pai, cd_tp_logr,
                portaria, dt_natur, cd_pais
            )

            vinculos_elem = profissional_elem.find('.//VINCULOS_PROF/DADOS_VINC_PROF')  # Ajuste na busca
            if vinculos_elem is not None:
                cod_cbo = vinculos_elem.get('COD_CBO')
                ind_vinc = vinculos_elem.get('IND_VINC')
                cghoraoutr = vinculos_elem.get('CGHORAOUTR')
                cghoraamb = vinculos_elem.get('CG_HORAAMB')
                conselhoid = vinculos_elem.get('CONSELHOID')
                n_registro = vinculos_elem.get('N_REGISTRO')
                vinculo_sus = vinculos_elem.get('VINCULO_SUS')
                usuario_vinculo = vinculos_elem.get('USUARIO')
                cghorahosp = vinculos_elem.get('CGHORAHOSP')

                # Adicione esses dados à lista 'data'
                # Adicione esses dados à lista 'data'
                data = (
                    prof_id, cpf_prof, pispasep, nome_prof, nome_mae, data_nasc, cod_mun, sexo, num_livro,
                    num_folha, num_termo, codorgemis, data_emiss, num_ident, sigla_est, dtemiident, data_entra,
                    ctps_numer, serie, sigestctps, dtemisctps, logradouro, numero, complement, bairrodist, cod_cep,
                    sigla_uf, codescolar, cod_certid, ind_nacio, nome_carto, cod_banco, nome_pais, num_agenc, conta_cc,
                    cod_cns, d_tercsih, status, statusmov, data_atu, usuario, cd_raca, telefone, nome_pai, cd_tp_logr,
                    portaria, dt_natur, cd_pais,
                    cod_cbo, ind_vinc, cghoraoutr, cghoraamb, conselhoid, n_registro, vinculo_sus, usuario_vinculo,
                    cghorahosp
                )

                # Imprima os dados para depuração
                print("Dados de VINCULOS_PROF:", data)

                # Adicione a tupla 'data' ao banco de dados
                insert_data(cursor, data)

        # Commit e fechamento da conexão
        conn.commit()
        conn.close()

    # Recupera os dados do banco de dados
    cursor_obj.execute("SELECT * FROM profissionais")
    data = cursor_obj.fetchall()
    dbase.close()
    username = session.get('username')
    return render_template('upload_xml.html', data=data, username=username)