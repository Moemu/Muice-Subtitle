const TipAera = document.getElementById('tip_aera')
const TipIcon = document.getElementById('tip_icon')
const TipText = document.getElementById('tip_text')
const Subtitle = document.getElementById('subtitle')

let TipStatus = 0
let SubtitleStatus = 0
let CurrentTimeout = 0

const server_port = 5500
const socket = io.connect(`http://localhost:${server_port}`);

socket.on('message', function(data) {
    // showMessage(decodeURIComponent(data.content));
    user = decodeURIComponent(data.user)
    avatar = decodeURIComponent(data.avatar)
    message = decodeURIComponent(data.message)
    respond = decodeURIComponent(data.respond)
    if(user != '', avatar != '', message != ''){SendTipMessage(user,avatar,message)}
    SendSubtitleMessage(respond)
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
    TipText.innerText = user + ': ' + text
    setTimeout("TipStatusSwitch(0)", text.length*1000)
}

function ClearSubtitle(){
    Subtitle.innerText = ''
    clearTimeout(CurrentTimeout)
    CurrentTimeout = 0
    SubtitleStatus = 0
}

function PushSubtitleMessage(text_index,text){
    Subtitle.innerText += text[text_index]
    text_index++
    if(text_index < text.length){
        CurrentTimeout = setTimeout(() => {PushSubtitleMessage(text_index,text)},200)
    }else{
        CurrentTimeout = setTimeout(() => {ClearSubtitle()},5000)
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