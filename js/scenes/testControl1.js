import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

let leftTriggerPrev = false;
let rightTriggerPrev = false;
let keyMoved =false;

let MP = cg.mTranslate(0,.65,.85);
let A = [0,0,0];
let MA = cg.mIdentity();
// Transform matrices for the key
let MK = cg.mTranslate(0,.65,.85);
let MKA= cg.mIdentity();
// Transform matrices for the door
let MD = cg.mTranslate(-1,1,0);
let MDA = cg.mIdentity();;// track rotation (around Y)
let theta = 0;
// handle
let MH = cg.mTranslate(0,1,0);

export const init = async model => {

    // Create the door
    let door = model.add();
    door.add('cube').color(.36,.20,.12);// door panel
    door.add('tubeZ').color(.87,.68,.5);// door handle

    let doorFrame = model.add();
    doorFrame.add('cube').color(.40,.24,.15);// door frame top
    doorFrame.add('cube').color(.40,.24,.15);// door frame left
    doorFrame.add('cube').color(.40,.24,.15);// door frame right

    // Create the drawer
    let key = model.add('cube');
    let drawer = model.add();
    drawer.add('tubeZ');
    drawer.add('cube').color(.40,.24,.15);//front
    drawer.add('cube').color(.38,.22,.13);//left
    drawer.add('cube').color(.39,.23,.14);//back
    drawer.add('cube').color(.38,.22,.13);//right
    drawer.add('cube').color(.38,.22,.13);//bottom


    // FUNCTION TO RETURN TRUE IF A POINT IS INSIDE THE BOX, OTHERWISE FALSE.

    let isOnHandle = p => {
        // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.
        let q = cg.mTransform(cg.mInverse(drawer.getMatrix()), p);

        // THEN WE JUST NEED TO SEE IF THE RESULT IS INSIDE A UNIT CUBE.
        return q[0] >= -1.5 & q[0] <= 1.5 &&
            q[1] >= -1.5 & q[1] <= 1.5 &&
            q[2] >= -1.5 & q[2] <= 1.5 ;
    }
    let isOnKey = p => {
        // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.
        let q = cg.mTransform(cg.mInverse(key.getMatrix()), p);

        // THEN WE JUST NEED TO SEE IF THE RESULT IS INSIDE A UNIT CUBE.
        return q[0] >= -1.1 & q[0] <= 1.1 &&
            q[1] >= -1.1 & q[1] <= 1.1 &&
            q[2] >= -1.1 & q[2] <= 1.1 ;
    }

    let isOnDoor = p => {
        // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.
        let q = cg.mTransform(cg.mInverse(door.getMatrix()), p);

        // THEN WE JUST NEED TO SEE IF THE RESULT IS INSIDE A UNIT CUBE.
        return q[0] >= -1 & q[0] <= 1.0 &&
            q[1] >= -1 & q[1] <= 1.0 &&
            q[2] >= -1 & q[2] <= 1.0 ;
    }

    let isInsideDrawer = pk =>{
        let qk = cg.mTransform(cg.mInverse(drawer.getMatrix()), pk);
        return qk[0] >= -1.4 & qk[0] <= 1.4 &&
            qk[1] >= -1.4 & qk[1] <= 1.4 &&
            qk[2] >= -1.4 & qk[2] <= 1.4 ;
    }

    model.animate(() => {

        // FETCH THE MATRIXES FOR THE LEFT AND RIGHT CONTROLLER.
        let ml = controllerMatrix.left;
        let mr = controllerMatrix.right;

        key.identity().move(0,1,0);
        // EXTRACT THE LOCATION OF EACH CONTROLLER FROM ITS MATRIX,
        // AND USE IT TO SEE WHETHER THAT CONTROLLER IS INSIDE THE BOX.
        let isLeftOnHandle  = isOnHandle(ml.slice(12,15));
        let isRightOnKey = isOnKey(mr.slice(12,15));
        let isRightOnDoor = isOnDoor(mr.slice(12,15));

        // IF NEITHER CONTROLLER IS INSIDE THE BOX, COLOR THE BOX WHITE.

        if (! isLeftOnHandle)
            drawer.child(0).color(.1,.1,.1);

        if(! isRightOnKey)
            key.color(0,0,1);

        if(! isRightOnDoor)
            door.child(1).color(.1,.1,.1);
        // IF THE LEFT CONTROLLER IS INSIDE THE BOX

        if (isLeftOnHandle) {

            // COLOR THE BOX PINK.
            drawer.child(0).color(.9,.4,.4);
            // IF THE LEFT TRIGGER IS SQUEEZED
            let leftTrigger = buttonState.left[0].pressed;
            if (leftTrigger) {

                // COLOR THE BOX RED AND MOVE THE BOX.
                drawer.child(0).color(1,0,0);
                let B=[];
                B.push(A[0]);
                B.push(A[1]);
                B.push(ml[14]);// only move drawer along z direction. TODO: add clamping to z
                if (! leftTriggerPrev)         // ON LEFT DOWN EVENT:
                    A = B;                     // INITIALIZE PREVIOUS LOCATION.
                else
                    MP = cg.mMultiply(cg.mTranslate(cg.subtract(B, A)), MP);

                A = B;                         // REMEMBER PREVIOUS LOCATION.
            }
            leftTriggerPrev = leftTrigger;
        }

        // if (isRightOnDoor){
        //     door.child(1).color(.9,.4,.4);
        //     let rightTrigger = buttonState.right[0].pressed;
        //     if (rightTrigger) {
        //         // COLOR THE BOX BLUE AND MOVE AND ROTATE THE BOX.
        //         door.child(1).color(0,0,1);
        //         let MB = mr.slice();
        //         // ON RIGHT DOWN EVENT:
        //         if (! rightTriggerPrev){
        //             MDA = MB;                    // INITIALIZE PREVIOUS MATRIX.
        //         }
        //         else{
        //             let dZ = MB.getZ();
        //             let dX = MB.getX();
        //             theta = Math.atan(dZ/dX);
        //             let Mrotation = cg.mIdentity();
        //             MD = cg.mTranslate(1,1,0).rotateY(theta);
        //
        //             // MD = MD.rotateY(theta);
        //         }
        //         MDA = MB;                       // REMEMBER PREVIOUS MATRIX.
        //     }
        //     rightTriggerPrev = rightTrigger;
        // }
        // IF THE RIGHT CONTROLLER IS INSIDE THE BOX
        // else
            if (isRightOnKey) {
            // COLOR THE BOX LIGHT BLUE.
            key.color(.5,.5,1);
            // IF THE RIGHT TRIGGGER IS SQUEEZED

            let rightTrigger = buttonState.right[0].pressed;
            if (rightTrigger) {
                // COLOR THE BOX BLUE AND MOVE AND ROTATE THE BOX.
                key.color(0,0,1);
                let MB = mr.slice();
                if (! rightTriggerPrev)        // ON RIGHT DOWN EVENT:
                    MKA = MB;                    // INITIALIZE PREVIOUS MATRIX.
                else{
                    keyMoved = true;
                    MK = cg.mMultiply(cg.mMultiply(MB, cg.mInverse(MKA)), MK);
                }
                MKA = MB;                       // REMEMBER PREVIOUS MATRIX.
            }
            rightTriggerPrev = rightTrigger;
        }

        //Display door frame
        doorFrame.child(0).identity().move(-1.,2,-2).scale(.52,.02,.02);// door frame top
        doorFrame.child(1).identity().move(-1.5,1,-2).scale(.02,1.02,.02);// door frame left
        doorFrame.child(2).identity().move(-.5,1,-2).scale(.02,1.02,.02);// door frame right

        //Display door


        // Display drawer
        drawer.child(0).identity().move(0,0,.2).scale(.2);//handle
        drawer.child(1).identity().move(0,0,0).scale(2,.5,.1);//front
        drawer.child(2).identity().move(-2,0,-2).scale(.02,.5,2);//left
        drawer.child(3).identity().move(0,0,-4).scale(2,.5,.02);//back
        drawer.child(4).identity().move(2,0,-2).scale(.02,.5,2);//right side
        drawer.child(5).identity().move(0,-.5,-2).scale(2,.02,2);//bottom
        drawer.setMatrix(MP).scale(.1);

        key.identity().scale(.2);//handle
        // Display key
        if (!isRightOnKey && isInsideDrawer(MK.slice(12,15))){
            MK[14] = MP[14]-0.1;
            key.setMatrix(MK).scale(.04);
        }
        else{
            key.setMatrix(MK).scale(.04);
        }
            door.child(0).identity().move(-1,1,-2).scale(.48,.98,.02);// door panel
            door.child(1).identity().move(-.68,1,-2).scale(.04);// door handle
        //if (isRightOnDoor){
            //door.setMatrix(MD);
        //}
        // else{
        //     door.child(0).identity().move(-1,1,-2).scale(.48,.98,.02);// door panel
        //     door.child(1).identity().move(-.68,1,-2).scale(.04,.04,.1);// door handle
        //
        // }

    });
}