// encontrar o botão adicionar tarefa

const btnAdicionarTarefa = document.querySelector('.app__button--add-task')
const formAdicionarTarefa = document.querySelector('.app__form-add-task')
const textarea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function editarTarefa(tarefa, elementoTarefa) {
    const descricaoEditada = prompt("Edite a tarefa", tarefa.descricao);
    if (descricaoEditada !== null && descricaoEditada.trim() !== '') {
        tarefa.descricao = descricaoEditada;
        // Atualizar a interface do usuário aqui e o localStorage
        atualizarTarefas()
        // Atualizar a visualização da tarefa na lista
        elementoTarefa.querySelector('p').textContent = descricaoEditada;
        alert("Tarefa atualizada com sucesso!")
    } else {
        alert("Atualização cancelada ou valor inválido!")
    }
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')
    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        editarTarefa(tarefa, li);
    }

    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src', '/imagens/edit.png')
    
    botao.append(imagemBotao)
    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
        } else {
            li.onclick = () => {
                //removendo a borda das tarefas selecionadas anteriormente
                document.querySelectorAll('.app__section-task-list-item-active')
                    .forEach(elemento => {
                        elemento.classList.remove('app__section-task-list-item-active')
                    })
                
                //removendo borda e tarefa em andamento, quando clicada 2x na mesma tarefa
                if(tarefaSelecionada == tarefa){
                    paragrafoDescricaoTarefa.textContent = ''
                    tarefaSelecionada = null
                    liTarefaSelecionada = null
                    return
                }
                tarefaSelecionada = tarefa
                liTarefaSelecionada = li
                paragrafoDescricaoTarefa.textContent = tarefa.descricao
                
                //adicionando borda nas tarefas selecionadas e adicionando ao tarefa em andamento
                li.classList.add('app__section-task-list-item-active')
            }
    }

    return li
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden')
})

//botão cancelar limpa o formulário
const btnCancelar = document.querySelector('.app__form-footer__button--cancel')
const limparFormulario = () => {
    textarea.value = ''
}
btnCancelar.addEventListener('click', limparFormulario);

//botão deletar apaga o que está escrito e esconde o formulário de adicionar nova tarefa 
const btnDeletar = document.querySelector('.app__form-footer__button--delete')
const deletarFormulario = () => {
    textarea.value = ''
    formAdicionarTarefa.classList.toggle('hidden')
}
btnDeletar.addEventListener('click', deletarFormulario)

//adicionar nova tarefa
formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textarea.value = ''
    formAdicionarTarefa.classList.add('hidden')
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});

//quando a tarefa for concluida, altera a classe dela para a de tarefa completa
document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

//botão de remover as tarefas concluidas
btnRemoverConcluidas.onclick = () => {
    const seletor = ".app__section-task-list-item-complete"
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    //filtrando todos os elementos que não estão completos, e atualizando a lista de tarefas com esses elementos
    tarefas = tarefas.filter(tarefa => !tarefa.completa)
    atualizarTarefas()
}