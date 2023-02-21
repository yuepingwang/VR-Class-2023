import * as cg from "../render/core/cg.js";
import "../render/core/clay.js";
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

let leftTriggerPrev = false;
let rightTriggerPrev = false;
let keyMoved =false;
const VERTEX_SIZE = 16;

let glueMeshes = (a, b) => {
    let c = [];
    for (let i = 0 ; i < a.length ; i++)
        c.push(a[i]);                           // a
    for (let i = 0 ; i < VERTEX_SIZE ; i++)
        c.push(a[a.length - VERTEX_SIZE + i]);  // + last vertex of a
    for (let i = 0 ; i < VERTEX_SIZE ; i++)
        c.push(b[i]);                           // + first vertex of b
    for (let i = 0 ; i < b.length ; i++)
        c.push(b[i]);                           // + b
    return new Float32Array(c);
}

let createDiamondMesh=()=>{
    let part0, part1, part2;
    let A=[0,-1,0], B=[-1,0,0], C=[0,0,1], D=[0,1,0], N=[0,0,1];
    let V = [];
    V.push(clay.vertexArray(A, [0,-.1,1], [1,0,0], [0,0]));
    V.push(clay.vertexArray(C, N, [1,0,0], [1,0]));
    V.push(clay.vertexArray(B, [-.1,0,1], [1,0,0], [0,1]));
    V.push(clay.vertexArray(D, [0,.1,1], [1,0,0], [1,1]));
    part0= new Float32Array(V.flat());
    let A1=[0,-1,0], B1=[0,0,1], C1=[2,0,0], D1=[0,1,0], N1=[0,0,1];
    let V1 = [];
    V1.push(clay.vertexArray(A1, [0,-.1,1], [1,0,0], [0,0]));
    V1.push(clay.vertexArray(C1, [1,0,1], [1,0,0], [1,0]));
    V1.push(clay.vertexArray(B1, N1, [1,0,0], [0,1]));
    V1.push(clay.vertexArray(D1,[0,.1,1], [1,0,0], [1,1]));
    part1= new Float32Array(V1.flat());
    let A2=[0,-1,0], B2=[2,0,0], C2=[-1,0,0], D2=[0,1,0], N2=[0,0,-1];
    let V2 = [];
    V2.push(clay.vertexArray(A2, N2, [-1,0,0], [0,0]));
    V2.push(clay.vertexArray(C2, N2, [-1,0,0], [1,0]));
    V2.push(clay.vertexArray(B2, N2, [-1,0,0], [0,1]));
    V2.push(clay.vertexArray(D2, N2, [-1,0,0], [1,1]));
    part2= new Float32Array(V2.flat());
    return glueMeshes(glueMeshes(part0,part1), part2);
    // return glueMeshes(part0,part1);
}

