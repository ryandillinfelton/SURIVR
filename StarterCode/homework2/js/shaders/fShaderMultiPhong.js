/**
 * @file Phong fragment shader with point and directional lights
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2018/03/28
 */

/* TODO (2.3) */

var shaderID = "fShaderMultiPhong";

var shader = document.createTextNode( `
/**
 * WebGL doesn't set any default precision for fragment shaders.
 * Precision for vertex shader is set to "highp" as default.
 * Do not use "lowp". Some mobile browsers don't support it.
 */
precision mediump float;

varying vec3 normalCam; // Normal in view coordinate
varying vec3 fragPosCam; // Fragment position in view cooridnate

uniform mat4 viewMat;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

uniform Material material;

uniform vec3 attenuation;

uniform vec3 ambientLightColor;

/***
 * 1 is replaced to the number of point lights by the
 * replaceNumLights() function in teapot.js before the shader is compiled.
 */
#if NUM_POINT_LIGHTS > 0

	struct PointLight {
		vec3 position;
		vec3 color;
	};

	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

#endif

/***
 * 1 is replaced to the number of directional lights by the
 * replaceNumLights() function in teapot.js before the shader is compiled.
 */
#if NUM_DIR_LIGHTS > 0

	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};

	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

#endif



vec3 computeReflections(vec3 lightColor, vec3 lightDirection, vec4 viewNormal, vec4 viewPosition) {
	//Light stuff
	vec4 lightNormal = normalize(vec4(lightDirection,1.0));
	float lightMag = length(lightDirection);

	//diffuse
	vec3 diffuse = (material.diffuse * lightColor * max(dot(viewNormal, lightNormal), 0.0));

	//attenuation
	float attenuationAmmount = 1.0/(attenuation[0] + (attenuation[1] * lightMag) + (attenuation[2] * pow(lightMag,2.0)));
	
	//specular
	vec4 R = reflect(-lightNormal, viewNormal);
	vec4 V = - normalize(viewPosition);
	
	float rdotv = dot(R,V);

	vec3 specular = material.specular * lightColor * pow(max(rdotv, 0.0), 5.0);

	return attenuationAmmount * (diffuse + specular);
}


void main() {

	// Compute ambient reflection
	vec3 ambientReflection = material.ambient * ambientLightColor;

	vec3 reflectionColor = vec3(0.0);
	for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
		vec3 viewLightPos = vec4(viewMat * vec4(pointLights[i].position, 1.0)).xyz;
		vec3 lightVec = viewLightPos - fragPosCam;
		reflectionColor += computeReflections(pointLights[i].color, lightVec, vec4(normalCam,1.0), vec4(fragPosCam, 1.0));
	}

	for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
		reflectionColor += computeReflections(directionalLights[i].color, directionalLights[i].direction, vec4(normalCam,1.0), vec4(fragPosCam, 1.0));
	}



	vec3 fColor = ambientReflection + reflectionColor;

	gl_FragColor = vec4( fColor, 1.0 );
}

` );

var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-fragment" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
