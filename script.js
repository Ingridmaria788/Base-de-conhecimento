const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector("#search-input"); // Assumindo que seu input de busca tem o id="search-input"
let dados = [];

async function carregarDados() {
  try {
    const resposta = await fetch("data.json");
    if (!resposta.ok) {
      throw new Error(`Erro ao carregar dados: ${resposta.statusText}`);
    }
    dados = await resposta.json();
    renderizarCards(dados);
  } catch (error) {
    console.error("Falha na requisição:", error);
    cardContainer.innerHTML =
      "<p>Não foi possível carregar os pontos turísticos. Tente novamente mais tarde.</p>";
  }
}

function renderizarCards(items) {
  cardContainer.innerHTML = ""; // Limpa o container antes de renderizar novos cards

  if (items.length === 0) {
    cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  for (const item of items) {
    const article = document.createElement("article");
    article.classList.add("card");

    // Lógica para exibir o preço correto
    let precoHtml = "";
    if (item.preço_medio) {
      precoHtml = `<p><strong>Preço Médio:</strong> ${item.preço_medio}</p>`;
    } else if (item.preço_entrada) {
      precoHtml = `<p><strong>Entrada:</strong> ${item.preço_entrada}</p>`;
    }

    const imageUrl = item.image
      ? item.image
      : `https://source.unsplash.com/800x600/?${encodeURIComponent(item.nome)}`;
    article.innerHTML = `
            <img src="${imageUrl}" alt="${item.nome}" class="card-image"/>
            <div class="card-content">
                <h2>${item.nome}</h2>
                <p>${item.descricao}</p>
                ${precoHtml}
                <p>${item.horario_funcionamento}</p>
                <a href="${item.maps_link}" target="_blank">Mais informações</a>
            </div>`;
    cardContainer.appendChild(article);
  }
}

// Função para remover acentos e converter para minúsculas
function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Busca acionada apenas ao clicar no botão de busca
const botaoBusca = document.querySelector("#botao-busca");
if (botaoBusca) {
  botaoBusca.addEventListener("click", () => {
    const termoBusca = normalizarTexto(searchInput.value);

    const dadosFiltrados = dados.filter((dado) => {
      const nomeNormalizado = normalizarTexto(dado.nome);
      const descricaoNormalizada = normalizarTexto(dado.descricao);
      return (
        nomeNormalizado.includes(termoBusca) ||
        descricaoNormalizada.includes(termoBusca)
      );
    });
    renderizarCards(dadosFiltrados);
  });
} else {
  console.warn(
    "Botão de busca (#botao-busca) não encontrado no DOM. A busca por clique não funcionará."
  );
}

// Inicia o carregamento dos dados quando a página é carregada
carregarDados();
