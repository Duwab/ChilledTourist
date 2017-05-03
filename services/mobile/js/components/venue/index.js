
import React, { Component } from 'react';
import { StatusBar, Image, StyleSheet, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Text, View, H1, H2, H3, Button, Icon, Footer, FooterTab, Left, Right, Body, ListItem, Spinner, Separator } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

import {getVenueDetail} from '../map/lib/service';

class Venue extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }

  constructor() {
    super()
    this.state = {
      loading: false,
      detail: false
    }
    this.generateContent = this.generateContent.bind(this)
    this.generateDetail = this.generateDetail.bind(this)
  }

  componentWillMount() {
    console.log('this.props', this.props)
    if(!this.props.venue) return;

    this.setState({
      loading: true
    })

    getVenueDetail(this.props.venue.place_id).then((detail) => {
      console.log('detail', detail)
      this.setState({
        loading: false,
        detail
      })
    }).catch((err) => console.log('error', err) && this.setState({loading: false, detail: false}))
  }

  generateContent() {

    const venue = this.props.venue;
    if(!venue)
      return <Text>Rien à afficher</Text>


    const baseUrl = `https://maps.googleapis.com/maps/api/place/photo?key=${global.conf.GOOGLE_SEARCH_API_KEY}&maxwidth=500&photoreference=`

    let photo = venue.photos && venue.photos[0] ?
      (baseUrl + venue.photos[0].photo_reference) : false;

    return (<View>
      <H1>
        {venue.name || "Rien a afficher"}
      </H1>
      {photo && <Image source={{uri: photo}} style={localStyles.image}/>}
      <Text>
        {venue.types && venue.types.join(', ') || "Rien a afficher"}
      </Text>
      <Text style={{marginTop:10}}><Text style={{fontWeight:'bold'}}>Notes:</Text> {venue.rating}/5</Text>
      {this.generateDetail()}
      {global.settings.debug && <Text>
        {JSON.stringify(venue)}
      </Text>}
    </View>)
  }

  generateDetail() {
    const detail = this.state.detail;
    if(!detail && !this.state.loading)
      return <Text>Erreur de chargement du détail</Text>

    if(this.state.loading)
      return <Spinner />

    let periods = detail.opening_hours && detail.opening_hours.periods || []
    let period = {
      open:false,
      close: false
    }
    let day = (new Date()).getDay()
    const formatHour = (t) => {
      if(isNaN(t)) return;
      hh = t.slice(0,2);
      mm = t.slice(2,4);

      return `${hh}:${mm}`
    }

    periods.map((p) => {
      if(p.open && p.open.day === day)
        period.open = formatHour(p.open.time);
      if(p.close && p.close.day === day)
        period.close = formatHour(p.close.time);
    })
    console.log("detail", detail)
    return (<View>
        <Text>
          <Text style={{fontWeight:'bold'}}>Site:</Text>
          <Text
            onPress={() => Linking.openURL(detail.website)}
            style={{color:'blue', textDecorationLine:'underline'}}>{detail.website || '-'}</Text>
        </Text>
        <Text><Text style={{fontWeight:'bold'}}>Adresse:</Text> {detail.formatted_address || '-'}</Text>
        <Text><Text style={{fontWeight:'bold'}}>Téléphone:</Text> {detail.formatted_phone_number || '-'}</Text>
        <Text style={{fontWeight:'bold',textAlign:'center',color:'#666',fontSize:16,marginTop:20}}>{(detail.opening_hours && detail.opening_hours.open_now ? "Ouvert en ce moment":"Fermé en ce moment") || '-'}</Text>
        {period && period.open && period.close&& <Text style={{textAlign:'center',fontSize:12,color:'#999'}}>
          {period.open} - {period.close}
        </Text>}

        {detail.reviews && <Separator style={{marginTop: 40}}>
          <Text style={{fontWeight:'bold'}}>Commentaires</Text>
        </Separator>}

        {detail.reviews && detail.reviews.map((review) => {
          return <ListItem key={review.time} style={{justifyContent: 'flex-start'}}>
            <Left style={{maxWidth: 70}}>
              <Text style={{fontSize: 10}}>Note: {review.rating}/5</Text>
            </Left>
            <Body>
              <Text style={{fontSize: 10}}>{review.text}</Text>
            </Body>
          </ListItem>
        })}
      </View>)
  }

  render() {

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button iconLeft transparent onPress={() => Actions.pop()}>
              <Icon active name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Venue</Title>
          </Body>
          <Right />

        </Header>


        <Content padder>
          {this.generateContent()}
        </Content>


        <Footer>
          <FooterTab>
            <Button active full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const localStyles = StyleSheet.create({
  image: {
    height: 350,
    marginTop: 20,
    marginBottom: 20
  },
  reviewsSeparator: {
    marginTop: 40
  },
  reviewsLeft: {
    width: 100,
    fontSize: 10
  },
  reviewsBody: {
    fontSize: 10
  }
})

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
});

export default connect(mapStateToProps, bindAction)(Venue);
