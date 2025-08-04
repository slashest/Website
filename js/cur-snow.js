const star = [];
const star_x = [];
const star_y = [];
const star_remaining_ticks = [];
const tiny = [];
const tiny_x = [];
const tiny_y = [];
const tiny_remaining_ticks = [];
const sparkles = 7;
const sparkle_lifetime = 30;
const sparkle_distance = 10000;
const star_size = 10;
const star_colors = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFDDD'];

let doc_height;
let doc_width;
let sparkles_enabled = null;
let star_opacity = 0.9;
let glow_enabled = true;

window.onload = function () {
    doc_height = document.documentElement.scrollHeight;
    doc_width = document.documentElement.scrollWidth;

    animate_sparkles();
    if (sparkles_enabled === null) {
        sparkle(true);
    }
};

function sparkle(enable = null) {
    if (enable === null) {
        sparkles_enabled = !sparkles_enabled;
    } else {
        sparkles_enabled = !!enable;
    }

    if (sparkles_enabled && star.length < sparkles) {
        sparkle_init();
    }
}

function sparkle_destroy() {
    let elem;
    while (tiny.length) {
        elem = tiny.pop();
        if (elem) {
            document.body.removeChild(elem);
        }
    }

    while (star.length) {
        elem = star.pop();
        if (elem) {
            document.body.removeChild(elem);
        }
    }
}

function sparkle_init() {
    for (let i = 0; i < sparkles; i++) {
        const tiny_div = document.createElement("div");
        tiny_div.style.position = "absolute";
        tiny_div.style.height = "3px";
        tiny_div.style.width = "3px";
        tiny_div.style.overflow = "hidden";
        tiny_div.style.visibility = "hidden";
        tiny_div.style.zIndex = "999";
        tiny_div.style.borderRadius = "50%";

        if (tiny[i]) {
            document.body.removeChild(tiny[i]);
        }

        document.body.appendChild(tiny_div);
        tiny[i] = tiny_div;
        tiny_remaining_ticks[i] = null;

        const star_div = document.createElement("div");
        star_div.style.position = "absolute";
        star_div.style.height = star_size + "px";
        star_div.style.width = star_size + "px";
        star_div.style.overflow = "visible";
        star_div.style.visibility = "hidden";
        star_div.style.zIndex = "999";

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("height", star_size + "px");
        svg.setAttribute("width", star_size + "px");
        svg.setAttribute("viewBox", "0 0 511.45 511.45");
        svg.style.overflow = "visible";

        const path = document.createElementNS(svgNS, "path");
        
        path.setAttribute("d", "M502.842,225.679c14.769-14.769,6.892-40.369-13.785-43.323l-119.138-17.723 c-7.877-0.985-15.754-6.892-18.708-13.785L298.042,42.54c-8.862-18.708-36.431-18.708-45.292,0L199.58,150.848 c-3.938,7.877-10.831,12.8-18.708,13.785L60.749,182.356c-20.677,2.954-29.538,28.554-13.785,43.323l85.662,83.692 c5.908,5.908,8.862,13.785,6.892,22.646l-20.677,118.154c-1.969,14.769,6.892,26.585,19.692,29.538 c0.985-2.954,2.954-5.908,6.892-6.892c41.354-9.846,73.846-35.446,107.323-61.046c6.892-5.908,13.785,0.985,14.769,7.877 c5.908-1.969,12.8-0.985,18.708,1.969l106.338,56.123c18.708,9.846,40.369-5.908,36.431-26.585l-20.677-118.154 c-0.985-7.877,0.985-16.738,6.892-22.646L502.842,225.679z");
        
        svg.appendChild(path);
        star_div.appendChild(svg);

        if (star[i]) {
            document.body.removeChild(star[i]);
        }

        document.body.appendChild(star_div);
        star[i] = star_div;
        star_remaining_ticks[i] = null;
    }

    window.addEventListener('resize', function () {
        for (let i = 0; i < sparkles; i++) {
            star_remaining_ticks[i] = null;
            star[i].style.left = "0px";
            star[i].style.top = "0px";
            star[i].style.visibility = "hidden";

            tiny_remaining_ticks[i] = null;
            tiny[i].style.top = '0px';
            tiny[i].style.left = '0px';
            tiny[i].style.visibility = "hidden";
        }

        doc_height = document.documentElement.scrollHeight;
        doc_width = document.documentElement.scrollWidth;
    });

    document.onmousemove = function (e) {
        if (sparkles_enabled && !e.buttons) {
            const distance = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));
            const delta_x = e.movementX * sparkle_distance * 2 / distance;
            const delta_y = e.movementY * sparkle_distance * 2 / distance;
            const probability = distance / sparkle_distance;
            let cumulative_x = 0;

            let mouse_y = e.pageY;
            let mouse_x = e.pageX;

            if (distance > 5) {
                for (let i = 0; i < 3; i++) {
                    const offset_x = (Math.random() - 0.5) * 20;
                    const offset_y = (Math.random() - 0.5) * 20;
                    create_star(mouse_x + offset_x, mouse_y + offset_y, 0.7);
                }
            }

            while (Math.abs(cumulative_x) < Math.abs(e.movementX)) {
                create_star(mouse_x, mouse_y, probability);

                let delta = Math.random();
                mouse_x -= delta_x * delta;
                mouse_y -= delta_y * delta;
                cumulative_x += delta_x * delta;
            }
        }
    };
    
    setInterval(function() {
        if (sparkles_enabled) {
            const x = Math.random() * doc_width;
            const y = Math.random() * doc_height;
            create_star(x, y, 0.3);
        }
    }, 500);
}

