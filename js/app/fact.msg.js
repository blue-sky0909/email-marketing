meApp.factory('msgFact', function(toastr) {
	var notification;

	toastr.options = {
		"closeButton": true,
		"positionClass": "toast-bottom-right",
		"timeOut": "3000"
	};

	notification = function(message, type) {
		return toastr[type](message);
	};

	return {
		success: function(message) {
			notification(message, 'success');
		},
		info: function(message) {
			notification(message, 'info');
		},
		error: function(message) {
			notification(message, 'error');
		}
	};
});