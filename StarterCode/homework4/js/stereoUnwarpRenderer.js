 
/**
 * @file Class for a stereo unwarap renderer
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2018/03/28
 */


/**
 * StereoUnwarpRenderer
 *
 * @class StereoUnwarpRenderer
 * @classdesc Class for stereo unwarp rendering.
 * This class should be used for adding some post effets on a pre-rendered scene.
 *
 *
 * @param  {THREE.WebGLRenderer} webglRenderer renderer
 * @param  {DisplayParameters} dispParams    display parameters
 */
var StereoUnwarpRenderer = function ( webglRenderer, dispParams ) {

	// Alias for acceccing this from a closure
	var _this = this;


	var pixelPitch = dispParams.pixelPitch;

	var screenWidthResolution = dispParams.screenWidthResolution;

	var screenWidthMM = screenWidthResolution * pixelPitch;

	var halfIpd = dispParams.ipd / 2 / dispParams.pixelPitch;

	var camera = new THREE.Camera();

	var sceneL = new THREE.Scene();

	var sceneR = new THREE.Scene();

	// TODO
	// Compute center coordinates for each eye in texture (u,v) coordinates
	// Change the initial values Vector2 //1.0 - (halfIpd/screenWidthMM)
	var centerCoordL = new THREE.Vector2(0.5, 0.5 );

	var centerCoordR = new THREE.Vector2(0.5, 0.5 );


	// Left eye
	this.renderTargetL = new THREE.WebGLRenderTarget(
		dispParams.canvasWidth, dispParams.canvasHeight );

	var materialL = setUnwarpMaterial( this.renderTargetL, centerCoordL );

	var meshL = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 2, 2 ), materialL );

	sceneL.add( meshL );


	// Right eye
	this.renderTargetR = new THREE.WebGLRenderTarget(
		dispParams.canvasWidth, dispParams.canvasHeight );

	var materialR = setUnwarpMaterial( this.renderTargetR, centerCoordR );

	var meshR = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 2, 2 ), materialR );

	sceneR.add( meshR );



	/* Private Functions */

	function setUnwarpMaterial( renderTarget, centerCoord ) {

		var material = new THREE.RawShaderMaterial( {

			uniforms: {

				map: { value: renderTarget.texture },

				centerCoordinate: { value: centerCoord },

				K: { value: new THREE.Vector2() },

				distLensScreen: { value: dispParams.distLensScreen },

				viewportSize: { value: new THREE.Vector2(
					pixelPitch * dispParams.canvasWidth / 2,
					pixelPitch * dispParams.canvasHeight ) },

			},

			vertexShader: $( "#vShaderUnwarp" ).text(),

			fragmentShader: $( "#fShaderUnwarp" ).text()

		} );

		return material;

	}



	/* Public Functions */

	this.render = function ( state ) {

		// Update the uniforms for the lens distortion parameters
		materialL.uniforms.K.value = state.lensDistortion;

		materialR.uniforms.K.value = state.lensDistortion;


		webglRenderer.setScissorTest( true );

		// Render for left eye on the left side
		webglRenderer.setScissor(
			0, 0, dispParams.canvasWidth / 2, dispParams.canvasHeight );

		webglRenderer.setViewport(
			0, 0, dispParams.canvasWidth / 2, dispParams.canvasHeight );

		webglRenderer.render( sceneL, camera );


		// Render for right eye on the right side
		webglRenderer.setScissor(
			dispParams.canvasWidth / 2, 0,
			dispParams.canvasWidth / 2, dispParams.canvasHeight );

		webglRenderer.setViewport(
			dispParams.canvasWidth / 2, 0,
			dispParams.canvasWidth / 2, dispParams.canvasHeight );

		webglRenderer.render( sceneR, camera );


		webglRenderer.setScissorTest( false );

	};


	/* Automatic update of the renderer size when the window is resized. */

	$( window ).resize( function () {

		_this.renderTargetL.setSize(
			dispParams.canvasWidth, dispParams.canvasWidth );

		_this.renderTargetR.setSize(
			dispParams.canvasWidth, dispParams.canvasWidth );

	} );

};
