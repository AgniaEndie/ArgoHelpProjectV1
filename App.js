import {StatusBar} from 'expo-status-bar';
import {
    Image,
    ImageBackground,
    Text,
    TextInput,
    View,
    Button,
    StyleSheet,
    ActivityIndicator,
    FlatList
} from 'react-native';
import axios, {formToJSON} from "axios";
import React, {useEffect, useState} from "react";
import {SecureStone} from 'expo';
// import {AsyncStorage} from "react-native";
import {NavigationContainer, NavigationContext} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ImageAssets = {
    menuBurger: require('./assets/menuBurger.png'),
    img1: require('./assets/bgmain.png'),
    plant: require('./assets/plant.png'),
    news: require('./assets/news.png'),
    courses: require('./assets/courses.png'),
    bgReg: require('./assets/fon.png'),
    user: require('./assets/user.png'),
}

const storeUser = async () => {
    try {
        await AsyncStorage.setItem('name', JSON.stringify(name));
    } catch (error) {
        console.log(error)
    }
}
const mergeUser = async () => {
    try {
        await AsyncStorage.mergeItem("name", JSON.parse(name));
    } catch (error) {
        console.log(error);
    }
};





const Tab = createBottomTabNavigator();

//


const AuthState = {
    accessToken: ""
};


export default function
    App() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [search, setSearch] = useState("");
    const [isReg, setIsReg] = useState(false)
    const [authData, setAuthData] = useState(false)
    const [searchData, setSearchData] = useState(false)


    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getFromApi = async () => {
        try {
            const response = await fetch('https://api.foxworld.online/api/course/all');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFromApi();
    }, []);

    function CoursesScreen() {

        return (
            <View style={{flex: 1, padding: 24}}>
                {isLoading ? (
                    <ActivityIndicator/>
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={({cource_id}) => cource_id}
                        renderItem={({item}) => (
                            <Text>
                                {item.cource_id}, {item.cource_title}
                            </Text>
                        )}
                    />
                )}
            </View>
        );
    }


    const REGISTRATION = () => {
        const onClick = (name, email, password) => {
            reg(name, email, password);
        }
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                <Text>Login!</Text>
                <TextInput style={styles.inputStyle} defaultValue={name} onChangeText={setName}/>
                <Text>Mail!</Text>
                <TextInput defaultValue={email} onChangeText={text => setEmail(text)}/>
                <Text>Password!</Text>
                <TextInput defaultValue={password} onChangeText={text => setPassword(text)}/>
                <Button title={"TestButton"} onPress={() => onClick()} style={styles.inputStyle}></Button>
            </View>
        )
    }

    const LOGIN = () => {
        function auth(email,password) {
            fetch('https://api.foxworld.online/api/user/login', {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        "email": email,
                        "password": password
                    })
            }).then((res) => res.json())
                .then((resData) => {
                    setAuthData(resData);
                }).catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
            });
            console.log(authData);

            const _storeData = async () => {
                try{
                    await AsyncStorage.setItem("Token",authData.remember_token);
                }catch (error){
                    console.error(error);
                }
            }

            _storeData();
            const _retrieveData = async () => {
                try {
                    const value = await AsyncStorage.setItem("Token",authData.remember_token)
                    if (value !== null) {
                        // We have data!!
                        console.log(value + " " + "224");
                    }
                } catch (error) {
                    // Error retrieving data
                }
            };

            if(AsyncStorage.getItem("Token") != null){
                setIsReg(!isReg);
            }

        }

        return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Mail!</Text>
                <TextInput defaultValue={email} onChangeText={text => setEmail(text)}></TextInput>
                <Text>Password!</Text>
                <TextInput defaultValue={password} onChangeText={text => setPassword(text)}></TextInput>
                <Button title={"TestButton"} onPress={() => auth(email,password)}
                        style={styles.inputStyle}></Button>
            </View>
        )
    }
     const ProfileScreen = () => {
        function exit(){
            AsyncStorage.setItem( "Token",null);
            setIsReg(!isReg);
        }
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Profile!</Text>
                <Button title={"Выйти"} onPress={()=>{exit()}}></Button>
            </View>
        );
    }
    const NewsScreen = () =>{
        return (


            <View>
                <Text>Новостной портал!</Text>
                <View>{Searcher()}</View>
            </View>
        );
    }

    const Searcher = () =>{
        function toAPI(search) {
            console.log("start");
            fetch('https://api.foxworld.online/api/search/'+search,{
                method:'get',
                headers: new Headers({
                   'Authorization': 'Bearer '+ AsyncStorage.getItem('token'),
                   'Content-type':'application/json'
                })
            }).then((res) => res.json())
                .then((resData) => {
                    setSearchData(resData);
                }).catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
            });
        }

        return (
            <View>
                <TextInput defaultValue={search} onChangeText={text => setSearch(text)}/>
            </View>
        )
    }


    const INFORMPORTALSCREEN = () => {
        return (
            <View>
                <Text>Информационный портал!</Text>
            </View>
        );
    }
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Новости" component={NewsScreen}/>
                <Tab.Screen name="Курсы" component={CoursesScreen}/>
                {isReg ? <Tab.Screen name="Информационный портал" component={INFORMPORTALSCREEN}/> :
                    <Tab.Screen name="Регистрация" component={REGISTRATION}/>}
                {isReg ? <Tab.Screen name="Профиль" component={ProfileScreen}/> :
                    <Tab.Screen name="Вход" component={LOGIN}/>
                }
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    bgReg: {
        height: 1000,
        width: 400,
    },
    searchfieldView: {
        height: 100,
        backgroundColor: '#fff',
        width: 400,
    },
    inputStyle: {
        height: 30, textShadowColor: '#585858',
        textShadowOffset: {width: 5, height: 5},
        textShadowRadius: 10,
        width: 200,
    },
    regBtn: {
        color: '#000',
        backgroundColor: '#7ACC5D',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    regWindow: {
        backgroundColor: '#fff',
        height: 550,
        width: 300,
        display: "flex",
        borderRadius: 10,
        marginTop: 40,
        marginLeft: 46,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
    },
    underMenu: {
        backgroundColor: '#fff',
        height: 100,
        width: 400,
        marginTop: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    elementMenu1: {
        marginLeft: 47,
        marginTop: 10,
    },
    elementMenu2: {
        marginLeft: 47,
        marginTop: 10,
    },
    elementMenu3: {
        marginLeft: 47,
        marginTop: 10,
    },
    elementMenu4: {
        marginLeft: 47,
        marginTop: 10,
    },
    inputField: {
        backgroundColor: '#123412'
    },

    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     alignItems: 'center',
    // },
    // header: {
    //     backgroundColor: '#fff',
    //     height: 80,
    //     width: 600,
    //     opacity: 0.6,
    // },
    // menuBurgerImg: {
    //     height: 30,
    //     width: 40,
    //     marginLeft:310,
    //     marginTop:30,
    // },
    // imageInHeader:{
    //     width:400,
    //     height:570,
    //     resizeMode:'cover',
    // },
    // secondView:{
    //     backgroundColor:'#000',
    //     height:200,
    //     width:394,
    // },
    // underMenu:{
    //     height:100,
    //     width:394,
    //     backgroundColor:'#000',
    // },
});
