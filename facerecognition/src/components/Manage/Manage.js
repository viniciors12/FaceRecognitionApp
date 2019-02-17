import React from "react";
import "./Manage.css";


class Manage extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      update:"unpressed",
      deleted:""
    };
  }

  componentWillMount() {
    fetch("http://localhost:3000/users")
      .then(response => response.json())
      .then(resp => this.setState({ users: resp }));
  }

  statusButton=(status,id)=>{
    this.setState({ update: status });
    this.buttonChanged(id)
  }
  
  deleteUser=(email)=>{
    fetch("http://localhost:3000/delete", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email
      })
    })
      .then(response => response.json())
      .then(answ=>{
        this.setState({users:answ})
      })
  }

  /*buttonChanged=(id)=>{
    if(this.state.update === "unpressed"){
      let button = document.createElement("button");
      button.appendChild(document.createTextNode("Submit"));
      button.setAttribute("type", "button")
      button.setAttribute("className", "btn btn-success")
      button.setAttribute("id", id)
      let td = document.getElementsByTagName('td');
      td[id].appendChild(button);
    }
  }*/

  submitUpdate=(id,position)=>{
    const newEmail=document.getElementById("email"+position).innerText;
    const newName=document.getElementById("name"+position).innerText;
    fetch("http://localhost:3000/update", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        newEmail:newEmail,
        newName:newName
      })
    })
      .then(response => response.json())
      .then(answ=>{
        this.setState({users:answ})
      }).then(alert("Updated correctly"))
  }

  render() {
    if(this.state.users.length===0){
      return <h1>Loading</h1>
   }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-6 mx-auto">
              <div className="card card-signin my-6">
                <div className="card-body">
                  <h5 className="card-title text-center">Manage User</h5>
                  <table className="table">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((user,i) => (
                        <tr>
                          <th scope="row">{i}</th>
                          <td id={"name"+i} contenteditable='true'>{user.name}</td>
                          <td id={"email"+i} contenteditable='true'>{user.email}</td>
                          <td id={{i}} className="td">
                           <button id={{i}} onClick={()=>this.submitUpdate(user.id,i)} type="button" className="btn btn-info">Edit</button>
                         
                            <button type="button" onClick={()=>this.deleteUser(user.email)} className="btn btn-danger">
                              Delete
                            </button>
                          </td>
                       </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Manage;
