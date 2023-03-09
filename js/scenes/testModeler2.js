import * as cg from "../render/core/cg.js";
import { g2 } from "../util/g2.js";
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";
import {mScale} from "../render/core/cg.js";

// CONTROLLER STATES
let leftTriggerPrev = false;
let rightTriggerPrev = false;
let M = cg.mTranslate(0,1,0); // Cube's matrix for Translation and Rotation
let MF = [cg.mIdentity(),cg.mIdentity(),cg.mIdentity()];// to store 3 faces' centroids
let MA = [cg.mIdentity(),cg.mIdentity(),cg.mIdentity()]; // remember last-used handle positions
let HA = [[0,0,0], [0,0,0], [0,0,0]];
// TODO: add supporting line (from cube centroid to face centroid)

let modelingColors = [
    [1,1,1],     // white
    [1,0,0],     // red
    [1,.2,0],    // orange
    [1,1,0],     // yellow
    [.05,.8,.1],  // green
    [0,1,1],     // cyan
    [.2,.2,1],   // blue
    [1,0,1],     // violet
    [.3,.1,.05], // brown
    [0,0,0],     // black
    [1,.2,.2],     // pink
];

let obj1, obj2;
let button_pressed_c = '#f0f0ff';
let scale_btn_x = .176, move_btn_x = .5, rotate_btn_x = .82;
let scale_btn_y = .176, move_btn_y = .5, rotate_btn_y = .82;
let layout = 'vertical';
// CUBE GEO
// cube geometry
let cube_geo, cube_geo_edit;
let cube_faces; // for edit mode
let cube_f_centroids;
let geo_group;// geometry bodies that blend
// cube specs
let cube_sizes_edit =[.1,.1,.1]; // size along x, y, z axis
let cube_sizes =[.1,.1,.1];
let cube_f_colors = [[1,.3,.1], [0,.8,1], [.3,1,.2]]; // face highlight colors for box geometry
let handle_radius = 0.02;
let isEditing = false, isRotating = false, isScaling = false, isTranslating = false;

