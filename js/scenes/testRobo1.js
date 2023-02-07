import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

export const init = async model => {
    let cube = model.add('cube').texture('../media/textures/brick.png');

    // spacing variables
    let leg_spacing =0.16;
    let lense_spacing = 0.4;
    // size variables
    let lense_dia = 0.16;

    let boxBody = model.add();
    boxBody.add('cube').color(.87,.68,.5).texture('../media/textures/box-side.png');//front side
    boxBody.add('cube').color(.80,.62,.44).texture('../media/textures/box-front.png');//right side
    boxBody.add('cube').color(.87,.68,.5).texture('../media/textures/box-side.png');// back side
    boxBody.add('cube').color(.80,.62,.44).texture('../media/textures/box-front.png');//right side
    boxBody.add('cube').color(.87,.68,.5).texture('../media/textures/box-front.png');//bottom

    let box = model.add();
    box.add(boxBody);
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-front.png');// flaps
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-front.png');// flaps
    box.add('cube').color(0,0,0).texture('../media/textures/black-metal.jpeg');// beard
    box.add('cube').color(0,0,0).texture('../media/textures/black-metal.jpeg');// beard

    let shoe1 = model.add();
    shoe1.add('sphere').color(0.05,0.03,0.01).texture('../media/textures/black-metal.jpeg');
    shoe1.add('sphere').color(0.05,0.03,0.01).texture('../media/textures/black-metal.jpeg');
    shoe1.add('sphere').color(0.05,0.03,0.01).texture('../media/textures/black-metal.jpeg');

    let shoe2 = model.add();
    shoe2.add('sphere').color(0.05,0.03,0.01).texture('../media/textures/black-metal.jpeg');
    shoe2.add('sphere').color(0.05,0.03,0.01).texture('../media/textures/black-metal.jpeg');
    shoe2.add('sphere').color(0.05,0.03,0.01).texture('../media/textures/black-metal.jpeg');

    let leg1 = model.add();
    leg1.add('tubeY').color(0.55,.45,.2).texture('../media/textures/plaid1.jpeg');
    leg1.add('tubeY').color(0.55,.45,.2).texture('../media/textures/plaid1.jpeg');
    leg1.add('sphere').color(0.55,.45,.2).texture('../media/textures/plaid1.jpeg');
    leg1.add(shoe1);

    let leg2 = model.add();
    leg2.add('tubeY').color(.55,.45,.2).texture('../media/textures/plaid1.jpeg');
    leg2.add('tubeY').color(.55,.45,.2).texture('../media/textures/plaid1.jpeg');
    leg2.add('sphere').color(.55,.45,.2).texture('../media/textures/plaid1.jpeg');
    leg2.add(shoe2);

    let lense = model.add();
    lense.add('tubeZ').color(.3,.2,.1).texture('../media/textures/black-metal.jpeg');
    lense.add('tubeZ').color(.3,.2,.1).texture('../media/textures/black-metal.jpeg');
    lense.add('tubeZ').color(1,1,1).texture('../media/textures/glass1.jpeg');
    lense.add('tubeZ').color(1,1,1).texture('../media/textures/glass1.jpeg');
    lense.add('cube').color(.3,.2,.1).texture('../media/textures/black-metal.jpeg');

    let eye = model.add();
    eye.add('sphere').color(.2,.7,1).texture('../media/textures/glass1.jpeg');
    eye.add('sphere').color(.2,.7,1).texture('../media/textures/glass1.jpeg');
    eye.add('sphere').color(0,0,0);
    eye.add('sphere').color(0,0,0);

    let globe = model.add();
    globe.add('sphere').color(.9,1,1).texture('../media/textures/grass1.avif');
    globe.add('tubeX').color(1,1,1).texture('../media/textures/road2.png');


    let hat = model.add();
    hat.add('sphere').color(.3,.69,1).texture('../media/textures/tweed.jpeg');
    hat.add('sphere').color(.3,.69,1).texture('../media/textures/tweed.jpeg');
    hat.add('tubeY').color(.3,.69,1).texture('../media/textures/tweed.jpeg');
    hat.add('sphere').color(0.96, 0.29, 0.54).texture('../media/textures/pink-fur.jpeg');

    model.move(0,1.5,0).scale(.3).animate(() => {
        cube.identity().move(Math.sin(model.time),4,0)
            .turnX(model.time)
            .turnY(model.time)
            .turnZ(model.time)
            .scale(.4);

        // boxBody
        boxBody.child(0).identity().move(0,0,.58).scale(.58,.5,.01);//front
        boxBody.child(1).identity().move(-.58,0,0).scale(.01,.5,.58);//left side
        boxBody.child(2).identity().move(0,0,-.58).scale(.58,.5,.01);//back
        boxBody.child(3).identity().move(.58,0,0).scale(.01,.5,.58);//right side
        boxBody.child(4).identity().move(0,-.4,0).scale(.58,.1,.58);

        // box.child(0).identity().scale(.58,.5,.58);
        box.child(1).identity().move(-.83,.35,0).turnZ(0.5).scale(.3,.01,.58);
        box.child(2).identity().move(.83,.35,0).turnZ(-0.5).scale(.3,.01,.58);
        box.child(3).identity().move(-.1,-.16,.54).turnZ(.3).turnX(-0.6).scale(.08,.06,.06);
        box.child(4).identity().move(.1,-.16,.54).turnZ(-.3).turnX(-0.6).scale(.08,.06,.06);

        // leg left
        shoe1.child(0).identity().move(Math.sin(3*model.time-.5)/5 +.34,-1.1,-leg_spacing).scale(.16,0.05,0.1);
        shoe1.child(1).identity().move(Math.sin(3*model.time-.5)/5 +.28,-1.1,-leg_spacing).scale(.12,0.05,0.1);
        shoe1.child(2).identity().move(Math.sin(3*model.time-.5)/5 +.29,-1.05,-leg_spacing).scale(.09);
        shoe1.identity().turnY(-Math.PI/2).turnZ(Math.sin(3*model.time-.5)/2.2 -0.39);

        leg1.child(0).identity().move(0,-.6,-leg_spacing).scale(.1,.15,.1);
        leg1.child(1).identity().move(Math.sin(3*model.time-.5)/15 -.08,-.94,-leg_spacing).turnZ(Math.sin(3*model.time-.5)/2.2 -0.4).scale(.1,.15,.1);
        leg1.child(2).identity().move(-0.01,-.8,-leg_spacing).turnY(-Math.PI/4).turnX(Math.PI/2).scale(.11);
        leg1.identity().turnY(-Math.PI/2).turnZ(Math.sin(3*model.time-.5)/2);

        // leg right
        shoe2.child(0).identity().move(Math.sin(3*model.time-.5)/5 +.34,-1.1,leg_spacing).scale(.16,0.05,0.1);
        shoe2.child(1).identity().move(Math.sin(3*model.time-.5)/5 +.28,-1.1,leg_spacing).scale(.12,0.05,0.1);
        shoe2.child(2).identity().move(Math.sin(3*model.time-.5)/5 +.29,-1.05,leg_spacing).scale(.09);
        shoe2.identity().turnY(-Math.PI/2).turnZ(Math.sin(3*model.time+1.7)/1.4 -0.39);


        leg2.child(0).identity().move(0,-.6,leg_spacing).scale(.1,.15,.1);
        leg2.child(1).identity().move(Math.sin(3*model.time+1.5)/15 -.08,-.94,leg_spacing).turnZ(Math.sin(3*model.time+1.5)/2.2 -0.4).scale(.1,.15,.1);
        leg2.child(2).identity().move(-0.01,-.8,leg_spacing).turnY(-Math.PI/4).turnX(Math.PI/2).scale(.11);
        leg2.identity().turnY(-Math.PI/2).turnZ(Math.sin(3*model.time+1.5)/2);


        // shoe1.identity().move(Math.sin(model.time-.5)/3 -.08,-.94,0).turnZ(Math.sin(model.time-.5)/2.2).turnZ(Math.sin(model.time-.5)/2);
        hat.child(0).identity().move(-.5,.64,.52).turnZ(-1.5).turnY(1.8).scale(.14,0.16,0.16);
        hat.child(1).identity().move(-.5,.77,.52).turnZ(-1.5).turnY(1.8).scale(.1,0.12,0.12);
        hat.child(2).identity().move(-.5,.55,.52).turnZ(.05).turnX(-.1).scale(.18,.05,.18);
        hat.child(3).identity().move(-.5,.92,.52).turnZ(.05).turnY(-.5).scale(.06,.06,.06);
        hat.identity().turnZ(.2).move(.13,.1,-.3);

        lense.child(0).identity().move(-lense_spacing/2,.1,.59).scale(lense_dia,lense_dia,.01);
        lense.child(1).identity().move(lense_spacing/2,.1,.59).scale(lense_dia,lense_dia,.01);
        lense.child(2).identity().move(-lense_spacing/2,.1,.59).scale(lense_dia-.02,lense_dia-.02,.011);
        lense.child(3).identity().move(lense_spacing/2,.1,.59).scale(lense_dia-.02,lense_dia-.02,.011);
        lense.child(4).identity().move(0,.1,.59).scale(lense_spacing/2-lense_dia+.01,.016,.01);

        eye.child(0).identity().move(-lense_spacing/2,.1,.6).scale(.06,.06,.011);
        eye.child(1).identity().move(lense_spacing/2,.1,.6).scale(.06,.06,.011);
        eye.child(2).identity().move(-lense_spacing/2,.1,.6).scale(.05,.05,.014);
        eye.child(3).identity().move(lense_spacing/2,.1,.6).scale(.05,.05,.014);
        eye.identity().move(Math.sin(1.5*model.time)/20,0,0);

        globe.child(0).identity().turnY(Math.PI/2).scale(4.6);
        globe.child(1).identity().scale(.7,4.63,4.63);
        globe.identity().move(0,-5.8,0).turnX(-model.time/4);



    });
}