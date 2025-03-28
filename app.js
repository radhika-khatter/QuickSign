const canvas = document.querySelector(".signSpace");
const colorPicker = document.querySelector(".colorPicker");
const bgPicker = document.querySelector(".bgPicker");
const fontPicker = document.querySelector(".fontPicker");
const ctx = canvas.getContext("2d");

// Set default background color
bgPicker.value = "#ffffff";

function drawBackground() {
    ctx.fillStyle = bgPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

drawBackground();

// Update background color on change
bgPicker.addEventListener("change", () => {
    drawBackground();
});

colorPicker.addEventListener("change", (e) => {
    ctx.strokeStyle = e.target.value;
});

fontPicker.addEventListener("change", (e) => {
    ctx.lineWidth = e.target.value;
});

// Clear canvas
const handleClear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(); // Redraw background after clearing
};

// Save the drawing
const handleSave = () => {
    const imageData = canvas.toDataURL();
    localStorage.setItem("myCanvas", imageData);
    let link = document.createElement("a");
    link.href = imageData;
    link.download = "myCanvas.png";
    link.click();
    alert("Image saved and downloaded");
};

// Retrieve the saved image
const handleRetrieve = () => {
    const savedImage = localStorage.getItem("myCanvas");
    if (savedImage) {
        const img = new Image();
        img.src = savedImage;
        img.onload = () => ctx.drawImage(img, 0, 0); // Ensure image is loaded before drawing
    } else {
        alert("No image found");
    }
};

// Drawing logic
let isDrawing = false;

function getPosition(e) {
    let rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    } else {
        return {
            x: e.offsetX,
            y: e.offsetY
        };
    }
}

function startDraw(e) {
    e.preventDefault();
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
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDraw);
canvas.addEventListener("touchcancel", stopDraw);
