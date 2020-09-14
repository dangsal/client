import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {AsyncStorage} from 'react-native';
import SwitchNavigator from './screens/SwitchNavigator';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import rootReducer, {rootSaga} from './modules';
import createSagaMiddleware from 'redux-saga';
import ReduxThunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {NavigationContainer} from '@react-navigation/native';
import {setLoginState} from './modules/auth';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, sagaMiddleware)),
);

const loadToken = async () => {
  try {
    const user = await AsyncStorage.getItem('token');
    if (!user) return; //로그인 상태아니면 아무것도 안하도록

    store.dispatch(setLoginState(true));
  } catch (error) {
    console.log(error);
  }
};

sagaMiddleware.run(rootSaga);
loadToken();

export default App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SwitchNavigator />
      </NavigationContainer>
    </Provider>
  );
};
