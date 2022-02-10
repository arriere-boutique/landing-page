<template>
    <div>
        <div class="test" ref="test"></div>

        <p>{{ result }}</p>
    </div>
</template>

<script>
import Quagga from 'quagga'

export default {
    layout: 'dashboard',
    data: () => ({
        result: ''
    }),
    mounted () {
        Quagga.init({
                inputStream : {
                name : "Live",
                type : "LiveStream",
				constraints: {
					width: {min: 640},
					height: {min: 480},
					aspectRatio: {min: 1, max: 100},
					facingMode: "environment"
				},
                target: this.$refs.test
            },
            decoder : {
                readers : ["code_128_reader"]
            }
        }, function(err) {
            if (err) {
                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        })

        
	    Quagga.onProcessed(function(result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;
    
            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                    });
                }
    
                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
                }
    
                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
                }
            }
        })

        Quagga.onDetected((result) => {    		
            if (result.codeResult.code != this.result){
                this.result = result.codeResult.code	
            }
        })


    }
}
</script>

<style lang="scss">
    .test {
        width: 100%;
        height: 500px;
        position: relative;

        .drawingBuffer {
            position: absolute;
            top: 0;
            left: 0;
        }
    }
</style>