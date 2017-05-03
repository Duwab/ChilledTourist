
import React, { Component } from 'react';
import { StatusBar, Switch, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Text, H1, H2, H3, Button, Icon, Footer, FooterTab, Left, Right, Body, Separator, ListItem } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

global.settings = {}
AsyncStorage.getItem("settings").then(function(json){
  try {
    let settings = JSON.parse(json);
    global.settings = settings || {};
  } catch(e) {}
})

class Settings extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }

  constructor() {
    super()
    this.state = {
      settings: global.settings
    }
    this.onSwitch = this.onSwitch.bind(this)
  }

  onSwitch(settingsKey) {
    let newSettings = this.state.settings;
    newSettings[settingsKey] = !newSettings[settingsKey]
    this.setState({
      settings: newSettings
    })
    global.settings = newSettings
    AsyncStorage.setItem("settings", JSON.stringify(newSettings))
  }

  render() {
    let complete = this.state.complete
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button iconLeft transparent onPress={() => Actions.pop()}>
              <Icon active name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Setting</Title>
          </Body>
          <Right />

        </Header>


        <Content>

          <Separator bordered noTopBorder>
            <Text>Mode développement</Text>
          </Separator>

          <ListItem icon>
            {/*<Left>
              <Button style={{ backgroundColor: '#FF9501' }}>
                <Icon active name="plane" />
              </Button>
            </Left>*/}
            <Body>
              <Text>Menu complet</Text>
            </Body>
            <Right>
              <Switch
                onTintColor="#50B948"
                value={this.state.settings['fullMenu']}
                onValueChange={() => this.onSwitch('fullMenu')}
              />
            </Right>
          </ListItem>

          <ListItem icon>
            <Body>
              <Text>Debug</Text>
            </Body>
            <Right>
              <Switch
                onTintColor="#50B948"
                value={this.state.settings['debug']}
                onValueChange={() => this.onSwitch('debug')}
              />
            </Right>
          </ListItem>

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

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
});

export default connect(mapStateToProps, bindAction)(Settings);
