meApp.controller('editTemplateCtrl', function ($http,$interval,$window,$scope, $rootScope, $state, $stateParams, $uibModal, $timeout, $sce, localStorageService, mailsFact, msgFact) {

	$interval(function() {
		var url = "http://cloud.directiq.com/integration/editor/KeepAlive.aspx";
		$http({
			url: url,
			method: 'POST',
			cache : false ,
			processData: false , 
			contentType:false
		});
	          }, 100 * 300);

	$scope.edit_pnl_tpls_resource = 'partials/editTemplate/editProperties/';

	$scope.mailHasChanged = false;

	$scope.mailTitle = '';
	$scope.debugMode = debugMode;
	$scope.codeEditor = '';
	$scope.initMailSettings = "";
	$scope.init_tblElements = "";
	
	var contentTypes = ['cnt_text','cnt_image','cnt_button','cnt_social','cnt_divider', 'cnt_html'];

	$scope.colorPalettes = [];
	mailsFact.getColorPalettes().success(function(response) {
		$scope.colorPalettes = response;
	});
	
	$scope.exit = function() {
		console.log($state.get('editTemplate').data.dropzone);
		if ($state.get('editTemplate').data.dropzone) {
			if ($scope.inittpl_bodyStyles != JSON.stringify($scope.mailSettings.tpl_bodyStyles) || $scope.initDropZoneElements != JSON.stringify($scope.dropzoneElements) ) {
				if (confirm("Do you want to save changes?") == true) {
					$scope.open_saveModal(1);
					return;
				} 

			}
		}
		$window.location.href = "http://cloud.directiq.com/template-library.aspx";
	}

	$scope.change_colorTheme = function() {
		$scope.mailSettings.tpl_bodyStyles.container.backgroundColor = $scope.colorTheme.bodyBgColor;
		$scope.mailSettings.tpl_bodyStyles.content.backgroundColor = $scope.colorTheme.contentBgColor;
		$scope.mailSettings.tpl_bodyStyles.content.color = $scope.colorTheme.fontColor;
		$scope.mailSettings.tpl_bodyStyles.content.linkColor = $scope.colorTheme.linkColor;
	};
	
	$scope.$watch('mailSettings.tpl_bodyStyles', function(bodyStyles, oldValue) {
		if(localStorageService.isSupported) {
			if (bodyStyles != oldValue) {
				localStorageService.set('last_bodyStyles', bodyStyles);
			}
		}
	}, true);

	$scope.editPanelTpl = {type: false, url: false};

	$scope.proColumns = {column_0:true};

	$scope.numPilotOpts = {
		min: 0,
		max: 5000,
		step: 1
	};

	$scope.numSlider = {
		// min: 100,
		max: 900,
		floor: 450,
		ceil: 900, // 600-700 for html email standard
		step: 1,
		showTicks: true,
		showTicksValue: true,
		alwaysShowBar: true
	};
	$scope.widthTypeTranslate = function(value) {
		return value + $scope.mailSettings.tpl_bodyStyles.content.width.measurementType;
	};

/*	$scope.initHTML = function(id , content) {
		$timeout(function(){		
			console.log("aaaaa");1001
			var ele = document.getElementById(id);
			ele.innerHTML = content;
		});
	} */

	$scope.initCke = function(id , cntObj) {
		//$scope.current_itemId= 'cke-'+ $scope.item.type+'-'+$scope.item.id;
		CKEDITOR.config.height = 'auto';
		CKEDITOR.config.width = 'auto';

		console.log("initCke called");


		var initSample = ( function() {

			return function() {
				var editorElement = CKEDITOR.document.getById( id );
				editorElement.setHtml( cntObj.content );
				CKEDITOR.disableAutoInline = true;

				editorElement.setAttribute( 'contenteditable', 'true' );
				var editor = CKEDITOR.inline( id );
				
				// var editor = CKEDITOR.replace(id);
				console.log(editor);
				editor.on('change',function(evt) {
					cntObj.content = evt.editor.getData();
				});
				console.log("init simple called");

			};
		} )();		
		$timeout(function(){
			initSample();
		});		
	};

	// Transition between the measurement units (convert val to other measurement unit)
	$scope.changeMeasurementUnit = function() {
		var newVal = 0;
		// Pixel to Percentage
		if ($scope.contentWidth.type == 'percentage') {
			$scope.mailSettings.tpl_bodyStyles.content.width.measurementType = '%';

			newVal = 100 / ($scope.numSlider.ceil / $scope.mailSettings.tpl_bodyStyles.content.width.size);
		}
		// Percentage to Pixel
		else {
			$scope.mailSettings.tpl_bodyStyles.content.width.measurementType = 'px';

			newVal = ($scope.numSlider.ceil / 100) * $scope.mailSettings.tpl_bodyStyles.content.width.size;
		}
		
		$scope.mailSettings.tpl_bodyStyles.content.width.size = Math.ceil(newVal);

		$timeout(function () {
			$scope.$broadcast('rzSliderForceRender');
		});
	};

	// Color Picker defaults
	$scope.colorPicker = {
		format: 'rgb', // hex
		alpha: false, // true
		swatch: true,
		swatchPos: 'left',
		pos: 'bottom left',
		case: 'upper',
		swatchOnly: false
	};

	// Image Upload Options
	$scope.imgUpOpts = {
		multiple: false,
		rejFiles: [],
		accept: 'image/*',
		acceptSelect: 'image/*',
		disabled: false,
		capture: 'camera',
		allowDir: true,
		keep: false,
		keepDistinct: false,
		resetOnClick: false,
		resetModelOnClick: false,
		dropAvailable: true
	};
	
	// Font Families
	$scope.fontFamilies = fontFamilies;

	$scope.socialIcons = {
		'path': 'img/icons/social/',
		'iconFolders': [
			'square-default/',	// 0
			'square-blue/',		// 1
			'square-gray/',		// 2
			'circle-default/',	// 3
		],
		'icons': [
			{
				'key': 'facebook',
				'title': 'Facebook',
				'src': 'facebook.png',
				'domain': 'https://www.facebook.com/',
			},
			{
				'key': 'twitter',
				'title': 'Twitter',
				'src': 'twitter.png',
				'domain': 'http://twitter.com/',
			},
			{
				'key': 'googlePlus',
				'title': 'Google+',
				'src': 'googleplus.png',
				'domain': 'http://plus.google.com/',
			},
			{
				'key': 'linkedin',
				'title': 'LinkedIn',
				'src': 'linkedin.png',
				'domain': 'http://www.linkedin.com/',
			},
			{
				'key': 'youtube',
				'title': 'YouTube',
				'src': 'youtube.png',
				'domain': 'http://www.youtube.com/',
			},
			{
				'key': 'instagram',
				'title': 'Instagram',
				'src': 'instagram.png',
				'domain': 'http://instagram.com/',
			},
			{
				'key': 'pinterest',
				'title': 'Pinterest',
				'src': 'pinterest.png',
				'domain': 'http://www.pinterest.com/',
			},
			{
				'key': 'website',
				'title': 'Web Site',
				'src': 'website.png',
				'domain': null,
			},
			{
				'key': 'email',
				'title': 'E-Mail',
				'src': 'mail.png',
				'domain': null,
			}
		]
	};

	$scope.trustAsHtml = function(html) {
		return $sce.trustAsHtml(html)
	};

	// 
	$scope.is_contentType = function(type) {
		return contentTypes.indexOf(type) >= 0;
	};

	$scope.activePanelGroup = {name: 'renderGroup'};


	$scope.selectWidgetTab = function (tab){
		$scope.widgetTabs = {};
		$scope.widgetTabs[ tab ] = true;
		
		$scope.models.selected = false;

		$scope.activePanelGroup.name = 'renderGroup';
	};
	
	$scope.selectProColumns = function (i){
		$scope.proColumns = {};
		$scope.proColumns['column_'+i] = true;
	};

	// 
	$scope.set_editPanelTpl = function (model, previous_modelId){
		if (model.module.editTpl && model.id != previous_modelId) {
			$scope.editPanelTpl.url = $scope.edit_pnl_tpls_resource + model.module.editTpl;
			$scope.editPanelTpl.type = model.type;

			$scope.settingsGroupChanged = true;
			$timeout( function(){ $scope.settingsGroupChanged = false; }, 750);
		}
	};

	$scope.set_socialParams = function(iconPack) {
		return {
			// 'src': $scope.socialIcons.path + $scope.socialIcons.iconFolders[folderIndex] + iconPack.src,
			'key': iconPack.key,
			'iconName': iconPack.src,
			'domain': iconPack.domain,
			'href': null,
			'title': iconPack.title,
			'alt': iconPack.title,
		}
	};

	function setPaddings(params) {
		if (!params || params.length != 4) params = [0,0,0,0];

		return {
			"paddingTop": params[0],
			"paddingRight": params[1],
			"paddingBottom": params[2],
			"paddingLeft": params[3]
		}
	}

	function setBorders(params) {
		if (!params || params.length != 4) params = [{width: 0, style: 'solid', color: 'rgba(0,0,0,0)'}, {width: 0, style: 'solid', color: 'rgba(0,0,0,0)'}, {width: 0, style: 'solid', color: 'rgba(0,0,0,0)'}, {width: 0, style: 'solid', color: 'rgba(0,0,0,0)'}];

		return {
			"borderTop": {width: params[0].width, style: params[0].style, color: params[0].color}, // transparent
			"borderRight": {width: params[1].width, style: params[1].style, color: params[1].color},
			"borderBottom": {width: params[2].width, style: params[2].style, color: params[2].color},
			"borderLeft": {width: params[3].width, style: params[3].style, color: params[3].color},
		}
	}

	$scope.concatBorderAttrs = function (bundle){
		if (bundle) {
			return bundle.width+'px '+bundle.style+' '+bundle.color;
		}
		return '0 solid rgba(0,0,0,0)';
	};

	$scope.init_paddingProps = function(bundle) {
		if (angular.isDefined(bundle) &&
			bundle.paddingTop == bundle.paddingBottom && bundle.paddingRight == bundle.paddingLeft && bundle.paddingTop == bundle.paddingRight) {
			$scope.morePaddingOpts = false;
		} else {
			$scope.morePaddingOpts = true;
		}
    };

	$scope.init_borderProps = function(bundle) {
		if (angular.isDefined(bundle) && angular.isDefined(bundle.borderTop) &&
			(bundle.borderTop.width == bundle.borderBottom.width && bundle.borderRight.width == bundle.borderLeft.width && bundle.borderTop.width == bundle.borderRight.width) &&
			(bundle.borderTop.style == bundle.borderBottom.style && bundle.borderRight.style == bundle.borderLeft.style && bundle.borderTop.style == bundle.borderRight.style) &&
			(bundle.borderTop.color == bundle.borderBottom.color && bundle.borderRight.color == bundle.borderLeft.color && bundle.borderTop.color == bundle.borderRight.color)) {
			$scope.moreBorderOpts = false;
		} else {
			$scope.moreBorderOpts = true;
		}
    };

    $scope.removeItem = function(item) {
        item.remove = true;
        $scope.selectWidgetTab('structure');
    };

	$scope.removeContainer = function(list, index) {
        list.splice(index, 1);
		$scope.selectWidgetTab('structure');
    };

	$scope.set_currentContainer = function(e) {
		var currentRootElem = document.querySelector(".baseList.currentContainer");
		if (currentRootElem) {
			currentRootElem.classList.remove('currentContainer');
		}

		var el = e.target;;

		if (el) {
			var rootListEl = findParentBySelector(el, '.baseList');
			if (rootListEl) rootListEl.classList.add('currentContainer');
		}
	}

	$scope.selectItem = function(item, list, i) {
        if (item.remove) {
			if (item.type == 'row_multi_col_wrapper') {
				$scope.removeContainer(list, i);
			} else {
				list.splice(list.indexOf(item), 1);
			}
		} else {
			$scope.models.selected = item;
			$scope.activePanelGroup.name = 'settingsGroup';
		}
    };

	$scope.disableDrag = function(dropzoneElems, list) {
		if (angular.isDefined(list[0]) && list[0].is_mainContainer) {
			return false;
		} else {
			if (list.length == 0) {
				return false;
			} else {
				// return !(list.length == dropzoneElems.length);
			}
		}
	};
	
	// 
	$scope.dropableTypes = function(dropzoneElems, list) {
		if (dropzoneElems.length == 0) {
			return ['row_multi_col_wrapper'];
		} else {
			if (list.length > 0) {
				if ($scope.is_contentType(list[0].type)) {
					return contentTypes;
				}
				return ['row_multi_col_wrapper'];
			}
			else {
				return contentTypes;
			}
		}
	}

	$scope.dropCallback = function(event, index, item, external, type, allowedType) {
        if (item.type == 'row_multi_col_wrapper') {
			item.is_mainContainer = true;
		}

		if ($scope.is_contentType(item.type)) {
			item.style = angular.copy($scope.baseStyles.column);

			if (item.type == 'cnt_text') {
				set_defaultTextStyles(item);
	    	}
		} else if (item.type == 'row_multi_col_wrapper') {
    		item.style = {
				container: angular.copy($scope.baseStyles.container),
				content: angular.copy($scope.baseStyles.content)
			};
			item.style.content.backgroundColor = $scope.mailSettings.tpl_bodyStyles.content.backgroundColor;
			item.style.container.backgroundColor = 'transparent';

    		angular.forEach(item.columns, function(column, i) {
    			angular.forEach(column.columnContents, function(content, key) {
    				if (content.type == 'cnt_text') {
    					set_defaultTextStyles(content);
			    	}
    			});
    		});
    	}

		return item;
    };

    function set_defaultTextStyles(source) {
		source.module.style.color = $scope.mailSettings.tpl_bodyStyles.content.color;
		source.module.style.linkColor = $scope.mailSettings.tpl_bodyStyles.content.linkColor;
		source.module.style.fontFamily = $scope.mailSettings.tpl_bodyStyles.content.fontFamily;
    }

    // $scope.loadCodeMirror = function() {
    // 	$scope.codeEditor = CodeMirror.fromTextArea(document.getElementById("html_code"), {lineNumbers: true});
    // 	$scope.codeEditor.setValue($scope.agent.module.attrs.content);
    // }

	$scope.editorOptions = {
		lineNumbers: true , 
		mode: 'xml',
		htmlMode: true
	};

    
	$scope.set_next_itemId = function(type) {
		return $scope.mailSettings.last_itemIds[ type ]++;
	};
 
	$scope.set_copied_itemIds = function(list) {
		list.id = $scope.set_next_itemId(list.type);

		if (angular.isDefined(list.columns)) {
			for (var i = 0; i < list.columns.length; i++) {
				if (angular.isDefined(list.columns[i].columnContents[0])) {
					list.columns[i].columnContents[0].id = $scope.set_next_itemId(list.columns[i].columnContents[0].type);
				}
			}
		}
	};

	$scope.baseStyles = {
		container: {
			"backgroundColor": "#fff"
		},
		content: {
			"width": {
				"size": 600,
				"measurementType": "px"
			},
			"color": "#333",
			"fontSize": "14",
			"fontFamily": "Arial, 'Helvetica Neue', Helvetica, sans-serif",
			"backgroundColor": "transparent",
			"linkColor": "#0059FF"
		},
		column: angular.extend(
			{
				"backgroundColor": "rgba(0,0,0,0)"
			},
			setPaddings([0,0,0,0]),
			setBorders()
		)
	};

	$scope.mailSettings = {
		last_itemIds: {
			'cnt_text': 0,
			'cnt_image': 0,
			'cnt_button': 0,
			'cnt_social': 0,
			'cnt_divider': 0,
			'cnt_html' :0,
			'row_multi_col_wrapper': 0
		},
		tpl_bodyStyles: {
			'container': angular.copy($scope.baseStyles.container),
			'content': angular.copy($scope.baseStyles.content)
		}
	};

	$scope.dropzoneElements = [];

	switch($state.current.name) {
		case 'getTemplate':
			$scope.mailTitle = '';

			mailsFact.getRequestedMail($stateParams.mailId).success(function(resp){
				if (resp.item != null) {
					$state.get('editTemplate').data.mailId = resp.item.id;
					$state.get('editTemplate').data.title = resp.item.templateName;
					$state.get('editTemplate').data.subject = (resp.item.subject == 'null') ? '' : resp.item.subject;
					$state.get('editTemplate').data.dropzone = angular.fromJson(resp.item.data);
					$state.go('editTemplate', {});
				} else {
					$scope.msgInfo = resp.warning;
				}
			});
			break;
		case 'editTemplate':
			$scope.mailTitle = $state.get('editTemplate').data.title;
			$scope.mailSubject = $state.get('editTemplate').data.subject;
			
			if ($state.get('editTemplate').data.dropzone) {
				$scope.dropzoneElements = $state.get('editTemplate').data.dropzone.elements;
				$scope.mailSettings = $state.get('editTemplate').data.dropzone.settings;
				$scope.inittpl_bodyStyles = JSON.stringify($scope.mailSettings.tpl_bodyStyles);
				$scope.initDropZoneElements = JSON.stringify($scope.dropzoneElements);

			}

			var stored_last_bodyStyles = localStorageService.get('last_bodyStyles');
			if (typeof $state.get('editTemplate').data.mailId == 'undefined' && stored_last_bodyStyles != null) {
				$scope.mailSettings.tpl_bodyStyles = stored_last_bodyStyles;
			}
			break;
	}



	$scope.itemModules = {
		text: {
			editTpl: 'pnl_text.html',
			attrs: {
				"content": 'Have A Wonderful Day'
			},
			style: {
				"color": null,
				"linkColor": null,
				"fontFamily": null,
				"lineHeight": "16",
				"outerPaddings": setPaddings([0,0,0,0])
			}
		},
		image: {
			editTpl: 'pnl_image.html',
			attrs: {
				"filename": null,
				"src": null,
				"href": '',
				"alt": "Image",
			},
			style: {
				"width": "100%",
				"textAlign": "center",
				"outerPaddings": setPaddings([0,0,0,0])
			}
		},
		divider: {
			editTpl: 'pnl_divider.html',
			attrs: {
				'transparent': false,
			},
			style: {
				'width': 100,
				'textAlign': 'center',
				'borderTop': {width: 1, style: 'solid', color: '##aaa'},
				"outerPaddings": setPaddings([10,10,10,10])
			}
		},
		button: {
			editTpl: 'pnl_button.html',
			text : 'Show More' ,
			attrs: {
				'links': {
					'webAddress': {
						'href': null
					},
					'email': {
						'mailTo': null,
						'subject': null,
						'body': null
					}
				},
				'currentLink': 'webAddress'
			},
			style: angular.extend(
				{
					"width": "150",
					"color": "#fff",
					"fontFamily": "Arial, 'Helvetica Neue', Helvetica, sans-serif",
					"lineHeight": "16",
					"textAlign": "center",
					"backgroundColor": "rgba(49,176,213,1)",
					"borderRadius": "5",
					"innerPaddings": setPaddings([12,20,12,20]),
					"outerPaddings": setPaddings([20,0,20,0])
				},
				setBorders()
			)
		},
		social: {
			editTpl: 'pnl_social.html',
			attrs: {
				'iconOrder': 0,
				'icons': [
					$scope.set_socialParams($scope.socialIcons.icons[0]), // facebook
					$scope.set_socialParams($scope.socialIcons.icons[1]), // twitter
					$scope.set_socialParams($scope.socialIcons.icons[2]), // googlePlus
					$scope.set_socialParams($scope.socialIcons.icons[3]) // linkedin
				]
			},
			style: {
				'textAlign': 'center',
				'iconSpaces': 5,
				"outerPaddings": setPaddings([10,10,10,10])
			}
		}, 
		html: {
			editTpl: 'pnl_html.html',
			attrs: {
				"content": '<div class="our-class"> I\'m a new HTML block. </div>'
			},
			// style: {
			// 	"color": null,
			// 	"linkColor": null,
			// 	"fontFamily": null,
			// 	"lineHeight": "16",
			// 	"outerPaddings": setPaddings([0,0,0,0])
			// }
		},		
	};

	$scope.models = {
		selected: false,
		templates: {
			contents: [
				{
					type: 'cnt_text',
					id: $scope.set_next_itemId('cnt_text'),
					info: 'img/content/content-block-text.png',
					module: angular.copy($scope.itemModules.text)
				},
				{
					type: 'cnt_image',
					id: $scope.set_next_itemId('cnt_image'),
					info: 'img/content/content-block-pic.png',
					module: angular.copy($scope.itemModules.image)
				},
				{
					type: 'cnt_button',
					id: $scope.set_next_itemId('cnt_button'),
					info: 'img/content/content-block-button.png',
					module: angular.copy($scope.itemModules.button)
				},
				{
					type: 'cnt_social',
					id: $scope.set_next_itemId('cnt_social'),
					info: 'img/content/content-block-social.png',
					module: angular.copy($scope.itemModules.social)
				},
				{
					type: 'cnt_divider',
					id: $scope.set_next_itemId('cnt_divider'),
					info: 'img/content/content-block-divider.png',
					module: angular.copy($scope.itemModules.divider)
				},
				{
					type: 'cnt_html',
					id: $scope.set_next_itemId('cnt_html'),
					info: 'img/content/content-block-html.png',
					module: angular.copy($scope.itemModules.html)
				}				

			],
			rows: [
				{
					type: 'row_multi_col_wrapper',
					id: $scope.set_next_itemId('row_multi_col_wrapper'),
					module: {
						editTpl: 'pnl_container.html'
					},
					columns: [
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						}
					],
					info: {
						icon: 'img/rows/layout-full-width-pic.png'
					},
					tooltip_txt: "Image"
				},
				{
					type: 'row_multi_col_wrapper',
					id: $scope.set_next_itemId('row_multi_col_wrapper'),
					module: {
						editTpl: 'pnl_container.html'
					},
					columns: [
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_text',
									id: $scope.set_next_itemId('cnt_text'),
									module: angular.copy($scope.itemModules.text)
								}
							]
						}
					],
					info: {
						icon: 'img/rows/layout-full-width-text.png'
					},
					tooltip_txt: "Text"
				},
				{
					type: 'row_multi_col_wrapper',
					id: $scope.set_next_itemId('row_multi_col_wrapper'),
					module: {
						editTpl: 'pnl_container.html'
					},
					columns: [
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_button',
									id: $scope.set_next_itemId('cnt_button'),
									module: angular.copy($scope.itemModules.button)
								}
							]
						}
					],
					info: {
						icon: 'img/rows/layout-full-width-btn.png'
					},
					tooltip_txt: "Button"
				},
				{
					type: 'row_multi_col_wrapper',
					id: $scope.set_next_itemId('row_multi_col_wrapper'),
					module: {
						editTpl: 'pnl_container.html'
					},
					columns: [
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_text',
									id: $scope.set_next_itemId('cnt_text'),
									module: angular.copy($scope.itemModules.text)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_text',
									id: $scope.set_next_itemId('cnt_text'),
									module: angular.copy($scope.itemModules.text)
								}
							]
						},
					],
					info: {
						icon: 'img/rows/layout-2-text.png'
					}, 
					tooltip_txt: "Text / Text"
				},
				{
					type: 'row_multi_col_wrapper',
					id: $scope.set_next_itemId('row_multi_col_wrapper'),
					module: {
						editTpl: 'pnl_container.html'
					},
					columns: [
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						}
					],
					info: {
						icon: 'img/rows/layout-2-pics.png'
					} ,
					tooltip_txt: "Image / Image"
				} , 				
				{
					type: 'row_multi_col_wrapper',
					id: $scope.set_next_itemId('row_multi_col_wrapper'),
					module: {
						editTpl: 'pnl_container.html'
					},
					columns: [
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_text',
									id: $scope.set_next_itemId('cnt_text'),
									module: angular.copy($scope.itemModules.text)
								}
							]
						}
					],
					info: {
						icon: 'img/rows/layout-2-pis-text.png'
					} , 
					tooltip_txt: "Image / Image /Text"
				},
				{
					type: 'row_multi_col_wrapper',
					id: $scope.set_next_itemId('row_multi_col_wrapper'),
					module: {
						editTpl: 'pnl_container.html'
					},
					columns: [
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						}
					],
					info: {
						icon: 'img/rows/layout-3-pics.png'
					} , 
					tooltip_txt: "Image / Image / Image"
				},
				{
					type: 'row_multi_col_wrapper',
					id: $scope.set_next_itemId('row_multi_col_wrapper'),
					module: {
						editTpl: 'pnl_container.html'
					},
					columns: [
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						},
						{
							columnStyles: angular.copy($scope.baseStyles.column),
							columnContents : [
								{
									type: 'cnt_image',
									id: $scope.set_next_itemId('cnt_image'),
									module: angular.copy($scope.itemModules.image)
								}
							]
						}
					],
					info: {
						icon: 'img/rows/layout-4-pics.png'
					} , 
					tooltip_txt: "Image / Image / Image / Image"
				}
			]
		}
    };

	$scope.$watch('[dropzoneElements, mailSettings]', function(model) {
		var bundle = {
			elements: model[0],
			settings: {
				last_itemIds: model[1].last_itemIds,
				tpl_bodyStyles: model[1].tpl_bodyStyles
			}
		};

		$scope.liveModels = {
			bundle: bundle,
			json: angular.toJson(bundle, true)
		}
	}, true);

	// LOAD edit panel templates
	$scope.$watch('models.selected', function(model, oldModel) {
		if (angular.isDefined(model.module)) {
			if (model.module.editTpl) {
				$scope.set_editPanelTpl(model, angular.isDefined(oldModel.id) ? oldModel.id : false);
			}
			$scope.agent = $scope.models.selected;
		}
	}, true);

	// $scope.$watch('mailTitle', function(title) {
	// 	if (title === null || typeof title == 'undefined') {
	// 		$scope.mailTitle = '';
	// 	}
	// }, true);


	function process(str) {

	    var div = document.createElement('div');
	    div.innerHTML = str.trim();

	    return format(div, 0).innerHTML;
	}

	function format(node, level) {

	    var indentBefore = new Array(level++ + 1).join('  '),
	        indentAfter  = new Array(level - 1).join('  '),
	        textNode;

	    for (var i = 0; i < node.children.length; i++) {

	        textNode = document.createTextNode('\n' + indentBefore);
	        node.insertBefore(textNode, node.children[i]);

	        format(node.children[i], level);

	        if (node.lastElementChild == node.children[i]) {
	            textNode = document.createTextNode('\n' + indentAfter);
	            node.appendChild(textNode);
	        }
	    }

	    return node;
	}

	// Generate email html by Vlad.Tolstoy

	$rootScope.genMailHTML = function() {
		$content  = 
		'<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n \
		<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n \
		<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"/>\n \
		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n \
		\t<title>';
		$content = $content + $scope.mailTitle + '</title>\n\t<style>\n';
		$content += 		
	        '#outlook a {padding:0;}\n' +      
	        'body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}\n' +     
	        '.ReadMsgBody {width: 100%;}\n' +
	        '.ExternalClass {width:100%;}\n' +
	        '.backgroundTable {margin:0 auto; padding:0; width:100%;!important;}\n' + 
	        'table td {border-collapse: collapse;}\n' +
	        '.ExternalClass * {line-height: 115%;}\n' +
	        '@media screen and (max-width: 600px){\n' +         
	            '*[class="100p"] {width:100% !important; height:auto !important;}\n' +             
	            '*[class="100p-mob"] {width:100% !important; height:auto !important; display:block}\n' + 
	        '}\n';

		$content += '</style>';
		$content = $content + "<body style=\"background-color:" + $scope.mailSettings.tpl_bodyStyles.container.backgroundColor;
		$content = $content + ";font-family:" + $scope.mailSettings.tpl_bodyStyles.content.fontFamily;
		$content = $content + ";font-size:" + $scope.mailSettings.tpl_bodyStyles.content.fontSize+'px';
		$content = $content + ";color:" + $scope.mailSettings.tpl_bodyStyles.content.color + "\">\n";
		$content += '<table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0" width="100%">\n';
		$content += '<tr>\n <td align="center" valign="top">\n';
		console.log($scope.dropzoneElements.length);
		for (var i = 0; i < $scope.dropzoneElements.length; i++ ) {
			var item = 	$scope.dropzoneElements[i];
			// RowBlock
			/*width: 100%; TO add in the following row*/ 
			$content = $content + '<table class= "100p" border="0" cellpadding="0" cellspacing="0" width="600px" style="margin :0;padding:0;background-color:' 
				+ item.style.container.backgroundColor  + '">\n';
			// Content Wrapper
			$content = $content + '<tr    style=\"width:' /*+ '600px'$scope.mailSettings.tpl_bodyStyles.content.width.size*/ ;
			//$content = $content +  $scope.mailSettings.tpl_bodyStyles.content.width.measurementType;
			$content = $content  + ';background-color:' + item.style.content.backgroundColor  + ';margin:0 auto\">\n';	

			// Content block 
			for (var j = 0; j < item.columns.length ;j ++) {
				var column = item.columns[j];
				$content = $content + '<td valign="top" class="100p-mob" style=\"width:' + ($scope.mailSettings.tpl_bodyStyles.content.width.size / item.columns.length) 
				  						+ $scope.mailSettings.tpl_bodyStyles.content.width.measurementType ;
				$content = $content + ";background-color:" + column.columnStyles.backgroundColor;
				//$content = $content + ";border-radius:" +  column.columnStyles.borderRadius+'px';
				$content = $content + ";max-height:500px";
				$content = $content + ";padding-top:" + column.columnStyles.paddingTop + 'px';
				$content = $content + ";padding-right:" + column.columnStyles.paddingRight + 'px';
				$content = $content + ";padding-bottom:" + column.columnStyles.paddingBottom + 'px';
				$content = $content + ";padding-left:" + column.columnStyles.paddingLeft + 'px';				
				$content = $content +   ';height: 100%; margin: auto;min-height: 80px;\nmin-width: 150px; position: relative;vertical-align: top;z-index: 10';	
				$content = $content +  ';border-top:' + $scope.concatBorderAttrs(column.columnStyles.borderTop);
				$content = $content +  ';border-right:' + $scope.concatBorderAttrs(column.columnStyles.borderRight);
				$content = $content +  ';border-bottom:' + $scope.concatBorderAttrs(column.columnStyles.borderBottom);
				$content = $content +  ';border-left:' + $scope.concatBorderAttrs(column.columnStyles.borderLeft) + "\">\n";
				$content = $content + 	'<table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0" width="100%">\n';
				var content;
				for (var k = 0; k < column.columnContents.length ; k++) {
					$content = $content + 	'<tr> <td>';
					content = column.columnContents[k];
					switch(content.type) {
						case "cnt_text":
							var editorElement = CKEDITOR.document.getById( "cke-" + content.type + "-" + content.id);	
							$content += editorElement.getHtml();						
							break;
						case "cnt_social":
							$content += "<div style=\"text-align:" + content.module.style.textAlign;
							$content = $content + ";padding-top:" + content.module.style.outerPaddings.paddingTop + 'px';
							$content = $content + ";padding-right:" + content.module.style.outerPaddings.paddingRight + 'px';
							$content = $content + ";padding-bottom:" + content.module.style.outerPaddings.paddingBottom + 'px';
							$content = $content + ";padding-left:" + content.module.style.outerPaddings.paddingLeft + 'px' + "\">\n";
							var icon;
							for ( var ii = 0; ii < content.module.attrs.icons.length; ii++) {
								icon = content.module.attrs.icons[ii];
								$content += "<span style=\"padding-right:" + content.module.style.iconSpaces + "px\">\n";
								$content += " <a href=\"" + (icon.href ? (icon.key == 'email' ? 'mailto:'+icon.href : icon.domain + icon.href) : "") 
								 			+ "\"" + " target=\"_blank\">\n";
								$content += " <img " + "src=\"" + $scope.socialIcons.path + $scope.socialIcons.iconFolders[ content.module.attrs.iconOrder ] 
															+ icon.iconName ; 
								$content += "\" width=\"32\""; 
								$content += " alt=\"" + icon.alt + "\"";
								$content += " title=\"" + icon.title + "\">\n";
								$content += "</a>\n";
								$content += "</span>\n";								
							}
							$content += "</div>\n";
							break;
						case "cnt_divider":
							$content += "<div style=\"text-align:" + content.module.style.textAlign;
							$content = $content + ";padding-top:" + content.module.style.outerPaddings.paddingTop + 'px';
							$content = $content + ";padding-right:" + content.module.style.outerPaddings.paddingRight + 'px';
							$content = $content + ";padding-bottom:" + content.module.style.outerPaddings.paddingBottom + 'px';
							$content = $content + ";padding-left:" + content.module.style.outerPaddings.paddingLeft + 'px' + "\">\n";
							$content += '<div style=\"width:' + content.module.style.width + '%;';
							$content += ";border-top-width:" + content.module.style.borderTop.width+'px';
							$content += ";border-top-style:" + content.module.style.borderTop.style;
							$content += ";border-top-color:" + content.module.style.borderTop.color + "\">\n";
							$content += "</div>\n</div>\n";
							break;
						case "cnt_html":
							$content += content.module.attrs.content;
							break;
						case "cnt_button":
							$content += "<div style=\"text-align:" + content.module.style.textAlign;
							$content = $content + ";padding-top:" + content.module.style.outerPaddings.paddingTop + 'px';
							$content = $content + ";padding-right:" + content.module.style.outerPaddings.paddingRight + 'px';
							$content = $content + ";padding-bottom:" + content.module.style.outerPaddings.paddingBottom + 'px';
							$content = $content + ";padding-left:" + content.module.style.outerPaddings.paddingLeft + 'px' + "\">";
							$content = $content + '<a style=\"width:' + content.module.style.width + 'px';
							$content = $content + ";color:" + content.module.style.color;
							$content = $content + ";font-family:" +  content.module.fontFamily;
							$content = $content + ";line-height:" + content.module.style.lineHeight+'px';
							$content = $content + ";background-color:" + content.module.style.backgroundColor;
							$content = $content + ";border-radius:" + content.module.style.borderRadius + 'px';
							$content = $content + ";display:inline-block;font-size:13px;text-align:center;margin:0 auto" + content.module.style.borderRadius + 'px';
							$content = $content + ";padding-top:" + content.module.style.innerPaddings.paddingTop + 'px';
							$content = $content + ";padding-right:" + content.module.style.innerPaddings.paddingRight + 'px';
							$content = $content + ";padding-bottom:" + content.module.style.innerPaddings.paddingBottom + 'px';
							$content = $content + ";padding-left:" + content.module.style.innerPaddings.paddingLeft + 'px';				
							$content = $content +  ';border-top:' + $scope.concatBorderAttrs(content.module.style.borderTop);
							$content = $content +  ';border-right:' + $scope.concatBorderAttrs(content.module.style.borderRight);
							$content = $content +  ';border-bottom:' + $scope.concatBorderAttrs(content.module.style.borderBottom);
							$content = $content +  ';border-left:' + $scope.concatBorderAttrs(content.module.style.borderLeft) + "\">\n";							
							$content += content.module.text + "</a>\n</div>";

							break;
						case "cnt_image":
							$content += " <a href=\"" + content.module.attrs.href + "\"" + "target=\"_blank\">\n";
							$content += " <img id=\"img-" + content.id + "\"" + "src=\"" + content.module.attrs.src ; 
							$content += "\" style = \"width:" + content.module.style.width + "\"";
							$content += " alt=\"" + content.module.attrs.alt + "\"";
							$content += " title=\"" + content.module.attrs.title + "\">\n";
							$content += "</a>\n";
							break;
					}
					$content = $content + 	'</td> </tr>';
				}
				$content = $content + '</table>\n';
				$content = $content + '</td>\n';							
			}

			$content += "</tr>\n";					
			$content += "</table>\n";
		}

		$content += '</td>\n</tr>\n</table>\n';
		$content = $content + "</body>\n </html>";


		return $content;
    	//$content = process($content);
		//alert($content);
	}


	$scope.editorFocus = function (itemId) {
		var focusedEditor = document.getElementById(itemId);
		focusedEditor.setAttribute("contenteditable" , 'true');		
		var rect = focusedEditor.getBoundingClientRect();
		var bodyRect = document.body.getBoundingClientRect();
		$scope.editor_top = rect.top -bodyRect.top;
		$scope.editor_left = rect.left - bodyRect.left;
		console.log( 'x ' +  $scope.editor_left,  ' y ' + $scope.editor_top);
		setParentLiDraggablelity(focusedEditor, false);
	};
	$scope.editorBlur = function (itemId) {
		var focusedEditor = document.getElementById(itemId);
		focusedEditor.setAttribute("contenteditable" , 'false');
		setParentLiDraggablelity(focusedEditor, true);
	};
	


	function setParentLiDraggablelity (el, status) {
		var parentEl = el.parentElement;
		for (var i=10; i<=20; i++) {
			if (parentEl.tagName == 'LI' && parentEl.draggable === !status) {
				parentEl.draggable = status;
			}

			parentEl = parentEl.parentElement;
		}
	}

	var featherEditor = new Aviary.Feather({
		apiKey: 'f9812100f82048959221fef85ac09408',
		theme: 'dark',
		tools: 'all',
		appendTo: '',
		onSave: function(imageID, newURL) {
			$scope.agent.module.attrs.src = newURL;

			msgFact.success('Successfully Edited');
		},
		onError: function(errorObj) {}
	});

	// Open aviary
	$scope.launchAviary = function (id, src){
		featherEditor.launch({
			image: id,
			url: src
		});

		return false;
	};

	$scope.open_saveModal = function (mode,size) {
		var saveModalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'saveModalContent.html',
			controller: 'saveModalInstanceCtrl',
			size: size,
			backdrop: 'static',
			resolve: {
				mailProps: function () {
					return {
						title: $scope.mailTitle,
						subject: $scope.mailSubject,
						elements: $scope.dropzoneElements,
						settings: $scope.mailSettings,
						mode : mode
					}
				}
			}
		});
	};

	$scope.open_testModal = function (size) {
		var testModalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'testModalContent.html',
			controller: 'testModalInstanceCtrl',
			size: size,
			backdrop: 'static',
			resolve: {
				mailProps: function () {
					return {
						title: $scope.mailAddr,
						subject: $scope.mailSubject,
						data: $rootScope.genMailHTML()
					}
				}
			}
		});
	};	
});

