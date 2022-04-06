let modelElem = document.querySelector(".model");
let addElem = document.querySelector(".add");
let removeElem = document.querySelector(".remove");
let textboxElem = document.querySelector(".textbox");
let maincontElem = document.querySelector(".main-cont");
let colormodelElem = document.querySelectorAll(".colormodel");
let colorElem = document.querySelectorAll(".color");
let showFlag = false;
let removeFlag = false;
let color = ["yellow","red","green","blue"];
let initialColor = color[0];
let unlockClass ="fa-lock-open";
let lockClass ="fa-lock";
let colorArr = [];
let toolBoxFilterFlag = false; //colorArr
let localStorageFlag =false;  //localStorage

if(localStorage.getItem("Taskit")){
    colorArr =  JSON.parse(localStorage.getItem("Taskit"));
    console.log(colorArr);
    colorArr.forEach((ticketObj)=>{
        localStorageFlag =true;
        toolBoxFilterFlag = true;
        createTicket(ticketObj.color, ticketObj.id, ticketObj.text);
    })
}


//+ shows model and hides it
addElem.addEventListener("click",(e)=>{
    showFlag = !showFlag;

    if(showFlag){
        modelElem.style.display = "flex";
        addElem.classList.add("white");
        
    } 
    else{
        modelElem.style.display = "none";
        addElem.classList.remove("white");
    }
})

removeElem.addEventListener("click",(e)=>{
    removeFlag = !removeFlag;
    if(removeFlag){
        removeElem.classList.add("white");
    }
    else{
        removeElem.classList.remove("white");
    }

  
})

colorElem.forEach((toolcolor,index)=>{
    toolcolor.addEventListener("click",(e)=>{

        
        let currToolcolor = toolcolor.classList[1];
        let filterArr = colorArr.filter((ticketObj,idx)=>{
            return currToolcolor == ticketObj.color;
        })

        let alltickets = document.querySelectorAll(".ticket");
        alltickets.forEach((curr_ticket)=>{
            curr_ticket.remove();
        })

        //display filtetred ones
        filterArr.forEach((ticketObj,idx)=>{
            toolBoxFilterFlag = true;
            localStorageFlag = true;
            createTicket(ticketObj.color,ticketObj.id,ticketObj.text);
        })
        

    })

    toolcolor.addEventListener("dblclick",(e)=>{
        let alltickets = document.querySelectorAll(".ticket");
        alltickets.forEach((curr_ticket)=>{
            curr_ticket.remove();
        })

        colorArr.forEach((colorObj,idx)=>{
            toolBoxFilterFlag = true;
            localStorageFlag = true; 
            createTicket(colorObj.color,colorObj.id,colorObj.text);
        })

    })
})


colormodelElem.forEach((curr_colorElem,index)=>{
    curr_colorElem.addEventListener("click",(e)=>{
      
        colormodelElem.forEach((colorElem,idx)=>{
            colorElem.classList.remove("border");
        })
        curr_colorElem.classList.add("border");
        initialColor= curr_colorElem.classList[1];

    })
})


textboxElem.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key == "Shift"){
        toolBoxFilterFlag = false;
        localStorageFlag = false;
        createTicket(initialColor,shortid(),textboxElem.value);
        textboxElem.value = "";
        modelElem.style.display = "none";
        showFlag=false;
        addElem.classList.remove("white");
    }
})

function createTicket(color,id,text){
    let ticket = document.createElement("div");
    ticket.setAttribute("class","ticket");
    ticket.innerHTML =`
    <div class="ticket-color ${color}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task">${text}</div>
    <div class="lock"><i class="fa-solid fa-lock"></i></div>
        </div>
    `
    if(toolBoxFilterFlag == false){
        colorArr.push({color,id,text});
        
    }
    if(localStorageFlag == false){
        localStorage.setItem("Taskit",JSON.stringify(colorArr)); 
    }
  
    maincontElem.appendChild(ticket);
    handleLock(ticket,id);
    handleRemove(ticket,id);
    handleColor(ticket,id);
}

function getTicketIdx(id){
    let index = colorArr.findIndex((ticketObj)=>{
        return id == ticketObj.id;
    })
    return index;
}

function handleRemove(ticket,id){
   
    ticket.addEventListener("click",(e)=>{
        if(removeFlag){
            let removeIndex = getTicketIdx(id);
            colorArr.splice(removeIndex,1);  //DB removal
            ticket.remove();  //UI removal
            localStorage.setItem("Taskit",JSON.stringify(colorArr)); 

        }
    })
    
}



//toggling lock unlock icon

function handleLock(ticket,id){
    let lockElem = ticket.querySelector(".lock");
    let ticketLock= lockElem.children[0];
    let taskareaElem = ticket.querySelector(".task");
    ticketLock.addEventListener("click",(e)=>{
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            taskareaElem.setAttribute("contenteditable","true");

        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            taskareaElem.setAttribute("contenteditable","false ");

        }

        //Modify data in DB
        let ticketIdx = getTicketIdx(id);
        colorArr[ticketIdx].text = taskareaElem.innerText;
        localStorage.setItem("Taskit",JSON.stringify(colorArr)); 

    })
}

function handleColor(ticket,id){
    let ticketColorElem = ticket.querySelector(".ticket-color");
    ticketColorElem.addEventListener("click",(e)=>{
        let currColor = ticketColorElem.classList[1];
        let currColorIndx;

        let ticketIdx = getTicketIdx(id);
    
        for(let i=0; i<color.length;i++){
            if(color[i]== currColor){
                currColorIndx = i;
                break;
            }
        }
        
        let nxtColorIdx = (currColorIndx + 1)%(color.length);
        let nxtColor = color[nxtColorIdx];
        //UI color change
        ticketColorElem.classList.remove(currColor);
        ticketColorElem.classList.add(nxtColor);

        //modify data in local storage
        //colorArr.splice(removeIndex,1);
        colorArr[ticketIdx].color = nxtColor;
        console.log(JSON.stringify(colorArr));
        localStorage.setItem("Taskit",JSON.stringify(colorArr)); 

    })
   

}
