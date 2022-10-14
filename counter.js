import {PersonInfo} from './personinfo.js';

export class Counter {
    constructor(data) {
        this.data = data;
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseClick = this.mouseClick.bind(this);

        this.personInfo = new PersonInfo(data);

        this.draw();

    }


    draw() {
        const me = this.data;

        const canvas = me.canvas;
        const ctx = me.ctx;

        const canvasWidth = me.canvasWidth;
        const canvasHeight = me.canvasHeight;

        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const bigFont = '48px serif';
        const smallFont = '30px sans-serif';

        ctx.font = bigFont;
        const bigSquare = ctx.measureText('M').width;
        const bigSquareCenter = bigSquare / 2;
        ctx.font = smallFont;
        const smallSquare = ctx.measureText('M').width;
        const startTxtSize = ctx.measureText('start').width;
        this.counterEle = [
            {
                txt: '-',
                font: bigFont,
                startX: centerX - 100 - bigSquareCenter,
                startY: centerY - bigSquareCenter,
                endX: centerX - 100 - bigSquareCenter + bigSquare,
                endY: centerY - bigSquareCenter + bigSquare,
                txtX: centerX - 100,
                txtY: centerY + bigSquareCenter
            },
            {
                txt: '+',
                font: bigFont,
                startX: centerX + 100 - bigSquareCenter,
                startY: centerY - bigSquareCenter,
                endX: centerX + 100 - bigSquareCenter + bigSquare,
                endY: centerY - bigSquareCenter + bigSquare,
                txtX: centerX + 100,
                txtY: centerY + bigSquareCenter
            },
            {
                txt: 'start',
                font: smallFont,
                startX: centerX - (startTxtSize / 2),
                startY: canvasHeight - smallSquare * 2,
                endX: centerX - (startTxtSize / 2) + startTxtSize,
                endY: canvasHeight - smallSquare,
                txtX: centerX,
                txtY: canvasHeight - smallSquare,
            },
            {
                txt: me.personCount,
                font: bigFont,
                txtX: centerX,
                txtY: centerY + bigSquareCenter
            }
        ];

        me.clearCanvas(); // 캔버스 초기화

        ctx.textAlign = "center";

        ctx.fillStyle = '#000';
        this.counterEle.forEach(ele => {
            ctx.font = ele.font;
            ctx.fillText(ele.txt, ele.txtX, ele.txtY);
        })

        canvas.addEventListener('mousemove', this.mouseMove);
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

        this.counterEle.forEach(ele => {
            if((ele.startX <= x && ele.endX > x) &&
                (ele.startY <= y && ele.endY > y)) {
                ctx.fillStyle = 'red';
                canvas.style = 'cursor: pointer;';
            } else {
                ctx.fillStyle = 'black';
            }
            ctx.font = ele.font;
            ctx.fillText(ele.txt, ele.txtX, ele.txtY);
        })
    }

    mouseClick(e) {

        const me = this.data;
        const ctx = me.ctx;
        const canvas = me.canvas;

        me.rect = canvas.getBoundingClientRect();

        let x = e.clientX - me.rect.left, // 캔버스 내의 hover를 할 타겟 좌표값X
            y = e.clientY - me.rect.top;

        me.clearCanvas(); // 캔버스 초기화

        this.counterEle.some(ele => {
            if((ele.startX <= x && ele.endX > x) &&
                (ele.startY <= y && ele.endY > y)) {
                ctx.fillStyle = 'red';

                if(ele.txt === '+' && me.personCount < me.maxPersonCount) {
                    me.personCount++;
                } else if (ele.txt === '-' && me.personCount > 2) {
                    me.personCount--;
                } else if (ele.txt === 'start') {
                    canvas.style = 'cursor: default;';
                    
                    this.personInfo.draw();

                    canvas.removeEventListener('mousemove', this.mouseMove);
                    canvas.removeEventListener('click', this.mouseClick);

                    return true;
                }
            } else {
                ctx.fillStyle = 'black';
            }
            
            this.counterEle[this.counterEle.length-1].txt = me.personCount;
            ctx.font = ele.font;
            ctx.fillText(ele.txt, ele.txtX, ele.txtY);
        })
    }

}