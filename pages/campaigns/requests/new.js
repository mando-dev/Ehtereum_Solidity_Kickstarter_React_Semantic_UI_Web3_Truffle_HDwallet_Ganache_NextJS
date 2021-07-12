import React, {Component} from 'react';
import { Form, Button, Message, Input} from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';         //importing our campain func wich gives us access to our campagin instance
import web3 from '../../../ethereum/web3'; 
import { Link, Router } from '../../../routes';     //we are using this because we want to route our user back to main page after they/user/manager? have made a request 
import Layout from '../../../components/Layout';

class RequestNew extends Component{                         //Component = base class
      state = {                       //initializing our state object
            value: '',
            description : '' , 
            recipient: '', 
            loading: false,
            errorMessage: ''
             };
      static async getInitialProps(props) {                       //we need to have access to address in the the url the user is ulooking at.Once the address is stripped it will return in as a prop for our component. 
             const { address } = props.query;                     //this takes the address out of the URL, then retruns it as a prop (return { address}) to be used in our component onSubmit
                  return { address };  
                                 }                           //this component process is helping us get campaing instance access
                        onSubmit = async event => {          //this was wired up in the form tag
                              event.preventDefault(); 
                                    const campaign = Campaign(this.props.address); //first we will get a reference to our campaign instance by using our address, then set up try-catch, then call a func on our campaign. this creates our campaign instance. 
                                    const { description, value, recipient } = this.state;     //this const 'campagin' (above) will call the createRequest func. Destructuring from state object above.          
                                       this.setState({ loading: true, errorMessage: ''});
                                          try {
                                              const accounts = await web3.eth.getAccounts();   //getting list of accounts and using accounts at 0 to send in a request to our createRequest func-this is a Solidity func
                                              await campaign.methods
                                                    .createRequest(description, web3.utils.toWei(value ,'ether'),recipient)     //covnert to wei from ehter user input  //we gotta pass in above values: descriptive, value , recipient. This is a Solidity func. We are passing these in in the order that we wrote them in our Sol contract. 
                                                    .send({ from: accounts[0] })            //this is who is sending the request in -manager    
                                                     Router.pushRoute(`/campaigns/${this.props.address}/requests`)//routes users back to list of campaigsn. this will show new requests that have been created. 
                                                } catch (err) { 
                                                          this.setState({ errorMessage: err.message  });
                                                      }       //will receive error object if one occurs
                                                                 this.setState({ loading: false});                  
                                                                       };
                              render() {                            //is this address the props we are returning to the component?
                                    return (
                                          <Layout> 
                                             <Link route={`/campaigns/${this.props.address}/requests`}>
                                                <a>
                                                  Back
                                                </a>
                                              </Link>
                                              
                                          <h3>Create A Request</h3>
                                                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                                                      <Form.Field>
                                                            <label>Descritpion</label>
                                                            <Input 
                                                            value={this.state.description}    
                                                            onChange={event => this.setState({ description: event.target.value})}
                                                            />
                                                      </Form.Field>
                                                      <Form.Field>
                                                            <label>Value in Ether</label>
                                                            <Input 
                                                            value={this.state.value}     //prop
                                                            onChange={event => this.setState({ value: event.target.value})}   //prop
                                                            />
                                                      </Form.Field>
                                                      <Form.Field>
                                                            <label>Recipient</label>
                                                <Input 
                                                value={this.state.recipient}    //prop
                                                onChange={event => this.setState({ recipient: event.target.value})}    //prop
                                                />
                                          </Form.Field>
                                          <Message error header="Oops!" content={this.state.errorMessage}/>    
                                                <Button primary loading={this.state.loading}>Create!</Button>
                                    </Form>
                              </Layout>
                        );
                  }
            }
      export default RequestNew;

      