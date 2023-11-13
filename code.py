def rel_sespa():
    answer = askokcancel(title='Upload de Arquivo R0004790F da SESPA?',
                         message='Esta tarefa faz UPLOAD do realatório da SESPA para o banco de dados - Deseja continuar?',
                         icon=WARNING)
    if answer:
        filename = filedialog.askopenfilename(initialdir="/",
                                              title="Selecione o Arquivo R0004790F",
                                              filetypes=(("all files","*.*"),("Arquivo de Texto","*.txt*")))

        word = filename
        ARQ = word

        dbase = sqlite3.connect("//10.0.0.59/Faturamento/FPO.db")  # Open a database File
        cursor_obj = dbase.cursor()
        cursor_obj.execute("SELECT * FROM relsespaF")
        print(cursor_obj.fetchall())

        # delete data
        '''It will delete all rows from
           the table
        '''
        cursor_obj.execute("DELETE FROM relsespaF")
        print()
        print("After deleting all rows")
        cursor_obj.execute("SELECT * FROM relsespaF")
        print(cursor_obj.fetchall())
        dbase.commit()
        # Close the connection
        dbase.close()

        with open(ARQ, 'r+') as arquivo:
            arquivo = arquivo.readlines()
        for linha in arquivo:
            linha = linha.rstrip()
            if linha[2:4].isnumeric():
                print(linha[2:12] + linha[14:74] + linha[85:94] + linha[93:105] + linha[103:120] + linha[
                                                                                                   119:128] + linha[
                                                                                                              127:143] + linha[
                                                                                                                         143:151] + linha[
                                                                                                                                    150:166])
                pa = linha[2:12]
                descricao = linha[14:74]
                qtorcada = linha[85:94]
                vlunit = linha[93:105]
                vltotal = linha[104:120]
                qtprd = linha[119:128]
                vlprd = linha[127:143]
                qtapr = linha[143:151]
                vlapr = linha[150:166]
                # criar banco temporário
                dbase = sqlite3.connect("//10.0.0.59/Faturamento/FPO.db")  # Open a database File
                print('Database opened')
                cursor = dbase.cursor()
                table = """CREATE TABLE IF NOT EXISTS relsespaF (
                                                                                                                       cod INTEGER PRIMARY KEY,
                                                                                                                       pa CHAR(9),
                                                                                                                       descricao CHAR(100),
                                                                                                                       qtorcada CHAR(100),
                                                                                                                       vlunit CHAR(100),
                                                                                                                       vltotal CHAR(100),
                                                                                                                       qtprd CHAR(100),
                                                                                                                       vlprd CHAR(100),
                                                                                                                       qtapr CHAR(100),
                                                                                                                       vlapr CHAR(100));"""
                cursor.execute(table)

                cursor.execute(
                    """ INSERT INTO relsespaF (pa, descricao, qtorcada, vlunit, vltotal, qtprd, vlprd, qtapr, vlapr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (pa, descricao, qtorcada, vlunit, vltotal, qtprd, vlprd, (qtapr), vlapr))
                # Commit your changes in the database

                dbase.commit()
                dbase.close()
        root = tk.Tk()
        root.title('SINTESE DE FATURAMETNTO (SESPA)')
        root.iconbitmap('Arquivos/icone.ico')
        root.geometry("800x700")
        tv = ttk.Treeview(root, show='headings', height=3)
        conn = sqlite3.connect("//10.0.0.59/Faturamento/FPO.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM relsespaF")
        columns = [description[0] for description in cursor.description]
        tv.configure(columns=columns)

        # Define a largura de cada coluna
        for col in columns:
            tv.heading(col, text=col, anchor=W)
            tv.column("pa", width=70)
            tv.column("descricao", width=560)

        entry1 = ttk.Entry(root)
        entry2 = ttk.Entry(root)

        label1 = ttk.Label(root, text="Procedimento:")
        label2 = ttk.Label(root, text="Descrição:")

        label1.pack()
        entry1.pack()
        label2.pack()
        entry2.pack()

        def filter_table(event):
            try:
                filter_text1 = entry1.get()
                filter_text2 = entry2.get()

                for item in tv.get_children():
                    tv.delete(item)
                cursor.execute(
                    f'SELECT * FROM relsespaF WHERE pa LIKE "%{filter_text1}%" AND descricao LIKE "%{filter_text2}%"COLLATE NOCASE')
                for row in cursor:
                    tv.insert('', END, values=row, iid=row[0])
            except Exception as e:
                print(e)

        entry1.bind("<KeyRelease>", filter_table)
        entry2.bind("<KeyRelease>", filter_table)

        tv.pack(fill=tk.BOTH, expand=True)
        for row in cursor:
            tv.insert('', END, values=row, iid=str(uuid.uuid4()))
        root.mainloop()
        messagebox.showinfo("Relatório de SESPA",
                                    "SINTESE DE FATURAMENTO gerado com sucesso!")