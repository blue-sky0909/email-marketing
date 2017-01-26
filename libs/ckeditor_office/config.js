/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

    config.toolbar = [
           { name: 'styles', items: [ 'Font', 'FontSize' ] },
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike',  'RemoveFormat' ] },
        {name : 'textalign' ,items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        { name: 'insert', items: [  'SpecialChar'] },
        { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
        '/',
        { name: 'paragraph', items: [ 'NumberedList', 'BulletedList' ] },
        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'tools', items: [ 'BidiLtr', 'BidiRtl'] },
        { name: 'links', items: [ 'Link', 'Unlink'] }
    ];	
};
