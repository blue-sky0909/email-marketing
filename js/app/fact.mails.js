meApp.factory("mailsFact", ['$http', function($http){
	var obj = {};
	
	obj.getDefaultMails = function() {
		return $http.get('resources/default-mails.json');
	};

	obj.getColorPalettes = function() {
		return $http.get('resources/color-palettes.json');
	};
	
	obj.getRequestedMail = function(id) {
		var url = "https://cloud.directiq.com/integration/editor/editor.aspx";
		var data;

		data = {method:'Get',id:id };
		return $http({
			url: url,
			method: 'POST',
			data: data,
			cache : false , 
			processData: false , 
			contentType : false
		});
	};

	obj.saveMail = function(id, title, subject, data , htmldata) {
		var url = "https://cloud.directiq.com/integration/editor/editor.aspx";
		var resp_data;
		if (id)  {
			resp_data = {title: title, subject: subject, data: JSON.stringify(data), method:'Save' , htmldata: htmldata,id:id };
		}
		else {
			resp_data = {title: title, subject: subject, data: JSON.stringify(data), method:'Save' , htmldata: htmldata,Name:title};
		}
			
		return $http({
			url: url,
			method: 'POST',
			data: resp_data , 
			cache : false ,
			processData: false , 
			contentType:false
		})
	};

	obj.SendTest = function( recipient , subject , data ) {
		var resp_data = {recipient: recipient, subject: subject ,data: data , method: "SendTest"};
		return $http({url: "https://cloud.directiq.com/integration/editor/editor.aspx",method: 'POST',data: resp_data, cahce: false , contentType: false,processData: false});
	}

	return obj; 	
}]);