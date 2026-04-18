import axios from "axios";

// A URL da API que já está rodando no Vercel na sua conta secundária
const urlBase = "https://app-express-livid.vercel.app/tarefas";

const headersJson = {
  "Content-Type": "application/json",
};

export async function getTarefas() {
  const response = await axios.get(urlBase);
  return response.data; 
}

export async function getTarefa(id) {
  const response = await axios.get(`${urlBase}/${id}`);
  return response.data;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(urlBase, novaTarefa, {
    headers: headersJson,
  });
  return response.data;
}

export async function atualizarTarefa(tarefaAtualizada) {
  const response = await axios.put(
    `${urlBase}/${tarefaAtualizada.id}`,
    tarefaAtualizada,
    {
      headers: headersJson,
    },
  );
  return response.data;
}

export async function removerTarefa(id) {
  const response = await axios.delete(`${urlBase}/${id}`);
  return response.data;
}