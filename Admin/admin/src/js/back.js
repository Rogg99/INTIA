API_URL='http://127.0.0.1:7000/intia/';
// dashboard
var user_key;
var user_datas;
var user={};
var hiddenIdxs = [];
var progressbar=document.getElementById("progress2");
var progressbar2=document.getElementById("progress2");
var sectionTitle=document.getElementById("sectionTitle");
var mail_input;
var password_input; 
var Candidates=[];
var Events=[];
var Petitions=[];
var Users=[];
var Adhesions=[];
var Shopitems=[];
var Orders=[];
var News=[];
var Gallery=[];

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let usermail = getCookie("usermail");
  if (usermail != "") {
    window.location.replace("../../pages/dashboard/index.html");
  } 
  else{
    console.log('no userfound');
  }
}

function signOut(){
  setCookie("user-token", '', -1);
  setCookie('usermail', '', -1);
  setCookie('username', '', -1);
  setCookie('userpre', '', -1);
  setCookie('userphoto', '', -1);
  setCookie('userpass', '', -1);
  setCookie('user-city', '', -1);
  setCookie('user-country', '', -1);
  setCookie('user-description', '', -1);
  setCookie('user-role', '', -1);
  setCookie('user-id', '', -1);
  window.location.replace("../sign-in/index.html");
}

var usermail=getCookie('usermail');
var username=getCookie('username');
var userpre=getCookie('userpre');
var userphoto=getCookie('userphoto');
var userpass=getCookie('userpass');

function connexionTest(){
  window.location.replace("../../pages/dashboard/index.html");
}

function connexion(){
  password_input.style.borderColor='transparent';
  mail_input.style.borderColor='transparent';
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-]+)*$/;
  progressbar.style.visibility="visible";
  progressbar.style.height="30px";
  progressbar.style.width="30px";
  var password=password_input.value;
  var mail=mail_input.value;
  if(password=='' || password==null || !mail.match(validRegex) ){
    password_input.style.borderColor='red';
    mail_input.style.borderColor='red';
    
    progressbar.style.visibility="hidden";
    errorMessage.style.visibility="visible";
    errorMessage.innerHTML="Invalid Email or Password";
    toastr.error("Invalid Email or Password");
    progressbar.style.height="0px";
    progressbar.style.width="0px";
  }
  else{
    login(mail,password).then(success=>{
      if(success)
      fetch_userdatas(mail,getCookie('user-token')).then(success=>{
        if(success)
          console.log('done')
          window.location.replace("../../pages/dashboard/index.html");
      })
      }
    )
  }
}

function initialize(){
   // map.setView([4.090679, 9.797171],15);
}

