import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";

export default () => {
   global.scene().addNode(new Gltf2Node({
      url: ""
   })).name = "backGround";

   return {
      enableSceneReloading: true,
      scenes: [ 
         { name: "TestControl1" , path: "./testControl1.js" },
         { name: "TestHUD" , path: "./demoHUD.js" },
         { name: "TestCanvas" , path: "./demoCanvas.js" },
         { name: "TestDoors" , path: "./testDoors.js" },
         { name: "TestFish" , path: "./testFish.js" },
         { name: "TestFishSegment" , path: "./testFishSegment.js" },
         { name: "TestModeler1" , path: "./testModeler1.js" },
         { name: "DemoWire" , path: "./demoWire.js" },
      ]
   };
}