meApp.controller('testModalInstanceCtrl', function ($scope, $modalInstance, $state, mailsFact, msgFact, mailProps) {
	$scope.mailAddr = mailProps.Addr;
	$scope.mailSubject = mailProps.subject;
	$scope.data = mailProps.data;


	$scope.testSendMail = function (){
		console.log($scope.data);
		mailsFact.SendTest($scope.mailAddr, $scope.mailSubject, $scope.data).success(function(resp){
			if (resp == 'OK') {
				msgFact.success('Successfully Sent');
			} else {}
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});



meApp.controller('saveModalInstanceCtrl', function ($window,$scope,$rootScope, $modalInstance, $state, mailsFact, msgFact, mailProps) {
	$scope.mailTitle = mailProps.title;
	$scope.mailSubject = mailProps.subject;
	$scope.processing = false;
	$scope.mode = mailProps.mode;
	var dropzoneBundle = {
		elements: mailProps.elements,
		settings: mailProps.settings
	};

	$scope.saveMail = function (){
		var mailId = '';

		if (angular.isDefined($state.get('editTemplate').data.mailId)) {
			mailId = $state.get('editTemplate').data.mailId;
		}
		else {}
		
		if($scope.mailTitle == "" || $scope.mailSubject =="" ) {
			alert("title and subject cannot be empty!");
			return;
		}

		mailsFact.saveMail(mailId, $scope.mailTitle, $scope.mailSubject, dropzoneBundle, $rootScope.genMailHTML()).success(function(resp){
			console.log(resp);
			if (resp != null) {
				msgFact.info('Successfully Saved');

				if($scope.mode == 1)
					$window.location.href = "http://cloud.directiq.com/template-library.aspx";
				// New mail
				if (mailId == '') {
					$state.go("getTemplate", {mailId: resp}, {inherit: false});
				}

				$modalInstance.dismiss('cancel');
			} else {}
		});
	};

	$scope.saveAsMail = function (){
		$scope.processing = true;
		var mailId = '';

		mailsFact.saveMail(mailId, $scope.mailTitle, $scope.mailSubject, dropzoneBundle).success(function(resp){
			if (resp.item != null) {
				msgFact.success('Successfully Saved As '+$scope.mailTitle);

				// New mail
				$state.go("getTemplate", {mailId: resp.item.id}, {inherit: false});

				$modalInstance.dismiss('cancel');
			} else {}
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});