function caps(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
async function active(e){
  var mains=['dashboard','site','gallery','events','shop','candidates','articles','users','petitions','adhesions','profile','user']

  var sidebarmenu=document.getElementById('sidebarMenu')
  var nav_links=sidebarmenu.getElementsByClassName("nav-link");
  for(let i=0;i<nav_links.length;i++){
    nav_links[i].classList.remove("active");
  }
  //hideOptions();

  e.classList.add("active");

  for(let i=0;i<mains.length;i++){
    if(e.classList.contains(mains[i])){
      if(i==0 || i==1 || i==mains.length-1 || i==mains.length-2){
        document.getElementById('addBtn').style.visibility='hidden';
      }
      else{
        document.getElementById('addBtn').style.visibility='visible';
      }
      document.getElementById(mains[i]).style.display='block';
      sectionTitle.innerHTML= caps(mains[i]) + ' <img src="../../src/img/loading2.gif" height="30" width="30" id="progress2" style="visibility:hidden">';
    }
    else{
      document.getElementById(mains[i]).style.display='none';
    }
  }
  if(e.classList.contains('site')){
    document.getElementById('progress2').style.visibility='visible';
    var site_vars={
      banners:[],
      promises:[],
      bigs:[],
      smalls:[],
      bigvideo:[]
    }
    var subs=['banners','promises','bigphotos','bigvideo','smallgallery']
    subs.forEach(element => {
      const sitediv = document.getElementById('site');
      const wkdiv = sitediv.getElementsByClassName(element)[0].innerHTML='';
    });

    site_vars = await load_site();
    site_vars.banners.forEach(element => {
      addBannerWidget(element);
    });
    site_vars.smalls.forEach(element => {
      addMiniGalleryWidget(element);
    });
    
    addBigvideoWidget(site_vars.bigvideo);
    
    site_vars.promises.forEach(element => {
      addPromisesWidget(element);
    });
    site_vars.bigs.forEach(element => {
      addBigImagessWidget(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }
  
  if(e.classList.contains('gallery')){
    document.getElementById('progress2').style.visibility='visible';
    const sitediv = document.getElementById('gallery');
    sitediv.getElementsByClassName('row')[0].innerHTML='';
    Gallery=[]
    Gallery = await fetch_gallery(0);
    Gallery.forEach(element => {
      addGalleryWidget(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }

  if(e.classList.contains('shop')){
    document.getElementById('progress2').style.visibility='visible';
    var tab = document.getElementById('productsTable');
    tab.getElementsByTagName('tbody')[0].innerHTML='';
    Shopitems=[]
    await fetch_Shopitems(0);
    console.log(Shopitems.length)

    if(Shopitems.length>0)
    Shopitems.forEach(element => {
      addRowProduct(element);
    });
    var tabo = document.getElementById('OrdersTable');
    tabo.getElementsByTagName('tbody')[0].innerHTML='';
    Orders=[]
    await fetch_Shoplists(0);
    if(Orders.length>0)
    Orders.forEach(element => {
      addRowOrder(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }
  
  if(e.classList.contains('candidates')){
    document.getElementById('progress2').style.visibility='visible';
    var tab = document.getElementById('candidatesTable');
    tab.getElementsByTagName('tbody')[0].innerHTML='';
    Candidates=[]
    await fetch_candidates(0);
    if(Candidates.length>0)
    Candidates.forEach(element => {
      addRowCandidates(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }

  if(e.classList.contains('articles')){
    document.getElementById('progress2').style.visibility='visible';
    var tab = document.getElementById('newsTable');
    tab.getElementsByTagName('tbody')[0].innerHTML='';
    News=[]
    await fetch_news(0);
    console.log(News)
    if(News.length>0)
    News.forEach(element => {
      addRowNews(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }

  if(e.classList.contains('events')){
    document.getElementById('progress2').style.visibility='visible';
    var tab = document.getElementById('eventsTable');
    tab.getElementsByTagName('tbody')[0].innerHTML='';
    Events=[]
    await fetch_events(0);
    if(Events.length>0)
    Events.forEach(element => {
      addRowEvents(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }

  if(e.classList.contains('petitions')){
    document.getElementById('progress2').style.visibility='visible';
    var tab = document.getElementById('petitionsTable');
    tab.getElementsByTagName('tbody')[0].innerHTML='';
    Petitions=[]
    await fetch_petitions(0);
    if(Petitions.length>0)
    Petitions.forEach(element => {
      addRowPetitions(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }

  if(e.classList.contains('users')){
    document.getElementById('progress2').style.visibility='visible';
    var tab = document.getElementById('usersTable');
    tab.getElementsByTagName('tbody')[0].innerHTML='';
    Users=[]
    await fetch_users(0);
    if(Users.length>0)
    Users.forEach(element => {
      addRowUsers(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }

  if(e.classList.contains('adhesions')){
    document.getElementById('progress2').style.visibility='visible';
    var tab = document.getElementById('adhesionsTable');
    tab.getElementsByTagName('tbody')[0].innerHTML='';
    Adhesions=[]
    await fetch_adhesions(0);
    if(Adhesions.length>0)
    Adhesions.forEach(element => {
      addRowAdhesions(element);
    });
    document.getElementById('progress2').style.visibility='hidden';
  }

  if(e.classList.contains('profile')){
    document.getElementById('progress2').style.visibility='visible';
    var user_datas2 = await fetch_userdatas_byId(getCookie('user-id'));
    //settings
    document.getElementsByClassName('profile-input-userfname')[0].value=getCookie('username');
    document.getElementsByClassName('profile-input-usersname')[0].value=getCookie('userpre');
    document.getElementsByClassName('profile-input-description')[0].value=getCookie('user-description');
    document.getElementsByClassName('profile-input-location')[0].value=getCookie('user-city')+','+getCookie('user-country');
    //profile
    document.getElementsByClassName('profile-username')[0].innerText=getCookie('username')+' '+getCookie('userpre');
    document.getElementsByClassName('profile-position')[0].innerText=getCookie('user-role');

    if(getCookie('userphoto')!='' && getCookie('userphoto')!='none')
      document.getElementsByClassName('profile-user-img')[0].src=API_URL+getCookie('userphoto');
    else
      document.getElementsByClassName('profile-user-img')[0].src='dist/img/usericon.png';

    document.getElementsByClassName('profile-description')[0].innerText=getCookie('user-description');
    document.getElementsByClassName('profile-location')[0].innerText=getCookie('user-city')+','+getCookie('user-country');

    //stats
    if(!isNaN(parseInt(user_datas2.gallery))){
      document.getElementsByClassName('profile-gallery')[0].innerText=user_datas2.gallery;
      document.getElementsByClassName('profile-likes')[0].innerText=user_datas2.likes;
      document.getElementsByClassName('profile-articles')[0].innerText=user_datas2.articles;
    }
    //activity
    if(user_datas2.activity+'' != 'undefined' & user_datas2.activity.length>0){
      const tableprof = document.getElementById('profile-activity-table')
      tableprof.getElementsByTagName('tbody')[0].innerHTML='';
      user_datas2.activity.forEach(element => {
        addRowActivity(element);
      });
    }

    document.getElementById('progress2').style.visibility='hidden';
  }

}

function load_datas(){
  console.log('loading datas...');
  let usermail = getCookie("usermail");
  if (usermail=="" || usermail==null) {
    window.location.replace("../sign-in/index.html");
  } 
  progressbar2.style.visibility="visible";
}

async function show_user_Profile(id){
  var mains=['dashboard','site','gallery','events','shop','candidates','articles','users','petitions','adhesions','profile','user']

  for(let i=0;i<mains.length;i++){
    document.getElementById(mains[i]).style.display='none';
  }
  //empty all cases
  
  document.getElementsByClassName('user-username')[0].innerText='';
  document.getElementsByClassName('user-position')[0].innerText='';
  document.getElementsByClassName('user-user-img')[0].src='dist/img/usericon.png';
  document.getElementsByClassName('user-description')[0].innerText = '';
  document.getElementsByClassName('user-location')[0].innerText = '';
  document.getElementsByClassName('user-gallery')[0].innerText = '';
  document.getElementsByClassName('user-likes')[0].innerText = '';
  document.getElementsByClassName('user-articles')[0].innerText = '';

  document.getElementById('user').style.display='block';
  sectionTitle.innerHTML= 'User Profile ' + ' <img src="../../src/img/loading2.gif" height="30" width="30" id="progress2" style="visibility:hidden">';
  
  document.getElementById('progress2').style.visibility='visible';
  var user_obj = await fetch_userdatas_byId(id);
  if(user_obj.nom+'' != 'undefined'){
    //profile
    document.getElementsByClassName('user-username')[0].innerText=user_obj.nom+' '+user_obj.prenom;
    document.getElementsByClassName('user-position')[0].innerText=user_obj.type;
    document.getElementsByClassName('setbtn')[0].href='user.html?id='+user_obj.id;

    if(getCookie('userphoto')!='' && getCookie('userphoto')!='none')
      document.getElementsByClassName('user-user-img')[0].src=API_URL+user_obj.photo;
    else
      document.getElementsByClassName('user-user-img')[0].src='dist/img/usericon.png';

    document.getElementsByClassName('user-description')[0].innerText = user_obj.description;
    document.getElementsByClassName('user-location')[0].innerText = user_obj.city+','+user_obj.country;

    //stats
    if(!isNaN(parseInt(user_obj.gallery))){
      document.getElementsByClassName('user-gallery')[0].innerText = user_obj.gallery;
      document.getElementsByClassName('user-likes')[0].innerText = user_obj.likes;
      document.getElementsByClassName('user-articles')[0].innerText = user_obj.articles;
    }
    //activity
    if(user_obj.activity+'' != 'undefined' & user_obj.activity.length>0){
      const tableusr = document.getElementById('user-activity-table')
      tableusr.getElementsByTagName('tbody')[0].innerHTML='';
      user_obj.activity.forEach(element => {
        addRowActivityUser(element);
      });
    }
  }

  document.getElementById('progress2').style.visibility='hidden';

}

function date_timestamp(date=""){
  if (date.indexOf('/')>0)
    myDate = date.split("/");
  else
    myDate = date.split("-");
  var newDate = new Date( myDate[0], myDate[1] - 1, myDate[2]);
  return Math.floor(newDate.getTime()/1000);
}

function datetime_timestamp(date=""){
  const time=date.split(" ")[1]
  const datey=date.split(" ")[0]
  var myDate=[]
  if (date.indexOf('/')>0)
    myDate = datey.split("/");
  else
    myDate = datey.split("-");
  const spltTime=time.split(':');
  var newDate = new Date( myDate[0], myDate[1] - 1, myDate[2],spltTime[0],spltTime[1]);
  return Math.floor(newDate.getTime()/1000);
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function getState(time){
  var actual=Math.floor(Date.now() / 1000);
  if(actual-time<300){
    return 'Online';
  }
  else if(Math.floor((actual-time)/60)<60){
    return Math.floor((actual-time)/60)+" min";
  }
  else if(Math.floor((actual-time)/3600)<24){
    return Math.floor((actual-time)/3600)+" hr";
  }
  else {
    return Math.floor((actual-time)/84600)+" j";
  }
}

function addRowOrder(element){
  const table = document.getElementById('OrdersTable')
  var tbodyRef = table.getElementsByTagName('tbody')[0];
  var eltIdx=tbodyRef.childElementCount;
  var row = tbodyRef.insertRow(-1);
  row.addEventListener("click", function(event) {
    //hideDevicetr(this);
  });
  var status='bg-success';
  if(element.status=='completed')
    status='bg-success';
  else if(element.status=='waiting')
    status='bg-warning';
  else
    status='bg-danger';
  var actions='';
  if(element.status!='archived')
    actions = '<button class="btn btn-danger" style="margin-right: 10px">'
                      +'<span data-feather="archive"></span> Archive </button>';

  if(element.status=='waiting')
    actions +='<button class="btn btn-success" style="margin-right: 10px"><span data-feather="check"></span> Activate </button>';

  tbodyRef.innerHTML+=
              '<tr onclick="openOrder(\''+element.id+'\')">'
                +'<td style="width: 10px">#</td>'
                +'<td>'+element.date+'</td>'
                +'<td>'+element.id+'</td>'
                +'<td>'+element.Client+'</td>'
                +'<td>'+element.itemsCount+'</td>'
                +'<td>'+element.total+'</td>'
                +'<td>'+element.validator+'</td>'
                +'<td class="'+status+'">'+element.status+'</td>'
                +'<td>'+actions+'</td>'
              +'</tr>';

}

function addRowProduct(element){
  const table = document.getElementById('productsTable')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  var status='bg-success';
  var statusTxt='waiting';
  if(element.statut=='2'){
    status='bg-success';
    statusTxt='published';
  }
  else if(element.statut=='1'){
    status='bg-warning';
    statusTxt='waiting';
  }
  else{
    status='bg-danger';
    statusTxt='archived';
  }
  var actions='';
  if(element.statut!='5')
    actions = '<button class="btn btn-danger" style="margin-right: 10px">'
                      +'<span data-feather="archive"></span> Archive </button>';

  if(element.statut=='1')
    actions +='<button class="btn btn-success" style="margin-right: 10px"><span data-feather="check"></span> Activate </button>';
   
  tbodyRef.innerHTML+=
              '<tr onclick="openProduct(\''+element.id+'\')">'
                +'<td>'+element.title+'</td>'
                +'<td><img src="'+API_URL+element.image+'" width="50"  height="50"></td>'
                +'<td>'+element.price+'</td>'
                +'<td>'+element.reduction+'</td>'
                +'<td>'+element.sells+'</td>'
                +'<td>'+element.creatorName+'</td>'
                +'<td class="'+status+'">'+statusTxt+'</td>'
                +'<td>'+actions+'</td>'
              +'</tr>';

}

function addRowNews(element){
  console.log('adding news row')
  const table = document.getElementById('newsTable')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  var status='bg-success';
  var statusTxt='waiting';
  if(element.statut=='2'){
    status='bg-success';
    statusTxt='published';
  }
  else if(element.statut=='1'){
    status='bg-warning';
    statusTxt='waiting';
  }
  else{
    status='bg-danger';
    statusTxt='archived';
  }
  var actions='';
  if(element.statut!='5')
    actions = '<button class="btn btn-danger" style="margin-right: 10px">'
                      +'<span data-feather="archive"></span> Archive </button>';

  if(element.statut=='1')
    actions +='<button class="btn btn-success" style="margin-right: 10px"><span data-feather="check"></span> Activate </button>';

  tbodyRef.innerHTML+=
              '<tr onclick="openNews(\''+element.id+'\')">'
                +'<td>'+timeConverter(element.creation_date)+'</td>'
                +'<td>'+element.title+'</td>'
                +'<td><img src="'+API_URL+element.image+'" width="50"  height="50"></td>'
                +'<td>'+element.comments+'</td>'
                +'<td>'+element.reactions+'</td>'
                +'<td>'+element.creatorName+'</td>'
                +'<td class="'+status+'">'+statusTxt+'</td>'
                +'<td>'+actions+'</td>'
              +'</tr>';

}

function addRowEvents(element){
  const table = document.getElementById('eventsTable')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  var status='bg-success';
  var statusTxt='waiting';
  if(element.statut=='2'){
    status='bg-success';
    statusTxt='published';
  }
  else if(element.statut=='1'){
    status='bg-warning';
    statusTxt='waiting';
  }
  else{
    status='bg-danger';
    statusTxt='archived';
  }
  var actions='';
  if(element.statut!='5')
    actions = '<button class="btn btn-danger" style="margin-right: 10px">'
                      +'<span data-feather="archive"></span> Archive </button>';

  if(element.statut=='1')
    actions +='<button class="btn btn-success" style="margin-right: 10px"><span data-feather="check"></span> Activate </button>';
  
  if(element.article.length>8)
    articleAction = '<a class="btn btn-success" href="article.html?edit=false&id='+element.article+'" > Open </a>';

  else
    articleAction = '<a class="btn btn-primary" href="article.html?event_id='+element.id+'" > Add Article </a>';

  tbodyRef.innerHTML+=
              '<tr onclick="openEvent(\''+element.id+'\')">'
                +'<td>'+element.title+'</td>'
                +'<td>'+timeConverter(element.start_date)+'</td>'
                +'<td>'+timeConverter(element.end_date)+'</td>'
                +'<td>'+element.place+'</td>'
                +'<td>'+element.creatorName+'</td>'
                +'<td>'+articleAction+'</td>'
                +'<td class="'+status+'">'+statusTxt+'</td>'
                +'<td>'+actions+'</td>'
              +'</tr>';

}

function addRowPetitions(element){
  const table = document.getElementById('petitionsTable')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  var status='bg-success';
  var statusTxt='waiting';
  if(element.statut=='2'){
    status='bg-success';
    statusTxt='published';
  }
  else if(element.statut=='1'){
    status='bg-warning';
    statusTxt='waiting';
  }
  else{
    status='bg-danger';
    statusTxt='archived';
  }
  var actions='';
  if(element.statut!='5')
    actions = '<button class="btn btn-danger" style="margin-right: 10px">'
                      +'<span data-feather="archive"></span> Archive </button>';

  if(element.statut=='1')
    actions +='<button class="btn btn-success" style="margin-right: 10px"><span data-feather="check"></span> Activate </button>';

  if(element.article.length>8)
    articleAction = '<a class="btn btn-success" href="article.html?edit=false&id='+element.article+'" > Open </a>';

  else
    articleAction = '<a class="btn btn-primary" href="article.html?event_id='+element.id+'" > Add Article </a>';

  tbodyRef.innerHTML+=
              '<tr onclick="openPetition(\''+element.id+'\')">'
                +'<td>'+element.title+'</td>'
                +'<td>'+element.goal+'</td>'
                +'<td>'+element.signatures+'</td>'
                +'<td>'+element.creatorName+'</td>'
                +'<td>'+articleAction+'</td>'
                +'<td class="'+status+'">'+statusTxt+'</td>'
                +'<td>'+actions+'</td>'
              +'</tr>';

}

function addRowCandidates(element){
  const table = document.getElementById('candidatesTable')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  var status='bg-success';
  var statusTxt='waiting';
  if(element.statut=='2'){
    status='bg-success';
    statusTxt='published';
  }
  else if(element.statut=='1'){
    status='bg-warning';
    statusTxt='waiting';
  }
  else{
    status='bg-danger';
    statusTxt='archived';
  }
  var actions='';
  if(element.statut!='5')
    actions = '<button class="btn btn-danger" style="margin-right: 10px">'
                      +'<span data-feather="archive"></span> Archive </button>';

  if(element.statut=='1')
    actions +='<button class="btn btn-success" style="margin-right: 10px"><span data-feather="check"></span> Activate </button>';

  if(element.article.length>8)
    articleAction = '<a class="btn btn-success" href="article.html?edit=false&id='+element.article+'" > Open </a>';

  else
    articleAction = '<a class="btn btn-primary" href="article.html?event_id='+element.id+'" > Add Article </a>';

  tbodyRef.innerHTML+=
              '<tr onclick="openCandidate(\''+element.id+'\')">'
                +'<td>'+element.firstName+' '+element.secondName+'</td>'
                +'<td><img src="'+API_URL+element.image+'" width="50"  height="50"></td>'
                +'<td>'+element.city+'</td>'
                +'<td>'+element.position+'</td>'
                +'<td>'+element.creatorName+'</td>'
                +'<td>'+articleAction+'</td>'
                +'<td class="'+status+'">'+statusTxt+'</td>'
                +'<td>'+actions+'</td>'
              +'</tr>';

}

function addRowAdhesions(element){
  const table = document.getElementById('adhesionsTable')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  var status='bg-success';
  var statusTxt='waiting';
  if(element.statut=='2'){
    status='bg-success';
    statusTxt='published';
  }
  else if(element.statut=='1'){
    status='bg-warning';
    statusTxt='waiting';
  }
  else{
    status='bg-danger';
    statusTxt='archived';
  }
  var actions='';
  if(element.statut!='5')
    actions = '<button class="btn btn-danger" style="margin-right: 10px">'
                      +'<span data-feather="archive"></span> Archive </button>';

  if(element.statut=='1')
    actions +='<button class="btn btn-success" style="margin-right: 10px"><span data-feather="check"></span> Activate </button>';

  tbodyRef.innerHTML+=
              '<tr onclick="openAdhesion(\''+element.id+'\')">'
                +'<td>'+timeConverter(element.creation_date)+'</td>'
                +'<td>'+element.name+'</td>'
                +'<td><img src="'+API_URL+element.image+'" width="50"  height="50"></td>'
                +'<td>'+element.city+'</td>'
                +'<td>'+element.country+'</td>'
                +'<td>'+element.creatorName+'</td>'
                +'<td>'+articleAction+'</td>'
                +'<td class="'+status+'">'+statusTxt+'</td>'
                +'<td>'+actions+'</td>'
              +'</tr>';

}

function addRowUsers(element){
  const table = document.getElementById('usersTable')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  var status='bg-success';
  var statusTxt='waiting';
  if(element.statut=='2'){
    status='bg-success';
    statusTxt='published';
  }
  else if(element.statut=='1'){
    status='bg-warning';
    statusTxt='waiting';
  }
  else{
    status='bg-danger';
    statusTxt='archived';
  }
  var actions='';
  if(element.statut!='5')
    actions = '<button class="btn btn-danger" style="margin-right: 10px">'
                      +'<span data-feather="archive"></span> Archive </button>';

  if(element.statut=='1')
    actions +='<button class="btn btn-success" style="margin-right: 10px"><span data-feather="check"></span> Activate </button>';

  
  var image=API_URL+element.image
  if(element.image=='none' || element.image=='')
    image = 'dist/img/usericon.png'

  tbodyRef.innerHTML+=
              '<tr onclick="show_user_Profile(\''+element.id+'\')">'
                +'<td>'+timeConverter(element.creation_date)+'</td>'
                +'<td>'+element.nom +' ' +element.prenom +'</td>'
                +'<td><img src="'+image+'" width="50"  height="50"></td>'
                +'<td>'+element.city+'</td>'
                +'<td>'+element.country+'</td>'
                +'<td>'+element.type+'</td>'
                +'<td class="'+status+'">'+statusTxt+'</td>'
                +'<td>'+actions+'</td>'
              +'</tr>';

}

function addRowActivity(element){
  const table = document.getElementById('profile-activity-table')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  tbodyRef.innerHTML+=
              '<tr>'
                +'<td>'+element.date+'</td>'
                +'<td> Ajout d\'un(e) '+element.type+'</td>'
                +'<td>'+element.image+'</td>'
                +'<td>'+element.title+'</td>'
              +'</tr>';

}

function addRowActivityUser(element){
  const table = document.getElementById('user-activity-table')
  var tbodyRef = table.getElementsByTagName('tbody')[0];

  tbodyRef.innerHTML+=
              '<tr>'
                +'<td>'+element.date+'</td>'
                +'<td> Ajout d\'un(e) '+element.type+'</td>'
                +'<td>'+element.image+'</td>'
                +'<td>'+element.title+'</td>'
              +'</tr>';

}

function addObject(){
  if(document.getElementsByClassName('adhesions')[0].classList.contains('active')){
    window.location.replace("adhesion.html");
  }
  else if(document.getElementsByClassName('candidates')[0].classList.contains('active')){
    window.location.replace("candidate.html");
  }
  else if(document.getElementsByClassName('articles')[0].classList.contains('active')){
    window.location.replace("article.html");
  }
  else if(document.getElementsByClassName('events')[0].classList.contains('active')){
    window.location.replace("event.html");
  }
  else if(document.getElementsByClassName('gallery')[0].classList.contains('active')){
    window.location.replace("photo.html");
  }
  else if(document.getElementsByClassName('users')[0].classList.contains('active')){
    window.location.replace("user.html");
  }
  else if(document.getElementsByClassName('petitions')[0].classList.contains('active')){
    window.location.replace("petition.html");
  }
  else if(document.getElementsByClassName('shop')[0].classList.contains('active')){
    window.location.replace("shopitem.html");
  }

}

function showSellsCard(e){
  var btnsShop=document.getElementsByClassName("btn-shop-filter");
  const table = document.getElementById('OrdersTable')
  var tbody = table.getElementsByTagName('tbody')[0];
  for(let i=0;i<btnsShop.length;i++){
    btnsShop[i].classList.remove("active");
  }
  e.classList.add('active');
  if(e.innerText=='All Products'){
    document.getElementById('ordersView').hidden=true;
    document.getElementById('productsView').hidden=false;
  }
  else if(e.innerText=='Completed Orders'){
    document.getElementById('ordersView').hidden=false;
    document.getElementById('productsView').hidden=true;
    tbody.innerHTML='';
    for(var i=0;i<orders.length;i++){
      if(Orders[i].status=='completed')
      addRowOrder(Orders[i]);
    }
  }
  else if(e.innerText=='Awaiting Orders'){
    document.getElementById('ordersView').hidden=false;
    document.getElementById('productsView').hidden=true;
    tbody.innerHTML='';
    for(var i=0;i<orders.length;i++){
      if(Orders[i].status=='waiting')
      addRowOrder(Orders[i]);
    }
  }
  else if(e.innerText=='Archived Orders'){
    document.getElementById('ordersView').hidden=false;
    document.getElementById('productsView').hidden=true;
    tbody.innerHTML='';
    for(var i=0;i<orders.length;i++){
      if(Orders[i].status=='archived')
      addRowOrder(Orders[i]);
    }
  }

}

function filterNews(e){
  var btnsShop=document.getElementsByClassName("btn-news-filter");
  var table=document.getElementById('newsTable');
  var tbody=table.getElementsByTagName('tbody')[0];
  for(let i=0;i<btnsShop.length;i++){
    btnsShop[i].classList.remove("active");
  }
  e.classList.add('active');
  if(e.innerText=='All'>0){
    tbody.innerHTML='';
    for(var i=0;i<news.length;i++){
      addRowNews(news[i]);
    }
  }
  else if(e.innerText=='Active'>0){
    tbody.innerHTML='';
    for(var i=0;i<news.length;i++){
      if(news[i].statut=='2')
      addRowNews(news[i]);
    }
  }
  else if(e.innerText=='Awaiting'>0){
    tbody.innerHTML='';
    for(var i=0;i<news.length;i++){
      if(news[i].statut=='1')
      addRowNews(news[i]);
    }
  }
  else if(e.innerText=='Archived'>0){
    tbody.innerHTML='';
    for(var i=0;i<news.length;i++){
      if(news[i].statut=='5')
      addRowNews(news[i]);
    }
  }
  else if(e.innerText=='Mine'>0){
    tbody.innerHTML='';
    for(var i=0;i<news.length;i++){
      if(news[i].creatorId==getCookie('user-id'))
      addRowNews(news[i]);
    }
  }

}

function filterPetitions(e){
  var btnsShop=document.getElementsByClassName("btn-petitions-filter");
  var table=document.getElementById('petitionsTable');
  var tbody=table.getElementsByTagName('tbody')[0];
  for(let i=0;i<btnsShop.length;i++){
    btnsShop[i].classList.remove("active");
  }
  e.classList.add('active');
  if(e.innerText=='All'>0){
    tbody.innerHTML='';
    for(var i=0;i<Petitions.length;i++){
      addRowPetitions(Petitions[i]);
    }
  }
  else if(e.innerText=='Active'>0){
    tbody.innerHTML='';
    for(var i=0;i<Petitions.length;i++){
      if(Petitions[i].statut=='2')
      addRowPetitions(Petitions[i]);
    }
  }
  else if(e.innerText=='Awaiting'>0){
    tbody.innerHTML='';
    for(var i=0;i<Petitions.length;i++){
      if(Petitions[i].statut=='1')
      addRowPetitions(Petitions[i]);
    }
  }
  else if(e.innerText=='Archived'>0){
    tbody.innerHTML='';
    for(var i=0;i<Petitions.length;i++){
      if(Petitions[i].statut=='5')
      addRowPetitions(Petitions[i]);
    }
  }
  else if(e.innerText=='Mine'>0){
    tbody.innerHTML='';
    for(var i=0;i<Petitions.length;i++){
      if(Petitions[i].creatorId==getCookie('user-id'))
      addRowPetitions(Petitions[i]);
    }
  }

}

function filterEvents(e){
  var btnsShop=document.getElementsByClassName("btn-events-filter");
  var table=document.getElementById('eventsTable');
  var tbody=table.getElementsByTagName('tbody')[0];
  for(let i=0;i<btnsShop.length;i++){
    btnsShop[i].classList.remove("active");
  }
  e.classList.add('active');
  if(e.innerText=='All'>0){
    tbody.innerHTML='';
    for(var i=0;i<Events.length;i++){
      addRowEvents(Events[i]);
    }
  }
  else if(e.innerText=='Active'>0){
    tbody.innerHTML='';
    for(var i=0;i<Events.length;i++){
      if(Events[i].statut=='2')
      addRowEvents(Events[i]);
    }
  }
  else if(e.innerText=='Awaiting'>0){
    tbody.innerHTML='';
    for(var i=0;i<Events.length;i++){
      if(Events[i].statut=='1')
      addRowEvents(Events[i]);
    }
  }
  else if(e.innerText=='Archived'>0){
    tbody.innerHTML='';
    for(var i=0;i<Events.length;i++){
      if(Events[i].statut=='5')
      addRowEvents(Events[i]);
    }
  }
  else if(e.innerText=='Mine'>0){
    tbody.innerHTML='';
    for(var i=0;i<Events.length;i++){
      if(Events[i].creatorId==getCookie('user-id'))
      addRowEvents(Events[i]);
    }
  }

}

function filterCandidates(e){
  var btnsShop=document.getElementsByClassName("btn-candidates-filter");
  var table=document.getElementById('candidatesTable');
  var tbody=table.getElementsByTagName('tbody')[0];
  for(let i=0;i<btnsShop.length;i++){
    btnsShop[i].classList.remove("active");
  }
  e.classList.add('active');
  if(e.innerText=='All'>0){
    tbody.innerHTML='';
    for(var i=0;i<Candidates.length;i++){
      addRowCandidates(Candidates[i]);
    }
  }
  else if(e.innerText=='Active'>0){
    tbody.innerHTML='';
    for(var i=0;i<Candidates.length;i++){
      if(Candidates[i].statut=='2')
      addRowCandidates(Candidates[i]);
    }
  }
  else if(e.innerText=='Awaiting'>0){
    tbody.innerHTML='';
    for(var i=0;i<Candidates.length;i++){
      if(Candidates[i].statut=='1')
      addRowCandidates(Candidates[i]);
    }
  }
  else if(e.innerText=='Archived'>0){
    tbody.innerHTML='';
    for(var i=0;i<Candidates.length;i++){
      if(Candidates[i].statut=='5')
      addRowCandidates(Candidates[i]);
    }
  }
  else if(e.innerText=='Mine'>0){
    tbody.innerHTML='';
    for(var i=0;i<Candidates.length;i++){
      if(Candidates[i].creator==getCookie('user-id'))
      addRowCandidates(Candidates[i]);
    }
  }

}

function filterAdhesions(e){
  var btnsShop=document.getElementsByClassName("btn-adhesions-filter");
  var table=document.getElementById('adhesionsTable');
  var tbody=table.getElementsByTagName('tbody')[0];
  for(let i=0;i<btnsShop.length;i++){
    btnsShop[i].classList.remove("active");
  }
  e.classList.add('active');
  if(e.innerText=='All'>0){
    tbody.innerHTML='';
    for(var i=0;i<Adhesions.length;i++){
      addRowAdhesions(Adhesions[i]);
    }
  }
  else if(e.innerText=='Active'>0){
    tbody.innerHTML='';
    for(var i=0;i<Adhesions.length;i++){
      if(Adhesions[i].statut=='2')
      addRowAdhesions(Adhesions[i]);
    }
  }
  else if(e.innerText=='Awaiting'>0){
    tbody.innerHTML='';
    for(var i=0;i<Adhesions.length;i++){
      if(Adhesions[i].statut=='1')
      addRowAdhesions(Adhesions[i]);
    }
  }
  else if(e.innerText=='Archived'>0){
    tbody.innerHTML='';
    for(var i=0;i<Adhesions.length;i++){
      if(Adhesions[i].statut=='5')
      addRowAdhesions(Adhesions[i]);
    }
  }
  else if(e.innerText=='Mine'>0){
    tbody.innerHTML='';
    for(var i=0;i<Adhesions.length;i++){
      if(Adhesions[i].validatorId==getCookie('user-id'))
      addRowAdhesions(Adhesions[i]);
    }
  }

}

function filterUsers(e){
  var btnsShop=document.getElementsByClassName("btn-users-filter");
  var table=document.getElementById('usersTable');
  var tbody=table.getElementsByTagName('tbody')[0];
  for(let i=0;i<btnsShop.length;i++){
    btnsShop[i].classList.remove("active");
  }
  e.classList.add('active');
  if(e.innerText=='All'>0){
    tbody.innerHTML='';
    for(var i=0;i<Users.length;i++){
      addRowUsers(Users[i]);
    }
  }
  else if(e.innerText=='Active'>0){
    tbody.innerHTML='';
    for(var i=0;i<Users.length;i++){
      if(Users[i].statut=='2')
      addRowUsers(Users[i]);
    }
  }
  else if(e.innerText=='Awaiting'>0){
    tbody.innerHTML='';
    for(var i=0;i<Users.length;i++){
      if(Users[i].statut=='1')
      addRowUsers(Users[i]);
    }
  }
  else if(e.innerText=='Archived'>0){
    tbody.innerHTML='';
    for(var i=0;i<Users.length;i++){
      if(Users[i].statut=='5')
      addRowUsers(Users[i]);
    }
  }
  else if(e.innerText=='Mine'>0){
    tbody.innerHTML='';
    for(var i=0;i<Users.length;i++){
      if(Users[i].creatorId==getCookie('user-id'))
      addRowUsers(Users[i]);
    }
  }

}

function wipeTable(table){
  table.getElementsByTagName('tbody')[0].innerHTML='';
}
function wipeSelect(selectElement){
  var i, L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}
function add_option(select,type,name) {
  var optgrs=select.getElementsByTagName('OPTGROUP');
  for(let i=optgrs.length-1;i>=0;i--){
    if(optgrs[i].label==type){
      var gr = optgrs[i];
      opt = document.createElement('OPTION');
      opt.textContent = name;
      gr.appendChild(opt);
      break;
    }
  }
}
function download (data,device) {
  var act=Math.floor(Date.now()/1000);
  var cat_date= timeConverter(act);
  var filename='report_'+device.code+'_'+cat_date+'.csv';
	const blob = new Blob([data], { type: 'text/csv' });
	const url = window.URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.setAttribute('href', url)
	a.setAttribute('download', filename);
	a.click()
}
function csvmaker (data) {
	csvRows = [];
	const headers = Object.keys(data[0]);
	csvRows.push(headers.join(','));
  data.forEach((dat)=>{
    const values = Object.values(dat).join(',');
    csvRows.push(values);
  });
	return csvRows.join('\n')
}
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
function dateIsValid(dateString)
{
    // First check for the pattern
    if(!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}
function downloadFile(){ //download report
  var maxtime,mintime;
  var start=document.getElementById('start_date_reports');
  var end=document.getElementById('end_date_reports');
  start.style.borderColor='transparent';
  end.style.borderColor='transparent';
  if(document.getElementById("24h_reports").checked==true){
    maxtime=Math.floor(Date.now() / 1000);
    mintime=maxtime-84600;
  }
  else{
    if(dateIsValid(start.value) && dateIsValid(end.value) && date_timestamp(start.value)<date_timestamp(end.value)){
      maxtime=date_timestamp(end.value);
      mintime=date_timestamp(start.value);
    }
    else{
      start.style.borderColor='red';
      end.style.borderColor='red';
    }
  }
  if(maxtime!=null){
    var report=[];
    devices.forEach((device) => {
      if(device.code==select_device_tracking.value){
        var rsortedDatas=device.datas.sort(function(a, b){return a.time-b.time});
        for(let i=0;i<rsortedDatas.length;i++){
          if(rsortedDatas[i].time>=mintime && rsortedDatas[i].time<=maxtime){
            var row={};
            row.Username=getCookie('username'); //Username
            row.DeviceCode=device.code; //device.code
            row.DeviceID=device.id; //device.ID
            row.DeviceType=device.attached_device_type; //device.type
            row.Battery=rsortedDatas[i].batterie; //batterie
            row.Date=rsortedDatas[i].date_time; //date_time
            row.Latitude=rsortedDatas[i].latitude; //latitude
            row.Longitude=rsortedDatas[i].longitude; //longitude
            row.Speed=rsortedDatas[i].speed; //speed
            row.TimeStamp=rsortedDatas[i].time; //timeStamp 
            report.push(row);
          }
        }
        
        console.log("pushs report ",report.length);
        var csvdata = csvmaker(report);
        download(csvdata,device);
      }
    });

  }
  
}
function refresh_devices_tab(){
  wipeTable(tab_devices);
  wipeSelect(select_device_reports);
  wipeSelect(select_device_tracking);
  devices.forEach(device => {
    addRow(tab_devices,device,true);
    add_option(select_device_reports,device.attached_device_type,device.code);
    add_option(select_device_tracking,device.attached_device_type,device.code);
  });
} 
function refresh_track_tab(){
  wipeTable(tab_tracking);
  devices.forEach(device => {
    if(device.code==select_device_tracking.value)
    addRow(tab_tracking,device);
  });
} 
function refresh_reports_tab(){
  wipeTable(tab_reports);
  devices.forEach(device => {
    if(device.code==select_device_reports.value)
    addRow(tab_reports,device);
  });
} 
var files = [];

function setProfile(button){
  var errort=document.getElementById('error');
  var progressbar3=document.getElementById('progress3');
  var Fname=document.getElementById('FirstName');
  var Lname=document.getElementById('LastName');
  var Password=document.getElementById('floatingPassword');
  var PasswordConfirm=document.getElementById('floatingPasswordConfirm');
  progressbar3.style.visibility="visible";

  if(Password.value==PasswordConfirm.value && Password.value!="" && Password.value!=null){
    if (Fname.value=="" || Lname.value=="") {
      Fname.style.borderColor="red";
      Lname.style.borderColor="red";
    }
    else{
      if(files.length!=0){
        var name = +new Date() + "-" + files[0].name;
        const metadata = {
            contentType: files[0].type
        };
        var storage = firebase.storage().ref('/images/'+name);
        //upload file
        var upload = storage.put(files[0],metadata);
        //update progress bar
        upload.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url);
            document.querySelector("#profileImage").src = url;
            db.collection("User").doc(user_key).set({
              nom : Lname.value,
              prenom : Fname.value,
              email : usermail,
              photo : url,
              password : Password.value
            })
            .then(() => {
              button.style.borderColor="green";
              progressbar3.style.visibility="hidden";
              signOut();
            })
            .catch((error) => {
              errort.innerHTML="Error while setting profile , Please try again !";
              errort.style.color="red";
              progressbar3.style.visibility="hidden";
              console.error;
            });
        })
        .catch((error) => {
          errort.innerHTML="Error while setting profile , Please try again !";
          errort.style.color="red";
          progressbar3.style.visibility="hidden";
          console.error;
        });
      }
      else{
        db.collection("User").doc(user_key).set({
          nom : Lname.value,
          prenom : Fname.value,
          password : Password.value,
          email : usermail,
          photo : userphoto
        })
        .then(() => {
          button.style.borderColor="green";
          progressbar3.style.visibility="hidden";
          signOut();
        })
        .catch((error) => {
          errort.innerHTML="Error while setting profile , Please try again !";
          errort.style.color="red";
          progressbar3.style.visibility="hidden";
          console.error;
        });
      }
    }
  }
  else if(Password.value!=PasswordConfirm.value){
    Password.style.borderColor="red";
    PasswordConfirm.style.borderColor="red";
  }
  else if(Fname.value!="" && Lname.value!="" && Password.value==PasswordConfirm.value && files.length!=0){
    var name = +new Date() + "-" + files[0].name;
    const metadata = {
        contentType: files[0].type
    };
    var storage = firebase.storage().ref('/images/'+name);
    //upload file
    var upload = storage.put(files[0],metadata);
    //update progress bar
    upload.then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
        console.log(url);
        document.querySelector("#profileImage").src = url;
        console.log('user_key : ',user_key);
        db.collection("User").doc(user_key).set({
          nom : Lname.value,
          prenom : Fname.value,
          photo : url,
          email : usermail,
          password : userpass
        })
        .then(() => {
          button.style.borderColor="green";
          progressbar3.style.visibility="hidden";
          signOut();
        })
        .catch((error) => {
          errort.innerHTML="Error while setting profile , Please try again !";
          errort.style.color="red";
          progressbar3.style.visibility="hidden";
          console.error("Error writing document: ", error);
        });
    })
    .catch((error) => {
      errort.innerHTML="Error while setting profile , Please try again !";
      errort.style.color="red";
      progressbar3.style.visibility="hidden";
      console.error("Error writing document: ", error);
    });
  }
  else if(Fname.value!="" && Lname.value!="" && Password.value==PasswordConfirm.value && files.length==0){
    db.collection("User").doc(user_key).set({
      nom : Lname.value,
      prenom : Fname.value,
      photo : userphoto,
      email : usermail,
      password : userpass
    })
    .then(() => {
      button.style.borderColor="green";
      progressbar3.style.visibility="hidden";
      signOut();
    })
    .catch((error) => {
      errort.innerHTML="Error while setting profile , Please try again !";
      errort.style.color="red";
      progressbar3.style.visibility="hidden";
      console.log('error :',error);
      console.error;
    });
  }
  else if(files.length!=0){
    var name = new Date() + "-" + files[0].name;
    const metadata = {
        contentType: files[0].type
    };
    var storage = firebase.storage().ref('/images/'+name);
    //upload file
    var upload = storage.put(files[0],metadata);
    //update progress bar
    upload.then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
        console.log(url);
        document.querySelector("#profileImage").src = url;
        db.collection("User").doc(user_key).set({
          photo : url,
          email : usermail,
          password : userpass,
          prenom : userpre,
          nom : username
        })
        .then(() => {
          button.style.borderColor="green";
          progressbar3.style.visibility="hidden";
          signOut();
        })
        .catch((error) => {
          errort.innerHTML="Error while setting profile , Please try again !";
          errort.style.color="red";
          progressbar3.style.visibility="hidden";
          console.log('error :',error);
          console.error;
        });
    })
    .catch((error) => {
      errort.innerHTML="Error while setting profile , Please try again !";
      errort.style.color="red";
      progressbar3.style.visibility="hidden";
      console.error;
    });
  }
  
}

function addGalleryWidget(photo){
  const sitediv = document.getElementById('gallery');
  const wkdiv = sitediv.getElementsByClassName('row')[0]
  var url=''+photo.image
  if(url.indexOf('.mp4')>0){
    wkdiv.innerHTML+='<div class="col-md-12 col-lg-6 col-xl-4">'
      +'<div class="card mb-2">'
        +'<img class="card-img-top" src="'+API_URL+photo.image.replace('mp4','jpg').replace('images','thumbs')+'" alt="video" height=250>'
        +'<div class="card-img-overlay d-flex flex-column justify-content-center">'
          +'<h5 class="card-title text-white mt-5 pt-2">'+photo.description+'</h5>'
          +'<button class="btn btn-dark w-40" style="margin-right: 10px" onclick="playvideo(\''+photo.image+'\',\''+photo.description.replaceAll('\'','**')+'\')"><span data-feather="play"></span> Play</button>'
          +'<button class="btn btn-danger  w-40" style="margin-right: 10px" onclick="setStatus('+photo.id+',"photo","5")"><span data-feather="archive"></span> Archive</button>'
        +'</div>'
      +'</div>'
    +'</div>'
  }
  else
  wkdiv.innerHTML+='<div class="col-md-12 col-lg-6 col-xl-4">'
    +'<div class="card mb-2">'
      +'<img class="card-img-top" src="'+API_URL+photo.image+'" alt="Photo"  height=250>'
      +'<div class="card-img-overlay d-flex flex-column justify-content-center">'
        +'<h5 class="card-title text-white mt-5 pt-2">'+photo.description+'</h5>'
        +'<button class="btn btn-danger  w-40" style="margin-right: 10px" onclick="setStatus('+photo.id+',"photo","5")"><span data-feather="archive"></span> Archive</button>'
      +'</div>'
    +'</div>'
  +'</div>'
}

function playvideo(fname,title){
  window.location.replace("playvideo.html?file="+fname+"&title="+title.replaceAll('**','\''));
}

function refreshGallery(){
  $('#gallery .row').innerHTML+=''
  Gallery.forEach(element => {
    addGalleryWidget(element)
  });
}

function addMiniGalleryWidget(photo,position){
  const sitediv = document.getElementById('site');
  const wkdiv = sitediv.getElementsByClassName('smallgallery')[0]
  wkdiv.innerHTML+='<div class="col-md-6 col-lg-6 col-xl-2">'
    +'<div class="card mb-2 bg-gradient-dark">'
      +'<img class="card-img-top " id=minigallery-'+position+' src="'+API_URL+photo.bigPhoto+'" height="150" width="150" alt="mini photo">'
      +'<div class="card-img-overlay d-flex flex-column justify-content-center">'
        +'<h5 class="card-title text-white mt-5 pt-2"></h5>'
        +'<p class="card-text text-white pb-2 pt-1"></p>'
        +'<div>'
        +  '<a class="btn btn-primary" href="photo.html?type=small&id='+position+'"><span data-feather="edit"></span> Change </a>'
        +'</div>'
      +'</div>'
    +'</div>'
  +'</div>'
}

function addBannerWidget(banner){
  const sitediv = document.getElementById('site');
  const wkdiv = sitediv.getElementsByClassName('banners')[0]
  wkdiv.innerHTML+='<div class="col-md-12 col-lg-6 col-xl-4">'
    +'<div class="card mb-2 bg-gradient-dark">'
      +'<img class="card-img-top" src="'+API_URL+banner.bigPhoto+'" alt="Dist Photo 1">'
      +'<div class="card-img-overlay d-flex flex-column justify-content-center">'
        +'<h5 class="card-title text-white mt-5 pt-2">'+banner.bigText+'</h5>'
        +'<p class="card-text text-white pb-2 pt-1">'+banner.smallText+'</p>'
        +'<div>'
        +  '<a class="btn btn-primary" href="photo.html?type=banner&id='+banner.position+'"><span data-feather="edit"></span> Set </a>'
        +'</div>'
      +'</div>'
    +'</div>'
  +'</div>'
}

function addPromisesWidget(promise){
  const sitediv = document.getElementById('site');
  const wkdiv = sitediv.getElementsByClassName('promises')[0]
  wkdiv.innerHTML+='<div class="col-md-12 col-lg-6 col-xl-4">'
    +'<div class="card mb-2 bg-gradient-dark">'
      +'<img class="card-img-top" src="'+API_URL+promise.image+'" alt="Dist Photo 1">'
      +'<div class="card-img-overlay d-flex flex-column justify-content-center">'
        +'<h5 class="card-title text-white mt-5 pt-2">'+promise.text+'</h5>'
        +'<div>'
        +  '<a class="btn btn-primary" href="promise.html?type=banner&id='+promise.id+'"><span data-feather="edit"></span> Set </a>'
        +'</div>'
      +'</div>'
    +'</div>'
  +'</div>'
}

function addBigImagessWidget(big){
  const sitediv = document.getElementById('site');
  const wkdiv = sitediv.getElementsByClassName('bigphotos')[0]
  wkdiv.innerHTML+='<div class="col-md-12 col-lg-6 col-xl-4">'
    +'<div class="card mb-2 bg-gradient-dark">'
      +'<img class="card-img-top" src="'+API_URL+big.image+'"  height="150" alt="Dist Photo 1">'
      +'<div class="card-img-overlay d-flex flex-column justify-content-center">'
        +'<div>'
        +  '<a class="btn btn-primary" href="photo.html?type=big&id='+big.id+'"><span data-feather="edit"></span> Change </a>'
        +'</div>'
      +'</div>'
    +'</div>'
  +'</div>'
}

function addBigvideoWidget(video){
  const sitediv = document.getElementById('site');
  const wkdiv = sitediv.getElementsByClassName('bigvideo')[0]
  wkdiv.innerHTML='<div class="card mb-2">'
    +'<div>'
    +  '<a class="btn btn-primary float-right" href="photo.html?type=video"><span data-feather="edit"></span> Change </a>'
    +'</div>'
    +  '<video class="card-img-top" src="'+API_URL+video+'" alt="Big video" autoplay controls muted>'
    +'</div>'
}

function setsmallGallery(input,position) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = async function (e) {
      let fileurl = await upload(input);
      if(fileurl!='' && await setPhoto({position:position+'',image:fileurl},'SmallGallery'))
        $('#minigallery-'+position).attr('src', MEDIA_URL+fileurl);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

async function loadmoreImage(){
  document.getElementById('progressloadImages').style.visibility='visible';
  var previousLength=Gallery.length
  Gallery = await fetch_gallery(previousLength);
  Gallery.forEach((element,index) => {
    if(index>previousLength)
    addGalleryWidget(element);
  });
  
  document.getElementById('progressloadImages').style.visibility='hidden';

}

async function loadmoreEvents(){
  document.getElementById('progressloadEvents').style.visibility='visible';
  var previousLength=Events.length
  await fetch_events(previousLength);
  var idx=0;
  for(var i=1;i<document.getElementsByClassName('btn-events-filter').length;i++)
  {
    if(document.getElementsByClassName('btn-events-filter')[i].classList.contains('active'))
      idx=i;

  }
  filterEvents(document.getElementsByClassName('btn-events-filter')[idx])
  document.getElementById('progressloadEvents').style.visibility='hidden';

}

async function loadmorePetitions(){
  document.getElementById('progressloadPetitions').style.visibility='visible';
  var previousLength=Petitions.length
  await fetch_petitions(previousLength);
  var idx=0;
  for(var i=1;i<document.getElementsByClassName('btn-petitions-filter').length;i++)
  {
    if(document.getElementsByClassName('btn-petitions-filter')[i].classList.contains('active'))
      idx=i;

  }
  filterPetitions(document.getElementsByClassName('btn-petitions-filter')[idx])
  document.getElementById('progressloadPetitions').style.visibility='hidden';

}

async function loadmoreNews(){
  document.getElementById('progressloadNews').style.visibility='visible';
  var previousLength=News.length
  await fetch_news(previousLength);
  var idx=0;
  for(var i=0;i<document.getElementsByClassName('btn-news-filter').length;i++)
  {
    if(document.getElementsByClassName('btn-news-filter')[i].classList.contains('active'))
      idx=i;

  }
  filterNews(document.getElementsByClassName('btn-news-filter')[idx])
  document.getElementById('progressloadNews').style.visibility='hidden';

}

async function loadmoreCandidates(){
  document.getElementById('progressloadCandidates').style.visibility='visible';
  var previousLength=Candidates.length
  await fetch_candidates(previousLength);
  var idx=0;
  for(var i=0;i<document.getElementsByClassName('btn-candidates-filter').length;i++)
  {
    if(document.getElementsByClassName('btn-candidates-filter')[i].classList.contains('active'))
      idx=i;

  }
  filterCandidates(document.getElementsByClassName('btn-candidates-filter')[idx])
  document.getElementById('progressloadCandidates').style.visibility='hidden';

}

async function loadmoreProducts(){
  document.getElementById('progressloadProducts').style.visibility='visible';
  if(document.getElementsByClassName('btn-shop-filter')[0].classList.contains('active')){
    var previousLength=Products.length
    await fetch_Shopitems(previousLength);
    showSellsCard(document.getElementsByClassName('btn-shop-filter')[0])
  }
  else{
    var idx=1;
    for(var i=1;i<document.getElementsByClassName('btn-shop-filter').length;i++)
    {
      if(document.getElementsByClassName('btn-shop-filter')[i].classList.contains('active'))
        idx=i;

    }
    var previousLength=Orders.length
    await fetch_Shoplists(previousLength);
    showSellsCard(document.getElementsByClassName('btn-shop-filter')[idx])

  }
  document.getElementById('progressloadProducts').style.visibility='hidden';

}

async function loadmoreAdhesions(){
  document.getElementById('progressloadAdhesions').style.visibility='visible';
  var previousLength=Adhesions.length
  await fetch_adhesions(previousLength);
  var idx=0;
  for(var i=0;i<document.getElementsByClassName('btn-adhesions-filter').length;i++)
  {
    if(document.getElementsByClassName('btn-adhesions-filter')[i].classList.contains('active'))
      idx=i;

  }
  filterAdhesions(document.getElementsByClassName('btn-adhesions-filter')[idx])
  document.getElementById('progressloadAdhesions').style.visibility='hidden';

}

async function loadmoreUsers(){
  document.getElementById('progressloadUsers').style.visibility='visible';
  var previousLength=Users.length
  await fetch_users(previousLength);
  var idx=0;
  for(var i=0;i<document.getElementsByClassName('btn-users-filter').length;i++)
  {
    if(document.getElementsByClassName('btn-users-filter')[i].classList.contains('active'))
      idx=i;

  }
  filterUsers(document.getElementsByClassName('btn-users-filter')[idx])
  document.getElementById('progressloadUsers').style.visibility='hidden';

}

function openNews(id){
  window.location.replace("article.html?id="+id);
}

function openCandidate(id){
  window.location.replace("candidate.html?id="+id);
}

function openEvent(id){
  window.location.replace("event.html?id="+id);
}

function openAdhesion(id){
  window.location.replace("adhesion.html?id="+id);
}

function openOrder(id){
  window.location.replace("shoplist.html?id="+id);
}

function openPetition(id){
  window.location.replace("petition.html?id="+id);
}

function openProduct(id){
  window.location.replace("shopitem.html?id="+id);
}
