import React, { Component } from 'react'; //this file displays requests in rows about a campaign 
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';       //we are usign web3 helper in order to convert our value displayu of our Cell unto ether rather than wei becasue wei is too long. 
import Campaign from '../ethereum/campaign';

class RequestRow extends Component{   
                  onApprove = async () => {   //we are using async because we gonna have to reach out to our campaing(via imported web3 directory above) in attempt to reference a given request and approve it in some fasion
                                          const campaign = Campaign(this.props.address);       //we have to create intance of campaign or gain access to campaign object so where we will create actual campaign instance> We are referenceing our campaing here and passing it our address of the campaign we are currently working on. Notice that we already passed our address into our RequestRow in Index.js line 31.  
                                          const accounts = await web3.eth.getAccounts();  //getting a list of all of our accounts
                                          await campaign.methods.approveRequest(this.props.id).send({   //we are passing in the ID/index that this component is currently looking at.   
                                                                                           from: accounts[0]
                                                                              });    
                                                                        };
                  onFinalize = async () => {   //code here is very simialr to code above
                                          const campaign = Campaign(this.props.address);      //func is from Contract.sol. We alos need to pass in the index of the request we intend to finalize
                                          
                                          const accounts = await web3.eth.getAccounts();
                                          await campaign.methods.finalizeRequest(this.props.id).send({    //calling our func fom .sol  We will pass in the ID of the request we want to finalize and send that in as a transaction
                                                from: accounts[0]            //the transaction is coming from accounts at 0.  
                                          });
                                    };
      
      
      
      
      
      
    render() {                                                          // the id props object below is form our requests/index.js
            const { Row, Cell } = Table;    //destructuring off of Table object
            const { id, request, approversCount } = this.props; //destructuring so we dont have to be wiring many times 'this.props...'
            const readyToFinalized =  request.approvalCount > approversCount / 2;   //this flag is lettin user know that this request is ready to b finalized. This will look at total number of approvals tied to our request. And we will see if 'request.approvalCount' is greater than approversCount/2.
                  return (    //the properties below 'reques.description' are tied to a struct-these are all tied into Campaign.sol. Also we hiding buttons whenever a reques is finalized. 
                              <Row disabled={request.complete} positive={readyToFinalized && !request.complete }>
                                    <Cell>{id}</Cell>   
                                    <Cell>{request.description}</Cell> 
                                    <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>   
                                    <Cell>{request.recipient}</Cell>  
                                    <Cell>{request.approvalCount}/{approversCount}</Cell>
                                    <Cell>
                                          {request.complete ? null : (
                                          <Button color="green" basic onClick={this.onApprove}> Approve</Button>
                                          )}
                                    </Cell>   
                                    <Cell>
                                         {request.complete ? null : (
                                                <Button color="teal" basic onClick={this.onFinalize}>
                                                      Finalize
                                                </Button>
                                          )}
                                    </Cell>
                              </Row>
                         );  //recipient above is the person we want to send money to. We dont add () to onApprove so it doesnt auto run
                      }
                  }
export default RequestRow;
//method of how we approve a request can be seen in our Campaign.sol
//if there arent enough people approving a trasnsaction and we try to to finaluze it, Metamask is connected to our .sol Contract so MM (metammask) will thorw up an error.
//On button we are adding a teranry/conditiona operator (line 39)-'request.complete'. So complete comes from our .sol. So the '.coplete' is a boolena that was specified in our .sol lined 21 in our Request struct that lets us know whether a rquest has been finalized. So if complete is true, we want to hide the button. 
//So in line 39 its saying if request.complete is true then dont show this button(basically return null) else if request.completet is false, then display the button.