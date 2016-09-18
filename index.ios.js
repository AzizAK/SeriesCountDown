/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {  AppRegistry } from 'react-native'
import AppNavigator from './app/Navigator'

class SeriesCountDown extends Component {
  render() {
    return (
      <AppNavigator
        initialRoute={{ident: "Home"}} />
    );
  }

}


AppRegistry.registerComponent('SeriesCountDown', () => SeriesCountDown);
