import {CreateLadder} from './createLadder.js';

export class PersonInfo {
    constructor(data) {
        this.data = data;
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseClick = this.mouseClick.bind(this);

        this.cerateLadder = new CreateLadder(data);
    }

    draw() {
        const me = this.data;
        const ctx = me.ctx;
        const canvas = me.canvas;

        ctx.font = '26px sans-serif';
        const smallSquare = ctx.measureText('M').width;
        const startTxtSize = ctx.measureText('start').width;
        this.gameStart = {
            txt: 'start',
            font: '26px sans-serif',
            startX: me.canvasWidth / 2 - startTxtSize - 10 - 5,
            startY: me.canvasHeight / 2 - (smallSquare / 2) - 5,
            endX: me.canvasWidth / 2 - 5,
            endY: me.canvasHeight / 2 + smallSquare - 5,
            txtX: me.canvasWidth / 2 - (startTxtSize / 2) - 10,
            txtY: me.canvasHeight / 2 + smallSquare / 2,
            txtW: startTxtSize + 10,
            txtH: smallSquare + 10,
        }
        const resetTxtSize = ctx.measureText('reset').width;
        this.gameReset = {
            txt: 'reset',
            font: '26px sans-serif',
            startX: me.canvasWidth / 2 + 10 - 5,
            startY: me.canvasHeight / 2 - (smallSquare / 2) - 5,
            endX: me.canvasWidth / 2 + resetTxtSize - 5,
            endY: me.canvasHeight / 2 + smallSquare - 5,
            txtX: me.canvasWidth / 2 + (resetTxtSize / 2) + 10,
            txtY: me.canvasHeight / 2 + smallSquare / 2,
            txtW: resetTxtSize + 10,
            txtH: smallSquare + 10,
        }

        me.clearCanvas(); // 캔버스 초기화

        me.getDefaultGrid();
        me.drawDefaultLine();


        // input 생성
        for(let i = 0; i < me.personCount; i++) {
            // 상단(person_input)
            let inputTop = document.createElement('input');
            inputTop.setAttribute('type', 'text');
            inputTop.classList.add('person_input');
            inputTop.style = `width: ${Math.floor(me.ladderWidth * 0.7 / me.personCount)}px; max-width: 100px; top: ${me.marginOut / 2}px; left: ${me.defaultGrid.x[i]}px; transform: translate(-50%, -40%);`;
            me.target.append(inputTop);


            // 하단(gift_input)
            let inputBot = document.createElement('input');
            inputBot.setAttribute('type', 'text');
            inputBot.classList.add('gift_input');
            inputBot.style = `width: ${Math.floor(me.ladderWidth * 0.7 / me.personCount)}px; max-width: 100px; bottom: ${me.marginOut / 2}px; left: ${me.defaultGrid.x[i]}px; transform: translate(-50%, 40%);`;
            me.target.append(inputBot);


            // line color 지정
            me.lineColor.push(`rgba(${Math.floor((Math.random() * 255) + 1)}, ${Math.floor((Math.random() * 255) + 1)}, ${Math.floor((Math.random() * 255) + 1)}, 1)`);
            me.lineColor.push(`rgba(${Math.floor((Math.random() * 255) + 1)}, ${Math.floor((Math.random() * 255) + 1)}, ${Math.floor((Math.random() * 255) + 1)}, 1)`);
        }
        
        me.drawDefaultLine();

        // 게임스타트 버튼 그리기
        ctx.fillStyle = '#000';
        ctx.fillRect(this.gameStart.startX, this.gameStart.startY, this.gameStart.txtW, this.gameStart.txtH);
        ctx.fillStyle = '#fff';
        ctx.font = this.gameStart.font;
        ctx.fillText(this.gameStart.txt, this.gameStart.txtX, this.gameStart.txtY);

        // 게임리셋 버튼 그리기
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(this.gameReset.startX, this.gameReset.startY, this.gameReset.txtW, this.gameReset.txtH);
        ctx.fillStyle = '#fff';
        ctx.font = this.gameReset.font;
        ctx.fillText(this.gameReset.txt, this.gameReset.txtX, this.gameReset.txtY);

        // 마우스 움직일때(hover)
        canvas.addEventListener('mousemove', this.mouseMove);
        // 마우스 클릭할때(click)
        canvas.addEventListener('click', this.mouseClick);
    }

    mouseMove(e) {
        const me = this.data;
        const ctx = me.ctx;
        const canvas = me.canvas;

        me.rect = canvas.getBoundingClientRect();
        let x = e.clientX - me.rect.left, // 캔버스 내의 hover를 할 타겟 좌표값X
            y = e.clientY - me.rect.top;// 캔버스 내의 hover를 할 타겟 좌표값Y
        
        me.canvas.style = 'cursor: default;';
        
        me.clearCanvas(); // 캔버스 초기화

        me.drawDefaultLine();
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.gameStart.startX, this.gameStart.startY, this.gameStart.txtW, this.gameStart.txtH);
        
