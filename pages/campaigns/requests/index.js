import React, { Component } from 'react';    //this will show lists of requests to user. 
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout'; 
import Campaign from '../../../ethereum/campaign';      //but where does Campaign come from since its not inside campaign.js
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {  
      static async getInitialProps(props){                                                   //defininig func, getting our address out of the url and then passing it into our component 'RequestIndex' as props!!!!
                                      const { address } = props.query;                              //here we pulling the address out of it-destructuring
                                      const campaign = Campaign(address);                             //getting a handle on our campaign instance. calling our Campaign()func and passing the 'address' on line above here. Campaign() is actually inside the .sol        
                                      const requestCount = await campaign.methods.getRequestsCount().call();          //we will grab the total number of requests that have been creted per campaign from this instance 'campaing'. getRequestsCount() is from .sol
                                      const approversCount = await campaign.methods.approversCount().call(); //we are making a second call to our already created campaign instance above in order to gain access to approversCount? from our contract. Is .call() calling to our .sol contract? Now this has been added to our component return obnject below for our compoentn to use. 
                                      
                                      const requests = await Promise.all(                           //the Array constructor expects to be passed a number and not a string. we need to make this change before passing it into Array(), and so this is why we are using 'parseInt'
                                                                      Array(parseInt(requestCount))
                                                                      .fill()
                                                                      .map((element, index) => {                    //Array.fill() is what does the iteration. element(s) is whats inside the array. 
                                                                        return campaign.methods.requests(index).call();      //we are using an array to store all these different requests(). request(index) means it will iterate all the way from 0 tp 'requestCount'.
                                                                        })                                                  //so whatever is inside Array() is what will be counted. this will give u a list of all the indices that need to be requested from the campaign. 
                                                                      );  
                                          return { address, requests, requestCount, approversCount };           //returning object. ES 2015 shortening the code. this return object gets returned by getInitialProps. We are now adding 'const requests' from a few lines above. This object will get added to the props of our component(RequestIndex?).
                                          }                                                       //by requests being inside this object it allows us to use it in our component: 'RequestIndex'??. We are adding requestCount since we may want to display on screen th number of requests
                            renderRows(){                                                               //helper method to render RequestRow for every request the we have loaded up and fetched from our campaign. we will iterate over every 'requests'(above a few lines inside the return {...., requests, ...})- so for every request we will return a RequestRow
                                    return this.props.requests.map((request, index) => {                         //we gonna passs an arrow func for every request and index for every rquest as well
                                                                                    return (    //whatever we add to our return object/above-component a few lines above, we need to connect that to inside our RequestRow
                                                                                          <RequestRow           //RequesRow is gonna need a couple of props so it understands what it needs to render on the screen
                                                                                                key={index}//key property is part of React. So in React, it wants us to alway use a key whenever want to render a list of components. 
                                                                                                id={index} //represents every inidividual request as an index inside an array order. 
                                                                                                request ={request}//passing in the request that we want to b rendered that is coming from the inner mapping func a few lines above
                                                                                                address = {this.props.address}//passing in the address of the current campaign we are woriking with 
                                                                                                approversCount={this.props.approversCount}  // from here we went to RequestRow.js and made use of it
                                                                                               /> 
                                                                                              );                                                
                                                                                            }); 
                                                                                    }   
                render() {
                            const { Header, Row, HeaderCell, Body } = Table; //ES 2015 Destructuring-these are all properties that will b pulled off the Table tag. So we dont have to do Table.Header, or Table.Row, etc
                        return (
                          <Layout> 
                            <h3>Requests</h3>
                              <Link route={`/campaigns/${this.props.address}/requests/new`}> 
                                  <a>
                                    <Button primary floated="right" style={{ marginBottom: 15}}>Add Request</Button>
                                  </a>
                              </Link>
                                  <Table>
                                    <Header>
                                      <Row>
                                        <HeaderCell>ID </HeaderCell>
                                        <HeaderCell> Description </HeaderCell>
                                        <HeaderCell> Amount </HeaderCell>
                                        <HeaderCell> Recipient (person receiving money) </HeaderCell>
                                        <HeaderCell> Approval </HeaderCell>
                                        <HeaderCell> Approve </HeaderCell>
                                        <HeaderCell> Finalize </HeaderCell>
                                      </Row>
                                    </Header>
                                 <Body>{this.renderRows()}</Body>
                                  </Table>
<div>Found {this.props.requestCount} requests.</div>

                          </Layout>
                        );
                    }
              }
export default RequestIndex;