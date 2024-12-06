const canvas=document.querySelector(".signSpace");
const colorPicker=document.querySelector(".colorPicker");
const bgPicker=document.querySelector(".bgPicker");
const fontPicker=document.querySelector(".fontPicker");
const ctx=canvas.getContext('2d');

bgPicker.value = "#ffffff";

function drawBackground() {
    ctx.fillStyle = bgPicker.value;  
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
}

drawBackground();

bgPicker.addEventListener("change", (e) => {
    drawBackground();  
});

colorPicker.addEventListener("change",(e)=>{
    ctx.strokeStyle=e.target.value;
})
fontPicker.addEventListener("change",(e)=>{
    ctx.lineWidth=e.target.value;
})
const handleClear=()=>{
    ctx.clearRect(0,0,650,400);
    drawBackground(); 
}

const handleSave=()=>{
    const imageData=canvas.toDataURL();
    localStorage.setItem("myCanvas",imageData);
    let link=document.createElement('a');
    link.href=imageData;
    link.download="myCanvas.png";
    link.click();
    alert("Image saved and Downloaded");
}

const handleRetrieve=()=>{
    const savedImage = localStorage.getItem("myCanvas"); 
    if(savedImage){
        const img=new Image();
        img.src=savedImage;
        ctx.drawImage(img,0,0);
    }
    else{
        alert("No image found");
    }
    
}

let isDrawing=false;

canvas.addEventListener("mousedown",(e)=>{
    isDrawing=true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX,e.offsetY);
})

canvas.addEventListener("mousemove",(e)=>{
    if(isDrawing){
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    }
})

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});
