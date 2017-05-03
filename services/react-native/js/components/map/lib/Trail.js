import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';

import { Icon, Left, Right, Fab, IconNB, Button } from 'native-base';


import {getBars, fetchBars, locationStats} from './service';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const SPACE = 0.01;
const MARGIN = SPACE * 3;

export default class Trail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapKey: Math.floor(Math.random()*100000),
      markers: [],
      displayMap: false,
      loading: true,
      fab: {
        open: false
      },
      search: {
        open: false,
        value: ''
      }
    };

    this.refreshSearch = this.refreshSearch.bind(this)
    this.updateMarkers = this.updateMarkers.bind(this)
    this.setRegion = this.setRegion.bind(this)
    this.showVenueDetail = this.showVenueDetail.bind(this)

    this.generateFAB = this.generateFAB.bind(this)
    this.generateBottomBar = this.generateBottomBar.bind(this)
    this.generateSearchBox = this.generateSearchBox.bind(this)

    this.onLineSelect = this.onLineSelect.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }

  show() {
    if(this.refs.myref) {
      this.refs.myref.showCallout();
    } else {
      alert('no marker myref')
    }
  }

  hide() {
    this.refs.myref.hideCallout();
  }

  componentWillMount() {
    let markers = getBars();
    this.updateMarkers(markers)
    // alert('mount')
  }

  updateMarkers(markers) {
    // console.log(markers);
    this.setState({
      markers: markers
    })
    this.setRegion(markers);
  }

  showVenueDetail(venue) {
    Actions["venue"]({venue});
  }

  setRegion(markers) {
    // la "region" est la fenêtre de carte visualisée, définie par un point
    // central et delta horizontal/vertical. On utilise alors ces valeurs:
    // latitude: moyenne des latitudes
    // longitude: moyenne des longitudes
    // deltas: ecart max entre une place et le centre
    // delta final: le plus large permettant d'inclure tout avec le ratio de taille + marge

    let stats = locationStats(markers);
    let latDelta = Math.max((stats.latitude.delta + MARGIN), (stats.longitude.delta + MARGIN) / ASPECT_RATIO);

    console.log('setRegion input', stats, latDelta)
    this.setState({
      region: {
        latitude: stats.latitude.mean,
        longitude: stats.longitude.mean,
        latitudeDelta: latDelta,
        longitudeDelta: latDelta * ASPECT_RATIO,
      }
    })
  }

  handleSearchChange(text) {
    console.log('search value', text)
    this.setState({
      search: {...this.state.search, text}
    })
  }

  componentDidMount(){
    // alert('mount')
    // return
    setTimeout(() => {
      this.setState({
        displayMap: true,
        loading: false
      })
    }, 500)
  }

  refreshSearch() {
    console.log('previous', this.state.previousSearch, 'current', this.state.search.text)
    if(this.state.previousSearch === this.state.search.text) return; // do nothing if nothing new
    const query = this.state.search.text;
    console.log('dub', {...this.state.search, previous: query})
    this.setState({
      loading: true,
      previousSearch: query
    })
    console.log('query', query)
    fetchBars(query).then((places) => {
      console.log('previous', this.state.previousSearch)
      console.log('found places', places)
      if(!places.length) {
        alert('Pas de bar trouvé')
      }
      this.updateMarkers(places)
    }).catch(err => console.log('error', err) && alert('Erreur, veuillez réessayer'))
    .finally(() => this.setState({
      loading: false
    }))
  }

  generateMarker(marker) {
    return (
      // ref={ref => { this.marker1 = ref; }}
      <MapView.Marker
        key={`marker-${marker.id}`}
        ref="myref"
        coordinate={marker.coordinate}
        title={marker.name}
        description={marker.types.join(', ')}>
        <MapView.Callout style={styles.plainView} onPress={() => this.showVenueDetail(marker)}>
            <View style={styles.barButton}>
                <Text style={styles.barName}>{marker.name}</Text>
                <Text style={styles.barTags}>{marker.types.join(', ')}</Text>
            </View>
        </MapView.Callout>
      </MapView.Marker>
    )
  }

  generateFAB() {
    return (
      <Fab
        active={this.state.fab.open}
        direction="down"
        containerStyle={{ }}
        style={{ backgroundColor: '#5067FF' }}
        position="topRight"
        onPress={() => this.setState({ fab: {...this.state.fab, open: !this.state.fab.open} })}
      >
        <IconNB name="md-share" />
        <Button
          onPress={() => {
            if(this.state.search.open) {
              this.refreshSearch();
            }
            this.setState({ search: {...this.state.search, open: !this.state.search.open}})
          }}
          style={{ backgroundColor: '#34A34F' }}>
          {this.state.fab.open && this.state.search.open ? (<Icon active name="refresh" />) : (<Icon active name="search" />)}
        </Button>
        <Button
          onPress={() => Actions['settings']()}
          style={{ backgroundColor: '#3B5998' }}>
          <Icon active name="settings" />
        </Button>
      </Fab>
    )
    // <Button disabled style={{ backgroundColor: '#DD5144' }}>
    //   <IconNB name="ios-mail" />
    // </Button>
  }

  generateSearchBox() {
    return (<View style={localStyles.FABSearch}>
        {this.state.fab.open && this.state.search.open && (
      <TextInput
        autoFocus
        value={this.state.search.text}
        style={localStyles.FABInput}
        onChangeText={this.handleSearchChange}
        multiline/>)}
      </View>);
  }

  generateBottomBar() {
    // return (
    //   <View style={styles.buttonContainer}>
    //     <TouchableOpacity onPress={() => this.show()} style={[styles.bubble, styles.button]}>
    //       <Text>Show</Text>
    //     </TouchableOpacity>
    //     <TouchableOpacity onPress={() => this.hide()} style={[styles.bubble, styles.button]}>
    //       <Text>Hide</Text>
    //     </TouchableOpacity>
    //   </View>
    // )
  }

  onLineSelect(e) {
    // alert('select line');
  }

  render() {
    const { region, markers } = this.state;
    let polyline = []
    const list = this.state.markers.map((marker) => {
      polyline.push(marker.coordinate)
      return this.generateMarker(marker)
    })

    let alt = this.state.loading && (<View style={[styles.container, styles.pendingContainer]}>
      <ActivityIndicator
          animating={this.state.loading}
          color="#111"
          size="large"></ActivityIndicator>
      </View>)

    let map = (
      <View style={styles.container}>
            <MapView
              key={this.state.mapKey}
              provider={null}
              style={styles.map}
              initialRegion={region}
            >
              {list}
              {/*<MapView.Polyline
                onPress={this.onLineSelect}
                coordinates={polyline}
                strokeColor="rgba(0,0,200,0.5)"
                strokeWidth={3}
                lineDashPattern={[5, 2, 3, 2]}
              />*/}
            </MapView>
            {alt}
            {this.generateFAB()}
            {this.generateSearchBox()}
            {this.generateBottomBar()}
      </View>
    )

    return this.state.displayMap ? map : alt;
  }
}

Trail.propTypes = {
  provider: MapView.ProviderPropType,
};


const styles = StyleSheet.create({
  customView: {
    width: 140,
    height: 100,
  },
  plainView: {
    width: 150,
  },
  container: {
    // ...StyleSheet.absoluteFillObject,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'yellow',
     flex: 1,
     padding: 0,
     flexDirection: 'column',
     justifyContent: 'flex-end',
     backgroundColor: 'rgba(180,180,180,.4)'  // better .2 on iOS
  },
  pendingContainer: {
    justifyContent: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  barButton: {
    padding:10,
    margin:-10
  },
  barName: {
    fontWeight: 'bold'
  },
  barTags: {

  }
});

const localStyles = StyleSheet.create({
  FABSearch: {
    position: 'absolute',
    top: 85,
    right: 80,
    backgroundColor: 'transparent'
  },
  FABInput: {
    backgroundColor: 'rgba(180,180,180,.4)',  // better .2 on iOS
    height: 40,
    width: 250,
    flex: 1,
    fontSize: 24,
    padding: 0,
    color: "#4D4D4D"
  }
})
