import React, { Component } from 'react'
import axios from 'axios'; 

export default class Slots extends Component {
  
  constructor() {
    super();
    this.state= {
        stateList: [],
        districtList:[],
        slotsList:[],
        districtId:'',
        state:'',
        date:'',
        searchClicked:false,
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDistrictChange = this.handleDistrictChange.bind(this);
}


// Load all States in Stated-drop down 
async componentDidMount() {
  const response =  await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states', {
  });
    this.setState({
        stateList: response.data.states,
    });
}


 // handle state change
 async handleChange(e) {
     const id=e.target.value;
     this.setState({
        state: e.target.value,
    });
    const response =  await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/districts/'+id, {
    });
    this.setState({
        districtList:response.data.districts
    })

    
  }

  async handleDistrictChange(e){
    this.setState({
        districtId:e.target.value,
    })
  }


  async handleDateChange(e){
      var date=e.target.value+"";
      
      // converting date to DD-MM-YYYY format
      var day=date.slice(8,10);
      var month=date.slice(5,7);
      var year=date.slice(0,4);
      var formatedDate=day+"-"+month+"-"+year;
      this.setState({
        date:formatedDate,
    })
      
  }

  async fetchSlots(){
    const response =  await axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='+this.state.districtId+'&date='+this.state.date, {                           
        });

    this.setState({
        slotsList:response.data.sessions,
        searchClicked:true
    })


  }




  render () { 
    
    let states = this.state.stateList;
    let districts =this.state.districtList;
    let slots = this.state.slotsList;

    return (
    
     <div style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>
         <h2 style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>Find Vaccination slots in your District</h2>
        {states.length ===0 ?
        <div>Loading</div>
        :
            <div style={{'text-align':'center', 'margin':'20px', 'padding':'20px'}}>
        <select style={{'margin':'10px', 'padding':'10px'}}  onChange={this.handleChange}  >
        <option  value="" selected disabled hidden>Select State</option>
        {states.map(state =>
            
            <option type="button" value={state.state_id} key={state.state_name}>{state.state_name}</option>
            
         )
         }
        </select>
        <select style={{'margin':'10px', 'padding':'10px'}} onChange={this.handleDistrictChange}  >
        <option value="" selected disabled hidden>Select District</option>
        {districts.map(district =>     
            <option  type="button" value={district.district_id} key={district.state_name}>{district.district_name}</option>
            
         )
         }
        </select>
    
        <form style={{'margin':'10px', 'padding':'10px'}}>
        <input style={{'text-align':'center','margin':'10px', 'padding':'5px'}} type="date" name="date" onChange={this.handleDateChange}  ></input>
        </form  >
        <button style={{'marginLeft':'15px', 'padding':'10px'}} onClick={()=> this.fetchSlots()} >Search</button>
        <table>
    { (slots.length===0 && (this.state.districtId!=='' && this.state.date!=='' && this.state.searchClicked ))  ?
        <div  style={{'text-align':'center', 'minWidth':'100%' }}>
     <div style={{ 'text-align':'center','minWidth':'100%','marginLeft':'70px', 'padding':'15px'}} >No Slots for Selected District and date. </div>
     </div> 
    : (slots.length===0 && !this.state.searchClicked) ? <div></div>
    :
    <div style={{'textAlign':'center', 'margin':'15px', 'padding':'15px'}}>
      <div style={{'margin':'15px', 'padding':'15px'}}>Slots Details for Selected District : </div>
      <tr>
          <th style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>Name  </th>
          <th style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>Available vaccine </th>
          <th style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>Fee type </th>
          <th style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>Fee </th>
          <th style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>Minimum Age </th>
          <th style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>vaccine </th>

      
      </tr>
      {slots.map((item) => (
        <tr>
          
            <td style={{'text-align':'center','margin':'10px', 'padding':'5px'}} >{item.name}</td>
            <td style={{'text-align':'center', 'margin':'10px', 'padding':'5px'}}>{item.available_capacity}</td>
            <td style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>{item.fee_type}</td>
            <td style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>{item.fee}</td>
            <td style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>{item.min_age_limit}</td>
            <td style={{'text-align':'center','margin':'10px', 'padding':'5px'}}>{item.vaccine}</td>
            
          
        </tr>
      ))}
      </div>
}
    </table>
</div>
        
        }
        
         
     </div>
    )
}
}