function animate_sparkles(fps = 60) {
    const interval_milliseconds = 1000 / fps;

    let alive = 0;

    for (let i = 0; i < star.length; i++) {
        alive += update_star(i);
    }

    for (let i = 0; i < tiny.length; i++) {
        alive += update_tiny(i);
    }

    if (alive === 0 && !sparkles_enabled) {
        sparkle_destroy();
    }

    setTimeout("animate_sparkles(" + fps + ")", interval_milliseconds);
}

function create_star(x, y, probability = 1.0) {
    if (x + star_size >= doc_width || y + star_size >= doc_height) {
        return;
    }

    if (Math.random() > probability) {
        return;
    }

    function get_random_color() {
        const color = star_colors[Math.floor(Math.random() * star_colors.length)];
        return color;
    }

    let min_lifetime = sparkle_lifetime * 2 + 1;
    let min_index = NaN;
    for (let i = 0; i < sparkles; i++) {
        if (!star_remaining_ticks[i]) {
            min_lifetime = null;
            min_index = i;
            break;
        } else if (star_remaining_ticks[i] < min_lifetime) {
            min_lifetime = star_remaining_ticks[i];
            min_index = i;
        }
    }

    if (min_lifetime) {
        star_to_tiny(min_index);
    }

    if (min_index >= 0) {
        star_remaining_ticks[min_index] = sparkle_lifetime * 2;
        star_x[min_index] = x;
        star[min_index].style.left = x + "px";
        star_y[min_index] = y;
        star[min_index].style.top = y + "px";
        
        const scale = 0.5 + Math.random() * 0.5;
        star[min_index].firstChild.style.transform = `scale(${scale})`;
        
        const color = get_random_color();
        const path = star[min_index].querySelector('path');
        path.setAttribute("fill", color);
        
        if (glow_enabled) {
            star[min_index].style.filter = `drop-shadow(0 0 3px ${color})`;
        }
        
        star[min_index].style.animation = `twinkle ${1 + Math.random()}s infinite alternate`;
        
        star[min_index].style.opacity = star_opacity;
        star[min_index].style.visibility = "visible";
        
        star[min_index].style.transform = `rotate(${Math.random() * 360}deg)`;
        
        return min_index;
    }
}