        if((this.gameStart.startX <= x && this.gameStart.endX > x) &&
            (this.gameStart.startY <= y && this.gameStart.endY > y)) {
            ctx.fillStyle = 'red';
            me.canvas.style = 'cursor: pointer;';
        } else {
            ctx.fillStyle = '#fff';
        }
        ctx.fillText(this.gameStart.txt, this.gameStart.txtX, this.gameStart.txtY);

        ctx.fillStyle = '#0000ff';
        ctx.fillRect(this.gameReset.startX, this.gameReset.startY, this.gameReset.txtW, this.gameReset.txtH);
        
        if((this.gameReset.startX <= x && this.gameReset.endX > x) &&
            (this.gameReset.startY <= y && this.gameReset.endY > y)) {
            ctx.fillStyle = 'red';
            me.canvas.style = 'cursor: pointer;';
        } else {
            ctx.fillStyle = '#fff';
        }
        ctx.fillText(this.gameReset.txt, this.gameReset.txtX, this.gameReset.txtY);



    }
    mouseClick(e) {
        
        const me = this.data;
        const ctx = me.ctx;
        const canvas = me.canvas;

        me.rect = canvas.getBoundingClientRect();
        let x = e.clientX - me.rect.left, // 캔버스 내의 hover를 할 타겟 좌표값X
            y = e.clientY - me.rect.top;
        
        // 캔버스 초기화
        me.clearCanvas();
        
        // 뼈대그리기
        me.drawDefaultLine();
        
        // start 버튼 클릭시
        ctx.fillStyle = '#000';
        ctx.fillRect(this.gameStart.startX, this.gameStart.startY, this.gameStart.txtW, this.gameStart.txtH);

        if((this.gameStart.startX <= x && this.gameStart.endX > x) &&
            (this.gameStart.startY <= y && this.gameStart.endY > y)) {
            ctx.fillStyle = 'red';

            if (this.gameStart.txt === 'start') {

                let userInfo = [];
                let resultInfo = [];

                me.target.querySelectorAll('.person_input').forEach(ele => {
                    userInfo.push(ele.value);
                })
                me.target.querySelectorAll('.gift_input').forEach(ele => {
                    resultInfo.push(ele.value);
                })

                // input 모두 입력 되었는 체크
                let userLengthCheck = userInfo.filter(ele => ele.length <= 0);
                let resultLengthCheck = resultInfo.filter(ele => ele.length <= 0);

                console.log(userLengthCheck.length);
                console.log(resultLengthCheck.length);
                console.log(me.personCount);

                if(!userLengthCheck.length && !resultLengthCheck.length) {

                    me.target.querySelectorAll('.person_input').forEach(ele => {
                        ele.remove();
                    })
                    me.target.querySelectorAll('.gift_input').forEach(ele => {
                        ele.remove();
                    })

                    canvas.style = 'cursor: default;';
                    me.clearCanvas(); // 캔버스 초기화

                    // 뼈대그리기
                    me.drawDefaultLine();
                    this.cerateLadder.draw(userInfo, resultInfo);
                    
                    canvas.removeEventListener('mousemove', this.mouseMove);
                    canvas.removeEventListener('click', this.mouseClick);

                    return;

                } else {
                    alert('모두 입력해주세요');
                }
            }
        } else {
            ctx.fillStyle = '#fff';
        }
        ctx.font = this.gameStart.font;
        ctx.fillText(this.gameStart.txt, this.gameStart.txtX, this.gameStart.txtY);

        // reset 버튼 클릭시
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(this.gameReset.startX, this.gameReset.startY, this.gameReset.txtW, this.gameReset.txtH);

        if((this.gameReset.startX <= x && this.gameReset.endX > x) &&
            (this.gameReset.startY <= y && this.gameReset.endY > y)) {
            me.target.querySelectorAll('.person_input').forEach(ele => {
                ele.remove();
            })
            me.target.querySelectorAll('.gift_input').forEach(ele => {
                ele.remove();
            })

            canvas.style = 'cursor: default;';
            me.reset();
            canvas.removeEventListener('mousemove', this.mouseMove);
            canvas.removeEventListener('click', this.mouseClick);
            
            return;
        } else {
            ctx.fillStyle = '#fff';
        }

        ctx.font = this.gameReset.font;
        ctx.fillText(this.gameReset.txt, this.gameReset.txtX, this.gameReset.txtY);
    }
    
}