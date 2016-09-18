/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {  AppRegistry, StyleSheet, View, Alert, Image, TouchableOpacity } from 'react-native'
import { Container, Header, InputGroup, Input, Icon, Button, Content, Card,
        CardItem, Thumbnail, Text, Spinner, Grid, Col, List, ListItem} from 'native-base'
import ImageSlider from 'react-native-image-slider';

class Home extends Component {
  constructor () {
    super()
    this.state = {
      tvShow:{episodes:{}},
      seriesStatus:null,
      seriesName:null,
      loading:null,
      intervalId:null,
      days:null,
      hours:null,
      minutes:null,
      seconds:null
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header searchBar rounded>
          <InputGroup>
              <Icon name='search' />
              <Input placeholder='Search' onChangeText={(text) => this.setState({seriesName:text})} value={this.state.seriesName}/>
              <Icon name='tv' onPress={() => this._getSeriesDetails(this.state.seriesName)}/>
          </InputGroup>
          <Button transparent onPress={() => this._getSeriesDetails(this.state.seriesName)}>
            <Text>Search</Text>
          </Button>
        </Header>
          {this._renderSeriesDetails()}
      </Container>
    );
  }

  _renderSeriesDetails(){
    let e=''
    if(this.state.loading){
      console.log('im here');
      return (<View><Spinner color='yellow' /></View>)
    } else if (this.state.loading === false) {
      return (
        <View>
          {this._renderImageSlider()}
          <Text style={styles.seriesName}>{this.state.tvShow.name}</Text>
          <Text style={styles.genres}>{this.state.tvShow.genres.map(function(g){e+=' '+g})}{e}</Text>
          {this._renderNextEpisode()}
          <Grid>
            <Col>
              <List>
                <ListItem iconLeft>
                  <Icon name='star' />
                  <Text>{this.state.tvShow.rating || ''}</Text>
                </ListItem>
                <ListItem iconLeft>
                  <Icon name='date-range' />
                  <Text>{this.state.tvShow.start_date || ''}</Text>
                </ListItem>
              </List>
            </Col>
            <Col>
              <List>
                <ListItem iconLeft button onPress={() =>
                    this.props.navigator.push({ident:'Episodes',seriesName:this.state.tvShow.name,episodes:this.state.tvShow.episodes})}>
                  <Icon name='tv' />
                  <Text>{this.state.tvShow.episodes.length || ''} Episode...</Text>
                </ListItem>
              </List>
            </Col>
          </Grid>
        </View>
      )
    } else if (this.state.loading === null){
      return (
        <Text style={styles.started}>Search for a Series</Text>
      )
    }
  }

  _renderImageSlider(){
    if(!this.state.tvShow.pictures){
      return null
    }
    let images = []
    images.push(this.state.tvShow.image_path)
    this.state.tvShow.pictures.map(function(pic){
      images.push(pic)
    })

    return (
      <ImageSlider height={300} images={images} />
    )
  }

  _renderNextEpisode(){
    if (!this.state.tvShow.countdown) { // if there is no countdown
      return (<Text style={styles.seriesStatus}>{this.state.seriesStatus}</Text>)
    } else {
      if(this.state.hours){ //when we have the time
        return (
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <Text style={styles.timeNumbers}>{this.state.days}</Text>
            <Text style={styles.timeChar}> Days</Text>
            <Text style={styles.timeNumbers}> {this.state.hours}</Text>
            <Text style={styles.timeChar}> Hours</Text>
            <Text style={styles.timeNumbers}> {this.state.minutes}</Text>
            <Text style={styles.timeChar}> Minutes</Text>
            <Text style={styles.timeNumbers}> {this.state.seconds}</Text>
            <Text style={styles.timeChar}> Seconds</Text>
          </View>
        )
      } else {return null}
    }
  }

  async _getSeriesDetails(seriesName){
    clearInterval(this.state.intervalId)
    this.setState({loading:true})
    seriesName = seriesName.replace(/\s+/g, '-').toLowerCase();
    let response = await fetch('https://www.episodate.com/api/show-details?q=' + seriesName)
    let text = await response.text()
    let json =  JSON.parse(text)
    console.log(json);
    if(json.tvShow.length === 0) {
      Alert.alert('Series Not Found!')
      this.setState({loading:null})
      return
    }
    this.setState({tvShow:json.tvShow, loading:false})
    this._countDownTimer()

  }

  _countDownTimer(){
    if(this.state.tvShow.status === 'Ended'){
      this.setState({seriesStatus:'Series Ended'})
      return
    }
    if(this.state.tvShow.countdown === null) {
      this.setState({seriesStatus:'unknown time'})
      return true
    }
    let intervalId =
    setInterval(() => {
      var end = new Date(this.state.tvShow.countdown.air_date);

      var _second = 1000;
      var _minute = _second * 60;
      var _hour = _minute * 60;
      var _day = _hour * 24;

      var now = new Date();
      
      var distance = end - now;
      if (distance < 0) { return 'Expired!' }

      var days = Math.floor(distance / _day);
      var hours = Math.floor((distance % _day) / _hour);
      var minutes = Math.floor((distance % _hour) / _minute);
      var seconds = Math.floor((distance % _minute) / _second);

      this.setState({days,hours,minutes,seconds})

    },1000) //Repeat Every Second
    this.setState({intervalId})
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
  started: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  seriesStatus:{
    fontSize: 19,
    textAlign:'center',
    margin:10
  },
  timeNumbers:{
    fontSize: 20,
    textAlign:'center',
    color:'red'
  },
  timeChar:{
    fontSize:15,
    textAlign:'center',
    color:'#d3d3d3'
  },
  seriesName:{
    fontSize:20,
    textAlign:'center',
    marginTop:10,
  },
  genres:{
    fontSize:15,
    textAlign:'center',
  }

});

module.exports = Home
