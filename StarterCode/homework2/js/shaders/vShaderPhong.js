/**
 * @file Phong vertex shader only with point lights
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2018/03/28
 */

/* TODO (2.2.1) */

var shaderID = "vShaderPhong";

var shader = document.createTextNode( `
/**
 * varying qualifier is used for passing variables from a vertex shader
 * to a fragment shader. In the fragment shader, these variables are
 * interpolated between neighboring vertexes.
 */
varying vec3 normalCam; // Normal in view coordinate
varying vec3 fragPosCam; // Vertex/Fragment position in view cooridnate

uniform mat4 modelViewMat;
uniform mat4 projectionMat;
uniform mat3 normalMat;

attribute vec3 position;
attribute vec3 normal;

void main() {

	gl_Position = projectionMat * modelViewMat * vec4( position, 1.0 );

	// transform position to view space
	fragPosCam = vec4(modelViewMat * vec4(position,1.0)).xyz;
  
  	// transform normal into view space
	normalCam = normalMat * normal;
}
` );


var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-vertex" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
