import axios from "axios";

const urlBase = "https://parseapi.back4app.com/classes/Tarefa";
const headers = {
  "X-Parse-Application-Id": "5TeimiGR7KvAT6OqJIEUemQso8YAUCosCkoNQGtU",
  "X-Parse-JavaScript-Key": "LMMOrUtj9MkS3OQlTmBBGmx6k60n5IgbQxM2eLUj",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

export async function getTarefas() {
  const response = await axios.get(urlBase, {
    headers: headers,
  });
  return response.data.results;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(urlBase, novaTarefa, {
    headers: headersJson,
  });
  return response.data;
}
