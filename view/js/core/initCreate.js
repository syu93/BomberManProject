$(document).ready(function(){
    var stage = init();
    var obj_send = createCube(10, 10);

    // console.log("-------------------------------------");
    // console.log(obj_send);
    // console.log("X= "+obj_send.x);
    // console.log("Y= "+obj_send.y);
    // console.log("-------------------------------------");
    // Get data from this other user
    TogetherJS.hub.on("togetherjs.hello", function (msg) {
        if (! msg.sameUrl) {
            return;
        }
        var image = canvas.toDataURL("image/png");
        TogetherJS.send({
            type: "init",
            image: image
        });
    });
    TogetherJS.hub.on("init", function (msg) {
        if (! msg.sameUrl) {
            return;
        }
        var image = new Image();
        image.src = msg.image;
        context.drawImage(image, 0, 0);
    });
    TogetherJS.hub.on("tween-object", function (msg) {
        if (! msg.sameUrl) {
            return;
        }
        // alert(msg.obj_x);
        // alert(obj_send);
        obj_send.x = msg.obj_x;
        obj_send.y = msg.obj_y;

        //!!!!!!Don't forget to update the canvas!!!!!!!!!!!!
        stage.update();

    });
});

function init(){
    //Create a stage by getting a reference to the canvas
    stage = new createjs.Stage("mainCanvas");

    createjs.Touch.enable(stage);

    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    
    var defaultColor = "#171717";

    //Update stage will render next frame
    stage.update();
    return stage;
}

function createCube(x, y){ //FIXME : Create a cube for eache user
    var rect = new createjs.Shape();            
    rect.addEventListener("click", handlerClick);
    rect.addEventListener("pressmove", handlerClick);
    rect.graphics.beginFill("#FF0000").drawRect(0, 0, 30, 30);
    rect.cursor = "pointer";
    rect.x = x;
    rect.y = y;
    rect.name = "rectangle";
    obj_send = rect;
    stage.addChild(rect);
    stage.update();
    return rect;
}

function handlerClick(event) {
    var t = event.target;
    // console.log(t);
    obj_send = t;
    if(TogetherJS.running){
        TogetherJS.send({
          type: "tween-object",
          obj_x: obj_send.x,
          obj_y: obj_send.y
        });
    }

    stage.on("pressmove", function(evt) {
        var target = evt.target;
        /**********/
        // Bring the target on top
        var o = evt.target;
        o.parent.addChild(o);
        o.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};
        /**********/
        target.x = (evt.stageX);
        target.y = (evt.stageY); 
        });
        stage.update();
}