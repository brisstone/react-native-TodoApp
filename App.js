//creation of TodoApp that stores the Todos on the user device

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  FlatList, 
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';





const COLORS = {primary: '#1f145c', white: '#fff', secondary: '#00bfff'}



export default function App() {

 

  const [textInput, setTextInput] = React.useState('');

  const [todos, setTodos] = React.useState([
    {id:1, task: 'First Todo', completed: false},
    {id:2, task: 'Second Todo', completed: true},
  
  ])


  //we want to call these just once
  React.useEffect(()=>{
    getTodosFromUserDevie() 
}, []);

  //This gets called everytime there is a change in the todo
  React.useEffect(()=>{
        saveToUserDevie(todos); 
  }, [todos]);



    const ListItem = ({todo}) => {
        return <View style = {styles.ListItem}>
                  <View style={{flex: 1}}> 
                      <Text style={{fontWeight: 'bold', fontSize: 15, color: COLORS.primary, 
                        textDecorationLine: todo?.completed?"line-through":"none" }}>{todo?.task} 
                      </Text> 
                  </View>  
                  
                  {!todo?.completed && (
                    <TouchableOpacity style ={[styles.actionIcon]}>
                    <Icon name= "done" size = {20} color= {COLORS.white} onPress = {() => markTodoComplete(todo?.id)} />   
                  </TouchableOpacity>
                  )
                  }

                  

                  <TouchableOpacity style ={[styles.actionIcon, {backgroundColor: 'red'}]} onPress = {() => deleteTodo(todo?.id)} >
                    <Icon name= "delete" size = {20} color= {COLORS.white} />   
                  </TouchableOpacity>
        </View>
    } 

    const saveToUserDevie = async (todos) =>{
      try{
          const stringifyTodos = JSON.stringify(todos);
          await AsyncStorage.setItem('todos', stringifyTodos)
      }catch(e){
          console.log(e);
      }
    }

    //Retrieve from user device
    const getTodosFromUserDevie = async (todos) =>{
      try{
          
           const todos = await AsyncStorage.getItem('todos');

           if(todos != null){
             //convert the stored todos back to object. 
             setTodos(JSON.parse(todos))
           }
      }catch(e){
          console.log(e);
      }
    }; 

    const addTodo = ()=>{
          console.log(textInput)
          if(textInput == ''){
            alert('Error', 'Please input Todo');
          }else{
            const newTodo ={
              id: Math.random(),
              task: textInput,
              completed: false
            };
            setTodos([...todos, newTodo]);
            setTextInput('');
          }
         
    }

    const markTodoComplete = (todo_id) =>{
     
      
      const newTodos = todos.map((item)=>{
        if(item.id == todo_id){
          return {...item, completed: true}
        }else{
          return item;
        }
      });
        
        setTodos(newTodos);

    }

    const deleteTodo = (todo_id) =>{
      console.log(todo_id);
      const newTodo = todos.filter((item)=>{
        return item.id != todo_id
      })
      setTodos(newTodo)
    }

    const clearTodo = (todo_id) =>{
      setTodos([]);
      // alert("confirm", "clear todos?", [
      //   {
      //     text: 'yes', 
      //     onPress: () => setTodos([])
      //   },
      //   {
      //     text: 'No'
      //   }
      // ])
      
    }

  return (
      <SafeAreaView style= {{flex: 1, backgroundColor: COLORS.white}}>
          <View style ={styles.header}>
              <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>TODO APP</Text>
              <Icon name = "delete" size = {25} color = "red" onPress = {() => clearTodo()} />
          </View>

          <FlatList 
            showsVerticalScrollIndicator = {false}
            contentContainerStyle= {{padding: 20, paddingBottom: 100}}
            data={todos} 
            renderItem= {({item}) => <ListItem todo ={item} /> } 
          />

          <View style={styles.footer}>
           
              <View style={styles.inputContainer} >
                <TextInput value= {textInput} placeholder = "Add Todo" onChangeText={(text)=> setTextInput(text)} />
              </View>

              <TouchableOpacity>
                <View style = {styles.iconContainer}>
                  <Icon name="add" color = {COLORS.white} size= {30} onPress = {()=> addTodo()} />
                </View>
              </TouchableOpacity>


          </View>



      </SafeAreaView>
    

    
  );
}

const styles = StyleSheet.create({
  actionIcon: {
    width: 25,
    height: 25,
    backgroundColor: 'green',
    justifyContent: "center",
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3 

    },
  ListItem: {
    padding: 10,
    border: 'solid 1 ',
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    
  },
  footer: {
    position: 'absolute',
   width: '100%',
   header:30,  
   backgroundColor: COLORS.secondary, 
   bottom: 0,
   flexDirection: 'row',
   alignItems: 'center',
   paddingHorizontal: 20,
  


  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    borderRadius:30,
    height: 50,
   
    marginVertical: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
   justifyContent: 'center'
    
   
  },
  iconContainer: {
    
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


