/**
 * @file Gouraud vertex shader
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2018/03/28
 */

/* TODO (2.1.2) and (2.1.3) */

var shaderID = "vShaderGouraud";

var shader = document.createTextNode( `

/*
 * varying qualifier is used for passing variables from a vertex shader
 * to a fragment shader. In the fragment shader, these variables are
 * interpolated between neighboring vertexes.
 */
varying vec3 vColor; /* Color at a vertex */

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelViewMat;
uniform mat3 normalMat;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

uniform Material material;

uniform vec3 attenuation;

uniform vec3 ambientLightColor;

attribute vec3 position;
attribute vec3 normal;


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

vec3 computeReflections(PointLight light, vec4 viewNormal, vec4 viewPosition) {
	//Light stuff
	vec4 viewLightPos = viewMat * vec4(light.position, 1.0);

	vec4 lightVec = viewLightPos - viewPosition;
	vec4 lightNormal = normalize(lightVec);
	float lightMag = length(lightVec);

	//diffuse
	vec3 diffuse = (material.diffuse * light.color * max(dot(viewNormal, lightNormal), 0.0));

	//attenuation
	float attenuationAmmount = 1.0/(attenuation[0] + (attenuation[1] * lightMag) + (attenuation[2] * pow(lightMag,2.0)));
	
	//specular
	vec4 R = reflect(-lightNormal, viewNormal);
	vec4 V = - normalize(viewPosition);
	
	float rdotv = dot(R,V);

	vec3 specular = material.specular * light.color * pow(max(rdotv, 0.0), 60.0);

	return attenuationAmmount * (diffuse + specular);
}

void main() {

	// Compute ambient reflection
	vec3 ambientReflection = material.ambient * ambientLightColor;

	gl_Position =
		projectionMat * modelViewMat * vec4( position, 1.0 );


	//transform surface normal and position from object space to view space

	vec4 viewNormal =vec4(normalMat * normal, 1.0);
	vec4 viewPosition = modelViewMat * vec4(position, 1.0);


	vec3 reflectionColor = vec3(0.0);
	for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
		reflectionColor += computeReflections(pointLights[i], viewNormal, viewPosition);
	}

	
	vColor = ambientReflection + reflectionColor;
}
` );

var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-vertex" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
