const canvas = document.querySelector(".signSpace");
const colorPicker = document.querySelector(".colorPicker");
const bgPicker = document.querySelector(".bgPicker");
const fontPicker = document.querySelector(".fontPicker");
const ctx = canvas.getContext("2d");

// Set default background color
bgPicker.value = "#ffffff";

function adjustCanvasSize() {
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size based on its displayed size
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    
    ctx.scale(dpr, dpr); // Prevents blurry drawing
    drawBackground();
}

function drawBackground() {
    ctx.fillStyle = bgPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Adjust canvas on load & resize
adjustCanvasSize();
window.addEventListener("resize", adjustCanvasSize);

bgPicker.addEventListener("change", drawBackground);
colorPicker.addEventListener("change", (e) => (ctx.strokeStyle = e.target.value));
fontPicker.addEventListener("change", (e) => (ctx.lineWidth = e.target.value));

const handleClear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
};

const handleSave = () => {
    // Create an off-screen 28x28 canvas
    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = 28;
    smallCanvas.height = 28;
    const smallCtx = smallCanvas.getContext("2d");

    // Draw current canvas onto the small canvas (scaled)
    smallCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 28, 28);

    // Get image data
    const imageData = smallCtx.getImageData(0, 0, 28, 28);
    const data = imageData.data;

    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
        // Average of RGB
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
        // Alpha (data[i + 3]) remains unchanged
    }

    smallCtx.putImageData(imageData, 0, 0);

    // Convert to data URL and download
    const grayImageData = smallCanvas.toDataURL("image/png");
    localStorage.setItem("myCanvas_28x28_gray", grayImageData);

    let link = document.createElement("a");
    link.href = grayImageData;
    link.download = "myCanvas_28x28_grayscale.png";
    link.click();

    alert("Grayscale 28x28 image saved and downloaded");
};



const handleRetrieve = () => {
    const savedImage = localStorage.getItem("myCanvas");
    if (savedImage) {
        const img = new Image();
        img.src = savedImage;
        img.onload = () => ctx.drawImage(img, 0, 0);
    } else {
        alert("No image found");
    }
};

// Drawing logic
let isDrawing = false;

function getPosition(e) {
    let rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.touches) {
        x = (e.touches[0].clientX - rect.left);
        y = (e.touches[0].clientY - rect.top);
    } else {
        x = (e.clientX - rect.left);
        y = (e.clientY - rect.top);
    }

    return { x, y };
}

function startDraw(e) {
    e.preventDefault(); // Prevent scrolling on touch devices
    isDrawing = true;
    ctx.beginPath();
    const { x, y } = getPosition(e);
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDraw(e) {
    e.preventDefault();
    isDrawing = false;
}

// Mouse events
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

// Touch events (for mobile support)
canvas.addEventListener("touchstart", startDraw, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDraw);
canvas.addEventListener("touchcancel", stopDraw);
