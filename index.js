var express    = require('express');
var mysql   = require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'mani',
        database: 'road'
    }); 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }});
var owner=
 [
	 {	oname: 'madhu',
	 	password: '123456'
	 },
	 {	oname: 'kiran',
	 	password: '123456'
	 }
];
var doctor=
 [
	 {	dname: 'madhu',
	 	password: '123456'
	 },
	 {	dname: 'kiran',
	 	password: '123456'
	 }
];


app.get('/ologin',function(req,res){
	res.sendFile(__dirname +'/public/ownerlogin.html');
})

app.get('/newcars',function(req,res){
	var model=req.query.model;
	var engine=req.query.engine;
	var color=req.query.color;
	n={model:model,engine:engine,color:color}
	connection.query('insert into car set ?',n,function(err,rows)
	{   
		res.render('success_in',{});
	})

})


app.get('/ologincheck',function(req,res){
	var cuser=req.query.username;
	var cpass=req.query.password;
	connection.query('select * from ownerreg where oname= ?',cuser,function(err,result){
        console.log(cuser+'test');
        console.log(result[0].password+'test');
		if(cpass==result[0].password)
			{	connection.query('select * from buyer,car,booked where car.Cid=booked.Cid and booked.oid=buyer.oid and owner_name=?',cuser , function(err,  rows ,fields) 
				{	console.log(rows);
					if(rows.length!=0)
					res.render('ownerpage',{username:rows});
				else
				{connection.query('select * from buyer where owner_name=?',cuser,function(err,rows){
					res.render('ownerpage2',{username:rows});
				})
					
				}
				});
		}
			else
			res.sendFile(__dirname +'/public/error.html');	
	})
});




app.get('/book',function(req,res){
var username=req.query.id;
console.log(username);

connection.query('select * from car' , function(err,  rows ,fields) 
 	{
var hel=[{cars:rows},{username:username}];
console.log(hel[1].username);
console.log(hel);
		res.render('book',{hello:hel});
	}); 				
});

app.post('/book',function(req,res){
var username=req.query.id;
var carname=req.body.cname;
var color=req.body.color;
console.log(carname+"cname");
console.log(username+"username");
connection.query('select OID from buyer where owner_name=?',username,function(err,result,fields)
{
	console.log(result[0].OID);
connection.query('select * from car where model =?',carname,function(err,rows,fields)
{
	console.log(rows[0].CID);

var o={OID:result[0].OID,CID:rows[0].CID}	;
connection.query('insert into booked set ?', o, function (err, rows) {
	
 res.render('success',{username:username,carname:carname});
});

})	

})
			
});

app.post("/createowner",function(req,res){
	var a=req.body.username;
	var b=req.body.password;
	var c=req.body.pet;
	var e=req.body.address;
	var f=req.body.city;
	var g=req.body.age;
	console.log(a);
	console.log(owner);
	var o={
			owner_name:a,pet_name:c,Address:e,City:f,Age:g
	};
	var p={
		oname:a,password:b
	}
	connection.query('insert into ownerreg set ?',p,function(err,result){
console.log(result);
console.log(result+"success");
	})
connection.query('insert into buyer set ?', o, function (err, result) {
	if(err)
		throw err;
  console.error(result);
  res.sendFile(__dirname +'/public/ownerlogin.html');
  
});

})

app.listen(3000);
console.log("Express server listening on port 3000 ");