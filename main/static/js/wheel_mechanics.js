function installRotateOf(elementId, callback) {
    const R2D = 180 / Math.PI;
    const rotateElement = document.getElementById(elementId);

    let active = false,
        angle = 0,
        rotation = 0,
        startAngle = 0,
        lastAngle = 0,
        center = {
            x: 0,
            y: 0
        };

    // value being sent outside by callback
    let currentRotation = 0;

    const stop = () => {
        angle += rotation;

        // "reset" angle if greater than one rotation
        while (angle > 360) {
            angle -= 360;
        }

        currentRotation = angle;

        // range from angle 270 to 360 is being displayed from -1 (359) to -89 (271). We need to
        // normalize it in order to process it easier later on.
        if (currentRotation < 0) {
            currentRotation = 270 + (currentRotation + 90)
        }

        // reset rotation if it gets buggy by dragging like stupid.
        if (currentRotation < 0) {
            currentRotation = 0;
        }

        angle = currentRotation;

        active = false;
    };

    function rotate(e) {
        e.preventDefault();
        var x = e.clientX - center.x,
            y = e.clientY - center.y,
            d = R2D * Math.atan2(y, x);
        rotation = d - startAngle;

        return rotateElement.style.webkitTransform = 'rotate(' + (angle + rotation)
            + 'deg)', angle+rotation;
    }

    function start(e) {
        e.preventDefault();
        var bb = this.getBoundingClientRect(),
            t = bb.top,
            l = bb.left,
            h = bb.height,
            w = bb.width,
            x, y;
        center = {
            x: l + (w / 2),
            y: t + (h / 2)
        };
        x = e.clientX - center.x;
        y = e.clientY - center.y;
        startAngle = R2D * Math.atan2(y, x);
        active = true;
    }

    function init() {
        rotateElement.addEventListener('mousedown', start, false);
        $(document).bind('mousemove', function (event) {
            if (active === true) {
                event.preventDefault();
                // event.stopImmediatePropagation()
                let css, cr = rotate(event);
                callback(cr+90, lastAngle);
                lastAngle = cr+90;
            }
        });
        $(document).bind('mouseup', function (event) {
            event.preventDefault();
            // event.stopImmediatePropagation();
            if (active === true) {
                stop(event);
            }
        });
    }

    init();
}
