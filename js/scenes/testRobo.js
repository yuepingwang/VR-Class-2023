import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

export const init = async model => {
    let cube = model.add('cube').texture('../media/textures/brick.png');
    // let tube1 = model.add('tubeX').color(1,0,0);
    // let tube2 = model.add('tubeY').color(0,1,0);
    // let tube3 = model.add('tubeZ').color(0,0,1);
    // let ball = model.add('sphere').color(1,1,0);

    // nested components
    // let head = model.add();
    // head.add('tubeY').color(0.4,0.4,0.42);
    // head.add('tubeY').color(0.4,0.4,0.42);

    let leg_spacing =0.1;
    let box = model.add();
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-side.png');//right side
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-front.png');//left side
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-side.png');// front side
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-front.png');//back side
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-front.png');//bottom
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-front.png');// flaps
    box.add('cube').color(.87,.68,.5).texture('../media/textures/box-front.png');// flaps

    let shoe1 = model.add();
    shoe1.add('sphere').color(0.55,0.3,0);
    shoe1.add('sphere').color(0.55,0.3,0);
    shoe1.add('sphere').color(0.55,0.3,0);

    let shoe2 = model.add();
    shoe2.add('sphere').color(0.55,0.3,0);
    shoe2.add('sphere').color(0.55,0.3,0);
    shoe2.add('sphere').color(0.55,0.3,0);

    let leg1 = model.add();
    leg1.add('tubeY').color(0.55,0.3,0).texture('../media/textures/tree2.jpeg');
    leg1.add('tubeY').color(0.55,0.3,0).texture('../media/textures/tree2.jpeg');
    leg1.add('sphere').color(0.55,0.3,0).texture('../media/textures/tree2.jpeg');
    leg1.add(shoe1);

    let leg2 = model.add();
    leg2.add('tubeY').color(0.55,0.3,0).texture('../media/textures/tree2.jpeg');
    leg2.add('tubeY').color(0.55,0.3,0).texture('../media/textures/tree2.jpeg');
    leg2.add('sphere').color(0.55,0.3,0).texture('../media/textures/tree2.jpeg');
    leg2.add(shoe2);



    // let leg2 = model.add();
    // leg2.add('tubeY').color(0,0,1);
    // leg2.add('tubeY').color(0,0,1);

    let hat = model.add();
    hat.add('sphere').color(.3,.59,.8).texture('../media/textures/tweed.jpeg').identity().scale(.1,0.3,0.3);

    model.move(0,1.5,0).scale(.3).animate(() => {
        cube.identity().move(Math.sin(model.time),4,0)
            .turnX(model.time)
            .turnY(model.time)
            .turnZ(model.time)
            .scale(.4);

        // body
        box.child(0).identity().move(0,0,.58).scale(.58,.5,.01);//right
        box.child(1).identity().move(-.58,0,0).scale(.01,.5,.29);
        // box.child(0).identity().scale(.58,.5,.58);
        box.child(2).identity().move(0,0,-.58).scale(.58,.5,.01);//left
        box.child(3).identity().move(.58,0,0).scale(.01,.5,.29);
        box.child(4).identity().move(0,-.4,0).scale(.58,.1,.58);
        box.child(5).identity().move(-.83,.35,0).turnZ(0.5).scale(.3,.01,.3);
        box.child(6).identity().move(.83,.35,0).turnZ(-0.5).scale(.3,.01,.3);

        // leg left
        shoe1.child(0).identity().move(Math.sin(3*model.time-.5)/5 +.34,-1.1,-leg_spacing).scale(.15,0.05,0.1);
        shoe1.child(1).identity().move(Math.sin(3*model.time-.5)/5 +.28,-1.1,-leg_spacing).scale(.12,0.05,0.1);
        shoe1.child(2).identity().move(Math.sin(3*model.time-.5)/5 +.29,-1.05,-leg_spacing).scale(.09);
        shoe1.identity().turnZ(Math.sin(3*model.time-.5)/2.2 -0.39);

        leg1.child(0).identity().move(0,-.6,-leg_spacing).scale(.1,.15,.1);
        leg1.child(1).identity().move(Math.sin(3*model.time-.5)/15 -.08,-.94,-leg_spacing).turnZ(Math.sin(3*model.time-.5)/2.2 -0.4).scale(.1,.15,.1);
        leg1.child(2).identity().move(-0.01,-.8,-leg_spacing).turnY(Math.PI/2).turnX(Math.PI/2).scale(.11);
        leg1.identity().turnZ(Math.sin(3*model.time-.5)/2);

        // leg right
        shoe2.child(0).identity().move(Math.sin(3*model.time-.5)/5 +.34,-1.1,leg_spacing).scale(.15,0.05,0.1);
        shoe2.child(1).identity().move(Math.sin(3*model.time-.5)/5 +.28,-1.1,leg_spacing).scale(.12,0.05,0.1);
        shoe2.child(2).identity().move(Math.sin(3*model.time-.5)/5 +.29,-1.05,leg_spacing).scale(.09);
        shoe2.identity().turnZ(Math.sin(3*model.time+1.7)/1.4 -0.39);

        leg2.child(0).identity().move(0,-.6,leg_spacing).scale(.1,.15,.1);
        leg2.child(1).identity().move(Math.sin(3*model.time+1.5)/15 -.08,-.94,leg_spacing).turnZ(Math.sin(3*model.time+1.5)/2.2 -0.4).scale(.1,.15,.1);
        leg2.child(2).identity().move(-0.01,-.8,leg_spacing).turnY(Math.PI/2).turnX(Math.PI/2).scale(.11);
        leg2.identity().turnZ(Math.sin(3*model.time+1.5)/2);


        // shoe1.identity().move(Math.sin(model.time-.5)/3 -.08,-.94,0).turnZ(Math.sin(model.time-.5)/2.2).turnZ(Math.sin(model.time-.5)/2);

        hat.identity().move(0,.5,0).turnZ(-1.3).turnY(-0.3);
        hat.identity().move(0,.5,0).turnZ(-1.3).turnY(-0.3);

        // head.child(0).identity().scale(0.2,.3,0.2);
        // head.child(1).identity().move(0,-0.4,0).turnX(0.2).scale(0.2,.04,0.2);

        //head.child(1).identity().move(Math.sin(model.time)/10,0.5,0).turnZ(Math.sin(model.time-.5)/2);
        // hat.identity().move(Math.sin(model.time)/5,1.5,0).turnZ(Math.sin(model.time-.5)/2).scale(.5);


        // eye.identity().move(0,1.5,0)
        //     .turnX(Math.sin(2.1*model.time))
        //     .turnY(Math.sin(1.0*model.time)).scale(.3);
        // eye.child(1).identity()
        //     .move(0,0,.6).scale([.6,.6,.5])
        //     .color(0,0,.5 + .5 * Math.sin(3 * model.time));
    });
}