export const init = async model => {
    model.setTable(false);

    //// ADD EDIT MODE HUD
    // DRAWING PAD WITH COLOR SLIDER AND SHAPE RECOGNITION
    // obj2 : actions menu
    obj2 = model.add('cube').texture(() => {
        g2.setColor('#101010');
        if (layout == 'vertical'){
            g2.fillRect(.18,0,.64,1);
            g2.setColor('white');
            g2.textHeight(.072);
            g2.fillText('Transform Mode', .5, .9, 'center');
        }
        else {
            g2.setColor('white');
            g2.textHeight(.08);
            g2.fillRect(0,0,1,.5);
        }
        if (! g2.drawWidgets(obj2)){console.log("mouse pressed");} // BUG NOTE: "if" and "else" statements have to be followed with {} to compile. One-liners statements after if/else don't work.
    });// QUESTION: styling button size? -> create custom js file in render/nodes ?
    // Layout 1: vertical
    if (layout == 'vertical'){
        g2.addWidget(obj2, 'button', .37, .72, '#a0a0a0', 'Cancel', () => {if (isEditing){isEditing=false;}});
        g2.addWidget(obj2, 'button', .67, .72, '#50a0ff', 'Save', () => {if (isEditing){cube_sizes = cube_sizes_edit.slice();isEditing=false;}});
        g2.addWidget(obj2, 'button', .5, .52, '#f0f0f0', ' Scale ', () => {if (!isScaling) { isEditing=true;}});
        g2.addWidget(obj2, 'button', .5, .32, '#f0f0f0', ' Move ', () => {if (!isTranslating) {isTranslating = true;}});
        g2.addWidget(obj2, 'button', .5, .12, '#f0f0f0', 'Rotate', () => {if (!isRotating) {isRotating = true;}});
    }
    // Layout 2: horizontal
    else{
        g2.addWidget(obj2, 'button', .556, .28, '#a0a0a0', 'Cancel', () => {});
        g2.addWidget(obj2, 'button', .85, .28, '#50a0ff', 'Save', () => {});
        g2.addWidget(obj2, 'button', .176, .1, '#f0f0f0', ' Scale ', () => {if (!isScaling) { isScaling = true;}});
        g2.addWidget(obj2, 'button', .5, .1, '#f0f0f0', ' Move ', () => {if (!isTranslating) {isTranslating = true;}});
        g2.addWidget(obj2, 'button', .82, .1, '#f0f0f0', 'Rotate', () => {if (!isRotating) {isRotating = true;}});
    }
    let edit_highlight_bar = model.add("cube").color(.2,.4,1);
    let edit_highlight_dot = model.add("tubeZ").color(.2,.4,1);
    //// END OF EDIT MODE HUD

    //// EDIT MODE GEOMETRY
    // ADD CUBE
    cube_geo = model.add('cube').color(modelingColors[6]);
    cube_geo_edit = model.add('cube').color(modelingColors[0]);
    // ADD CUBE_FACES
    cube_faces = model.add();
    cube_f_centroids = model.add();
    for (let f=0; f<3; f++){
        cube_faces.add('cube').color(cube_f_colors[f]);
        cube_f_centroids.add('sphere').color(modelingColors[3]);
    }
    //// END OF EDIT MODE GEOMETRY

    //// SETUP PER-FACE MATRICES
    for (let f=0; f<3; f++) {
        MF[f] = M.slice();
        let f_size=[0,0,0];
        f_size[f] = cube_sizes_edit[f];
        MF[f][12+f] = M[12+f]+cube_sizes_edit[f];
    }

    //// Controller interaction
    let isOnHandle = p => {
        for (let f =0; f<3; f++){
            // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.
            // let q = cg.mTransform(cg.mInverse(MF[f]), p);
            // TODO:Try just checking the distance from controller to face centroid
            let dist = cg.distance(MF[f].slice(12,15),p);
            if(dist<handle_radius*1.5){ return f; }
        }
        return -1;
    }

    model.animate(() => {
        //// HUD: obj2
        obj2.identity().move(-.5,1.5,0).scale(.25,.25,.0001);
        if (layout == 'vertical'){edit_highlight_bar.identity().scale(0); edit_highlight_dot.identity().move(.3,4.5,0).scale(.05,.05,.002);}
        else{edit_highlight_bar.identity().move(2*scale_btn_x-1.005,4.288,0).scale(.3,.014,.002);edit_highlight_dot.identity().scale(0);}
        //// EDIT MODE
        if (isEditing){
            let ml = controllerMatrix.left;
            let mr = controllerMatrix.right;
            let rightTrigger = buttonState.right[0].pressed;
            let isRightOnHandle = isOnHandle(mr.slice(12,15));

            if (isRightOnHandle>=0){
                let f = isRightOnHandle;
                let dist = cg.distance(MF[f].slice(12,15),mr.slice(12,15));
                if (rightTrigger){
                    let B = HA[f].slice();
                    B[f]=mr[12+f];
                    if (! rightTriggerPrev)
                        HA[f] = B;
                    else{
                        MF[f] = cg.mMultiply(cg.mTranslate(cg.subtract(B, HA[f])), MF[f]);// todo: change this
                        cube_sizes_edit[f]=MF[f][12+f]-M[12+f];
                    }
                    HA[f] = B;
                    cube_f_centroids.child(f).color(modelingColors[1])
                }
                else {cube_f_centroids.child(f).color(modelingColors[2]); }
                rightTriggerPrev = rightTrigger;
            }
            else {
                for (let f=0; f<3;f++)
                    cube_f_centroids.child(f).color(modelingColors[3]);}

            //// GEOMETRY
            cube_geo.setMatrix(M).scale(cube_sizes).opacity(0.8);
            cube_geo_edit.setMatrix(M).scale(cube_sizes_edit).opacity(0.2);

            for (let f=0; f<3; f++){
                let f_size=cube_sizes_edit.slice();
                f_size[f]=.001;
                cube_faces.child(f).setMatrix(MF[f]).scale(f_size).color(cube_f_colors[f]).opacity(0.6);
                cube_f_centroids.child(f).setMatrix(MF[f]).scale(handle_radius);
            }
        }
        //// END OF EDIT MODE
        else{
            cube_geo.setMatrix(M).scale(cube_sizes).opacity(1);
            cube_geo_edit.setMatrix(M).scale(0);
            cube_faces.setMatrix(M).scale(0);
            cube_f_centroids.setMatrix(M).scale(0);
        }
    });
}