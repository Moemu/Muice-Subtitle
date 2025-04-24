const TipAera = document.getElementById('tip_aera')
const TipIcon = document.getElementById('tip_icon')
const TipText = document.getElementById('tip_text')
const Subtitle = document.getElementById('subtitle')

let TipStatus = 0
let SubtitleStatus = 0
let CurrentTimeout = 0

const server_port = 8082
const socket = io.connect(`http://localhost:${server_port}`);

socket.on('message', function(data) {
    // showMessage(decodeURIComponent(data.content));
    user = decodeURIComponent(data.user)
    avatar = decodeURIComponent(data.avatar)
    message = decodeURIComponent(data.message)
    respond = decodeURIComponent(data.respond)
    if(user != '', avatar != '', message != ''){SendTipMessage(user,avatar,message)}
    if(respond != ''){SendSubtitleMessage(respond)}
    if(respond == ''){CurrentTimeout = setTimeout(() => {ClearAll()},10000)}
});

function TipStatusSwitch(status){
    if(status){
        TipAera.style.transform = 'translateX(-50%)'
    }else{
        TipAera.style.transform = 'translateX(-50%)translateY(-150px)'
        TipText.innerText = ''
        TipIcon.style.backgroundImage = ''
    }
}

function SendTipMessage(user,avatarlink,text){
    TipStatusSwitch(1)
    TipIcon.style.border = '4px'
    TipIcon.style.backgroundImage = "url(" + avatarlink + ")"
    TipIcon.style.backgroundSize = "cover"
    let output = user + ': ' + text
    if(output.length >= 25){
        TipText.style.fontSize = '30px'
        TipText.style.top = '23%'
    }
    else{
        TipText.style.fontSize = '40px'
        TipText.style.top = '15%'
    }
    TipText.innerText = output
}

function ClearSubtitle(){
    Subtitle.innerText = ''
    clearTimeout(CurrentTimeout)
    CurrentTimeout = 0
    SubtitleStatus = 0
}

function ClearAll(){
    TipStatusSwitch(0)
    ClearSubtitle()
}

function PushSubtitleMessage(text_index,text){
    if(text_index % 40 == 0){
        Subtitle.textContent = ''
    }
    Subtitle.textContent  += text[text_index]
    text_index++
    if(text_index % 20 == 0){
        Subtitle.textContent += '\n'
    }
    if(text_index < text.length){
        const isChineseChar = /[\u4e00-\u9fff]/.test(text[text_index]);
        const delay = isChineseChar ? 160 : 120;
        CurrentTimeout = setTimeout(() => {PushSubtitleMessage(text_index,text)}, delay);
    }else{
        CurrentTimeout = setTimeout(() => {ClearAll()},10000)
    }
}

function SendSubtitleMessage(text){
    if(SubtitleStatus){
        ClearSubtitle()
        SendSubtitleMessage(text)
    }else{
        SubtitleStatus = 1
        text_index = 0
        PushSubtitleMessage(text_index,text)
    }
}