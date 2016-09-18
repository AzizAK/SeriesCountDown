'use strict'
import React, { Component } from 'react'
import { BackAndroid, View, Modal, StyleSheet, Platform, TouchableOpacity, ListView, Dimensions,
  InteractionManager } from 'react-native'
import { Header, Button, Icon, Title, Text } from 'native-base'
import IconM from 'react-native-vector-icons/MaterialIcons'
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
let counter = 0

class Episodes extends Component {
  constructor () {
    super()
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      render:false
    }
  }

  componentWillMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({render: true});
    });
  }

  componentWillUnmount(){
    counter = 0
  }


  render(){
    return (
      <View style={styles.container}>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop()}>
            <Icon style={{color:'#21458c'}} name='arrow-back' />
          </Button>
          <Title style={{color:'#21458c'}}>{this.props.seriesName}</Title>
        </Header>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.episodes)}
          renderRow={this._renderRow.bind(this)}>
        </ListView>
      </View>
    )
  }

  _renderRow(episode){

    if(this.state.render){
      counter++
      return (
        <View>
          <View style={{flexDirection:'row',marginTop:5}}>
            <View style={{width:width * 0.15}}>
              <Text>S{episode.season}E{episode.episode} || {counter}</Text>
            </View>
            <Text>{episode.name}</Text>
        </View>
        <Text style={{marginLeft:width*0.15,color:'#d3d3d3'}}>{episode.air_date}</Text>
      </View>
      )
    } else {return(null)}
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor:'white'
  },

})


module.exports = Episodes