function update_star(i) {
    if (star_remaining_ticks[i] === null) {
        return false;
    }

    star_remaining_ticks[i] -= 1;

    if (star_remaining_ticks[i] === 0) {
        star_to_tiny(i);
        return false;
    }

    if (star_remaining_ticks[i] === sparkle_lifetime) {
        star[i].style.opacity = star_opacity * 0.7;
    }

    if (star_remaining_ticks[i] % 5 === 0) {
        star[i].style.opacity = star_opacity * (0.7 + Math.random() * 0.3);
    }

    if (star_remaining_ticks[i] > 0) {
        star_y[i] += 0.5 + Math.random();
        star_x[i] += (i % 5 - 2) / 6;

        const currentRotation = parseFloat(star[i].style.transform.replace('rotate(', '').replace('deg)', '') || 0);
        const newRotation = currentRotation + (Math.random() - 0.5) * 2;
        star[i].style.transform = `rotate(${newRotation}deg)`;

        if (star_y[i] + star_size < doc_height && star_x[i] + star_size < doc_width) {
            star[i].style.top = star_y[i] + "px";
            star[i].style.left = star_x[i] + "px";
            return true;
        }
    }

    star_remaining_ticks[i] = null;
    star[i].style.left = "0px";
    star[i].style.top = "0px";
    star[i].style.visibility = "hidden";
    return false;
}

function star_to_tiny(i) {
    if (star_remaining_ticks[i] === null) {
        return;
    }

    const starPath = star[i].querySelector('path');
    const starColor = starPath ? starPath.getAttribute('fill') : '#FFFFFF';

    if (star_y[i] + star_size/2 < doc_height && star_x[i] + star_size/2 < doc_width) {
        tiny_remaining_ticks[i] = sparkle_lifetime * 2;
        tiny_y[i] = star_y[i] + star_size/2;
        tiny[i].style.top = tiny_y[i] + "px";
        tiny_x[i] = star_x[i] + star_size/2;
        tiny[i].style.left = tiny_x[i] + "px";
        tiny[i].style.width = "2px";
        tiny[i].style.height = "2px";
        
        tiny[i].style.backgroundColor = starColor;
        
        if (glow_enabled) {
            tiny[i].style.boxShadow = `0 0 3px ${starColor}`;
        }
        
        tiny[i].style.opacity = star_opacity * 0.8;
        
        star[i].style.visibility = "hidden";
        tiny[i].style.visibility = "visible";
    }

    star_remaining_ticks[i] = null;
    star[i].style.left = "0px";
    star[i].style.top = "0px";
    star[i].style.visibility = "hidden";
}

function update_tiny(i) {
    if (tiny_remaining_ticks[i] === null) {
        return false;
    }

    tiny_remaining_ticks[i] -= 1;

    if (tiny_remaining_ticks[i] === sparkle_lifetime) {
        tiny[i].style.width = "1px";
        tiny[i].style.height = "1px";
        tiny[i].style.opacity = star_opacity * 0.5;
    }

    if (tiny_remaining_ticks[i] > 0) {
        tiny_y[i] += 0.7 + Math.random();
        tiny_x[i] += (i % 4 - 2) / 5;

        if (tiny_y[i] + 3 < doc_height && tiny_x[i] + 3 < doc_width) {
            tiny[i].style.top = tiny_y[i] + "px";
            tiny[i].style.left = tiny_x[i] + "px";
            return true;
        }
    }

    tiny_remaining_ticks[i] = null;
    tiny[i].style.top = '0px';
    tiny[i].style.left = '0px';
    tiny[i].style.visibility = "hidden";
    return false;
}

const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
@keyframes twinkle {
    0% { opacity: ${star_opacity}; }
    50% { opacity: ${star_opacity * 0.4}; }
    100% { opacity: ${star_opacity}; }
}
`;
document.getElementsByTagName('head')[0].appendChild(style);