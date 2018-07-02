/**
 * @file Class for handling mouse movement
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2018/03/28
 */


/**
 * State_controller
 *
 * @class StateController
 * @classdesc Class holding the state of a model and a viewer.
 *		This class accumulates the total mouse movement.
 *
 * @param {Number} dispParams display parameters
 */
var StateController = function ( dispParams ) {

	// Alias for acceccing this from a closure
	var _this = this;

	// "state" object is a place where you store variables to render a scene.
	//
	// clipNear: z position of near clipping plane
	// clipFar: z position of far clipping plane
	// modelTranslation: (x,y,z) translations for teapots
	// modelRotation: (x,y) rotations for models
	// viewerPosition: (x,y,z) positions of a viewer
	// viewerTarget: the position where a viewer is looking
	// perspectiveMat switch between perspective
	this.state = {

		clipNear: 1.0,

		clipFar: 10000.0,

		modelTranslation: new THREE.Vector3(),

		modelRotation: new THREE.Vector2(),

		viewerPosition:
			new THREE.Vector3( 0, 0, dispParams.distanceScreenViewer ),

		viewerTarget: new THREE.Vector3(),

		perspectiveMat: true,

	};


	// Constants for distinguishing which button is engated.
	const MODEL_TRANSFORM = 0;

	const VIEWER_POSITION = 1;

	const VIEWER_TARGET = 2;

	const CLIPNEAR_CTRL = 3;

	// a variable to find which botton is engaged
	var controller = NaN;

	// A variable to store the mouse position on the previous frame.
	var previousPosition = new THREE.Vector2();

	// A variable to check the click status
	var clickHold = false;



	/* Private functions */

	// Here, we define callback functions for event listners set by jQuery.
	// For example, onClick function is called when the mouse is clicked
	// somewhere in the window.
	// See at the bottom of this class to see the usages.

	// This function is called when the mouse click is engaged.
	//
	// INPUT
	// x: the x position of the mouse cursor
	// y: the x position of the mouse cursor
	function onClick( x, y ) {

		previousPosition.set( x, y );

		clickHold = true;

	}

	// This function is called when the mouse click is released, or the mouse
	// cursor goes to the outside of the window.
	function releaseClick() {

		clickHold = false;

	}

	// This function is called when the mouse cursor moves.
	//
	// INPUT
	// e: jQuery event
	// x: the x position of the mouse cursor
	// y: the x position of the mouse cursor
	function onMove( e, x, y ) {

		// Check the mouse is clicked. If not, do nothing.
		if ( ! clickHold ) return;

		var movement = computeMovement( x, y, previousPosition );


		// Map mouse movements to matrix parameters

		// Check if the model control button is clicked.
		if ( controller === MODEL_TRANSFORM ) {

			updateModelParams( e, movement );

		}

		// Check if the viewer position control button is clicked.
		if ( controller === VIEWER_POSITION ) {

			updateViewPosition( e, movement );

		}

		// Check if the viewer target control button is clicked.
		if ( controller === VIEWER_TARGET ) {

			updateViewTarget( e, movement );

		}

		// Check if the clipping control button is clicked.
		if ( controller === CLIPNEAR_CTRL ) {

			updateProjectionParams( e, movement );

		}

	}

	// A function to compute the mouse movement between frames.
	// Do not forget to update previousPosition variable.
	//
	// INPUT
	// x: x position of a mouse cursor in jQuery's coordinate
	// y: y position of a mouse cursor in jQuery's coordinate
	// previousPosition: the coordinate of the mouse pointer in jQuery's
	//	coordinate at the previous frame as THREE.Vector2.
	//
	// OUTPUT
	// the mouse movement between frames in Three's coordinate as THREE.Vector2
	function computeMovement( x, y, previousPosition ) {

		/* TODO (2.1.1.1) Mouse Movement */

		let deltaX = x - previousPosition.x;
		let deltaY = y - previousPosition.y;
		deltaX = deltaX/40.0;
		deltaY = deltaY/40.0;

		//console.log("deltaX" + deltaX);
		//console.log("deltaY" + deltaY);
		previousPosition = new THREE.Vector2(x,y);
		return new THREE.Vector2(deltaX, -deltaY);

	}

	// A function to map mouse movements to high level model matrix parameters.
	// This function should update "modelTranslation" and "modelRotation" in the
	// "state" variable.
	//
	// INPUT
	// e: jQuery event
	// movement: the mouse movement computed by computeMovement() function
	//
	// NOTE (Important!):
	// In JavaScript, if you want to access "this.state" from a closure, you need
	// to make an alias for "this" and acess "state" from this alias because
	// "this" refers to the closure itself if you use "this" inside the closure.
	// We have already defined the alias as "_this" at the top of this class.
	// We follow this convention throughout homework.
	function updateModelParams( e, movement ) {

		/* TODO
		 * (2.1.1.2) Mapping Mouse Movement to Matrix Parameters
		 * (2.1.2) Model Rotation
		 */
		let rotationSpeed = 50;
		var ctrlKey = e.metaKey // for Mac's command key
			|| ( navigator.platform.toUpperCase().indexOf( "MAC" ) == - 1
				&& e.ctrlKey );

		// Check if the shift-key is pressed
		if ( e.shiftKey && ! ctrlKey ) {

			// XY translation
			_this.state.modelTranslation.x += movement.x;
			_this.state.modelTranslation.y += movement.y;


		} else if ( ! e.shiftKey && ctrlKey ) {

			// Z translation
			_this.state.modelTranslation.z += movement.y;

		} else {
			// Rotation
			_this.state.modelRotation.x += THREE.Math.degToRad(movement.x);
			_this.state.modelRotation.y += THREE.Math.degToRad(movement.y);

		}

	}


	// A function to map mouse movements to the viewer position parameter.
	// This function should update "viewerPosition" in the "state" variable.
	//
	// INPUT
	// e: jQuery event
	// movement: the mouse movement computed by computeMovement() function
	function updateViewPosition( e, movement ) {

		/* TODO (2.2.1) Move viewer position */


		var ctrlKey = e.metaKey // for Mac's command key
			|| ( navigator.platform.toUpperCase().indexOf( "MAC" ) == - 1
				&& e.ctrlKey );

		// Check if shift-key pressed
		if ( ! ctrlKey ) {

			// XY translation
			_this.state.viewerPosition.x += movement.x;
			_this.state.viewerPosition.y += movement.y;

		} else {
			_this.state.viewerPosition.z += movement.y;
			// Z translation

		}

	}


	// A function to map mouse movements to the viewer target parameter.
	// This function should update "viewerTarget" in the "state" variable.
	//
	// INPUT
	// e: jQuery event
	// movement: the mouse movement computed by computeMovement() function
	function updateViewTarget( e, movement ) {

		/* TODO (2.2.2) Move viewer target */

		var ctrlKey = e.metaKey // for Mac's command key
			|| ( navigator.platform.toUpperCase().indexOf( "MAC" ) == - 1
				&& e.ctrlKey );

		// Check if shift-key pressed
		if ( ! ctrlKey ) {

			// XY translation
			_this.state.viewerTarget.x += movement.x;
			_this.state.viewerTarget.y += movement.y;
		} else {

			// Z translation
			_this.state.viewerTarget.z += movement.y;
		}

	}


	// A function to map mouse movements to the projection matrix parameters.
	// This function should update "clipNear" in the "state" variable.
	//
	// INPUT
	// e: jQuery event
	// movement: the mouse movement computed by computeMovement() function
	function updateProjectionParams( e, movement ) {

		/* TODO (2.3.1) Implement Perspective Transform */
		_this.state.clipNear += movement.y;
		THREE.Math.clamp(_this.state.clipNear, 1, _this.state.clipFar);
	}



	/* Public functions */

	// Display the scene parameters in the browser
	this.display = function () {

		$( "#positionVal" ).html(

			"<p>Translation: " +
				vector3ToString( this.state.modelTranslation ) + "</p>" +
			"<p>Rotation: " +
				vector2ToString( this.state.modelRotation ) + "</p>" +
			"<p>Viewer position: " +
				vector3ToString( this.state.viewerPosition ) + "</p>" +
			"<p>Viewer target: " +
				vector3ToString( this.state.viewerTarget ) + "</p>"

		);

	};



	/* Event listsners */

	$( ".renderCanvas" ).on( {

		"mousedown": function ( e ) {

			onClick( e.pageX, e.pageY );

		},

		"mousemove": function ( e ) {

			onMove( e, e.pageX, e.pageY );

			e.preventDefault();

		},

		"mouseout": function ( e ) {

			releaseClick();

		},

		"mouseup": function ( e ) {

			releaseClick();

		},

	} );


	$( "#modelBtn" ).click( function () {

		controller = MODEL_TRANSFORM;

		$( "#modelBtn" ).css( "background-color", "teal" );

		$( "#viewerPositionBtn" ).css( "background-color", cardinalColor );

		$( "#viewerTargetBtn" ).css( "background-color", cardinalColor );

		$( "#clipNearBtn" ).css( "background-color", cardinalColor );

	} );


	$( "#viewerPositionBtn" ).click( function () {

		controller = VIEWER_POSITION;

		$( "#modelBtn" ).css( "background-color", cardinalColor );

		$( "#viewerPositionBtn" ).css( "background-color", "teal" );

		$( "#viewerTargetBtn" ).css( "background-color", cardinalColor );

		$( "#clipNearBtn" ).css( "background-color", cardinalColor );

	} );


	$( "#viewerTargetBtn" ).click( function () {

		controller = VIEWER_TARGET;

		$( "#modelBtn" ).css( "background-color", cardinalColor );

		$( "#viewerPositionBtn" ).css( "background-color", cardinalColor );

		$( "#viewerTargetBtn" ).css( "background-color", "teal" );

		$( "#clipNearBtn" ).css( "background-color", cardinalColor );

	} );

	$( "#clipNearBtn" ).click( function () {

		controller = CLIPNEAR_CTRL;

		$( "#modelBtn" ).css( "background-color", cardinalColor );

		$( "#viewerPositionBtn" ).css( "background-color", cardinalColor );

		$( "#viewerTargetBtn" ).css( "background-color", cardinalColor );

		$( "#clipNearBtn" ).css( "background-color", "teal" );

	} );


	$( "#projectionMatBtn" ).click( function () {

		_this.state.perspectiveMat = ! _this.state.perspectiveMat;

		if ( _this.state.perspectiveMat ) {

			$( "#projectionMatBtn" ).html( "Perspective Matrix" );

		} else {

			$( "#projectionMatBtn" ).html( "Orthographic Matrix" );

		}

	} );



	/* Grading purpose - Ignore here! */

	this.computeMovement = computeMovement;

	this.updateModelParams = updateModelParams;

	this.updateViewPosition = updateViewPosition;

	this.updateViewTarget = updateViewTarget;

	this.updateProjectionParams = updateProjectionParams;

};
