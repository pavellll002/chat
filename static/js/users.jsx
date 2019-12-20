const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const Link = ReactRouterDOM.Link;

class Nav extends React.Component{
	 constructor(props) {
   		super(props);
   		this.state = {
		count : this.props.count,
		group : this.props.group,
		page  : this.props.page,
   		}
   	}

	componentDidUpdate(prevProps, prevState, snapshot){
		console.log(prevProps, prevState, snapshot);
		if(prevProps.page != this.state.page){
			this.setState({
				count:prevProps.count,
				group:prevProps.group,
				page:prevProps.page,
			})
		}
	}

	render(){
		let count = this.state.count;
		let group = this.state.group;
		let page  = this.state.page;

		let lastPage = count/group>1?Math.ceil(count/group):0;
		let prev = (page != 0)?<Link to={"/users/"+(page-1)}>Prev</Link>:'';
		let next = ((count-(page+1)*group) > 0)?<Link to={"/users/"+(++page)}>Next</Link>:'';
		return <nav>
			<Link to="/users/0">First</Link>
			{prev}
			{next}
			<Link to={"/users/"+lastPage}>Last</Link>
		</nav>;
	}
}

class Main extends React.Component{
	 constructor(props) {
   		super(props);
    	this.state = {
    		data:{},
    		ok:false,
    		page:this.props.match.params.page,
    	};
  	}
	componentDidMount(){
		fetch('/get-users?page='+this.props.match.params.page)
		.then(response=> response.json())
		.then((function(json){
						json.users = JSON.parse(json.users);
						this.setState({ 
							ok:true,
							data: json,
		    				page:this.state.page,
						});
					}).bind(this)
		);

	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevProps.match.params.page != this.props.match.params.page){	
			fetch('/get-users?page='+this.props.match.params.page)
			.then(response=> response.json())
			.then((function(json){
							json.users = JSON.parse(json.users);
							this.setState({ 
								ok:true,
								data: json,
			    				page:this.state.page,
							});
						}).bind(this)
			);		
		}
	}

	render(){
		const page = this.props.match.params.page;
		console.log(this.state)
		let usersTable;
		if(this.state.ok){
			usersTable = 
			<div>
				<div id="counter">
					<div id="allUsersCount">Amount of users: {this.state.data.count}</div>
					<div id="unverifiedUsersCount">Amount of unverified users:{this.state.data.countUnverified}({(this.state.data.countUnverified/this.state.data.count)*100}%)</div>
				</div>
				<table>
					<thead>
						<tr>
							<td>username</td><td>email</td><td>rights</td><td>collectioin</td><td>active</td><td>button show collectioin</td>
						</tr>
					</thead>
					<tbody>
						{
								this.state.data.users.map(function(el){
									return <tr>
											<td>{el.username}</td><td>{el.email}</td><td>{el.rights}</td><td>{el.images.length}</td><td>{el.active?'true':'false'}</td><td>show</td>
										</tr>;								
								})
						}
					</tbody>
				</table>
				<Nav  count={this.state.data.count} page={this.props.match.params.page}  group={this.state.data.group}/>
			</div>;
		}
		else{
			usersTable = <div>loading...</div>;
		}

		return usersTable;
	}
}



ReactDOM.render(
	  <Router>
            <Switch>
                <Route path="/users/:page" component={Main} />
            </Switch>
        </Router>,
        document.getElementById("app")
)