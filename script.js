function submissao(event) {
    event.preventDefault();

    const nome = document.getElementById("name").value;
    const dataNasc = document.getElementById("birth-date").value;
    const data = new Date(dataNasc + "T00:00:00");
    const formato = new Intl.DateTimeFormat('pt-BR', {day:'2-digit', month: '2-digit', year: 'numeric'});    
    const dataFormato = formato.format(data);

    console.log(nome);
    console.log(dataFormato);

    log.textContent = "Aniversariante cadastrado com sucesso!"
    setTimeout(() => {
        log.textContent = "";
    }, 2500);
    
    addLinhaTabela(nome, dataFormato);
    
    const pessoas = JSON.parse(localStorage.getItem("pessoas")) || [];
    pessoas.push({ nome, dataNasc });
    localStorage.setItem("pessoas", JSON.stringify(pessoas));
    
    document.getElementById("name").value="";
    document.getElementById("birth-date").value="";
}

function addLinhaTabela(nome, dataFormato, dataNasc){
    const tabela = document.getElementById("tabela-cadastros");
    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = `<td>${nome}</td><td>${dataFormato}</td><td></td>`;
    
    const acoesCelula = novaLinha.querySelector("td:last-child");
    
    const buttonEditar = editar(novaLinha, dataNasc);
    const buttonDeletar = deletar(novaLinha, nome);

    acoesCelula.appendChild(buttonEditar);
    acoesCelula.appendChild(buttonDeletar);
    
    tabela.appendChild(novaLinha);
}

function editar(linha, dataNascOriginal){
    const edit = document.createElement("button");
    edit.textContent = "Editar";
    edit.className = "editButton";
    edit.type = "button";

    edit.onclick = function() {
        const nomeAnterior = linha.children[0];
        const dataAnterior = linha.children[1];
        
        const nomeOriginal = nomeAnterior.textContent;

        let novoNome = prompt("Editar nome:", nomeOriginal.textContent);
        if(!novoNome && novoNome.trim() !== ""){
            alert("Não é permitido que o nome esteja vazio!")
            return;
        }

        let novaData = prompt("Editar data de nascimento (dd/mm/aaaa):", dataAnterior.textContent);
        let dataAtualizada = dataNascOriginal;

        if(novaData){
            const partesData = novaData.split("/");
            if(partesData.length === 3){
                const [dia, mes, ano] = partesData;
                const novaDataFormato = `${ano}-${mes}-${dia}`;
                const data = new Date(novaDataFormato + "T00:00:00");

                if(!isNaN(data.getTime())){
                    const formato = new Intl.DateTimeFormat('pt-BR', {day:'2-digit', month: '2-digit', year: 'numeric'});    
                    dataAnterior.textContent = formato.format(data);
                    dataNasc = novaDataFormato;
                }
                else{
                    alert("Data fora do formato dd/mm/aaaa!");
                    return;
                }
            }
            else {
                alert("Use o formato dd/mm/aaaa para datas!");
                return;
            }
        }

        nomeAnterior.textContent = novoNome;
        
        updateLocalStorageEspecifico(nomeOriginal, dataNascOriginal, novoNome, dataAtualizada);

        log.textContent = "Aniversariante editado com sucesso!"
        setTimeout(() => {
            log.textContent = "";
        }, 2500);
    };
    return edit;
}

function updateLocalStorageEspecifico(nomeAnterior, dataAnterior, novoNome, novaData) {
    let pessoas = JSON.parse(localStorage.getItem("pessoas")) || [];
    
    pessoas = pessoas.map(pessoa => {
        if(pessoa.nome === nomeAnterior && pessoa.dataNasc === dataAnterior){
            return { nome: novoNome, dataNasc: novaData};
        }
        return pessoa;
    });

    localStorage.setItem("pessoas", JSON.stringify(pessoas));
}

function deletar(linha, nome){
    const remover = document.createElement("button");
    remover.textContent = "Deletar";
    remover.className = "deleteButton";
    remover.type = "button";

    remover.onclick = function() {
        const confirmar = confirm("Tem certeza que deseja remover o registro?")
        if(confirmar){
            linha.remove();

            const pessoas = JSON.parse(localStorage.getItem("pessoas")) || [];
            const pessoasAtualizado = pessoas.filter(pessoa => pessoa.nome !== nome);
            localStorage.setItem("pessoas", JSON.stringify(pessoasAtualizado));
        }
        log.textContent = "Aniversariante excluído com sucesso!"
        setTimeout(() => {
            log.textContent = "";
        }, 2500);
    };

    return remover;
}

window.addEventListener("load", () => {
    const pessoas = JSON.parse(localStorage.getItem("pessoas")) || [];
    
    pessoas.forEach(pessoa => {
        if(!pessoa.dataNasc) return;
        const data = new Date(pessoa.dataNasc + "T00:00:00");
        if(isNaN(data)) return;
        const formato = new Intl.DateTimeFormat('pt-BR', {day:'2-digit', month: '2-digit', year: 'numeric'});    
        const dataFormato = formato.format(data);
        
        addLinhaTabela(pessoa.nome, dataFormato, pessoa.dataNasc);
    });
});

const formulario = document.querySelector('form');
formulario.addEventListener('submit', submissao);


