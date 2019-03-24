import React from 'react';
import ReactDom from 'react-dom';
import '../style.css';

fetch('/api').then(data=> console.log(data))
class App extends React.Component {

    constructor() {
        super();
        this.state = {}
    }


    renderInput = options => {
        const {id, name, type, placeholder, label, onChange} = options;
        return (<div><label htmlFor={id}>{`${label}`}</label>
                <input id={id} type={type} placeholder={placeholder} name={name} onChange={onChange} />
                </div>);
    }

    renderRadio = options => {
        
    }

    onChangeHandler = event => {
        const {name, value} = event.target;
        this.setState({
            [`${name}`]: value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state)
    }

    render(){
        return(
            <div>
                <h1>User Form</h1>
                <fieldset>
                <legend>Personal Info</legend>
                <form onSubmit={this.onSubmit}>
                <div className="row">
                     <div className="col-6">
                            {this.renderInput({id:'firstname', name:'firstname', type:'text', label:'Firstname', placeholder:'Enter your firstname', onChange:this.onChangeHandler})}
                     </div>
                     <div className="col-6">
                          {this.renderInput({id:'lastname', name:'lastname', type:'text', label:"Lastname", placeholder:'Enter your lastname', onChange:this.onChangeHandler})}
                     </div>
                </div>
                <div className="row">
                    <div className="col-6"> 
                        <label htmlFor="number">Phone Number</label>
                        <input id="number" name="number" type="number" onChange={this.onChangeHandler} placeholder="Enter your phonenumber"/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="address">Address</label>
                        <input id="address" name="address" type="text" onChange={this.onChangeHandler} placeholder="Enter your address"/>
                    </div>
                </div>
                <div className="row">
                  <div className="col-4">
                        <label htmlFor="country">Country</label>
                        <select onChange={this.onChangeHandler} id="country" name="country">
                            <option value="india">India</option>
                            <option value="usa">USA</option>
                            <option value="nepal">Nepal</option>
                        </select>
                  </div>
                  <div className="col-4">
                    <div style={{"color":"dimgrey", "marginLeft":"10px"}}>Gender</div>
                    <label className="radio-container">Male
                        <input onChange={this.onChangeHandler} name="gender" value="male" type="radio"/>
                        <span className="radio-checkmark"></span>
                    </label>
                    <label  className="radio-container">Female
                        <input onChange={this.onChangeHandler} name="gender" value="female" type="radio"/>
                        <span className="radio-checkmark"></span>
                    </label>

                  </div>
                  <div className="col-4">
                        <div style={{"color":"dimgrey", "marginLeft":"10px"}}>Options</div>
                            <label  className="checkbox-container">Option 1
                                <input onChange={this.onChangeHandler} name="something" value="option1" type="checkbox"/>
                                <span className="checkbox-checkmark"></span>
                            </label>
                            <label  className="checkbox-container">Option 2
                                <input onChange={this.onChangeHandler} name="something" value="option2" type="checkbox"/>
                                <span className="checkbox-checkmark"></span>
                            </label>
                            <label  className="checkbox-container">Option 3
                                <input onChange={this.onChangeHandler} name="something" value="option3" type="checkbox"/>
                                <span className="checkbox-checkmark"></span>
                            </label>
                     </div>
                </div>
                <div className="row">
                   <div className="col-3">
                     <input type="submit" value="submit"/>
                   </div>
                </div>
                 
                </form>
                </fieldset>
            </div>
            
        )
    }
}

export default App;