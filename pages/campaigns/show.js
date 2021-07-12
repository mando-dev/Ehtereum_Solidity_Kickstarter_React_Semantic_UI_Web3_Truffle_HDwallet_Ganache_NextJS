import React, { Component } from 'react';      //this componnt will show users details about some camaping-this the purpose of this component
import { Card, Grid, Button, List } from 'semantic-ui-react';
import Layout from '../../components/Layout';  //rega
import Campaign from '../../ethereum/campaign';  //capital C is not a component-its just to give the implication that this is a func that generates a new instance of something. we dont use lower case c for Campagin becuase we might use. This is importing our 'address' from campaign.js
import web3 from '../../ethereum/web3';    // needed for convertiing wei to ether
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';
import { getRedirectStatus } from 'next/dist/lib/load-custom-routes';

class CampaignShow extends Component {                            //creating our campaign. getInitialProps gets called before our Componnt gets rendered. This is creating a Component instance. 
      static async getInitialProps(props) {                         //this is similar to what we did inside Index.js. This props object is seperate and is its own. The props object here is different than the one that ends up in our Component instance below inside render(). This props object has a property called 'query'-so one property on this query is that token/address from our routes.js. so address is address of campagin to b shown to user               
                    const campaign = Campaign(props.query.address);           //all this routes stuff and 'address poperty comes from routes.js This creates the actual campaign instance that we will read information from-this is the caompaign instance being creted via the website . The getSUmmary func inside the render will grab information from here 'props.query.address'. Callinf Campaing frunc from line 3. 'props.query.address' can give us access to the campaign via this query object. We are accessing our campaign here.             
                    const summary = await campaign.methods.getSummary().call();              //where did getSummary come from? All the properties in the object of Summary such as: manager, minimumContribtion. number of contributors, etc will all b stored in 'summary'. Calling getSummary func on our campain one live above. 
                          return {                                          //props from Summary object will b returned here such as manager address, minContribution, etc. 
                                    address: props.query.address,                          // returning address-puuling it from a few lines above 'peops.query.address'
                                    minimumContribtion: summary[0],                          //passing in the data as individual props-accessing from Summary object. this is a props object
                                    balance: summary[1],                                    // all these properties are being labeled and reruend from getInitialProps func
                                    requestsCount: summary[2],                           //this getInitialProps func is returning this large object. !!!!!
                                    approversCount: summary[3],                      //all this info inside here our return object is for our component to use. 
                                    manager: summary[4]     //if we want all this info to show up on our componetn(CampaignShow), we need to somehow rerun our getInitalProps-or we can also get this done by refreshing our routes.js
                                  };                                          //we ill add the 'props.query.address' query object to this object returned by getInitialProps!!!!!!!!
                        }     
      renderCards(){                                                    //name totally made on the fly here.
                   const {                
                          balance,
                          manager,
                          minimumContribtion,
                          requestsCount,
                          approversCount
                        } = this.props;                                   //destructuring from this.props, basically the props object inside the return above.
                                    const items = [       
                                                   {
                                                      header: manager,          //grabbing props from above list inside cosnt inside renderCards
                                                      meta: 'Address of Manager',
                                                      description: 'The manager created this campaign and can create requests to withdraw money',
                                                      style: { overflowWrap: 'break-word' }  
                                                    },
                                                    {
                                                      header: minimumContribtion,          //grabbing props from above list inside cosnt inside renderCards
                                                      meta: 'Minimum Contribution (wei)',
                                                      description: 'You must contribute at least this much wei to become an approver ',
                                                      
                                                    },
                                                    {
                                                      header: requestsCount,          //grabbing props from above list inside cosnt inside renderCards
                                                      meta: 'Number of Requests',
                                                      description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers',
                                                      
                                                    },
                                                    {
                                                      header: approversCount,          //grabbing props from above list inside cosnt inside renderCards
                                                      meta: 'Number of Approvers',
                                                      description: 'Number of people who have already donated to this campaign',
                                                    },
                                                    {                                     //everytime we pull a balance off of a contract it is in wei 
                                                      header: web3.utils.fromWei(balance, 'ether'),       //grabbing props from above list inside cosnt inside renderCards
                                                      meta: 'Campaign Balance (ether)',     
                                                      description: 'The balance is how much money this campaign has left to spend',
                                                    },
                                                                                                                                                
                                                ]; 
                                    return <Card.Group items={items} />; //passing in list of items right
                                          }     
      render() {
                return(
                  <Layout>
                        <h3>Campaign Show </h3>
                        <Grid>
                          <Grid.Row> 
                            <Grid.Column width={10}>
                                {this.renderCards()}
                              </Grid.Column>  {/*  grabbing this data from func above, so we can display it . */}
                                        <Grid.Column width={6}>
                                              <ContributeForm address={this.props.address} />          {/* //semms that once we finish up coding up a func or so, we always come downt to our render() to make sure it gets displayed. Campaign we are curently looking at in the screen. We have access to this address via getInitialProps above since we just adde4d it to that object  */} 
                                        </Grid.Column>
                                </Grid.Row>
                                      <Grid.Row>
                                          <Grid.Column> 
                                              <Link route={`/campaigns/${this.props.address}/requests`}>   
                                                    <a> 
                                                      <Button primary> View Requests </Button>
                                                    </a>  
                                                  </Link>
                                          </Grid.Column>
                                    </Grid.Row>
                              </Grid>
                        </Layout>
                      );
                  }
              } 
      export default CampaignShow;