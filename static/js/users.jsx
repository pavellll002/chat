const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const Link = ReactRouterDOM.Link;

class Nav extends React.Component{
	render(){
		let count = this.props.count;
		let group = this.props.group;
		let page  = this.props.page;

		let lastPage = Math.floor(count/group); 
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
		fetch('/get-users?page='+this.state.page)
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
	render(){
		const page = this.props.match.params.page;
		let usersTable;
		if(this.state.ok){
			usersTable = 
			<div>
				<table>
					<thead>
						<tr>
							<td>username</td><td>email</td><td>rights</td><td>collectioin</td><td>button show collectioin</td>
						</tr>
					</thead>
					<tbody>
						{
								this.state.data.users.map(function(el){
									return <tr>
											<td>{el.username}</td><td>{el.email}</td><td>{el.rights}</td><td>{el.images.length}</td><td>show</td>
										</tr>;								
								})
						}
					</tbody>
				</table>
				<Nav count={this.state.data.count} page={this.state.page}  group={this.state.data.group}/>
			</div>;
		}
		else{
			usersTable = <h1>Something went wrong</h1>;
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