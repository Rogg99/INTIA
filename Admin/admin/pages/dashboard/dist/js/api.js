API_URL='http://127.0.0.1:7000/intia/';
var authorization = '';
var loader = document.getElementById('progress2');
//Login
var user = {
    firstname:'',
    lastname:'',
    type:'',
    token:'',
    photo:'',
    id:'',
}

var object={}

async function login(email,password){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    loader.style.visibility='visible';

    const raw = JSON.stringify({
    "email": email,
    "password": password
    });

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    var res=true;
    try {
        const response = await fetch(API_URL+"admin/login", requestOptions);
        const result = await response.json();
        console.log(result)
        if(result.error==false){
            user.token=result.access;
            setCookie('user-token',user.token,2);
            }
      } catch (error) {
        console.error(error);
        toastr.error('Echec de la connexion, verifiez vos identifiants !!!');
        res=false;
      };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_userdatas(email,token){
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
      const response = await fetch(API_URL+"user/getwithemail?email="+email, requestOptions);
      const result = await response.json();
      console.log(result)
      
      if(result.error==false){
        setCookie('usermail',result.data.email,2);
        setCookie('username',result.data.nom,2);
        setCookie('userpre',result.data.prenom,2);
        setCookie('userphoto',result.data.photo,2);
        setCookie('user-city',result.data.city,2);
        setCookie('user-country',result.data.country,2);
        setCookie('user-description',result.data.description??'' ,2);
        setCookie('user-role',result.data.type,2);
        setCookie('user-id',result.data.id,2);
        }
        else{
            toastr.error("Echec de l'operation!");
        }

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}


async function fetch_userdatas_byId(id){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      //body: raw,
      redirect: "follow"
    };

    var res=true;
    var userObj={}
    try {
      const response = await fetch(API_URL+"user/get?id="+id, requestOptions);
      const result = await response.json();
      console.log(result)
      
      if(result.error==false){
            userObj=result.data;
            return userObj;
        }
        else{
            toastr.error("Echec de l'operation!");
        }

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_candidates(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
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
      const response = await fetch(API_URL+"headoflists/get?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        Candidates.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_events(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
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
      const response = await fetch(API_URL+"events/get?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        Events.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_petitions(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"petitions/get?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        Petitions.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_users(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"user/admins/get?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        Users.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_adhesions(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"adhesions/get?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        Adhesions.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_Shopitems(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"shopitems/get?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        Shopitems.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_Shoplists(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"shoplists/get?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        Orders.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_news(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"articles/get?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        News.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function fetch_gallery(position){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    if (position)
        position=position
    else position=0
    
    const raw = "";
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"gallery/images?position="+position, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      result.data.forEach(element => {
        Gallery.push(element)
      });
      

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return Gallery;
}

async function set_Status(id,object,status){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = JSON.stringify({
        "id": id,
        "object": object,
        "status": status,
        });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"/setstatus", requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error)
      toastr.error("Echec de l'operation!");

    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function load_dashboard(){
    const myHeaders = new Headers();
    console.log(getCookie('user-token'));
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = '';
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"dashboard", requestOptions);
      const result = await response.json();
      if(result.error==false)
        dashboard_vars=result.data
      if(result.error)
        toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    console.log(dashboard_vars);
    return dashboard_vars;
}

async function load_site(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = '';
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"/dashboard/site", requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      site_vars=result.data
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return site_vars;
}

async function load_object(id,objectName){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = '';
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"/"+objectName+"/get?id="+id, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      object=result.data
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='invisible';
    return res;
}

async function set_object(value,objectName){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = JSON.stringify(value);
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"/"+objectName+"/set", requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      toastr.success("Echec de l'operation!");
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='hidden';
    return res;
}

async function add_object(value,objectName){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = JSON.stringify(value);
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"/"+objectName+"/add", requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      toastr.success("Echec de l'operation!");
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='hidden';
    return res;
}

async function add_admin(value){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = JSON.stringify(value);
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"user/add-admin", requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      toastr.success("Echec de l'operation!");
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='hidden';
    return res;
}

async function upload(input,type='image'){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    var blobFile = input.files[0];
    var formData = new FormData();
    formData.append(type, blobFile);
    loader.style.visibility='visible';
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow"
    };

    var res='';
    try {
      const response = await fetch(API_URL+"upload"+type, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false){
        res = response.data.fileurl
      }
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='hidden';
    return res;
}

async function setUserPhoto(img_url){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = JSON.stringify({
        photo:img_url,
        id:getCookie('user-id'),
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"user/setphoto", requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      toastr.success("Echec de l'operation!");
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='hidden';
    return res;
}
async function setPhoto(value,type="Banner"){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = JSON.stringify(value);
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+"set"+type, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      toastr.success("Echec de l'operation!");
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='hidden';
    return res;
}

async function hide_showPhoto(position,action='hide',type="Banner"){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+getCookie('user-token'));
    loader.style.visibility='visible';
    
    const raw = JSON.stringify({id:position+''});
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    var res=true;
    try {
      const response = await fetch(API_URL+action+type, requestOptions);
      const result = await response.json();
      console.log(result);
      if(result.error==false)
      toastr.success("Echec de l'operation!");
      if(result.error)
      toastr.error("Echec de l'operation!");
    } catch (error) {
      console.error(error);
      toastr.error("Echec de l'operation!");
      res=false;
    };
    loader.style.visibility='hidden';
    return res;
}


