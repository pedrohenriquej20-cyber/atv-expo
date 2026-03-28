import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, FlatList, StyleSheet, Alert, TextInput } from 'react-native';

const HEADERS = {
  'X-Parse-Application-Id': '5TeimiGR7KvAT6OqJIEUemQso8YAUCosCkoNQGtU',
  'X-Parse-JavaScript-Key': 'LMMOrUtj9MkS3OQlTmBBGmx6k60n5IgbQxM2eLUj',
  'Content-Type': 'application/json'
};

const API_URL = 'https://parseapi.back4app.com/classes/Tarefa';

export default function TelaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  // Método GET (Listar)
  const carregarTarefas = async () => {
    try {
      const response = await fetch(API_URL, { headers: HEADERS });
      const data = await response.json();
      setTarefas(data.results);
    } catch (error) {
      console.error("Erro ao buscar tarefas: ", error);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  // Método POST (Criar nova tarefa)
  const adicionarTarefa = async () => {
    if (novaTarefa.trim() === '') return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ descricao: novaTarefa, concluida: false })
      });
      
      if (response.ok) {
        setNovaTarefa(''); // Limpa o input
        carregarTarefas(); // Recarrega a lista do banco
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
    }
  };

  // Método PUT (Atualizar o status de "concluida")
  const alternarConclusao = async (id, statusAtual) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify({ concluida: !statusAtual })
      });
      
      if (response.ok) {
        setTarefas(tarefas.map(tarefa => 
          tarefa.objectId === id ? { ...tarefa, concluida: !statusAtual } : tarefa
        ));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  };

  // Método DELETE (Excluir tarefa)
  const deletarTarefa = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: HEADERS
      });

      if (response.ok) {
        setTarefas(tarefas.filter(tarefa => tarefa.objectId !== id));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar a tarefa.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={[styles.texto, item.concluida && styles.textoConcluido]}>
        {item.descricao}
      </Text>
      
      <View style={styles.controles}>
        <Switch
          value={item.concluida}
          onValueChange={() => alternarConclusao(item.objectId, item.concluida)}
        />
        <Button 
          title="Deletar" 
          color="#ff5c5c" 
          onPress={() => deletarTarefa(item.objectId)} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Formulário para adicionar nova tarefa */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova tarefa..."
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />
        <Button title="Adicionar" onPress={adicionarTarefa} color="#007bff" />
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.objectId}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  texto: {
    fontSize: 16,
    flex: 1,
  },
  textoConcluido: {
    textDecorationLine: 'line-through',
    color: '#a0a0a0',
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }
});