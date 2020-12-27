import React, { Component } from 'react'
import Aux from "./../../hoc/Auxx";
import classes from "./Layout.module.css";
import Toolbar from './../Navigation/Toolbar/Toolbar'
import SideDrawer from './../Navigation/SideDrawer/SideDrawer'


class Layout extends Component {

  state = {
    showSideDrawer: false
  }

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false })
  }

  sideDrawerToggleHandler = () => {
    // this.setState({showSideDrawer : !this.state.showSideDrawer})
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer }
    })
  }

  render() {
    return (
      <Aux>
        <Toolbar drawerToggleClicked={ this.sideDrawerToggleHandler} />
        <SideDrawer closed={this.sideDrawerClosedHandler} open={this.state.showSideDrawer} />
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>

    )
  }
}
export default Layout;
