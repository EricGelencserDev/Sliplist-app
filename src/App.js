import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import {
	Col,
	Row,
	Grid,
	PageHeader
} from 'react-bootstrap'
import './App.css'
import CarouselTop from './components/Carousel'
import NavbarTop from './components/NavbarTop'
import Newuser from './pages/Newuser'
import Availabilities from './pages/Availabilities'
import CreateAvailability from './pages/CreateAvailability'
import GoogleApiWrapper from './components/mapcontainer'
import Login from './pages/signin.js'

const apiUrl = "http://localhost:3000"

class App extends Component {
	constructor(props){
		super(props)
		this.state = {
			googleAPI: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAPHEKTmg_-2YGuO7CSoQgw-nunhQL7xTM&callback=initMap",
			errors: null,
			users: [],


		availabilities:[],
	    	newUserSuccess: false,
			newAvailSuccess: false,

			isLoggedIn: false,
			logOutSuccess: false,
			logInSuccess: false
		}
	}


	loggedIn() {
		if(localStorage.getItem('authToken') != null) {
			this.setState({isLoggedIn: true})
		}
	}

	logOut() {
		localStorage.removeItem('authToken')
		this.setState({isLoggedIn: false, logOutSuccess: true})
	}

	componentWillMount(){
		fetch(`${apiUrl}/availabilities`)
		.then((raw)=>{
			return raw.json()
		})
		.then((res) =>{
			this.setState({availabilities: res.availabilities})
		})
		if(localStorage.getItem('authToken') != null) {
			this.setState({isLoggedIn: true})
		} else {
			this.setState({isLoggedIn: false})
		}
	}




	getUsers() {
		fetch(`${apiUrl}/users`)
		.then((raw) => {
			return raw.json()
		})
		.then((res) => {
			this.setState({users: res.users})
		})
	}

	handleNewuser(params){
		fetch(`${apiUrl}/users`,{
			body: JSON.stringify(params),  // <- we need to stringify the json for fetch
			headers: {  // <- We specify that we're sending JSON, and expect JSON back
			'Content-Type': 'application/json'
		},
		method: "POST"  // <- Here's our verb, so the correct endpoint is invoked on the server
		}
		)
		.then((raw)=>{
			return raw.json()
		})
		.then((res) =>{
			if(res.errors){ // <- Check for any server side errors
				this.setState({errors: res.errors})
			}else{
				const { users } = this.state

				users.push(res.user) // <- Add the new cat to our list of users

				localStorage.setItem('authToken', this.state.user[0].authToken)

				this.setState({
					users: users,  // <- Update cats in state
					errors: null, // <- Clear out any errors if they exist
					newUserSuccess: true,
					isLoggedIn: true
				})
			}
		}).catch((e) => {
			console.log("error registering:", e);
		})
	}

	handleNewAvail(params){
	fetch(`${apiUrl}/availabilities`,
	  {
		body: JSON.stringify(params),  // <- we need to stringify the json for fetch
		headers: {  // <- We specify that we're sending JSON, and expect JSON back
		  'Content-Type': 'application/json'
		},
		method: "POST"  // <- Here's our verb, so the correct endpoint is invoked on the server
	  }
	)
	.then(raw => raw.json())
	.then((res) => {
		if(res.errors){ // <- Check for any server side errors
			this.setState({errors: res.errors})
		} else {
			const { availabilities } = this.state

			availabilities.push(res.available) // <- Add the new cat to our list of users

			this.setState({
			availabilities: availabilities,  // <- Update cats in state
			errors: null, // <- Clear out any errors if they exist
			newAvailSuccess: true,
			})
			}
	})
	}




	handleExistingUser(params) {
		fetch(`${apiUrl}/login`,{
			body:JSON.stringify(params),
			headers: {
				'Content-Type': 'application/json'
			},
			method: "POST"
		}).then((raw) => {
			return raw.json()
		}).then((res) => {
			if(res.errors){
				this.setState({errors: res.errors})
				console.log(this.state.errors)
			} else {
				const user = Object.assign([], this.state.user)
				user.push(res.user)
				this.setState({
					user: user,  // <- Update users in state
					errors: null, // <- Clear out any errors if they exist
					logInSuccess: true, // <- This is the new flag in state
					isLoggedIn: true
				})
				console.log(this.state.user)
				localStorage.setItem('authToken', this.state.user[0].authToken)
			}
		}).catch(function() {
			console.log('could not save new user')
		})
	}




	render() {
		return (
			<Router>
			<div >
<div>
<NavbarTop />
						<Route exact path="/" render={props => (
							<Grid>
								<PageHeader>
									<CarouselTop />

								</PageHeader>

								<h1  className='subtitle'>
								Sign Up
								</h1>
								<h1  className='subtitle2'>
								Sign In
								</h1>

								<div className="flex">


										<div className="container-left">
											<Newuser onSubmit={this.handleNewuser.bind(this)}
											errors={this.state.errors && this.state.errors.validations} />
											{this.state.newUserSuccess && <Redirect to="/" /> }

											</div>

										<div className="container-right">
											<Login onSubmit={this.handleExistingUser.bind(this)}
											errors={this.state.errors && (this.state.errors.validations || this.state.errors.serverValidations)} />
											{this.state.logInSuccess && <Redirect to="/availabilities" /> }

								</div>
								</div>


							</Grid>


						)} />
						<GoogleApiWrapper />

						<Route exact path="/availabilities" render={props => (
							<Grid>
								<PageHeader>
									<Row>
										<Col xs={8}>
											<br/>
											<small className='subtitle'>Availability Listings for Today: </small>
										</Col>
									</Row>
								</PageHeader>
								<Availabilities availabilities={this.state.availabilities} />
							</Grid>
						)} />

						<Route exact path="/availabilities/new" render={props => {
							if(this.state.newAvailSuccess) {
								return <Redirect to="/availabilities" />
							}

							return (
								<Grid>
									<PageHeader>
										<Row>
											<br/>
											<Col sm={12}>
												<small className='subtitle'>Please enter your posting information below: </small>
											</Col>
										</Row>
									</PageHeader>
									<CreateAvailability onSubmit={this.handleNewAvail.bind(this) } />
								</Grid>
							)
						}} />
					</div>

				</div>
			</Router>
		);
	}
}
export default App;
