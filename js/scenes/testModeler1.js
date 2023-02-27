import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";
// Controller states
let leftTriggerPrev = false;
let rightTriggerPrev = false;
let M = cg.mTranslate(0,1,0);
let MH = cg.mTranslate(.24,1,0);
let MA= cg.mIdentity();

let modelingColors = [
    [1,1,1],     // white
    [1,0,0],     // red
    [1,.2,0],    // orange
    [1,1,0],     // yellow
    [0,1,0],     // green
    [0,1,1],     // cyan
    [.2,.2,1],   // blue
    [1,0,1],     // violet
    [.3,.1,.05], // brown
    [0,0,0],     // black
];
let alpha_edit = 0.2;
let edit_color = modelingColors[0];
let selection_color = modelingColors[1];
let handle_default_color = modelingColors[1];
let handle_selected_color = modelingColors[2];

// SPHERE
// meshes for showing and editing the sphere
// TODO: add custom torus
let sphere_geo, sphere_centroid, sphere_handle, sphere_edit;
// data structure for storing sphere spacial info
let sphere_center=[0,0,0];
let sphere_radius = .12;
let sphere_prev_radius = .1;
let handle_radius = .02;
let sphere_handle_pos = [.5,0,0];

// CUBE
// meshes for showing and editing the cube
let cube_geo, cube_centroid, cube_edit, cube_handle;// "cube-handle" needs to be 6 faces or face centers

// Modes: edit or move
let isEdit = true, isMove = true;

export const init = async model => {
    let isAnimate = true, isBlending = true, isRubber = true, t = 0;


    if (isEdit){
        // support geometry
        sphere_centroid = model.add('sphere').color(0,0,0);
        sphere_handle = model.add('sphere').color(handle_default_color);
        sphere_edit = model.add('sphere').color(edit_color);
        // actual geometry
        sphere_geo = model.add('sphere').color(modelingColors[5]);
    }
    else{
        sphere_geo = model.add('sphere').color(modelingColors[5]);
    }
// Editing interactions
    let isOnHandle = p => {
        // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.
        let q = cg.mTransform(cg.mInverse(sphere_geo.getMatrix()), p);
        // THEN WE JUST NEED TO SEE IF THE RESULT IS INSIDE A UNIT CUBE.
        return q[0] >= -1.4 & q[0] <= 1.4 &&
            q[1] >= -1.4 & q[1] <= 1.4 &&
            q[2] >= -1.4 & q[2] <= 1.4 ;
    }
    // let shape2 = model.add('cube').color(modelingColors[1]);

    model.animate(() => {
        //Controller updates
        let ml = controllerMatrix.left;
        let mr = controllerMatrix.right;
        let isRightOnHandle = isOnHandle(mr.slice(12,15));

        if(isEdit){
            let rightTrigger = buttonState.right[0].pressed;
            if(isRightOnHandle){
                sphere_handle.color(handle_selected_color);
                sphere_geo.color(0,0,1);
                if(rightTrigger){
                    // update matrix
                    let MB = mr.slice();
                    if (! rightTriggerPrev)        // ON RIGHT DOWN EVENT:
                        MA = MB;
                    else{
                        M = cg.mMultiply(cg.mMultiply(MB, cg.mInverse(MA)), M);
                    }
                    MA = MB;                       // REMEMBER PREVIOUS MATRIX.
                    // update sphere radius
                    let dist=cg.distance(M.slice(12,15),sphere_center);
                    sphere_radius=Math.abs(dist);
                }
                rightTriggerPrev = rightTrigger;
            }
            else{
                sphere_centroid.setMatrix(M).scale(.02);
                sphere_geo.setMatrix(M).scale(sphere_prev_radius*2).opacity(1-alpha_edit);
                sphere_edit.setMatrix(M).scale(sphere_radius*2).opacity(alpha_edit);
                sphere_handle.setMatrix(MH).scale(handle_radius*2);
            }
        }
        else{
            sphere_geo.scale(sphere_radius*2);
        }
        // model.blend(true);
        // model.melt(false);
        //t += isAnimate ? model.deltaTime : 0;
        // shape2.identity().move(-1,0,0).scale(.8);
        // let bend = .7-.7*Math.cos(t);
        // shape1.identity().move(bend,0,0).scale(.5);
    });
}