export const init = async model => {
    clay.defineMesh('twoCubes', clay.combineMeshes([
        [ 'cube', cg.mTranslate(1,0,0  ), [1,.5,.5] ], // shape, matrix, color
        [ 'cube', cg.mScale    (.5,.5,2), [1,1,0  ] ], // shape, matrix, color
    ]));
    clay.defineMesh('fishHead',clay.combineMeshes([
        [ 'tubeY', cg.mMultiply(cg.mTranslate(-1.4,-.2,0  ),cg.mScale(.54,.12,.54)), [.8,.4,.1] ], // shape, matrix, color
        [ 'tubeY', cg.mMultiply(cg.mMultiply(cg.mTranslate(-1.36,-.44,0  ), cg.mRotateZ(.2)),cg.mScale(.5,.12,.5)), [.8,.4,.1] ],
        [ 'donut', cg.mMultiply(cg.mMultiply(cg.mTranslate(-.3,.3,.8  ), cg.mRotateZ(Math.PI/2)),cg.mScale(.52,.52,.4)), [.9,.9,.9] ],//left eye
        [ 'sphere', cg.mMultiply(cg.mMultiply(cg.mTranslate(-.3,.3,.8  ), cg.mRotateZ(Math.PI/2)),cg.mScale(.42,.42,.24)), [.1,.1,.05] ],
        [ 'donut', cg.mMultiply(cg.mMultiply(cg.mTranslate(-.3,.3,.8  ), cg.mRotateZ(Math.PI/2)),cg.mScale(.55,.55,.32)), [.9,.6,.1] ],
        [ 'sphere',cg.mScale    (1.8,1.6,.8), [1,.8,.1 ] ], // shape, matrix, color
    ]));
    clay.defineMesh('fishScale', createDiamondMesh());
    clay.defineMesh('fishRing1', clay.combineMeshes([
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(0,1.4*Math.sin(Math.PI/2),1*Math.cos(Math.PI/2) ),cg.mRotateX(-Math.PI/2)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ], // shape, matrix, color
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(0,1.4*Math.sin(Math.PI/4),1*Math.cos(Math.PI/4) ),cg.mRotateX(-Math.PI/4)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(0,1.4*Math.sin(-Math.PI/2),1*Math.cos(-Math.PI/2) ),cg.mRotateX(Math.PI/2)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(0,1.4*Math.sin(-Math.PI/4),1*Math.cos(-Math.PI/4) ),cg.mRotateX(Math.PI/4)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(0,1.4*Math.sin(-Math.PI*3/4),1*Math.cos(-Math.PI*3/4) ),cg.mRotateX(Math.PI*3/4)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(0,1.4*Math.sin(Math.PI*3/4),1*Math.cos(Math.PI*3/4) ),cg.mRotateX(-Math.PI*3/4)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(0,1.4*Math.sin(Math.PI),1*Math.cos(Math.PI) ),cg.mRotateX(-Math.PI)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(0,1.4*Math.sin(0),1*Math.cos(0) ),cg.mRotateX(0)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        // second loop
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.5,1.4*Math.sin(Math.PI/2-.4),1*Math.cos(Math.PI/2-.4) ),cg.mRotateX(-Math.PI/2)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ], // shape, matrix, color
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.5,1.4*Math.sin(Math.PI/4-.4),1*Math.cos(Math.PI/4-.4) ),cg.mRotateX(-Math.PI/4)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.5,1.4*Math.sin(-Math.PI/2-.4),1*Math.cos(-Math.PI/2-.4) ),cg.mRotateX(Math.PI/2)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.5,1.4*Math.sin(-Math.PI/4-.4),1*Math.cos(-Math.PI/4-.4) ),cg.mRotateX(Math.PI/4)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.5,1.4*Math.sin(-Math.PI*3/4-.4),1*Math.cos(-Math.PI*3/4-.4) ),cg.mRotateX(Math.PI*3/4)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.5,1.4*Math.sin(Math.PI*3/4-.4),1*Math.cos(Math.PI*3/4-.4) ),cg.mRotateX(-Math.PI*3/4)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.5,1.4*Math.sin(Math.PI-.4),1*Math.cos(Math.PI-.4) ),cg.mRotateX(-Math.PI)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.5,1.4*Math.sin(-.4),1*Math.cos(-.4) ),cg.mRotateX(0)),cg.mRotateY(-Math.PI/10)),cg.mScale(.44)), [1,1,0 ] ],
    ]));
    clay.defineMesh('fishRingFin', clay.combineMeshes([
        [ 'fishRing1', cg.mTranslate(.5,0,0), [1,1,0 ] ],
        //fin
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.2,1.8*Math.sin(Math.PI/2),1.3*Math.cos(Math.PI/2)),cg.mRotateY(Math.PI)),cg.mRotateZ(Math.PI/2)),cg.mScale(.25)), [1,.6,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.55,1.8*Math.sin(Math.PI/2),0.7*Math.cos(Math.PI/2)),cg.mRotateY(0)),cg.mRotateZ(Math.PI/2)),cg.mScale(.25)), [1,.5,.1 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(.9,1.8*Math.sin(Math.PI/2),1.3*Math.cos(Math.PI/2)),cg.mRotateY(Math.PI)),cg.mRotateZ(Math.PI/2)),cg.mScale(.25)), [1,.6,0 ] ],
        [ 'fishScale', cg.mMultiply(cg.mMultiply(cg.mMultiply(cg.mTranslate(1.2,1.8*Math.sin(Math.PI/2),0.7*Math.cos(Math.PI/2)),cg.mRotateY(0)),cg.mRotateZ(Math.PI/2)),cg.mScale(.25)), [1,.5,.1] ],
    ]));
    // let twoCubes = model.add('twoCubes');
    let fishSegment =  model.add();
    clay.defineMesh('fishSegment', clay.combineMeshes([
        [ 'fishRingFin', cg.mTranslate(.5,0,0), [1,1,0 ] ],
        [ 'tubeX', cg.mMultiply(cg.mMultiply(cg.mTranslate(1.2,0,0  ), cg.mRotateZ(0)),cg.mScale(.6,1.4,1)), [.9,.9,.1] ],
    ]));
    fishSegment.add('fishSegment').texture('../media/textures/glass1.jpeg');
    fishSegment.add('fishSegment').texture('../media/textures/glass1.jpeg');
    // let fishHead =  model.add('fishHead');
    model.move(0,1.5,0).scale(.1).animate(() => {
        fishSegment.identity().turnZ(model.time/4).turnY(model.time/4).turnZ(model.time/2);
        //fishSegment;
        //fishHead.identity().turnZ(model.time/4).turnY(model.time/4).turnZ(model.time/2);
    });
}