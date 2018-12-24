///// npm install edge-sql

var express = require('express');
var app = express();
var edge = require('edge-js');

//var connectionStr = "Data Source=DOLEV_MAIN\\SQLEXPRESS;Database=GUM;Integrated Security=True";

var connectionStr="Server=tcp:gum.database.windows.net,1433;Initial Catalog=GUM_DB;Persist Security Info=False;User ID=GUM;Password=GISRAELUM!1!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30";

var SourceByParam = "SELECT";
var port = process.env.PORT || 1337;


app.get('/', function (request, response) {
    
    var operation = request.query.action;
	var Param = request.query.Param;
	var PArr = Param.split(' ');

	switch(operation) {
		
		case "SelectOne": SourceByParam =  "SELECT * FROM Clients WHERE [CustId] = '" + Param + "'"; break;
		case "SelectAllClients" : SourceByParam =  "SELECT * FROM Clients"; break;
		case "CheckLogin" : SourceByParam =  "Select CustId, FirstName,PricePerUnit From Clients Where [Email] = '" + PArr[0] + "' and [Password] = '" + PArr[1] + "'"; break;
		case "CheckWorkerLogin" : SourceByParam =  "Select TechId, FirstName From Technician Where [Email] = '" + PArr[0] + "' and [Password] = '" + PArr[1] + "'"; break;
		case "GutGUMInfo" : SourceByParam = "Select [GUM'S_Informartiom] from Info"; break;
		case "UserUpdate" : SourceByParam = "UPDATE Clients SET Clients.CustId = " + "'" + PArr[0] + "'" + ",Clients.FirstName = " + "'" + PArr[1] + "'" + " ,Clients.LastName = " + "'" + PArr[2] + "'" + " ,Clients.Password = " + "'" + PArr[3] + "'" + " ,Clients.Email=" + "'" + PArr[4] + "'" + " ,Clients.Id= '" + PArr[5] + "',Clients.Phone = " + "'" + PArr[6] + "'" + ",Clients.Bday = " + "'" + PArr[7] + "'" + ",Clients.Bmonth = " + "'" + PArr[8] + "'" + ",Clients.Byear = " + "'" + PArr[9] + "'" + ",Clients.ProductId = " + "'" + PArr[10] + "'" + ",Clients.TechnicianId = " + "" + PArr[11] + "" + " WHERE Clients.CustId=" + "'" + PArr[0] + "'"; break;
		case "RegistUser" :	SourceByParam = "INSERT INTO Clients ([CustId],[FirstName],[LastName],[Password],[Email],[Id],[Phone],[Bday],[Bmonth],[Byear],[ProductId],[TechnicianId],[JoinDate],[PricePerUnit]) VALUES ('"+PArr[0]+"','" + PArr[1]+"','" + PArr[2]+ "','" + PArr[3]+"','"+PArr[4]+"','"+PArr[5]+"','"+PArr[6]+"','"+PArr[7]+"','"+PArr[8]+"','"+PArr[9]+"','"+PArr[10]+"','"+PArr[11]+"','"+getDateTime()+"','" + PArr[12] + "')"; break;
		case "Get10TopPressure" : SourceByParam = "SELECT TOP (10) [ProductId],[CustomerId],[Pressure],[Time] FROM [Pressure] where CustomerId = '" + Param +"'" + "order by Time desc";	break;
		case "Get10TopOnlyPressure" : SourceByParam = "SELECT TOP (10) [Pressure] FROM [Pressure] where CustomerId = '" + Param +"'" + "order by Time desc";	break;
		case "Get1TopPressure" : SourceByParam = "SELECT TOP (1) [Pressure] FROM [Pressure] where CustomerId = '" + Param +"'" + "order by Time desc";	break;
		case "Get10TopMeasure" : SourceByParam = "SELECT TOP (10) Measure FROM [GasMeasure] where CustomerId = '" + Param +"'" + "order by RefreshTime desc";	break;
		case "Get10TopTemperature" : SourceByParam = "SELECT TOP (10) [ProductId],[CustomerId],[temp],[Time] FROM [Temperature] where CustomerId = '" + Param +"'" + "order by Time desc"; break;
		case "CheckLastValve" : SourceByParam =  "Select TOP (1) [IsOpen] From Valve Where [CustomerId] = '" + PArr[0] + "'" + "order by Time desc"; break;
		case "GetPricePerUnit" : SourceByParam = "SELECT PricePerUnit FROM Clients where CustId = '" + Param + "'"; break;
		case "GetEmail" : SourceByParam = "SELECT Email FROM Clients where CustId = '" + Param + "'"; break;
		case "Get1TopMeasure" : SourceByParam = "SELECT TOP (1) Measure FROM [GasMeasure] where CustomerId = '" + Param +"'" + "order by RefreshTime desc";	break;
		case "AddNewGasMeter" : SourceByParam =  "INSERT INTO  ([ProductId] ,[CustomerId],[IsOn] ,[IP] ,[MACAddress],[RefreshTime]) VALUES('" + PArr[0] + "','" + PArr[1] + "','0','" +  PArr[2] + "','" + PArr[3] + "','" + getDateTime() + "')"; break;
	
		case "SensoresInfoLeakSensor" : SourceByParam =  "INSERT INTO LeakSensor ([ProductId],[CustomerId],[IsDetect],[Time]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "'," + PArr[2] + ",'" + getDateTime() + "')" ; break
	    case "SensoresInfoTemperature" :  SourceByParam = "INSERT INTO Temperature ([ProductId],[CustomerId],[temp],[Time]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "','" + PArr[2] + "','" + getDateTime() + "')"; break;
        case "SensoresInfoValve"  :  SourceByParam = "INSERT INTO Valve ([ProductId],[CustomerId],[IsOpen],[Time]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "','" + PArr[2] + "','" + getDateTime() + "')"; break ; 
		case "SensoresInfoGasMeasure" : SourceByParam = "INSERT INTO GasMeasure  ([ProductId],[CustomerId],[Measure],[RefreshTime]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "','" + PArr[2] + "','" + getDateTime() + "')"; break;
 		case "SensoresInfoPressure" : SourceByParam = "INSERT INTO Pressure  ([ProductId],[CustomerId],[Pressure],[Time]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "','" + PArr[2] + "','" + getDateTime() + "')"; break;
		
		case "ArduinoInfo" : SourceByParam = 
		// http://localhost:12345/?action=ArduinoInfo&Param=1 00001 0 27.5 01 0556 253 -> [2] = leak, [3] = temp, [4] = valve, [5] = measure, [6] = Pressure
		 "INSERT INTO LeakSensor ([ProductId],[CustomerId],[IsDetect],[Time]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "'," + PArr[2] + ",'" + getDateTime() + "')" 
		 +
		 "INSERT INTO Temperature ([ProductId],[CustomerId],[temp],[Time]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "','" + PArr[3] + "','" + getDateTime() + "')"
		 +
		 "INSERT INTO Valve ([ProductId],[CustomerId],[IsOpen],[Time]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "','" + PArr[4] + "','" + getDateTime() + "')"
		 +
		 "INSERT INTO GasMeasure  ([ProductId],[CustomerId],[Measure],[RefreshTime]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "','" + PArr[5] + "','" + getDateTime() + "')"
		 +
		 "INSERT INTO Pressure  ([ProductId],[CustomerId],[Pressure],[Time]) VALUES ('" + PArr[0] + "','" +  PArr[1] + "','" + PArr[6] + "','" + getDateTime() + "')"; break
		 
		case "GetPhoneNumByProduct" : SourceByParam =  "SELECT [Phone] FROM Clients WHERE [ProductId] = " + Param; break;

		case "DailyConsumption" : SourceByParam = "SELECT Measure FROM [GasMeasure] where (CONVERT (date, RefreshTime)) = (CONVERT (date, SYSDATETIME())) and CustomerId = '" + Param + "'"; break;
		case "MonthlyConsumption" : SourceByParam = "SELECT TOP (1) Measure FROM [GasMeasure]  where CustomerId = '" + Param + "' order by RefreshTime desc "; break;
		default : SourceByParam = "";
	}
	

  

  
		Param = {
            connectionString: connectionStr,
            source: SourceByParam
        };

		
	console.log(getDateTime() + " " + operation + " " + PArr[0] );

  
    var getData = edge.func('sql', Param);

	response.setHeader("Access-Control-Allow-Origin", "*");
	console.log(getData);
    
    getData(null, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log(result);
			  var temp = JSON.stringify(result);
			response.json(temp);
          
        }
        else {
            console.log("No results");
        }
    });
});

 function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }

       
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute;   
     return dateTime;
}
server.listen(port);
//app.listen(port);
console.log('Server running on port ' + port);
