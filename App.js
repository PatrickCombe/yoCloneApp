import React from 'react';
import Swiper from 'react-native-swiper'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  AsyncStorage,
  RefreshControl,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {

  }
  register() {
    this.props.navigation.navigate('Register');
  }
  loginView() {
    this.props.navigation.navigate('LoginPage');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to Yo!</Text>
        <TouchableOpacity onPress={ () => {this.loginView()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };

constructor(props){
  super(props)
  this.state={
    username: '',
    password: '',

  }
}
registerUser() {

  fetch('https://hohoho-backend.herokuapp.com/register', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    //console.log(responseJson)
    if(responseJson.success ==true){
      this.props.navigation.goBack()
    }
    //console.log(responseJson)

    /* do something with responseJson and go back to the Login view but
     * make sure to check for responseJson.success! */
  })
  .catch((err) => {
    /* do something if there was an error with fetching */
  });





}
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig }>Register</Text>
        <TextInput
          style={styles.input }
          placeholder="Enter a username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.input }
           secureTextEntry={true}
          placeholder="Enter a password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.registerUser()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LoginScreenView extends React.Component {
  static navigationOptions = {
    title: 'Login Page'
  };

componentDidMount(){
  AsyncStorage.getItem('user')
  .then(result => {
    var parsedResult = JSON.parse(result);
    var username = parsedResult.username;
    var password = parsedResult.password;
    if (username && password) {
      return this.props.navigation.navigate('Swiper')
        .then(resp => resp.json())
        .then(checkResponseAndGoToMainScreen);
    }
    // Don't really need an else clause, we don't do anything in this case.
  })
  .catch(err => { /* handle the error */ })

}
constructor(props){
  super(props)
  this.state={
    username: '',
    password: ''
  }
}
loginUser() {
  fetch('https://hohoho-backend.herokuapp.com/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson)
    if(responseJson.success ==true){
      AsyncStorage.setItem('user', JSON.stringify({
  username: this.state.username,
  password: this.state.password
}));
      this.props.navigation.navigate('Swiper')
    }
    //console.log(responseJson)

    /* do something with responseJson and go back to the Login view but
     * make sure to check for responseJson.success! */
  })
  .catch((err) => {
    /* do something if there was an error with fetching */
  });

}
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig }>Login</Text>
        <TextInput
          style={styles.input }
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.input }
           secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.loginUser()} }>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Users extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
  });

  _onRefresh = () => {
   this.setState({refreshing: true});
   fetch('https://hohoho-backend.herokuapp.com/users', {
     method: 'GET',
     headers: {
       "Content-Type": "application/json"
     },

   })
   .then((response) => response.json())
   .then((responseJson) => {
     console.log(responseJson.users)

 this.press(responseJson.users)




   })
   .catch((err) => {
     console.log(err)
   })
   .then(() => {
     this.setState({refreshing: false});
   });
 }

touchUser(user){
  fetch('https://hohoho-backend.herokuapp.com/messages', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
    to:user._id
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson)
    if(responseJson){
      Alert.alert(
  'Success',
  'Your HoHoHo has been sent',
  [{text: 'Cool'}] // Button
)
} else{

  Alert.alert(
'Failure',
'Your message could not be sent',
[{text: 'Cool'}] // Button
)
}


  })
  .catch((err) => {

  });
}

  constructor(props) {
      super(props);
      this.state = {
        ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        users:[],
        dataSource: '',
        refreshing: false

      };
    }

press = (responseJson) => {
  this.setState({
    users: responseJson,
    dataSource:this.state.ds.cloneWithRows(responseJson)
  })
}

  componentDidMount(){




    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },

    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson.users)

this.press(responseJson.users)




    })
    .catch((err) => {
      console.log(err)
    });
  }


    render(){


      return(
<View>


  <ListView
    refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />}
    dataSource={this.state.dataSource || this.state.ds.cloneWithRows([])}
    renderRow={(rowData) => <TouchableOpacity onPress ={this.touchUser.bind(this, rowData)} ><Text style={styles.textBig }>{rowData.username}</Text></TouchableOpacity>}
  />



</View>


      )
    }



}


class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages',

  };
  constructor(props) {
      super(props);
      this.state = {
        ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        messages:[],
        dataSource: '',
        refreshing: false
      };
    }

  _onRefresh = () => {
   this.setState({refreshing: true});

   fetch('https://hohoho-backend.herokuapp.com/messages', {
     method: 'GET',
     headers: {
       "Content-Type": "application/json"
     },

   })
   .then((response) => response.json())
   .then((responseJson) => {
     console.log(responseJson.messages)


     return this.press(responseJson.messages)
})
   .then(() => {
     this.setState({refreshing: false});
   });
 }


    press = (responseJson) => {
      this.setState({
        messages: responseJson,
        dataSource:this.state.ds.cloneWithRows(responseJson)
      })
    }

    componentDidMount(){

      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },

      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.messages)


        return this.press(responseJson.messages)




      })
      .catch((err) => {
        console.log(err)
      });
    }

    render(){
      return(
        <View>


          <ListView
            refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                      />}
            dataSource={this.state.dataSource || this.state.ds.cloneWithRows([])}
            renderRow={(rowData) =>
              <TouchableOpacity style={{borderBottomColor: '#000000', borderBottomWidth: '2'}}>
                <Text>
                  <Text style={{fontWeight: "bold"}}>From: </Text>
                  <Text>{rowData.from.username}</Text>
                </Text>
                <Text>
                  <Text style={{fontWeight: "bold"}}>To: </Text>
                  <Text>{rowData.to.username}</Text>
                </Text>
                <Text>
                  <Text style={{fontWeight: "bold"}}>Message: </Text>
                  <Text>Yo</Text>
                </Text>
                <Text>
                  <Text style={{fontWeight: "bold"}}>Date: </Text>
                  <Text>{rowData.timestamp}</Text>
                </Text>


              </TouchableOpacity>}
            />



          </View>
        )
      }

    }

    class SwiperScreen extends React.Component {
      static navigationOptions = {
        title: 'HoHoHo!'

      };

      render() {
        return (
          <Swiper loop={false}>
          <Users />
          <Messages />
          </Swiper>
        );
      }
    }

    //Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  LoginPage: {
    screen: LoginScreenView,
  },
  Swiper: {
    screen: SwiperScreen
  }
//   Users: {
//   screen: Users
// },
// Messages: {
// screen: Messages
// }
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  input: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    fontSize: 30,
    backgroundColor: '#ECF0F1'
  }
});
