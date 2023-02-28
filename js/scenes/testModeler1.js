import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";
// Controller states
let leftTriggerPrev = false;
let rightTriggerPrev = false;
let M = cg.mTranslate(0,1,0);
let MH = cg.mTranslate(.12,1,0);
let MA= cg.mIdentity();
let MR = cg.mTranslate(0,1,0);// for visualizing sphere radius

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
    [1,.2,.2],     // pink
];
let alpha_edit = 0.2;
let edit_color = modelingColors[0];
let selection_color = modelingColors[1];
let handle_default_color = modelingColors[1];
let handle_selected_color = modelingColors[2];
let handle_hover_color = modelingColors[10];

// SPHERE
// meshes for showing and editing the sphere
// TODO: add custom torus
let sphere_geo, sphere_centroid, sphere_handle, sphere_edit, radius_edit;
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
        radius_edit = model.add('tubeX').color(edit_color);
        // actual geometry
        sphere_geo = model.add('sphere').color(modelingColors[5]);
    }
    else{
        sphere_geo = model.add('sphere').color(modelingColors[5]);
    }
// Editing interactions
    let isOnHandle = p => {
        // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.
        let q = cg.mTransform(cg.mInverse(sphere_handle.getMatrix()), p);
        // THEN WE JUST NEED TO SEE IF THE RESULT IS INSIDE A UNIT CUBE.
        return q[0] >= -1.5 & q[0] <= 1.5 &&
            q[1] >= -1.5 & q[1] <= 1.5 &&
            q[2] >= -1.5 & q[2] <= 1.5 ;
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
                sphere_handle.color(handle_hover_color);
                if(rightTrigger){
                    // update color
                    sphere_handle.color(handle_selected_color);
                    // update matrix
                    let MB = mr.slice();
                    if (! rightTriggerPrev)        // ON RIGHT DOWN EVENT:
                        MA = MB;
                    else{
                        MH = cg.mMultiply(cg.mMultiply(MB, cg.mInverse(MA)), MH);
                        // let MHR = cg.subtract(MH.slice(12,15),M.slice(12,15));
                        let dX = MH[12]-M[12];
                        let dZ = MH[14]-M[14];
                        // let dY = MHR[1];
                        //let dZ = cg.distance(MH.slice(14,15),M.slice(14,15));
                        let thetaY = Math.atan(dZ/dX);
                        MR = cg.mMultiply(cg.mTranslate(0,1,0), cg.mRotateY(thetaY));
                    }
                    MA = MB;                       // REMEMBER PREVIOUS MATRIX.
                    // update sphere radius
                    let dist=cg.distance(MH.slice(12,15),M.slice(12,15));
                    sphere_radius=Math.abs(dist);
                }
                rightTriggerPrev = rightTrigger;
            }

            if (sphere_radius<sphere_prev_radius)
                alpha_edit=0.8;
            else
                alpha_edit=0.2;
            // update radius line position
            //MR[12]=M[12]+sphere_radius/2;
            // MR[0]=MH[0]-M[0];
            // MR[4]=MH[4]-M[4];
            // MR[8]=MH[8]-M[8];
            // MR[1]=MH[1]-M[1];
            // MR[5]=MH[5]-M[5];
            // MR[9]=MH[9]-M[9];
            // MR[2]=MH[2]-M[2];
            // MR[6]=MH[6]-M[6];
            // MR[10]=MH[10]-M[10];
            sphere_centroid.setMatrix(M).scale(.02);
            sphere_geo.setMatrix(M).scale(sphere_prev_radius).opacity(1-alpha_edit);
            sphere_edit.setMatrix(M).scale(sphere_radius).opacity(alpha_edit);
            radius_edit.setMatrix(MR).scale(sphere_radius,.006,.006);
            sphere_handle.setMatrix(MH).scale(handle_radius*1.6);
        }
        else{
            sphere_geo.scale(sphere_radius);
        }
        // model.blend(true);
        // model.melt(false);
        //t += isAnimate ? model.deltaTime : 0;
        // shape2.identity().move(-1,0,0).scale(.8);
        // let bend = .7-.7*Math.cos(t);
        // shape1.identity().move(bend,0,0).scale(.5);
    });
}