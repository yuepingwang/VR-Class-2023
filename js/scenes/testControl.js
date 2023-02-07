import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

/*********************************************************************************
 This demo shows how you can do basic object manipulation with your controllers.
 (1) Moving an object
 When you place your left controller inside the box, the box turns pink.
 Then when you squeeze the left trigger,
 the box turns red and moves together with your controller.
 (2) Moving and rotating an object
 When you place your right controller inside the box, the box turns light blue.
 Then when you squeeze the right trigger,
 the box turns blue and both moves and rotates together with your controller.
 *********************************************************************************/

let leftTriggerPrev = false;
let rightTriggerPrev = false;

let MP = cg.mTranslate(0,1,.5);
let MS = cg.mTranslate(0,1,0);
let A = [0,0,0];
let MA = cg.mIdentity();

export const init = async model => {

    // CREATE THE BOX.
    let box = model.add('cube');

    // FUNCTION TO RETURN TRUE IF A POINT IS INSIDE THE BOX, OTHERWISE FALSE.
    let isInBox = p => {

        // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.
        let q = cg.mTransform(cg.mInverse(box.getMatrix()), p);
        // THEN WE JUST NEED TO SEE IF THE RESULT IS INSIDE A UNIT CUBE.
        return q[0] >= -1 & q[0] <= 1 &&
            q[1] >= -1 & q[1] <= 1 &&
            q[2] >= -1 & q[2] <= 1 ;
    }

    // create a sphere and cylinder
    let sphere = model.add('sphere').color(1,0,0);
    let cylinder = model.add('tubeY').color(.5,.5,.5);

    let isInSphere = p =>{
        let q = cg.mTransform(cg.mInverse(sphere.getMatrix()), p);
        return q[0] >= -1 & q[0] <= 1 &&
            q[1] >= -1 & q[1] <= 1 &&
            q[2] >= -1 & q[2] <= 1 ;
    }

    model.animate(() => {

        // FETCH THE MATRIXES FOR THE LEFT AND RIGHT CONTROLLER.
        let ml = controllerMatrix.left;
        let mr = controllerMatrix.right;

        // EXTRACT THE LOCATION OF EACH CONTROLLER FROM ITS MATRIX,
        // AND USE IT TO SEE WHETHER THAT CONTROLLER IS INSIDE THE BOX.
        let isLeftInBox  = isInBox(ml.slice(12,15));
        let isRightInBox = isInBox(mr.slice(12,15));
        box.identity().move(-2,-2,0);

        let isLeftInSphere  = isInSphere(ml.slice(12,15));
        let isRightInSphere = isInSphere(mr.slice(12,15));
        // sphere.identity().scale(0.2);

        // IF NEITHER CONTROLLER IS INSIDE THE BOX, COLOR THE BOX WHITE.

        if (! isLeftInSphere && ! isRightInSphere)
            sphere.color(1,0,0);

        // IF THE LEFT CONTROLLER IS INSIDE THE BOX

        if (isLeftInSphere) {

            // COLOR THE BOX PINK.

            sphere.color(0,.9,.5);

            // IF THE LEFT TRIGGER IS SQUEEZED

            let leftTrigger = buttonState.left[0].pressed;
            if (leftTrigger) {

                // COLOR THE BOX RED AND MOVE THE BOX.

                sphere.color(.9,.3,.2);
                let B = ml.slice(12,15);
                if (! leftTriggerPrev)         // ON LEFT DOWN EVENT:
                    A = B;                      // INITIALIZE PREVIOUS LOCATION.
                else
                    MP = cg.mMultiply(cg.mTranslate(cg.subtract(B, A)), MP);

                A = B;                         // REMEMBER PREVIOUS LOCATION.
            }
            leftTriggerPrev = leftTrigger;
        }

        // IF THE RIGHT CONTROLLER IS INSIDE THE BOX

        if (isRightInSphere) {

            // COLOR THE BOX LIGHT BLUE.

            sphere.color(.5,.5,1);

            // IF THE RIGHT TRIGGGER IS SQUEEZED

            let rightTrigger = buttonState.right[0].pressed;
            if (rightTrigger) {

                // COLOR THE BOX BLUE AND MOVE AND ROTATE THE BOX.

                sphere.color(0,0,1);
                // .slice() as cloning the whole matrix?
                let MB = mr.slice();
                // clone matrix to
                MS = mr.slice();

                // ON RIGHT DOWN EVENT:
                if (! rightTriggerPrev)   {
                    MA = MB;                    // INITIALIZE PREVIOUS MATRIX.
                    let dY = MS.getY();
                    let dX = MS.getX();
                    let theta = Math.atan(dY/dX);
                    // construct a rotation matrix
                    let Mrotation = cg.mIdentity();
                    //MS = cylinder.identity();
                    MS = cg.mTranslate(0,1,0).rotateX(theta);
                }
                else{
                    MP = cg.mMultiply(cg.mMultiply(MB, cg.mInverse(MA)), MP);
                }

                MA = MB;                       // REMEMBER PREVIOUS MATRIX.
            }
            rightTriggerPrev = rightTrigger;
        }

        // DISPLAY THE BOX.

        sphere.setMatrix(MP).scale(.1);
        cylinder.setMatrix(MS).scale(.01,.5,.01);
    });
}