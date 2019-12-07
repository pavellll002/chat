const Router = ReactRouterDOM.BrowserRouter
const Route = ReactRouterDOM.Route
const Switch = ReactRouterDOM.Switch
const Redirect = ReactRouterDOM.Redirect
const Link = ReactRouterDOM.Link

class Main extends React.Component{
	async render(){
		const page = this.props.match.params.page
		let response = await fetch(`/get-users?page=${page}`)

		if(response.ok){
			let json = await response.json()
			let usersTable = <table>
				<tr>
					<td>username</td><td>email</td><td>rights</td><td>collectioin</td><th>button show collectioin</th>
				</tr>
				<tr>
					json.map(el=><td>el.users.username</td><td>el.users.email</td><td>el.users.rights</td><td>el.users.images.length</td><td>show collectioin</td>)
				</tr>
			</table>
			<Nav :count="{el.count}" :group="{el.group}" :page="{page}"></Nav>
		}
		else let usersTable = <h1>Something went wrong</h1>

		return usersTable
	}
}

class Nav extends React.Component{
	render(){
		let count = this.props.count
		let group = this.props.group
		let page  = this.props.page

		let nextPage = page,
		prevPage = page
		return <nav>
			<Link to="/users/0">First</Link>
			if(page !== 0)<Link to="/users/{--prevPage}">Prev</Link>
			if((count-page*group) > 0)<Link to="/users/{++nextPage}">Next</Link>
			<Link to="/users/{--Math.floor(count/group)}">Last</Link>
		</nav>
	}
}

ReactDOM.render(
	<Router>
		<Switch>
			<Route path="/users/:page" content="Main"/>
		</Switch>
	</Router>
	,
	document.getElementById('app')
)