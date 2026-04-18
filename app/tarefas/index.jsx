import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, FlatList, StyleSheet, Alert, TextInput } from 'react-native';

// URL da sua API no Vercel
const API_URL = 'https://app-express-livid.vercel.app/tarefas';

export default function TelaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  // Método GET (Listar do NeonDB via Vercel)
  const carregarTarefas = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas: ", error);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  // Método POST (Criar no NeonDB)
  const adicionarTarefa = async () => {
    if (novaTarefa.trim() === '') return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          descricao: novaTarefa, // Nome exato da coluna no banco
          concluida: false 
        })
      });
      
      if (response.ok) {
        setNovaTarefa(''); 
        carregarTarefas(); 
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
    }
  };

  // Método PUT (Atualizar no NeonDB)
  const alternarConclusao = async (id, statusAtual, descricao) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          descricao: descricao,
          concluida: !statusAtual 
        })
      });
      
      if (response.ok) {
        carregarTarefas();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  };

  // Método DELETE (Excluir do NeonDB)
  const deletarTarefa = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        carregarTarefas();
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
          onValueChange={() => alternarConclusao(item.id, item.concluida, item.descricao)}
        />
        <Button 
          title="Deletar" 
          color="#ff5c5c" 
          onPress={() => deletarTarefa(item.id)} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  form: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  input: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  texto: { fontSize: 16, flex: 1 },
  textoConcluido: { textDecorationLine: 'line-through', color: '#a0a0a0' },
  controles: { flexDirection: 'row', alignItems: 'center', gap: 10 }
});
