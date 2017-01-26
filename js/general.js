function collectionHas(a, b) {
	for(var i = 0, len = a.length; i < len; i ++) {
		if(a[i] == b) return true;
	}
	return false;
}

function findParentBySelector(elm, selector) {
	var all = document.querySelectorAll(selector);
	var cur = elm.parentNode;
	while(cur && !collectionHas(all, cur)) {
		cur = cur.parentNode;
	}
	return cur;
}

function get_currentTime() {
	var dateobj = new Date();
	var dd = dateobj.getDate();
	var mm = dateobj.getMonth() + 1;
	var yyyy = dateobj.getFullYear();
	var s = dateobj.getSeconds();
	var m = dateobj.getMinutes();
	var h = dateobj.getHours();

	if (s < 10) s = '0' + s;
	if (m < 10) m = '0' + m;
	if (h < 10) h = '0' + h;
	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	return yyyy + "." + mm + "." + dd + "_" + h + "." + m + "." + s;
}