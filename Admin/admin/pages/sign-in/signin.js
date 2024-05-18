API_URL='http://127.0.0.1:7000/intia/';
var authorization = '';
var loader = document.getElementById('progress');

async function login(email,password){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*")
    myHeaders.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    myHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    loader.style.visibility='visible';

    const raw = JSON.stringify({
    "email": email,
    "password": password
    });

    const requestOptions = {
      //mode: 'no-cors',
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    var res=true;
    try {
        const response= await fetch(API_URL+"token", requestOptions)
        const result = await response.json();
        console.log(result)
        if(result.error==false){
          console.log(result.access)
          user.token=result.access; 
          setCookie('user-token',user.token,7);
          console.log('logged')
        }
        else{
          toastr.error('No matching Credentials');
        }
      } catch (error) {
        console.error(error);
        toastr.error('No matching Credentials');
        res=false;
      };
    loader.style.visibility='hidden';
    return res;
}

async function fetch_userdatas(email,token){
  
  console.log('fetching user datas ..........')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    loader.style.visibility='visible';
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      //body: raw,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"user/getwithemailandpwd?email="+email+"&password=123", requestOptions);
      const result = await response.json();
      console.log(result)
      console.log('hi ***********')
      if(result.error==false){
      console.log(result.data)
      setCookie('usermail',result.data.email,7);
      setCookie('username',result.data.nom,7);
      setCookie('userpre',result.data.prenom,7);
      setCookie('userphoto',result.data.photo,7);
      setCookie('user-position',result.data.position,7);
      setCookie('user-branch_id',result.data.branch_id??'' ,7);
      setCookie('user-id',result.data.id,7);
      }
      else{
          toastr.error("Echec de l'operation!");
          res=false;
      }

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}
