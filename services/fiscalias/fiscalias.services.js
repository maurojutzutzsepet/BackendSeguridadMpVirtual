const axios = require('axios');


exports.getActividades = async () => {    
    try{

    const data = await axios.get('https://fiscaliasbackend.herokuapp.com/api/fiscalias',{
        })
        .then(function(response){        
            
            return { status: true, data: response.data}
        })
        
        return data;
    } catch (err) {
        console.log(err)        
    } 
}
