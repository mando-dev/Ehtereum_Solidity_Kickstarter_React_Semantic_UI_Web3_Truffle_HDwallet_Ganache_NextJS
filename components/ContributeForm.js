import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';   //Message component handles the errors
import Campaign from '../ethereum/campaign';    ///we will pass our address into here so we can get our contract. this file only has one func whose job is take in an address and spit out a contract
import web3 from '../ethereum/web3'; //importing this to get list of accoutns to used inside our try/catch
import { Router } from '../routes'; // Router object becasue the routes file imports many different properties and not just one simgle piece of data but now we only want the Router

class ContributeForm extends Component {
    state = {  //inititalizing our state object. any input a user contributes we want to store it into our state objec t
            value:'',  //input is coming in as ether
            errorMessage: '', 
            loading: false
           };
            onSubmit = async (event) => {  //this will b called w an event object. event is an arg here. 
                        event.preventDefault();//this keeps the form from attempting to submit itself
                        const campaign = Campaign(this.props.address); //we gonna flip some loading flag over to true so we can show a spinner on a our button. Then we take our campaign contract and attempting to send some money to it. Address coming from CampaignShow from show.js-this will be passed in as a prop We now have access to 'this.props.address' from getInitialProps. This is our campaign instance.
                        this.setState({ loading: true, errorMessage: '' });   //when someons clicks submit we will load loading flag. 2nd arg making sure errorMessage gets removed after user uses correct input
                                try {                                            //gettin list of accounts and call contribute func on our campaign. any time we call a func we gott a call it on a catch try statement. receivn error arg to the catch.  
                                    const accounts = await web3.eth.getAccounts();
                                    await campaign.methods.contribute().send({                          //getting our const campaign contract and calling the contribute func on it (contribute func is in our soldity contract file- it doesnt take in any args). So 'contribute()' here is from Campaign.sol. Sending in our transaction object. 
                                                                        from: accounts[0],                      //sending money from one account to another
                                                                        value: web3.utils.toWei(this.state.value, 'ether')          //we have recorded the value of our contribution inside our state object 'this.state.value' on line 8. input value is coming in as ether but we gotta convert to wei because we are using send({})- we get this conversion done by using the web3 module. We mark ether here as 2nd arg because thats thet value 'this.state.value' is coming in. 
                                                                        });                                             //we are puuling data from our getInitialProps func indside show.js
                                                                            Router.replaceRoute(`/campaigns/${this.props.address}`)//refreshing our page so user doesnt hit the back buton and still see tha same address in url. And this will also refresh the data and reroute itself unto itself. 
                                                                                } catch(err) {   //backticks are ES2015 code. this is a catch statement 
                                                                                        this.setState({ errorMessage: err.message });//this will set our message error piece of state
                                                                                         }   
                                            this.setState({ loading: false, value: '' })            //calling setState one more time to turn off our loadin flag off no matter what and resetting contribution amount at the same time jsut to clear out the input on the form. This empty quote for value will clear out the previous input. loading false is what makes the button stop spinnign. Next is to hook up this these two pieces of state to our render method below. 
                                          };                                                                          //this is our actual contract instance and its definetly pointing at the correct address. We will use this campagin instance to contribute money to our campaign. 
                render() {
                        return (
                            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}> {/* we not going to put parentheses on onSubmit because we dont want to call this on render time-so instead we are passing a reference to this func 'onSubmit()' so we can call it at some point in the future. We using double boolean flip. */}
                                <Form.Field>
                                    <label>Amount to Contribute</label>
                                        <Input 
                                            value = {this.state.value}   //set the state object above with this value
                                            onChange= {event => this.setState({value: event.target.value})}  //if user changes the value inou then the state will update
                                            label="ether" 
                                            labelPosition="right"  
                                            />
                                </Form.Field>
                        <Message error header="Oops!" content={this.state.errorMessage} />
                   <Button primary loading={this.state.laoding}>Contribute!</Button>      {/*  passing in our loading flag  */}
                </Form>
            );
      }
}
export default ContributeForm;