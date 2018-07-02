
/**
 * @file functions to comptue model/view/projection matrices
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2018/03/28
 */

/**
 * MVPmat
 *
 * @class MVPmat
 * @classdesc Class for holding and computing model/view/projection matrices.
 *
 * @param  {DisplayParameters} dispParams    display parameters
 */

var MVPmat = function ( dispParams ) {

	// Alias for acceccing this from a closure
	var _this = this;


	// A model matrix
	this.modelMat = new THREE.Matrix4();

	// A view matrix
	this.viewMat = new THREE.Matrix4();

	// A projection matrix
	this.projectionMat = new THREE.Matrix4();



	/* Private functions */

	// A function to compute a model matrix based on the current state
	//
	// INPUT
	// state: state of StateController
	function computeModelTransform( state ) {
		/* TODO (2.1.1.3) Matrix Update / (2.1.2) Model Rotation  */
		let translationMat4 = new THREE.Matrix4().makeTranslation( state.modelTranslation.x, state.modelTranslation.y, state.modelTranslation.z );
		//console.log(translationMat4);

		let xRotationMat4 = new THREE.Matrix4().makeRotationX( state.modelRotation.y );
		let yRotationMat4 = new THREE.Matrix4().makeRotationY( state.modelRotation.x );

		//console.log(xRotationMat4);
		//console.log(yRotationMat4);

		let transformMat4 = translationMat4.multiply(yRotationMat4.multiply(xRotationMat4));
		return transformMat4;
	}

	// A function to compute a view matrix based on the current state.
	//
	// NOTE
	// Do not use lookAt().
	//
	// INPUT
	// state: state of StateController
	function computeViewTransform( state ) {

		/* TODO (2.2.3) Implement View Transform */
		let cameraPos = state.viewerPosition;
		let targetPos = state.viewerTarget;

		//Camera Translation
		let cameraTranslationMat = new THREE.Matrix4().makeTranslation(-state.viewerPosition.x, -state.viewerPosition.y, -state.viewerPosition.z);
		
		//defining vectors
		let UP = new THREE.Vector3( 0, 1, 0 );


		let lookVec = new THREE.Vector3().subVectors(cameraPos, targetPos).normalize();
		let right = new THREE.Vector3().crossVectors(UP, lookVec).normalize();
		let forward = new THREE.Vector3().crossVectors(lookVec, right).normalize();

		//Camera Rotation Matrix creted by vectors found above
		let cameraRotationMat = new THREE.Matrix4().makeBasis(right, forward, lookVec).transpose();


		let cameraTransformMat = new THREE.Matrix4().premultiply(cameraTranslationMat).premultiply(cameraRotationMat);

		return cameraTransformMat;
		//return cameraTransformMat.getInverse();

	}

	// A function to compute a perspective projection matrix based on the
	// current state
	//
	// NOTE
	// Do not use makePerspective().
	//
	// INPUT
	// Notations for the input is the same as in the class.
	function computePerspectiveTransform(
		left, right, top, bottom, clipNear, clipFar ) {

		/* TODO (2.3.1) Implement Perspective Projection */
		fovy = -30;
		aspect = 16/9;

		f = 1/Math.tan(fovy/2);
		tt = (clipFar + clipNear)/(clipFar-clipNear);
		tf = ((2*clipFar*clipNear)/(clipFar-clipNear));

		return new THREE.Matrix4().set(
				f/aspect, 0, 0, 0,
				0, f, 0, 0,
				0, 0, -tt, -tf,
				0, 0, -1.0, 0 );

	}

	// A function to compute a orthographic projection matrix based on the
	// current state
	//
	// NOTE
	// Do not use makeOrthographic().
	//
	// INPUT
	// Notations for the input is the same as in the class.
	function computeOrthographicTransform(
		left, right, top, bottom, clipNear, clipFar ) {

		/* TODO (2.3.2) Implement Orthographic Projection */

		return new THREE.Matrix4().set(
				2/(right-left), 0, 0, -((right+left)/(right-left)),
				0, 2/(top-bottom), 0, -((top+bottom)/(top-bottom)),
				0, 0, -2/(clipFar-clipNear), -((clipFar+clipNear)/(clipFar-clipNear)),
				0, 0, 0, 1);

	}



	/* Public functions */

	// Update the model/view/projection matrices
	// This function is called in every frame (animate() function in render.js).
	this.update = function ( state ) {

		// Compute model matrix
		this.modelMat.copy( computeModelTransform( state ) );

		// Compute view matrix
		this.viewMat.copy( computeViewTransform( state ) );

		// Compute projection matrix
		if ( state.perspectiveMat ) {

			var right = ( dispParams.canvasWidth * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

			var left = - right;

			var top = ( dispParams.canvasHeight * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

			var bottom = - top;

			this.projectionMat.copy( computePerspectiveTransform(
				left, right, top, bottom, state.clipNear, state.clipFar ) );

		} else {

			var right = dispParams.canvasWidth * dispParams.pixelPitch / 2;

			var left = - right;

			var top = dispParams.canvasHeight * dispParams.pixelPitch / 2;

			var bottom = - top;

			this.projectionMat.copy( computeOrthographicTransform(
				left, right, top, bottom, state.clipNear, state.clipFar ) );

		}

	};



	/* Grading purpose - Ignore here! */

	this.computeModelTransform = computeModelTransform;

	this.computeViewTransform = computeViewTransform;

	this.computePerspectiveTransform = computePerspectiveTransform;

	this.computeOrthographicTransform = computeOrthographicTransform;

};
