import React, {Component} from 'react';
//import { Button } from 'react-toolbox/lib/button';
//
import AppBar from 'material-ui/AppBar';

 import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import {Button, Icon} from 'react-materialize';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

class App extends React.Component{
	
	constructor(props){
		console.log('test');
		super(props);
		console.log("assigning state");

		this.state = {open: false};

		
	}

	componentDidMount(){
		console.log("component mounted");
	}

	componentWillUnmount(){
	console.log("component unmounted");

	
	}
	tick(){
		console.log("tick tock");
		var odds = evens.map(v => v + 1);

	}
	/*handleToggle(){
		console.log("opening drawer");
		this.setState({open: !this.state.open});
	}*/

	handleToggle = () => this.setState({open: !this.state.open});
	handleClose = () => this.setState({open: false});

	render(){
		return ( 
			
			 <MuiThemeProvider>
			 	<div>
			 	<AppBar
					title="Title"
					iconClassNameRight="muidocs-icon-navigation-expand-more"
					onLeftIconButtonTouchTap={this.handleToggle}
			  	/>
			  	<RaisedButton label="Default" onTouchTap={this.handleToggle} />
			  	<Button waves='light'>button</Button>

			  	<Drawer open={this.state.open}> 
			  		<MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
          			<MenuItem>Menu Item 2</MenuItem>
			  	</Drawer>
			  	</div>
			  </MuiThemeProvider>


		);
	}
}

export default App;