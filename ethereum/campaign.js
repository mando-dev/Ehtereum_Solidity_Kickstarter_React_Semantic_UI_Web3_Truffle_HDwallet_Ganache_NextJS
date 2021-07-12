import web3 from './web3';          // './' because of the same directory
import Campaign from './build/Campaign.json'; //whenver we get a contract we need to get the interface/ABI of the contract-so we are importing our Campaign.json

const CampaignInstance = (address) => {                       //we want to dynamically sepcify the addresss of the campaign instance and not hardcod it.//before this was export default (address) =>...
       return new web3.eth.Contract(                 //creating an instance of a campaign and returning it. This instance will point to the address in the line above
                            JSON.parse(Campaign.interface),         //first arg is interface of our build Campaign from line 2
                            address                               //2nd arg is the 'address'-a few lines above-line 4 -that gets passed inot this func      
                            );
                          };
export default CampaignInstance;      //this was added trying to fix a bug. there was no export here before. 


    //what the above func does is: if you pass me an address, you will get a setup contract that is ready to go with your campaign
    //instance of contract. pluggin address into here to get info from it for the UI-just as we created inside our factory.js by using web3
//we are writing this set up here just in case another Component/file wants to view info from this campaign instance
// we are now gonna import this func into our ContributeForm and pass the address back in here and get our contract

